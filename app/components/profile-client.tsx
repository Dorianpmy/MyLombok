"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Apple, BookOpen, ChevronRight, CloudDownload, Eye, EyeOff, LogOut, Mail, MoonStar, ShieldCheck, Sun, Trash2, UserRound, X } from "lucide-react";
import { getSupabaseBrowserClient, isSupabaseOAuthProviderEnabled, type SupabaseOAuthProvider } from "../lib/supabase";
import { clearPersonalState, readPersonalArray, setActiveLocalUserId, writePersonalArray } from "../lib/local-state";
import { useDialogA11y } from "./use-dialog-a11y";
import { PrayerCard } from "./prayer-card";
import { CurrencyConverter } from "./currency-converter";

type StoredRequest = { id: number; title: string; detail: string; status: string };

function isMissingAuthSession(error: unknown) {
  return error instanceof Error && (error.name === "AuthSessionMissingError" || error.message === "Auth session missing!");
}

function getAuthErrorMessage(message: string) {
  const normalized = message.toLowerCase();
  if (normalized.includes("invalid login credentials")) return "E-mail ou mot de passe incorrect.";
  if (normalized.includes("email not confirmed")) return "Confirmez d’abord votre adresse grâce à l’e-mail envoyé par MyLombok.";
  if (normalized.includes("user already registered")) return "Un compte existe déjà avec cette adresse. Essayez de vous connecter.";
  if (normalized.includes("signup") && normalized.includes("disabled")) return "Les nouvelles inscriptions sont temporairement indisponibles.";
  if (normalized.includes("rate limit")) return "Trop de tentatives ont été effectuées. Attendez quelques minutes avant de réessayer.";
  if (normalized.includes("password")) return "Choisissez un mot de passe d’au moins 10 caractères.";
  return "Connexion impossible. Vérifiez vos informations ou réessayez plus tard.";
}

