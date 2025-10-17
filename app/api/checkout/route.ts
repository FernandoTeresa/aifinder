// app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';

type Plan = 'free' | 'standard' | 'premium';
type Body = { plan?: Plan; userId?: string };

export const runtime = 'nodejs';

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const h = headers();
  const proto = h.get('x-forwarded-proto') ?? 'http';
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000';
  return `${proto}://${host}`;
}

export async function POST(req: Request) {
  try {
    const { plan, userId }: Body = await req.json();

    if (!plan) return NextResponse.json({ error: 'Plano inválido.' }, { status: 400 });
    if (!process.env.STRIPE_SECRET_KEY)
      return NextResponse.json({ error: 'STRIPE_SECRET_KEY em falta.' }, { status: 500 });

    const siteUrl = getBaseUrl();

    if (plan === 'free') {
      return NextResponse.json({ url: `${siteUrl}/conta?status=success` });
    }

    const priceMap: Record<'standard' | 'premium', string> = {
      standard: process.env.STRIPE_PRICE_ID_STANDARD || '',
      premium: process.env.STRIPE_PRICE_ID_PREMIUM || '',
    };
    const priceId = priceMap[plan];
    if (!priceId)
      return NextResponse.json(
        { error: `Price ID em falta para o plano: ${plan}.` },
        { status: 500 },
      );

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],

      // Pagamentos (Apple/Google Pay surgem automaticamente no Checkout)
      payment_method_types: ['card'],
      allow_promotion_codes: true,

      // ❌ removido: customer_update (requer 'customer' explícito)
      billing_address_collection: 'auto',
      phone_number_collection: { enabled: false },

      success_url: `${siteUrl}/conta?status=success`,
      cancel_url: `${siteUrl}/precos?status=cancelled`,

      metadata: { plan, userId: userId || '', app: 'aifinder' },
    });

    if (!session?.url) return NextResponse.json({ error: 'Sessão criada sem URL.' }, { status: 500 });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    const msg = err?.raw?.message || err?.message || String(err);
    console.error('[checkout] error:', err);
    return NextResponse.json({ error: `Erro Stripe: ${msg}` }, { status: 500 });
  }
}