import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Visa & démarches — Tips installation",
  description: "Repères concrets sur les visas et démarches pour s’installer à Lombok. Orientations, pas conseil juridique.",
};

export default function TipsVisaPage() {
  return (
    <main className="inner-page">
      <section className="site-section">
        <div className="site-container" style={{ maxWidth: 780 }}>
          <span className="eyebrow">Tips · 01</span>
          <h1>Visa & démarches</h1>
          <p className="lead-copy">Avant tout : le cadre légal change. Vérifie toujours les sources officielles indonésiennes. Ce qui suit est un fil conducteur pratique, pas un conseil juridique.</p>

          <h2 style={{ marginTop: "2.5rem", fontSize: "1.75rem" }}>Ce qu’il faut clarifier en premier</h2>
          <ul>
            <li><strong>Durée réelle</strong> de ton projet (3 mois, 1 an, long terme).</li>
            <li><strong>Activité</strong> : séjour, remote work, création d’activité locale, retraite…</li>
            <li><strong>Nationalité</strong> et règles spécifiques éventuelles.</li>
          </ul>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Repères utiles (à vérifier officiellement)</h2>
          <ul>
            <li><strong>Visa de visite / touriste</strong> : souvent le premier passage, avec règles de durée et d’extension strictes.</li>
            <li><strong>Extensions</strong> : anticiper les délais et le lieu de dépôt (Mataram / autorités compétentes).</li>
            <li><strong>Visa long séjour / retraite / autres statuts</strong> : conditions de ressources, documents, et parfois sponsor — à traiter avec un pro ou l’immigration.</li>
            <li><strong>Ne pas travailler</strong> hors du cadre autorisé : le remote work « gris » expose à des risques.</li>
          </ul>

          <h2 style={{ marginTop: "2rem", fontSize: "1.75rem" }}>Bonnes pratiques</h2>
          <ul>
            <li>Garde des copies PDF de ton passeport, visa, tampon d’entrée.</li>
            <li>Note les dates d’expiration dans ton calendrier (J-30, J-14).</li>
            <li>Évite les « agents » sans référence vérifiable.</li>
            <li>En cas de doute, priorise le site / bureau d’immigration officiel.</li>
          </ul>

          <p style={{ marginTop: "1.5rem", opacity: 0.8 }}><strong>Important :</strong> MyLombok n’est pas un cabinet d’immigration. Pour un dossier personnel, l’accompagnement humain ou un professionnel local reste le plus sûr.</p>

          <p style={{ marginTop: "1.25rem" }}>
            <a className="editorial-link" href="https://evisa.imigrasi.go.id/" target="_blank" rel="noopener noreferrer">
              Portail e-visa immigration <ExternalLink aria-hidden="true" />
            </a>
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "2.5rem" }}>
            <Link className="button button--outline" href="/tips">Tous les tips</Link>
            <Link className="button button--primary" href="/tips/logement">Tip suivant : Logement <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
