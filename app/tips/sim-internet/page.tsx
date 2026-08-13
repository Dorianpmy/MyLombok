import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "SIM & internet — Tips installation",
  description: "Opérateurs, forfaits data et réalités internet pour s’installer à Lombok.",
};

export default function TipsSimPage() {
  return (
    <main className="inner-page">
      <section className="site-section">
        <div className="site-container" style={{ maxWidth: 780 }}>
          <span className="eyebrow">Tips · 04</span>
          <h1>SIM & internet</h1>
          <p className="lead-copy">Une bonne SIM data est souvent la première chose à régler à l’arrivée. La fibre / Wi‑Fi du logement se vérifie ensuite sur place.</p>

          <h2 style={{ marginTop: "2.5rem", fontSize: "1.75rem" }}>SIM prépayée</h2>
          <ul>
            <li>Aéroport, counters officiels, ou magasins d’opérateur en ville.</li>
            <li>Prends un forfait <strong>data généreux</strong> si tu travailles en remote.</li>
            <li>Enregistrement d’identité souvent requis (passeport) — garde une copie.</li>
            <li>Teste la couverture dans ta zone (Kuta sud ≠ Mataram ≠ Sekotong).</li>
          </ul>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Internet logement</h2>
          <ul>
            <li>Demande le débit réel le soir (heure de pointe) pendant la visite.</li>
            <li>La 4G/5G en backup (partage de connexion) sauve beaucoup de journées.</li>
            <li>Fibre disponible selon quartier — pas partout sur l’île.</li>
            <li>Clarifie qui souscrit le contrat et qui paie l’abonnement mensuel.</li>
          </ul>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Astuces terrain</h2>
          <ul>
            <li>Deux SIMs (opérateurs différents) = meilleure résilience hors des hubs.</li>
            <li>Évite de te fier uniquement au « Wi‑Fi super rapide » annoncé sur une annonce.</li>
            <li>Pour visio / calls : teste Zoom/Meet 10 minutes sur place avant de signer.</li>
          </ul>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "2.5rem" }}>
            <Link className="button button--outline" href="/tips">Tous les tips</Link>
            <Link className="button button--primary" href="/tips/cout-de-la-vie">Tip suivant : Coût de la vie <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
