"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "leaflet/dist/leaflet.css";
import { categoryMeta, distanceKm, places as allPlaces, type Place, type PlaceCategory } from "./data/places";
import { getDistanceOrigin, isOpenAtLombokTime, normalizeCategory, withinOptionalRadius } from "./lib/explorer-filters";
import { CalculationMethod, Coordinates, PrayerTimes } from "adhan";
import { Compass, Heart, Home as HomeIcon, MapPinned, NotebookTabs, UserRound } from "lucide-react";

type Tab = "home" | "explorer" | "places" | "requests" | "profile";
type Request = { id: number; title: string; detail: string; status: "En cours" | "Confirmé" };
type UserPosition = { lat: number; lng: number };

const places = [
  { icon: "☕", name: "Bush Radio", area: "Kuta", type: "Café & coworking", color: "peach" },
  { icon: "🏖", name: "Tanjung Aan", area: "Mandalika", type: "Plage", color: "blue" },
  { icon: "🛵", name: "Lombok Ride", area: "Kuta", type: "Scooter fiable", color: "yellow" },
];

const initialRequests: Request[] = [
  { id: 1, title: "Transfert aéroport", detail: "Demain · 14:30 · LOP → Kuta", status: "Confirmé" },
  { id: 2, title: "Trouver un scooter", detail: "Honda Vario · 1 mois", status: "En cours" },
];

const nav = [
  { id: "home" as Tab, Icon: HomeIcon, label: "Accueil" },
  { id: "explorer" as Tab, Icon: Compass, label: "Explorer" },
  { id: "places" as Tab, Icon: Heart, label: "Adresses" },
  { id: "requests" as Tab, Icon: NotebookTabs, label: "Demandes" },
  { id: "profile" as Tab, Icon: UserRound, label: "Profil" },
];

export default function Home() {
  const [tab, setTab] = useState<Tab>("home");
  const [modal, setModal] = useState<"request" | "place" | null>(null);
  const [toast, setToast] = useState("");
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [deviceId, setDeviceId] = useState("");
  const [position, setPosition] = useState<UserPosition | null>(null);
  const [geoStatus, setGeoStatus] = useState<"loading" | "ready" | "denied">("loading");
  const [requestDraft, setRequestDraft] = useState("");
  const [dark, setDark] = useState(false);
  const [muslimMode, setMuslimMode] = useState(false);
  const [visited, setVisited] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("my-lombok-requests");
    if (saved) setRequests(JSON.parse(saved));
    const cachedFavorites = localStorage.getItem("my-lombok-favorites");
    if (cachedFavorites) setFavorites(JSON.parse(cachedFavorites));
    setDark(localStorage.getItem("my-lombok-theme") === "dark");
    setMuslimMode(localStorage.getItem("my-lombok-muslim-mode") === "true");
    const savedVisited = localStorage.getItem("my-lombok-visited"); if (savedVisited) setVisited(JSON.parse(savedVisited));
    let id = localStorage.getItem("my-lombok-device");
    if (!id) { id = crypto.randomUUID(); localStorage.setItem("my-lombok-device", id); }
    setDeviceId(id);
    fetch(`/api/favorites?deviceId=${encodeURIComponent(id)}`).then((response) => response.ok ? response.json() : null).then((data) => { if (data?.favorites?.length) setFavorites(data.favorites); }).catch(() => {});
    requestPosition();
  }, []);

  const title = useMemo(() => ({ home: "Où veux-tu aller aujourd’hui ?", explorer: "Explorer Lombok", places: "Mes bonnes adresses", requests: "Mes demandes", profile: "Mon séjour" }[tab]), [tab]);

  function requestPosition() {
    if (!navigator.geolocation) { setGeoStatus("denied"); return; }
    setGeoStatus("loading");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => { setPosition({ lat: coords.latitude, lng: coords.longitude }); setGeoStatus("ready"); },
      () => { setPosition({ lat: -8.891, lng: 116.277 }); setGeoStatus("denied"); },
      { enableHighAccuracy: true, timeout: 9000, maximumAge: 300000 }
    );
  }

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  }

  function addRequest(formData: FormData) {
    const title = String(formData.get("title") || "Nouvelle demande");
    const next = [{ id: Date.now(), title, detail: "À organiser · Dès que possible", status: "En cours" as const }, ...requests];
    setRequests(next);
    localStorage.setItem("my-lombok-requests", JSON.stringify(next));
    setModal(null);
    setTab("requests");
    notify("Demande ajoutée — on s’en occupe !");
  }

  function toggleFavorite(placeId: string) {
    const active = !favorites.includes(placeId);
    const next = active ? [...favorites, placeId] : favorites.filter((item) => item !== placeId);
    setFavorites(next);
    localStorage.setItem("my-lombok-favorites", JSON.stringify(next));
    if (deviceId) fetch("/api/favorites", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ deviceId, placeId, active }) }).catch(() => {});
  }

  return (
    <main className={`app-shell ${dark ? "dark" : ""} ${muslimMode ? "muslim-on" : "muslim-off"}`}>
      <section className="phone-app">
        <header className="topbar">
          <button className="brand" onClick={() => setTab("home")} aria-label="Retour à l'accueil">
            <span className="brand-mark">M</span><span>my lombok</span>
          </button>
          <select className="destination" aria-label="Destination"><option>Lombok</option><option disabled>Bali · bientôt</option><option disabled>Gili · bientôt</option><option disabled>Sumbawa · bientôt</option><option disabled>Flores · bientôt</option></select>
          <button className="avatar" onClick={() => setTab("profile")} aria-label="Ouvrir mon profil">○</button>
        </header>

        <div className="content">
          {tab === "home" && <HomeView title={title} requests={requests} setTab={setTab} setModal={setModal} notify={notify} position={position} geoStatus={geoStatus} requestPosition={requestPosition} visited={visited} muslimMode={muslimMode} />}
          {tab === "explorer" && <ExplorerView muslimMode={muslimMode} position={position} favorites={favorites} toggleFavorite={toggleFavorite} setModal={setModal} setRequestDraft={setRequestDraft} visited={visited} checkIn={(id) => { const next = Array.from(new Set([...visited, id])); setVisited(next); localStorage.setItem("my-lombok-visited", JSON.stringify(next)); }} />}
          {tab === "places" && <PlacesView title={title} favorites={favorites} toggleFavorite={toggleFavorite} setModal={setModal} />}
          {tab === "requests" && <RequestsView title={title} requests={requests} setModal={setModal} />}
          {tab === "profile" && <ProfileView title={title} notify={notify} dark={dark} visited={visited} muslimMode={muslimMode} toggleMuslimMode={() => { const next = !muslimMode; setMuslimMode(next); localStorage.setItem("my-lombok-muslim-mode", String(next)); }} toggleDark={() => { const next = !dark; setDark(next); localStorage.setItem("my-lombok-theme", next ? "dark" : "light"); }} />}
        </div>

        <nav className="bottom-nav" aria-label="Navigation principale">
          {nav.map((item) => <button key={item.id} className={tab === item.id ? "active" : ""} onClick={() => setTab(item.id)}><span><item.Icon strokeWidth={1.8}/></span>{item.label}</button>)}
        </nav>
      </section>

      {modal && <Modal type={modal} close={() => { setModal(null); setRequestDraft(""); }} addRequest={addRequest} notify={notify} draft={requestDraft} />}
      {toast && <div className="toast" role="status">✓ {toast}</div>}
    </main>
  );
}

