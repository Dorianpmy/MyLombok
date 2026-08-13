import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Phone, Sparkles, Smartphone, Users } from "lucide-react";
import { CheckoutButton } from "../components/checkout-button";

export const metadata: Metadata = {
  title: "Tarifs — App & accompagnement",
  description: "App 69 €, appel conseil 55 €, pack accompagnement 500 € ou sur devis pour s’installer à Lombok.",
};

function waLink(message: string) {
  return `https://wa.me/33763664857?text=${encodeURIComponent(message)}`;
}

const formulas = [
  {
    number: "02",
    name: "Essentiel + Complet",
    price: "500 €",
    tagline: "Cadre clair + aide concrète pour t’installer proprement.",
    items: [
      "Clarification du projet & orientation zone",
      "Checklist personnalisée",
      "Tips concrets : visa, logement, banque, SIM, budget, pièges",
      "Aide visa / formalités (orientation)",
      "Aide à la recherche de logement longue durée",
      "Préparation de l’arrivée",
      "Support WhatsApp pendant la phase d’installation",
    ],
    message:
      "Salut ! Je suis intéressé par le pack Essentiel + Complet (500 €) pour m’installer à Lombok. Tu peux me dire comment on démarre ?",
  },
  {
    number: "03",
    name: "Premium / A à Z",
    price: "Sur devis",
    tagline: "Tu préfères déléguer le maximum jusqu’à être installé.",
    items: [
      "Tout le pack 500 €",
      "Suivi rapproché sur place",
      "Mise en relation prioritaire avec des contacts locaux",
      "Ajustements après ton arrivée",
      "Accompagnement prolongé sur les premiers mois",
      "Devis selon ton projet et ta durée",
    ],
    message:
      "Salut ! Je voudrais un devis pour l’accompagnement Premium / A à Z pour m’installer à Lombok. On peut en discuter ?",
  },
];

