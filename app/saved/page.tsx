import type { Metadata } from "next";
import { SavedClient } from "../components/saved-client";

export const metadata: Metadata = {
  title: "Mes favoris",
  description: "Retrouvez vos adresses sauvegardées et ajoutez-les à votre voyage privé MyLombok.",
  robots: { index: false, follow: false },
};

export default function SavedPage() {
  return (
    <main className="inner-page saved-page">
      <header className="simple-page-header saved-hero">
        <div className="site-container">
          <span className="eyebrow">Vos envies</span>
          <h1>Les lieux que vous voulez garder.</h1>
          <p>Filtrez votre sélection, retrouvez les détails et ajoutez chaque adresse à une journée de votre voyage.</p>
        </div>
      </header>
      <div className="site-container"><SavedClient /></div>
    </main>
  );
}
