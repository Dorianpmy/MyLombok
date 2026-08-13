import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Banque & argent — Tips installation",
  description: "Retraits, transferts et ouverture de compte pour s’installer à Lombok.",
};

export default function TipsBanquePage() {
  return (
    <main className="inner-page">
      <section className="site-section">
        <div className="site-container" style={{ maxWidth: 780 }}>
          <span className="eyebrow">Tips · 03</span>
          <h1>Banque & argent</h1>
          <p className="lead-copy">Tu peux vivre plusieurs semaines avec carte + retraits. Un compte local devient utile dès que tu restes durablement.</p>

          <h2 style={{ marginTop: "2.5rem", fontSize: "1.75rem" }}>Au quotidien</h2>
          <ul>
            <li>Les <strong>retraits ATM</strong> sont partout ; attention aux frais de ta banque d’origine et aux plafonds.</li>
            <li>Prévois un plan B (2 cartes, 2 réseaux si possible).</li>
            <li>Le cash reste utile pour petits commerces, scooters, marchés.</li>
            <li>Change une partie en IDR selon besoin — pas forcément tout d’un coup.</li>
          </ul>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Compte bancaire local</h2>
          <ul>
            <li>Les conditions (visa, documents, dépôt) varient selon les banques et évoluent.</li>
            <li>Demande la liste exacte de pièces <strong>avant</strong> de te déplacer.</li>
            <li>Un numéro local (SIM) facilite souvent les validations SMS.</li>
            <li>Compare frais de tenue, retraits, et app mobile en anglais/indonésien.</li>
          </ul>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Transferts internationaux</h2>
          <ul>
            <li>Compare les vrais coûts : taux + frais fixes (banque vs services de transfert).</li>
            <li>Fais un petit test avant un gros virement (loyer / dépôt).</li>
            <li>Garde les reçus pour ton suivi perso.</li>
          </ul>

          <p style={{ marginTop: "1.5rem", opacity: 0.8 }}>Ne partage jamais codes OTP, photos de carte, ou accès e-banking. Les arnaques « aide au compte » existent.</p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "2.5rem" }}>
            <Link className="button button--outline" href="/tips">Tous les tips</Link>
            <Link className="button button--primary" href="/tips/sim-internet">Tip suivant : SIM & internet <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
