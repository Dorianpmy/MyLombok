"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "leaflet/dist/leaflet.css";
import { categoryMeta, distanceKm, places as allPlaces, type Place, type PlaceCategory } from "./data/places";
import { getDistanceOrigin, isOpenAtLombokTime, normalizeCategory, withinOptionalRadius } from "./lib/explorer-filters";
import { CalculationMethod, Coordinates, PrayerTimes } from "adhan";
import {
  Activity,
  BadgeCheck,
  BookOpen,
  CalendarDays,
  Car,
  ChevronRight,
  CloudDownload,
  Compass,
  Download,
  Grid2X2,
  Heart,
  Home as HomeIcon,
  House,
  Landmark,
  List,
  LocateFixed,
  MapPin,
  MapPinned,
  MessageCircle,
  MoonStar,
  Mountain,
  Phone,
  Plane,
  Plus,
  Sailboat,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Sunset,
  Timer,
  Trees,
  UserRound,
  UtensilsCrossed,
  Waves,
  type LucideIcon,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "./lib/supabase";

type Tab = "home" | "explorer" | "requests" | "profile";
type Request = { id: number; title: string; detail: string; status: "En cours" | "Confirmé" };
type UserPosition = { lat: number; lng: number };
type TripPlan = { arrival: string; departure: string; travelers: string; interests: string[]; createdAt: string };
type UserPreferences = { dark: boolean; muslimMode: boolean; tripPlan?: TripPlan | null };
type ExplorerCategory = PlaceCategory | "activite" | "all";

const MYLOMBOK_WHATSAPP = "33763664857";
const activityTerms = ["activité", "surf", "snorkeling", "plongée", "trek", "randonnée", "bateau", "yoga", "massage", "spa", "cours", "tour", "pêche"];

function isActivityPlace(place: Place) {
  const searchable = `${place.subcategory} ${place.specialty || ""} ${place.tags.join(" ")}`.toLocaleLowerCase("fr");
  return activityTerms.some((term) => searchable.includes(term));
}

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try { return JSON.parse(value) as T; } catch { return fallback; }
}

function normalizeWhatsAppNumber(value: string | null) {
  if (!value) return null;
  const digits = value.replace(/[^0-9]/g, "");
  return digits.length >= 8 && digits.length <= 15 ? digits : null;
}

