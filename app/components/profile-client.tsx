"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Apple, BookOpen, ChevronRight, CloudDownload, Eye, EyeOff, LogOut, Mail, MoonStar, ShieldCheck, Sun, Trash2, UserRound, X } from "lucide-react";
import { getSupabaseBrowserClient } from "../lib/supabase";
import { useDialogA11y } from "./use-dialog-a11y";
import { PrayerCard } from "./prayer-card";
import { CurrencyConverter } from "./currency-converter";

type StoredRequest = { id: number; title: string; detail: string; status: string };

const officialGuides = [
  { title: "Visa et titres de séjour", summary: "Portail officiel des visas électroniques et informations d’immigration.", href: "https://evisa.imigrasi.go.id/", source: "Immigration indonésienne" },
  { title: "Créer une activité", summary: "Enregistrement NIB et formalités selon le niveau de risque.", href: "https://oss.go.id/", source: "OSS Indonesia" },
  { title: "Fiscalité et NPWP", summary: "Informations fiscales pour particuliers et entreprises.", href: "https://www.pajak.go.id/en", source: "Direction générale des impôts" },
  { title: "Services de la province", summary: "Informations publiques de Nusa Tenggara Barat.", href: "https://ntbprov.go.id/", source: "Gouvernement de NTB" },
];

function safeArray<T>(key: string): T[] {
  try { const value = JSON.parse(localStorage.getItem(key) || "[]"); return Array.isArray(value) ? value : []; } catch { return []; }
}

