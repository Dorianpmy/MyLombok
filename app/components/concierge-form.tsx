"use client";

import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Check, MessageCircle, UsersRound } from "lucide-react";

const WHATSAPP_NUMBER = "33763664857";

const serviceOptions = [
  ["sejour", "Organisation du séjour"],
  ["transfert", "Transfert aéroport"],
  ["mobilite", "Scooter, voiture ou chauffeur"],
  ["activite", "Activité ou excursion"],
  ["restaurant", "Restaurant ou occasion spéciale"],
  ["autre", "Autre demande"],
] as const;

type FormErrors = Partial<Record<"name" | "contact" | "dates" | "message" | "consent", string>>;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${value}T12:00:00`));
}

export function ConciergeForm({ initialService = "sejour" }: { initialService?: string }) {
  const validInitial = serviceOptions.some(([value]) => value === initialService) ? initialService : "sejour";
  const [service, setService] = useState(validInitial);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [lastUrl, setLastUrl] = useState("");
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const name = String(form.get("name") || "").trim();
    const contact = String(form.get("contact") || "").trim();
    const arrival = String(form.get("arrival") || "");
    const departure = String(form.get("departure") || "");
    const travelers = String(form.get("travelers") || "");
    const message = String(form.get("message") || "").trim();
    const consent = form.get("consent") === "on";
    const nextErrors: FormErrors = {};
    if (name.length < 2) nextErrors.name = "Indiquez votre prénom ou votre nom.";
    if (contact.length < 5) nextErrors.contact = "Indiquez un e-mail ou un numéro où vous joindre.";
    if (arrival && departure && departure < arrival) nextErrors.dates = "La date de départ doit être postérieure à l’arrivée.";
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
      `Contact : ${contact}.`,
      "",
      message,
      "",
      "Message préparé depuis my-lombok.vercel.app",
    ].join("\n");
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    let history: unknown[] = [];
    try {
      const stored = JSON.parse(localStorage.getItem("my-lombok-requests") || "[]") as unknown;
      if (Array.isArray(stored)) history = stored;
    } catch {
      // Un ancien historique corrompu ne doit jamais bloquer l’ouverture de WhatsApp.
    }
    localStorage.setItem("my-lombok-requests", JSON.stringify([{ id: Date.now(), title: serviceLabel, detail: `${name} · ${arrival || "Dates à préciser"}`, status: "WhatsApp ouvert" }, ...history].slice(0, 30)));
    setLastUrl(url);
    setSubmitted(true);
    window.open(url, "_blank", "noopener,noreferrer");
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
          <div><strong>Votre message est prêt dans WhatsApp.</strong><p>MyLombok ne le considère pas comme envoyé tant que vous ne le validez pas dans WhatsApp.</p></div>
          <a href={lastUrl} target="_blank" rel="noopener noreferrer">Rouvrir WhatsApp</a>
        </div>
      )}
      <form className="concierge-form" onSubmit={submit} noValidate>
        <fieldset>
          <legend><span>01</span> Que souhaitez-vous organiser ?</legend>
          <div className="service-choice-grid">
            {serviceOptions.map(([value, label]) => <button type="button" key={value} className={service === value ? "is-selected" : ""} aria-pressed={service === value} onClick={() => setService(value)}>{label}</button>)}
          </div>
        </fieldset>
        <fieldset>
          <legend><span>02</span> Quand venez-vous ?</legend>
          <div className="form-grid form-grid--two">
            <label>Arrivée <span>optionnel</span><div className="input-with-icon"><CalendarDays aria-hidden="true" /><input name="arrival" type="date" min={today} aria-invalid={Boolean(errors.dates)} /></div></label>
            <label>Départ <span>optionnel</span><div className="input-with-icon"><CalendarDays aria-hidden="true" /><input name="departure" type="date" min={today} aria-invalid={Boolean(errors.dates)} /></div></label>
          </div>
          {errors.dates && <p className="field-error" role="alert">{errors.dates}</p>}
          <label>Nombre de voyageurs<div className="input-with-icon"><UsersRound aria-hidden="true" /><select name="travelers" defaultValue="2"><option value="1">1 personne</option><option value="2">2 personnes</option><option value="3-4">3 à 4 personnes</option><option value="5+">5 personnes ou plus</option></select></div></label>
        </fieldset>
        <fieldset>
          <legend><span>03</span> Comment vous répondre ?</legend>
          <div className="form-grid form-grid--two">
            <label>Prénom ou nom *<input name="name" autoComplete="name" maxLength={80} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} placeholder="Votre nom" />{errors.name && <span className="field-error" id="name-error">{errors.name}</span>}</label>
            <label>E-mail ou téléphone *<input name="contact" autoComplete="email" maxLength={120} aria-invalid={Boolean(errors.contact)} aria-describedby={errors.contact ? "contact-error" : undefined} placeholder="vous@email.com" />{errors.contact && <span className="field-error" id="contact-error">{errors.contact}</span>}</label>
          </div>
          <label>Votre message *<textarea name="message" rows={6} maxLength={1600} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "message-error" : undefined} placeholder="Parlez-nous de votre séjour, de vos priorités et de ce que vous souhaitez déléguer." />{errors.message && <span className="field-error" id="message-error">{errors.message}</span>}</label>
          <label className="consent-field"><input name="consent" type="checkbox" aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "consent-error" : undefined} /> <span>J’accepte que ces informations soient utilisées pour répondre à ma demande. Elles ne sont pas envoyées à MyLombok avant ma validation dans WhatsApp.</span></label>
          {errors.consent && <p className="field-error" id="consent-error" role="alert">{errors.consent}</p>}
        </fieldset>
        <button className="button button--primary button--large form-submit" type="submit"><MessageCircle aria-hidden="true" /> Préparer mon message WhatsApp <ArrowRight aria-hidden="true" /></button>
      </form>
    </section>
  );
}
