import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3, MapPin, ShieldCheck } from "lucide-react";
import type { TravelPlace } from "../data/destination-types";
import { destinationRepository } from "../lib/repositories/destination-repository";

export const travelCategoryLabels: Record<TravelPlace["category"], string> = {
  attraction: "À voir",
  family: "Famille",
  food: "Cuisine",
  market: "Marché",
  mosque: "Mosquée",
  culture: "Culture",
  shopping: "Shopping",
  park: "Parc",
  viewpoint: "Point de vue",
  neighborhood: "Quartier",
  practical: "Pratique",
  transport: "Transport",
};

export function TravelPlaceCard({ place, priority = false }: { place: TravelPlace; priority?: boolean }) {
  const image = place.images[0];
  const destination = destinationRepository.resolve(place.destinationId);
  return (
    <article className="travel-place-card">
      <Link className="travel-place-card__image" href={`/activity/${place.slug}`} aria-label={`Voir la fiche de ${place.name}`}>
        {image ? <Image src={image.src} alt={image.alt} fill sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw" priority={priority} /> : <span aria-hidden="true">{place.name.slice(0, 1)}</span>}
        <span className="travel-place-card__category">{travelCategoryLabels[place.category]}</span>
      </Link>
      <div className="travel-place-card__body">
        <span className="eyebrow">{destination.shortName}{place.neighborhood ? ` · ${place.neighborhood}` : ""}</span>
        <h3><Link href={`/activity/${place.slug}`}>{place.name}</Link></h3>
        <p>{place.shortDescription}</p>
        <div className="travel-place-card__meta">
          {place.estimatedDuration && <span><Clock3 aria-hidden="true" />{place.estimatedDuration.minMinutes === place.estimatedDuration.maxMinutes ? `${place.estimatedDuration.minMinutes} min` : `${place.estimatedDuration.minMinutes}–${place.estimatedDuration.maxMinutes} min`}</span>}
          <span><ShieldCheck aria-hidden="true" />{place.verificationStatus === "verified" ? "Vérifié" : "À confirmer"}</span>
          {place.neighborhood && <span><MapPin aria-hidden="true" />{place.neighborhood}</span>}
        </div>
        <Link className="editorial-link" href={`/activity/${place.slug}`}>Voir la fiche <ArrowUpRight aria-hidden="true" /></Link>
      </div>
    </article>
  );
}