function HomeView({ title, requests, setTab, setModal, notify, position, geoStatus, requestPosition, visited, muslimMode }: { title: string; requests: Request[]; setTab: (t: Tab) => void; setModal: (m: "request" | "place") => void; notify: (s: string) => void; position: UserPosition | null; geoStatus: "loading" | "ready" | "denied"; requestPosition: () => void; visited: string[]; muslimMode: boolean }) {
  const [selected, setSelected] = useState("Kuta Lombok");
  const [category, setCategory] = useState("Explorer");
  const mapSpots = [
    { name: "Kuta Lombok", kind: "Ton quartier", icon: "⌂", x: 52, y: 78, note: "8 adresses testées autour de toi" },
    { name: "Tanjung Aan", kind: "Plage", icon: "☀", x: 70, y: 72, note: "25 min · Idéal ce matin" },
    { name: "Tetebatu", kind: "Nature", icon: "♧", x: 50, y: 48, note: "1 h 20 · Rizières & cascades" },
    { name: "Mont Rinjani", kind: "Aventure", icon: "△", x: 62, y: 26, note: "2 h 10 · Guide recommandé" },
    { name: "Senggigi", kind: "Coucher de soleil", icon: "◐", x: 25, y: 48, note: "1 h 30 · Route panoramique" },
  ];
  const current = mapSpots.find((spot) => spot.name === selected) || mapSpots[0];
  return <>
    <div className="map-head"><div><div className="eyebrow">Mercredi 22 juillet · Kuta</div><h1>{title}</h1></div><button className="weather" onClick={() => notify("Grand soleil · 29 °C")}>☀ <b>29°</b></button></div>
    <p className="lead">Une sélection locale pour vivre l’île à ton rythme.</p>
    <div className={`home-widgets ${muslimMode ? "" : "solo"}`}>{muslimMode && <PrayerWidget position={position}/>}<button className="progress-widget" onClick={() => setTab("profile")}><span style={{ "--progress": `${Math.round(visited.length / allPlaces.length * 100)}%` } as React.CSSProperties}><b>{Math.round(visited.length / allPlaces.length * 100)}%</b></span><div><small>TON EXPLORATION</small><strong>{visited.length ? "Continue comme ça" : "L’aventure commence"}</strong><p>{visited.length} lieu{visited.length > 1 ? "x" : ""} visité{visited.length > 1 ? "s" : ""}</p></div></button></div>
    <div className="map-filters">{["Explorer", "Manger", "Plages", "Services"].map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => { setCategory(item); if (item === "Explorer") setTab("explorer"); else notify(`${item} affiché sur la carte`); }}>{item}</button>)}</div>
    <Globe onLombok={() => { setSelected("Kuta Lombok"); notify("Bienvenue à Lombok"); }} position={position} geoStatus={geoStatus} requestPosition={requestPosition} />
    <article className="map-place-card"><div className="spot-thumb"><span>{current.icon}</span></div><div><small>{current.kind}</small><h2>{current.name}</h2><p>{current.note}</p></div><button onClick={() => { setTab("places"); notify(`${current.name} ouvert`); }}>→</button></article>
    <div className="map-actions"><button className="map-request" onClick={() => setModal("request")}><span>＋</span><b>Demander à la conciergerie</b></button><button onClick={() => { setTab("requests"); notify("Réservation ouverte"); }}><span className="calendar"><b>23</b>JUL</span><strong>{requests[0]?.title || "Mes demandes"}</strong></button></div>
    <CurrencyConverter />
  </>;
}

