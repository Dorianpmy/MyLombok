import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./design-system.css";
import PwaRegister from "./pwa-register";
import { SiteHeader } from "./components/site-header";
import { SiteFooter } from "./components/site-footer";
import { AppNavigation } from "./components/app-navigation";

export const metadata: Metadata = {
  metadataBase: new URL("https://my-lombok.vercel.app"),
  title: {
    default: "MyLombok — Conciergerie locale à Lombok",
    template: "%s | MyLombok",
  },
  description: "Une conciergerie locale et attentionnée pour préparer, organiser et simplifier votre séjour à Lombok.",
  keywords: ["Lombok", "conciergerie Lombok", "voyage Lombok", "guide Lombok", "Indonésie"],
  openGraph: {
    title: "MyLombok — Lombok, en toute sérénité.",
    description: "Une présence locale pour préparer et simplifier votre séjour à Lombok.",
    type: "website",
    locale: "fr_FR",
    siteName: "MyLombok",
    images: [{ url: "/mylombok-social-preview.jpg", width: 1200, height: 630, alt: "Côte de Lombok au lever du jour, vue depuis une terrasse tropicale" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MyLombok — Lombok, en toute sérénité.",
    description: "Une présence locale pour préparer et simplifier votre séjour à Lombok.",
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
