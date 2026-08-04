import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CarFront, Compass, Headphones, MapPin, MessageCircle, Plane, Route, ShieldCheck, Sparkles } from "lucide-react";
import { WeatherChip } from "./components/weather-chip";
import { HomePreferences } from "./components/home-preferences";

export const metadata: Metadata = {
  title: "Conciergerie locale à Lombok",
  description: "Préparez votre séjour à Lombok avec un interlocuteur local : transferts, mobilité, activités et recommandations adaptées à vos envies.",
  alternates: { canonical: "/" },
};

const services = [
  {
    Icon: Plane,
    number: "01",
    title: "Arriver sereinement",
    text: "Transfert depuis l’aéroport, horaires d’arrivée et première installation : les détails pratiques sont préparés avant votre départ.",
    href: "/services/transferts-arrivee",
    action: "Préparer mon arrivée",
  },
  {
    Icon: CarFront,
    number: "02",
    title: "Se déplacer simplement",
    text: "Scooter, chauffeur ou trajet ponctuel : nous clarifions votre besoin et vous orientons vers la solution adaptée.",
    href: "/services/mobilite-ile",
    action: "Organiser mes déplacements",
  },
  {
    Icon: Compass,
    number: "03",
    title: "Vivre Lombok à votre rythme",
    text: "Plages, nature, culture et activités : composez une sélection cohérente sans surcharger vos journées.",
    href: "/services/activites-excursions",
    action: "Explorer les expériences",
  },
];

const method = [
  { Icon: MessageCircle, title: "Vous nous racontez", text: "Dates, envies, contraintes et niveau d’autonomie : quelques éléments suffisent pour commencer." },
  { Icon: Route, title: "Nous préparons", text: "Nous structurons les priorités et les points pratiques avant de vous orienter vers les bons contacts." },
  { Icon: Headphones, title: "Nous restons disponibles", text: "Un même interlocuteur vous accompagne lorsque votre programme évolue ou qu’un détail change." },
];

