"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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
    <p className="lead">Où veux-tu aller aujourd’hui ?</p>
    <div className="map-filters">{["Explorer", "Manger", "Plages", "Services"].map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => { setCategory(item); notify(`${item} affiché sur la carte`); }}>{item}</button>)}</div>
    <Globe onLombok={() => { setSelected("Kuta Lombok"); notify("Bienvenue à Lombok"); }} />
    <article className="map-place-card"><div className="spot-thumb"><span>{current.icon}</span></div><div><small>{current.kind}</small><h2>{current.name}</h2><p>{current.note}</p></div><button onClick={() => { setTab("places"); notify(`${current.name} ouvert`); }}>→</button></article>
    <div className="map-actions"><button className="map-request" onClick={() => setModal("request")}><span>＋</span><b>Demander à la conciergerie</b></button><button onClick={() => { setTab("requests"); notify("Réservation ouverte"); }}><span className="calendar"><b>23</b>JUL</span><strong>{requests[0]?.title || "Mes demandes"}</strong></button></div>
  </>;
}

function Globe({ onLombok }: { onLombok: () => void }) {
  const host = useRef<HTMLDivElement>(null);
  const resetView = useRef<(() => void) | null>(null);

  useEffect(() => {
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
    const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 96), new THREE.MeshStandardMaterial({ map: texture, roughness: 0.82, metalness: 0.02 }));
    world.add(earth);

    const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(1.035, 96, 96), new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      vertexShader: "varying vec3 n; void main(){ n=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
      fragmentShader: "varying vec3 n; void main(){ float i=pow(0.72-dot(n,vec3(0.0,0.0,1.0)),2.2); gl_FragColor=vec4(0.28,0.76,1.0,1.0)*i; }"
    }));
    world.add(atmosphere);

    const lat = THREE.MathUtils.degToRad(-8.65);
    const lon = THREE.MathUtils.degToRad(116.32);
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
    const focusLombok = () => { world.rotation.set(0.12, 2.68, 0); camera.position.set(0, 0.08, 3.25); controls.update(); };
    resetView.current = focusLombok; focusLombok();

    let frame = 0; let dragging = false;
    controls.addEventListener("start", () => { dragging = true; });
    controls.addEventListener("end", () => { dragging = false; });
    const animate = () => { frame = requestAnimationFrame(animate); if (!dragging) world.rotation.y += 0.00045; const pulseScale = 1 + Math.sin(performance.now() * 0.004) * 0.18; pulse.scale.setScalar(pulseScale); controls.update(); renderer.render(scene, camera); };
    animate();
    const resize = () => { if (!element) return; camera.aspect = element.clientWidth / element.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(element.clientWidth, element.clientHeight); };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); controls.dispose(); renderer.dispose(); texture.dispose(); element.replaceChildren(); };
  }, []);

  return <section className="globe-stage" aria-label="Globe terrestre interactif centré sur Lombok">
    <div className="space-glow"/><div className="globe-canvas" ref={host}/>
    <div className="globe-tip">Glisse pour explorer · Pince pour zoomer</div>
    <button className="lombok-label" onClick={onLombok}><span>●</span><b>Lombok</b><small>Indonésie</small></button>
    <button className="globe-reset" onClick={() => { resetView.current?.(); onLombok(); }} aria-label="Recentrer sur Lombok">◎</button>
  </section>;
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