function providerWhatsAppUrl(place: Place) {
  const number = normalizeWhatsAppNumber(place.whatsapp);
  if (!number) return null;
  const message = `Bonjour ${place.name}, je vous contacte depuis MyLombok au sujet de vos services.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

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
  { id: "requests" as Tab, Icon: MessageCircle, label: "Conciergerie" },
  { id: "profile" as Tab, Icon: UserRound, label: "Profil" },
];

const categoryIcons: Record<PlaceCategory, LucideIcon> = {
  restaurant: UtensilsCrossed,
  plage: Waves,
  service: Sparkles,
  nature: Trees,
  excursion: Sailboat,
  culture: Landmark,
};

function CategoryIcon({ category }: { category: PlaceCategory }) {
  const Icon = categoryIcons[category];
  return <Icon aria-hidden="true" strokeWidth={1.8}/>;
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("home");
  const [modal, setModal] = useState<"request" | "place" | null>(null);
  const [toast, setToast] = useState("");
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [position, setPosition] = useState<UserPosition | null>(null);
  const [geoStatus, setGeoStatus] = useState<"loading" | "ready" | "denied">("loading");
  const [requestDraft, setRequestDraft] = useState("");
  const [dark, setDark] = useState(false);
  const [muslimMode, setMuslimMode] = useState(false);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [visited, setVisited] = useState<string[]>([]);
  const [accountUser, setAccountUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [localReady, setLocalReady] = useState(false);
  const [cloudReady, setCloudReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("my-lombok-requests");
    if (saved) setRequests(safeParse<Request[]>(saved, initialRequests));
    const cachedFavorites = localStorage.getItem("my-lombok-favorites");
    if (cachedFavorites) setFavorites(safeParse<string[]>(cachedFavorites, []));
    setDark(localStorage.getItem("my-lombok-theme") === "dark");
    setMuslimMode(localStorage.getItem("my-lombok-muslim-mode") === "true");
    const savedTripPlan = localStorage.getItem("my-lombok-trip-plan"); if (savedTripPlan) setTripPlan(safeParse<TripPlan | null>(savedTripPlan, null));
    const savedVisited = localStorage.getItem("my-lombok-visited"); if (savedVisited) setVisited(safeParse<string[]>(savedVisited, []));
    setLocalReady(true);
    requestPosition();
    const supabase = getSupabaseBrowserClient();
    if (!supabase) { setAuthLoading(false); return; }
    supabase.auth.getSession().then(({ data }) => { setAccountUser(data.session?.user ?? null); setAuthLoading(false); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAccountUser(session?.user ?? null);
      setAuthLoading(false);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!localReady || !accountUser) { setCloudReady(false); return; }
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    let cancelled = false;
    setCloudReady(false);
    supabase.from("user_state").select("favorites, visited, requests, preferences").eq("user_id", accountUser.id).maybeSingle().then(({ data }) => {
      if (cancelled) return;
      if (data) {
        if (Array.isArray(data.favorites)) setFavorites(data.favorites);
        if (Array.isArray(data.visited)) setVisited(data.visited);
        if (Array.isArray(data.requests)) setRequests(data.requests as Request[]);
        const preferences = data.preferences as Partial<UserPreferences> | null;
        if (typeof preferences?.dark === "boolean") setDark(preferences.dark);
        if (typeof preferences?.muslimMode === "boolean") setMuslimMode(preferences.muslimMode);
        if (preferences?.tripPlan) setTripPlan(preferences.tripPlan);
      }
      setCloudReady(true);
    });
    return () => { cancelled = true; };
  }, [accountUser, localReady]);

  useEffect(() => {
    if (!cloudReady || !accountUser) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const timer = window.setTimeout(() => {
      supabase.from("user_state").upsert({
        user_id: accountUser.id,
        favorites,
        visited,
        requests,
        preferences: { dark, muslimMode, tripPlan },
        updated_at: new Date().toISOString(),
      }).then(({ error }) => { if (error) console.warn("Synchronisation MyLombok indisponible", error.message); });
    }, 450);
    return () => window.clearTimeout(timer);
  }, [accountUser, cloudReady, dark, favorites, muslimMode, requests, tripPlan, visited]);

  const title = useMemo(() => ({ home: "Prépare ton séjour à Lombok", explorer: "Explorer Lombok", requests: "Ma conciergerie", profile: "Mon séjour" }[tab]), [tab]);

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
    const title = String(formData.get("title") || "Nouvelle demande").trim().slice(0, 180);
    const details = String(formData.get("details") || "").trim().slice(0, 1200);
    const next = [{ id: Date.now(), title, detail: "À organiser · Dès que possible", status: "En cours" as const }, ...requests];
    setRequests(next);
    localStorage.setItem("my-lombok-requests", JSON.stringify(next));
    setModal(null);
    setTab("requests");
    const message = [`Bonjour MyLombok,`, ``, title, details, ``, `Envoyé depuis l’application MyLombok`].filter(Boolean).join("\n");
    window.open(`https://wa.me/${MYLOMBOK_WHATSAPP}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    notify("WhatsApp MyLombok ouvert — ta demande est prête");
  }

  function toggleFavorite(placeId: string) {
    const active = !favorites.includes(placeId);
    const next = active ? [...favorites, placeId] : favorites.filter((item) => item !== placeId);
    setFavorites(next);
    localStorage.setItem("my-lombok-favorites", JSON.stringify(next));
  }

  async function signOut() {
    await getSupabaseBrowserClient()?.auth.signOut();
    setAccountUser(null);
    setCloudReady(false);
    notify("Tu es déconnecté");
  }

  return (
    <main className={`app-shell tab-${tab} ${dark ? "dark" : ""} ${muslimMode ? "muslim-on" : "muslim-off"}`}>
      <section className="phone-app">
        <header className="topbar">
          <button className="brand" onClick={() => setTab("home")} aria-label="Retour à l'accueil">
            <img src="/mylombok-logo.svg" alt="MyLombok"/>
            <span className="brand-copy"><b>MyLombok</b><small>LOCAL CONCIERGE</small></span>
          </button>
          <select className="destination" aria-label="Destination"><option>Lombok</option><option disabled>Bali · bientôt</option><option disabled>Gili · bientôt</option><option disabled>Sumbawa · bientôt</option><option disabled>Flores · bientôt</option></select>
          <button className={`avatar ${accountUser ? "signed-in" : ""}`} onClick={() => setTab("profile")} aria-label="Ouvrir mon profil">{accountUser?.user_metadata?.avatar_url ? <img src={accountUser.user_metadata.avatar_url} alt="" referrerPolicy="no-referrer"/> : (accountUser?.email?.slice(0, 1).toUpperCase() || "○")}</button>
        </header>

        <div className="content">
          <div className="tab-stage" key={tab}>
            {tab === "home" && <HomeView title={title} requests={requests} setTab={setTab} setModal={setModal} setRequestDraft={setRequestDraft} notify={notify} position={position} geoStatus={geoStatus} requestPosition={requestPosition} visited={visited} muslimMode={muslimMode} tripPlan={tripPlan} saveTripPlan={(plan) => { setTripPlan(plan); localStorage.setItem("my-lombok-trip-plan", JSON.stringify(plan)); }} />}
            {tab === "explorer" && <ExplorerView muslimMode={muslimMode} position={position} favorites={favorites} toggleFavorite={toggleFavorite} setModal={setModal} setRequestDraft={setRequestDraft} visited={visited} checkIn={(id) => { const next = Array.from(new Set([...visited, id])); setVisited(next); localStorage.setItem("my-lombok-visited", JSON.stringify(next)); }} />}
            {tab === "requests" && <RequestsView title={title} requests={requests} setModal={setModal} />}
            {tab === "profile" && <ProfileView title={title} notify={notify} dark={dark} visited={visited} favoriteCount={favorites.length} requestCount={requests.length} muslimMode={muslimMode} accountUser={accountUser} authLoading={authLoading} openAuth={() => setAuthOpen(true)} signOut={signOut} toggleMuslimMode={() => { const next = !muslimMode; setMuslimMode(next); localStorage.setItem("my-lombok-muslim-mode", String(next)); }} toggleDark={() => { const next = !dark; setDark(next); localStorage.setItem("my-lombok-theme", next ? "dark" : "light"); }} />}
          </div>
        </div>

        <nav className="bottom-nav" aria-label="Navigation principale">
          <div
            className="nav-rail"
            style={{ "--nav-offset": `${Math.max(0, nav.findIndex((item) => item.id === tab)) * 100}%` } as React.CSSProperties}
          >
            {nav.map((item) => <button key={item.id} className={tab === item.id ? "active" : ""} aria-current={tab === item.id ? "page" : undefined} aria-label={item.label} onClick={() => setTab(item.id)}><span><item.Icon strokeWidth={1.8}/></span><b>{item.label}</b></button>)}
          </div>
          <button className="nav-quick-request" onClick={() => { setRequestDraft(""); setModal("request"); }} aria-label="Nouvelle demande à la conciergerie"><Plus strokeWidth={2}/></button>
        </nav>
      </section>

      {modal && <Modal type={modal} close={() => { setModal(null); setRequestDraft(""); }} addRequest={addRequest} notify={notify} draft={requestDraft} />}
      {authOpen && <AccountModal close={() => setAuthOpen(false)} notify={notify} />}
      {toast && <div className="toast" role="status">✓ {toast}</div>}
    </main>
  );
}

