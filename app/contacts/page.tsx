import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Contacts utiles",
  description: "Le cœur de MyLombok : des contacts locaux à joindre pour le logement, les démarches et la vie à Lombok.",
};

const categories = [
  {
    title: "Immobilier longue durée",
    items: [
      { name: "Bientôt disponible", note: "Contacts pour locations longue durée par zone. Tu pourras les joindre pour une visite, un bail, une question de loyer." },
    ],
  },
  {
    title: "Visa & formalités",
    items: [
      { name: "Bientôt disponible", note: "Repères et contacts pour les démarches courantes — pour savoir à qui écrire ou où te rendre." },
    ],
  },
  {
    title: "Vie pratique",
    items: [
      { name: "Bientôt disponible", note: "SIM, banques, santé, scooter… des personnes ou lieux à contacter selon ton besoin." },
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
              C’est le cœur de l’app à 39 € : des contacts locaux que tu peux joindre pour savoir ci ou ça —
              logement, démarches, vie sur place. Pas seulement des articles à lire.
            </p>
          </div>

          <div className="final-cta" style={{ marginTop: "2rem", padding: "1.5rem 2rem", borderRadius: "1rem" }}>
            <p style={{ margin: 0, display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
              <Phone aria-hidden="true" style={{ flexShrink: 0, marginTop: 4 }} />
              <span>
                <strong>Tu as une question précise ?</strong> L’idée est de pouvoir contacter quelqu’un sur place
                plutôt que de chercher pendant des heures sur des groupes au hasard.
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

          <p style={{ marginTop: "2rem", opacity: 0.8 }}>
            La base se remplit progressivement avec des contacts vérifiés. En attendant, tu peux m’écrire :
            je t’oriente selon ta zone et ton projet.
          </p>

          <div className="final-cta" style={{ marginTop: "2rem", padding: "2rem", borderRadius: "1rem" }}>
            <h2>Besoin d’un contact tout de suite ?</h2>
            <p>Écris-moi sur WhatsApp. Je te dirige vers la bonne personne ou la bonne démarche.</p>
            <a className="button button--primary" href="https://wa.me/33763664857" target="_blank" rel="noopener noreferrer" style={{ marginTop: "1rem", display: "inline-flex" }}>
              <MessageCircle aria-hidden="true" /> WhatsApp
            </a>
          </div>

          <div style={{ marginTop: "2rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <Link className="editorial-link" href="/accompagnement">Accès app 39 € →</Link>
            <Link className="editorial-link" href="/parcours">Parcours guidé →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
