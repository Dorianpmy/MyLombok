import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Baby,
  BadgeCheck,
  CalendarClock,
  Check,
  Clock3,
  ExternalLink,
  MapPin,
  Navigation,
  ShieldAlert,
  TrainFront,
} from "lucide-react";
import { ActivityActions } from "../../components/activity-actions";
import { ActivityDetailMap } from "../../components/activity-detail-map";
import { travelCategoryLabels } from "../../components/travel-place-card";
import type { FamilyInformation, TravelPlace } from "../../data/destination-types";
import { destinationRepository } from "../../lib/repositories/destination-repository";
import { placeRepository } from "../../lib/repositories/place-repository";

type ActivityPageProps = { params: Promise<{ slug: string }> };

const priceLabels: Record<NonNullable<TravelPlace["priceLevel"]>, string> = {
  free: "Gratuit",
  low: "Petit budget",
  medium: "Budget intermédiaire",
  high: "Budget élevé",
};

const familyLabels: Array<[keyof FamilyInformation, string]> = [
  ["babyFriendly", "Adapté avec un bébé"],
  ["strollerFriendly", "Poussette"],
  ["babyChangingAvailable", "Espace pour changer bébé"],
  ["indoor", "À l’intérieur"],
  ["airConditioned", "Climatisé"],
  ["quietAreaAvailable", "Espace calme"],
  ["feedingFriendly", "Pause repas / allaitement"],
];

function formattedDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

function sourceName(value: string) {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return "Source externe";
  }
}

function hasFamilyInformation(family?: FamilyInformation) {
  return Boolean(family && Object.entries(family).some(([key, value]) => key !== "sourceUrl" && value !== undefined && value !== ""));
}

export function generateStaticParams() {
  return Array.from(new Set(placeRepository.list().map(({ slug }) => slug))).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ActivityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const place = placeRepository.getBySlug(slug);
  if (!place) return {};
  return {
    title: place.name,
    description: place.shortDescription,
    alternates: { canonical: `/activity/${place.slug}` },
    openGraph: place.images[0] ? { images: [{ url: place.images[0].src, alt: place.images[0].alt }] } : undefined,
  };
}

