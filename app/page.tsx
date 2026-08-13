import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Compass, Map, MapPin, Phone, Route, ShieldCheck, ListChecks } from "lucide-react";
import { WeatherChip } from "./components/weather-chip";

export const metadata: Metadata = {
  title: "S’installer à Lombok",
  description: "Zones, tips, explorer, carte et accompagnement pour s’installer à Lombok.",
  alternates: { canonical: "/" },
};

const exploreBlocks = [
  { href: "/explorer", Icon: Compass, title: "Explorer", text: "Lieux et activités" },
  { href: "/destination/lombok/map", Icon: Map, title: "Carte", text: "Repérer les quartiers" },
  { href: "/trip?destination=lombok", Icon: Route, title: "Mon voyage", text: "Programme privé" },
  { href: "/parcours", Icon: BookOpen, title: "S’installer", text: "Guides & parcours" },
];

const pillars = [
  {
    Icon: MapPin,
    number: "01",
    title: "Zones d’installation",
    text: "Senggigi, Mangsit, Mataram, Kuta, Sekotong… Ambiance, budget loyer, pour qui c’est adapté.",
    href: "/zones",
    action: "Voir les zones",
  },
  {
    Icon: ListChecks,
    number: "02",
    title: "Tips & parcours",
    text: "Visa, logement, banque, SIM, budget, pièges — et un fil conducteur étape par étape.",
    href: "/tips",
    action: "Lire les tips",
  },
  {
    Icon: Phone,
    number: "03",
    title: "Contacts & offres",
    text: "2 contacts locaux (logements et visa) dans l’app, ou un appel / pack si tu préfères être aidé.",
    href: "/accompagnement",
    action: "Voir les offres",
  },
];

const method = [
  { Icon: CheckCircle2, title: "Clarifier le projet", text: "Durée, budget, style de vie : quelques points suffisent pour orienter les bons choix." },
  { Icon: MapPin, title: "Choisir sa zone", text: "On compare les endroits pour y vivre au quotidien, pas seulement pour y passer une semaine." },
  { Icon: Phone, title: "Joindre les bons contacts", text: "Logement et visa : des contacts pour poser tes questions sur place." },
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
          <p>Zones d’installation, tips concrets et parcours guidé pour poser tes bases sur l’île.</p>
          <div className="home-hero__actions">
            <Link className="button button--light" href="/explorer"><Compass aria-hidden="true" /> Explorer</Link>
            <Link className="button button--ghost-light" href="/destination/lombok/map"><Map aria-hidden="true" /> Ouvrir la carte</Link>
          </div>
          <div className="home-hero__assurance">
            <span><MapPin aria-hidden="true" /> Zones pour vivre</span>
            <span><ListChecks aria-hidden="true" /> Tips concrets</span>
            <span><ShieldCheck aria-hidden="true" /> Parcours guidé</span>
          </div>
        </div>
        <a className="home-hero__scroll" href="#explorer-blocks">Découvrir <span aria-hidden="true">↓</span></a>
      </section>

      <section className="destination-quick-links" id="explorer-blocks">
        <div className="site-container" style={{ padding: 0 }}>
          <div className="destination-quick-links > div" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderLeft: "1px solid var(--line)" }}>
            {exploreBlocks.map(({ href, Icon, title, text }) => (
              <Link
                key={title}
                href={href}
                style={{
                  minWidth: 0,
                  display: "grid",
                  gridTemplateColumns: "35px 1fr 17px",
                  gap: 12,
                  alignItems: "center",
                  minHeight: 96,
                  padding: 20,
                  borderRight: "1px solid var(--line)",
                  borderBottom: "1px solid var(--line)",
                  color: "var(--ink)",
                  textDecoration: "none",
                  background: "var(--surface)",
                }}
              >
                <Icon aria-hidden="true" style={{ width: 24, color: "var(--bronze-text)" }} />
                <span style={{ minWidth: 0, display: "grid" }}>
                  <strong style={{ fontFamily: "var(--font-display)", fontSize: 21 }}>{title}</strong>
                  <small style={{ color: "var(--muted)", fontSize: 10 }}>{text}</small>
                </span>
                <ArrowRight aria-hidden="true" style={{ width: 16, color: "var(--muted)" }} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section home-intro" id="introduction">
        <div className="site-container editorial-grid">
          <div>
            <span className="eyebrow">Vivre à Lombok</span>
            <h2>Moins d’approximations.<br />Plus de clarté.</h2>
          </div>
          <div className="home-intro__copy">
            <p className="lead-copy">Explore l’île, compare les zones, suis un parcours — et avance avec des contacts utiles quand tu en as besoin.</p>
            <p>L’app, un appel conseil ou un accompagnement : tu choisis selon ton rythme.</p>
            <Link className="editorial-link" href="/zones">Voir les zones <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="site-section services-section" id="pillars">
        <div className="site-container">
          <div className="section-heading">
            <div><span className="eyebrow">Ce que tu trouves ici</span><h2>Explorer.<br />Puis s’installer.</h2></div>
            <p>Des repères concrets pour vivre à Lombok — pas seulement pour y passer une semaine.</p>
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
            <p>Pas de catalogue touristique. Un parcours clair, avec les bons contacts au bon moment.</p>
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
          <span className="eyebrow">Besoin d’un coup de main ?</span>
          <h2>App, appel, ou accompagnement.</h2>
          <p>Tu avances seul avec les outils, ou tu prends un échange / un suivi si tu préfères déléguer.</p>
          <Link className="editorial-link" href="/accompagnement">Voir les offres <ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="site-section final-cta-section">
        <div className="site-container final-cta">
          <span className="eyebrow eyebrow--light">Prochaine étape</span>
          <h2>Commence par explorer.</h2>
          <p>Carte, lieux, zones — puis les offres si tu as besoin d’aide.</p>
          <div>
            <Link className="button button--light" href="/explorer">Explorer <ArrowRight aria-hidden="true" /></Link>
            <Link className="button button--ghost-light" href="/accompagnement">Voir les offres</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
