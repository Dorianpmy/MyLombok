import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Phone, Sparkles, Smartphone, Users } from "lucide-react";
import { CheckoutButton } from "../components/checkout-button";

export const metadata: Metadata = {
  title: "Tarifs — App & accompagnement",
  description: "App 69 € avec 2 contacts (logements et visa). Accompagnement humain à 500 € ou sur devis pour s’installer à Lombok.",
};

function waLink(message: string) {
  return `https://wa.me/33763664857?text=${encodeURIComponent(message)}`;
}

const formulas = [
  {
    number: "01",
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
    number: "02",
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
              <span className="eyebrow">Deux façons d’avancer</span>
              <h1>App seule, ou accompagné.</h1>
            </div>
            <p>
              L’app te donne des outils et des contacts à joindre.
              L’accompagnement humain, c’est du temps avec moi pour avancer plus vite — ou tout déléguer.
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
              <span className="service-editorial__icon"><Phone aria-hidden="true" /></span>
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
                <CheckoutButton label="Payer 69 € — accès immédiat" />
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
              Tu préfères qu’on en parle et que je t’aide concrètement ? Deux niveaux.
              On commence toujours par un échange WhatsApp — pas de paiement forcé sans discussion.
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
            <h2>Pas sûr de ce qu’il te faut ?</h2>
            <p>Dis-moi où tu en es. On regarde ensemble si l’app seule suffit ou si un accompagnement a plus de sens.</p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1.25rem" }}>
              <a
                className="button button--primary"
                href={waLink("Salut ! J’aimerais discuter de mon projet d’installation à Lombok. Tu es dispo pour un échange rapide ?")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle aria-hidden="true" /> Discuter sur WhatsApp
              </a>
              <Link className="button button--outline" href="/contacts">Aperçu contacts</Link>
            </div>
          </div>

          <p style={{ marginTop: "2rem", opacity: 0.75, fontSize: "0.95rem" }}>
            <strong>App 69 €</strong> = outils + 2 contacts (self-service).
            <strong> Pack 500 €</strong> = mon temps avec toi.
            <strong> Premium</strong> = sur devis. Les offres peuvent se cumuler.
          </p>
        </div>
      </section>
    </main>
  );
}