function PrayerWidget({ position }: { position: UserPosition | null }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(timer); }, []);
  const coords = position || { lat: -8.8947, lng: 116.2832 };
  const params = CalculationMethod.Other(); params.fajrAngle = 20; params.ishaAngle = 18;
  const prayers = new PrayerTimes(new Coordinates(coords.lat, coords.lng), new Date(now), params);
  const schedule = [{ name: "Fajr", date: prayers.fajr }, { name: "Dhuhr", date: prayers.dhuhr }, { name: "Asr", date: prayers.asr }, { name: "Maghrib", date: prayers.maghrib }, { name: "Isha", date: prayers.isha }];
  let next = schedule.find((prayer) => prayer.date.getTime() > now);
  if (!next) { const tomorrow = new Date(now + 86400000); const nextTimes = new PrayerTimes(new Coordinates(coords.lat, coords.lng), tomorrow, params); next = { name: "Fajr", date: nextTimes.fajr }; }
  const remaining = Math.max(0, next.date.getTime() - now);
  const hours = Math.floor(remaining / 3600000); const minutes = Math.floor(remaining % 3600000 / 60000);
  const nearest = allPlaces.filter((place) => place.subcategory === "mosquée").sort((a, b) => distanceKm(coords, a) - distanceKm(coords, b))[0];
  useEffect(() => { localStorage.setItem(`my-lombok-prayers-${new Date().toISOString().slice(0, 10)}`, JSON.stringify(schedule.map((item) => ({ name: item.name, time: item.date.toISOString() })))); }, []);
  return <div className="prayer-widget"><span>◒</span><div><small>PROCHAINE PRIÈRE · CALCUL LOCAL KEMENAG</small><strong>{next.name} · {new Intl.DateTimeFormat("fr-FR", { timeZone: "Asia/Makassar", hour: "2-digit", minute: "2-digit" }).format(next.date)}</strong><p>dans {hours} h {minutes} min · {nearest?.name || "Mosquée locale"}</p></div></div>;
}

function CurrencyConverter() {
  const [amount, setAmount] = useState(100000);
  const [currency, setCurrency] = useState("EUR");
  const [rate, setRate] = useState(0.000052);
  const [date, setDate] = useState("hors ligne");
  useEffect(() => {
    const cache = localStorage.getItem("my-lombok-rates");
    if (cache) { const saved = JSON.parse(cache); if (Date.now() - saved.savedAt < 86400000) { setRate(saved.rates[currency] || rate); setDate(saved.date); return; } }
    fetch(`https://api.frankfurter.dev/v2/rate/IDR/${currency}`).then((response) => response.json()).then((data) => { setRate(data.rate); setDate(data.date); localStorage.setItem("my-lombok-rates", JSON.stringify({ savedAt: Date.now(), date: data.date, rates: { [currency]: data.rate } })); }).catch(() => {});
  }, [currency]);
  return <section className="converter"><div><small>CONVERTISSEUR HORS LIGNE</small><strong>{new Intl.NumberFormat("id-ID").format(amount)} Rp</strong><input aria-label="Montant en roupies" type="number" value={amount} onChange={(event) => setAmount(Number(event.target.value))}/></div><span>⇄</span><div><select value={currency} onChange={(event) => setCurrency(event.target.value)}>{["EUR","USD","GBP","CHF","AUD","SGD","MYR","SAR","AED"].map((code) => <option key={code}>{code}</option>)}</select><strong>{new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(amount * rate)}</strong><small>Taux du {date}</small></div><footer>Repères : warung ≈ 35k · plein scooter ≈ 45k · scooter-taxi ≈ 25k</footer></section>;
}

