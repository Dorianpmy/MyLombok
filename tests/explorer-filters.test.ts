import test from "node:test";
import assert from "node:assert/strict";
import { getDistanceOrigin, isOpenAtLombokTime, normalizeCategory, withinOptionalRadius } from "../app/lib/explorer-filters";

test("la distance ne filtre pas tant que le rayon est désactivé", () => {
  assert.equal(withinOptionalRadius(12_000, false, 20), true);
  assert.equal(getDistanceOrigin({ lat: 48.8566, lng: 2.3522 }).usingReference, true);
});

test("les libellés de catégories sont normalisés vers les clés du seed", () => {
  assert.equal(normalizeCategory("Restaurants"), "restaurant");
  assert.equal(normalizeCategory("Îles"), "excursion");
  assert.equal(normalizeCategory("PLAGES"), "plage");
});

test("ouvert maintenant utilise WITA et conserve les horaires inconnus", () => {
  const noonWita = new Date("2026-07-22T04:00:00.000Z");
  assert.equal(isOpenAtLombokTime("11:00–22:00", noonWita), true);
  assert.equal(isOpenAtLombokTime("17:00–22:00", noonWita), false);
  assert.equal(isOpenAtLombokTime(null, noonWita), true);
});
