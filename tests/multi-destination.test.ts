import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import { kualaLumpurPlaces } from "../app/data/kuala-lumpur-places";
import { DEFAULT_DESTINATION_ID } from "../app/data/destinations";
import { buildTripDays, createEmptyTrip } from "../app/lib/repositories/trip-repository";
import { destinationRepository } from "../app/lib/repositories/destination-repository";
import { placeRepository } from "../app/lib/repositories/place-repository";
import { destinationFromPathname, destinationRouteForPath } from "../app/lib/use-active-destination";

const projectRoot = path.resolve(import.meta.dirname, "..");
const read = (relativePath: string) => readFile(path.join(projectRoot, relativePath), "utf8");

async function collectTextFiles(relativePath: string): Promise<string[]> {
  const absolutePath = path.join(projectRoot, relativePath);
  const entries = await readdir(absolutePath, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const child = path.join(relativePath, entry.name);
    if (entry.isDirectory()) return collectTextFiles(child);
    return /\.(?:json|md|mjs|ts|tsx|js|html|css)$/.test(entry.name) ? [child] : [];
  }));
  return files.flat();
}

test("Lombok reste la destination par défaut et Kuala Lumpur active uniquement ses modules réels", () => {
  assert.equal(DEFAULT_DESTINATION_ID, "lombok");
  assert.equal(destinationRepository.getDefault().id, "lombok");
  assert.equal(destinationRepository.resolve("destination-inconnue").id, "lombok");

  const activeDestinations = destinationRepository.list();
  assert.deepEqual(activeDestinations.map((destination) => destination.id), ["lombok", "kuala-lumpur"]);

  const lombok = destinationRepository.getById("lombok");
  const kualaLumpur = destinationRepository.getById("kuala-lumpur");
  assert.ok(lombok && kualaLumpur);
  assert.equal(lombok.enabledModules.concierge, true);
  assert.equal(lombok.enabledModules.expatriation, true);
  assert.equal(kualaLumpur.enabledModules.explore, true);
  assert.equal(kualaLumpur.enabledModules.map, true);
  assert.equal(kualaLumpur.enabledModules.activities, true);
  assert.equal(kualaLumpur.enabledModules.trip, true);
  assert.equal(kualaLumpur.enabledModules.concierge, false);
  assert.equal(kualaLumpur.enabledModules.expatriation, false);
});

test("le sélecteur conserve les anciennes routes Lombok et produit les routes de la destination active", () => {
  assert.equal(destinationFromPathname("/explorer"), "lombok");
  assert.equal(destinationFromPathname("/destination/kuala-lumpur/map"), "kuala-lumpur");
  assert.equal(destinationFromPathname("/destination/inconnue"), null);
  assert.equal(destinationRouteForPath("/explorer", "kuala-lumpur"), "/destination/kuala-lumpur/activities");
  assert.equal(destinationRouteForPath("/destination/kuala-lumpur/activities", "lombok"), "/explorer");
  assert.equal(destinationRouteForPath("/destination/lombok/map", "kuala-lumpur"), "/destination/kuala-lumpur/map");
  assert.equal(destinationRouteForPath("/", "kuala-lumpur"), "/destination/kuala-lumpur");
});

