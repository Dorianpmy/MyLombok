import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ArrowRight,
  CarFront,
  Check,
  Compass,
  MessageCircle,
  Plane,
  Route,
  UtensilsCrossed,
} from "lucide-react";
import {
  conciergeServices,
  getConciergeService,
  type ConciergeService,
} from "@/app/data/concierge-services";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

const serviceIcons: Record<ConciergeService["icon"], LucideIcon> = {
  plane: Plane,
  car: CarFront,
  compass: Compass,
  restaurant: UtensilsCrossed,
  route: Route,
  message: MessageCircle,
};

export const dynamicParams = false;

export function generateStaticParams() {
  return conciergeServices.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getConciergeService(slug);

  if (!service) notFound();

  return {
    title: service.title,
    description: service.promise,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getConciergeService(slug);

  if (!service) notFound();

  const Icon = serviceIcons[service.icon];
  const relatedServices = service.related
    .map((relatedSlug) => getConciergeService(relatedSlug))
    .filter((related): related is ConciergeService => Boolean(related));

  return (
    <main className="inner-page service-detail-page">
      <header className="service-detail-hero">
        <div className="site-container service-detail-hero__grid">
          <div>
            <Link className="service-detail-back" href="/services">
              <ArrowLeft aria-hidden="true" /> Tous les services
            </Link>
            <span className="eyebrow">{service.eyebrow}</span>
            <h1>{service.title}</h1>
            <p className="service-detail-hero__promise">{service.promise}</p>
          </div>
          <aside className="service-detail-summary" aria-label="À propos de ce service">
            <span className="service-detail-summary__icon"><Icon aria-hidden="true" /></span>
            <span>Le rôle de MyLombok</span>
            <p>{service.description}</p>
          </aside>
        </div>
      </header>

      <section className="site-section service-detail-benefit">
        <div className="site-container editorial-grid">
          <div>
            <span className="eyebrow">Pourquoi ce service</span>
            <h2>{service.benefitTitle}</h2>
          </div>
          <p className="lead-copy">{service.benefit}</p>
        </div>
      </section>

      <section className="site-section service-detail-process" aria-labelledby="service-process-title">
        <div className="site-container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Comment ça se passe</span>
              <h2 id="service-process-title">Trois étapes, sans engagement automatique.</h2>
            </div>
            <p>Vous relisez et validez chaque échange. Une demande préparée dans l’application ne vaut ni réservation, ni paiement.</p>
          </div>
          <ol className="service-detail-steps">
            {service.steps.map((step, index) => (
              <li key={step.title}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="site-section service-detail-practical">
        <div className="site-container service-detail-practical__grid">
          <div>
            <span className="eyebrow">Avant d’écrire</span>
            <h2>Les informations utiles.</h2>
            <p>Quelques repères pour obtenir une réponse plus précise et garder le contrôle sur la suite.</p>
          </div>
          <ul>
            {service.useful.map((item) => (
              <li key={item}><Check aria-hidden="true" /><span>{item}</span></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="site-section service-related" aria-labelledby="related-services-title">
        <div className="site-container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Pour aller plus loin</span>
              <h2 id="related-services-title">Services associés.</h2>
            </div>
            <Link className="editorial-link" href="/services">Voir les six services <ArrowRight aria-hidden="true" /></Link>
          </div>
          <div className="service-related__grid">
            {relatedServices.map((related) => {
              const RelatedIcon = serviceIcons[related.icon];
              return (
                <Link key={related.slug} href={`/services/${related.slug}`}>
                  <RelatedIcon aria-hidden="true" />
                  <span>{related.eyebrow}</span>
                  <h3>{related.title}</h3>
                  <p>{related.promise}</p>
                  <strong>Découvrir <ArrowRight aria-hidden="true" /></strong>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="site-section service-page-note">
        <div className="site-container">
          <div>
            <span className="eyebrow eyebrow--light">Votre demande</span>
            <h2>Parlons de votre séjour.</h2>
            <p>Le formulaire prépare un message complet. Rien n’est envoyé à MyLombok avant votre validation dans WhatsApp.</p>
          </div>
          <Link className="button button--light" href={`/conciergerie?service=${service.query}`}>
            Préparer ma demande <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
