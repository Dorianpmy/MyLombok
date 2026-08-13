import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Paiement annulé",
  robots: { index: false, follow: false },
};

export default function PaiementAnnulePage() {
  return (
    <main className="inner-page">
      <section className="site-section">
        <div className="site-container" style={{ maxWidth: 640, textAlign: "center" }}>
          <span className="eyebrow" style={{ justifyContent: "center" }}>Paiement</span>
          <h1>Paiement annulé</h1>
          <p className="lead-copy">Aucun montant n’a été débité. Tu peux réessayer quand tu veux.</p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", marginTop: "2rem" }}>
            <Link className="button button--primary" href="/accompagnement">Retour aux tarifs</Link>
            <Link className="button button--outline" href="/">Accueil</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
