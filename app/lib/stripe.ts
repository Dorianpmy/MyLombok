import Stripe from "stripe";

export const STRIPE_PRODUCTS = {
  app_access: {
    id: "app_access",
    name: "MyLombok — Accès app + contacts",
    description: "Accès one-shot : 2 contacts locaux (logements et visa), zones, parcours d’installation à Lombok.",
    amountCents: 6900,
    currency: "eur" as const,
  },
  call_conseil: {
    id: "call_conseil",
    name: "MyLombok — Appel conseil",
    description: "Appel conseil personnalisé (installation à Lombok) : orientation zone, questions logement / visa, prochaines étapes.",
    amountCents: 5500,
    currency: "eur" as const,
  },
} as const;

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, {
    typescript: true,
  });
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://my-lombok.vercel.app";
}
