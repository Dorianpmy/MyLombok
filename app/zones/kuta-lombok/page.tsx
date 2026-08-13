import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Kuta Lombok — Zone d’installation",
  description: "Vivre à Kuta Lombok : surf, cafés, communauté, budget loyer.",
};

export default function KutaLombokPage() {
  return (
    <main className="inner-page">
      <section className="site-section">
        <div className="site-container" style={{ maxWidth: 780 }}>
          <span className="eyebrow">Zone · 04</span>
          <h1>Kuta Lombok</h1>
          <p className="lead-copy">Le hub du sud : surf, cafés, communauté expat et digital nomads — plus vivant, plus touristique.</p>

          <h2 style={{ marginTop: "2.5rem", fontSize: "1.75rem" }}>Ambiance</h2>
          <p>Plages, spots de surf, brunchs, coworking informel. Beaucoup d’étrangers de passage ou installés. L’énergie est plus « Bali lite » que Mataram ou Sekotong.</p>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Budget loyer (longue durée)</h2>
          <p>Environ <strong>150–350 €/mois</strong> hors villas premium. Attention aux tarifs Airbnb au mois : compare toujours avec une location locale longue durée.</p>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Pour qui</h2>
          <ul>
            <li>Digital nomads, freelances</li>
            <li>Surfers, qui veulent une vie sociale</li>
            <li>Qui acceptent un peu plus de tourisme au quotidien</li>
          </ul>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Points forts</h2>
          <ul>
            <li>Scène cafés / restos / rencontres</li>
            <li>Plages et spots autour (Gerupuk, etc.)</li>
            <li>Communauté facile à intégrer</li>
          </ul>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Points faibles</h2>
          <ul>
            <li>Plus touristique, prix parfois tirés vers le haut</li>
            <li>Internet variable hors du centre</li>
            <li>Saisonnalité : calme vs affluence</li>
          </ul>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Accessibilité</h2>
          <p>Sud de Lombok. Aéroport plus long qu’depuis Mataram/Senggigi. Scooter indispensable. Routes vers l’ouest et l’est selon météo et travaux.</p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "2.5rem" }}>
            <Link className="button button--outline" href="/zones">Toutes les zones</Link>
            <Link className="button button--primary" href="/zones/sekotong">Zone suivante : Sekotong <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