test("le catalogue Kuala Lumpur possède des coordonnées, sources et statuts vérifiables", () => {
  const destination = destinationRepository.getById("kuala-lumpur");
  assert.ok(destination);
  assert.ok(kualaLumpurPlaces.length >= 17, `seulement ${kualaLumpurPlaces.length} lieux Kuala Lumpur`);
  assert.equal(new Set(kualaLumpurPlaces.map((place) => place.id)).size, kualaLumpurPlaces.length);
  assert.equal(new Set(kualaLumpurPlaces.map((place) => place.slug)).size, kualaLumpurPlaces.length);

  const expectedSlugs = [
    "klcc-park",
    "petronas-twin-towers",
    "suria-klcc",
    "aquaria-klcc",
    "saloma-link",
    "merdeka-square",
    "sultan-abdul-samad-building",
    "central-market-kuala-lumpur",
    "petaling-street",
    "masjid-negara",
    "jalan-alor",
    "pavilion-kuala-lumpur",
    "bukit-bintang",
    "thean-hou-temple",
    "islamic-arts-museum-malaysia",
    "kuala-lumpur-tower",
    "perdana-botanical-gardens",
  ];
  assert.ok(expectedSlugs.every((slug) => kualaLumpurPlaces.some((place) => place.slug === slug)));

  const [[minLat, minLng], [maxLat, maxLng]] = destination.bounds;
  for (const place of kualaLumpurPlaces) {
    assert.equal(place.destinationId, "kuala-lumpur");
    assert.ok(place.coordinates.latitude >= minLat && place.coordinates.latitude <= maxLat, `${place.slug}: latitude hors limites`);
    assert.ok(place.coordinates.longitude >= minLng && place.coordinates.longitude <= maxLng, `${place.slug}: longitude hors limites`);
    assert.ok(place.sourceUrls.length >= 2, `${place.slug}: sources insuffisantes`);
    assert.ok(place.sourceUrls.every((url) => /^https:\/\//.test(url)), `${place.slug}: source non HTTPS`);
    assert.match(place.lastVerifiedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.notEqual(place.verificationStatus, "archived");
    assert.match(place.navigationUrl, /^https:\/\//);
    if (place.images[0]) {
      assert.ok(place.images[0].alt.trim(), `${place.slug}: texte alternatif manquant`);
      assert.match(place.images[0].sourceUrl || "", /^https:\/\//, `${place.slug}: provenance d’image manquante`);
    }
    if (place.family && Object.entries(place.family).some(([key, value]) => key !== "indoor" && value === true)) {
      assert.match(place.family.sourceUrl || "", /^https:\/\//, `${place.slug}: attribut famille sans source`);
    }
    if (place.halalStatus === "verified") {
      assert.ok(place.tags.includes("halal-verified"), `${place.slug}: statut halal vérifié incohérent`);
    }
  }

  assert.ok(["family", "food", "market", "mosque", "culture", "shopping", "park", "viewpoint", "neighborhood", "attraction"]
    .every((category) => kualaLumpurPlaces.some((place) => place.category === category)));
});

test("les dépôts isolent les destinations et la recherche reste locale", () => {
  const lombokPlaces = placeRepository.listByDestination("lombok");
  const klPlaces = placeRepository.listByDestination("kuala-lumpur");
  assert.ok(lombokPlaces.length >= 100, "le catalogue historique Lombok ne doit pas régresser");
  assert.equal(klPlaces.length, kualaLumpurPlaces.length);
  assert.ok(lombokPlaces.every((place) => place.destinationId === "lombok"));
  assert.ok(klPlaces.every((place) => place.destinationId === "kuala-lumpur"));
  assert.ok(placeRepository.search("KLCC", "kuala-lumpur").length >= 5);
  assert.ok(placeRepository.search("Bukit Bintang", "kuala-lumpur").length >= 3);
  assert.equal(placeRepository.search("PETRONAS", "lombok").length, 0);
});

test("la carte demande explicitement la position et conserve une alternative en liste", async () => {
  const [explorer, map, globalStyles] = await Promise.all([
    read("app/components/destination-explorer-client.tsx"),
    read("app/components/destination-map.tsx"),
    read("app/globals.css"),
  ]);

  assert.match(explorer, /dynamic\([\s\S]*ssr:\s*false/);
  assert.match(explorer, /Nom, quartier, catégorie ou envie/);
  assert.match(explorer, /Avec bébé/);
  assert.match(explorer, /Halal vérifié/);
  assert.match(explorer, /Près de l’hôtel/);
  assert.match(explorer, /Réinitialiser/);
  assert.match(explorer, /aria-live="polite"/);
  assert.match(map, /aria-label="Alternative en liste à la carte"/);
  assert.match(map, /OpenStreetMap contributors &copy; CARTO/);
  assert.match(map, /function requestLocation\(\)[\s\S]*navigator\.geolocation\.getCurrentPosition/);
  assert.doesNotMatch(map, /useEffect\(\(\) => \{[^}]*navigator\.geolocation/s, "la position ne doit pas être demandée au montage");
  assert.match(map, /Aucun lieu ne correspond aux filtres actuels/);
  assert.match(globalStyles, /prefers-reduced-motion:\s*reduce/);
  assert.match(globalStyles, /:focus-visible/);
});

test("le voyage crée des journées privées modifiables sans préremplissage personnel", () => {
  const empty = createEmptyTrip("kuala-lumpur");
  assert.equal(empty.destinationId, "kuala-lumpur");
  assert.equal(empty.startDate, "");
  assert.equal(empty.endDate, "");
  assert.equal(empty.accommodation, null);
  assert.deepEqual(empty.travelers, { adults: 1, children: 0, baby: false });
  assert.deepEqual(empty.preferences, []);
  assert.deepEqual(empty.excludedPlaceIds, []);
  assert.deepEqual(empty.days, []);

  const existing = [{ date: "2030-01-02", placeIds: ["place:a", "place:a"], notes: { "place:a": "Note privée" } }];
  const days = buildTripDays("2030-01-01", "2030-01-03", existing);
  assert.deepEqual(days.map((day) => day.date), ["2030-01-01", "2030-01-02", "2030-01-03"]);
  assert.deepEqual(days[1].placeIds, ["place:a"]);
  assert.equal(days[1].notes["place:a"], "Note privée");
  assert.deepEqual(buildTripDays("2030-02-02", "2030-02-01"), [
    { date: "2030-02-02", placeIds: [], notes: {} },
  ]);
  assert.equal(buildTripDays("2030-01-01", "2031-01-01").length, 90, "la durée stockée doit être bornée");
});

test("les routes historiques et multi-destination restent présentes avec une 404 explicite", async () => {
  const routeFiles = [
    "app/page.tsx",
    "app/explorer/page.tsx",
    "app/conciergerie/page.tsx",
    "app/profil/page.tsx",
    "app/destinations/page.tsx",
    "app/destination/[destination]/page.tsx",
    "app/destination/[destination]/activities/page.tsx",
    "app/destination/[destination]/map/page.tsx",
    "app/destination/kuala-lumpur/transport/page.tsx",
    "app/activity/[slug]/page.tsx",
    "app/trip/page.tsx",
    "app/saved/page.tsx",
  ];
  await Promise.all(routeFiles.map((file) => access(path.join(projectRoot, file))));
  const dynamicRoutes = await Promise.all([
    read("app/destination/[destination]/page.tsx"),
    read("app/destination/[destination]/activities/page.tsx"),
    read("app/destination/[destination]/map/page.tsx"),
  ]);
  for (const route of dynamicRoutes) {
    assert.match(route, /generateStaticParams/);
    assert.match(route, /notFound\(\)/);
  }

  const card = await read("app/components/travel-place-card.tsx");
  assert.match(card, /href=\{`\/activity\/\$\{place\.slug\}`\}/);

  const [activity, activityActions] = await Promise.all([
    read("app/activity/[slug]/page.tsx"),
    read("app/components/activity-actions.tsx"),
  ]);
  assert.match(activity, /generateStaticParams/);
  assert.match(activity, /notFound\(\)/);
  assert.match(activity, /Dernière vérification éditoriale/);
  assert.match(activity, /place\.sourceUrls/);
  assert.match(activity, /place\.navigationUrl/);
  assert.match(activityActions, /favoritesRepository\.toggle/);
  assert.match(activityActions, /tripRepository\.save/);
  assert.match(activityActions, /aria-pressed=\{isFavorite\}/);
});

test("aucune donnée du voyage personnel n’est publiée ou suivie par Git", async () => {
  const [ignore, example, tripRepositorySource, worker] = await Promise.all([
    read(".gitignore"),
    read("data/private-trip.example.json"),
    read("app/lib/repositories/trip-repository.ts"),
    read("public/sw.js"),
  ]);
  const parsedExample = JSON.parse(example);
  assert.match(ignore, /data\/\*\.local\.json/);
  assert.equal(parsedExample.startDate, "");
  assert.equal(parsedExample.endDate, "");
  assert.equal(parsedExample.accommodation, null);
  assert.deepEqual(parsedExample.preferences, []);
  assert.deepEqual(parsedExample.excludedPlaceIds, []);
  assert.deepEqual(parsedExample.days, []);
  assert.match(tripRepositorySource, /auth\.getUser\(\)/);
  assert.match(tripRepositorySource, /from\("user_state"\)/);
  assert.doesNotMatch(tripRepositorySource, /service_role|SERVICE_ROLE/);
  assert.match(worker, /PRIVATE_PATHS[^\n]*(?:"\/trip"[\s\S]*"\/saved"|"\/saved"[\s\S]*"\/trip")/);

  const publicPaths = ["app", "data", "docs", "public"];
  const files = (await Promise.all(publicPaths.map(collectTextFiles))).flat();
  const publicSource = (await Promise.all(files.map(read))).join("\n");
  const privateHotel = ["188", " Suites", " KLCC"].join("");
  const privateDates = [["2026", "-10", "-16"].join(""), ["2026", "-10", "-19"].join("")];
  assert.equal(publicSource.includes(privateHotel), false, "le nom de l’hébergement privé a été publié");
  assert.ok(privateDates.every((date) => !publicSource.includes(date)), "des dates personnelles ont été publiées");
});