function ExplorerView({ position, favorites, toggleFavorite, setModal, setRequestDraft, visited, checkIn, muslimMode }: { position: UserPosition | null; favorites: string[]; toggleFavorite: (id: string) => void; setModal: (type: "request") => void; setRequestDraft: (value: string) => void; visited: string[]; checkIn: (id: string) => void; muslimMode: boolean }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<PlaceCategory | "all">("all");
  const [city, setCity] = useState("all");
  const [price, setPrice] = useState(0);
  const [tested, setTested] = useState(false);
  const [halal, setHalal] = useState(false);
  const [openNow, setOpenNow] = useState(false);
  const [radius, setRadius] = useState(100);
  const [radiusEnabled, setRadiusEnabled] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [noAlcohol, setNoAlcohol] = useState(false);
  const [romantic, setRomantic] = useState(false);
  const [nearMosque, setNearMosque] = useState(false);
  const [calm, setCalm] = useState(false);
  const [sort, setSort] = useState<"distance" | "rating" | "price">("distance");
  const [view, setView] = useState<"list" | "map">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [detail, setDetail] = useState<Place | null>(null);
  const [visible, setVisible] = useState(14);
  const distanceOrigin = getDistanceOrigin(position);
  const user = distanceOrigin.position;
  const cities = Array.from(new Set(allPlaces.map((place) => place.city))).sort();

  const results = useMemo(() => allPlaces
    .map((place) => ({ ...place, distance: distanceKm(user, place) }))
    .filter((place) => {
      const text = `${place.name} ${place.city} ${place.subcategory} ${place.tags.join(" ")}`.toLowerCase();
      return (!query || text.includes(query.toLowerCase())) &&
        (muslimMode || place.subcategory !== "mosquée") &&
        (category === "all" || normalizeCategory(place.category) === category) &&
        (city === "all" || place.city === city) &&
        (!price || place.price_level === price) &&
        (!tested || place.tested_by_us) &&
        (!halal || place.halal === "certifié" || place.halal === "sans porc ni alcool") &&
        (!noAlcohol || place.alcool_servi === false) &&
        (!romantic || place.ambiance.includes("romantique") || place.ambiance.includes("vue")) &&
        (!nearMosque || (place.mosquee_proche?.distance_m || Infinity) <= 500 || place.subcategory === "mosquée") &&
        (!calm || place.ambiance.includes("calme")) &&
        (!openNow || isOpenAtLombokTime(place.opening_hours)) &&
        withinOptionalRadius(place.distance, radiusEnabled, radius) && (place.rating || 0) >= minRating;
    })
    .sort((a, b) => sort === "rating" ? (b.rating || 0) - (a.rating || 0) : sort === "price" ? (a.price_level || 9) - (b.price_level || 9) : a.distance - b.distance),
  [query, category, city, price, tested, halal, noAlcohol, romantic, nearMosque, calm, openNow, radius, radiusEnabled, minRating, sort, user.lat, user.lng, muslimMode]);

  const activeFilterLabels = [query && "la recherche", category !== "all" && "la catégorie", city !== "all" && "la zone", price && "le prix", tested && "testé", halal && "halal", noAlcohol && "sans alcool", romantic && "pour deux", nearMosque && "mosquée proche", calm && "calme", openNow && "ouvert maintenant", radiusEnabled && "la distance", minRating && "la note"].filter(Boolean);
  function resetFilters() { setQuery(""); setCategory("all"); setCity("all"); setPrice(0); setTested(false); setHalal(false); setNoAlcohol(false); setRomantic(false); setNearMosque(false); setCalm(false); setOpenNow(false); setRadiusEnabled(false); setMinRating(0); }

  function concierge(place: Place) {
    setRequestDraft(`Demande concernant ${place.name}`);
    setDetail(null);
    setModal("request");
  }

  return <div className="explorer-view">
    <div className="eyebrow">Guide vérifié · {allPlaces.length} adresses</div>
    <div className="explorer-title"><div><h1>Explorer Lombok</h1><p>Les meilleures adresses, testées ou à découvrir.</p></div><span>🇮🇩</span></div>
    <label className="search-box"><span>⌕</span><input value={query} onChange={(event) => { setQuery(event.target.value); setVisible(14); }} placeholder="Rechercher un lieu, une zone, une envie…"/><button onClick={() => setShowFilters(!showFilters)} className={showFilters ? "active" : ""}>☷</button></label>
    {distanceOrigin.usingReference && <button className="distance-notice" onClick={() => setRadiusEnabled(false)}>⌖ Distances depuis Kuta — active ta position sur place</button>}
    <div className="editorial-selections"><button className="couple-selection" onClick={() => { setRomantic(true); setCategory("all"); }}><span>01</span><div><small>SÉLECTION ÉDITORIALE</small><strong>Lombok à deux</strong><p>Dîners avec vue, criques calmes et parenthèses en duo</p></div><em>→</em></button><button className="couple-selection essential" onClick={() => { setTested(true); setRomantic(false); setCategory("all"); }}><span>02</span><div><small>LE CARNET LOCAL</small><strong>Nos essentiels</strong><p>Les adresses que l’on recommande les yeux fermés</p></div><em>→</em></button></div>
    <div className="category-scroll"><button className={category === "all" ? "active" : ""} onClick={() => setCategory("all")}><span>✦</span>Tout</button>{(Object.entries(categoryMeta) as [PlaceCategory, { label: string; icon: string }][]).map(([key, meta]) => <button key={key} className={category === key ? "active" : ""} onClick={() => { setCategory(key); setVisible(14); }}><span>{meta.icon}</span>{meta.label}</button>)}</div>
    {showFilters && <section className="filter-panel">
      <label>Zone<select value={city} onChange={(event) => setCity(event.target.value)}><option value="all">Toutes les zones</option>{cities.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label>Prix<select value={price} onChange={(event) => setPrice(Number(event.target.value))}><option value="0">Tous les budgets</option><option value="1">€ · petit prix</option><option value="2">€€ · moyen</option><option value="3">€€€ · premium</option></select></label>
      <label>Distance <button className={radiusEnabled ? "radius-on" : ""} onClick={() => setRadiusEnabled(!radiusEnabled)}>{radiusEnabled ? "Activée" : "Désactivée"}</button><strong>{radius} km</strong><input type="range" min="2" max="100" value={radius} disabled={!radiusEnabled} onChange={(event) => setRadius(Number(event.target.value))}/></label>
      <label>Note minimale<select value={minRating} onChange={(event) => setMinRating(Number(event.target.value))}><option value="0">Toutes</option><option value="4">4,0+</option><option value="4.5">4,5+</option><option value="4.8">4,8+</option></select></label>
      <div className="check-row"><button className={tested ? "on" : ""} onClick={() => setTested(!tested)}>✓ Testé par nous</button>{muslimMode && <><button className={halal ? "on" : ""} onClick={() => setHalal(!halal)}>Halal</button><button className={noAlcohol ? "on" : ""} onClick={() => setNoAlcohol(!noAlcohol)}>Sans alcool</button><button className={nearMosque ? "on" : ""} onClick={() => setNearMosque(!nearMosque)}>Mosquée &lt; 500 m</button></>}<button className={romantic ? "on" : ""} onClick={() => setRomantic(!romantic)}>Pour deux</button><button className={calm ? "on" : ""} onClick={() => setCalm(!calm)}>Calme</button><button className={openNow ? "on" : ""} onClick={() => setOpenNow(!openNow)}>Ouvert en WITA</button></div>
    </section>}
    <div className="results-bar"><span><b>{results.length}</b> lieux</span><select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}><option value="distance">Plus proches</option><option value="rating">Mieux notés</option><option value="price">Prix croissant</option></select><div><button className={view === "list" ? "active" : ""} onClick={() => setView("list")}>☰</button><button className={view === "map" ? "active" : ""} onClick={() => setView("map")}>⌖</button></div></div>
    {view === "map" ? <ExplorerMap items={results} onSelect={setDetail} /> : <div className="explorer-list">{results.slice(0, visible).map((place, index) => <PlaceResultCard key={place.id} place={place} index={index} favorite={favorites.includes(place.id)} onFavorite={() => toggleFavorite(place.id)} onOpen={() => setDetail(place)} />)}{visible < results.length && <button className="load-more" onClick={() => setVisible((value) => value + 14)}>Voir plus de lieux</button>}{!results.length && <div className="empty-state"><span>⌕</span><h3>Aucun lieu trouvé</h3><p>Filtres responsables : {activeFilterLabels.join(", ") || "aucun"}.</p><button onClick={resetFilters}>Tout réinitialiser</button></div>}</div>}
    {detail && <PlaceDetail muslimMode={muslimMode} place={detail} distance={position ? distanceKm(position, detail) : distanceKm(user, detail)} favorite={favorites.includes(detail.id)} visited={visited.includes(detail.id)} canCheckIn={!!position && distanceKm(position, detail) <= .2} close={() => setDetail(null)} toggleFavorite={() => toggleFavorite(detail.id)} checkIn={() => checkIn(detail.id)} concierge={() => concierge(detail)} />}
  </div>;
}

