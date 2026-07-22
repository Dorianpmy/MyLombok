"use client";

import { useEffect, useState } from "react";

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

export default function InstallerPage() {
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    setInstalled(window.matchMedia("(display-mode: standalone)").matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
    const capture = (event: Event) => { event.preventDefault(); setPrompt(event as InstallPrompt); };
    window.addEventListener("beforeinstallprompt", capture);
    return () => window.removeEventListener("beforeinstallprompt", capture);
  }, []);

  async function install() {
    if (!prompt) return;
    await prompt.prompt();
    const choice = await prompt.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
  }

  return <main className="install-page"><section className="install-phone">
    <header><a href="/">← Retour</a><img src="/mylombok-logo.svg" alt="MyLombok"/></header>
    <div className="install-hero"><img src="/icons/icon-192.png" alt="Icône MyLombok"/><div className="eyebrow">SUR TON ÉCRAN D’ACCUEIL</div><h1>Emporte Lombok avec toi</h1><p>Installe MyLombok comme une vraie application : plein écran, lancement rapide et accès aux écrans déjà consultés même avec peu de réseau.</p></div>
    {installed ? <div className="installed-state"><span>✓</span><div><strong>MyLombok est installée</strong><p>Tu peux maintenant l’ouvrir depuis ton écran d’accueil.</p></div></div> : <>
      {prompt && <button className="install-native" onClick={install}>Installer MyLombok <span>↓</span></button>}
      <section className="install-steps"><div className="install-heading"><span></span><div><small>SUR IPHONE · SAFARI</small><h2>Installation en 4 gestes</h2></div></div>
        <ol><li><b>1</b><div><strong>Ouvre cette page dans Safari</strong><p>L’installation iPhone se fait depuis Safari.</p></div></li><li><b>2</b><div><strong>Appuie sur Partager</strong><p>L’icône est un carré avec une flèche vers le haut.</p></div></li><li><b>3</b><div><strong>Choisis « Sur l’écran d’accueil »</strong><p>Fais défiler le menu si l’option n’apparaît pas.</p></div></li><li><b>4</b><div><strong>Appuie sur « Ajouter »</strong><p>MyLombok s’ouvrira ensuite sans la barre Safari.</p></div></li></ol>
      </section>
      <section className="install-note"><span>✦</span><div><strong>Conseil avant de partir</strong><p>Ouvre Explorer et tes adresses favorites une fois avec du Wi-Fi : elles seront plus faciles à retrouver lorsque le réseau sera faible.</p></div></section>
    </>}
  </section></main>;
}
