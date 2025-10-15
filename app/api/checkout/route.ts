
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

export async function POST(req: NextRequest) {
  try {
    const { plan, userId, email } = await req.json();
    if (!plan || !email) return NextResponse.json({ error: "Missing plan/email" }, { status: 400 });

    const priceId = plan === "standard"
      ? process.env.NEXT_PUBLIC_STRIPE_PRICE_STANDARD
      : process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM;

    if (!priceId) return NextResponse.json({ error: "Missing price id" }, { status: 500 });

    const customers = await stripe.customers.list({ email, limit: 1 });
    const existing = customers.data[0];
    const customer = existing ?? await stripe.customers.create({ email, metadata: { userId: userId ?? "" } });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"], // Apple Pay/Google Pay surgem automaticamente se elegíveis
      customer: customer.id,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancelado`,
      subscription_data: { metadata: { plan } },
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
