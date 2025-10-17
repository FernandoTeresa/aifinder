// app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';

type Body = {
  plan?: 'free' | 'standard' | 'premium';
  // email?: string; // <<< NÃO vamos usar para prefill, para não bloquear o campo no checkout
  userId?: string;
};

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

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'STRIPE_SECRET_KEY em falta.' }, { status: 500 });
    }
    if (!plan) {
      return NextResponse.json({ error: 'Plano inválido.' }, { status: 400 });
    }

    const siteUrl = getBaseUrl();

    if (plan === 'free') {
      // Sem cobrança; podes trocar para mode 'setup' se quiseres recolher método
      return NextResponse.json({ url: `${siteUrl}/conta?status=success` }, { status: 200 });
    }

    const priceMap: Record<'standard' | 'premium', string> = {
      standard: process.env.STRIPE_PRICE_ID_STANDARD || '',
      premium: process.env.STRIPE_PRICE_ID_PREMIUM || '',
    };
    const priceId = priceMap[plan];
    if (!priceId) {
      return NextResponse.json(
        { error: `STRIPE_PRICE_ID_${plan.toUpperCase()} em falta.` },
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'], // Apple Pay/Google Pay via Checkout
      allow_promotion_codes: true,

      // 👇 NÃO definir customer nem customer_email → Stripe mostra o campo "Email" ao cliente
      // customer_email: undefined,
      // customer: undefined,

      // opcional, mas ajuda a criar o Customer e atualizar dados
      customer_creation: 'always',
      customer_update: { name: 'auto', address: 'auto', shipping: 'auto' },
      billing_address_collection: 'auto',
      phone_number_collection: { enabled: false },

      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/conta?status=success`,
      cancel_url: `${siteUrl}/precos?status=cancelled`,
      metadata: { plan, userId: userId || '' },
    });

    if (!session?.url) {
      return NextResponse.json({ error: 'Sessão criada sem URL.' }, { status: 500 });
    }
    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    const details = err?.raw?.message || err?.message || String(err);
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: `Erro Stripe: ${details}` }, { status: 500 });
  }
}
