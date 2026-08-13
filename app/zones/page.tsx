import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Zones d’installation",
  description: "Les meilleurs endroits pour vivre à Lombok : ambiance, budget loyer, pour qui c’est adapté, points forts et faibles.",
};

const zones = [
  {
    slug: "senggigi",
    name: "Senggigi",
    vibe: "Côte ouest établie, calme et pratique",
    rent: "150–350 €/mois",
    bestFor: "Premiers mois, familles, retraités",
    pros: "Infrastructures, services, accès Mataram & Gilis",
    cons: "Moins de vibe surf / café que le sud",
  },
  {
    slug: "mangsit",
    name: "Mangsit",
    vibe: "Plus résidentiel et verdoyant que Senggigi",
    rent: "180–400 €/mois",
    bestFor: "Couples, familles, qui cherchent du calme",
    pros: "Cadre, plages, proximité services",
    cons: "Moins d’animation locale",
  },
  {
    slug: "mataram",
    name: "Mataram",
    vibe: "Capitale — vie urbaine indonésienne réelle",
    rent: "100–250 €/mois",
    bestFor: "Budget serré, services, vie locale",
    pros: "Prix, hôpitaux, malls, administrations",
    cons: "Peu de plage, ambiance ville",
  },
  {
    slug: "kuta-lombok",
    name: "Kuta Lombok",
    vibe: "Hub sud — surf, cafés, communauté expat",
    rent: "150–350 €/mois",
    bestFor: "Digital nomads, surfers, vie sociale",
    pros: "Scène café, plages, communauté",
    cons: "Plus touristique, internet variable hors centre",
  },
  {
    slug: "sekotong",
    name: "Sekotong",
    vibe: "Sud-ouest plus isolé, nature et calme",
    rent: "120–280 €/mois",
    bestFor: "Qui cherchent du calme et de l’espace",
    pros: "Nature, prix, authenticité",
    cons: "Services limités, plus loin de tout",
  },
];

export default function ZonesPage() {
  return (
    <main className="inner-page">
      <section className="site-section">
        <div className="site-container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">S’installer à Lombok</span>
              <h1>Zones d’installation</h1>
            </div>
            <p>Où poser ses bases pour y vivre — pas seulement pour y passer une semaine. Budgets indicatifs de loyer longue durée.</p>
          </div>

          <div className="service-editorial-list" style={{ marginTop: "2.5rem" }}>
            {zones.map((zone) => (
              <article className="service-editorial" key={zone.slug}>
                <span className="service-editorial__icon"><MapPin aria-hidden="true" /></span>
                <div>
                  <h3>{zone.name}</h3>
                  <p><strong>{zone.vibe}</strong></p>
                  <p>Loyer approx. : {zone.rent} · Idéal pour : {zone.bestFor}</p>
                  <p>✓ {zone.pros}</p>
                  <p>− {zone.cons}</p>
                </div>
                <Link href={`/zones/${zone.slug}`}>Voir la fiche <ArrowRight aria-hidden="true" /></Link>
              </article>
            ))}
          </div>

          <div className="services-more" style={{ marginTop: "3rem" }}>
            <Link className="button button--outline" href="/parcours">Suivre le parcours guidé</Link>
            <Link className="button button--primary" href="/accompagnement" style={{ marginLeft: "1rem" }}>Être accompagné de A à Z</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
