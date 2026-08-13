import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Mangsit — Zone d’installation",
  description: "Vivre à Mangsit : ambiance résidentielle, budget loyer, pour qui c’est adapté.",
};

export default function MangsitPage() {
  return (
    <main className="inner-page">
      <section className="site-section">
        <div className="site-container" style={{ maxWidth: 780 }}>
          <span className="eyebrow">Zone · 02</span>
          <h1>Mangsit</h1>
          <p className="lead-copy">Juste au nord de Senggigi : plus résidentiel, plus verdoyant, souvent plus calme.</p>

          <h2 style={{ marginTop: "2.5rem", fontSize: "1.75rem" }}>Ambiance</h2>
          <p>Moins de passage touristique dense que le cœur de Senggigi. Villas, petites structures, plages plus discrètes. Idéal si tu veux dormir au calme tout en restant branché sur la côte ouest.</p>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Budget loyer (longue durée)</h2>
          <p>Environ <strong>180–400 €/mois</strong>. Les biens avec vue ou jardin se négocient selon durée et saison.</p>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Pour qui</h2>
          <ul>
            <li>Couples et familles</li>
            <li>Qui cherchent du calme sans s’isoler complètement</li>
            <li>Qui acceptent un peu de trajet scooter pour les courses / restos</li>
          </ul>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Points forts</h2>
          <ul>
            <li>Cadre plus vert, plages accessibles</li>
            <li>Proximité des services de Senggigi / Mataram</li>
            <li>Ambiance plus « quartier » que strip touristique</li>
          </ul>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Points faibles</h2>
          <ul>
            <li>Moins d’animation locale le soir</li>
            <li>Moins de choix de cafés coworking qu’à Kuta</li>
            <li>Dépendance au scooter pour presque tout</li>
          </ul>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Accessibilité</h2>
          <p>Sur la même côte que Senggigi. Mataram et aéroport via la route ouest. Vérifie l’état de la route et l’éclairage la nuit avant de signer.</p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "2.5rem" }}>
            <Link className="button button--outline" href="/zones">Toutes les zones</Link>
            <Link className="button button--primary" href="/zones/mataram">Zone suivante : Mataram <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
