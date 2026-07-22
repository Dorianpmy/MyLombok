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
