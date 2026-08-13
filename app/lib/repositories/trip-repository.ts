import type { DestinationId, PrivateTrip, TravelPlaceTag, TripDay } from "../../data/destination-types";
import { destinationRepository } from "./destination-repository";
import { activeLocalUserId, setActiveLocalUserId } from "../local-state";
import { getSupabaseBrowserClient } from "../supabase";

const TRIP_STORAGE_KEY = "my-lombok-private-trip";
const TRIP_EVENT = "mylombok:trip-changed";
const MAX_TRIP_DAYS = 90;

export type TripSnapshot = {
  trip: PrivateTrip;
  userId: string | null;
  cloudAvailable: boolean;
  cloudSynced: boolean;
};

const allowedPreferenceTags = new Set<TravelPlaceTag>([
  "family-friendly",
  "baby-friendly",
  "stroller-friendly",
  "indoor",
  "outdoor",
  "rain-friendly",
  "halal-verified",
  "prayer-room",
  "evening",
  "short-visit",
]);

function storageKey(userId: string | null) {
  return `${TRIP_STORAGE_KEY}:${userId ? `user:${userId}` : "guest"}`;
}

function isoDay(value: unknown): string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return "";
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value ? "" : value;
}

function safeString(value: unknown, maxLength = 180): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function safeDateRange(startDate: string, endDate: string): { startDate: string; endDate: string } {
  const start = isoDay(startDate);
  const end = isoDay(endDate);
  if (!start || !end || end < start) return { startDate: start, endDate: start || "" };
  return { startDate: start, endDate: end };
}

export function createEmptyTrip(destinationId: DestinationId = destinationRepository.getDefault().id): PrivateTrip {
  return {
    version: 1,
    destinationId,
    startDate: "",
    endDate: "",
    accommodation: null,
    travelers: { adults: 1, children: 0, baby: false },
    preferences: [],
    excludedPlaceIds: [],
    days: [],
    updatedAt: new Date(0).toISOString(),
  };
}

export function buildTripDays(startDate: string, endDate: string, existingDays: TripDay[] = []): TripDay[] {
  const range = safeDateRange(startDate, endDate);
  if (!range.startDate || !range.endDate) return [];
  const existing = new Map(existingDays.map((day) => [day.date, day]));
  const cursor = new Date(`${range.startDate}T00:00:00Z`);
  const end = new Date(`${range.endDate}T00:00:00Z`);
  const days: TripDay[] = [];

  while (cursor <= end && days.length < MAX_TRIP_DAYS) {
    const date = cursor.toISOString().slice(0, 10);
    const previous = existing.get(date);
    days.push(previous ? {
      date,
      placeIds: Array.from(new Set(previous.placeIds.filter((id) => typeof id === "string"))),
      notes: Object.fromEntries(Object.entries(previous.notes || {}).filter(([id, note]) => typeof id === "string" && typeof note === "string")),
    } : { date, placeIds: [], notes: {} });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return days;
}

function sanitizeTrip(value: unknown, fallbackDestination: DestinationId = destinationRepository.getDefault().id): PrivateTrip | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Partial<PrivateTrip>;
  const destination = typeof raw.destinationId === "string" && destinationRepository.isEnabled(raw.destinationId)
    ? raw.destinationId
    : fallbackDestination;
  const range = safeDateRange(raw.startDate || "", raw.endDate || "");
  const rawTravelers = raw.travelers && typeof raw.travelers === "object" ? raw.travelers : { adults: 1, children: 0, baby: false };
  const adults = Math.min(12, Math.max(1, Math.trunc(Number(rawTravelers.adults) || 1)));
  const children = Math.min(12, Math.max(0, Math.trunc(Number(rawTravelers.children) || 0)));
  const accommodation = raw.accommodation && typeof raw.accommodation === "object" && safeString(raw.accommodation.name)
    ? {
        name: safeString(raw.accommodation.name, 120),
        ...(safeString(raw.accommodation.address, 220) ? { address: safeString(raw.accommodation.address, 220) } : {}),
        ...(raw.accommodation.coordinates && Number.isFinite(raw.accommodation.coordinates.latitude) && Number.isFinite(raw.accommodation.coordinates.longitude)
          ? { coordinates: { latitude: raw.accommodation.coordinates.latitude, longitude: raw.accommodation.coordinates.longitude } }
          : {}),
      }
    : null;
  const preferences = Array.isArray(raw.preferences)
    ? Array.from(new Set(raw.preferences.filter((tag): tag is TravelPlaceTag => typeof tag === "string" && allowedPreferenceTags.has(tag as TravelPlaceTag))))
    : [];
  const excludedPlaceIds = Array.isArray(raw.excludedPlaceIds)
    ? Array.from(new Set(raw.excludedPlaceIds.filter((id): id is string => typeof id === "string" && id.length > 0)))
    : [];
  const candidateDays = Array.isArray(raw.days) ? raw.days.filter((day): day is TripDay => Boolean(day && typeof day === "object" && isoDay(day.date))) : [];
  const days = buildTripDays(range.startDate, range.endDate, candidateDays);
  const updatedAt = typeof raw.updatedAt === "string" && !Number.isNaN(Date.parse(raw.updatedAt)) ? raw.updatedAt : new Date(0).toISOString();

  return {
    version: 1,
    destinationId: destination,
    startDate: range.startDate,
    endDate: range.endDate,
    accommodation,
    travelers: { adults, children, baby: Boolean(rawTravelers.baby) },
    preferences,
    excludedPlaceIds,
    days,
    updatedAt,
  };
}

