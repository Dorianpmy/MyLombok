import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Phone, Sparkles, Smartphone } from "lucide-react";
import { CheckoutButton } from "../components/checkout-button";

export const metadata: Metadata = {
  title: "Tarifs — App & accompagnement",
  description: "App 69 €, appel conseil 39 €, pack accompagnement 500 € ou sur devis pour s’installer à Lombok.",
};

function waLink(message: string) {
  return `https://wa.me/33763664857?text=${encodeURIComponent(message)}`;
}

const cardStyle = {
  border: "1px solid var(--line-strong)",
  borderRadius: "1.1rem",
  padding: "1.75rem 1.35rem",
  background: "var(--surface)",
  textAlign: "center" as const,
  display: "grid",
  gap: "0.85rem",
  justifyItems: "center" as const,
};

const formulas = [
  {
    name: "Essentiel + Complet",
    price: "500 €",
    tagline: "Cadre clair + aide concrète pour t’installer proprement.",
    items: [
      "Clarification du projet & orientation zone",
      "Checklist personnalisée",
      "Tips : visa, logement, banque, SIM, budget, pièges",
      "Aide visa / formalités",
      "Aide recherche logement longue durée",
      "Préparation arrivée + support WhatsApp",
    ],
    message:
      "Salut ! Je suis intéressé par le pack Essentiel + Complet (500 €) pour m’installer à Lombok. Tu peux me dire comment on démarre ?",
    cta: "Demander",
  },
  {
    name: "Premium / A à Z",
    price: "Sur devis",
    tagline: "Tu préfères déléguer le maximum jusqu’à être installé.",
    items: [
      "Tout le pack 500 €",
      "Suivi rapproché sur place",
      "Contacts locaux prioritaires",
      "Ajustements après arrivée",
      "Accompagnement prolongé",
    ],
    message:
      "Salut ! Je voudrais un devis pour l’accompagnement Premium / A à Z pour m’installer à Lombok. On peut en discuter ?",
    cta: "Demander un devis",
  },
];

