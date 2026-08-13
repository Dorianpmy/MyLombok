import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Home, MapPin, MessageCircle, ShieldCheck, Sparkles, ListChecks } from "lucide-react";
import { WeatherChip } from "./components/weather-chip";

export const metadata: Metadata = {
  title: "S’installer à Lombok",
  description: "Les meilleurs endroits pour vivre à Lombok, tips concrets d’installation, checklist et contacts utiles. Accompagnement local possible.",
  alternates: { canonical: "/" },
};

const pillars = [
  {
    Icon: MapPin,
    number: "01",
    title: "Zones d’installation",
    text: "Senggigi, Mangsit, Mataram, Kuta, Sekotong… Ambiance, budget loyer, pour qui c’est adapté, points forts et faibles.",
    href: "/zones",
    action: "Voir les zones",
  },
  {
    Icon: ListChecks,
    number: "02",
    title: "Tips d’installation",
    text: "Visa, logement longue durée, banque, SIM, coût de la vie réel et pièges fréquents — dans l’ordre des étapes.",
    href: "/tips",
    action: "Lire les tips",
  },
  {
    Icon: Home,
    number: "03",
    title: "Parcours guidé",
    text: "Un fil conducteur clair : de la clarification du projet jusqu’aux premiers mois sur place.",
    href: "/parcours",
    action: "Commencer le parcours",
  },
];

const method = [
  { Icon: CheckCircle2, title: "Clarifier le projet", text: "Durée, budget, style de vie : quelques points suffisent pour orienter les bons choix." },
  { Icon: MapPin, title: "Choisir sa zone", text: "On compare les endroits pour y vivre au quotidien, pas seulement pour y passer une semaine." },
  { Icon: MessageCircle, title: "S’installer proprement", text: "Visa, logement, premiers jours… et un accompagnement humain si tu préfères déléguer." },
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
          <p>Les meilleurs endroits pour s’installer, les étapes concrètes et les contacts utiles — pour poser tes bases proprement, sans te faire voler.</p>
          <div className="home-hero__actions">
            <Link className="button button--light" href="/parcours">S’installer à Lombok <ArrowRight aria-hidden="true" /></Link>
            <Link className="button button--ghost-light" href="/zones">Voir les zones</Link>
          </div>
          <div className="home-hero__assurance">
            <span><MessageCircle aria-hidden="true" /> Présence locale</span>
            <span><MapPin aria-hidden="true" /> Conseils concrets</span>
            <span><ShieldCheck aria-hidden="true" /> Accompagnement possible</span>
          </div>
        </div>
        <a className="home-hero__scroll" href="#introduction">Découvrir <span aria-hidden="true">↓</span></a>
      </section>

      <section className="site-section home-intro" id="introduction">
        <div className="site-container editorial-grid">
          <div>
            <span className="eyebrow">Vivre à Lombok</span>
            <h2>Moins d’approximations.<br />Plus de bases solides.</h2>
          </div>
          <div className="home-intro__copy">
            <p className="lead-copy">MyLombok t’aide à choisir où t’installer et à enchaîner les bonnes étapes, sans promesse gonflée ni prix d’agence européenne.</p>
            <p>La vie sur l’île est accessible. L’objectif : t’installer proprement, avec des infos concrètes et un accompagnement humain si tu le souhaites.</p>
            <Link className="editorial-link" href="/a-propos">Découvrir l’approche <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="site-section services-section" id="pillars">
        <div className="site-container">
          <div className="section-heading">
            <div><span className="eyebrow">Ce que tu trouves ici</span><h2>Trois piliers pour<br />s’installer sereinement.</h2></div>
            <p>L’app seule te donne déjà l’essentiel. L’accompagnement humain est disponible si tu préfères déléguer.</p>
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
            <p>Pas de catalogue touristique. Un parcours clair pour poser tes bases à Lombok.</p>
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
          <p>Formules accessibles, adaptées au coût de la vie local. Pas de prix d’agence européenne — juste une aide concrète pour s’installer proprement.</p>
          <Link className="editorial-link" href="/accompagnement">Voir l’accompagnement <ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="site-section why-section">
        <div className="site-container why-grid">
          <div><span className="eyebrow">Pourquoi MyLombok</span><h2>Une aide juste, ancrée sur place.</h2></div>
          <div className="why-points">
            <article><Sparkles aria-hidden="true" /><div><h3>Infos concrètes</h3><p>Zones, loyers, démarches et pièges fréquents — sans promesse ajoutée pour embellir une fiche.</p></div></article>
            <article><MessageCircle aria-hidden="true" /><div><h3>Présence locale</h3><p>Un point de contact clair quand tu as besoin d’un conseil ou d’un coup de main sur place.</p></div></article>
            <article><ShieldCheck aria-hidden="true" /><div><h3>Prix accessibles</h3><p>L’app reste utile seule. L’accompagnement humain reste juste par rapport au coût de la vie à Lombok.</p></div></article>
          </div>
        </div>
      </section>

      <section className="site-section final-cta-section">
        <div className="site-container final-cta">
          <span className="eyebrow eyebrow--light">Prochaine étape</span>
          <h2>Commence par choisir ta zone.</h2>
          <p>Ou suis le parcours guidé si tu préfères avancer étape par étape.</p>
          <div>
            <Link className="button button--light" href="/zones">Voir les zones <ArrowRight aria-hidden="true" /></Link>
            <Link className="button button--ghost-light" href="/parcours">Parcours guidé</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
