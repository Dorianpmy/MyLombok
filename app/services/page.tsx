import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, CarFront, Compass, MessageCircle, Plane, Route, UtensilsCrossed } from "lucide-react";
import { conciergeServices, type ConciergeService } from "@/app/data/concierge-services";

export const metadata: Metadata = {
  title: "Nos services",
  description: "Les services MyLombok pour préparer une arrivée, des déplacements, des activités et des demandes particulières à Lombok.",
  alternates: { canonical: "/services" },
};

const serviceIcons: Record<ConciergeService["icon"], LucideIcon> = {
  plane: Plane,
  car: CarFront,
  compass: Compass,
  restaurant: UtensilsCrossed,
  route: Route,
  message: MessageCircle,
};

export default function ServicesPage() {
  return (
    <main className="inner-page">
      <header className="simple-page-header simple-page-header--center">
        <div className="site-container">
          <span className="eyebrow">Conciergerie locale</span>
          <h1>Le bon niveau d’aide, au bon moment.</h1>
          <p>Chaque service commence par une demande claire. Aucune réservation ni aucun paiement n’est déclenché automatiquement.</p>
        </div>
      </header>

      <section className="site-section">
        <div className="site-container service-page-grid">
          {conciergeServices.map((service, index) => {
            const Icon = serviceIcons[service.icon];
            return (
              <article key={service.slug}>
                <Link className="service-page-card-hit" href={`/services/${service.slug}`} aria-label={`Découvrir : ${service.title}`}>
                  <span className="sr-only">Découvrir {service.title}</span>
                </Link>
                <span className="service-page-grid__index">0{index + 1}</span>
                <Icon aria-hidden="true" />
                <h2>{service.title}</h2>
                <p>{service.promise}</p>
                <span className="editorial-link" aria-hidden="true">Découvrir le service <ArrowRight aria-hidden="true" /></span>
              </article>
            );
          })}
        </div>
      </section>

      <section className="site-section service-page-note">
        <div className="site-container">
          <div>
            <span className="eyebrow eyebrow--light">Vous préférez commencer seul ?</span>
            <h2>Explorez l’île avant de nous écrire.</h2>
            <p>Le carnet vous aide à repérer les zones, les distances et les informations pratiques à confirmer.</p>
          </div>
          <Link className="button button--light" href="/explorer">Ouvrir Explorer <ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>
    </main>
  );
}
