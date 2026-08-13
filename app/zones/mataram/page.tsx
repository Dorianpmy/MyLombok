import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Mataram — Zone d’installation",
  description: "Vivre à Mataram : capitale de Lombok, budget, services, vie locale.",
};

export default function MataramPage() {
  return (
    <main className="inner-page">
      <section className="site-section">
        <div className="site-container" style={{ maxWidth: 780 }}>
          <span className="eyebrow">Zone · 03</span>
          <h1>Mataram</h1>
          <p className="lead-copy">La capitale : vie urbaine indonésienne réelle, services et prix souvent plus bas qu’en zone touristique.</p>

          <h2 style={{ marginTop: "2.5rem", fontSize: "1.75rem" }}>Ambiance</h2>
          <p>Ville administrative et commerçante. Malls, hôpitaux, administrations, marchés. Peu de « vibe plage » : c’est un choix pratique, pas un décor carte postale.</p>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Budget loyer (longue durée)</h2>
          <p>Environ <strong>100–250 €/mois</strong> pour un confort correct. Souvent le meilleur rapport qualité-prix de l’île pour un logement simple.</p>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Pour qui</h2>
          <ul>
            <li>Budget serré</li>
            <li>Qui ont besoin d’hôpitaux, démarches, banques, écoles</li>
            <li>Qui veulent une vie locale plutôt qu’expat-beach</li>
          </ul>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Points forts</h2>
          <ul>
            <li>Prix de loyer et du quotidien</li>
            <li>Hôpitaux, malls, administrations au même endroit</li>
            <li>Hub de transport vers le reste de l’île</li>
          </ul>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Points faibles</h2>
          <ul>
            <li>Peu de plage à proximité immédiate</li>
            <li>Circulation, bruit, chaleur urbaine</li>
            <li>Moins de communauté « remote / surf » qu’à Kuta</li>
          </ul>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Accessibilité</h2>
          <p>Centre de l’ouest de Lombok. Aéroport relativement accessible. Bonne base pour rayonner (Senggigi, sud, est) en scooter ou voiture.</p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "2.5rem" }}>
            <Link className="button button--outline" href="/zones">Toutes les zones</Link>
            <Link className="button button--primary" href="/zones/kuta-lombok">Zone suivante : Kuta <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
