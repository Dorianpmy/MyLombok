import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { destinationRepository } from "../lib/repositories/destination-repository";

export const metadata: Metadata = {
  title: "Destinations",
  description: "Choisissez Lombok ou Kuala Lumpur et retrouvez les modules MyLombok disponibles pour votre séjour.",
  alternates: { canonical: "/destinations" },
};

export default function DestinationsPage() {
  return (
    <main className="inner-page destinations-page">
      <header className="simple-page-header simple-page-header--center">
        <div className="site-container"><span className="eyebrow">MyLombok, plus loin</span><h1>Choisissez votre destination.</h1><p>Lombok reste notre destination historique. Kuala Lumpur rejoint le carnet pour préparer une escale urbaine avec la même exigence éditoriale.</p></div>
      </header>
      <section className="site-section"><div className="site-container destinations-grid">
        {destinationRepository.list().map((destination) => (
          <article key={destination.id} className={`destination-card destination-card--${destination.id}`}>
            <div className="destination-card__image">
              <Image src={destination.heroImage} alt={destination.heroImageAlt} fill sizes="(max-width: 800px) 100vw, 50vw" />
              {destination.heroImageCredit && destination.heroImageSourceUrl && <a className="destination-image-credit" href={destination.heroImageSourceUrl} target="_blank" rel="license noopener noreferrer">Photo : {destination.heroImageCredit}</a>}
            </div>
            <div className="destination-card__body"><span className="eyebrow">{destination.country}</span><h2>{destination.name}</h2><p>{destination.id === "lombok" ? "Découvrez l’île, préparez votre séjour et retrouvez les accompagnements utiles pour vous installer." : "Explorez la ville, trouvez des activités adaptées et construisez votre programme autour de votre séjour."}</p><ul>{destination.badges.map((badge) => <li key={badge}><Check aria-hidden="true" />{badge}</li>)}</ul><Link className="button button--primary" href={`/destination/${destination.slug}`}>Découvrir {destination.shortName}<ArrowRight aria-hidden="true" /></Link></div>
          </article>
        ))}
      </div></section>
    </main>
  );
}