function HomeView({ title, requests, setTab, setModal, setRequestDraft, notify, position, geoStatus, requestPosition, visited, muslimMode, tripPlan, saveTripPlan }: { title: string; requests: Request[]; setTab: (t: Tab) => void; setModal: (m: "request" | "place") => void; setRequestDraft: (value: string) => void; notify: (s: string) => void; position: UserPosition | null; geoStatus: "loading" | "ready" | "denied"; requestPosition: () => void; visited: string[]; muslimMode: boolean; tripPlan: TripPlan | null; saveTripPlan: (plan: TripPlan) => void }) {
  const [selected, setSelected] = useState("Kuta Lombok");
  const [category, setCategory] = useState("Explorer");
  const mapSpots = [
    { name: "Kuta Lombok", kind: "Ton quartier", Icon: MapPin, x: 52, y: 78, note: `${allPlaces.filter((place) => place.city === "Kuta").length} adresses autour de toi` },
    { name: "Tanjung Aan", kind: "Plage", Icon: Waves, x: 70, y: 72, note: "25 min · Idéal ce matin" },
    { name: "Tetebatu", kind: "Nature", Icon: Trees, x: 50, y: 48, note: "1 h 20 · Rizières & cascades" },
    { name: "Mont Rinjani", kind: "Aventure", Icon: Mountain, x: 62, y: 26, note: "2 h 10 · Guide recommandé" },
    { name: "Senggigi", kind: "Coucher de soleil", Icon: Sunset, x: 25, y: 48, note: "1 h 30 · Route panoramique" },
  ];
  const current = mapSpots.find((spot) => spot.name === selected) || mapSpots[0];
  const askConcierge = (subject: string) => {
    const dates = tripPlan ? ` du ${tripPlan.arrival} au ${tripPlan.departure}` : "";
    setRequestDraft(`${subject}${dates}`);
    setModal("request");
  };
  return <>
    <div className="map-head pretrip-head"><div><div className="eyebrow">CONCIERGERIE AVANT DÉPART</div><h1>{title}</h1></div><button className="weather" onClick={() => notify("Grand soleil · 29 °C")}>☀ <b>29°</b></button></div>
    <p className="lead">Dates, envies et transport : construis ton programme avec une équipe qui vit sur place.</p>
    <TripPlannerCard tripPlan={tripPlan} saveTripPlan={saveTripPlan} explore={() => setTab("explorer")} concierge={() => askConcierge("Je souhaite faire valider mon programme à Lombok")} notify={notify}/>
    <section className="pretrip-services" aria-label="Services à organiser avant le départ">
      <button onClick={() => askConcierge("Je souhaite réserver un transfert depuis l'aéroport")}><span><Plane strokeWidth={1.8}/></span><b>Transfert</b><small>Aéroport → logement</small></button>
      <button onClick={() => askConcierge("Je souhaite réserver un scooter")}><span><Car strokeWidth={1.8}/></span><b>Scooter</b><small>Livré à ton arrivée</small></button>
      <button onClick={() => setTab("explorer")}><span><Compass strokeWidth={1.8}/></span><b>Activités</b><small>Voir la sélection</small></button>
      <button onClick={() => askConcierge("J'ai besoin d'aide pour préparer mon séjour")}><span><MessageCircle strokeWidth={1.8}/></span><b>Conciergerie</b><small>Parler à l'équipe</small></button>
    </section>
    {muslimMode && <div className="home-widgets solo prayer-only"><PrayerWidget position={position}/></div>}
    <div className="home-section-title"><small>REPÉRER L’ÎLE</small><strong>Explore avant de réserver</strong></div>
    <div className="map-filters" aria-label="Catégories à explorer">{["Explorer", "Activités", "Manger", "Plages", "Services"].map((item) => <button key={item} aria-pressed={category === item} className={category === item ? "active" : ""} onClick={() => { setCategory(item); if (item === "Explorer" || item === "Activités") setTab("explorer"); else notify(`${item} affiché sur la carte`); }}>{item}</button>)}</div>
    <article className="map-place-card home-location-card"><div className="spot-thumb"><current.Icon strokeWidth={1.8}/></div><div><small>{current.kind}</small><h2>{current.name}</h2><p>{current.note}</p></div><button onClick={() => { setTab("explorer"); notify(`${current.name} ouvert dans Explorer`); }} aria-label={`Explorer ${current.name}`}><ChevronRight/></button></article>
    <Globe onLombok={() => { setSelected("Kuta Lombok"); notify("Bienvenue à Lombok"); }} position={position} geoStatus={geoStatus} requestPosition={requestPosition} />
    <div className="map-actions"><button className="map-request" onClick={() => setModal("request")}><span className="action-icon"><MessageCircle strokeWidth={1.8}/></span><b><small>CONCIERGERIE</small>Faire une demande</b></button><button className="airport-action" onClick={() => { setTab("requests"); notify("Réservation ouverte"); }}><span className="action-icon"><MapPinned strokeWidth={1.8}/></span><strong><small>PROCHAIN TRAJET</small>{requests[0]?.title || "Mes demandes"}</strong><ChevronRight/></button></div>
    <details className="home-currency"><summary>Convertir des roupies <span>Optionnel</span></summary><CurrencyConverter /></details>
  </>;
}

function TripPlannerCard({ tripPlan, saveTripPlan, explore, concierge, notify }: { tripPlan: TripPlan | null; saveTripPlan: (plan: TripPlan) => void; explore: () => void; concierge: () => void; notify: (message: string) => void }) {
  const today = new Date();
  const inDays = (days: number) => { const date = new Date(today); date.setDate(date.getDate() + days); return date.toISOString().slice(0, 10); };
  const [editing, setEditing] = useState(!tripPlan);
  const [compact, setCompact] = useState(true);
  const [arrival, setArrival] = useState(tripPlan?.arrival || inDays(30));
  const [departure, setDeparture] = useState(tripPlan?.departure || inDays(37));
  const [travelers, setTravelers] = useState(tripPlan?.travelers || "Couple");
  const [interests, setInterests] = useState<string[]>(tripPlan?.interests || ["Plages", "Nature"]);
  const interestOptions = ["Plages", "Nature", "Activités", "Surf", "Culture", "Food"];
  const arrivalDate = tripPlan ? new Date(`${tripPlan.arrival}T12:00:00`) : null;
  const daysBefore = arrivalDate ? Math.ceil((arrivalDate.getTime() - Date.now()) / 86400000) : null;
  const stayLength = tripPlan ? Math.max(1, Math.ceil((new Date(`${tripPlan.departure}T12:00:00`).getTime() - arrivalDate!.getTime()) / 86400000)) : 0;
  const dateLabel = (value: string) => new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" }).format(new Date(`${value}T12:00:00`));

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!arrival || !departure || departure <= arrival) { notify("Choisis une date de retour après ton arrivée"); return; }
    saveTripPlan({ arrival, departure, travelers, interests, createdAt: new Date().toISOString() });
    setEditing(false);
    notify("Ton séjour est prêt à être organisé");
  }

  if (compact) return <button className="trip-planner trip-planner-collapsed" onClick={() => setCompact(false)}><span><CalendarDays/></span><div><small>MON PROGRAMME</small><strong>Dates et envies de séjour</strong></div><em>Déplier <ChevronRight/></em></button>;

  if (tripPlan && !editing) return <section className="trip-planner trip-planner-ready">
    <header><span><CalendarDays strokeWidth={1.8}/></span><div><small>TON VOYAGE À LOMBOK</small><h2>{daysBefore !== null && daysBefore > 0 ? `Départ dans ${daysBefore} jours` : daysBefore === 0 ? "Départ aujourd’hui" : "Séjour en cours"}</h2><p>{dateLabel(tripPlan.arrival)} → {dateLabel(tripPlan.departure)} · {stayLength} nuits · {tripPlan.travelers}</p></div><button onClick={() => setEditing(true)}>Modifier</button></header>
    <div className="trip-plan-preview"><span><b>01</b>Arrivée & transfert</span><span><b>02</b>{tripPlan.interests[0] || "Découverte"}</span><span><b>03</b>{tripPlan.interests[1] || "Temps libre"}</span></div>
    <div className="trip-planner-actions"><button onClick={explore}>Choisir mes étapes <ChevronRight/></button><button className="validate-plan" onClick={concierge}><MessageCircle/> Faire valider</button></div>
  </section>;

  return <form className="trip-planner" onSubmit={submit}>
    <header><span><CalendarDays strokeWidth={1.8}/></span><div><small>MON PROGRAMME</small><h2>Quand viens-tu à Lombok ?</h2><p>Commence par les dates, on t’aide pour le reste.</p></div><button type="button" onClick={() => setCompact(true)}>Réduire</button></header>
    <div className="trip-dates"><label>ARRIVÉE<input type="date" min={inDays(0)} value={arrival} onChange={(event) => setArrival(event.target.value)}/></label><label>DÉPART<input type="date" min={arrival || inDays(1)} value={departure} onChange={(event) => setDeparture(event.target.value)}/></label></div>
    <div className="trip-choice"><small>JE VOYAGE</small><div>{["Solo", "Couple", "Famille", "Amis"].map((item) => <button type="button" key={item} aria-pressed={travelers === item} className={travelers === item ? "selected" : ""} onClick={() => setTravelers(item)}>{item}</button>)}</div></div>
    <div className="trip-choice"><small>MES ENVIES</small><div>{interestOptions.map((item) => <button type="button" key={item} aria-pressed={interests.includes(item)} className={interests.includes(item) ? "selected" : ""} onClick={() => setInterests(interests.includes(item) ? interests.filter((interest) => interest !== item) : [...interests, item])}>{item}</button>)}</div></div>
    <button className="trip-submit" type="submit"><Sparkles strokeWidth={1.8}/> Créer mon programme</button>
  </form>;
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
  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const previousDate = [...schedule].reverse().find((prayer) => prayer.date.getTime() <= now)?.date.getTime() || now - 6 * 3600000;
  const cycle = Math.max(1, next.date.getTime() - previousDate);
  const progress = Math.max(0, Math.min(1, 1 - remaining / cycle));
  const pad = (value: number) => String(value).padStart(2, "0");
  const lombokTime = new Intl.DateTimeFormat("fr-FR", { timeZone: "Asia/Makassar", hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date(now));
  const nearest = allPlaces.filter((place) => place.subcategory === "mosquée").sort((a, b) => distanceKm(coords, a) - distanceKm(coords, b))[0];
  useEffect(() => { localStorage.setItem(`my-lombok-prayers-${new Date().toISOString().slice(0, 10)}`, JSON.stringify(schedule.map((item) => ({ name: item.name, time: item.date.toISOString() })))); }, []);
  return <div className="prayer-widget"><span className="prayer-dial" style={{ "--prayer-progress": `${progress * 360}deg` } as React.CSSProperties}><Timer aria-hidden="true"/></span><div><small>LOMBOK · {lombokTime} WITA</small><strong>{next.name} à {new Intl.DateTimeFormat("fr-FR", { timeZone: "Asia/Makassar", hour: "2-digit", minute: "2-digit" }).format(next.date)}</strong><p><b>{pad(hours)}:{pad(minutes)}:{pad(seconds)}</b> avant la prochaine prière</p><em>{nearest?.name || "Mosquée locale"}</em></div></div>;
}

