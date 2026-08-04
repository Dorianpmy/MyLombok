"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, CalendarDays, Check, MessageCircle, UsersRound } from "lucide-react";
import { readPersonalArray, writePersonalArray } from "../lib/local-state";
import { getSupabaseBrowserClient } from "../lib/supabase";

const WHATSAPP_NUMBER = "33763664857";
const DRAFT_KEY = "my-lombok-concierge-draft";

const serviceOptions = [
  ["sejour", "Organisation du séjour"],
  ["transfert", "Transfert aéroport"],
  ["mobilite", "Scooter, voiture ou chauffeur"],
  ["activite", "Activité ou excursion"],
  ["restaurant", "Restaurant ou occasion spéciale"],
  ["autre", "Autre demande"],
] as const;

type FormErrors = Partial<Record<"name" | "contact" | "dates" | "message" | "consent", string>>;
type FormDraft = Partial<Record<"service" | "arrival" | "departure" | "travelers" | "name" | "email" | "phone" | "message", string>>;
type StoredRequest = { id: number; title: string; detail: string; status: string };

async function storeRequestForVerifiedUser(request: StoredRequest) {
  const supabase = getSupabaseBrowserClient();
  let userId: string | null = null;

  if (supabase) {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (!error) userId = data.user?.id || null;
    } catch {
      // En cas de panne réseau, la demande rejoint le carnet invité plutôt qu’un ancien compte.
    }
  }

  const localHistory = readPersonalArray<StoredRequest>("my-lombok-requests", userId);
  const nextLocalHistory = [request, ...localHistory]
    .filter((item, index, all) => all.findIndex((candidate) => candidate.id === item.id) === index)
    .slice(0, 30);
  writePersonalArray("my-lombok-requests", nextLocalHistory, userId);

  if (!supabase || !userId) return;
  try {
    const { data, error } = await supabase.from("user_state").select("requests").eq("user_id", userId).maybeSingle();
    if (error) return;
    const cloudHistory = Array.isArray(data?.requests) ? data.requests as StoredRequest[] : [];
    const mergedHistory = [request, ...localHistory, ...cloudHistory]
      .filter((item, index, all) => all.findIndex((candidate) => candidate.id === item.id) === index)
      .slice(0, 30);
    writePersonalArray("my-lombok-requests", mergedHistory, userId);
    await supabase.from("user_state").upsert({ user_id: userId, requests: mergedHistory, updated_at: new Date().toISOString() });
  } catch {
    // La copie locale vérifiée sera resynchronisée lors de la prochaine ouverture du profil.
  }
}

