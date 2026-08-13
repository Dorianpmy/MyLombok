"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Destination, PrivateTrip, TravelPlace } from "../data/destination-types";
import { favoritesRepository } from "../lib/repositories/favorites-repository";
import { tripRepository } from "../lib/repositories/trip-repository";
import { travelCategoryLabels } from "./travel-place-card";

type Coordinates = { latitude: number; longitude: number };

type EditorialSection = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  places: TravelPlace[];
  href?: string;
};

function distanceKm(a: Coordinates, b: Coordinates) {
  const radius = 6371;
  const radians = (value: number) => value * Math.PI / 180;
  const dLat = radians(b.latitude - a.latitude);
  const dLng = radians(b.longitude - a.longitude);
  const lat1 = radians(a.latitude);
  const lat2 = radians(b.latitude);
  const value = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

function hasTag(place: TravelPlace, tag: TravelPlace["tags"][number]) {
  return place.tags.includes(tag);
}

function SectionCard({ section }: { section: EditorialSection }) {
  return (
    <section className="destination-editorial-section" aria-labelledby={`editorial-${section.id}`}>
      <header>
        <div>
          <span className="eyebrow">{section.eyebrow}</span>
          <h2 id={`editorial-${section.id}`}>{section.title}</h2>
          <p>{section.description}</p>
        </div>
        <Link className="editorial-link" href={section.href || "/saved"}>Tout voir <ArrowRight aria-hidden="true" /></Link>
      </header>
      <div className="destination-editorial-rail">
        {section.places.slice(0, 4).map((place) => {
          const image = place.images[0];
          return <article key={place.id}>
            <Link className="destination-editorial-place__image" href={`/activity/${place.slug}`}>
              {image ? <Image src={image.src} alt={image.alt} fill sizes="(max-width: 700px) 74vw, 300px" /> : <span aria-hidden="true"><MapPin /></span>}
            </Link>
            <div>
              <span>{travelCategoryLabels[place.category]} · {place.neighborhood}</span>
              <h3><Link href={`/activity/${place.slug}`}>{place.name}</Link></h3>
              <p>{place.shortDescription}</p>
            </div>
          </article>;
        })}
      </div>
    </section>
  );
}

export function DestinationEditorialSections({ destination, places }: { destination: Destination; places: TravelPlace[] }) {
  const [trip, setTrip] = useState<PrivateTrip | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    void Promise.all([tripRepository.load(), favoritesRepository.load()]).then(([tripSnapshot, favoritesSnapshot]) => {
      if (!active) return;
      setTrip(tripSnapshot.trip);
      setFavoriteIds(favoritesSnapshot.ids);
    });
    return () => { active = false; };
  }, []);

  const sections = useMemo(() => {
    const explorerHref = `/destination/${destination.id}/activities`;
    const hotel = trip?.destinationId === destination.id ? trip.accommodation?.coordinates : null;
    const favoriteSet = new Set(favoriteIds);
    const nearHotel = hotel ? [...places].sort((a, b) => distanceKm(hotel, a.coordinates) - distanceKm(hotel, b.coordinates)).filter((place) => distanceKm(hotel, place.coordinates) <= 3) : [];
    const saved = places.filter((place) => favoriteSet.has(place.id) || Boolean(place.legacyId && favoriteSet.has(place.legacyId)));
    const candidates: EditorialSection[] = [
      ...(nearHotel.length ? [{ id: "hotel", eyebrow: "Votre point de départ", title: "Près de votre hôtel", description: "Des lieux triés selon une distance à vol d’oiseau, jamais présentée comme un temps de trajet.", places: nearHotel, href: `${explorerHref}?nearHotel=1` }] : []),
      { id: "family", eyebrow: "Voyager ensemble", title: "À faire en famille", description: "Les lieux dont l’usage familial est documenté par une source identifiable.", places: places.filter((place) => hasTag(place, "family-friendly")), href: explorerHref },
      { id: "evening", eyebrow: "Après la chaleur", title: `${destination.shortName} le soir`, description: "Promenades, quartiers et marchés intéressants en fin de journée.", places: places.filter((place) => hasTag(place, "evening")), href: explorerHref },
      { id: "culture", eyebrow: "Comprendre la ville", title: "Lieux culturels", description: "Architecture, patrimoine et musées pour lire la destination autrement.", places: places.filter((place) => place.category === "culture"), href: explorerHref },
      { id: "prayer", eyebrow: "Informations utiles", title: "Mosquées et lieux de prière", description: "Uniquement les lieux et services de prière reliés à une source officielle.", places: places.filter((place) => place.category === "mosque" || hasTag(place, "prayer-room")), href: explorerHref },
      { id: "food", eyebrow: "Goûter la ville", title: "Marchés et cuisine locale", description: "Le statut halal reste à vérifier enseigne par enseigne lorsqu’il n’est pas officiellement documenté.", places: places.filter((place) => place.category === "food" || place.category === "market"), href: explorerHref },
      { id: "klcc", eyebrow: "Quartier repère", title: "À voir autour de KLCC", description: "Un ensemble compact d’icônes, de pauses urbaines et de sorties couvertes.", places: places.filter((place) => hasTag(place, "near-klcc")), href: explorerHref },
      { id: "indoor", eyebrow: "Plan pluie", title: "Activités en intérieur", description: "Des alternatives couvertes dont le caractère intérieur est documenté.", places: places.filter((place) => hasTag(place, "indoor")), href: explorerHref },
      ...(saved.length ? [{ id: "saved", eyebrow: "Votre carnet", title: "Lieux enregistrés", description: "Votre sélection privée, disponible dans Favoris et Mon voyage.", places: saved, href: "/saved" }] : []),
    ];
    return candidates.filter((section) => section.places.length > 0);
  }, [destination.id, destination.shortName, favoriteIds, places, trip]);

  return <div className="destination-editorial-sections">{sections.map((section) => <SectionCard key={section.id} section={section} />)}</div>;
}
