export type PersonalStateKey = "my-lombok-favorites" | "my-lombok-visited" | "my-lombok-requests";

const ACTIVE_USER_KEY = "my-lombok-active-user";

export function personalStorageKey(key: PersonalStateKey, userId: string | null) {
  return `${key}:${userId ? `user:${userId}` : "guest"}`;
}

export function activeLocalUserId() {
  if (typeof window === "undefined") return null;
  try { return localStorage.getItem(ACTIVE_USER_KEY); } catch { return null; }
}

export function setActiveLocalUserId(userId: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (userId) localStorage.setItem(ACTIVE_USER_KEY, userId);
    else localStorage.removeItem(ACTIVE_USER_KEY);
  } catch {
    // Le carnet reste utilisable en mémoire si le stockage privé est bloqué.
  }
}

function migrateLegacyGuestValue(key: PersonalStateKey, target: string) {
  if (localStorage.getItem(target) !== null) return;
  const legacy = localStorage.getItem(key);
  if (legacy === null) return;
  localStorage.setItem(target, legacy);
  localStorage.removeItem(key);
}

export function readPersonalArray<T>(key: PersonalStateKey, userId: string | null): T[] {
  if (typeof window === "undefined") return [];
  try {
    const target = personalStorageKey(key, userId);
    if (!userId) migrateLegacyGuestValue(key, target);
    const value = JSON.parse(localStorage.getItem(target) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function writePersonalArray<T>(key: PersonalStateKey, value: T[], userId: string | null) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(personalStorageKey(key, userId), JSON.stringify(value)); } catch {
    // Le carnet reste utilisable en mémoire si le stockage privé est bloqué.
  }
}

export function clearPersonalState(userId: string | null) {
  if (typeof window === "undefined") return;
  try {
    for (const key of ["my-lombok-favorites", "my-lombok-visited", "my-lombok-requests"] as const) {
      localStorage.removeItem(personalStorageKey(key, userId));
    }
  } catch {
    // Le blocage du stockage ne doit pas bloquer les contrôles de données.
  }
}