function readLocalTrip(userId: string | null): PrivateTrip | null {
  if (typeof window === "undefined") return null;
  try {
    return sanitizeTrip(JSON.parse(localStorage.getItem(storageKey(userId)) || "null"));
  } catch {
    return null;
  }
}

function writeLocalTrip(trip: PrivateTrip, userId: string | null) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(trip));
    window.dispatchEvent(new CustomEvent(TRIP_EVENT, { detail: { trip, userId } }));
  } catch {
    // Le voyage reste en mémoire si le stockage privé est bloqué.
  }
}

async function resolveUserId(): Promise<{ userId: string | null; cloudAvailable: boolean }> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return { userId: activeLocalUserId(), cloudAvailable: false };
  try {
    const { data, error } = await supabase.auth.getUser();
    if (!error && data.user) {
      setActiveLocalUserId(data.user.id);
      return { userId: data.user.id, cloudAvailable: true };
    }
    if (!data.user) setActiveLocalUserId(null);
  } catch {
    // En cas de panne, on conserve l’identité locale déjà vérifiée.
  }
  return { userId: activeLocalUserId(), cloudAvailable: true };
}

function newerTrip(localTrip: PrivateTrip | null, cloudTrip: PrivateTrip | null): PrivateTrip {
  if (!localTrip) return cloudTrip ?? createEmptyTrip();
  if (!cloudTrip) return localTrip;
  return Date.parse(localTrip.updatedAt) >= Date.parse(cloudTrip.updatedAt) ? localTrip : cloudTrip;
}

async function writeCloudTrip(userId: string, trip: PrivateTrip): Promise<boolean> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return false;
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || authData.user?.id !== userId) return false;
    const { data, error: readError } = await supabase.from("user_state").select("preferences").eq("user_id", userId).maybeSingle();
    if (readError) return false;
    const currentPreferences = data?.preferences && typeof data.preferences === "object" && !Array.isArray(data.preferences)
      ? data.preferences as Record<string, unknown>
      : {};
    const { error } = await supabase.from("user_state").upsert({
      user_id: userId,
      preferences: { ...currentPreferences, trip },
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}

export const tripRepository = {
  eventName: TRIP_EVENT,

  async load(): Promise<TripSnapshot> {
    const identity = await resolveUserId();
    const localTrip = readLocalTrip(identity.userId);
    if (!identity.userId || !identity.cloudAvailable) {
      return { trip: localTrip ?? createEmptyTrip(), ...identity, cloudSynced: false };
    }
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return { trip: localTrip ?? createEmptyTrip(), userId: identity.userId, cloudAvailable: false, cloudSynced: false };

    try {
      const { data, error } = await supabase.from("user_state").select("preferences").eq("user_id", identity.userId).maybeSingle();
      if (error) return { trip: localTrip ?? createEmptyTrip(), ...identity, cloudSynced: false };
      const rawPreferences = data?.preferences && typeof data.preferences === "object" && !Array.isArray(data.preferences)
        ? data.preferences as Record<string, unknown>
        : {};
      const cloudTrip = sanitizeTrip(rawPreferences.trip);
      const trip = newerTrip(localTrip, cloudTrip);
      writeLocalTrip(trip, identity.userId);
      const cloudSynced = cloudTrip?.updatedAt === trip.updatedAt || await writeCloudTrip(identity.userId, trip);
      return { trip, ...identity, cloudSynced };
    } catch {
      return { trip: localTrip ?? createEmptyTrip(), ...identity, cloudSynced: false };
    }
  },

  async save(value: PrivateTrip, expectedUserId?: string | null): Promise<TripSnapshot> {
    const sanitized = sanitizeTrip({ ...value, updatedAt: new Date().toISOString() }, value.destinationId) ?? createEmptyTrip(value.destinationId);
    const identity = expectedUserId === undefined ? await resolveUserId() : {
      userId: expectedUserId,
      cloudAvailable: Boolean(getSupabaseBrowserClient()),
    };
    writeLocalTrip(sanitized, identity.userId);
    const cloudSynced = Boolean(identity.userId && identity.cloudAvailable && await writeCloudTrip(identity.userId, sanitized));
    return { trip: sanitized, ...identity, cloudSynced };
  },

  async clear(expectedUserId?: string | null): Promise<TripSnapshot> {
    const identity = expectedUserId === undefined ? await resolveUserId() : {
      userId: expectedUserId,
      cloudAvailable: Boolean(getSupabaseBrowserClient()),
    };
    const trip = createEmptyTrip();
    if (typeof window !== "undefined") {
      try { localStorage.removeItem(storageKey(identity.userId)); } catch { /* stockage bloqué */ }
      window.dispatchEvent(new CustomEvent(TRIP_EVENT, { detail: { trip, userId: identity.userId } }));
    }
    const cloudSynced = Boolean(identity.userId && identity.cloudAvailable && await writeCloudTrip(identity.userId, trip));
    return { trip, ...identity, cloudSynced };
  },
};
