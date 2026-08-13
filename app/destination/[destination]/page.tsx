import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, Compass, Map, Route, TrainFront, Utensils, Landmark } from "lucide-react";
import { DestinationSwitcher } from "../../components/destination-switcher";
import { DestinationEditorialSections } from "../../components/destination-editorial-sections";
import { KualaLumpurTransportGuide } from "../../components/kuala-lumpur-transport-guide";
import { TravelPlaceCard } from "../../components/travel-place-card";
import { destinationRepository } from "../../lib/repositories/destination-repository";
import { placeRepository } from "../../lib/repositories/place-repository";

type PageProps = { params: Promise<{ destination: string }> };

export function generateStaticParams() {
  return destinationRepository.list().map((destination) => ({ destination: destination.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { destination: slug } = await params;
  const destination = destinationRepository.getById(slug);
  if (!destination) return {};
  return {
    title: destination.name,
    description: `${destination.description} avec MyLombok.`,
    alternates: { canonical: `/destination/${destination.slug}` },
  };
}

export default async function DestinationPage({ params }: PageProps) {
  const { destination: slug } = await params;
  const destination = destinationRepository.getById(slug);
  if (!destination) notFound();
  const places = placeRepository.listByDestination(destination.id);
  const featured = places.filter((place) => place.featured).slice(0, 6);
  const explorerHref = destination.id === "lombok" ? "/explorer" : `/destination/${destination.id}/activities`;
  const foodCount = places.filter((p) => p.category === "food" || p.category === "market").length;
  const mosqueCount = places.filter((p) => p.category === "mosque").length;

  return (
    <main className={`inner-page destination-landing destination-landing--${destination.id}`}>
      <section className="destination-hero">
        <Image className="destination-hero__image" src={destination.heroImage} alt={destination.heroImageAlt} fill priority sizes="100vw" />
        <div className="destination-hero__veil" />
        {destination.heroImageCredit && destination.heroImageSourceUrl && <a className="destination-image-credit destination-image-credit--hero" href={destination.heroImageSourceUrl} target="_blank" rel="license noopener noreferrer">Photo : {destination.heroImageCredit}</a>}
        <div className="site-container destination-hero__content">
          <div className="destination-hero__switcher"><DestinationSwitcher /></div>
          <span className="eyebrow eyebrow--light">{destination.country}</span>
          <h1>{destination.id === "kuala-lumpur" ? "Kuala Lumpur, à votre rythme." : "Lombok, pour y vivre."}</h1>
          <p>{destination.id === "kuala-lumpur"
            ? "City guide pratique : activités, mosquées, restaurants, quartiers et transports — pour un séjour simple, sans accompagnement d’installation."
            : "Zones d’installation, tips concrets et parcours guidé pour poser tes bases sur l’île."}</p>
          <div className="destination-hero__actions">
            <Link className="button button--light button--large" href={explorerHref}><Compass aria-hidden="true" />Explorer</Link>
            <Link className="button button--ghost-light button--large" href={`/destination/${destination.id}/map`}><Map aria-hidden="true" />Ouvrir la carte</Link>
          </div>
          {destination.id === "kuala-lumpur" && (
            <p style={{ marginTop: "1rem", opacity: 0.85, fontSize: "0.95rem" }}>
              {places.length} lieux · {mosqueCount} mosquées · {foodCount} restos & marchés
            </p>
          )}
        </div>
      </section>

      <section className="destination-quick-links"><div className="site-container">
        <Link href={explorerHref}><Compass aria-hidden="true" /><span><strong>Explorer</strong><small>Lieux et activités</small></span><ArrowRight aria-hidden="true" /></Link>
        <Link href={`/destination/${destination.id}/map`}><Map aria-hidden="true" /><span><strong>Carte</strong><small>Repérer les quartiers</small></span><ArrowRight aria-hidden="true" /></Link>
        <Link href={`/trip?destination=${destination.id}`}><Route aria-hidden="true" /><span><strong>Mon voyage</strong><small>Programme privé</small></span><ArrowRight aria-hidden="true" /></Link>
        {destination.id === "kuala-lumpur" && <Link href="/destination/kuala-lumpur/transport"><TrainFront aria-hidden="true" /><span><strong>Transports</strong><small>Marcher, rail et aéroport</small></span><ArrowRight aria-hidden="true" /></Link>}
        {destination.id === "kuala-lumpur" && <Link href={`${explorerHref}?category=mosque`}><Landmark aria-hidden="true" /><span><strong>Mosquées</strong><small>Lieux de prière</small></span><ArrowRight aria-hidden="true" /></Link>}
        {destination.id === "kuala-lumpur" && <Link href={`${explorerHref}?category=food`}><Utensils aria-hidden="true" /><span><strong>Restos</strong><small>Street food & marchés</small></span><ArrowRight aria-hidden="true" /></Link>}
        {destination.enabledModules.expatriation && <Link href="/parcours"><BookOpen aria-hidden="true" /><span><strong>S’installer</strong><small>Guides Lombok</small></span><ArrowRight aria-hidden="true" /></Link>}
      </div></section>

      {featured.length > 0 && <section className="site-section destination-featured"><div className="site-container"><div className="section-heading"><div><span className="eyebrow">Sélection éditoriale</span><h2>Pour commencer.</h2></div><p>Des lieux réels, documentés et regroupés selon le rythme de votre séjour.</p></div><div className="travel-place-grid">{featured.map((place, index) => <TravelPlaceCard key={place.id} place={place} priority={index < 2} />)}</div><Link className="editorial-link destination-featured__more" href={explorerHref}>Voir les {places.length} lieux <ArrowRight aria-hidden="true" /></Link></div></section>}

      {destination.id === "kuala-lumpur" && <section className="site-section destination-editorial"><div className="site-container"><DestinationEditorialSections destination={destination} places={places} /></div></section>}

      {destination.id === "kuala-lumpur" && <section className="site-section destination-practical"><div className="site-container"><KualaLumpurTransportGuide compact /></div></section>}
    </main>
  );
}
