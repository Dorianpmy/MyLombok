import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Logement longue durée — Tips installation",
  description: "Comment chercher, négocier et sécuriser un logement longue durée à Lombok.",
};

export default function TipsLogementPage() {
  return (
    <main className="inner-page">
      <section className="site-section">
        <div className="site-container" style={{ maxWidth: 780 }}>
          <span className="eyebrow">Tips · 02</span>
          <h1>Logement longue durée</h1>
          <p className="lead-copy">À Lombok, un bon logement se négocie souvent hors des plateformes purement touristiques. L’objectif : un bail clair, un prix de longue durée, et des conditions réalistes.</p>

          <h2 style={{ marginTop: "2.5rem", fontSize: "1.75rem" }}>Budgets indicatifs (loyer mensuel)</h2>
          <ul>
            <li><strong>Simple / local</strong> : souvent autour de 100–200 € selon zone et standing.</li>
            <li><strong>Confort correct</strong> : souvent 150–350 € (Senggigi, Mangsit, Kuta, etc.).</li>
            <li><strong>Plus premium / villa</strong> : au-delà, selon vue, piscine, distance plage.</li>
          </ul>
          <p style={{ opacity: 0.8 }}>Ces fourchettes bougent avec la saison, la négociation et le niveau d’équipement.</p>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Où chercher</h2>
          <ul>
            <li>Groupes Facebook / WhatsApp locaux (expat + indonésiens).</li>
            <li>Agents immobiliers de quartier (demande des annonces récentes).</li>
            <li>Bouche-à-oreille une fois sur place — très efficace.</li>
            <li>Évite de signer un Airbnb touristique « au mois » sans comparer le prix annuel.</li>
          </ul>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Avant de payer</h2>
          <ul>
            <li>Visite en personne (humidité, eau, électricité, bruit, accès scooter).</li>
            <li>Teste internet (vitesse réelle, stabilité en fin de journée).</li>
            <li>Demande <strong>qui paie</strong> : électricité, eau, poubelle, gardien.</li>
            <li>Clarifie dépôt de garantie, préavis, et ce qui se passe en cas de casse.</li>
            <li>Préfère un écrit simple (même bilingue) avec noms, montant, dates, inventaire.</li>
          </ul>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Négociation</h2>
          <ul>
            <li>Un paiement de plusieurs mois d’avance se négocie souvent mieux au mois.</li>
            <li>Compare 3–5 options dans la même zone avant de te décider.</li>
            <li>Méfie-toi des « trop beaux » prix sans visite ou sans propriétaire identifiable.</li>
          </ul>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "2.5rem" }}>
            <Link className="button button--outline" href="/zones">Voir les zones</Link>
            <Link className="button button--primary" href="/tips/banque">Tip suivant : Banque <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
