"use client";

import { useEffect, useMemo, useState } from "react";

type Tab = "home" | "places" | "requests" | "profile";
type Request = { id: number; title: string; detail: string; status: "En cours" | "Confirmé" };

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
  { id: "home" as Tab, icon: "⌂", label: "Accueil" },
  { id: "places" as Tab, icon: "♡", label: "Adresses" },
  { id: "requests" as Tab, icon: "◫", label: "Demandes" },
  { id: "profile" as Tab, icon: "○", label: "Profil" },
];

export default function Home() {
  const [tab, setTab] = useState<Tab>("home");
  const [modal, setModal] = useState<"request" | "place" | null>(null);
  const [toast, setToast] = useState("");
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [favorites, setFavorites] = useState<string[]>(["Bush Radio", "Tanjung Aan"]);

  useEffect(() => {
    const saved = localStorage.getItem("my-lombok-requests");
    if (saved) setRequests(JSON.parse(saved));
  }, []);

  const title = useMemo(() => ({ home: "Bonjour Dorian 👋", places: "Mes bonnes adresses", requests: "Mes demandes", profile: "Mon séjour" }[tab]), [tab]);

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

  function toggleFavorite(name: string) {
    setFavorites((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);
  }

  return (
    <main className="app-shell">
      <section className="phone-app">
        <header className="topbar">
          <button className="brand" onClick={() => setTab("home")} aria-label="Retour à l'accueil">
            <span className="brand-mark">M</span><span>my lombok</span>
          </button>
          <button className="avatar" onClick={() => setTab("profile")} aria-label="Ouvrir mon profil">D</button>
        </header>

        <div className="content">
          {tab === "home" && <HomeView title={title} requests={requests} setTab={setTab} setModal={setModal} notify={notify} />}
          {tab === "places" && <PlacesView title={title} favorites={favorites} toggleFavorite={toggleFavorite} setModal={setModal} />}
          {tab === "requests" && <RequestsView title={title} requests={requests} setModal={setModal} />}
          {tab === "profile" && <ProfileView title={title} notify={notify} />}
        </div>

        <nav className="bottom-nav" aria-label="Navigation principale">
          {nav.map((item) => <button key={item.id} className={tab === item.id ? "active" : ""} onClick={() => setTab(item.id)}><span>{item.icon}</span>{item.label}</button>)}
        </nav>
      </section>

      {modal && <Modal type={modal} close={() => setModal(null)} addRequest={addRequest} notify={notify} />}
      {toast && <div className="toast" role="status">✓ {toast}</div>}
    </main>
  );
}

function HomeView({ title, requests, setTab, setModal, notify }: { title: string; requests: Request[]; setTab: (t: Tab) => void; setModal: (m: "request" | "place") => void; notify: (s: string) => void }) {
  return <>
    <div className="eyebrow">Mercredi 22 juillet · Kuta</div>
    <h1>{title}</h1>
    <p className="lead">Tout ce qu’il te faut pour profiter de Lombok, simplement.</p>

    <section className="hero-card">
      <div><span className="hero-kicker">Ton arrivée</span><h2>Prêt pour demain</h2><p>Chauffeur confirmé à 14:30</p></div>
      <button onClick={() => { setTab("requests"); notify("Réservation ouverte"); }}>Voir le détail <span>→</span></button>
      <div className="sun" /><div className="island"><i /><i /><i /></div>
    </section>

    <div className="section-title"><h2>Comment puis-je t’aider ?</h2></div>
    <div className="quick-grid">
      <button onClick={() => setModal("request")}><span className="quick-icon coral">↗</span><strong>Un trajet</strong><small>Chauffeur & transfert</small></button>
      <button onClick={() => setModal("request")}><span className="quick-icon aqua">⌂</span><strong>Un logement</strong><small>Trouver ou réparer</small></button>
      <button onClick={() => setModal("request")}><span className="quick-icon gold">◉</span><strong>Un scooter</strong><small>Louer en confiance</small></button>
      <button onClick={() => setModal("request")}><span className="quick-icon green">✦</span><strong>Une activité</strong><small>Explorer Lombok</small></button>
    </div>

    <div className="section-title"><h2>À suivre</h2><button onClick={() => setTab("requests")}>Tout voir</button></div>
    <button className="request-preview" onClick={() => setTab("requests")}>
      <span className="calendar"><b>23</b>JUL</span><span><strong>{requests[0]?.title || "Aucune demande"}</strong><small>{requests[0]?.detail || "Commence par créer une demande"}</small></span><em>›</em>
    </button>
  </>;
}

function PlacesView({ title, favorites, toggleFavorite, setModal }: { title: string; favorites: string[]; toggleFavorite: (s: string) => void; setModal: (m: "place") => void }) {
  return <><div className="eyebrow">Ton carnet personnel</div><h1>{title}</h1><p className="lead">Les endroits que tu as testés et que tu recommandes.</p>
    <div className="filter-row"><button className="selected">Tous</button><button>Manger</button><button>Bouger</button><button>Découvrir</button></div>
    <div className="place-list">{places.map(place => <article className="place-card" key={place.name}><div className={`place-art ${place.color}`}>{place.icon}</div><div><small>{place.type}</small><h3>{place.name}</h3><p>📍 {place.area}, Lombok</p></div><button className={favorites.includes(place.name) ? "loved" : ""} onClick={() => toggleFavorite(place.name)} aria-label="Ajouter aux favoris">♥</button></article>)}</div>
    <button className="primary wide" onClick={() => setModal("place")}>＋ Ajouter une adresse</button>
  </>;
}

function RequestsView({ title, requests, setModal }: { title: string; requests: Request[]; setModal: (m: "request") => void }) {
  return <><div className="eyebrow">Ta conciergerie</div><h1>{title}</h1><p className="lead">Garde un œil sur tout ce que tu dois organiser.</p>
    <div className="request-list">{requests.map((request) => <article className="request-card" key={request.id}><div className="status-dot"/><div><span className={`badge ${request.status === "Confirmé" ? "confirmed" : ""}`}>{request.status}</span><h3>{request.title}</h3><p>{request.detail}</p></div><button>›</button></article>)}</div>
    <button className="primary wide" onClick={() => setModal("request")}>＋ Nouvelle demande</button>
  </>;
}

function ProfileView({ title, notify }: { title: string; notify: (s: string) => void }) {
  return <><div className="eyebrow">Tes informations</div><h1>{title}</h1><div className="profile-card"><div className="profile-avatar">D</div><div><h2>Dorian</h2><p>Installation à Lombok · Juillet 2026</p></div></div>
    <div className="trip-progress"><div><strong>Ton installation</strong><span>60%</span></div><div className="progress"><i /></div><p>3 étapes complétées sur 5</p></div>
    <div className="settings"><button onClick={() => notify("Tes informations sont à jour")}><span>⌂</span><b>Mon logement</b><em>›</em></button><button onClick={() => notify("Tes contacts sont disponibles hors ligne")}><span>☏</span><b>Mes contacts utiles</b><em>›</em></button><button onClick={() => notify("Mode hors ligne activé")}><span>↓</span><b>Accès hors ligne</b><em>›</em></button></div>
  </>;
}

function Modal({ type, close, addRequest, notify }: { type: "request" | "place"; close: () => void; addRequest: (d: FormData) => void; notify: (s: string) => void }) {
  return <div className="modal-backdrop" onMouseDown={close}><section className="modal" onMouseDown={e => e.stopPropagation()}><div className="modal-handle"/><button className="close" onClick={close}>×</button><span className="modal-icon">{type === "request" ? "✦" : "♡"}</span><h2>{type === "request" ? "De quoi as-tu besoin ?" : "Nouvelle bonne adresse"}</h2><p>{type === "request" ? "Décris ta demande, même en quelques mots." : "Ajoute un lieu à ton carnet personnel."}</p>
    <form action={type === "request" ? addRequest : () => { close(); notify("Adresse ajoutée à ton carnet"); }}><label>{type === "request" ? "Ma demande" : "Nom du lieu"}<input name="title" required placeholder={type === "request" ? "Ex. Un scooter pour un mois" : "Ex. Café Mana"}/></label><label>Précisions<textarea placeholder="Lieu, date, budget…" /></label><button className="primary" type="submit">{type === "request" ? "Envoyer ma demande" : "Enregistrer l’adresse"}</button></form></section></div>;
}
