import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin, MessageCircle, Phone, ShieldCheck, ListChecks } from "lucide-react";
import { WeatherChip } from "./components/weather-chip";

export const metadata: Metadata = {
  title: "S’installer à Lombok",
  description: "Contacts locaux utiles, zones d’installation et tips concrets pour s’installer à Lombok. Accès app 69 €. Accompagnement à partir de 250 €.",
  alternates: { canonical: "/" },
};

const pillars = [
  {
    Icon: Phone,
    number: "01",
    title: "Contacts utiles",
    text: "Le plus important : des contacts locaux à joindre pour le logement, les démarches, la SIM, la vie sur place. Tu poses ta question, tu avances.",
    href: "/contacts",
    action: "Voir les contacts",
  },
  {
    Icon: MapPin,
    number: "02",
    title: "Zones d’installation",
    text: "Senggigi, Mangsit, Mataram, Kuta, Sekotong… Ambiance, budget loyer, pour qui c’est adapté, points forts et faibles.",
    href: "/zones",
    action: "Voir les zones",
  },
  {
    Icon: ListChecks,
    number: "03",
    title: "Tips & parcours",
    text: "Visa, logement, banque, SIM, budget, pièges — et un fil conducteur pour enchaîner les étapes dans le bon ordre.",
    href: "/tips",
    action: "Lire les tips",
  },
];

const method = [
  { Icon: CheckCircle2, title: "Clarifier le projet", text: "Durée, budget, style de vie : quelques points suffisent pour orienter les bons choix." },
  { Icon: MapPin, title: "Choisir sa zone", text: "On compare les endroits pour y vivre au quotidien, pas seulement pour y passer une semaine." },
  { Icon: Phone, title: "Joindre les bons contacts", text: "Logement, démarches, vie pratique : tu contactes des personnes sur place pour savoir ci ou ça, sans tourner en rond." },
];

export default function HomePage() {
  return (
    <main>
      <section className="home-hero">
        <Image className="home-hero__image" src="/lombok-merese.jpg" alt="Baie de Kuta Lombok au lever du jour, vue depuis Bukit Merese" fill priority sizes="100vw" />
        <div className="home-hero__veil" />
        <div className="site-container home-hero__content">
          <div className="home-hero__topline">
            <span className="eyebrow eyebrow--light">Aide à l’installation à Lombok</span>
            <WeatherChip />
          </div>
          <h1>Lombok,<br /><em>pour y vivre.</em></h1>
          <p>Des contacts locaux à joindre, les bonnes zones, les étapes concrètes — pour t’installer proprement, sans te faire voler.</p>
          <div className="home-hero__actions">
            <Link className="button button--light" href="/contacts">Voir les contacts <ArrowRight aria-hidden="true" /></Link>
            <Link className="button button--ghost-light" href="/parcours">Parcours guidé</Link>
          </div>
          <div className="home-hero__assurance">
            <span><Phone aria-hidden="true" /> Contacts locaux</span>
            <span><MapPin aria-hidden="true" /> Zones pour vivre</span>
            <span><ShieldCheck aria-hidden="true" /> App 69 € · Aide dès 250 €</span>
          </div>
        </div>
        <a className="home-hero__scroll" href="#introduction">Découvrir <span aria-hidden="true">↓</span></a>
      </section>

      <section className="site-section home-intro" id="introduction">
        <div className="site-container editorial-grid">
          <div>
            <span className="eyebrow">Vivre à Lombok</span>
            <h2>Moins d’approximations.<br />Plus de gens à joindre.</h2>
          </div>
          <div className="home-intro__copy">
            <p className="lead-copy">Le cœur de MyLombok, c’est de te donner des contacts utiles sur place : logement, démarches, vie pratique. Tu les contactes quand tu as une question précise.</p>
            <p>Autour de ça : zones, tips et parcours pour ne pas avancer à l’aveugle. L’app à 69 €. L’accompagnement humain à partir de 250 € si tu préfères déléguer.</p>
            <Link className="editorial-link" href="/contacts">Accéder aux contacts <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="site-section services-section" id="pillars">
        <div className="site-container">
          <div className="section-heading">
            <div><span className="eyebrow">Ce que tu trouves ici</span><h2>Contacts d’abord.<br />Puis le reste pour avancer.</h2></div>
            <p>Les guides aident. Les contacts te font passer à l’action — savoir ci ou ça, directement avec quelqu’un sur place.</p>
          </div>
          <div className="service-editorial-list">
            {pillars.map(({ Icon, number, title, text, href, action }) => (
              <article className="service-editorial" key={title}>
                <span className="service-editorial__number">{number}</span>
                <span className="service-editorial__icon"><Icon aria-hidden="true" /></span>
                <div><h3>{title}</h3><p>{text}</p></div>
                <Link href={href}>{action} <ArrowRight aria-hidden="true" /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section method-section">
        <div className="site-container method-layout">
          <div className="method-intro">
            <span className="eyebrow eyebrow--light">Le fil conducteur</span>
            <h2>S’installer étape<br />par étape.</h2>
            <p>Pas de catalogue touristique. Un parcours clair, avec des gens à contacter au bon moment.</p>
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
          <span className="eyebrow">Accompagnement humain</span>
          <h2>Tu préfères être accompagné de A à Z ?</h2>
          <p>À partir de 250 €. Des formules accessibles — pas des tarifs d’agence européenne.</p>
          <Link className="editorial-link" href="/accompagnement">Voir les tarifs <ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="site-section why-section">
        <div className="site-container why-grid">
          <div><span className="eyebrow">Pourquoi MyLombok</span><h2>Des contacts, pas seulement des articles.</h2></div>
          <div className="why-points">
            <article><Phone aria-hidden="true" /><div><h3>Des gens à joindre</h3><p>Le vrai levier : pouvoir écrire ou appeler pour un loyer, une démarche, une question pratique.</p></div></article>
            <article><MapPin aria-hidden="true" /><div><h3>Ancré sur place</h3><p>Zones, tips et contacts pensés pour s’installer — pas pour une semaine de vacances.</p></div></article>
            <article><ShieldCheck aria-hidden="true" /><div><h3>Prix justes</h3><p>App 69 € one-shot. Accompagnement dès 250 €. Transparent, sans abonnement forcé.</p></div></article>
          </div>
        </div>
      </section>

      <section className="site-section final-cta-section">
        <div className="site-container final-cta">
          <span className="eyebrow eyebrow--light">Prochaine étape</span>
          <h2>Commence par les contacts utiles.</h2>
          <p>Ou suis le parcours guidé si tu préfères avancer étape par étape.</p>
          <div>
            <Link className="button button--light" href="/contacts">Contacts utiles <ArrowRight aria-hidden="true" /></Link>
            <Link className="button button--ghost-light" href="/parcours">Parcours guidé</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