function localDateInputValue(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${value}T12:00:00`));
}

export function ConciergeForm({ initialService = "sejour", initialPlace = "" }: { initialService?: string; initialPlace?: string }) {
  const validInitial = serviceOptions.some(([value]) => value === initialService) ? initialService : "sejour";
  const [service, setService] = useState(validInitial);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [whatsappOpened, setWhatsappOpened] = useState(true);
  const [lastUrl, setLastUrl] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const openingRef = useRef(false);
  const openingTimerRef = useRef<number | null>(null);
  const today = localDateInputValue();

  useEffect(() => {
    let restoreTimer: number | null = null;
    try {
      const parsed = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || "{}") as FormDraft;
      const form = formRef.current;
      if (!form || !parsed || typeof parsed !== "object") return;
      for (const field of ["arrival", "departure", "travelers", "name", "email", "phone", "message"] as const) {
        if (field === "message" && initialPlace) continue;
        const control = form.elements.namedItem(field);
        if ((control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement || control instanceof HTMLSelectElement) && typeof parsed[field] === "string") {
          control.value = parsed[field] || "";
        }
      }
      if (initialService === "sejour" && serviceOptions.some(([value]) => value === parsed.service)) {
        restoreTimer = window.setTimeout(() => setService(parsed.service || "sejour"), 0);
      }
    } catch {
      try {
        sessionStorage.removeItem(DRAFT_KEY);
      } catch {
        // Aucun stockage de session n’est requis pour utiliser le formulaire.
      }
    }
    return () => {
      if (restoreTimer) window.clearTimeout(restoreTimer);
      if (openingTimerRef.current) window.clearTimeout(openingTimerRef.current);
    };
  }, [initialPlace, initialService]);

  function saveDraft(form: HTMLFormElement | null, selectedService = service) {
    if (!form) return;
    const data = new FormData(form);
    const draft: FormDraft = { service: selectedService };
    for (const field of ["arrival", "departure", "travelers", "name", "email", "phone", "message"] as const) {
      draft[field] = String(data.get(field) || "");
    }
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // Le formulaire reste utilisable lorsque le stockage privé est indisponible.
    }
  }

  function selectService(value: string) {
    setService(value);
    setSubmitted(false);
    saveDraft(formRef.current, value);
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (openingRef.current) return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const arrival = String(form.get("arrival") || "");
    const departure = String(form.get("departure") || "");
    const travelers = String(form.get("travelers") || "");
    const message = String(form.get("message") || "").trim();
    const consent = form.get("consent") === "on";
    const nextErrors: FormErrors = {};
    if (name.length < 2) nextErrors.name = "Indiquez votre prénom ou votre nom.";
    const contactDigits = phone.replace(/\D/g, "");
    const looksLikeEmail = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const looksLikePhone = !phone || contactDigits.length >= 7;
    if ((!email && !phone) || !looksLikeEmail || !looksLikePhone) nextErrors.contact = "Indiquez au moins un e-mail ou un numéro valide.";
    if ((arrival && arrival < today) || (departure && departure < today)) nextErrors.dates = "Choisissez une date à partir d’aujourd’hui.";
    else if (arrival && departure && departure < arrival) nextErrors.dates = "La date de départ doit être postérieure à l’arrivée.";
    if (message.length < 10) nextErrors.message = "Ajoutez quelques précisions pour que nous puissions vous répondre utilement.";
    if (!consent) nextErrors.consent = "Votre accord est nécessaire pour préparer cette demande.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      window.setTimeout(() => formElement.querySelector<HTMLElement>("[aria-invalid='true']")?.focus(), 0);
      return;
    }

    const serviceLabel = serviceOptions.find(([value]) => value === service)?.[1] || service;
    const period = arrival && departure
      ? `du ${formatDate(arrival)} au ${formatDate(departure)}`
      : arrival
        ? `à partir du ${formatDate(arrival)}`
        : departure
          ? `jusqu’au ${formatDate(departure)}`
          : "à préciser";
    const text = [
      "Bonjour MyLombok,",
      "",
      `Je m’appelle ${name}.`,
      `Ma demande : ${serviceLabel}.`,
      `Période : ${period}.`,
      `Voyageurs : ${travelers}.`,
      `Contact : ${[email, phone].filter(Boolean).join(" · ")}.`,
      "",
      message,
      "",
      "Message préparé depuis my-lombok.vercel.app",
    ].join("\n");
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    openingRef.current = true;
    setIsOpening(true);
    const opened = window.open(url, "_blank");
    if (opened) opened.opener = null;
    try {
      void storeRequestForVerifiedUser({ id: Date.now(), title: serviceLabel, detail: `${name} · ${arrival || "Dates à préciser"}`, status: opened ? "WhatsApp ouvert" : "Message préparé" });
      sessionStorage.removeItem(DRAFT_KEY);
    } catch {
      // Le blocage du stockage local ne doit pas empêcher l’utilisateur de contacter MyLombok.
    }
    setLastUrl(url);
    setWhatsappOpened(Boolean(opened));
    setSubmitted(true);
    openingTimerRef.current = window.setTimeout(() => { openingRef.current = false; setIsOpening(false); }, 1400);
  }

  return (
    <section className="concierge-form-shell" aria-labelledby="concierge-form-title">
      <div className="concierge-form-heading">
        <span>Votre demande</span>
        <h2 id="concierge-form-title">Commençons par l’essentiel.</h2>
        <p>Les champs marqués d’un astérisque sont nécessaires. Votre message sera préparé puis ouvert dans WhatsApp.</p>
      </div>
      {submitted && (
        <div className="form-success" role="status">
          <Check aria-hidden="true" />
          <div><strong>{whatsappOpened ? "WhatsApp a été ouvert avec votre message." : "Votre message est prêt."}</strong><p>{whatsappOpened ? "MyLombok ne le considère pas comme envoyé tant que vous ne le validez pas dans WhatsApp." : "L’ouverture automatique a été bloquée. Utilisez le lien ci-contre pour poursuivre."}</p></div>
          <a href={lastUrl} target="_blank" rel="noopener noreferrer">Rouvrir WhatsApp</a>
        </div>
      )}
      <form ref={formRef} className="concierge-form" onSubmit={submit} onChange={(event) => { setSubmitted(false); saveDraft(event.currentTarget); }} noValidate>
        <fieldset>
          <legend><span>01</span> Que souhaitez-vous organiser ?</legend>
          <div className="service-choice-grid">
            {serviceOptions.map(([value, label]) => <button type="button" key={value} className={service === value ? "is-selected" : ""} aria-pressed={service === value} onClick={() => selectService(value)}>{label}</button>)}
          </div>
        </fieldset>
        <fieldset>
          <legend><span>02</span> Quand venez-vous ?</legend>
          <div className="form-grid form-grid--two">
            <label>Arrivée <span>optionnel</span><div className="input-with-icon"><CalendarDays aria-hidden="true" /><input name="arrival" type="date" min={today} aria-invalid={Boolean(errors.dates)} aria-describedby={errors.dates ? "dates-error" : undefined} /></div></label>
            <label>Départ <span>optionnel</span><div className="input-with-icon"><CalendarDays aria-hidden="true" /><input name="departure" type="date" min={today} aria-invalid={Boolean(errors.dates)} aria-describedby={errors.dates ? "dates-error" : undefined} /></div></label>
          </div>
          {errors.dates && <p className="field-error" id="dates-error" role="alert">{errors.dates}</p>}
          <label>Nombre de voyageurs<div className="input-with-icon"><UsersRound aria-hidden="true" /><select name="travelers" defaultValue="2"><option value="1">1 personne</option><option value="2">2 personnes</option><option value="3-4">3 à 4 personnes</option><option value="5+">5 personnes ou plus</option></select></div></label>
        </fieldset>
        <fieldset>
          <legend><span>03</span> Comment vous répondre ?</legend>
          <div className="form-grid form-grid--two">
            <label className="form-grid__full">Prénom ou nom *<input name="name" autoComplete="name" maxLength={80} required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} placeholder="Votre nom" />{errors.name && <span className="field-error" id="name-error">{errors.name}</span>}</label>
            <label>E-mail <span>au moins un contact *</span><input name="email" type="email" autoComplete="email" autoCapitalize="none" maxLength={120} aria-invalid={Boolean(errors.contact)} aria-describedby={errors.contact ? "contact-error" : undefined} placeholder="vous@email.com" /></label>
            <label>Téléphone / WhatsApp <span>au moins un contact *</span><input name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={40} aria-invalid={Boolean(errors.contact)} aria-describedby={errors.contact ? "contact-error" : undefined} placeholder="+33 6…" /></label>
          </div>
          {errors.contact && <p className="field-error" id="contact-error" role="alert">{errors.contact}</p>}
          <label>Votre message *<textarea name="message" rows={6} maxLength={1600} required defaultValue={initialPlace ? `Je souhaite organiser quelque chose autour de ${initialPlace}.` : undefined} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "message-error" : undefined} placeholder="Parlez-nous de votre séjour, de vos priorités et de ce que vous souhaitez déléguer." />{errors.message && <span className="field-error" id="message-error">{errors.message}</span>}</label>
          <label className="consent-field"><input name="consent" type="checkbox" required aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "consent-error" : undefined} /> <span>J’accepte que ces informations soient utilisées pour répondre à ma demande. Elles ne sont pas envoyées à MyLombok avant ma validation dans WhatsApp.</span></label>
          {errors.consent && <p className="field-error" id="consent-error" role="alert">{errors.consent}</p>}
        </fieldset>
        <p className="form-draft-note">Votre brouillon est conservé uniquement dans cet onglet jusqu’à l’ouverture de WhatsApp.</p>
        <button className="button button--primary button--large form-submit" type="submit" disabled={isOpening} aria-busy={isOpening}><MessageCircle aria-hidden="true" /> {isOpening ? "Ouverture de WhatsApp…" : "Préparer mon message WhatsApp"} <ArrowRight aria-hidden="true" /></button>
      </form>
    </section>
  );
}
