import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Installer l’application",
  description: "Ajoutez MyLombok à votre écran d’accueil pour accéder rapidement au guide et à la conciergerie depuis votre téléphone.",
  alternates: { canonical: "/installer" },
  robots: { index: false, follow: false },
};

export default function InstallerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
