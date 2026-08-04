import type { Metadata } from "next";
import { Clock3, MessageCircle, ShieldCheck } from "lucide-react";
import { ConciergeForm } from "../components/concierge-form";

export const metadata: Metadata = {
  title: "Parler à la conciergerie",
  description: "Préparez une demande à MyLombok pour votre transfert, vos déplacements, vos activités ou l’organisation de votre séjour.",
};

export default async function ConciergePage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service = "sejour" } = await searchParams;
  return (
    <main className="inner-page concierge-page">
      <header className="inner-hero inner-hero--forest">
        <div className="site-container inner-hero__grid">
          <div><span className="eyebrow eyebrow--light">Conciergerie MyLombok</span><h1>Votre séjour commence par une conversation.</h1><p>Dites-nous ce que vous souhaitez simplifier. Nous vous aidons à structurer la demande avant de poursuivre l’échange sur WhatsApp.</p></div>
          <div className="concierge-reassurance">
            <article><MessageCircle aria-hidden="true" /><div><strong>Un message clair</strong><span>Vos informations sont regroupées pour éviter les allers-retours inutiles.</span></div></article>
            <article><Clock3 aria-hidden="true" /><div><strong>Sans engagement automatique</strong><span>Préparer une demande ne déclenche ni paiement ni réservation.</span></div></article>
            <article><ShieldCheck aria-hidden="true" /><div><strong>Vous gardez le contrôle</strong><span>Le message n’est envoyé qu’après votre validation dans WhatsApp.</span></div></article>
          </div>
        </div>
      </header>
      <div className="site-container concierge-page__form"><ConciergeForm initialService={service} /></div>
    </main>
  );
}
