"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, CircleCheck, Download, Share2, Smartphone, SquarePlus } from "lucide-react";
import { useEffect, useState } from "react";

type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const safariSteps = [
  {
    Icon: Smartphone,
    title: "Ouvrez cette page dans Safari",
    text: "Sur iPhone, l’ajout à l’écran d’accueil se fait directement depuis Safari.",
  },
  {
    Icon: Share2,
    title: "Touchez Partager",
    text: "Repérez le carré avec une flèche vers le haut dans la barre de Safari.",
  },
  {
    Icon: SquarePlus,
    title: "Choisissez « Sur l’écran d’accueil »",
    text: "Faites défiler la liste des actions si cette option n’apparaît pas immédiatement.",
  },
  {
    Icon: Check,
    title: "Validez avec « Ajouter »",
    text: "MyLombok apparaîtra avec son icône et s’ouvrira dans sa propre fenêtre.",
  },
];

export default function InstallerPage() {
  const [installPrompt, setInstallPrompt] = useState<InstallPrompt | null>(null);
  const [installed, setInstalled] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean };
    const timer = window.setTimeout(() => setInstalled(window.matchMedia("(display-mode: standalone)").matches || Boolean(navigatorWithStandalone.standalone)), 0);

    const capturePrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPrompt);
    };
    const confirmInstallation = () => {
      setInstalled(true);
      setInstallPrompt(null);
      setFeedback("MyLombok est maintenant disponible depuis votre écran d’accueil.");
    };

    window.addEventListener("beforeinstallprompt", capturePrompt);
    window.addEventListener("appinstalled", confirmInstallation);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", capturePrompt);
      window.removeEventListener("appinstalled", confirmInstallation);
    };
  }, []);

  async function install() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    setInstallPrompt(null);
    if (choice.outcome === "accepted") {
      setInstalled(true);
      setFeedback("Installation lancée. L’icône MyLombok va apparaître sur votre appareil.");
    } else {
      setFeedback("Installation annulée. Vous pourrez la relancer depuis le menu de votre navigateur.");
    }
  }

  return (
    <main className="inner-page install-page">
      <section className="install-hero-section">
        <div className="site-container install-hero-grid">
          <div className="install-hero-copy">
            <span className="eyebrow eyebrow--light">Application MyLombok</span>
            <h1>Lombok, toujours à portée de main.</h1>
            <p>
              Ajoutez MyLombok à votre écran d’accueil pour retrouver plus vite le guide,
              vos repères et la conciergerie, sans passer par un magasin d’applications.
            </p>

            <div className="install-hero-actions">
              {installed ? (
                <div className="install-status" role="status">
                  <CircleCheck aria-hidden="true" />
                  <span><strong>Application installée</strong>{" "}Vous pouvez ouvrir MyLombok depuis votre écran d’accueil.</span>
                </div>
              ) : installPrompt ? (
                <button className="button button--light button--large" type="button" onClick={install}>
                  <Download aria-hidden="true" />
                  Installer maintenant
                </button>
              ) : (
                <a className="button button--light button--large" href="#guide-installation">
                  <Download aria-hidden="true" />
                  Voir les étapes
                </a>
              )}
              <Link className="button button--ghost-light button--large" href="/explorer">
                Explorer Lombok
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
            <p className="install-feedback" aria-live="polite">{feedback}</p>
            <small>Gratuite · sans téléchargement depuis l’App Store · désinstallable à tout moment</small>
          </div>

          <aside className="install-preview" aria-label="Aperçu de l’application installée">
            <div className="install-preview-brand">
              <Image src="/favicon.svg" width={68} height={68} alt="" aria-hidden="true" />
              <span><strong>MyLombok</strong><small>Conciergerie locale</small></span>
            </div>
            <p className="install-preview-kicker">Votre carnet de séjour</p>
            <h2>Une ouverture plus directe.</h2>
            <ul>
              <li><Check aria-hidden="true" /> Une icône dédiée sur votre écran d’accueil</li>
              <li><Check aria-hidden="true" /> Une expérience plein écran, pensée pour mobile</li>
              <li><Check aria-hidden="true" /> Un accès immédiat à Explorer et à la conciergerie</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="site-section install-guide" id="guide-installation">
        <div className="site-container install-guide-grid">
          <div className="install-guide-intro">
            <span className="eyebrow">Sur iPhone · Safari</span>
            <h2>Quatre gestes, moins d’une minute.</h2>
            <p>
              Apple affiche l’option d’installation dans le menu Partager de Safari.
              Aucun compte n’est nécessaire pour ajouter l’application.
            </p>
            <div className="install-guide-note">
              <strong>Vous utilisez Android ou un ordinateur ?</strong>
              <p>Si l’installation est disponible, le bouton « Installer maintenant » apparaît en haut de cette page. Sinon, ouvrez le menu de votre navigateur et choisissez « Installer l’application ».</p>
            </div>
          </div>

          <ol className="install-steps">
            {safariSteps.map(({ Icon, title, text }, index) => (
              <li key={title}>
                <span className="install-step-number">0{index + 1}</span>
                <span className="install-step-icon"><Icon aria-hidden="true" /></span>
                <div><strong>{title}</strong><p>{text}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
