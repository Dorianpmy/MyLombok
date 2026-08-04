import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

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
  const [route, explorer, map, dialog] = await Promise.all([
    read("app/explorer/page.tsx"),
    read("app/components/explorer-client.tsx"),
    read("app/components/explorer-map.tsx"),
    read("app/components/use-dialog-a11y.ts"),
  ]);

  includesEvery(route, ["ExplorerClient", "searchParams", "initialCategory"], "la route Explorer");
  includesEvery(explorer, [
    "Un lieu, une zone, une envie…",
    "Activités",
    'aria-label="Filtres de recherche"',
    'aria-live="polite"',
    'aria-label="Vue liste"',
    'aria-label="Vue carte"',
    'role="dialog"',
    'aria-modal="true"',
    "useDialogA11y",
    "ExplorerMap",
    "GlobeExplorer",
    "place.maps_url",
    "Prix à confirmer",
  ], "Explorer");
  assert.match(explorer, /aria-label=\{favorite \? `Retirer .* des favoris` : `Ajouter .* aux favoris`\}/);
  assert.match(map, /L\.map|leaflet/i);
  includesEvery(dialog, ["Escape", "const previous = document.activeElement", "focusable", 'event.key !== "Tab"', "previous?.focus()"], "la gestion des dialogues");
});

test("le catalogue est diversifié, sans doublon ni affirmation éditoriale fabriquée", () => {
  const ids = places.map((place) => place.id);
  assert.ok(places.length >= 100, `le catalogue ne contient que ${places.length} lieux`);
  assert.equal(new Set(ids).size, places.length, "chaque lieu doit avoir un identifiant unique");

  for (const category of ["restaurant", "plage", "service", "nature", "excursion", "culture"]) {
    assert.ok(places.some((place) => place.category === category), `la catégorie ${category} ne doit pas être vide`);
  }
  for (const place of places) {
    assert.ok(Number.isFinite(place.lat) && place.lat >= -9.1 && place.lat <= -8.2, `${place.id} a une latitude incohérente`);
    assert.ok(Number.isFinite(place.lng) && place.lng >= 115.8 && place.lng <= 116.8, `${place.id} a une longitude incohérente`);
    assert.match(place.maps_url, /^https:\/\//, `${place.id} doit pointer vers une carte HTTPS`);
    assert.ok(place.photos.length > 0, `${place.id} doit avoir un visuel de repli`);
  }
  assert.ok(places.filter((place) => place.category === "restaurant").every((place) => place.menu), "chaque restaurant doit proposer une source de carte ou signaler qu’elle est à confirmer");

  // Ces champs restent neutres tant qu’aucune provenance vérifiable n’est encodée.
  assert.equal(places.filter((place) => place.tested_by_us).length, 0, "aucun lieu ne doit être présenté comme testé sans preuve");
  assert.equal(places.filter((place) => place.halal !== "inconnu").length, 0, "aucun statut halal ne doit être déduit d’un simple tag");
  assert.equal(places.filter((place) => place.mosquee_proche !== null).length, 0, "aucune proximité de mosquée ne doit être estimée à vol d’oiseau");
  assert.ok(!ids.includes("lombok-airport-driver"), "le faux prestataire de transfert ne doit pas réapparaître");

  const contactSources = new Set(seedPlaces.filter((place) => place.google_place_id && place.whatsapp).map((place) => place.id));
  assert.ok(places.filter((place) => place.whatsapp).every((place) => contactSources.has(place.id)), "chaque WhatsApp de prestataire doit venir d’une fiche Google Place identifiée");
  assert.ok(seedPlaces.filter((place) => !place.google_place_id).every((place) => place.google_rating === null && place.rating === null), "une fiche sans identifiant Google ne doit pas recevoir de pseudo-note Google ou interne");
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
  ], "le formulaire de conciergerie");
  assert.doesNotMatch(form, /status:\s*["'](?:Envoyé|Confirmé)["']/);
  includesEvery(route, ["Sans engagement automatique", "ne déclenche ni paiement ni réservation", "validation dans WhatsApp"], "la page conciergerie");

  includesEvery(explorer, ["normalizeWhatsAppNumber(place.whatsapp)", "WhatsApp du prestataire", "Contact direct non renseigné", "Demande générale à MyLombok", 'href={`/conciergerie?service=${', "noopener noreferrer"], "les fiches prestataires");
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
  ], "le profil");
  includesEvery(supabase, ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"], "le client Supabase");
  assert.doesNotMatch(supabase, /SERVICE_ROLE|SUPABASE_SECRET|service_role/i, "aucune clé serveur privilégiée ne doit être utilisée côté navigateur");
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