function CurrencyConverter() {
  const fallbackRates: Record<string, number> = { EUR: .000052, USD: .000061, GBP: .000045, CHF: .000048, AUD: .000091, SGD: .000078, MYR: .000258, SAR: .000229, AED: .000224 };
  const [amount, setAmount] = useState(1000000);
  const [currency, setCurrency] = useState("EUR");
  const [rate, setRate] = useState(fallbackRates.EUR);
  const [date, setDate] = useState("hors ligne");
  useEffect(() => {
    const cache = localStorage.getItem("my-lombok-rates");
    const saved = safeParse<{ savedAt: number; date: string; rates: Record<string, number> }>(cache, { savedAt: 0, date: "hors ligne", rates: {} });
    const cachedRate = Number(saved.rates?.[currency]);
    setRate(cachedRate || fallbackRates[currency]);
    setDate(cachedRate ? saved.date : "indicatif hors ligne");
    if (cachedRate && Date.now() - saved.savedAt < 86400000) return;
    fetch(`https://api.frankfurter.dev/v2/rate/IDR/${currency}`).then((response) => response.json()).then((data) => {
      const nextRates = { ...saved.rates, [currency]: data.rate };
      setRate(data.rate); setDate(data.date);
      localStorage.setItem("my-lombok-rates", JSON.stringify({ savedAt: Date.now(), date: data.date, rates: nextRates }));
    }).catch(() => {});
  }, [currency]);
  return <section className="converter"><div><small>CONVERTISSEUR HORS LIGNE</small><strong>{new Intl.NumberFormat("id-ID").format(amount)} Rp</strong><input aria-label="Montant en roupies" type="number" value={amount} onChange={(event) => setAmount(Number(event.target.value))}/></div><span>⇄</span><div><select value={currency} onChange={(event) => setCurrency(event.target.value)}>{["EUR","USD","GBP","CHF","AUD","SGD","MYR","SAR","AED"].map((code) => <option key={code}>{code}</option>)}</select><strong>{new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(amount * rate)}</strong><small>Taux du {date}</small></div><footer>Repères : warung ≈ 35k · plein scooter ≈ 45k · scooter-taxi ≈ 25k</footer></section>;
}

