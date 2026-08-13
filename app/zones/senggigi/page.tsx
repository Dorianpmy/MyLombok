import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Senggigi — Zone d’installation",
  description: "Vivre à Senggigi : ambiance, budget loyer, pour qui c’est adapté, points forts et faibles.",
};

export default function SenggigiPage() {
  return (
    <main className="inner-page">
      <section className="site-section">
        <div className="site-container" style={{ maxWidth: 780 }}>
          <span className="eyebrow">Zone · 01</span>
          <h1>Senggigi</h1>
          <p className="lead-copy">Côte ouest établie, calme et pratique — souvent un bon point de départ pour s’installer.</p>

          <h2 style={{ marginTop: "2.5rem", fontSize: "1.75rem" }}>Ambiance</h2>
          <p>Bord de mer, restaurants et hôtels le long de la côte. Moins « hub digital nomad » que Kuta sud, plus posé. On y trouve des services de base sans être en pleine ville.</p>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Budget loyer (longue durée)</h2>
          <p>Environ <strong>150–350 €/mois</strong> selon standing, proximité plage et équipement. Les prix touristiques au mois sont souvent plus élevés : négocie en longue durée.</p>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Pour qui</h2>
          <ul>
            <li>Premiers mois sur l’île</li>
            <li>Familles, retraités, qui veulent du confort simple</li>
            <li>Qui ont besoin d’accès régulier à Mataram ou aux Gilis</li>
          </ul>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Points forts</h2>
          <ul>
            <li>Infrastructures et services relativement accessibles</li>
            <li>Route vers Mataram et ferries / Gilis</li>
            <li>Cadre côtier sans être aussi isolé que Sekotong</li>
          </ul>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Points faibles</h2>
          <ul>
            <li>Moins de vibe surf / cafés que le sud (Kuta)</li>
            <li>Certaines zones le long de la route sont bruyantes</li>
            <li>Saison des pluies : vérifier humidité et drainage du logement</li>
          </ul>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Accessibilité</h2>
          <p>Scooter quasi indispensable au quotidien. Mataram à une trentaine de minutes selon trafic. Aéroport LOP via route ouest / contournement.</p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "2.5rem" }}>
            <Link className="button button--outline" href="/zones">Toutes les zones</Link>
            <Link className="button button--primary" href="/zones/mangsit">Zone suivante : Mangsit <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
