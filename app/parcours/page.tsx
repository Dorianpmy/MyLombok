import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageCircle, Compass, MapPin, FileText, Home, Plane, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Parcours d’installation",
  description: "Le fil conducteur pour s’installer à Lombok : de la clarification du projet aux premiers mois sur place.",
};

const steps = [
  { n: "01", Icon: Compass, title: "Clarifier ton projet", text: "Durée envisagée, budget mensuel, style de vie (calme, social, budget, famille…).", link: null as string | null },
  { n: "02", Icon: MapPin, title: "Choisir ta zone", text: "Comparer Senggigi, Mangsit, Mataram, Kuta, Sekotong selon ton profil.", link: "/zones" },
  { n: "03", Icon: FileText, title: "Visa & statut", text: "Choisir le bon cadre (visa, renouvellement) avant d’arriver trop longtemps.", link: "/tips" },
  { n: "04", Icon: Home, title: "Logement longue durée", text: "Chercher, négocier, sécuriser un bail adapté (pas un Airbnb touristique).", link: "/tips" },
  { n: "05", Icon: Plane, title: "Arrivée & premiers jours", text: "SIM, banque, transport, premières courses — les bases rapides.", link: "/tips" },
  { n: "06", Icon: CheckCircle2, title: "S’installer vraiment", text: "Vie quotidienne, réseau, routines. Ajuster si besoin.", link: null },
];

export default function ParcoursPage() {
  return (
    <main className="inner-page">
      <section className="site-section">
        <div className="site-container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Fil conducteur</span>
              <h1>Parcours d’installation</h1>
            </div>
            <p>Je veux m’installer à Lombok → voici les étapes dans l’ordre réel.</p>
          </div>

          <ol className="method-list" style={{ marginTop: "2.5rem" }}>
            {steps.map((step) => (
              <li key={step.n}>
                <span className="method-list__index">{step.n}</span>
                <step.Icon aria-hidden="true" />
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                  {step.link && (
                    <Link className="editorial-link" href={step.link}>
                      Aller plus loin <ArrowRight aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <div className="final-cta" style={{ marginTop: "3.5rem", padding: "2rem", borderRadius: "1rem" }}>
            <span className="eyebrow">Accompagnement</span>
            <h2 style={{ marginTop: "0.5rem" }}>Tu préfères être accompagné de A à Z ?</h2>
            <p>On peut avancer ensemble sur les étapes ci-dessus, avec un accompagnement humain accessible.</p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1.25rem" }}>
              <Link className="button button--primary" href="/accompagnement">Voir l’accompagnement</Link>
              <a className="button button--outline" href="https://wa.me/33763664857" target="_blank" rel="noopener noreferrer">
                <MessageCircle aria-hidden="true" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
