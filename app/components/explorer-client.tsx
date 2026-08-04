"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, ArrowRight, Clock3, Compass, ExternalLink, Grid2X2, Heart, Info, Landmark, List, LocateFixed, Map as MapIcon, MapPin, MessageCircle, Phone, Sailboat, Search, SlidersHorizontal, Sparkles, Trees, UtensilsCrossed, Waves, X, type LucideIcon } from "lucide-react";
import { categoryMeta, distanceKm, places as allPlaces, type Place, type PlaceCategory } from "../data/places";
import { getDistanceOrigin, isOpenAtLombokTime, withinOptionalRadius } from "../lib/explorer-filters";
import { readPersonalArray, setActiveLocalUserId, writePersonalArray } from "../lib/local-state";
import { getSupabaseBrowserClient } from "../lib/supabase";
import { useDialogA11y } from "./use-dialog-a11y";
import type { PlaceWithDistance } from "./explorer-map";

const ExplorerMap = dynamic(() => import("./explorer-map").then((module) => module.ExplorerMap), { ssr: false, loading: () => <div className="map-loading" role="status">La carte de Lombok se prépare…</div> });
const GlobeExplorer = dynamic(() => import("./globe-explorer").then((module) => module.GlobeExplorer), { ssr: false, loading: () => <div className="globe-loading" role="status">Le globe se prépare…</div> });

type ExplorerCategory = PlaceCategory | "activite" | "all";
type UserPosition = { lat: number; lng: number };

const categoryIcons: Record<PlaceCategory, LucideIcon> = { restaurant: UtensilsCrossed, plage: Waves, service: Sparkles, nature: Trees, excursion: Sailboat, culture: Landmark };
const activityTerms = ["activité", "surf", "snorkeling", "plongée", "trek", "randonnée", "bateau", "yoga", "massage", "spa", "cours", "tour", "pêche"];

function isActivityPlace(place: Place) {
  const text = `${place.subcategory} ${place.specialty || ""} ${place.tags.join(" ")}`.toLocaleLowerCase("fr");
  return activityTerms.some((term) => text.includes(term));
}

function normalizeWhatsAppNumber(value: string | null) {
  if (!value) return null;
  const digits = value.replace(/[^0-9]/g, "");
  return digits.length >= 8 && digits.length <= 15 ? digits : null;
}

