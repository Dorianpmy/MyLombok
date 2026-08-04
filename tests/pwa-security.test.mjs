import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const root = new URL("../", import.meta.url);

async function workerHarness() {
  const worker = await readFile(new URL("public/sw.js", root), "utf8");
  const listeners = {};
  const cacheWrites = [];
  let networkResponse = new Response("network", { status: 200 });
  const cache = {
    addAll: async () => undefined,
    put: async (request) => { cacheWrites.push(request.url); },
  };
  const context = {
    URL,
    caches: {
      match: async (request) => typeof request === "string" && request === "/offline.html" ? new Response("offline") : undefined,
      open: async () => cache,
      keys: async () => [],
      delete: async () => true,
    },
    fetch: async () => networkResponse.clone(),
    self: {
      location: { origin: "https://my-lombok.test" },
      clients: { claim: async () => undefined },
      skipWaiting: async () => undefined,
      addEventListener: (type, listener) => { listeners[type] = listener; },
    },
  };
  vm.runInNewContext(worker, context);
  return {
    cacheWrites,
    dispatch(request) {
      let responsePromise;
      listeners.fetch({ request, respondWith: (response) => { responsePromise = Promise.resolve(response); } });
      return responsePromise;
    },
    failNetwork() { context.fetch = async () => { throw new Error("offline"); }; },
  };
}

test("le service worker ne conserve ni API ni page personnalisée", async () => {
  const harness = await workerHarness();
  const apiResponse = harness.dispatch({ method: "GET", mode: "cors", url: "https://my-lombok.test/api/favorites", headers: new Headers() });
  assert.equal(apiResponse, undefined, "une API doit rester entièrement hors du cache du service worker");

  const navigation = await harness.dispatch({ method: "GET", mode: "navigate", url: "https://my-lombok.test/explorer", headers: new Headers() });
  assert.equal(await navigation.text(), "network");
  assert.deepEqual(harness.cacheWrites, []);

  harness.failNetwork();
  const offline = await harness.dispatch({ method: "GET", mode: "navigate", url: "https://my-lombok.test/explorer", headers: new Headers() });
  assert.equal(await offline.text(), "offline");
});

test("le service worker conserve encore les assets publics immuables", async () => {
  const harness = await workerHarness();
  const response = await harness.dispatch({ method: "GET", mode: "cors", url: "https://my-lombok.test/_next/static/chunks/app.js", headers: new Headers() });

  assert.equal(await response.text(), "network");
  assert.deepEqual(harness.cacheWrites, ["https://my-lombok.test/_next/static/chunks/app.js"]);
});

test("la CSP autorise uniquement les services nécessaires à MyLombok", async () => {
  const config = JSON.parse(await readFile(new URL("vercel.json", root), "utf8"));
  const globalHeaders = config.headers.find((entry) => entry.source === "/(.*)")?.headers || [];
  const csp = globalHeaders.find((header) => header.key === "Content-Security-Policy")?.value || "";

  assert.match(csp, /object-src 'none'/);
  assert.match(csp, /frame-ancestors 'none'/);
  assert.match(csp, /https:\/\/byyudzhpcatcdqtxxqxl\.supabase\.co/);
  assert.match(csp, /wss:\/\/byyudzhpcatcdqtxxqxl\.supabase\.co/);
  assert.doesNotMatch(csp, /https:\/\/\*\.supabase\.co/);
  assert.match(csp, /https:\/\/api\.open-meteo\.com/);
  assert.match(csp, /https:\/\/api\.frankfurter\.dev/);
  assert.match(csp, /https:\/\/\*\.basemaps\.cartocdn\.com/);
  assert.match(csp, /https:\/\/images\.unsplash\.com/);
  assert.doesNotMatch(csp, /default-src \*/);
});

test("la page hors connexion est restaurée et ne promet pas de contenu privé en cache", async () => {
  const offline = await readFile(new URL("public/offline.html", root), "utf8");
  assert.match(offline, /Lombok vous attend/);
  assert.match(offline, /données privées ne sont pas conservées/);
  assert.match(offline, /href="\/"/);
});