export default function HomePage() {
  return (
    <main>
      <section className="home-hero">
        <Image className="home-hero__image" src="/lombok-merese.jpg" alt="Baie de Kuta Lombok au lever du jour, vue depuis Bukit Merese" fill priority sizes="100vw" />
        <div className="home-hero__veil" />
        <div className="site-container home-hero__content">
          <div className="home-hero__topline">
            <span className="eyebrow eyebrow--light">Conciergerie privée à Lombok</span>
            <WeatherChip />
          </div>
          <h1>Lombok,<br /><em>en toute sérénité.</em></h1>
          <p>Une présence locale et attentionnée pour préparer votre arrivée, organiser les détails utiles et découvrir l’île à votre rythme.</p>
          <div className="home-hero__actions">
            <Link className="button button--light" href="/conciergerie">Organiser mon séjour <ArrowRight aria-hidden="true" /></Link>
            <Link className="button button--ghost-light" href="/explorer">Explorer Lombok</Link>
          </div>
          <div className="home-hero__assurance">
            <span><MessageCircle aria-hidden="true" /> Échange direct sur WhatsApp</span>
            <span><MapPin aria-hidden="true" /> Conseils centrés sur Lombok</span>
          </div>
        </div>
        <a className="home-hero__scroll" href="#introduction">Découvrir <span aria-hidden="true">↓</span></a>
      </section>

      <HomePreferences />

      <section className="site-section home-intro" id="introduction">
        <div className="site-container editorial-grid">
          <div>
            <span className="eyebrow">Votre séjour, simplement</span>
            <h2>Moins de recherches.<br />Plus de temps sur l’île.</h2>
          </div>
          <div className="home-intro__copy">
            <p className="lead-copy">MyLombok vous aide à faire les bons choix avant le départ, sans transformer votre séjour en programme rigide.</p>
            <p>Vous gardez la liberté de voyager. Nous apportons le contexte local, les repères pratiques et un point de contact clair lorsque vous souhaitez être accompagné.</p>
            <Link className="editorial-link" href="/a-propos">Découvrir notre approche <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="site-section services-section" id="services">
        <div className="site-container">
          <div className="section-heading">
            <div><span className="eyebrow">Ce que nous organisons</span><h2>Une aide précise,<br />au bon moment.</h2></div>
            <p>Commencez par un besoin concret. Chaque demande est préparée avec vous, puis transmise au bon interlocuteur lorsque c’est nécessaire.</p>
          </div>
          <div className="service-editorial-list">
            {services.map(({ Icon, number, title, text, href, action }) => (
              <article className="service-editorial" key={title}>
                <span className="service-editorial__number">{number}</span>
                <span className="service-editorial__icon"><Icon aria-hidden="true" /></span>
                <div><h3>{title}</h3><p>{text}</p></div>
                <Link href={href}>{action} <ArrowRight aria-hidden="true" /></Link>
              </article>
            ))}
          </div>
          <div className="services-more"><Link className="button button--outline" href="/services">Voir tous les services</Link></div>
        </div>
      </section>

      <section className="site-section method-section">
        <div className="site-container method-layout">
          <div className="method-intro">
            <span className="eyebrow eyebrow--light">L’expérience MyLombok</span>
            <h2>Un fil conducteur,<br />du premier message au séjour.</h2>
            <p>Pas de catalogue imposé. Nous avançons à partir de votre façon de voyager et de ce que vous souhaitez réellement déléguer.</p>
          </div>
          <ol className="method-list">
            {method.map(({ Icon, title, text }, index) => (
              <li key={title}>
                <span className="method-list__index">0{index + 1}</span>
                <Icon aria-hidden="true" />
                <div><h3>{title}</h3><p>{text}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="editorial-escape">
        <div className="editorial-escape__image"><Image src="/lombok-bay.jpg" alt="Route côtière bordée de palmiers face à une baie de Lombok" fill sizes="(max-width: 900px) 100vw, 62vw" /></div>
        <div className="editorial-escape__copy">
          <span className="eyebrow">Lombok au-delà des listes</span>
          <h2>Laisser de la place à l’inattendu.</h2>
          <p>Une bonne préparation ne remplit pas chaque heure. Elle vous évite surtout les mauvaises surprises et vous laisse disponible pour ce que l’île offre sur place.</p>
          <Link className="editorial-link" href="/explorer">Parcourir le carnet local <ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="site-section why-section">
        <div className="site-container why-grid">
          <div><span className="eyebrow">Pourquoi MyLombok</span><h2>Une relation plus humaine avec votre séjour.</h2></div>
          <div className="why-points">
            <article><Sparkles aria-hidden="true" /><div><h3>Des choix lisibles</h3><p>Les informations inconnues sont signalées comme telles, sans promesse ajoutée pour embellir une fiche.</p></div></article>
            <article><MessageCircle aria-hidden="true" /><div><h3>Un point de contact clair</h3><p>Les demandes générales arrivent chez MyLombok ; les contacts directs restent ceux des prestataires lorsqu’ils sont disponibles.</p></div></article>
            <article><ShieldCheck aria-hidden="true" /><div><h3>Vos données sous votre contrôle</h3><p>Les préférences restent sur votre appareil. La synchronisation ne sera proposée qu’après activation du service de comptes.</p></div></article>
          </div>
        </div>
      </section>

      <section className="site-section final-cta-section">
        <div className="site-container final-cta">
          <span className="eyebrow eyebrow--light">Votre prochain pas</span>
          <h2>Parlons de votre séjour à Lombok.</h2>
          <p>Dites-nous où vous en êtes. Une première demande suffit pour clarifier la suite.</p>
          <div><Link className="button button--light" href="/conciergerie">Écrire à la conciergerie <ArrowRight aria-hidden="true" /></Link><Link className="button button--ghost-light" href="/explorer">Explorer d’abord</Link></div>
        </div>
      </section>
    </main>
  );
}