function providerWhatsAppUrl(place: Place) {
  const number = normalizeWhatsAppNumber(place.whatsapp);
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(`Bonjour ${place.name}, je vous contacte depuis MyLombok au sujet de vos services.`)}`;
}

function PlaceImage({ src, alt, sizes }: { src: string | undefined; alt: string; sizes: string }) {
  const [imageSrc, setImageSrc] = useState(src || "/lombok-bay.jpg");
  return <Image src={imageSrc} alt={alt} fill sizes={sizes} onError={() => setImageSrc("/lombok-bay.jpg")} />;
}

export function ExplorerClient({ initialCategory = "all" }: { initialCategory?: string }) {
  const startingCategory = (["all", "activite", ...Object.keys(categoryMeta)] as string[]).includes(initialCategory) ? initialCategory as ExplorerCategory : "all";
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ExplorerCategory>(startingCategory);
  const [city, setCity] = useState("all");
  const [price, setPrice] = useState(0);
  const [openNow, setOpenNow] = useState(false);
  const [radius, setRadius] = useState(100);
  const [radiusEnabled, setRadiusEnabled] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<"distance" | "rating" | "price">("distance");
  const [view, setView] = useState<"list" | "map">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [detail, setDetail] = useState<PlaceWithDistance | null>(null);
  const [visible, setVisible] = useState(18);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [visited, setVisited] = useState<string[]>([]);
  const [muslimMode, setMuslimMode] = useState(false);
  const [halal, setHalal] = useState(false);
  const [position, setPosition] = useState<UserPosition | null>(null);
  const [geoStatus, setGeoStatus] = useState<"loading" | "ready" | "denied">("loading");
  const [showGlobe, setShowGlobe] = useState(true);
  const [storageUserId, setStorageUserId] = useState<string | null>(null);

  const requestPosition = useCallback(() => {
    if (!navigator.geolocation) { setGeoStatus("denied"); return; }
    setGeoStatus("loading");
    navigator.geolocation.getCurrentPosition(({ coords }) => { setPosition({ lat: coords.latitude, lng: coords.longitude }); setGeoStatus("ready"); }, () => setGeoStatus("denied"), { enableHighAccuracy: true, timeout: 9000, maximumAge: 300000 });
  }, []);

  useEffect(() => {
    let active = true;
    const hydrate = (userId: string | null) => {
      if (!active) return;
      setStorageUserId(userId);
      setActiveLocalUserId(userId);
      setFavorites(readPersonalArray<string>("my-lombok-favorites", userId).filter((item) => typeof item === "string"));
      setVisited(readPersonalArray<string>("my-lombok-visited", userId).filter((item) => typeof item === "string"));
      setMuslimMode(localStorage.getItem("my-lombok-muslim-mode") === "true");
      requestPosition();
    };
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      const timer = window.setTimeout(() => hydrate(null), 0);
      return () => { active = false; window.clearTimeout(timer); };
    }
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      const user = data.session?.user;
      hydrate(user?.id || null);
      if (!user) return;
      supabase.from("user_state").select("favorites, visited, preferences").eq("user_id", user.id).maybeSingle().then(({ data: state }) => {
        if (!active || !state) return;
        if (Array.isArray(state.favorites)) { setFavorites(state.favorites); writePersonalArray("my-lombok-favorites", state.favorites, user.id); }
        if (Array.isArray(state.visited)) { setVisited(state.visited); writePersonalArray("my-lombok-visited", state.visited, user.id); }
        const prefs = state.preferences as { muslimMode?: boolean } | null;
        if (typeof prefs?.muslimMode === "boolean") setMuslimMode(prefs.muslimMode);
      });
    });
    return () => { active = false; };
  }, [requestPosition]);

  function persistList(key: "my-lombok-favorites" | "my-lombok-visited", value: string[]) {
    writePersonalArray(key, value, storageUserId);
    const supabase = getSupabaseBrowserClient();
    supabase?.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      const field = key === "my-lombok-favorites" ? { favorites: value } : { visited: value };
      supabase.from("user_state").upsert({ user_id: data.user.id, ...field, updated_at: new Date().toISOString() }).then(() => undefined);
    });
  }

  function toggleFavorite(id: string) {
    const next = favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id];
    setFavorites(next); persistList("my-lombok-favorites", next);
  }

  const origin = getDistanceOrigin(position);
  const cities = useMemo(() => Array.from(new Set(allPlaces.map((place) => place.city))).sort((a, b) => a.localeCompare(b, "fr")), []);
  const hasVerifiedHalalData = useMemo(() => allPlaces.some((place) => place.halal !== "inconnu"), []);
  const results = useMemo(() => allPlaces.map((place) => ({ ...place, distance: distanceKm(origin.position, place) })).filter((place) => {
    const text = `${place.name} ${place.city} ${place.subcategory} ${place.tags.join(" ")}`.toLocaleLowerCase("fr");
    return (!query || text.includes(query.toLocaleLowerCase("fr"))) &&
      (muslimMode || place.subcategory !== "mosquée") &&
      (category === "all" || (category === "activite" ? isActivityPlace(place) : place.category === category)) &&
      (city === "all" || place.city === city) &&
      (!price || place.price_level === price) &&
      (!favoritesOnly || favorites.includes(place.id)) &&
      (!halal || place.halal === "certifié" || place.halal === "sans porc ni alcool") &&
      (!openNow || isOpenAtLombokTime(place.opening_hours)) &&
      withinOptionalRadius(place.distance, radiusEnabled, radius) &&
      (!minRating || (place.rating || 0) >= minRating);
  }).sort((a, b) => sort === "rating" ? (b.rating || 0) - (a.rating || 0) : sort === "price" ? (a.price_level || 9) - (b.price_level || 9) : a.distance - b.distance), [category, city, favorites, favoritesOnly, halal, minRating, muslimMode, openNow, origin.position, price, query, radius, radiusEnabled, sort]);

  const selectPlace = useCallback((place: PlaceWithDistance) => setDetail(place), []);
  function resetFilters() { setQuery(""); setCategory("all"); setCity("all"); setPrice(0); setOpenNow(false); setRadiusEnabled(false); setMinRating(0); setFavoritesOnly(false); setHalal(false); }

  return (
    <div className="explorer-client">
      <section className={`explorer-globe-panel${showGlobe ? "" : " is-collapsed"}`}>
        <div className="explorer-globe-panel__copy"><span className="eyebrow eyebrow--light">Lombok et les îles indonésiennes</span><h2>Repérez l’île avant de choisir.</h2><p>Le globe situe Lombok dans l’archipel. La navigation détaillée reste volontairement centrée sur Lombok et ses îles voisines.</p><button className="editorial-link editorial-link--light" onClick={() => setShowGlobe(!showGlobe)}>{showGlobe ? "Réduire le globe" : "Afficher le globe 3D"} <ArrowRight aria-hidden="true" /></button></div>
        {showGlobe && <GlobeExplorer onOpenMap={() => { setShowGlobe(false); setView("map"); document.getElementById("explorer-results")?.scrollIntoView({ behavior: "smooth" }); }} />}
      </section>

      <div className="explorer-tools">
        <label className="search-field"><Search aria-hidden="true" /><span className="sr-only">Rechercher un lieu</span><input value={query} onChange={(event) => { setQuery(event.target.value); setVisible(18); }} placeholder="Un lieu, une zone, une envie…" /><button type="button" onClick={() => setShowFilters(!showFilters)} aria-expanded={showFilters} aria-controls="explorer-filters" aria-label="Afficher les filtres"><SlidersHorizontal aria-hidden="true" /></button></label>
        <button className={`favorite-filter${favoritesOnly ? " is-active" : ""}`} aria-pressed={favoritesOnly} onClick={() => setFavoritesOnly(!favoritesOnly)}><Heart aria-hidden="true" fill={favoritesOnly ? "currentColor" : "none"} /> Mes favoris <span>{favorites.length}</span></button>
      </div>

      <div className="category-navigation" aria-label="Catégories de lieux">
        <button className={category === "all" ? "is-active" : ""} aria-pressed={category === "all"} onClick={() => setCategory("all")}><Grid2X2 aria-hidden="true" /><span>Tout</span></button>
        <button className={category === "activite" ? "is-active" : ""} aria-pressed={category === "activite"} onClick={() => setCategory("activite")}><Activity aria-hidden="true" /><span>Activités</span></button>
        {(Object.keys(categoryMeta) as PlaceCategory[]).map((key) => { const Icon = categoryIcons[key]; return <button key={key} className={category === key ? "is-active" : ""} aria-pressed={category === key} onClick={() => setCategory(key)}><Icon aria-hidden="true" /><span>{categoryMeta[key].label}</span></button>; })}
      </div>

      {showFilters && <section className="explorer-filters" id="explorer-filters" aria-label="Filtres de recherche">
        <label>Zone<select value={city} onChange={(event) => setCity(event.target.value)}><option value="all">Toutes les zones</option>{cities.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Budget<select value={price} onChange={(event) => setPrice(Number(event.target.value))}><option value="0">Tous les budgets</option><option value="1">Petit prix</option><option value="2">Intermédiaire</option><option value="3">Plus élevé</option></select></label>
        <label>Note disponible<select value={minRating} onChange={(event) => setMinRating(Number(event.target.value))}><option value="0">Toutes</option><option value="4">4,0+</option><option value="4.5">4,5+</option></select></label>
        <label className="range-field"><span>Rayon depuis {origin.usingReference ? "Kuta" : "ma position"}<button type="button" className={radiusEnabled ? "is-on" : ""} onClick={() => setRadiusEnabled(!radiusEnabled)}>{radiusEnabled ? "activé" : "désactivé"}</button></span><input type="range" min="2" max="100" value={radius} disabled={!radiusEnabled} onChange={(event) => setRadius(Number(event.target.value))} /><small>{radius} km</small></label>
        <div className="filter-toggles"><button aria-pressed={openNow} className={openNow ? "is-on" : ""} onClick={() => setOpenNow(!openNow)}><Clock3 aria-hidden="true" /> Ouvert maintenant · horaires connus</button>{muslimMode && hasVerifiedHalalData && <button aria-pressed={halal} className={halal ? "is-on" : ""} onClick={() => setHalal(!halal)}>Halal déclaré</button>}<button onClick={resetFilters}>Réinitialiser</button></div>
      </section>}

      <div className="explorer-context"><Info aria-hidden="true" /><p>Ce carnet sert au repérage. Les horaires, prix et disponibilités indiqués « à confirmer » doivent être vérifiés directement auprès du lieu.</p>{origin.usingReference && <button onClick={requestPosition}><LocateFixed aria-hidden="true" /> {geoStatus === "loading" ? "Localisation…" : "Utiliser ma position"}</button>}</div>

      <section id="explorer-results" className="explorer-results">
        <div className="results-header"><p aria-live="polite"><strong>{results.length}</strong> lieux trouvés</p><label>Trier par <select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}><option value="distance">distance</option><option value="rating">note</option><option value="price">prix</option></select></label><div className="view-switch"><button className={view === "list" ? "is-active" : ""} onClick={() => setView("list")} aria-label="Vue liste"><List aria-hidden="true" /></button><button className={view === "map" ? "is-active" : ""} onClick={() => setView("map")} aria-label="Vue carte"><MapIcon aria-hidden="true" /></button></div></div>
        {view === "map" ? <ExplorerMap items={results} onSelect={selectPlace} userPosition={origin.usingReference ? null : position} /> : results.length ? <div className="place-grid">{results.slice(0, visible).map((place) => <PlaceCard key={place.id} place={place} favorite={favorites.includes(place.id)} onFavorite={() => toggleFavorite(place.id)} onOpen={() => setDetail(place)} />)}</div> : <div className="empty-state"><Compass aria-hidden="true" /><strong>Aucun lieu ne correspond à ces filtres.</strong><p>Élargissez la zone ou réinitialisez la recherche.</p><button onClick={resetFilters}>Réinitialiser les filtres</button></div>}
        {view === "list" && visible < results.length && <button className="button button--outline load-more" onClick={() => setVisible((count) => count + 18)}>Afficher plus de lieux</button>}
      </section>

      {detail && <PlaceDetail place={detail} favorite={favorites.includes(detail.id)} visited={visited.includes(detail.id)} close={() => setDetail(null)} toggleFavorite={() => toggleFavorite(detail.id)} checkIn={() => { const next = [...new Set([...visited, detail.id])]; setVisited(next); persistList("my-lombok-visited", next); }} canCheckIn={geoStatus === "ready" && distanceKm(position!, detail) <= 0.2} muslimMode={muslimMode} />}
    </div>
  );
}

function PlaceCard({ place, favorite, onFavorite, onOpen }: { place: PlaceWithDistance; favorite: boolean; onFavorite: () => void; onOpen: () => void }) {
  const Icon = categoryIcons[place.category];
  return <article className="place-card"><div className="place-card__image"><PlaceImage src={place.photos[0]} alt={`Ambiance représentative de la catégorie ${categoryMeta[place.category].label.toLowerCase()} à Lombok ; image éditoriale, pas nécessairement prise dans ce lieu`} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" /><span><Icon aria-hidden="true" /> {categoryMeta[place.category].label}</span></div><button className="place-card__favorite" aria-pressed={favorite} aria-label={favorite ? `Retirer ${place.name} des favoris` : `Ajouter ${place.name} aux favoris`} onClick={onFavorite}><Heart aria-hidden="true" fill={favorite ? "currentColor" : "none"} /></button><div className="place-card__body"><span className="place-card__meta">{place.city} · {place.subcategory}</span><h2>{place.name}</h2><p>{place.specialty || place.description}</p><div>{place.rating && <span title="Note Google indicative, à vérifier">Google · {place.rating.toFixed(1)}</span>}<span><MapPin aria-hidden="true" /> {place.distance < 1 ? `${Math.round(place.distance * 1000)} m` : `${place.distance.toFixed(1)} km`}</span><span>{place.price_range || "Prix à confirmer"}</span></div></div><button className="place-card__open" onClick={onOpen}><span className="sr-only">Voir la fiche de {place.name}</span></button></article>;
}

function PlaceDetail({ place, favorite, visited, canCheckIn, close, toggleFavorite, checkIn, muslimMode }: { place: PlaceWithDistance; favorite: boolean; visited: boolean; canCheckIn: boolean; close: () => void; toggleFavorite: () => void; checkIn: () => void; muslimMode: boolean }) {
  const closeDialog = useCallback(() => close(), [close]);
  const ref = useDialogA11y(true, closeDialog);
  const directWhatsApp = providerWhatsAppUrl(place);
  const Icon = categoryIcons[place.category];
  return <div className="dialog-backdrop place-dialog-backdrop" onMouseDown={close}><article className="place-detail" ref={ref} role="dialog" aria-modal="true" aria-labelledby="place-title" onMouseDown={(event) => event.stopPropagation()}><button className="dialog-close" onClick={close} aria-label="Fermer la fiche"><X aria-hidden="true" /></button><div className="place-detail__image"><PlaceImage src={place.photos[0]} alt={`Ambiance représentative de la catégorie ${categoryMeta[place.category].label.toLowerCase()} à Lombok ; image éditoriale, pas nécessairement prise dans ce lieu`} sizes="(max-width: 760px) 100vw, 720px" /><span><Icon aria-hidden="true" /> {categoryMeta[place.category].label}</span></div><div className="place-detail__body"><span className="eyebrow">{place.city} · {place.island.replaceAll("-", " ")}</span><h2 id="place-title">{place.name}</h2><div className="place-detail__stats">{place.rating && <span title="Note Google indicative, à vérifier">Note Google indicative · {place.rating.toFixed(1)}</span>}<span><MapPin aria-hidden="true" /> {place.distance < 1 ? `${Math.round(place.distance * 1000)} m` : `${place.distance.toFixed(1)} km`}</span><span>{place.price_range || "Prix à confirmer"}</span></div><p className="place-detail__description">{place.description}</p>{place.vigilance && <div className="vigilance"><Info aria-hidden="true" /><div><strong>À savoir avant d’y aller</strong><p>{place.vigilance}</p></div></div>}{place.menu && <section className="place-menu"><span className="eyebrow">La carte</span><h3>{place.menu.highlights.length ? "Quelques repères" : "Informations du restaurant"}</h3>{place.menu.highlights.length > 0 && <div>{place.menu.highlights.map((item) => <span key={item}>{item}</span>)}</div>}<a href={place.menu.source_url} target="_blank" rel="noopener noreferrer">Voir la carte complète <ExternalLink aria-hidden="true" /></a><small>{place.menu.status === "officiel" ? `Source indiquée par le restaurant : ${place.menu.source_label}.` : "Carte, prix et disponibilité à confirmer auprès du restaurant."}</small></section>}<dl className="practical-info"><div><dt>Horaires</dt><dd>{place.opening_hours || "À confirmer"}</dd></div><div><dt>Meilleur moment</dt><dd>{place.best_time || "Selon vos envies"}</dd></div>{place.level && <div><dt>Niveau</dt><dd>{place.level}</dd></div>}{muslimMode && place.halal !== "inconnu" && <div><dt>Information halal</dt><dd>{place.halal}</dd></div>}</dl><div className="tag-list">{place.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><button className={`check-in${visited ? " is-done" : ""}`} disabled={!canCheckIn || visited} onClick={checkIn}>{visited ? "Lieu ajouté à mes visites" : canCheckIn ? "Valider ma visite" : "Visite validable à moins de 200 m"}</button><div className="place-detail__actions"><a className="button button--primary" href={place.maps_url} target="_blank" rel="noopener noreferrer"><ExternalLink aria-hidden="true" /> Itinéraire</a>{directWhatsApp ? <a className="button button--outline" href={directWhatsApp} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" /> WhatsApp du prestataire</a> : <span className="contact-unavailable"><Phone aria-hidden="true" /> Contact direct non renseigné</span>}<button className="button button--outline" aria-pressed={favorite} onClick={toggleFavorite}><Heart aria-hidden="true" fill={favorite ? "currentColor" : "none"} /> {favorite ? "Retirer des favoris" : "Ajouter aux favoris"}</button><Link className="editorial-link" href={`/conciergerie?service=${place.category === "restaurant" ? "restaurant" : place.category === "excursion" || isActivityPlace(place) ? "activite" : "autre"}&place=${encodeURIComponent(place.name)}`}>Demande générale à MyLombok <ArrowRight aria-hidden="true" /></Link></div></div></article></div>;
}
