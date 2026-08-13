import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Sparkles, Smartphone } from "lucide-react";

export const metadata: Metadata = {
  title: "Accompagnement & tarifs",
  description: "App 39 € avec contacts locaux. Accompagnement humain à partir de 250 € pour s’installer à Lombok.",
};

const formulas = [
  {
    number: "01",
    name: "Essentiel",
    price: "250 €",
    items: ["Clarification du projet", "Orientation zone", "Checklist personnalisée", "Support WhatsApp limité"],
  },
  {
    number: "02",
    name: "Complet",
    price: "600 €",
    items: ["Tout Essentiel", "Aide visa / démarches", "Recherche logement", "Préparation arrivée", "Support étendu"],
  },
  {
    number: "03",
    name: "Premium / A à Z",
    price: "1 200 €",
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
                Plus les zones, tips et parcours. Paiement unique — pas d’abonnement.
              </p>
            </div>
            <a href="https://wa.me/33763664857?text=Je%20suis%20int%C3%A9ress%C3%A9%20par%20l%27acc%C3%A8s%20app%2039%E2%82%AC" target="_blank" rel="noopener noreferrer">Demander</a>
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
                <a href="https://wa.me/33763664857" target="_blank" rel="noopener noreferrer">Demander</a>
              </article>
            ))}
          </div>

          <div className="final-cta" style={{ marginTop: "3rem", padding: "2rem", borderRadius: "1rem" }}>
            <h2>On en parle ?</h2>
            <p>Dis-moi où tu en es. Une discussion suffit pour voir si l’app seule ou un accompagnement a plus de sens.</p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1.25rem" }}>
              <a className="button button--primary" href="https://wa.me/33763664857" target="_blank" rel="noopener noreferrer">
                <MessageCircle aria-hidden="true" /> Discuter sur WhatsApp
              </a>
              <Link className="button button--outline" href="/contacts">Voir la page contacts</Link>
            </div>
          </div>

          <p style={{ marginTop: "2rem", opacity: 0.75, fontSize: "0.95rem" }}>
            App 39 € (contacts + guides). Accompagnement humain dès 250 €. Les deux sont optionnels l’un par rapport à l’autre.
          </p>
        </div>
      </section>
    </main>
  );
}
