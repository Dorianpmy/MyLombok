import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contacts utiles",
  description: "Contacts pour s’installer à Lombok : immobilier longue durée, visa, et autres ressources pratiques.",
};

const categories = [
  {
    title: "Immobilier longue durée",
    items: [
      { name: "À venir", note: "Contacts locaux pour locations longue durée — base en construction." },
    ],
  },
  {
    title: "Visa & formalités",
    items: [
      { name: "À venir", note: "Repères et contacts pour les démarches courantes." },
    ],
  },
  {
    title: "Autres",
    items: [
      { name: "À venir", note: "SIM, banques, santé… mis à jour au fil de l’eau." },
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
              <span className="eyebrow">Ressources</span>
              <h1>Contacts utiles</h1>
            </div>
            <p>Base en construction. Je mets à jour régulièrement avec des contacts vérifiés sur place.</p>
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

          <div className="final-cta" style={{ marginTop: "3rem", padding: "2rem", borderRadius: "1rem" }}>
            <h2>Besoin d’un contact précis ?</h2>
            <p>Écris-moi. Je peux t’orienter selon ta zone et ton projet.</p>
            <a className="button button--primary" href="https://wa.me/33763664857" target="_blank" rel="noopener noreferrer" style={{ marginTop: "1rem", display: "inline-flex" }}>
              <MessageCircle aria-hidden="true" /> WhatsApp
            </a>
          </div>

          <div style={{ marginTop: "2rem" }}>
            <Link className="editorial-link" href="/parcours">Retour au parcours →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
