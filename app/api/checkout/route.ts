import { NextResponse } from "next/server";
import { getSiteUrl, getStripe, STRIPE_PRODUCTS } from "../../lib/stripe";

export const runtime = "nodejs";

type Body = {
  product?: keyof typeof STRIPE_PRODUCTS;
  email?: string;
};

export async function POST(request: Request) {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe n’est pas encore configuré. Ajoute STRIPE_SECRET_KEY sur Vercel." },
        { status: 503 },
      );
    }

    let body: Body = {};
    try {
      body = (await request.json()) as Body;
    } catch {
      body = {};
    }

    const productKey = body.product && body.product in STRIPE_PRODUCTS ? body.product : "app_access";
    const product = STRIPE_PRODUCTS[productKey];
    const site = getSiteUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "fr",
      customer_email: body.email || undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: product.currency,
            unit_amount: product.amountCents,
            product_data: {
              name: product.name,
              description: product.description,
            },
          },
        },
      ],
      success_url: `${site}/paiement/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/paiement/annule`,
      metadata: {
        product: productKey,
        source: "mylombok-app",
      },
      allow_promotion_codes: true,
    });

    if (!session.url) {
      return NextResponse.json({ error: "Impossible de créer la session de paiement." }, { status: 500 });
    }

    return NextResponse.json({ url: session.url, id: session.id });
  } catch (error) {
    console.error("[checkout]", error);
    const message = error instanceof Error ? error.message : "Erreur de paiement";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