function PlaceResultCard({ place, index, favorite, onFavorite, onOpen }: { place: Place & { distance: number }; index: number; favorite: boolean; onFavorite: () => void; onOpen: () => void }) {
  return <article className="result-card-place" style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}><button className="result-main" onClick={onOpen}><div className={`result-photo category-${place.category}`}><img src={place.photos[0]} alt="" loading="lazy"/><span>{categoryMeta[place.category].icon}</span>{place.tested_by_us && <b>Testé</b>}</div><div className="result-copy"><small>{place.city} · {place.subcategory}</small><h2>{place.name}</h2><p>{place.specialty || place.description}</p><div><span>★ {place.rating?.toFixed(1) || "—"}</span><span>{place.distance < 1 ? `${Math.round(place.distance * 1000)} m` : `${place.distance.toFixed(1)} km`}</span><span>{place.price_range || "Prix à confirmer"}</span></div></div></button><button className={`heart ${favorite ? "on" : ""}`} onClick={onFavorite} aria-label="Ajouter aux favoris"><Heart fill={favorite ? "currentColor" : "none"}/></button>{place.category === "restaurant" && <a className="card-map-link" href={place.maps_url} target="_blank" rel="noreferrer"><MapPinned/> Voir sur la carte</a>}</article>;
}

function ExplorerMap({ items, onSelect }: { items: (Place & { distance: number })[]; onSelect: (place: Place) => void }) {
  const node = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    let disposed = false;
    (async () => {
      const L = await import("leaflet");
      if (!node.current || disposed) return;
      map = L.map(node.current, { center: [-8.72, 116.25], zoom: 9, minZoom: 8, maxZoom: 15, maxBounds: [[-9.4, 115.6], [-7.7, 117.2]], maxBoundsViscosity: 1, zoomControl: false });
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", { attribution: "© OpenStreetMap · CARTO" }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);
      items.slice(0, 120).forEach((place) => {
        const meta = categoryMeta[place.category];
        const icon = L.divIcon({ className: "explorer-pin-wrap", html: `<span class="explorer-pin category-${place.category}">${meta.icon}</span>`, iconSize: [34, 40], iconAnchor: [17, 36] });
        L.marker([place.lat, place.lng], { icon }).addTo(map!).on("click", () => onSelect(place));
      });
    })();
    return () => { disposed = true; map?.remove(); };
  }, [items, onSelect]);
  return <div className="explorer-map" ref={node}/>;
}