function ExplorerView({ position, favorites, toggleFavorite, setModal, setRequestDraft, visited, checkIn, muslimMode }: { position: UserPosition | null; favorites: string[]; toggleFavorite: (id: string) => void; setModal: (type: "request") => void; setRequestDraft: (value: string) => void; visited: string[]; checkIn: (id: string) => void; muslimMode: boolean }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ExplorerCategory>("all");
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
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const distanceOrigin = getDistanceOrigin(position);
  const user = distanceOrigin.position;
  const cities = Array.from(new Set(allPlaces.map((place) => place.city))).sort();

  const results = useMemo(() => allPlaces
    .map((place) => ({ ...place, distance: distanceKm(user, place) }))
    .filter((place) => {
      const text = `${place.name} ${place.city} ${place.subcategory} ${place.tags.join(" ")}`.toLowerCase();
      return (!query || text.includes(query.toLowerCase())) &&
        (muslimMode || place.subcategory !== "mosquée") &&
        (category === "all" || (category === "activite" ? isActivityPlace(place) : normalizeCategory(place.category) === category)) &&
        (city === "all" || place.city === city) &&
        (!price || place.price_level === price) &&
        (!tested || place.tested_by_us) &&
        (!favoritesOnly || favorites.includes(place.id)) &&
        (!halal || place.halal === "certifié" || place.halal === "sans porc ni alcool") &&
        (!noAlcohol || place.alcool_servi === false) &&
        (!romantic || place.ambiance.includes("romantique") || place.ambiance.includes("vue")) &&
        (!nearMosque || (place.mosquee_proche?.distance_m || Infinity) <= 500 || place.subcategory === "mosquée") &&
        (!calm || place.ambiance.includes("calme")) &&
        (!openNow || isOpenAtLombokTime(place.opening_hours)) &&
        withinOptionalRadius(place.distance, radiusEnabled, radius) && (place.rating || 0) >= minRating;
    })
    .sort((a, b) => sort === "rating" ? (b.rating || 0) - (a.rating || 0) : sort === "price" ? (a.price_level || 9) - (b.price_level || 9) : a.distance - b.distance),
  [query, category, city, price, tested, halal, noAlcohol, romantic, nearMosque, calm, openNow, radius, radiusEnabled, minRating, sort, user.lat, user.lng, muslimMode, favoritesOnly, favorites]);

  const activeFilterLabels = [query && "la recherche", favoritesOnly && "les favoris", category !== "all" && "la catégorie", city !== "all" && "la zone", price && "le prix", tested && "testé", halal && "halal", noAlcohol && "sans alcool", romantic && "pour deux", nearMosque && "mosquée proche", calm && "calme", openNow && "ouvert maintenant", radiusEnabled && "la distance", minRating && "la note"].filter(Boolean);
  function resetFilters() { setQuery(""); setFavoritesOnly(false); setCategory("all"); setCity("all"); setPrice(0); setTested(false); setHalal(false); setNoAlcohol(false); setRomantic(false); setNearMosque(false); setCalm(false); setOpenNow(false); setRadiusEnabled(false); setMinRating(0); }

  function concierge(place: Place) {
    setRequestDraft(`Demande concernant ${place.name}`);
    setDetail(null);
    setModal("request");
  }

  return <div className="explorer-view">
    <div className="eyebrow">Carnet local · {allPlaces.length} lieux</div>
    <div className="explorer-title"><div><h1>Explorer Lombok</h1><p>Les meilleures adresses, testées ou à découvrir.</p></div><span>🇮🇩</span></div>
    <label className="search-box"><span><Search/></span><input aria-label="Rechercher dans les lieux" value={query} onChange={(event) => { setQuery(event.target.value); setVisible(14); }} placeholder="Rechercher un lieu, une zone, une envie…"/><button type="button" onClick={() => setShowFilters(!showFilters)} className={showFilters ? "active" : ""} aria-label="Afficher les filtres" aria-expanded={showFilters} aria-controls="explorer-filters"><SlidersHorizontal/></button></label>
    {distanceOrigin.usingReference && <button className="distance-notice" onClick={() => setRadiusEnabled(false)}><LocateFixed/> Distances depuis Kuta — active ta position sur place</button>}
    <button className={`explorer-favorites ${favoritesOnly ? "on" : ""}`} aria-pressed={favoritesOnly} onClick={() => setFavoritesOnly(!favoritesOnly)}><Heart fill={favoritesOnly ? "currentColor" : "none"}/><span>Mes favoris</span><b>{favorites.length}</b></button>
    <div className="editorial-selections"><button className="couple-selection" onClick={() => { setRomantic(true); setCategory("all"); }}><span>01</span><div><small>SÉLECTION ÉDITORIALE</small><strong>Lombok à deux</strong><p>Dîners avec vue, criques calmes et parenthèses en duo</p></div><em>→</em></button><button className="couple-selection essential" onClick={() => { setTested(true); setRomantic(false); setCategory("all"); }}><span>02</span><div><small>LE CARNET LOCAL</small><strong>Nos essentiels</strong><p>Les adresses que l’on recommande les yeux fermés</p></div><em>→</em></button></div>
    <div className="category-scroll" aria-label="Catégories de lieux"><button aria-pressed={category === "all"} className={category === "all" ? "active" : ""} onClick={() => setCategory("all")}><span><Grid2X2/></span>Tout</button><button aria-pressed={category === "activite"} className={category === "activite" ? "active" : ""} onClick={() => { setCategory("activite"); setVisible(14); }}><span><Activity/></span>Activités</button>{(Object.entries(categoryMeta) as [PlaceCategory, { label: string; icon: string }][]).map(([key, meta]) => <button key={key} aria-pressed={category === key} className={category === key ? "active" : ""} onClick={() => { setCategory(key); setVisible(14); }}><span><CategoryIcon category={key}/></span>{meta.label}</button>)}</div>
    {showFilters && <section className="filter-panel" id="explorer-filters" aria-label="Filtres de recherche">
      <label>Zone<select value={city} onChange={(event) => setCity(event.target.value)}><option value="all">Toutes les zones</option>{cities.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label>Prix<select value={price} onChange={(event) => setPrice(Number(event.target.value))}><option value="0">Tous les budgets</option><option value="1">€ · petit prix</option><option value="2">€€ · moyen</option><option value="3">€€€ · premium</option></select></label>
      <label>Distance <button className={radiusEnabled ? "radius-on" : ""} onClick={() => setRadiusEnabled(!radiusEnabled)}>{radiusEnabled ? "Activée" : "Désactivée"}</button><strong>{radius} km</strong><input type="range" min="2" max="100" value={radius} disabled={!radiusEnabled} onChange={(event) => setRadius(Number(event.target.value))}/></label>
      <label>Note minimale<select value={minRating} onChange={(event) => setMinRating(Number(event.target.value))}><option value="0">Toutes</option><option value="4">4,0+</option><option value="4.5">4,5+</option><option value="4.8">4,8+</option></select></label>
      <div className="check-row"><button aria-pressed={tested} className={tested ? "on" : ""} onClick={() => setTested(!tested)}>✓ Testé par nous</button>{muslimMode && <><button aria-pressed={halal} className={halal ? "on" : ""} onClick={() => setHalal(!halal)}>Halal</button><button aria-pressed={noAlcohol} className={noAlcohol ? "on" : ""} onClick={() => setNoAlcohol(!noAlcohol)}>Sans alcool</button><button aria-pressed={nearMosque} className={nearMosque ? "on" : ""} onClick={() => setNearMosque(!nearMosque)}>Mosquée &lt; 500 m</button></>}<button aria-pressed={romantic} className={romantic ? "on" : ""} onClick={() => setRomantic(!romantic)}>Pour deux</button><button aria-pressed={calm} className={calm ? "on" : ""} onClick={() => setCalm(!calm)}>Calme</button><button aria-pressed={openNow} className={openNow ? "on" : ""} onClick={() => setOpenNow(!openNow)}>Ouvert en WITA</button></div>
    </section>}
    <div className="results-bar"><span><b>{results.length}</b> lieux</span><select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}><option value="distance">Plus proches</option><option value="rating">Mieux notés</option><option value="price">Prix croissant</option></select><div><button className={view === "list" ? "active" : ""} onClick={() => setView("list")} aria-label="Vue liste"><List/></button><button className={view === "map" ? "active" : ""} onClick={() => setView("map")} aria-label="Vue carte"><LocateFixed/></button></div></div>
    {view === "map" ? <ExplorerMap items={results} onSelect={setDetail} /> : <div className="explorer-list">{results.slice(0, visible).map((place, index) => <PlaceResultCard key={place.id} place={place} index={index} favorite={favorites.includes(place.id)} onFavorite={() => toggleFavorite(place.id)} onOpen={() => setDetail(place)} />)}{visible < results.length && <button className="load-more" onClick={() => setVisible((value) => value + 14)}>Voir plus de lieux</button>}{!results.length && <div className="empty-state"><span>⌕</span><h3>Aucun lieu trouvé</h3><p>Filtres responsables : {activeFilterLabels.join(", ") || "aucun"}.</p><button onClick={resetFilters}>Tout réinitialiser</button></div>}</div>}
    {detail && <PlaceDetail muslimMode={muslimMode} place={detail} distance={position ? distanceKm(position, detail) : distanceKm(user, detail)} favorite={favorites.includes(detail.id)} visited={visited.includes(detail.id)} canCheckIn={!!position && distanceKm(position, detail) <= .2} close={() => setDetail(null)} toggleFavorite={() => toggleFavorite(detail.id)} checkIn={() => checkIn(detail.id)} concierge={() => concierge(detail)} />}
  </div>;
}

