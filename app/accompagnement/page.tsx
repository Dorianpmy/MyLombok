import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Accompagnement A à Z",
  description: "Accompagnement humain pour s’installer à Lombok. Formules accessibles, adaptées au coût de la vie local.",
};

const formulas = [
  {
    name: "Essentiel",
    price: "250–450 €",
    items: ["Clarification du projet", "Orientation zone", "Checklist personnalisée", "Support WhatsApp limité"],
  },
  {
    name: "Complet",
    price: "600–1000 €",
    items: ["Tout Essentiel", "Aide visa / démarches", "Recherche logement", "Préparation arrivée", "Support étendu"],
  },
  {
    name: "Premium / A à Z",
    price: "1200–2000 €",
    items: ["Tout Complet", "Suivi sur place", "Contacts locaux prioritaires", "Ajustements après arrivée", "Accompagnement prolongé"],
  },
];

export default function AccompagnementPage() {
  return (
    <main className="inner-page">
      <section className="site-section">
        <div className="site-container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Service humain</span>
              <h1>Accompagnement A à Z</h1>
            </div>
            <p>Pour ceux qui préfèrent déléguer. Des formules accessibles, pensées pour le coût de la vie à Lombok — pas des tarifs d’agence européenne.</p>
          </div>

          <div className="service-editorial-list" style={{ marginTop: "2.5rem" }}>
            {formulas.map((f) => (
              <article className="service-editorial" key={f.name}>
                <div>
                  <h3>{f.name}</h3>
                  <p style={{ fontSize: "1.25rem", fontWeight: 600, margin: "0.5rem 0" }}>{f.price}</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {f.items.map((item) => (
                      <li key={item} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", marginBottom: "0.35rem" }}>
                        <Check aria-hidden="true" size={18} style={{ flexShrink: 0, marginTop: 2 }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          <div className="final-cta" style={{ marginTop: "3rem", padding: "2rem", borderRadius: "1rem" }}>
            <h2>On en parle ?</h2>
            <p>Dis-moi où tu en es. Une discussion suffit pour voir ce qui a du sens pour toi.</p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1.25rem" }}>
              <a className="button button--primary" href="https://wa.me/33763664857" target="_blank" rel="noopener noreferrer">
                <MessageCircle aria-hidden="true" /> Discuter sur WhatsApp
              </a>
              <Link className="button button--outline" href="/parcours">Voir le parcours seul</Link>
            </div>
          </div>

          <p style={{ marginTop: "2rem", opacity: 0.75, fontSize: "0.95rem" }}>
            L’app reste utile seule. L’accompagnement est une option, pas une obligation.
          </p>
        </div>
      </section>
    </main>
  );
}
