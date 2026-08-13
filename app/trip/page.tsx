import type { Metadata } from "next";
import { TripClient } from "../components/trip-client";

export const metadata: Metadata = {
  title: "Mon voyage",
  description: "Préparez vos dates, vos envies et votre programme dans votre espace privé MyLombok.",
  robots: { index: false, follow: false },
};

export default function TripPage() {
  return (
    <main className="inner-page travel-page">
      <header className="simple-page-header travel-hero">
        <div className="site-container">
          <span className="eyebrow">Votre carnet privé</span>
          <h1>Un voyage pensé à votre rythme.</h1>
          <p>Dates, logement, envies et journées : organisez l’essentiel sans rendre vos informations publiques.</p>
        </div>
      </header>
      <div className="site-container"><TripClient /></div>
    </main>
  );
}
