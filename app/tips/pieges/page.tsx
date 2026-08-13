import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Pièges fréquents — Tips installation",
  description: "Arnaques et erreurs classiques à éviter quand on s’installe à Lombok.",
};

export default function TipsPiegesPage() {
  return (
    <main className="inner-page">
      <section className="site-section">
        <div className="site-container" style={{ maxWidth: 780 }}>
          <span className="eyebrow">Tips · 06</span>
          <h1>Pièges fréquents</h1>
          <p className="lead-copy">La plupart des problèmes viennent de la précipitation : logement payé trop vite, agent opaque, ou visa mal anticipé.</p>

          <h2 style={{ marginTop: "2.5rem", fontSize: "1.75rem" }}>À éviter</h2>
          <ul>
            <li><strong>Payer un gros dépôt</strong> sans visite ni contrat clair.</li>
            <li><strong>« Je m’occupe de ton visa »</strong> sans statut officiel ni références vérifiables.</li>
            <li>Louer un véhicule sans papiers / sans vérifier l’assurance.</li>
            <li>Suivre uniquement les groupes touristiques pour un projet d’installation.</li>
            <li>Ignorer les dates de fin de visa « on verra plus tard ».</li>
          </ul>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Signaux d’alerte</h2>
          <ul>
            <li>Pression pour payer cash immédiatement.</li>
            <li>Prix très en dessous du marché sans explication.</li>
            <li>Interdiction de voir le propriétaire ou le bien en vrai.</li>
            <li>Promesses de « visa garanti » en 48 h.</li>
          </ul>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Réflexes sains</h2>
          <ul>
            <li>Toujours comparer 2–3 options.</li>
            <li>Écrire les accords (même simples).</li>
            <li>Garder une réserve d’urgence (logement + billet).</li>
            <li>Demander un second avis (communauté ou accompagnement).</li>
          </ul>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "2.5rem" }}>
            <Link className="button button--outline" href="/parcours">Voir le parcours</Link>
            <Link className="button button--primary" href="/accompagnement">Être accompagné <ArrowRight aria-hidden="true" /></Link>
            <a className="button button--outline" href="https://wa.me/33763664857" target="_blank" rel="noopener noreferrer">
              <MessageCircle aria-hidden="true" /> WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