const officialGuides = [
  { title: "Visa et titres de séjour", summary: "Portail officiel des visas électroniques et informations d’immigration.", href: "https://evisa.imigrasi.go.id/", source: "Immigration indonésienne" },
  { title: "Créer une activité", summary: "Enregistrement NIB et formalités selon le niveau de risque.", href: "https://oss.go.id/", source: "OSS Indonesia" },
  { title: "Fiscalité et NPWP", summary: "Informations fiscales pour particuliers et entreprises.", href: "https://www.pajak.go.id/en", source: "Direction générale des impôts" },
  { title: "Services de la province", summary: "Informations publiques de Nusa Tenggara Barat.", href: "https://ntbprov.go.id/", source: "Gouvernement de NTB" },
];

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
  const activeUserId = useRef<string | null>(null);
  const identityReady = useRef(false);
  const authGeneration = useRef(0);
  const supabaseAvailable = Boolean(getSupabaseBrowserClient());

  useEffect(() => {
    let active = true;
    const hydratePersonalState = (nextUser: User | null) => {
      if (!active) return;
      const userId = nextUser?.id || null;
      activeUserId.current = userId;
      setActiveLocalUserId(userId);
      setFavorites(readPersonalArray<string>("my-lombok-favorites", userId));
      setVisited(readPersonalArray<string>("my-lombok-visited", userId));
      setRequests(readPersonalArray<StoredRequest>("my-lombok-requests", userId));
    };
    const applyIdentity = (nextUser: User | null) => {
      if (!active) return;
      const nextUserId = nextUser?.id || null;
      if (identityReady.current && activeUserId.current === nextUserId) {
        setLoading(false);
        return;
      }
      identityReady.current = true;
      setSyncReady(false);
      setUser(nextUser);
      hydratePersonalState(nextUser);
      setLoading(false);
    };
    const timer = window.setTimeout(() => {
      if (!active) return;
      setDark(localStorage.getItem("my-lombok-theme") === "dark");
      setMuslimMode(localStorage.getItem("my-lombok-muslim-mode") === "true");
    }, 0);
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      const loadingTimer = window.setTimeout(() => { hydratePersonalState(null); if (active) setLoading(false); }, 0);
      return () => { active = false; window.clearTimeout(timer); window.clearTimeout(loadingTimer); };
    }
    const verifyIdentity = async (generation: number) => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (!active || generation !== authGeneration.current) return;
        applyIdentity(error ? null : data.user);
        if (error && !isMissingAuthSession(error)) setNotice("Votre session n’a pas pu être vérifiée. Reconnectez-vous pour accéder à votre carnet synchronisé.");
      } catch (error) {
        if (!active || generation !== authGeneration.current) return;
        applyIdentity(null);
        if (!isMissingAuthSession(error)) setNotice("Votre session n’a pas pu être vérifiée. Reconnectez-vous pour accéder à votre carnet synchronisé.");
      }
    };
    const pendingVerifications = new Set<number>();
    void verifyIdentity(++authGeneration.current);
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (!active) return;
      const generation = ++authGeneration.current;
      if (event === "SIGNED_OUT") applyIdentity(null);
      else {
        const verificationTimer = window.setTimeout(() => {
          pendingVerifications.delete(verificationTimer);
          void verifyIdentity(generation);
        }, 0);
        pendingVerifications.add(verificationTimer);
      }
      if (event === "PASSWORD_RECOVERY") { setPasswordRecovery(true); setAuthOpen(true); }
    });
    return () => {
      active = false;
      authGeneration.current += 1;
      window.clearTimeout(timer);
      pendingVerifications.forEach((verificationTimer) => window.clearTimeout(verificationTimer));
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    let active = true;
    void (async () => {
      try {
        const { data, error } = await supabase.from("user_state").select("favorites, visited, requests, preferences").eq("user_id", user.id).maybeSingle();
        if (!active || activeUserId.current !== user.id) return;
        if (error) {
          setNotice("La synchronisation est momentanément indisponible. Vos données locales ne seront pas écrasées.");
          return;
        }
        if (data) {
          if (Array.isArray(data.favorites)) { setFavorites(data.favorites); writePersonalArray("my-lombok-favorites", data.favorites, user.id); }
          if (Array.isArray(data.visited)) { setVisited(data.visited); writePersonalArray("my-lombok-visited", data.visited, user.id); }
          if (Array.isArray(data.requests)) {
            const localRequests = readPersonalArray<StoredRequest>("my-lombok-requests", user.id);
            const mergedRequests = [...localRequests, ...(data.requests as StoredRequest[])]
              .filter((request, index, all) => all.findIndex((candidate) => candidate.id === request.id) === index)
              .slice(0, 30);
            setRequests(mergedRequests);
            writePersonalArray("my-lombok-requests", mergedRequests, user.id);
          }
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
      } catch {
        if (active && activeUserId.current === user.id) setNotice("La synchronisation est momentanément indisponible. Vos données locales ne seront pas écrasées.");
      }
    })();
    return () => { active = false; };
  }, [user]);

  useEffect(() => {
    if (!user || !syncReady) return;
    if (skipNextCloudSync.current) { skipNextCloudSync.current = false; return; }
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const expectedUserId = user.id;
    const timer = window.setTimeout(async () => {
      try {
        const { data: identity, error: identityError } = await supabase.auth.getUser();
        if (identityError || identity.user?.id !== expectedUserId || activeUserId.current !== expectedUserId) return;
        const { error } = await supabase.from("user_state").upsert({ user_id: expectedUserId, favorites, visited, requests, preferences: { dark, muslimMode }, updated_at: new Date().toISOString() });
        if (error && activeUserId.current === expectedUserId) setNotice("La synchronisation est momentanément indisponible. Vos données restent sur cet appareil.");
      } catch {
        if (activeUserId.current === expectedUserId) setNotice("La synchronisation est momentanément indisponible. Vos données restent sur cet appareil.");
      }
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
    clearPersonalState(user?.id || null);
    ["my-lombok-muslim-mode", "my-lombok-theme"].forEach((key) => localStorage.removeItem(key));
    setFavorites([]); setVisited([]); setRequests([]); setMuslimMode(false); setDark(false); delete document.documentElement.dataset.theme;
    setNotice("Les données locales de cet appareil ont été effacées.");
  }

  async function signOut() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        setNotice("Vous êtes déconnecté.");
        return;
      }
    } catch {
      // Le message ci-dessous couvre aussi une panne réseau pendant la déconnexion.
    }
    if (activeUserId.current) {
      setNotice("La déconnexion n’a pas abouti. Réessayez avant de quitter cet appareil.");
    }
  }

  return (
    <div className="profile-layout">
      {notice && <div className="profile-notice" role="status">{notice}</div>}
      <section className="profile-account">
        <div className="profile-account__avatar">{user ? String(displayName).slice(0, 1).toUpperCase() : <UserRound aria-hidden="true" />}</div>
        <div><span className="eyebrow">Votre espace personnel</span><h2>{loading ? "Vérification…" : user ? `Bonjour ${displayName}` : supabaseAvailable ? "Retrouvez votre carnet partout" : "Votre carnet reste sur cet appareil"}</h2><p>{user ? user.email : supabaseAvailable ? "Un compte permet de synchroniser vos favoris et vos demandes entre vos appareils." : "Favoris, visites et demandes restent disponibles localement. La synchronisation par compte n’est pas encore activée sur ce déploiement."}</p></div>
        {user ? <button className="button button--outline" onClick={signOut}><LogOut aria-hidden="true" /> Se déconnecter</button> : supabaseAvailable ? <button className="button button--primary" onClick={() => setAuthOpen(true)} disabled={loading}>Créer ou ouvrir mon compte</button> : <span className="profile-account__local-status"><ShieldCheck aria-hidden="true" /> Carnet local actif</span>}
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
  const appleEnabled = isSupabaseOAuthProviderEnabled("apple");
  const googleEnabled = isSupabaseOAuthProviderEnabled("google");
  const hasSocialAuth = appleEnabled || googleEnabled;
  const activeMode = recovery ? "recovery" : mode;

  async function social(provider: SupabaseOAuthProvider) {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) { setError("Le service de comptes n’est pas configuré sur ce déploiement."); return; }
    if (!isSupabaseOAuthProviderEnabled(provider)) { setError("Ce mode de connexion n’est pas encore disponible."); return; }
    setBusy(true); setError("");
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${window.location.origin}/profil` } });
      if (authError) { setError("Ce mode de connexion n’est pas disponible pour le moment."); setBusy(false); }
    } catch {
      setError("Ce mode de connexion n’est pas disponible pour le moment.");
      setBusy(false);
    }
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
    try {
      const result = activeMode === "recovery"
        ? await supabase.auth.updateUser({ password })
        : activeMode === "signup"
          ? await supabase.auth.signUp({ email, password, options: { data: { full_name: name }, emailRedirectTo: `${window.location.origin}/profil` } })
          : await supabase.auth.signInWithPassword({ email, password });
      if (result.error) { setError(getAuthErrorMessage(result.error.message)); return; }
      const needsConfirmation = activeMode === "signup" && "session" in result.data && !result.data.session;
      onNotice(activeMode === "recovery" ? "Votre nouveau mot de passe est enregistré." : needsConfirmation ? "Compte créé. Consultez votre e-mail pour le confirmer." : "Votre compte est connecté.");
      close();
    } catch {
      setError("Connexion impossible. Vérifiez votre réseau puis réessayez.");
    } finally {
      setBusy(false);
    }
  }

  async function resetPassword() {
    const email = window.prompt("Adresse e-mail de votre compte MyLombok :")?.trim();
    const supabase = getSupabaseBrowserClient();
    if (!email || !supabase) return;
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/profil` });
      if (resetError) setError("Impossible d’envoyer l’e-mail de réinitialisation.");
      else onNotice("Un e-mail de réinitialisation vient d’être envoyé.");
    } catch {
      setError("Impossible d’envoyer l’e-mail de réinitialisation.");
    }
  }

  return (
    <div className="dialog-backdrop" onMouseDown={close}>
      <section className="auth-dialog" ref={ref} role="dialog" aria-modal="true" aria-labelledby="auth-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="dialog-close" onClick={close} aria-label="Fermer"><X aria-hidden="true" /></button>
        <span className="eyebrow">Votre carnet personnel</span>
        <h2 id="auth-title">{activeMode === "recovery" ? "Choisir un nouveau mot de passe" : activeMode === "signup" ? "Créer votre espace MyLombok" : "Heureux de vous revoir"}</h2>
        <p>{activeMode === "recovery" ? "Saisissez un nouveau mot de passe pour sécuriser votre carnet." : "Synchronisez vos favoris, visites et demandes entre vos appareils."}</p>
        {!supabaseAvailable && <div className="auth-warning" role="alert">La création de compte est prête dans l’application, mais aucun projet Supabase MyLombok n’est configuré sur ce déploiement.</div>}
        {activeMode !== "recovery" && hasSocialAuth && <div className="social-auth">
          {appleEnabled && <button type="button" disabled={busy || !supabaseAvailable} onClick={() => social("apple")}><Apple aria-hidden="true" /> Continuer avec Apple</button>}
          {googleEnabled && <button type="button" disabled={busy || !supabaseAvailable} onClick={() => social("google")}><b aria-hidden="true">G</b> Continuer avec Google</button>}
        </div>}
        {activeMode !== "recovery" && hasSocialAuth && <div className="auth-divider"><span>ou avec votre e-mail</span></div>}
        <form onSubmit={emailAuth}>
          {activeMode === "signup" && <label>Prénom ou nom<input name="name" required maxLength={80} autoComplete="name" /></label>}
          {activeMode !== "recovery" && <label>Adresse e-mail<input name="email" type="email" required maxLength={254} autoComplete="email" /></label>}
          <label>Mot de passe<div className="password-field"><input name="password" type={showPassword ? "text" : "password"} minLength={activeMode === "signin" ? 1 : 10} maxLength={128} required autoComplete={activeMode === "signin" ? "current-password" : "new-password"} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}>{showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}</button></div></label>
          {error && <div className="auth-error" role="alert">{error}</div>}
          <button className="button button--primary button--large" disabled={busy || !supabaseAvailable} type="submit">{busy ? "Validation…" : activeMode === "recovery" ? "Enregistrer le mot de passe" : activeMode === "signup" ? "Créer mon compte" : "Me connecter"}</button>
        </form>
        {activeMode === "signin" && <button type="button" className="auth-text-action" onClick={resetPassword}>Mot de passe oublié ?</button>}
        {activeMode !== "recovery" && <button type="button" className="auth-text-action" onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setError(""); }}>{mode === "signup" ? "J’ai déjà un compte" : "Créer un nouveau compte"}</button>}
        <small>En continuant, vous acceptez que les données de votre carnet soient synchronisées. Consultez notre <a href="/confidentialite">politique de confidentialité</a>.</small>
      </section>
    </div>
  );
}
