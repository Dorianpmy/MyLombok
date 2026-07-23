import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("l’application expose une navigation accessible et cohérente", async () => {
  const page = await readFile(new URL("app/page.tsx", root), "utf8");
  assert.match(page, /aria-label="Navigation principale"/);
  assert.match(page, /HomeIcon/);
  assert.match(page, /Compass/);
  assert.match(page, /MessageCircle/);
  assert.match(page, /label: "Conciergerie"/);
  assert.doesNotMatch(page, /label: "Voyage"/);
  assert.match(page, /Mes favoris/);
  assert.match(page, /UserRound/);
});

test("les restaurants et la culture disposent d’un accès cartographique", async () => {
  const [page, seed] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/data/seed-lombok.ts", root), "utf8"),
  ]);
  assert.match(page, /Voir sur la carte/);
  assert.match(page, /place\.maps_url/);
  assert.ok((seed.match(/category: "culture"/g) || []).length >= 6);
});

test("chaque restaurant expose une carte et les sources officielles sont signalées", async () => {
  const [page, places] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/data/places.ts", root), "utf8"),
  ]);
  assert.match(page, /Voir la carte complète/);
  assert.match(page, /Source officielle/);
  assert.match(places, /category === "restaurant" \? \{/);
  assert.ok((places.match(/status: "officiel"/g) || []).length >= 8);
});

test("MyLombok est installable comme application mobile", async () => {
  const [layout, manifest, worker, installer] = await Promise.all([
    readFile(new URL("app/layout.tsx", root), "utf8"),
    readFile(new URL("public/manifest.webmanifest", root), "utf8"),
    readFile(new URL("public/sw.js", root), "utf8"),
    readFile(new URL("app/installer/page.tsx", root), "utf8"),
  ]);
  const parsed = JSON.parse(manifest);
  assert.equal(parsed.display, "standalone");
  assert.ok(parsed.icons.some((icon) => icon.sizes === "512x512"));
  assert.match(layout, /appleWebApp/);
  assert.match(worker, /offline\.html/);
  assert.match(installer, /Sur l’écran d’accueil/);
});

test("le compte voyageur synchronise les données sur plusieurs appareils", async () => {
  const [page, client, packageJson] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/lib/supabase.ts", root), "utf8"),
    readFile(new URL("package.json", root), "utf8"),
  ]);
  assert.match(page, /Créer mon compte gratuit/);
  assert.match(page, /Continuer avec Apple/);
  assert.match(page, /Continuer avec Google/);
  assert.match(page, /user_state/);
  assert.match(client, /NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/);
  assert.equal(JSON.parse(packageJson).scripts.build, "next build");
});
