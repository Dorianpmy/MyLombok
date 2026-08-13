import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Sekotong — Zone d’installation",
  description: "Vivre à Sekotong : sud-ouest de Lombok, nature, calme, budget.",
};

export default function SekotongPage() {
  return (
    <main className="inner-page">
      <section className="site-section">
        <div className="site-container" style={{ maxWidth: 780 }}>
          <span className="eyebrow">Zone · 05</span>
          <h1>Sekotong</h1>
          <p className="lead-copy">Sud-ouest plus isolé : nature, baies, calme — et moins de services au quotidien.</p>

          <h2 style={{ marginTop: "2.5rem", fontSize: "1.75rem" }}>Ambiance</h2>
          <p>Villages, côtes découpées, rythme lent. Très loin de l’ambiance Kuta. Tu viens ici pour l’espace et le silence, pas pour la vie sociale dense.</p>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Budget loyer (longue durée)</h2>
          <p>Environ <strong>120–280 €/mois</strong> selon isolement et standing. Moins d’offre structurée : le bouche-à-oreille compte beaucoup.</p>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Pour qui</h2>
          <ul>
            <li>Qui cherchent du calme et de l’espace</li>
            <li>Qui acceptent de rouler pour les courses / hôpital</li>
            <li>Projets long terme nature / discrétion</li>
          </ul>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Points forts</h2>
          <ul>
            <li>Nature, baies, authenticité</li>
            <li>Prix souvent plus doux hors spots connus</li>
            <li>Peu de densification touristique</li>
          </ul>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Points faibles</h2>
          <ul>
            <li>Services limités (santé, restos, coworking)</li>
            <li>Plus loin de Mataram / aéroport</li>
            <li>Internet et logistique à vérifier au cas par cas</li>
          </ul>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Accessibilité</h2>
          <p>Sud-ouest. Prévoir du temps de route. Scooter ou voiture selon les pistes. Teste le trajet nuit + pluie avant de t’engager sur un bail.</p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "2.5rem" }}>
            <Link className="button button--outline" href="/zones">Toutes les zones</Link>
            <Link className="button button--primary" href="/contacts">Voir les contacts <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
