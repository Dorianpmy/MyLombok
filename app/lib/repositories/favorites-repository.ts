import { activeLocalUserId, readPersonalArray, setActiveLocalUserId, writePersonalArray } from "../local-state";
import { getSupabaseBrowserClient } from "../supabase";

const FAVORITES_EVENT = "mylombok:favorites-changed";

export type FavoritesSnapshot = {
  ids: string[];
  userId: string | null;
  cloudAvailable: boolean;
  cloudSynced: boolean;
};

function normalizeFavoriteIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.filter((id): id is string => typeof id === "string" && id.trim().length > 0).map((id) => id.trim())));
}

function notifyFavorites(ids: string[], userId: string | null) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(FAVORITES_EVENT, { detail: { ids, userId } }));
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
    // Une panne réseau ne doit pas rendre les favoris locaux indisponibles.
  }

  return { userId: activeLocalUserId(), cloudAvailable: true };
}

export const favoritesRepository = {
  eventName: FAVORITES_EVENT,

  async load(): Promise<FavoritesSnapshot> {
    const { userId, cloudAvailable } = await resolveUserId();
    const localIds = normalizeFavoriteIds(readPersonalArray<string>("my-lombok-favorites", userId));
    if (!userId || !cloudAvailable) {
      return { ids: localIds, userId, cloudAvailable, cloudSynced: false };
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return { ids: localIds, userId, cloudAvailable: false, cloudSynced: false };

    try {
      const { data, error } = await supabase.from("user_state").select("favorites").eq("user_id", userId).maybeSingle();
      if (error) return { ids: localIds, userId, cloudAvailable: true, cloudSynced: false };

      const cloudIds = normalizeFavoriteIds(data?.favorites);
      const ids = Array.from(new Set([...cloudIds, ...localIds]));
      writePersonalArray("my-lombok-favorites", ids, userId);

      if (!data || ids.length !== cloudIds.length) {
        const { error: syncError } = await supabase
          .from("user_state")
          .upsert({ user_id: userId, favorites: ids, updated_at: new Date().toISOString() });
        return { ids, userId, cloudAvailable: true, cloudSynced: !syncError };
      }

      return { ids, userId, cloudAvailable: true, cloudSynced: true };
    } catch {
      return { ids: localIds, userId, cloudAvailable: true, cloudSynced: false };
    }
  },

  async save(ids: string[], expectedUserId?: string | null): Promise<FavoritesSnapshot> {
    const normalized = normalizeFavoriteIds(ids);
    const identity = expectedUserId === undefined ? await resolveUserId() : {
      userId: expectedUserId,
      cloudAvailable: Boolean(getSupabaseBrowserClient()),
    };

    writePersonalArray("my-lombok-favorites", normalized, identity.userId);
    notifyFavorites(normalized, identity.userId);

    if (!identity.userId || !identity.cloudAvailable) {
      return { ids: normalized, ...identity, cloudSynced: false };
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return { ids: normalized, userId: identity.userId, cloudAvailable: false, cloudSynced: false };

    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || authData.user?.id !== identity.userId) {
        return { ids: normalized, ...identity, cloudSynced: false };
      }
      const { error } = await supabase
        .from("user_state")
        .upsert({ user_id: identity.userId, favorites: normalized, updated_at: new Date().toISOString() });
      return { ids: normalized, ...identity, cloudSynced: !error };
    } catch {
      return { ids: normalized, ...identity, cloudSynced: false };
    }
  },

  async toggle(id: string, currentIds: string[], expectedUserId?: string | null): Promise<FavoritesSnapshot> {
    const ids = currentIds.includes(id) ? currentIds.filter((favoriteId) => favoriteId !== id) : [...currentIds, id];
    return this.save(ids, expectedUserId);
  },
};
