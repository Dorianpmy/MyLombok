import Stripe from "stripe";

export const STRIPE_PRODUCTS = {
  app_access: {
    id: "app_access",
    name: "MyLombok — Accès app",
    description: "Accès one-shot : contacts locaux, zones, tips et parcours d’installation à Lombok.",
    amountCents: 3900,
    currency: "eur" as const,
  },
} as const;

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, {
    apiVersion: "2025-07-30.basil",
    typescript: true,
  });
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://my-lombok.vercel.app";
}