function PlacePhoto({ place, className = "" }: { place: Place; className?: string }) {
  const [failed, setFailed] = useState(false);
  const source = place.photos.find((photo) => /^https?:\/\/|^\//.test(photo || ""));
  if (!source || failed) return <div className={`place-photo-fallback category-${place.category} ${className}`} role="img" aria-label={`Illustration ${categoryMeta[place.category].label}`}><CategoryIcon category={place.category}/><small>{categoryMeta[place.category].label}</small></div>;
  return <img className={className} src={source} alt={place.name} loading="lazy" referrerPolicy="no-referrer" onError={() => setFailed(true)}/>;
}

function PlaceResultCard({ place, index, favorite, onFavorite, onOpen }: { place: Place & { distance: number }; index: number; favorite: boolean; onFavorite: () => void; onOpen: () => void }) {
  return <article className="result-card-place" style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}><button className="result-main" onClick={onOpen}><div className={`result-photo category-${place.category}`}><PlacePhoto place={place}/><span><CategoryIcon category={place.category}/></span>{place.tested_by_us && <b>Testé</b>}</div><div className="result-copy"><small>{place.city} · {place.subcategory}</small><h2>{place.name}</h2><p>{place.specialty || place.description}</p><div><span>★ {place.rating?.toFixed(1) || "—"}</span><span>{place.distance < 1 ? `${Math.round(place.distance * 1000)} m` : `${place.distance.toFixed(1)} km`}</span><span>{place.price_range || "Prix à confirmer"}</span></div></div></button><button className={`heart ${favorite ? "on" : ""}`} onClick={onFavorite} aria-label="Ajouter aux favoris"><Heart fill={favorite ? "currentColor" : "none"}/></button>{place.category === "restaurant" && <a className="card-map-link" href={place.maps_url} target="_blank" rel="noreferrer"><MapPinned/> Voir sur la carte</a>}</article>;
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
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", { attribution: "© OpenStreetMap · CARTO" }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);
      items.slice(0, 120).forEach((place) => {
        const icon = L.divIcon({ className: "explorer-pin-wrap", html: `<span class="explorer-pin category-${place.category}"><i></i></span>`, iconSize: [34, 40], iconAnchor: [17, 36] });
        L.marker([place.lat, place.lng], { icon }).addTo(map!).on("click", () => onSelect(place));
      });
    })();
    return () => { disposed = true; map?.remove(); };
  }, [items, onSelect]);
  return <div className="explorer-map" ref={node}/>;
}

