import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MoonStar, Heart, MapPin, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Hijrah & vie musulmane à Lombok",
  description: "Lombok, île aux mille mosquées : une vie plus paisible pour s’installer en terrain musulman, au quotidien.",
};

const pillars = [
  {
    Icon: MoonStar,
    title: "L’île aux mille mosquées",
    text: "Lombok porte ce surnom pour une raison : les mosquées jalonnent villages et côtes. L’appel à la prière fait partie du paysage sonore, sans agressivité — une présence régulière et rassurante.",
  },
  {
    Icon: Heart,
    title: "Un rythme plus doux",
    text: "Moins de frénésie que Bali sur certains axes. Vie de quartier, solidarité locale, respect des horaires de prière. Beaucoup viennent chercher précisément ce calme pour poser une hijrah sereine.",
  },
  {
    Icon: ShieldCheck,
    title: "Halal au quotidien",
    text: "Nourriture majoritairement hanal, restaurants et warungs adaptés, facilité pour manger dehors sans stress permanent. Reste à vérifier les adresses selon tes standards personnels.".replace("hanal", "halal"),
  },
  {
    Icon: MapPin,
    title: "S’installer, pas seulement visiter",
    text: "Choisir sa zone (Mataram, côte ouest, sud…) change le quotidien : proximité mosquée, écoles, communauté, bruit. Les fiches zones t’aident à arbitrer avec ce critère en tête.",
  },
];

const practical = [
  {
    title: "Prières & mosquées",
    text: "Mosquées de quartier partout. L’app propose aussi les horaires de prière selon ta zone. Le vendredi, anticipe les déplacements autour des grandes mosquées.",
  },
  {
    title: "Communauté",
    text: "Communautés locales sasak musulmanes, et des familles / couples en hijrah ou long séjour. Le contact humain reste le plus fiable pour s’intégrer proprement.",
  },
  {
    title: "Écoles & famille",
    text: "Options locales et parfois internationales selon la zone. Mataram concentre plus de services ; les côtes privilégient le cadre de vie.",
  },
  {
    title: "Respect du lieu",
    text: "Tenue correcte hors plage touristique, discrétion pendant les prières, politesse dans les villages. C’est la base d’une installation respectueuse — et durable.",
  },
];

export default function HijrahPage() {
  return (
    <main className="inner-page">
      <section className="site-section">
        <div className="site-container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Hijrah · Lombok</span>
              <h1>L’île aux mille mosquées.</h1>
            </div>
            <p>
              Une terre musulmane, une vie plus paisible pour ceux qui veulent s’installer —
              pas seulement passer en touriste.
            </p>
          </div>

          <div className="final-cta" style={{ marginTop: "2rem", padding: "1.75rem 2rem", borderRadius: "1rem" }}>
            <p style={{ margin: 0, display: "flex", alignItems: "flex-start", gap: "0.85rem" }}>
              <MoonStar aria-hidden="true" style={{ flexShrink: 0, marginTop: 4 }} />
              <span>
                <strong>MyLombok n’est pas une agence religieuse.</strong> On t’aide à poser des bases concrètes
                (zone, logement, contacts, démarches) dans un environnement où la pratique musulmane du quotidien
                est naturelle et visible.
              </span>
            </p>
          </div>

          <div className="service-editorial-list" style={{ marginTop: "2.75rem" }}>
            {pillars.map(({ Icon, title, text }, index) => (
              <article className="service-editorial" key={title}>
                <span className="service-editorial__number">0{index + 1}</span>
                <span className="service-editorial__icon"><Icon aria-hidden="true" /></span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
                <span aria-hidden="true" />
              </article>
            ))}
          </div>

          <div style={{ marginTop: "3rem" }}>
            <span className="eyebrow">Au quotidien</span>
            <h2 style={{ marginTop: "0.5rem" }}>Ce que ça change concrètement</h2>
            <div style={{ display: "grid", gap: "1.5rem", marginTop: "1.5rem" }}>
              {practical.map((item) => (
                <div key={item.title} style={{ paddingBottom: "1.25rem", borderBottom: "1px solid var(--line)" }}>
                  <h3 style={{ margin: "0 0 0.35rem", fontSize: "1.2rem" }}>{item.title}</h3>
                  <p style={{ margin: 0, opacity: 0.88 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: "3rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link className="button button--primary" href="/zones">
              Choisir sa zone <ArrowRight aria-hidden="true" />
            </Link>
            <Link className="button button--outline" href="/contacts">Contacts (logement & visa)</Link>
            <Link className="button button--outline" href="/parcours">Parcours d’installation</Link>
          </div>

          <p style={{ marginTop: "2rem", opacity: 0.75, fontSize: "0.95rem" }}>
            Tu prépares une hijrah en famille ou en solo ? Dis-le dans ton message WhatsApp :
            on adapte l’orientation zone et les contacts.
          </p>
        </div>
      </section>
    </main>
  );
}
