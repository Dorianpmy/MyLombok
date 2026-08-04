import { distanceKm, type PlaceCategory } from "../data/places";

export const KUTA_REFERENCE = { lat: -8.8947, lng: 116.2832 } as const;

const categoryAliases: Record<string, PlaceCategory> = {
  activite: "activite", activites: "activite", activité: "activite", activités: "activite",
  restaurant: "restaurant", restaurants: "restaurant",
  plage: "plage", plages: "plage",
  service: "service", services: "service",
  nature: "nature",
  culture: "culture",
  excursion: "excursion", excursions: "excursion", îles: "excursion", iles: "excursion",
};

export function normalizeCategory(value: string): PlaceCategory | null {
  return categoryAliases[value.trim().toLocaleLowerCase("fr-FR")] || null;
}

export function getDistanceOrigin(position: { lat: number; lng: number } | null) {
  if (!position || distanceKm(position, KUTA_REFERENCE) > 100) return { position: KUTA_REFERENCE, usingReference: true };
  return { position, usingReference: false };
}

export function withinOptionalRadius(distance: number, radiusEnabled: boolean, radiusKm: number) {
  return !radiusEnabled || distance <= radiusKm;
}

export function isOpenAtLombokTime(openingHours: string | null, date = new Date()) {
  if (!openingHours) return false;
  if (openingHours.toLowerCase().includes("24h")) return true;
  const match = openingHours.match(/(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})/);
  if (!match) return false;
  const parts = new Intl.DateTimeFormat("fr-FR", { timeZone: "Asia/Makassar", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(date);
  const nowMinutes = Number(parts.find((part) => part.type === "hour")?.value) * 60 + Number(parts.find((part) => part.type === "minute")?.value);
  const opens = Number(match[1]) * 60 + Number(match[2]);
  const closes = Number(match[3]) * 60 + Number(match[4]);
  return closes >= opens ? nowMinutes >= opens && nowMinutes <= closes : nowMinutes >= opens || nowMinutes <= closes;
}