function PlaceDetail({ place, distance, favorite, visited, canCheckIn, close, toggleFavorite, checkIn, concierge, muslimMode }: { place: Place; distance: number; favorite: boolean; visited: boolean; canCheckIn: boolean; close: () => void; toggleFavorite: () => void; checkIn: () => void; concierge: () => void; muslimMode: boolean }) {
  const whatsApp = place.whatsapp?.replace(/[^0-9]/g, "");
  return <div className="detail-backdrop" onMouseDown={close}><article className="place-detail" onMouseDown={(event) => event.stopPropagation()}><button className="detail-close" onClick={close}>×</button><div className="detail-gallery"><img src={place.photos[0]} alt={place.name}/><span>{categoryMeta[place.category].label}</span></div><div className="detail-body"><div className="eyebrow">{place.city} · {place.island}</div><h2>{place.name}</h2><div className="detail-stats"><span>★ {place.rating?.toFixed(1) || "—"}</span><span>⌖ {distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`}</span><span>{place.price_range || "Prix à confirmer"}</span></div><p>{place.description}</p>{place.mosquee_proche && <div className="mosque-near">◒ Mosquée la plus proche : <strong>{place.mosquee_proche.nom}</strong>, à {place.mosquee_proche.distance_m} m</div>}{place.specialty && <div className="specialty"><small>LA SPÉCIALITÉ</small><strong>{place.specialty}</strong></div>}{place.vigilance && <div className="vigilance"><span>!</span><div><strong>À savoir avant d’y aller</strong><p>{place.vigilance}</p></div></div>}<div className="practical"><div><small>Horaires</small><strong>{place.opening_hours || "À confirmer"}</strong></div><div><small>Meilleur moment</small><strong>{place.best_time || "Toute la journée"}</strong></div>{place.level && <div><small>Niveau</small><strong>{place.level}</strong></div>}</div><button className={`checkin ${visited ? "done" : ""}`} disabled={!canCheckIn || visited} onClick={checkIn}>{visited ? "✓ Lieu visité" : canCheckIn ? "⌖ Valider ma visite" : "Check-in disponible à moins de 200 m"}</button><div className="tag-list">{place.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="detail-actions"><a href={place.maps_url} target="_blank" rel="noreferrer">↗ Itinéraire</a>{whatsApp && <a className="whatsapp" href={`https://wa.me/${whatsApp}`} target="_blank" rel="noreferrer">◉ WhatsApp</a>}<button className={favorite ? "favorite" : ""} onClick={toggleFavorite}>♥ {favorite ? "Dans mes favoris" : "Ajouter aux favoris"}</button><button className="concierge" onClick={concierge}>✦ Demander à la conciergerie</button></div></div></article></div>;
}

function Globe({ onLombok, position, geoStatus, requestPosition }: { onLombok: () => void; position: UserPosition | null; geoStatus: "loading" | "ready" | "denied"; requestPosition: () => void }) {
  const host = useRef<HTMLDivElement>(null);
  const resetView = useRef<(() => void) | null>(null);
  const [regional, setRegional] = useState(false);

  useEffect(() => {
    if (regional) return;
    const element = host.current;
    if (!element) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, element.clientWidth / element.clientHeight, 0.1, 100);
    camera.position.set(0, 0.1, 3.45);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(element.clientWidth, element.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    element.appendChild(renderer.domElement);

    const world = new THREE.Group();
    scene.add(world);
    const texture = new THREE.TextureLoader().load("/earth-blue-marble.png");
    texture.colorSpace = THREE.SRGBColorSpace;
    const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 96), new THREE.ShaderMaterial({
      uniforms: { globeMap: { value: texture } },
      vertexShader: "varying vec2 uvMap; varying vec3 worldNormal; void main(){ uvMap=uv; worldNormal=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
      fragmentShader: `
        uniform sampler2D globeMap; varying vec2 uvMap; varying vec3 worldNormal;
        void main(){
          vec3 src=texture2D(globeMap,uvMap).rgb;
          float light=dot(worldNormal,normalize(vec3(-0.6,0.7,1.0)))*0.48+0.52;
          vec3 color=pow(src,vec3(1.06))*vec3(0.72,0.82,0.94);
          color*=mix(0.28,1.04,smoothstep(0.0,1.0,light));
          float rim=pow(1.0-max(0.0,dot(worldNormal,vec3(0.0,0.0,1.0))),2.0);
          gl_FragColor=vec4(mix(color,vec3(0.13,0.55,0.82),rim*0.24),1.0);
        }`
    }));
    world.add(earth);

    const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(1.035, 96, 96), new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      vertexShader: "varying vec3 n; void main(){ n=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
      fragmentShader: "varying vec3 n; void main(){ float i=pow(0.72-dot(n,vec3(0.0,0.0,1.0)),2.2); gl_FragColor=vec4(0.12,0.55,0.95,1.0)*i; }"
    }));
    world.add(atmosphere);

    const target = position || { lat: -8.65, lng: 116.32 };
    const lat = THREE.MathUtils.degToRad(target.lat);
    const lon = THREE.MathUtils.degToRad(target.lng);
    const markerPosition = new THREE.Vector3(-Math.cos(lat) * Math.cos(lon + Math.PI), Math.sin(lat), Math.cos(lat) * Math.sin(lon + Math.PI)).multiplyScalar(1.025);
    const marker = new THREE.Mesh(new THREE.SphereGeometry(0.032, 24, 24), new THREE.MeshBasicMaterial({ color: 0xff765e }));
    marker.position.copy(markerPosition);
    const pulse = new THREE.Mesh(new THREE.RingGeometry(0.045, 0.065, 40), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8, side: THREE.DoubleSide }));
    pulse.position.copy(markerPosition).multiplyScalar(1.005);
    pulse.lookAt(markerPosition.clone().multiplyScalar(2));
    world.add(marker, pulse);

    scene.add(new THREE.HemisphereLight(0xd9f4ff, 0x182923, 2.4));
    const sun = new THREE.DirectionalLight(0xfff0d2, 3.5); sun.position.set(-3, 2, 4); scene.add(sun);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.055; controls.enablePan = false;
    controls.minDistance = 1.65; controls.maxDistance = 5; controls.rotateSpeed = 0.58; controls.zoomSpeed = 0.7;
    const focusPosition = () => { world.rotation.set(-lat * 0.35, Math.atan2(-markerPosition.x, markerPosition.z), 0); camera.position.set(0, 0.08, 3.05); controls.update(); };
    resetView.current = focusPosition; window.setTimeout(focusPosition, 250);

    let frame = 0; let dragging = false;
    controls.addEventListener("start", () => { dragging = true; });
    controls.addEventListener("end", () => { dragging = false; });
    const animate = () => { frame = requestAnimationFrame(animate); if (!dragging) world.rotation.y += 0.00045; const pulseScale = 1 + Math.sin(performance.now() * 0.004) * 0.18; pulse.scale.setScalar(pulseScale); controls.update(); renderer.render(scene, camera); };
    animate();
    const resize = () => { if (!element) return; camera.aspect = element.clientWidth / element.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(element.clientWidth, element.clientHeight); };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); controls.dispose(); renderer.dispose(); texture.dispose(); element.replaceChildren(); };
  }, [regional, position]);

  if (regional) return <RegionMap close={() => setRegional(false)} onLombok={onLombok} />;

  return <section className="globe-stage" aria-label="Globe terrestre interactif centré sur Lombok">
    <div className="space-glow"/><div className="cloud cloud-one"/><div className="cloud cloud-two"/><div className="globe-canvas" ref={host}/>
    <div className="globe-tip">{geoStatus === "loading" ? "Localisation en cours…" : "Glisse pour explorer · Pince pour zoomer"}</div>
    <button className="lombok-label" onClick={() => { setRegional(true); onLombok(); }}><span>●</span><b>Explorer l’Indonésie</b><small>Lombok et les îles voisines →</small></button>
    <button className="globe-reset" onClick={() => { resetView.current?.(); onLombok(); }} aria-label="Recentrer sur Lombok">◎</button>
    {geoStatus === "denied" && <button className="geo-enable" onClick={requestPosition}>⌖ Activer ma position</button>}
  </section>;
}

