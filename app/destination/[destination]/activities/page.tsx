import type { Metadata } from "next";
import "leaflet/dist/leaflet.css";
import { notFound } from "next/navigation";
import { DestinationExplorerClient } from "../../../components/destination-explorer-client";
import { DestinationSwitcher } from "../../../components/destination-switcher";
import { destinationRepository } from "../../../lib/repositories/destination-repository";
import { placeRepository } from "../../../lib/repositories/place-repository";

type PageProps = {
  params: Promise<{ destination: string }>;
  searchParams: Promise<{ place?: string; nearHotel?: string }>;
};

export function generateStaticParams() {
  return destinationRepository.list().filter((destination) => destination.enabledModules.activities).map((destination) => ({ destination: destination.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { destination: id } = await params;
  const destination = destinationRepository.getById(id);
  if (!destination || !destination.enabledModules.activities) return {};
  return {
    title: `Activités à ${destination.name}`,
    description: `Recherchez et filtrez les activités, restaurants, sorties et lieux utiles à ${destination.name}.`,
    alternates: { canonical: `/destination/${destination.slug}/activities` },
  };
}

export default async function DestinationActivitiesPage({ params, searchParams }: PageProps) {
  const [{ destination: id }, { place = null, nearHotel }] = await Promise.all([params, searchParams]);
  const destination = destinationRepository.getById(id);
  if (!destination || !destination.enabledModules.activities) notFound();
  const places = placeRepository.listByDestination(destination.id);

  return (
    <main className={`inner-page destination-activities-page destination-activities-page--${destination.id}`}>
      <header className="simple-page-header"><div className="site-container"><DestinationSwitcher /><span className="eyebrow">Carnet local · {destination.country}</span><h1>Que faire à {destination.name} ?</h1><p>Recherchez par quartier et gardez seulement les lieux adaptés à votre rythme, à votre famille et au moment de la journée.</p></div></header>
      <div className="site-container destination-activities-page__content"><DestinationExplorerClient destination={destination} places={places} allPlaces={placeRepository.list()} initialPlaceSlug={place} initialNearHotel={nearHotel === "1"} /></div>
    </main>
  );
}
