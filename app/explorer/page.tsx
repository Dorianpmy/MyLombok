import type { Metadata } from "next";
import "leaflet/dist/leaflet.css";
import { ExplorerClient } from "../components/explorer-client";

export const metadata: Metadata = {
  title: "Explorer Lombok",
  description: "Recherchez plages, restaurants, activités, services, nature et culture à Lombok dans un carnet cartographique centré sur l’île.",
  alternates: { canonical: "/explorer" },
};

export default async function ExplorerPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category = "all" } = await searchParams;
  return <main className="inner-page explorer-page"><header className="simple-page-header"><div className="site-container"><span className="eyebrow">Carnet de repérage</span><h1>Explorer Lombok.</h1><p>Une carte, des filtres utiles et des fiches transparentes pour préparer vos étapes.</p></div></header><div className="site-container"><ExplorerClient initialCategory={category} /></div></main>;
}
