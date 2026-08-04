const CACHE_PREFIX = "mylombok-static-";
const CACHE = `${CACHE_PREFIX}v3`;
const OFFLINE_PAGE = "/offline.html";
const PRECACHE = [
  OFFLINE_PAGE,
  "/manifest.webmanifest",
  "/mylombok-logo.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/fonts/cormorant-garamond-600.ttf",
  "/fonts/manrope-400.ttf",
  "/fonts/manrope-600.ttf",
  "/fonts/manrope-700.ttf",
];
const STATIC_PATHS = new Set(PRECACHE);
const PRIVATE_PATHS = ["/api", "/auth", "/profil"];

function pathMatches(pathname, prefix) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function isPrivateRequest(request, url) {
  return PRIVATE_PATHS.some((prefix) => pathMatches(url.pathname, prefix)) ||
    request.headers.has("authorization") ||
    /(?:^|,)\s*(?:no-store|private)\b/i.test(request.headers.get("cache-control") || "");
}

function isStaticAsset(url) {
  return STATIC_PATHS.has(url.pathname) ||
    pathMatches(url.pathname, "/_next/static") ||
    pathMatches(url.pathname, "/fonts") ||
    pathMatches(url.pathname, "/icons");
}

function canCache(response) {
  if (!response || !response.ok || response.type === "opaque") return false;
  return !/(?:^|,)\s*(?:no-store|private)\b/i.test(response.headers.get("cache-control") || "");
}

async function staticResponse(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (canCache(response)) {
    const cache = await caches.open(CACHE);
    await cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((key) => key.startsWith("mylombok-") && key !== CACHE)
        .map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || isPrivateRequest(request, url)) return;

  // Les pages restent toujours réseau-first et ne sont jamais écrites dans le cache.
  // Cela empêche qu'un écran personnalisé soit servi à un autre compte sur l'appareil.
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_PAGE)));
    return;
  }

  // Seuls les fichiers publics et immuables de l'application sont conservés hors ligne.
  if (isStaticAsset(url)) event.respondWith(staticResponse(request));
});
