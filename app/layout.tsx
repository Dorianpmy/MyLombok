import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./design-system.css";
import "./mobile-map-list.css";
import "./mobile-polish.css";
import "./destination-switcher-mobile.css";
import PwaRegister from "./pwa-register";
import { SiteHeader } from "./components/site-header";
import { SiteFooter } from "./components/site-footer";
import { AppNavigation } from "./components/app-navigation";

export const metadata: Metadata = {
  metadataBase: new URL("https://my-lombok.vercel.app"),
  title: {
    default: "MyLombok — S’installer à Lombok",
    template: "%s | MyLombok",
  },
  description: "Les meilleurs endroits pour vivre à Lombok, tips concrets d’installation, checklist et contacts utiles. Accompagnement local possible.",
  keywords: ["Lombok", "s’installer à Lombok", "vivre à Lombok", "installation Lombok", "expat Lombok", "Indonésie"],
  openGraph: {
    title: "MyLombok — S’installer à Lombok",
    description: "Aide concrète pour s’installer proprement à Lombok : zones, tips, parcours et accompagnement local.",
    type: "website",
    locale: "fr_FR",
    siteName: "MyLombok",
    images: [{ url: "/mylombok-social-preview.jpg", width: 1200, height: 630, alt: "Côte de Lombok au lever du jour, vue depuis une terrasse tropicale" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MyLombok — S’installer à Lombok",
    description: "Aide concrète pour s’installer proprement à Lombok : zones, tips, parcours et accompagnement local.",
    images: ["/mylombok-social-preview.jpg"],
  },
  manifest: "/manifest.webmanifest",
  applicationName: "MyLombok",
  appleWebApp: {
    capable: true,
    title: "MyLombok",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F2E9" },
    { media: "(prefers-color-scheme: dark)", color: "#17231F" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('my-lombok-theme');if(t==='dark')document.documentElement.dataset.theme='dark'}catch(e){}` }} />
        <a className="skip-link" href="#main-content">Aller au contenu principal</a>
        <PwaRegister />
        <SiteHeader />
        <div className="site-main" id="main-content" tabIndex={-1}>{children}</div>
        <SiteFooter />
        <AppNavigation />
      </body>
    </html>
  );
}