function RegionMap({ close, onLombok }: { close: () => void; onLombok: () => void }) {
  const mapNode = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let disposed = false;
    let map: import("leaflet").Map | undefined;
    (async () => {
      const L = await import("leaflet");
      if (disposed || !mapNode.current) return;
      const indonesiaBounds: import("leaflet").LatLngBoundsExpression = [[-12.5, 94], [8, 142]];
      map = L.map(mapNode.current, { center: [-3.2, 118.2], zoom: 5, minZoom: 5, maxZoom: 13, maxBounds: indonesiaBounds, maxBoundsViscosity: 1, zoomControl: false, attributionControl: true });
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", { maxZoom: 19, attribution: "© OpenStreetMap · CARTO" }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);
      const locations = [
        { name: "Lombok", subtitle: "Ton point de départ", lat: -8.58, lon: 116.32, color: "#2E7D8A", featured: true },
        { name: "Bali", subtitle: "Culture & plages", lat: -8.34, lon: 115.09, color: "#C9683F" },
        { name: "Komodo", subtitle: "Parc national", lat: -8.55, lon: 119.49, color: "#C9683F" },
        { name: "Java", subtitle: "Volcans & villes", lat: -7.8, lon: 110.36, color: "#C9683F" },
        { name: "Sulawesi", subtitle: "Nature sauvage", lat: -2.0, lon: 120.1, color: "#C9683F" },
        { name: "Sumatra", subtitle: "Jungle & lacs", lat: 0.4, lon: 101.7, color: "#C9683F" },
      ];
      locations.forEach((location) => {
        const icon = L.divIcon({ className: "island-marker-wrap", html: `<span class="island-marker ${location.featured ? "featured" : ""}" style="--marker:${location.color}">●</span><b>${location.name}</b>`, iconSize: [72, 44], iconAnchor: [21, 36] });
        const marker = L.marker([location.lat, location.lon], { icon }).addTo(map!);
        marker.bindPopup(`<strong>${location.name}</strong><br><span>${location.subtitle}</span>`, { closeButton: false, offset: [0, -8] });
        if (location.featured) marker.on("click", () => { map?.flyTo([location.lat, location.lon], 9, { duration: 1.2 }); onLombok(); });
      });
      window.setTimeout(() => map?.invalidateSize(), 50);
    })();
    return () => { disposed = true; map?.remove(); };
  }, [onLombok]);
  return <section className="region-map-stage" aria-label="Carte interactive de l’Indonésie">
    <div ref={mapNode} className="region-map"/>
    <div className="region-title"><small>CARTE DES ÎLES</small><strong>Indonésie</strong><span>Explore Lombok et ses voisines</span></div>
    <button className="back-globe" onClick={close}>← Globe</button>
    <div className="region-limit">Navigation limitée à l’Indonésie</div>
  </section>;
}