export default async function ActivityPage({ params }: ActivityPageProps) {
  const { slug } = await params;
  const place = placeRepository.getBySlug(slug);
  if (!place) notFound();
  const destination = destinationRepository.getById(place.destinationId);
  if (!destination) notFound();

  const image = place.images[0];
  const explorerHref = place.destinationId === "lombok" ? "/explorer" : `/destination/${place.destinationId}/activities`;
  const allSources = Array.from(new Set([
    ...place.sourceUrls,
    place.officialUrl,
    place.bookingUrl,
    place.openingHours?.sourceUrl,
    place.family?.sourceUrl,
    image?.sourceUrl,
  ].filter((url): url is string => Boolean(url))));
  const familyRows = familyLabels.filter(([key]) => place.family?.[key] !== undefined);

  return (
    <main className="inner-page activity-detail-page">
      <header className="activity-detail-hero">
        <div className="activity-detail-hero__media">
          {image ? <Image src={image.src} alt={image.alt} fill priority sizes="100vw" /> : <div className="activity-detail-hero__fallback" aria-hidden="true">{place.name.slice(0, 1)}</div>}
          <div className="activity-detail-hero__veil" />
        </div>
        <div className="site-container activity-detail-hero__content">
          <Link className="service-detail-back service-detail-back--light" href={explorerHref}>
            <ArrowLeft aria-hidden="true" /> Retour à l’exploration
          </Link>
          <span className="eyebrow eyebrow--light">{travelCategoryLabels[place.category]} · {place.neighborhood || destination.name}</span>
          <h1>{place.name}</h1>
          <p>{place.shortDescription}</p>
          <div className="activity-detail-hero__badges">
            <span><BadgeCheck aria-hidden="true" />{place.verificationStatus === "verified" ? "Fiche vérifiée" : "Informations à confirmer"}</span>
            {place.estimatedDuration && <span><Clock3 aria-hidden="true" />{place.estimatedDuration.minMinutes === place.estimatedDuration.maxMinutes ? `${place.estimatedDuration.minMinutes} min` : `${place.estimatedDuration.minMinutes}–${place.estimatedDuration.maxMinutes} min`}</span>}
            {place.priceLevel && <span>{priceLabels[place.priceLevel]}</span>}
          </div>
        </div>
      </header>

      <section className="site-section activity-detail-intro">
        <div className="site-container activity-detail-intro__grid">
          <div className="activity-detail-intro__copy">
            <span className="eyebrow">Pourquoi y aller</span>
            <h2>{place.whyGo || "Un repère à ajouter à votre séjour."}</h2>
            {place.description && <p className="lead-copy">{place.description}</p>}
          </div>
          <aside className="activity-detail-intro__actions" aria-label="Enregistrer ce lieu">
            <ActivityActions placeId={place.id} placeName={place.name} destinationId={place.destinationId} />
            <a className="button button--outline" href={place.navigationUrl} target="_blank" rel="noopener noreferrer">
              <Navigation aria-hidden="true" /> Itinéraire
            </a>
            {place.officialUrl && <a className="editorial-link" href={place.officialUrl} target="_blank" rel="noopener noreferrer">Site officiel <ExternalLink aria-hidden="true" /></a>}
          </aside>
        </div>
      </section>

      <section className="site-section activity-detail-practical" aria-labelledby="activity-practical-title">
        <div className="site-container">
          <div className="section-heading"><div><span className="eyebrow">À savoir</span><h2 id="activity-practical-title">Informations pratiques.</h2></div><p>Nous affichons uniquement les informations présentes dans les sources. Ce qui manque doit être confirmé auprès du lieu.</p></div>
          <dl className="activity-detail-practical__grid">
            {place.neighborhood && <div><dt><MapPin aria-hidden="true" />Quartier</dt><dd>{place.neighborhood}</dd></div>}
            {place.address && <div><dt><MapPin aria-hidden="true" />Adresse</dt><dd>{place.address}</dd></div>}
            {place.openingHours && <div><dt><CalendarClock aria-hidden="true" />Horaires</dt><dd>{place.openingHours.label}<a href={place.openingHours.sourceUrl} target="_blank" rel="noopener noreferrer">Vérifier <ExternalLink aria-hidden="true" /></a></dd></div>}
            {place.nearestStation && <div><dt><TrainFront aria-hidden="true" />Station utile</dt><dd>{place.nearestStation}</dd></div>}
            {place.transportNote && <div><dt><TrainFront aria-hidden="true" />Trajet</dt><dd>{place.transportNote}</dd></div>}
            {place.estimatedDuration && <div><dt><Clock3 aria-hidden="true" />Durée indicative</dt><dd>{place.estimatedDuration.minMinutes === place.estimatedDuration.maxMinutes ? `${place.estimatedDuration.minMinutes} minutes` : `${place.estimatedDuration.minMinutes} à ${place.estimatedDuration.maxMinutes} minutes`}</dd></div>}
          </dl>
        </div>
      </section>

      {(hasFamilyInformation(place.family) || place.halalStatus || place.prayerInformation) && <section className="site-section activity-detail-needs">
        <div className="site-container activity-detail-needs__grid">
          {hasFamilyInformation(place.family) && <article>
            <span className="activity-detail-needs__icon"><Baby aria-hidden="true" /></span>
            <span className="eyebrow">Famille et bébé</span>
            <h2>Ce que les sources permettent d’affirmer.</h2>
            {familyRows.length > 0 && <dl>{familyRows.map(([key, label]) => <div key={key}><dt>{label}</dt><dd>{place.family?.[key] === true ? <><Check aria-hidden="true" />Oui</> : "Non"}</dd></div>)}</dl>}
            {place.family?.estimatedWalkingMinutes !== undefined && <p>Marche estimée : {place.family.estimatedWalkingMinutes} min.</p>}
            {place.family?.stairsOrDifficultAccess && <p>{place.family.stairsOrDifficultAccess}</p>}
            {place.family?.familyNotes && <p>{place.family.familyNotes}</p>}
            {place.family?.sourceUrl && <a href={place.family.sourceUrl} target="_blank" rel="noopener noreferrer">Source famille <ExternalLink aria-hidden="true" /></a>}
          </article>}
          {(place.halalStatus || place.prayerInformation) && <article>
            <span className="activity-detail-needs__icon"><ShieldAlert aria-hidden="true" /></span>
            <span className="eyebrow">Halal et prière</span>
            <h2>Pas de raccourci sur les informations sensibles.</h2>
            {place.halalStatus && <p><strong>Statut halal :</strong> {place.halalStatus === "verified" ? "vérifié par une source associée à la fiche" : "à vérifier directement auprès de l’établissement"}.</p>}
            {place.prayerInformation && <p>{place.prayerInformation}</p>}
          </article>}
        </div>
      </section>}

      <section className="site-section activity-detail-map-section">
        <div className="site-container">
          <div className="section-heading"><div><span className="eyebrow">Sur la carte</span><h2>Repérez le lieu avant de partir.</h2></div><a className="editorial-link" href={place.navigationUrl} target="_blank" rel="noopener noreferrer">Ouvrir l’itinéraire <Navigation aria-hidden="true" /></a></div>
          <ActivityDetailMap destination={destination} place={place} />
        </div>
      </section>

      <section className="site-section activity-detail-sources" aria-labelledby="activity-sources-title">
        <div className="site-container activity-detail-sources__grid">
          <div>
            <span className="eyebrow">Transparence éditoriale</span>
            <h2 id="activity-sources-title">Sources et vérification.</h2>
            <p>Dernière vérification éditoriale : <strong>{formattedDate(place.lastVerifiedAt)}</strong>. Les données opérationnelles restent à contrôler auprès du lieu.</p>
            {image?.credit && <p className="activity-detail-sources__credit">Photo : {image.credit}.{image.sourceUrl ? " Licence et fichier accessibles dans les sources." : ""}</p>}
          </div>
          <div className="place-sources">
            <h3>{allSources.length} source{allSources.length > 1 ? "s" : ""}</h3>
            <div>{allSources.map((source) => <a href={source} target="_blank" rel="noopener noreferrer" key={source}><span>{place.officialUrl === source ? "Site officiel" : sourceName(source)}<small>Ouvrir la source</small></span><ExternalLink aria-hidden="true" /></a>)}</div>
          </div>
        </div>
      </section>
    </main>
  );
}