export function ProfileClient() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const [dark, setDark] = useState(false);
  const [muslimMode, setMuslimMode] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [visited, setVisited] = useState<string[]>([]);
  const [requests, setRequests] = useState<StoredRequest[]>([]);
  const [notice, setNotice] = useState("");
  const [syncReady, setSyncReady] = useState(false);
  const skipNextCloudSync = useRef(false);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      if (!active) return;
      setDark(localStorage.getItem("my-lombok-theme") === "dark");
      setMuslimMode(localStorage.getItem("my-lombok-muslim-mode") === "true");
      setFavorites(safeArray<string>("my-lombok-favorites"));
      setVisited(safeArray<string>("my-lombok-visited"));
      setRequests(safeArray<StoredRequest>("my-lombok-requests"));
    }, 0);
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      const loadingTimer = window.setTimeout(() => active && setLoading(false), 0);
      return () => { active = false; window.clearTimeout(timer); window.clearTimeout(loadingTimer); };
    }
    supabase.auth.getSession().then(({ data }) => { if (active) { setSyncReady(false); setUser(data.session?.user ?? null); setLoading(false); } });
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      setSyncReady(false);
      setUser(session?.user ?? null);
      if (event === "PASSWORD_RECOVERY") { setPasswordRecovery(true); setAuthOpen(true); }
    });
    return () => { active = false; window.clearTimeout(timer); data.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!user) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    let active = true;
    supabase.from("user_state").select("favorites, visited, requests, preferences").eq("user_id", user.id).maybeSingle().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        setNotice("La synchronisation est momentanément indisponible. Vos données locales ne seront pas écrasées.");
        return;
      }
      if (data) {
        if (Array.isArray(data.favorites)) { setFavorites(data.favorites); localStorage.setItem("my-lombok-favorites", JSON.stringify(data.favorites)); }
        if (Array.isArray(data.visited)) { setVisited(data.visited); localStorage.setItem("my-lombok-visited", JSON.stringify(data.visited)); }
        if (Array.isArray(data.requests)) { setRequests(data.requests as StoredRequest[]); localStorage.setItem("my-lombok-requests", JSON.stringify(data.requests)); }
        const prefs = data.preferences as { dark?: boolean; muslimMode?: boolean } | null;
        if (typeof prefs?.muslimMode === "boolean") { setMuslimMode(prefs.muslimMode); localStorage.setItem("my-lombok-muslim-mode", String(prefs.muslimMode)); }
        if (typeof prefs?.dark === "boolean") {
          setDark(prefs.dark);
          localStorage.setItem("my-lombok-theme", prefs.dark ? "dark" : "light");
          if (prefs.dark) document.documentElement.dataset.theme = "dark";
          else delete document.documentElement.dataset.theme;
        }
      }
      setSyncReady(true);
    });
    return () => { active = false; };
  }, [user]);

  useEffect(() => {
    if (!user || !syncReady) return;
    if (skipNextCloudSync.current) { skipNextCloudSync.current = false; return; }
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const timer = window.setTimeout(() => {
      supabase.from("user_state").upsert({ user_id: user.id, favorites, visited, requests, preferences: { dark, muslimMode }, updated_at: new Date().toISOString() }).then(({ error }) => {
        if (error) setNotice("La synchronisation est momentanément indisponible. Vos données restent sur cet appareil.");
      });
    }, 500);
    return () => window.clearTimeout(timer);
  }, [dark, favorites, muslimMode, requests, syncReady, user, visited]);

  const displayName = useMemo(() => user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "Voyageur", [user]);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    localStorage.setItem("my-lombok-theme", next ? "dark" : "light");
    if (next) document.documentElement.dataset.theme = "dark";
    else delete document.documentElement.dataset.theme;
  }

  function toggleMuslim() {
    const next = !muslimMode;
    setMuslimMode(next);
    localStorage.setItem("my-lombok-muslim-mode", String(next));
  }

  function exportData() {
    const payload = { exportedAt: new Date().toISOString(), favorites, visited, requests, preferences: { dark, muslimMode } };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url; link.download = "mylombok-mes-donnees.json"; link.click(); URL.revokeObjectURL(url);
  }

  async function clearLocalData() {
    if (!window.confirm("Effacer les favoris, visites, demandes et préférences enregistrés sur cet appareil ?")) return;
    skipNextCloudSync.current = true;
    ["my-lombok-favorites", "my-lombok-visited", "my-lombok-requests", "my-lombok-muslim-mode", "my-lombok-theme"].forEach((key) => localStorage.removeItem(key));
    setFavorites([]); setVisited([]); setRequests([]); setMuslimMode(false); setDark(false); delete document.documentElement.dataset.theme;
    setNotice("Les données locales de cet appareil ont été effacées.");
  }

  async function signOut() {
    await getSupabaseBrowserClient()?.auth.signOut();
    setSyncReady(false);
    setUser(null);
    setNotice("Vous êtes déconnecté.");
  }

  return (
    <div className="profile-layout">
      {notice && <div className="profile-notice" role="status">{notice}</div>}
      <section className="profile-account">
        <div className="profile-account__avatar">{user ? String(displayName).slice(0, 1).toUpperCase() : <UserRound aria-hidden="true" />}</div>
        <div><span className="eyebrow">Votre espace personnel</span><h2>{loading ? "Vérification…" : user ? `Bonjour ${displayName}` : "Retrouvez votre carnet partout"}</h2><p>{user ? user.email : "Un compte permet de synchroniser vos favoris et vos demandes entre vos appareils."}</p></div>
        {user ? <button className="button button--outline" onClick={signOut}><LogOut aria-hidden="true" /> Se déconnecter</button> : <button className="button button--primary" onClick={() => setAuthOpen(true)} disabled={loading}>Créer ou ouvrir mon compte</button>}
      </section>

      <section className="profile-overview" aria-label="Résumé de votre carnet">
        <article><strong>{favorites.length}</strong><span>adresses favorites</span></article>
        <article><strong>{visited.length}</strong><span>lieux visités</span></article>
        <article><strong>{requests.length}</strong><span>demandes préparées</span></article>
      </section>

      <div className="profile-main-grid">
        <section className="profile-panel">
          <span className="eyebrow">Préférences</span><h2>Une expérience à votre façon.</h2>
          <button className="setting-row" role="switch" aria-checked={muslimMode} onClick={toggleMuslim}><span><MoonStar aria-hidden="true" /></span><div><strong>Voyage musulman</strong><small>Affiche les heures de prière et les filtres dédiés.</small></div><em className={`switch${muslimMode ? " is-on" : ""}`}><i /></em></button>
          <button className="setting-row" role="switch" aria-checked={dark} onClick={toggleTheme}><span>{dark ? <Sun aria-hidden="true" /> : <MoonStar aria-hidden="true" />}</span><div><strong>Mode {dark ? "clair" : "sombre"}</strong><small>Adapte l’interface à votre confort visuel.</small></div><ChevronRight aria-hidden="true" /></button>
          <a className="setting-row" href="/installer"><span><CloudDownload aria-hidden="true" /></span><div><strong>Installer MyLombok</strong><small>Ajouter l’application sur l’écran d’accueil.</small></div><ChevronRight aria-hidden="true" /></a>
        </section>
        <section className="profile-panel request-history">
          <span className="eyebrow">Vos demandes</span><h2>Les échanges préparés.</h2>
          {requests.length ? <div>{requests.slice(0, 5).map((request) => <article key={request.id}><div><strong>{request.title}</strong><span>{request.detail}</span></div><small>{request.status}</small></article>)}</div> : <div className="empty-state"><MessageCircleIcon /><strong>Aucune demande pour le moment.</strong><p>Une demande apparaît ici uniquement après l’ouverture de WhatsApp.</p><a href="/conciergerie">Commencer une demande</a></div>}
        </section>
      </div>

      {muslimMode && <PrayerCard />}
      <CurrencyConverter />

      <section className="official-guides">
        <div className="section-heading"><div><span className="eyebrow">S’installer à Lombok</span><h2>Partir des sources officielles.</h2></div><p>Les règles peuvent changer. Ces liens sont des points de départ ; vérifiez toujours les conditions au moment de votre démarche.</p></div>
        <div>{officialGuides.map((guide) => <a key={guide.title} href={guide.href} target="_blank" rel="noopener noreferrer"><BookOpen aria-hidden="true" /><div><strong>{guide.title}</strong><p>{guide.summary}</p><small>{guide.source} · ouvrir la source</small></div><ChevronRight aria-hidden="true" /></a>)}</div>
      </section>

      <section className="data-controls">
        <div><ShieldCheck aria-hidden="true" /><div><strong>Vos données vous appartiennent.</strong><p>Vous pouvez les exporter ou effacer les données locales à tout moment.</p></div></div>
        <div><button className="button button--outline" onClick={exportData}>Exporter mes données</button><button className="button button--danger" onClick={clearLocalData}><Trash2 aria-hidden="true" /> Effacer sur cet appareil</button></div>
      </section>

      <AuthDialog open={authOpen} recovery={passwordRecovery} close={() => { setAuthOpen(false); setPasswordRecovery(false); }} onNotice={setNotice} />
    </div>
  );
}