function PlacesView({ title, favorites, toggleFavorite, setModal }: { title: string; favorites: string[]; toggleFavorite: (s: string) => void; setModal: (m: "place") => void }) {
  const favoritePlaces = allPlaces.filter((place) => favorites.includes(place.id));
  return <><div className="eyebrow">Ton carnet personnel</div><h1>{title}</h1><p className="lead">Les endroits que tu as testés et que tu recommandes.</p>
    <div className="filter-row"><button className="selected">Tous</button><button>Manger</button><button>Bouger</button><button>Découvrir</button></div>
    <div className="place-list">{favoritePlaces.length ? favoritePlaces.map(place => <article className="place-card" key={place.id}><div className="place-art blue">{categoryMeta[place.category].icon}</div><div><small>{place.subcategory}</small><h3>{place.name}</h3><p>📍 {place.city}, {place.island}</p></div><button className="loved" onClick={() => toggleFavorite(place.id)} aria-label="Retirer des favoris">♥</button></article>) : <div className="empty-state"><span>♡</span><h3>Ton carnet est encore vide</h3><p>Ajoute tes premiers coups de cœur depuis Explorer.</p></div>}</div>
    <button className="primary wide" onClick={() => setModal("place")}>＋ Ajouter une adresse</button>
  </>;
}

function RequestsView({ title, requests, setModal }: { title: string; requests: Request[]; setModal: (m: "request") => void }) {
  return <><div className="eyebrow">Ta conciergerie</div><h1>{title}</h1><p className="lead">Garde un œil sur tout ce que tu dois organiser.</p>
    <div className="request-list">{requests.map((request) => <article className="request-card" key={request.id}><div className="status-dot"/><div><span className={`badge ${request.status === "Confirmé" ? "confirmed" : ""}`}>{request.status}</span><h3>{request.title}</h3><p>{request.detail}</p></div><button>›</button></article>)}</div>
    <button className="primary wide" onClick={() => setModal("request")}>＋ Nouvelle demande</button>
  </>;
}

function ProfileView({ title, notify, dark, toggleDark, visited, muslimMode, toggleMuslimMode }: { title: string; notify: (s: string) => void; dark: boolean; toggleDark: () => void; visited: string[]; muslimMode: boolean; toggleMuslimMode: () => void }) {
  const [currency, setCurrency] = useState("EUR");
  useEffect(() => { setCurrency(localStorage.getItem("my-lombok-currency") || "EUR"); }, []);
  const percent = Math.round(visited.length / allPlaces.length * 100);
  return <><div className="eyebrow">Tes informations</div><h1>{title}</h1><div className="profile-card"><div className="profile-avatar">○</div><div><h2>Mon profil voyageur</h2><p>Séjour à Lombok · paramètres locaux</p></div></div>
    <div className="trip-progress"><div><strong>Ton exploration de Lombok</strong><span>{percent}%</span></div><div className="progress"><i style={{ width: `${percent}%` }}/></div><p>{visited.length} lieux visités sur {allPlaces.length} · Kuta/Mandalika, Gerupuk, Selong Belanak, Tetebatu, Rinjani et Gili</p></div>
    <label className="currency-choice"><span>Devise d’affichage</span><select value={currency} onChange={(event) => { setCurrency(event.target.value); localStorage.setItem("my-lombok-currency", event.target.value); }}>{["EUR","USD","GBP","CHF","AUD","SGD","MYR","SAR","AED","IDR"].map((code) => <option key={code}>{code}</option>)}</select></label>
    <div className="settings"><button className="muslim-setting" onClick={toggleMuslimMode}><span>☾</span><b><small>PRÉFÉRENCE DE SÉJOUR</small>Voyage musulman</b><em className={muslimMode ? "switch on" : "switch"}><i/></em></button><button onClick={() => notify("Tes informations sont à jour")}><span>⌂</span><b>Mon logement</b><em>›</em></button><button onClick={() => notify("Tes contacts sont disponibles hors ligne")}><span>☏</span><b>Mes contacts utiles</b><em>›</em></button><button onClick={() => notify("Mode hors ligne activé")}><span>↓</span><b>Accès hors ligne</b><em>›</em></button><button onClick={toggleDark}><span>{dark ? "☀" : "◐"}</span><b>Mode {dark ? "clair" : "sombre"}</b><em>›</em></button></div>
  </>;
}

function Modal({ type, close, addRequest, notify, draft = "" }: { type: "request" | "place"; close: () => void; addRequest: (d: FormData) => void; notify: (s: string) => void; draft?: string }) {
  return <div className="modal-backdrop" onMouseDown={close}><section className="modal" onMouseDown={e => e.stopPropagation()}><div className="modal-handle"/><button className="close" onClick={close}>×</button><span className="modal-icon">{type === "request" ? "✦" : "♡"}</span><h2>{type === "request" ? "De quoi as-tu besoin ?" : "Nouvelle bonne adresse"}</h2><p>{type === "request" ? "Décris ta demande, même en quelques mots." : "Ajoute un lieu à ton carnet personnel."}</p>
    <form action={type === "request" ? addRequest : () => { close(); notify("Adresse ajoutée à ton carnet"); }}><label>{type === "request" ? "Ma demande" : "Nom du lieu"}<input name="title" required defaultValue={draft} placeholder={type === "request" ? "Ex. Un scooter pour un mois" : "Ex. Café Mana"}/></label><label>Précisions<textarea placeholder="Lieu, date, budget…" /></label><button className="primary" type="submit">{type === "request" ? "Envoyer ma demande" : "Enregistrer l’adresse"}</button></form></section></div>;
}
