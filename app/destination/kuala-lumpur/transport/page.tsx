import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MapPinned } from "lucide-react";
import { KualaLumpurTransportGuide } from "../../../components/kuala-lumpur-transport-guide";

export const metadata: Metadata = {
  title: "Se déplacer à Kuala Lumpur",
  description: "Guide sourcé pour marcher, utiliser le MRT, le LRT, le monorail, les taxis et rejoindre l’aéroport à Kuala Lumpur.",
  alternates: { canonical: "/destination/kuala-lumpur/transport" },
};

export default function KualaLumpurTransportPage() {
  return (
    <main className="inner-page kl-transport-page">
      <header className="simple-page-header">
        <div className="site-container">
          <Link className="service-detail-back" href="/destination/kuala-lumpur">
            <ArrowLeft aria-hidden="true" /> Kuala Lumpur
          </Link>
          <span className="eyebrow">Guide pratique vérifié</span>
          <h1>Se déplacer sans subir la ville.</h1>
          <p>MRT, LRT, monorail, marche ou voiture : choisissez selon le quartier, la météo, les bagages et le rythme de votre famille.</p>
          <Link className="button button--primary" href="/destination/kuala-lumpur/map">
            <MapPinned aria-hidden="true" /> Ouvrir la carte
          </Link>
        </div>
      </header>
      <section className="site-section">
        <div className="site-container"><KualaLumpurTransportGuide /></div>
      </section>
    </main>
  );
}