export default function AccompagnementPage() {
  return (
    <main className="inner-page">
      <section className="site-section">
        <div className="site-container" style={{ maxWidth: 640 }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span className="eyebrow" style={{ justifyContent: "center" }}>Trois façons d’avancer</span>
            <h1 style={{ marginTop: "0.5rem" }}>App, appel, ou accompagné.</h1>
            <p className="lead-copy" style={{ margin: "0.75rem auto 0", maxWidth: 480 }}>
              L’app te donne des outils et des contacts. L’appel, c’est mon temps. L’accompagnement, un suivi plus large.
            </p>
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <p style={{ textAlign: "center", margin: "0 0 0.65rem", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--bronze-text)" }}>
              Produit · self-service
            </p>
            <article style={cardStyle}>
              <span style={{ width: 48, height: 48, borderRadius: "50%", border: "1px solid var(--line)", display: "grid", placeItems: "center", color: "var(--forest-action)" }}>
                <Smartphone aria-hidden="true" style={{ width: 22 }} />
              </span>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.55rem" }}>Accès app + contacts</h3>
                <p style={{ fontWeight: 700, fontSize: "1.5rem", margin: "0.4rem 0 0" }}>69 €</p>
              </div>
              <p style={{ margin: 0, opacity: 0.88, fontSize: 14 }}>
                Paiement unique · pas d’abonnement · tu avances seul avec les bons outils.
              </p>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", fontSize: 14, opacity: 0.9, display: "grid", gap: 6, width: "100%", textAlign: "left" }}>
                <li>· <strong>2 contacts locaux</strong> (logements et visa)</li>
                <li>· Fiches zones d’installation</li>
                <li>· Parcours guidé + checklist</li>
              </ul>
              <div style={{ width: "100%", marginTop: 4 }}>
                <CheckoutButton label="Payer 69 € — accès immédiat" product="app_access" />
              </div>
            </article>
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <p style={{ textAlign: "center", margin: "0 0 0.65rem", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--bronze-text)" }}>
              Appel · mon temps
            </p>
            <article style={cardStyle}>
              <span style={{ width: 48, height: 48, borderRadius: "50%", border: "1px solid var(--line)", display: "grid", placeItems: "center", color: "var(--forest-action)" }}>
                <Phone aria-hidden="true" style={{ width: 22 }} />
              </span>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.55rem" }}>Appel conseil</h3>
                <p style={{ fontWeight: 700, fontSize: "1.5rem", margin: "0.4rem 0 0" }}>39 €</p>
              </div>
              <p style={{ margin: 0, opacity: 0.88, fontSize: 14 }}>
                Clarifier ton projet, ta zone, le logement ou le visa — sans pack complet.
              </p>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", fontSize: 14, opacity: 0.9, display: "grid", gap: 6, width: "100%", textAlign: "left" }}>
                <li>· Appel ~30–45 min (WhatsApp ou téléphone)</li>
                <li>· Orientation personnalisée</li>
                <li>· Après paiement, on fixe le créneau</li>
              </ul>
              <p style={{ margin: 0, fontSize: 13, opacity: 0.75 }}>
                Message court WhatsApp = ok. Conseil détaillé / appel = 39 €.
              </p>
              <div style={{ width: "100%", marginTop: 4 }}>
                <CheckoutButton label="Payer 39 € — réserver un appel" product="call_conseil" />
              </div>
            </article>
          </div>

          <div style={{ marginTop: "2.25rem" }}>
            <p style={{ textAlign: "center", margin: "0 0 0.35rem", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--bronze-text)" }}>
              Accompagnement humain
            </p>
            <p style={{ textAlign: "center", margin: "0 0 1rem", fontSize: 14, opacity: 0.85 }}>
              Pour un suivi plus large qu’un seul appel.
            </p>
            <div style={{ display: "grid", gap: "1rem" }}>
              {formulas.map((f) => (
                <article key={f.name} style={cardStyle}>
                  <span style={{ width: 48, height: 48, borderRadius: "50%", border: "1px solid var(--line)", display: "grid", placeItems: "center", color: "var(--forest-action)" }}>
                    <Sparkles aria-hidden="true" style={{ width: 22 }} />
                  </span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.45rem" }}>{f.name}</h3>
                    <p style={{ fontWeight: 700, fontSize: "1.35rem", margin: "0.35rem 0 0" }}>{f.price}</p>
                  </div>
                  <p style={{ margin: 0, fontStyle: "italic", opacity: 0.85, fontSize: 14 }}>{f.tagline}</p>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", fontSize: 14, opacity: 0.9, display: "grid", gap: 6, width: "100%", textAlign: "left" }}>
                    {f.items.map((item) => (
                      <li key={item}>· {item}</li>
                    ))}
                  </ul>
                  <a
                    className="button button--outline"
                    href={waLink(f.message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    {f.cta}
                  </a>
                </article>
              ))}
            </div>
          </div>

          <div className="final-cta" style={{ marginTop: "2.5rem", padding: "1.75rem 1.35rem", borderRadius: "1.1rem", textAlign: "center" }}>
            <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.5rem" }}>WhatsApp : à quoi ça sert ?</h2>
            <p style={{ margin: "0 auto", maxWidth: 420, fontSize: 14 }}>
              Message court pour réserver ou confirmer = ok.
              Conseil détaillé = <strong>appel 39 €</strong> (ou un pack).
            </p>
            <div style={{ display: "grid", gap: 10, marginTop: "1.15rem" }}>
              <CheckoutButton label="Réserver un appel — 39 €" product="call_conseil" />
              <a
                className="button button--outline"
                href={waLink("Salut ! J’ai payé (ou je vais payer) l’appel conseil 39 €. On peut fixer un créneau ?")}
                target="_blank"
                rel="noopener noreferrer"
                style={{ justifyContent: "center" }}
              >
                <MessageCircle aria-hidden="true" /> Déjà payé ? Fixer le créneau
              </a>
            </div>
          </div>

          <p style={{ marginTop: "1.75rem", textAlign: "center", opacity: 0.7, fontSize: "0.9rem" }}>
            App 69 € · Appel 39 € · Pack 500 € · Premium sur devis
          </p>
        </div>
      </section>
    </main>
  );
}
