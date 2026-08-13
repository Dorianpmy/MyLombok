import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Banknote, FileText, Home, Smartphone, AlertTriangle, Wallet } from "lucide-react";

export const metadata: Metadata = {
  title: "Tips d’installation",
  description: "Visa, logement longue durée, banque, SIM, coût de la vie et pièges fréquents pour s’installer à Lombok.",
};

const categories = [
  { href: "/tips/visa", Icon: FileText, number: "01", title: "Visa & démarches", text: "Types de visa, renouvellements, points d’attention." },
  { href: "/tips/logement", Icon: Home, number: "02", title: "Logement longue durée", text: "Comment chercher, négocier et sécuriser un bail." },
  { href: "/tips/banque", Icon: Banknote, number: "03", title: "Banque & argent", text: "Ouvrir un compte, retirer, transferts internationaux." },
  { href: "/tips/sim-internet", Icon: Smartphone, number: "04", title: "SIM & internet", text: "Opérateurs, forfaits, fibre et réalités du terrain." },
  { href: "/tips/cout-de-la-vie", Icon: Wallet, number: "05", title: "Coût de la vie réel", text: "Loyer, courses, transport, budget mensuel réaliste." },
  { href: "/tips/pieges", Icon: AlertTriangle, number: "06", title: "Pièges fréquents", text: "Arnaques classiques et erreurs à éviter." },
];

export default function TipsPage() {
  return (
    <main className="inner-page">
      <section className="site-section">
        <div className="site-container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">S’installer à Lombok</span>
              <h1>Tips d’installation</h1>
            </div>
            <p>Des infos concrètes, dans l’ordre des étapes. Pas de blabla touristique.</p>
          </div>

          <div className="service-editorial-list" style={{ marginTop: "2.5rem" }}>
            {categories.map(({ href, Icon, number, title, text }) => (
              <article className="service-editorial" key={href}>
                <span className="service-editorial__number">{number}</span>
                <span className="service-editorial__icon"><Icon aria-hidden="true" /></span>
                <div><h3>{title}</h3><p>{text}</p></div>
                <Link href={href}>Lire <ArrowRight aria-hidden="true" /></Link>
              </article>
            ))}
          </div>

          <div className="services-more" style={{ marginTop: "3rem" }}>
            <Link className="button button--outline" href="/parcours">Voir le parcours complet</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
