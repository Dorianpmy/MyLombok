import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Coût de la vie — Tips installation",
  description: "Budget mensuel réaliste pour vivre à Lombok : loyer, courses, transport.",
};

export default function TipsCoutPage() {
  return (
    <main className="inner-page">
      <section className="site-section">
        <div className="site-container" style={{ maxWidth: 780 }}>
          <span className="eyebrow">Tips · 05</span>
          <h1>Coût de la vie réel</h1>
          <p className="lead-copy">Lombok reste accessible si tu vis localement. Le budget explose surtout avec loyer « villa touristique », resto tous les soirs et scooters de location longue durée mal négociés.</p>

          <h2 style={{ marginTop: "2.5rem", fontSize: "1.75rem" }}>Ordres de grandeur mensuels (1 personne)</h2>
          <ul>
            <li><strong>Loyer</strong> : souvent 150–350 € pour un confort correct en longue durée.</li>
            <li><strong>Courses / manger simple</strong> : très variable ; local = bien moins cher que resto expat.</li>
            <li><strong>Scooter</strong> : location mensuelle ou achat d’occasion + essence + entretien.</li>
            <li><strong>SIM + internet</strong> : en général une petite ligne du budget.</li>
            <li><strong>Santé / imprévus</strong> : garde une marge (et une assurance adaptée).</li>
          </ul>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Ce qui fait monter la facture</h2>
          <ul>
            <li>Logement type Airbnb au mois dans une zone hyper touristique.</li>
            <li>Tout payer « prix expat » sans comparer.</li>
            <li>Sorties / alcohol / imports européens au quotidien.</li>
            <li>Déplacements inter-îles fréquents (Gilis, Bali) mal anticipés.</li>
          </ul>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Méthode simple</h2>
          <ul>
            <li>Fixe un budget mensuel max avant d’arriver.</li>
            <li>Suis 30 jours de dépenses réelles (appli ou tableur).</li>
            <li>Ajuste zone + style de vie plutôt que de « tirer » sur le loyer seul.</li>
          </ul>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "2.5rem" }}>
            <Link className="button button--outline" href="/tips">Tous les tips</Link>
            <Link className="button button--primary" href="/tips/pieges">Tip suivant : Pièges <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