export default function AccompagnementPage() {
  return (
    <main className="inner-page">
      <section className="site-section">
        <div className="site-container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Trois façons d’avancer</span>
              <h1>App, appel, ou accompagné.</h1>
            </div>
            <p>
              L’app te donne des outils et des contacts. L’appel, c’est mon temps pour répondre à tes questions.
              L’accompagnement, c’est un suivi plus large.
            </p>
          </div>

          <div style={{ marginTop: "2.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.75rem" }}>
              <Smartphone aria-hidden="true" style={{ width: 18, color: "var(--bronze-text)" }} />
              <span className="eyebrow" style={{ margin: 0 }}>Produit · self-service</span>
            </div>
            <article
              className="service-editorial"
              style={{
                border: "1px solid var(--line-strong)",
                borderRadius: "var(--radius-medium)",
                padding: "1.5rem 1.25rem",
                background: "var(--surface)",
              }}
            >
              <span className="service-editorial__number">00</span>
              <span className="service-editorial__icon"><Smartphone aria-hidden="true" /></span>
              <div>
                <h3>Accès app + contacts</h3>
                <p style={{ fontWeight: 700, fontSize: "1.35rem", margin: "0.35rem 0 0.75rem" }}>69 €</p>
                <p style={{ marginBottom: "0.75rem" }}>
                  <strong>Paiement unique</strong> via Stripe · pas d’abonnement · tu avances seul avec les bons outils.
                </p>
                <ul style={{ margin: "0 0 1rem", paddingLeft: "1.1rem", opacity: 0.9 }}>
                  <li><strong>2 contacts locaux à joindre</strong> (logements et visa)</li>
                  <li>Fiches zones d’installation (ambiance, budget, pour qui)</li>
                  <li>Parcours guidé + checklist</li>
                </ul>
                <CheckoutButton label="Payer 69 € — accès immédiat" product="app_access" />
              </div>
              <span aria-hidden="true" />
            </article>
          </div>

          <div style={{ marginTop: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.75rem" }}>
              <Phone aria-hidden="true" style={{ width: 18, color: "var(--bronze-text)" }} />
              <span className="eyebrow" style={{ margin: 0 }}>Appel · mon temps</span>
            </div>
            <article
              className="service-editorial"
              style={{
                border: "1px solid var(--line-strong)",
                borderRadius: "var(--radius-medium)",
                padding: "1.5rem 1.25rem",
                background: "var(--surface)",
              }}
            >
              <span className="service-editorial__number">01</span>
              <span className="service-editorial__icon"><Phone aria-hidden="true" /></span>
              <div>
                <h3>Appel conseil</h3>
                <p style={{ fontWeight: 700, fontSize: "1.35rem", margin: "0.35rem 0 0.75rem" }}>55 €</p>
                <p style={{ marginBottom: "0.75rem" }}>
                  Un appel pour clarifier ton projet, ta zone, le logement ou le visa — sans pack complet.
                </p>
                <ul style={{ margin: "0 0 1rem", paddingLeft: "1.1rem", opacity: 0.9 }}>
                  <li>Appel ~30–45 min (WhatsApp ou téléphone)</li>
                  <li>Orientation personnalisée selon ta situation</li>
                  <li>Après paiement, tu m’écris pour fixer le créneau</li>
                </ul>
                <p style={{ fontSize: 13, opacity: 0.8, marginBottom: "0.75rem" }}>
                  <strong>WhatsApp sans paiement</strong> = message court pour réserver ou poser une question logistique.
                  Un conseil détaillé ou un appel = 55 €.
                </p>
                <CheckoutButton label="Payer 55 € — réserver un appel" product="call_conseil" />
              </div>
              <span aria-hidden="true" />
            </article>
          </div>

          <div style={{ marginTop: "3rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.5rem" }}>
              <Users aria-hidden="true" style={{ width: 18, color: "var(--bronze-text)" }} />
              <span className="eyebrow" style={{ margin: 0 }}>Service · accompagnement humain</span>
            </div>
            <p style={{ marginBottom: "1.25rem", maxWidth: 560, opacity: 0.9 }}>
              Pour un suivi plus large que un seul appel. On cadre d’abord par message, puis on avance ensemble.
            </p>

            <div className="service-editorial-list">
              {formulas.map((f) => (
                <article className="service-editorial" key={f.name}>
                  <span className="service-editorial__number">{f.number}</span>
                  <span className="service-editorial__icon"><Sparkles aria-hidden="true" /></span>
                  <div>
                    <h3>{f.name}</h3>
                    <p style={{ fontWeight: 700, margin: "0.25rem 0 0.35rem" }}>{f.price}</p>
                    <p style={{ fontStyle: "italic", opacity: 0.85, marginBottom: "0.5rem" }}>{f.tagline}</p>
                    <ul style={{ margin: 0, paddingLeft: "1.1rem", opacity: 0.9 }}>
                      {f.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <a href={waLink(f.message)} target="_blank" rel="noopener noreferrer">
                    {f.price === "Sur devis" ? "Demander un devis" : "Demander"}
                  </a>
                </article>
              ))}
            </div>
          </div>

          <div className="final-cta" style={{ marginTop: "3rem", padding: "2rem", borderRadius: "1rem" }}>
            <h2>WhatsApp : à quoi ça sert ?</h2>
            <p>
              Un message court pour réserver un appel, confirmer un paiement ou une question pratique = ok.
              Un conseil détaillé ou un échange long = <strong>appel 55 €</strong> (ou un pack).
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1.25rem" }}>
              <CheckoutButton label="Réserver un appel — 55 €" product="call_conseil" />
              <a
                className="button button--outline"
                href={waLink("Salut ! J’ai payé (ou je vais payer) l’appel conseil 55 €. On peut fixer un créneau ?")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle aria-hidden="true" /> Déjà payé ? Fixer le créneau
              </a>
            </div>
          </div>

          <p style={{ marginTop: "2rem", opacity: 0.75, fontSize: "0.95rem" }}>
            <strong>App 69 €</strong> · <strong>Appel 55 €</strong> · <strong>Pack 500 €</strong> · <strong>Premium sur devis</strong>.
            Les offres peuvent se cumuler.
          </p>
        </div>
      </section>
    </main>
  );
}
