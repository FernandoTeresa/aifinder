
// app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const { plan } = await req.json();

    // Mapear o plano para o preço do Stripe
    // Preenche estes IDs com os teus Price IDs do Stripe
    const priceMap: Record<string, string> = {
      free: process.env.STRIPE_PRICE_ID_FREE || '',
      standard: process.env.STRIPE_PRICE_ID_STANDARD || '',
      premium: process.env.STRIPE_PRICE_ID_PREMIUM || '',
    };

    if (!plan || !priceMap[plan]) {
      return NextResponse.json({ error: 'Plano inválido' }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: plan === 'free' ? 'setup' : 'subscription',
      allow_promotion_codes: true,
      // Para Apple Pay/Google Pay basta "card"; Checkout ativa carteiras suportadas.
      payment_method_types: ['card'],
      // Preferência de moeda (alinha com os teus prices)
      currency: 'eur',
      line_items: plan === 'free'
        ? [] // plano free não cobra — podemos capturar email e guardar no teu DB mais tarde
        : [{ price: priceMap[plan], quantity: 1 }],
      success_url: `${siteUrl}/conta?status=success`,
      cancel_url: `${siteUrl}/precos?status=cancelled`,
      metadata: {
        plan,
      },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: 'Erro ao criar sessão de checkout' }, { status: 500 });
  }
}