function MessageCircleIcon() {
  return <Mail aria-hidden="true" />;
}

function AuthDialog({ open, recovery, close, onNotice }: { open: boolean; recovery: boolean; close: () => void; onNotice: (message: string) => void }) {
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const closeDialog = useCallback(() => close(), [close]);
  const ref = useDialogA11y(open, closeDialog);
  if (!open) return null;

  const supabaseAvailable = Boolean(getSupabaseBrowserClient());
  const activeMode = recovery ? "recovery" : mode;

  async function social(provider: "google" | "apple") {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) { setError("Le service de comptes n’est pas configuré sur ce déploiement."); return; }
    setBusy(true); setError("");
    const { error: authError } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${window.location.origin}/profil` } });
    if (authError) { setError("Ce mode de connexion n’est pas disponible pour le moment."); setBusy(false); }
  }

  async function emailAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = getSupabaseBrowserClient();
    if (!supabase) { setError("Le service de comptes n’est pas configuré sur ce déploiement."); return; }
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const name = String(form.get("name") || "").trim();
    setBusy(true); setError("");
    const result = activeMode === "recovery"
      ? await supabase.auth.updateUser({ password })
      : activeMode === "signup"
        ? await supabase.auth.signUp({ email, password, options: { data: { full_name: name }, emailRedirectTo: `${window.location.origin}/profil` } })
        : await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (result.error) { setError(result.error.message === "Invalid login credentials" ? "E-mail ou mot de passe incorrect." : "Connexion impossible. Vérifiez vos informations ou réessayez plus tard."); return; }
    const needsConfirmation = activeMode === "signup" && "session" in result.data && !result.data.session;
    onNotice(activeMode === "recovery" ? "Votre nouveau mot de passe est enregistré." : needsConfirmation ? "Compte créé. Consultez votre e-mail pour le confirmer." : "Votre compte est connecté.");
    close();
  }

  async function resetPassword() {
    const email = window.prompt("Adresse e-mail de votre compte MyLombok :")?.trim();
    const supabase = getSupabaseBrowserClient();
    if (!email || !supabase) return;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/profil` });
    if (resetError) setError("Impossible d’envoyer l’e-mail de réinitialisation.");
    else onNotice("Un e-mail de réinitialisation vient d’être envoyé.");
  }

  return (
    <div className="dialog-backdrop" onMouseDown={close}>
      <section className="auth-dialog" ref={ref} role="dialog" aria-modal="true" aria-labelledby="auth-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="dialog-close" onClick={close} aria-label="Fermer"><X aria-hidden="true" /></button>
        <span className="eyebrow">Votre carnet personnel</span>
        <h2 id="auth-title">{activeMode === "recovery" ? "Choisir un nouveau mot de passe" : activeMode === "signup" ? "Créer votre espace MyLombok" : "Heureux de vous revoir"}</h2>
        <p>{activeMode === "recovery" ? "Saisissez un nouveau mot de passe pour sécuriser votre carnet." : "Synchronisez vos favoris, visites et demandes entre vos appareils."}</p>
        {!supabaseAvailable && <div className="auth-warning" role="alert">La création de compte est prête dans l’application, mais aucun projet Supabase MyLombok n’est configuré sur ce déploiement.</div>}
        {activeMode !== "recovery" && <div className="social-auth">
          <button disabled={busy || !supabaseAvailable} onClick={() => social("apple")}><Apple aria-hidden="true" /> Continuer avec Apple</button>
          <button disabled={busy || !supabaseAvailable} onClick={() => social("google")}><b aria-hidden="true">G</b> Continuer avec Google</button>
        </div>}
        {activeMode !== "recovery" && <div className="auth-divider"><span>ou avec votre e-mail</span></div>}
        <form onSubmit={emailAuth}>
          {activeMode === "signup" && <label>Prénom ou nom<input name="name" required maxLength={80} autoComplete="name" /></label>}
          {activeMode !== "recovery" && <label>Adresse e-mail<input name="email" type="email" required maxLength={254} autoComplete="email" /></label>}
          <label>Mot de passe<div className="password-field"><input name="password" type={showPassword ? "text" : "password"} minLength={activeMode === "signin" ? 1 : 10} maxLength={128} required autoComplete={activeMode === "signin" ? "current-password" : "new-password"} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}>{showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}</button></div></label>
          {error && <div className="auth-error" role="alert">{error}</div>}
          <button className="button button--primary button--large" disabled={busy || !supabaseAvailable} type="submit">{busy ? "Validation…" : activeMode === "recovery" ? "Enregistrer le mot de passe" : activeMode === "signup" ? "Créer mon compte" : "Me connecter"}</button>
        </form>
        {activeMode === "signin" && <button className="auth-text-action" onClick={resetPassword}>Mot de passe oublié ?</button>}
        {activeMode !== "recovery" && <button className="auth-text-action" onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setError(""); }}>{mode === "signup" ? "J’ai déjà un compte" : "Créer un nouveau compte"}</button>}
        <small>En continuant, vous acceptez que les données de votre carnet soient synchronisées. Consultez notre <a href="/confidentialite">politique de confidentialité</a>.</small>
      </section>
    </div>
  );
}
