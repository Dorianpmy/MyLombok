import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Paiement confirmé",
  robots: { index: false, follow: false },
};

export default function PaiementSuccesPage() {
  return (
    <main className="inner-page">
      <section className="site-section">
        <div className="site-container" style={{ maxWidth: 640, textAlign: "center" }}>
          <CheckCircle2 aria-hidden="true" style={{ width: 48, height: 48, color: "var(--forest-action)", margin: "0 auto 1rem" }} />
          <span className="eyebrow" style={{ justifyContent: "center" }}>Paiement reçu</span>
          <h1>Merci — c’est bon.</h1>
          <p className="lead-copy">
            Ton accès app (39 €) est confirmé. Tu peux explorer les contacts, zones et tips tout de suite.
          </p>
          <p style={{ opacity: 0.85 }}>
            Un reçu Stripe t’est envoyé par e-mail. Si tu as une question, écris-moi sur WhatsApp.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", marginTop: "2rem" }}>
            <Link className="button button--primary" href="/contacts">Voir les contacts</Link>
            <Link className="button button--outline" href="/parcours">Parcours guidé</Link>
            <a
              className="button button--outline"
              href="https://wa.me/33763664857?text=Salut%20%21%20Je%20viens%20de%20payer%20l%27acc%C3%A8s%20app%2039%20%E2%82%AC."
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle aria-hidden="true" /> WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
