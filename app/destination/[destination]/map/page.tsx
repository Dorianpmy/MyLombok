import type { Metadata } from "next";
import "leaflet/dist/leaflet.css";
import { notFound } from "next/navigation";
import { DestinationExplorerClient } from "../../../components/destination-explorer-client";
import { DestinationSwitcher } from "../../../components/destination-switcher";
import { destinationRepository } from "../../../lib/repositories/destination-repository";
import { placeRepository } from "../../../lib/repositories/place-repository";

type PageProps = {
  params: Promise<{ destination: string }>;
  searchParams: Promise<{ place?: string }>;
};

export function generateStaticParams() {
  return destinationRepository.list().filter((destination) => destination.enabledModules.map).map((destination) => ({ destination: destination.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { destination: id } = await params;
  const destination = destinationRepository.getById(id);
  if (!destination || !destination.enabledModules.map) return {};
  return {
    title: `Carte de ${destination.name}`,
    description: `Repérez les activités, quartiers et lieux utiles de ${destination.name} sur la carte.`,
    alternates: { canonical: `/destination/${destination.slug}/map` },
  };
}

export default async function DestinationMapPage({ params, searchParams }: PageProps) {
  const [{ destination: id }, { place = null }] = await Promise.all([params, searchParams]);
  const destination = destinationRepository.getById(id);
  if (!destination || !destination.enabledModules.map) notFound();
  const places = placeRepository.listByDestination(destination.id);

  return (
    <main className={`inner-page destination-map-page destination-map-page--${destination.id}`}>
      <header className="simple-page-header"><div className="site-container"><DestinationSwitcher /><span className="eyebrow">Carte locale · {destination.country}</span><h1>Repérer {destination.name}.</h1><p>Zoomez par quartier, sélectionnez un marqueur ou utilisez la liste accessible. Votre position n’est demandée que si vous appuyez sur le bouton dédié.</p></div></header>
      <div className="site-container destination-map-page__content"><DestinationExplorerClient destination={destination} places={places} allPlaces={placeRepository.list()} initialView="map" initialPlaceSlug={place} /></div>
    </main>
  );
}
