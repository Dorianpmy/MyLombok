import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./theme.css";
import "./premium.css";
import PwaRegister from "./pwa-register";

export const metadata: Metadata = {
  metadataBase: new URL("https://my-lombok.vercel.app"),
  title: "My Lombok — Ta vie à Lombok, simplement",
  description: "Ton carnet personnel et ta conciergerie pour t’installer et profiter de Lombok.",
  openGraph: {
    title: "MyLombok — Conciergerie locale",
    description: "131 lieux, un guide local et ta conciergerie personnelle à Lombok.",
    images: [{ url: "/og-mylombok.jpg", width: 1200, height: 630, alt: "Lombok au crépuscule vu du ciel" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MyLombok — Conciergerie locale",
    description: "131 lieux, un guide local et ta conciergerie personnelle à Lombok.",
    images: ["/og-mylombok.jpg"],
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
    { media: "(prefers-color-scheme: light)", color: "#FFFAF2" },
    { media: "(prefers-color-scheme: dark)", color: "#09131B" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
