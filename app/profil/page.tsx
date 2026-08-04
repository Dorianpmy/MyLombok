import type { Metadata } from "next";
import { ProfileClient } from "../components/profile-client";

export const metadata: Metadata = {
  title: "Mon espace",
  description: "Retrouvez vos favoris, demandes et préférences de séjour MyLombok.",
};

export default function ProfilePage() {
  return (
    <main className="inner-page profile-page">
      <header className="simple-page-header"><div className="site-container"><span className="eyebrow">Un espace à votre mesure</span><h1>Votre séjour, au même endroit.</h1><p>Préférences, adresses et demandes : gardez uniquement les informations qui vous sont utiles.</p></div></header>
      <div className="site-container"><ProfileClient /></div>
    </main>
  );
}
