import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Sparkles, Smartphone } from "lucide-react";
import { CheckoutButton } from "../components/checkout-button";

export const metadata: Metadata = {
  title: "Accompagnement & tarifs",
  description: "App 39 € avec contacts locaux. Accompagnement humain à partir de 250 € pour s’installer à Lombok.",
};

function waLink(message: string) {
  return `https://wa.me/33763664857?text=${encodeURIComponent(message)}`;
}

const formulas = [
  {
    number: "01",
    name: "Essentiel",
    price: "250 €",
    items: ["Clarification du projet", "Orientation zone", "Checklist personnalisée", "Support WhatsApp limité"],
    message:
      "Salut ! Je suis intéressé par la formule Essentiel (250 €) pour m’installer à Lombok. Tu peux me dire comment on démarre ?",
  },
  {
    number: "02",
    name: "Complet",
    price: "600 €",
    items: ["Tout Essentiel", "Aide visa / démarches", "Recherche logement", "Préparation arrivée", "Support étendu"],
    message:
      "Salut ! Je regarde la formule Complet (600 €) — aide visa, logement et préparation arrivée. Tu as un créneau pour en parler ?",
  },
  {
    number: "03",
    name: "Premium / A à Z",
    price: "1 200 €",
    items: ["Tout Complet", "Suivi sur place", "Contacts locaux prioritaires", "Ajustements après arrivée", "Accompagnement prolongé"],
    message:
      "Salut ! Je voudrais l’accompagnement Premium / A à Z (1 200 €) pour m’installer à Lombok sans stress. On peut en discuter ?",
  },
];

export default function AccompagnementPage() {
  return (
    <main className="inner-page">
      <section className="site-section">
        <div className="site-container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Tarifs clairs</span>
              <h1>App & accompagnement</h1>
            </div>
            <p>L’app te donne surtout des contacts à joindre. L’accompagnement humain, c’est si tu préfères déléguer une partie du travail.</p>
          </div>

          <article className="service-editorial" style={{ marginTop: "2rem" }}>
            <span className="service-editorial__number">00</span>
            <span className="service-editorial__icon"><Smartphone aria-hidden="true" /></span>
            <div>
              <h3>Accès app (one-shot)</h3>
              <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>39 €</p>
              <p>
                <strong>Le plus important : les contacts locaux</strong> à joindre pour le logement, les démarches, la vie pratique.
                Plus les zones, tips et parcours. Paiement unique via Stripe — pas d’abonnement.
              </p>
              <div style={{ marginTop: "1rem" }}>
                <CheckoutButton label="Payer 39 € — accès immédiat" />
              </div>
            </div>
            <span aria-hidden="true" />
          </article>

          <div className="service-editorial-list" style={{ marginTop: "1rem" }}>
            {formulas.map((f) => (
              <article className="service-editorial" key={f.name}>
                <span className="service-editorial__number">{f.number}</span>
                <span className="service-editorial__icon"><Sparkles aria-hidden="true" /></span>
                <div>
                  <h3>{f.name}</h3>
                  <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>{f.price}</p>
                  <p>{f.items.join(" · ")}</p>
                </div>
                <a href={waLink(f.message)} target="_blank" rel="noopener noreferrer">Demander</a>
              </article>
            ))}
          </div>

          <div className="final-cta" style={{ marginTop: "3rem", padding: "2rem", borderRadius: "1rem" }}>
            <h2>On en parle ?</h2>
            <p>Dis-moi où tu en es. Une discussion suffit pour voir si l’app seule ou un accompagnement a plus de sens.</p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1.25rem" }}>
              <a
                className="button button--primary"
                href={waLink("Salut ! J’aimerais discuter de mon projet d’installation à Lombok. Tu es dispo pour un échange rapide ?")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle aria-hidden="true" /> Discuter sur WhatsApp
              </a>
              <Link className="button button--outline" href="/contacts">Voir la page contacts</Link>
            </div>
          </div>

          <p style={{ marginTop: "2rem", opacity: 0.75, fontSize: "0.95rem" }}>
            App 39 € (contacts + guides) via Stripe. Accompagnement humain dès 250 € sur WhatsApp. Les deux sont optionnels l’un par rapport à l’autre.
          </p>
        </div>
      </section>
    </main>
  );
}
