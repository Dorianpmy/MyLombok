import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ListChecks, MapPin, MessageCircle, Phone, UserRound } from "lucide-react";

export const metadata: Metadata = {
  title: "Paiement confirmé",
  robots: { index: false, follow: false },
};

const nextSteps = [
  {
    Icon: Phone,
    title: "Contacts utiles",
    text: "Le cœur de ton accès : des personnes à joindre pour le logement, les démarches, la vie sur place.",
    href: "/contacts",
    action: "Ouvrir les contacts",
  },
  {
    Icon: MapPin,
    title: "Zones d’installation",
    text: "Compare Senggigi, Mangsit, Mataram, Kuta, Sekotong… pour choisir où vivre.",
    href: "/zones",
    action: "Voir les zones",
  },
  {
    Icon: ListChecks,
    title: "Parcours guidé",
    text: "Avance étape par étape : projet, zone, installation, premiers mois.",
    href: "/parcours",
    action: "Commencer le parcours",
  },
];

export default function PaiementSuccesPage() {
  return (
    <main className="inner-page">
      <section className="site-section">
        <div className="site-container" style={{ maxWidth: 820 }}>
          <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto" }}>
            <div
              style={{
                width: 64,
                height: 64,
                margin: "0 auto 1.25rem",
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                background: "color-mix(in srgb, var(--forest) 18%, transparent)",
                color: "var(--forest-action)",
              }}
            >
              <CheckCircle2 aria-hidden="true" style={{ width: 32, height: 32 }} />
            </div>
            <span className="eyebrow" style={{ justifyContent: "center" }}>Paiement reçu · 39 €</span>
            <h1>Bienvenue — ton accès est actif.</h1>
            <p className="lead-copy">
              Merci. Tu as maintenant l’accès app : contacts locaux, zones, tips et parcours pour t’installer proprement à Lombok.
            </p>
            <p style={{ opacity: 0.8, marginTop: "0.75rem" }}>
              Un reçu Stripe t’a été envoyé par e-mail. Garde-le précieusement.
            </p>
          </div>

          <div style={{ marginTop: "2.75rem" }}>
            <h2 style={{ fontSize: "1.5rem", textAlign: "center", marginBottom: "1.25rem" }}>Par où commencer ?</h2>
            <div className="service-editorial-list">
              {nextSteps.map(({ Icon, title, text, href, action }, index) => (
                <article className="service-editorial" key={title}>
                  <span className="service-editorial__number">0{index + 1}</span>
                  <span className="service-editorial__icon"><Icon aria-hidden="true" /></span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                  <Link href={href}>{action}</Link>
                </article>
              ))}
            </div>
          </div>

          <div
            className="final-cta"
            style={{ marginTop: "2.75rem", padding: "1.75rem 2rem", borderRadius: "1rem" }}
          >
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.6rem" }}>Une question tout de suite ?</h2>
              <p style={{ margin: 0 }}>
                Écris-moi sur WhatsApp — je te réponds pour t’orienter selon ta zone et ton projet.
              </p>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                <a
                  className="button button--primary"
                  href="https://wa.me/33763664857?text=Salut%20%21%20Je%20viens%20de%20payer%20l%27acc%C3%A8s%20app%2039%20%E2%82%AC%20et%20j%27ai%20une%20question."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle aria-hidden="true" /> WhatsApp
                </a>
                <Link className="button button--outline" href="/profil">
                  <UserRound aria-hidden="true" /> Créer mon compte
                </Link>
                <Link className="button button--outline" href="/tips">Lire les tips</Link>
              </div>
            </div>
          </div>

          <p style={{ marginTop: "1.75rem", textAlign: "center", opacity: 0.7, fontSize: "0.9rem" }}>
            Paiement unique · pas d’abonnement · accès conservé sur cet appareil / compte
          </p>
        </div>
      </section>
    </main>
  );
}
