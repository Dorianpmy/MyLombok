import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { CheckoutButton } from "../components/checkout-button";

export const metadata: Metadata = {
  title: "Contacts utiles",
  description: "2 contacts locaux à joindre (logements et visa) pour s’installer à Lombok — inclus dans l’accès app 69 €.",
};

const categories = [
  {
    title: "Logements",
    items: [
      {
        name: "Contact immobilier longue durée",
        note: "Pour une visite, un bail ou une question de loyer longue durée. Inclus dans l’accès app.",
      },
    ],
  },
  {
    title: "Visa",
    items: [
      {
        name: "Contact démarches visa",
        note: "Pour savoir à qui t’adresser ou où te rendre pour les formalités courantes. Inclus dans l’accès app.",
      },
    ],
  },
];

export default function ContactsPage() {
  return (
    <main className="inner-page">
      <section className="site-section">
        <div className="site-container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Le plus important</span>
              <h1>Contacts utiles</h1>
            </div>
            <p>
              Avec l’accès app (69 €) : <strong>2 contacts locaux à joindre</strong> — logements et visa.
              L’idée : poser ta question à quelqu’un sur place, pas chercher pendant des heures sur des groupes au hasard.
            </p>
          </div>

          <div className="final-cta" style={{ marginTop: "2rem", padding: "1.5rem 2rem", borderRadius: "1rem" }}>
            <p style={{ margin: 0, display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
              <Phone aria-hidden="true" style={{ flexShrink: 0, marginTop: 4 }} />
              <span>
                <strong>2 contacts inclus</strong> dans l’app : un pour les logements longue durée, un pour le visa / les formalités.
                Les coordonnées te sont communiquées après paiement (ou sur demande WhatsApp si tu as déjà payé).
              </span>
            </p>
          </div>

          <div style={{ marginTop: "2.5rem", display: "grid", gap: "2rem" }}>
            {categories.map((cat) => (
              <div key={cat.title}>
                <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>{cat.title}</h2>
                {cat.items.map((item) => (
                  <div key={item.name} style={{ padding: "1rem 0", borderBottom: "1px solid color-mix(in srgb, currentColor 12%, transparent)" }}>
                    <strong>{item.name}</strong>
                    <p style={{ margin: "0.35rem 0 0", opacity: 0.8 }}>{item.note}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="final-cta" style={{ marginTop: "2.5rem", padding: "2rem", borderRadius: "1rem" }}>
            <h2>Débloquer les 2 contacts</h2>
            <p>Accès app 69 € — paiement unique, pas d’abonnement.</p>
            <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
              <CheckoutButton label="Payer 69 € — accès immédiat" />
              <a
                className="button button--outline"
                href="https://wa.me/33763664857?text=Salut%20%21%20J%27ai%20pay%C3%A9%20l%27acc%C3%A8s%20app%20et%20je%20voudrais%20les%202%20contacts%20(logement%20%2B%20visa)."
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle aria-hidden="true" /> Déjà payé ? WhatsApp
              </a>
            </div>
          </div>

          <div style={{ marginTop: "2rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <Link className="editorial-link" href="/accompagnement">Voir tous les tarifs →</Link>
            <Link className="editorial-link" href="/parcours">Parcours guidé →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