function PlaceDetail({ place, distance, favorite, visited, canCheckIn, close, toggleFavorite, checkIn, concierge, muslimMode }: { place: Place; distance: number; favorite: boolean; visited: boolean; canCheckIn: boolean; close: () => void; toggleFavorite: () => void; checkIn: () => void; concierge: () => void; muslimMode: boolean }) {
  const directWhatsAppUrl = providerWhatsAppUrl(place);
  return <div className="detail-backdrop" onMouseDown={close}><article className="place-detail" role="dialog" aria-modal="true" aria-label={`Détails de ${place.name}`} onMouseDown={(event) => event.stopPropagation()}>
    <button className="detail-close" onClick={close} aria-label="Fermer la fiche">×</button>
    <div className="detail-gallery"><PlacePhoto place={place}/><span>{categoryMeta[place.category].label}</span></div>
    <div className="detail-body"><div className="eyebrow">{place.city} · {place.island}</div><h2>{place.name}</h2>
      <div className="detail-stats"><span>★ {place.rating?.toFixed(1) || "—"}</span><span>⌖ {distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`}</span><span>{place.price_range || "Prix à confirmer"}</span></div>
      <p>{place.description}</p>
      {place.mosquee_proche && <div className="mosque-near">◒ Mosquée la plus proche : <strong>{place.mosquee_proche.nom}</strong>, à {place.mosquee_proche.distance_m} m</div>}
      {place.menu && <section className={`restaurant-menu ${place.menu.status === "officiel" ? "verified" : ""}`}><div className="menu-heading"><div><small>LA CARTE</small><strong>À goûter ici</strong></div><span>{place.menu.status === "officiel" ? "✓ Source officielle" : place.menu.status}</span></div><div className="menu-highlights">{place.menu.highlights.map((item) => <span key={item}>{item}</span>)}</div><a href={place.menu.source_url} target="_blank" rel="noreferrer">Voir la carte complète <b>↗</b></a><p>{place.menu.source_label} · vérifié le {place.menu.verified_at}. Les prix peuvent changer.</p></section>}
      {place.specialty && !place.menu && <div className="specialty"><small>LA SPÉCIALITÉ</small><strong>{place.specialty}</strong></div>}
      {place.vigilance && <div className="vigilance"><span>!</span><div><strong>À savoir avant d’y aller</strong><p>{place.vigilance}</p></div></div>}
      <div className="practical"><div><small>Horaires</small><strong>{place.opening_hours || "À confirmer"}</strong></div><div><small>Meilleur moment</small><strong>{place.best_time || "Toute la journée"}</strong></div>{place.level && <div><small>Niveau</small><strong>{place.level}</strong></div>}</div>
      <button className={`checkin ${visited ? "done" : ""}`} disabled={!canCheckIn || visited} onClick={checkIn}>{visited ? "✓ Lieu visité" : canCheckIn ? "⌖ Valider ma visite" : "Check-in disponible à moins de 200 m"}</button>
      <div className="tag-list">{place.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      <div className="detail-actions"><a href={place.maps_url} target="_blank" rel="noreferrer">↗ Itinéraire</a>{directWhatsAppUrl ? <a className="whatsapp" href={directWhatsAppUrl} target="_blank" rel="noopener noreferrer"><MessageCircle/> WhatsApp du prestataire</a> : <span className="provider-contact-missing"><Phone/> Numéro du prestataire à vérifier</span>}<button className={favorite ? "favorite" : ""} onClick={toggleFavorite}><Heart fill={favorite ? "currentColor" : "none"}/> {favorite ? "Dans mes favoris" : "Ajouter aux favoris"}</button><button className="concierge" onClick={concierge}><MessageCircle/> Demande générale à MyLombok</button></div>
    </div>
  </article></div>;
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
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", { maxZoom: 19, attribution: "© OpenStreetMap · CARTO" }).addTo(map);
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

function RequestsView({ title, requests, setModal }: { title: string; requests: Request[]; setModal: (m: "request") => void }) {
  return <><div className="eyebrow">Service local · gratuit pour toi</div><h1>{title}</h1><p className="lead">Dis-nous ce que tu veux organiser. Nous trouvons le bon prestataire et suivons ta réservation.</p>
    <section className="concierge-promise"><span><Sparkles strokeWidth={1.8}/></span><div><strong>Un seul message, on s’occupe du reste</strong><p>Conseils locaux · partenaires vérifiés · suivi jusqu’à confirmation</p></div></section>
    <div className="request-list">{requests.map((request) => <article className="request-card" key={request.id}><div className="request-card-icon">{request.title.toLowerCase().includes("aéroport") ? <MapPinned strokeWidth={1.8}/> : <Compass strokeWidth={1.8}/>}</div><div><span className={`badge ${request.status === "Confirmé" ? "confirmed" : ""}`}>{request.status}</span><h3>{request.title}</h3><p>{request.detail}</p></div><button aria-label={`Ouvrir ${request.title}`}><ChevronRight/></button></article>)}</div>
    <button className="primary wide concierge-cta" onClick={() => setModal("request")}><MessageCircle strokeWidth={1.8}/> Demander à la conciergerie</button>
  </>;
}

const officialGuides = [
  { Icon: ShieldCheck, title: "Visa & titre de séjour", summary: "e-VOA, visa, KITAS/KITAP et prolongations.", href: "https://evisa.imigrasi.go.id/", source: "Immigration indonésienne" },
  { Icon: BadgeCheck, title: "Créer une activité", summary: "NIB, licences et niveau de risque de l’activité.", href: "https://oss.go.id/", source: "OSS Indonesia" },
  { Icon: BookOpen, title: "Impôts & NPWP", summary: "Enregistrement fiscal des particuliers et entreprises.", href: "https://www.pajak.go.id/en/requirements-individual-taxpayer-identification-number-tin-registration", source: "Direction générale des impôts" },
  { Icon: Sparkles, title: "Couverture santé", summary: "Informations et services de l’assurance santé nationale.", href: "https://www.bpjs-kesehatan.go.id/", source: "BPJS Kesehatan" },
  { Icon: Phone, title: "Téléphone & IMEI", summary: "Règles douanières pour les appareils importés.", href: "https://www.beacukai.go.id/", source: "Douanes indonésiennes" },
  { Icon: Landmark, title: "Services locaux NTB", summary: "Portail officiel de la province de Nusa Tenggara Barat.", href: "https://ntbprov.go.id/", source: "Gouvernement de NTB" },
];

function ProfileView({ title, notify, dark, toggleDark, visited, favoriteCount, requestCount, muslimMode, toggleMuslimMode, accountUser, authLoading, openAuth, signOut }: { title: string; notify: (s: string) => void; dark: boolean; toggleDark: () => void; visited: string[]; favoriteCount: number; requestCount: number; muslimMode: boolean; toggleMuslimMode: () => void; accountUser: User | null; authLoading: boolean; openAuth: () => void; signOut: () => void }) {
  const [currency, setCurrency] = useState("EUR");
  const [adminOpen, setAdminOpen] = useState(false);
  useEffect(() => { setCurrency(localStorage.getItem("my-lombok-currency") || "EUR"); }, []);
  const percent = Math.round(visited.length / allPlaces.length * 100);
  if (adminOpen) return <section className="admin-guide"><button className="admin-back" onClick={() => setAdminOpen(false)}>← Mon profil</button><div className="eyebrow">Sources officielles · vérifiées le 22 juillet 2026</div><h1>S’installer à Lombok</h1><p className="lead">Les bons points de départ pour préparer une expatriation, sans dépendre de groupes Facebook ou d’informations périmées.</p><div className="admin-warning"><b>À savoir</b><span>Les règles changent. Consulte toujours la source officielle avant de payer ou déposer un dossier.</span></div><div className="admin-list">{officialGuides.map((guide) => <a key={guide.title} href={guide.href} target="_blank" rel="noreferrer"><i><guide.Icon strokeWidth={1.8}/></i><div><strong>{guide.title}</strong><p>{guide.summary}</p><small>{guide.source} · Ouvrir la source ↗</small></div></a>)}</div><button className="primary wide" onClick={() => notify("La conciergerie peut t’aider à préparer tes démarches")}>Demander un accompagnement</button></section>;
  const displayName = accountUser?.user_metadata?.full_name || accountUser?.user_metadata?.name || accountUser?.email?.split("@")[0] || "Voyageur";
  return <section className="profile-screen">
    <header className="profile-hero"><div><div className="eyebrow">ESPACE PERSONNEL · PRIVÉ</div><h1>{title}</h1><p>Ton carnet, tes demandes et tes repères à Lombok, réunis au même endroit.</p></div><span><Sparkles/></span></header>
    {accountUser ? <section className="account-card connected premium-account"><div className="account-photo">{accountUser.user_metadata?.avatar_url ? <img src={accountUser.user_metadata.avatar_url} alt="" referrerPolicy="no-referrer"/> : String(displayName).slice(0, 1).toUpperCase()}</div><div><small>COMPTE SYNCHRONISÉ</small><h2>{displayName}</h2><p>{accountUser.email}</p><span><BadgeCheck/> Données sauvegardées</span></div><button onClick={signOut}>Se déconnecter</button></section> : <button className="account-card premium-account" onClick={openAuth} disabled={authLoading}><div className="account-photo"><UserRound/></div><div><small>TON COMPTE MYLOMBOK</small><h2>{authLoading ? "Vérification…" : "Créer mon espace"}</h2><p>Retrouve tes favoris, visites et demandes sur tous tes appareils.</p><span><ShieldCheck/> Google · Apple · e-mail</span></div><em><ChevronRight/></em></button>}
    <div className="profile-stats"><article><strong>{favoriteCount}</strong><span>favoris</span></article><article><strong>{visited.length}</strong><span>visités</span></article><article><strong>{requestCount}</strong><span>demandes</span></article></div>
    <button className="profile-card profile-main premium-guide" onClick={() => setAdminOpen(true)}><div className="profile-avatar"><BookOpen/></div><div><small>GUIDE EXPATRIATION</small><h2>S’installer à Lombok</h2><p>Visa, société, fiscalité, santé et démarches officielles</p></div><em><ChevronRight/></em></button>
    <div className="trip-progress premium-progress"><div><strong>Ton exploration de Lombok</strong><span>{percent}%</span></div><div className="progress"><i style={{ width: `${percent}%` }}/></div><p>{visited.length} lieux visités sur {allPlaces.length}. Tes prochaines découvertes sont prêtes dans Explorer.</p></div>
    <label className="currency-choice premium-currency"><span><small>PRÉFÉRENCES</small>Devise d’affichage</span><select value={currency} onChange={(event) => { setCurrency(event.target.value); localStorage.setItem("my-lombok-currency", event.target.value); }}>{["EUR","USD","GBP","CHF","AUD","SGD","MYR","SAR","AED","IDR"].map((code) => <option key={code}>{code}</option>)}</select></label>
    <div className="settings premium-settings"><a href="/installer"><span><Download/></span><b><small>APPLICATION IPHONE</small>Installer MyLombok</b><em><ChevronRight/></em></a><button className="muslim-setting" role="switch" aria-checked={muslimMode} onClick={toggleMuslimMode}><span><MoonStar/></span><b><small>PRÉFÉRENCE DE SÉJOUR</small>Voyage musulman</b><em className={muslimMode ? "switch on" : "switch"}><i/></em></button><button onClick={() => notify("Tes informations sont à jour")}><span><House/></span><b>Mon logement</b><em><ChevronRight/></em></button><button onClick={() => notify("Tes contacts sont disponibles hors ligne")}><span><Phone/></span><b>Mes contacts utiles</b><em><ChevronRight/></em></button><button onClick={() => notify("Mode hors ligne activé")}><span><CloudDownload/></span><b>Accès hors ligne</b><em><ChevronRight/></em></button><button role="switch" aria-checked={dark} onClick={toggleDark}><span>{dark ? <Sun/> : <MoonStar/>}</span><b>Mode {dark ? "clair" : "sombre"}</b><em><ChevronRight/></em></button></div>
    <footer className="profile-privacy"><ShieldCheck/><span><strong>Ton carnet reste privé</strong><small>Les données servent uniquement à personnaliser ton séjour.</small></span></footer>
  </section>;
}

function AccountModal({ close, notify }: { close: () => void; notify: (message: string) => void }) {
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function social(provider: "google" | "apple") {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) { setError("Le service de comptes doit encore être relié à l’application."); return; }
    setBusy(true); setError("");
    const { error: authError } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: window.location.origin } });
    if (authError) { setBusy(false); setError("Connexion impossible pour le moment. Réessaie dans un instant."); }
  }

  async function emailAuth(formData: FormData) {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) { setError("Le service de comptes doit encore être relié à l’application."); return; }
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const name = String(formData.get("name") || "").trim();
    setBusy(true); setError("");
    const result = mode === "signup"
      ? await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: window.location.origin,
          },
        })
      : await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (result.error) { setError(result.error.message === "Invalid login credentials" ? "E-mail ou mot de passe incorrect." : "Connexion impossible. Vérifie tes informations ou réessaie plus tard."); return; }
    if (mode === "signup" && !result.data.session) notify("Compte créé — confirme ton e-mail pour l’activer");
    else notify("Bienvenue dans ton compte MyLombok");
    close();
  }

  return <div className="modal-backdrop account-backdrop" onMouseDown={close}><section className="modal account-modal" role="dialog" aria-modal="true" aria-label={mode === "signup" ? "Créer un compte MyLombok" : "Se connecter à MyLombok"} onMouseDown={(event) => event.stopPropagation()}><div className="modal-handle"/><button className="close" onClick={close} aria-label="Fermer">×</button><div className="account-brand"><img src="/mylombok-logo.svg" alt="MyLombok"/><small>TON CARNET PERSONNEL À LOMBOK</small></div><h2>{mode === "signup" ? "Emporte tes envies avec toi" : "Heureux de te revoir"}</h2><p>Un compte gratuit pour synchroniser tes favoris, tes visites et tes demandes de conciergerie.</p><div className="social-auth"><button disabled={busy} onClick={() => social("apple")}><b>●</b> Continuer avec Apple</button><button disabled={busy} onClick={() => social("google")}><b>G</b> Continuer avec Google</button></div><div className="auth-divider"><span>ou avec ton e-mail</span></div><form action={emailAuth}>{mode === "signup" && <label>Prénom ou nom<input name="name" required maxLength={80} autoComplete="name" placeholder="Dorian"/></label>}<label>Adresse e-mail<input name="email" type="email" required maxLength={254} autoComplete="email" placeholder="toi@email.com"/></label><label>Mot de passe<input name="password" type="password" minLength={mode === "signup" ? 10 : 1} maxLength={128} required autoComplete={mode === "signup" ? "new-password" : "current-password"} placeholder={mode === "signup" ? "10 caractères minimum" : "Ton mot de passe"}/></label>{error && <div className="auth-error" role="alert">{error}</div>}<button className="primary" disabled={busy} type="submit">{busy ? "Connexion…" : mode === "signup" ? "Créer mon compte gratuit" : "Me connecter"}</button></form><button className="auth-switch" onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setError(""); }}>{mode === "signup" ? "J’ai déjà un compte · Me connecter" : "Nouveau ici ? · Créer mon compte"}</button><small className="auth-privacy">Tes données restent privées et servent uniquement à personnaliser ton séjour.</small></section></div>;
}

function Modal({ type, close, addRequest, notify, draft = "" }: { type: "request" | "place"; close: () => void; addRequest: (d: FormData) => void; notify: (s: string) => void; draft?: string }) {
  return <div className="modal-backdrop" onMouseDown={close}><section className="modal" role="dialog" aria-modal="true" aria-label={type === "request" ? "Nouvelle demande à la conciergerie" : "Ajouter une bonne adresse"} onMouseDown={e => e.stopPropagation()}><div className="modal-handle"/><button className="close" onClick={close} aria-label="Fermer">×</button><span className="modal-icon">{type === "request" ? "✦" : "♡"}</span><h2>{type === "request" ? "De quoi as-tu besoin ?" : "Nouvelle bonne adresse"}</h2><p>{type === "request" ? "Décris ta demande, même en quelques mots." : "Ajoute un lieu à ton carnet personnel."}</p>
    <form action={type === "request" ? addRequest : () => { close(); notify("Adresse ajoutée à ton carnet"); }}><label>{type === "request" ? "Ma demande" : "Nom du lieu"}<input name="title" required maxLength={180} defaultValue={draft} placeholder={type === "request" ? "Ex. Un scooter pour un mois" : "Ex. Café Mana"}/></label><label>Précisions<textarea name="details" maxLength={1200} placeholder="Lieu, date, budget…" /></label><button className="primary" type="submit">{type === "request" ? "Ouvrir WhatsApp MyLombok" : "Enregistrer l’adresse"}</button></form></section></div>;
}
