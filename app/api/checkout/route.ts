// app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export const runtime = 'nodejs';

type Plan = 'standard' | 'premium';

const PRICE_BY_PLAN: Record<Plan, string> = {
  standard: process.env.STRIPE_PRICE_ID_STANDARD!,
  premium: process.env.STRIPE_PRICE_ID_PREMIUM!,
};

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') || 'http://localhost:3000';
}

export async function POST(req: Request) {
  try {
    const { plan, email, userId } = await req.json();
    if (!plan || !PRICE_BY_PLAN[plan as Plan]) {
      return NextResponse.json({ error: 'Plano inválido' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: PRICE_BY_PLAN[plan as Plan], quantity: 1 }],
      allow_promotion_codes: true,
      // Se não enviares email, Stripe pede no checkout
      customer_email: email || undefined,
      client_reference_id: userId || undefined,
      success_url: `${siteUrl()}/conta/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl()}/precos`,
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    console.error('[checkout] error:', e);
    return NextResponse.json({ error: 'Erro ao iniciar checkout' }, { status: 500 });
  }
}
