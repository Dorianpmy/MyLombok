import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

import { placeMediaSubjectById, placePhotoOverrideById, semanticPhotoAlt, semanticPhotoForPlace } from "../app/data/place-media.ts";
import { places } from "../app/data/places.ts";
import seedPlaces from "../app/data/seed-lombok.ts";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

function includesEvery(source, values, label) {
  for (const value of values) {
    assert.ok(source.includes(value), `${label} doit contenir ${value}`);
  }
}

test("les parcours principaux disposent de routes dédiées et d’une navigation accessible", async () => {
  const routeFiles = [
    "app/page.tsx",
    "app/explorer/page.tsx",
    "app/conciergerie/page.tsx",
    "app/profil/page.tsx",
    "app/services/page.tsx",
    "app/a-propos/page.tsx",
    "app/confidentialite/page.tsx",
    "app/mentions-legales/page.tsx",
  ];
  const [layout, header, navigation, ...routes] = await Promise.all([
    read("app/layout.tsx"),
    read("app/components/site-header.tsx"),
    read("app/components/app-navigation.tsx"),
    ...routeFiles.map(read),
  ]);

  includesEvery(layout, ["<SiteHeader />", "<SiteFooter />", "<AppNavigation />"], "le layout partagé");
  includesEvery(header, ['aria-label="Navigation principale"', 'href: "/explorer"', 'href="/conciergerie"'], "l’en-tête");
  includesEvery(navigation, ['href: "/"', 'href: "/explorer"', 'href: "/conciergerie"', 'href: "/profil"', 'aria-current={current ? "page"'], "la navigation mobile");
  assert.doesNotMatch(navigation, /label:\s*["']Voyage["']/);

  for (const [index, source] of routes.entries()) {
    assert.match(source, /export (const metadata|default function|default async function)/, `${routeFiles[index]} doit exposer une page Next.js`);
    assert.match(source, /<main\b/, `${routeFiles[index]} doit fournir une zone principale`);
  }
});

test("Explorer conserve recherche, filtres, carte et fiches accessibles", async () => {
  const [route, explorer, map, dialog, placeData] = await Promise.all([
    read("app/explorer/page.tsx"),
    read("app/components/explorer-client.tsx"),
    read("app/components/explorer-map.tsx"),
    read("app/components/use-dialog-a11y.ts"),
    read("app/data/places.ts"),
  ]);

  includesEvery(route, ["ExplorerClient", "searchParams", "initialCategory"], "la route Explorer");
  includesEvery(explorer, [
    "Un lieu, une zone, une envie…",
    'aria-label="Filtres de recherche"',
    'aria-live="polite"',
    'aria-label="Vue liste"',
    'aria-label="Vue carte"',
    'role="dialog"',
    'aria-modal="true"',
    "useDialogA11y",
    "ExplorerMap",
    "GlobeExplorer",
    "MosquePrayerSchedule",
    "Mosquées recensées",
    "Annuaire officiel SIMAS",
    "Politique d’intégration MAWAQIT",
    "place.maps_url",
    "Prix à confirmer",
    "onAuthStateChange",
    "identityVerificationPending.current",
    "data.user?.id !== expectedUserId",
  ], "Explorer");
  includesEvery(placeData, ['activite: { label: "Activités"'], "les catégories Explorer");
  assert.doesNotMatch(explorer, /auth\.getSession\(/, "Explorer doit vérifier l’identité distante avant d’ouvrir un carnet local");
  assert.match(explorer, /aria-label=\{\s*favorite\s*\?\s*`Retirer \$\{place\.name\} des favoris`\s*:\s*`Ajouter \$\{place\.name\} aux favoris`\s*\}/s);
  assert.match(map, /L\.map|leaflet/i);
  includesEvery(dialog, ["Escape", "const previous = document.activeElement", "focusable", 'event.key !== "Tab"', "previous?.focus()"], "la gestion des dialogues");
});

test("le catalogue est diversifié, sans doublon ni affirmation éditoriale fabriquée", () => {
  const ids = places.map((place) => place.id);
  assert.ok(places.length >= 100, `le catalogue ne contient que ${places.length} lieux`);
  assert.equal(new Set(ids).size, places.length, "chaque lieu doit avoir un identifiant unique");

  for (const category of ["activite", "restaurant", "plage", "service", "nature", "excursion", "culture"]) {
    assert.ok(places.some((place) => place.category === category), `la catégorie ${category} ne doit pas être vide`);
  }
  for (const place of places) {
    assert.ok(Number.isFinite(place.lat) && place.lat >= -9.1 && place.lat <= -8.2, `${place.id} a une latitude incohérente`);
    assert.ok(Number.isFinite(place.lng) && place.lng >= 115.8 && place.lng <= 116.8, `${place.id} a une longitude incohérente`);
    assert.match(place.maps_url, /^https:\/\//, `${place.id} doit pointer vers une carte HTTPS`);
    assert.ok(place.photos.length > 0, `${place.id} doit avoir un visuel de repli`);
  }
  assert.ok(places.filter((place) => place.category === "restaurant").every((place) => place.menu), "chaque restaurant doit proposer une source de carte ou signaler qu’elle est à confirmer");
  const activities = places.filter((place) => place.category === "activite");
  assert.ok(activities.length >= 10, "les activités réservables doivent former une catégorie explicite");
  assert.ok(!activities.some((place) => ["la-cabana", "warung-ombak", "piccolo", "golden-medical", "lasingan-laundry", "mawun-beach"].includes(place.id)), "les anciennes collisions de sous-chaînes ne doivent pas réapparaître");
  assert.ok(["mandalika-beach-club", "lmbk-surf-house", "heartbeach-surf", "rinjani-trek"].every((id) => activities.some((place) => place.id === id)), "les expériences réservables doivent rester dans Activités");
  const seedActivityIds = ["mandalika-beach-club", "kuta-lombok-surf-school", "heartbeach-surf", "surf-cult", "paradise-surfschool", "surf-camp-lombok", "lmbk-surf-house"];
  assert.ok(seedActivityIds.every((id) => seedPlaces.some((place) => place.id === id && place.category === "activite")), "le seed doit conserver le classement Activités à la source");
  const baleoli = places.find((place) => place.id === "baleoli-beach");
  assert.ok(baleoli, "Baléoli Beach doit figurer dans le catalogue");
  assert.equal(baleoli.category, "restaurant");
  assert.equal(baleoli.city, "Batu Layar");
  assert.match(baleoli.maps_url, /Bal%C3%A9oli%20Beach/);

  const mataramPlaces = places.filter((place) => place.city === "Mataram");
  assert.ok(mataramPlaces.length >= 25, `Mataram ne contient que ${mataramPlaces.length} lieux`);
  assert.ok(
    ["lombok-epicentrum-mall", "mataram-mall", "timezone-lombok-epicentrum", "rua-rasa-immersive-edupark", "museum-negeri-ntb", "sate-rembiga-ibu-sinnaseh"].every((id) => mataramPlaces.some((place) => place.id === id)),
    "les principaux repères, loisirs et restaurants de Mataram doivent rester présents",
  );
  assert.ok(
    mataramPlaces.filter((place) => place.created_at.startsWith("2026-08-05")).every((place) => place.sources?.length >= 2),
    "les nouvelles fiches de Mataram doivent exposer leurs sources",
  );

  const mosquePlaces = places.filter((place) => place.subcategory === "mosquée");
  assert.ok(mosquePlaces.length >= 10, "les principales zones de Lombok doivent avoir des mosquées repérées");
  assert.ok(mosquePlaces.every((place) => place.prayer_area && place.sources?.length && place.mawaqit_uuid === null), "chaque mosquée doit avoir une zone de calcul et une provenance, sans faux identifiant MAWAQIT");
  assert.ok(["Mataram", "Kuta", "Praya", "Selong", "Masbagik", "Pemenang", "Gili Trawangan", "Bayan"].every((city) => mosquePlaces.some((place) => place.city === city)), "l’annuaire des mosquées doit couvrir les principales zones de l’île");

  // Ces champs restent neutres tant qu’aucune provenance vérifiable n’est encodée.
  assert.equal(places.filter((place) => place.tested_by_us).length, 0, "aucun lieu ne doit être présenté comme testé sans preuve");
  assert.equal(places.filter((place) => place.halal !== "inconnu").length, 0, "aucun statut halal ne doit être déduit d’un simple tag");
  assert.equal(places.filter((place) => place.mosquee_proche !== null).length, 0, "aucune proximité de mosquée ne doit être estimée à vol d’oiseau");
  assert.ok(!ids.includes("lombok-airport-driver"), "le faux prestataire de transfert ne doit pas réapparaître");

  const contactSources = new Set(seedPlaces.filter((place) => place.google_place_id && place.whatsapp).map((place) => place.id));
  assert.ok(places.filter((place) => place.whatsapp).every((place) => contactSources.has(place.id)), "chaque WhatsApp de prestataire doit venir d’une fiche Google Place identifiée");
  assert.ok(seedPlaces.filter((place) => !place.google_place_id).every((place) => place.google_rating === null && place.rating === null), "une fiche sans identifiant Google ne doit pas recevoir de pseudo-note Google ou interne");
});

test("chaque fiche possède un visuel éditorial cohérent et explicite", () => {
  for (const place of places) {
    assert.ok(Object.hasOwn(placeMediaSubjectById, place.id), `${place.id} doit avoir un sujet visuel revu explicitement`);
    assert.equal(place.photos[0], semanticPhotoForPlace(place), `${place.id} doit utiliser son visuel sémantique`);
    assert.match(semanticPhotoAlt(place), /n'est pas une photo de/i, `${place.id} doit distinguer illustration et photo réelle`);
    assert.doesNotMatch(place.photos[0], /hot-air-balloon|1470214304380/i, `${place.id} ne doit pas reprendre un ancien visuel hors sujet`);
  }

  assert.ok(new Set(places.map((place) => place.photos[0])).size >= 75, "le catalogue doit conserver une vraie variété de visuels");
  assert.equal(placeMediaSubjectById["heartbeach-surf"], "surf-lesson");
  assert.equal(placeMediaSubjectById["baleoli-beach"], "beachfront-dining");
  assert.equal(placeMediaSubjectById["mandalika-beach-club"], "beach-club");
  const correctedVisuals = ["heartbeach-surf", "selong-belanak", "rinjani-trek", "tetebatu-rice-terraces", "desa-sade", "sukarara-weaving", "masjid-hubbul-wathan", "loys-scooter", "zainuddin-airport", "pink-beach-boat"];
  assert.ok(correctedVisuals.every((id) => Object.hasOwn(placePhotoOverrideById, id)), "les incohérences visuelles signalées doivent rester corrigées explicitement");
});

test("les demandes générales vont à MyLombok et les contacts directs restent ceux des prestataires", async () => {
  const [form, explorer, route] = await Promise.all([
    read("app/components/concierge-form.tsx"),
    read("app/components/explorer-client.tsx"),
    read("app/conciergerie/page.tsx"),
  ]);

  includesEvery(form, [
    'const WHATSAPP_NUMBER = "33763664857"',
    "https://wa.me/${WHATSAPP_NUMBER}",
    'form.get("consent") === "on"',
    "departure < arrival",
    "window.open(url",
    'status: opened ? "WhatsApp ouvert" : "Message préparé"',
    "MyLombok ne le considère pas comme envoyé",
    "storeRequestForVerifiedUser",
    "supabase.auth.getUser()",
    'from("user_state")',
  ], "le formulaire de conciergerie");
  assert.doesNotMatch(form, /status:\s*["'](?:Envoyé|Confirmé)["']/);
  assert.doesNotMatch(form, /activeLocalUserId\(/, "une demande ne doit jamais faire confiance à un ancien identifiant local");
  includesEvery(route, ["Sans engagement automatique", "ne déclenche ni paiement ni réservation", "validation dans WhatsApp"], "la page conciergerie");

  includesEvery(explorer, ["normalizeWhatsAppNumber(place.whatsapp)", "WhatsApp du prestataire", "Appeler le prestataire", "Contact direct non renseigné", "Demande générale à MyLombok", 'href={`/conciergerie?service=${', "noopener noreferrer"], "les fiches prestataires");
  assert.doesNotMatch(explorer, /33763664857/, "Explorer ne doit jamais remplacer le numéro d’un prestataire par celui de MyLombok");
});

test("le profil propose une authentification réelle et des contrôles de données explicites", async () => {
  const [profile, supabase, schema] = await Promise.all([
    read("app/components/profile-client.tsx"),
    read("app/lib/supabase.ts"),
    read("supabase/schema.sql"),
  ]);

  includesEvery(profile, [
    'social("apple")',
    'social("google")',
    "signUp",
    "signInWithPassword",
    "resetPasswordForEmail",
    'from("user_state")',
    "Exporter mes données",
    "Effacer sur cet appareil",
    'href="/confidentialite"',
    "aucun projet Supabase MyLombok n’est configuré",
    "activeUserId.current !== expectedUserId",
    "authGeneration.current",
    "setSyncReady(false)",
  ], "le profil");
  assert.doesNotMatch(profile, /auth\.getSession\(/, "le profil doit valider l’utilisateur avec getUser");
  includesEvery(supabase, ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "NEXT_PUBLIC_SUPABASE_GOOGLE_ENABLED", "NEXT_PUBLIC_SUPABASE_APPLE_ENABLED"], "le client Supabase");
  assert.doesNotMatch(supabase, /SERVICE_ROLE|SUPABASE_SECRET|service_role/i, "aucune clé serveur privilégiée ne doit être utilisée côté navigateur");
  assert.match(profile, /hasSocialAuth/, "les fournisseurs OAuth non configurés ne doivent pas apparaître dans le formulaire");
  includesEvery(schema, ["enable row level security", "revoke all", "to authenticated", "(select auth.uid()) = user_id", "with check"], "les politiques Supabase");
});

test("la PWA cible les nouvelles routes et possède un repli hors ligne cohérent", async () => {
  const [layout, manifestSource, worker, installer, packageSource] = await Promise.all([
    read("app/layout.tsx"),
    read("public/manifest.webmanifest"),
    read("public/sw.js"),
    read("app/installer/page.tsx"),
    read("package.json"),
  ]);
  await access(new URL("public/offline.html", root));
  const manifest = JSON.parse(manifestSource);
  const packageJson = JSON.parse(packageSource);

  assert.equal(manifest.display, "standalone");
  assert.ok(manifest.icons.some((icon) => icon.sizes === "512x512"));
  assert.ok(manifest.shortcuts.some((shortcut) => shortcut.url === "/explorer"));
  assert.ok(manifest.shortcuts.some((shortcut) => shortcut.url === "/conciergerie"));
  assert.ok(manifest.shortcuts.every((shortcut) => !shortcut.url.includes("?tab=")), "les raccourcis ne doivent plus dépendre de l’ancien écran monolithique");
  assert.match(layout, /appleWebApp/);
  includesEvery(worker, ['const OFFLINE_PAGE = "/offline.html"', 'const PRIVATE_PATHS = ["/api", "/auth", "/profil"]', "isPrivateRequest(request, url)", 'request.mode === "navigate"', "fetch(request).catch(() => caches.match(OFFLINE_PAGE))", "isStaticAsset(url)"], "le service worker");
  assert.doesNotMatch(worker, /cache\.put\(request[^)]*\)[\s\S]{0,300}request\.mode === "navigate"/, "une navigation ne doit pas être mise en cache avec les données d’un utilisateur");
  assert.match(installer, /Sur l’écran d’accueil/);
  assert.equal(packageJson.scripts["build:vercel"], "next build");
  assert.match(packageJson.scripts.test, /rendered-html\.test\.mjs/);
});
