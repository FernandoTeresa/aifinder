// app/api/stripe/webhook/route.ts
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
// import { supabaseAdmin } from '@/lib/supabaseAdmin'; // ativa quando quiseres gravar na DB

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature') as string | null;
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!whSecret) return NextResponse.json({ error: 'wh secret ausente' }, { status: 500 });
  if (!sig) return NextResponse.json({ error: 'assinatura ausente' }, { status: 400 });

  let event;
  try {
    // @ts-expect-error - Next 15: req.text() devolve raw body
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, whSecret);
  } catch (err: any) {
    console.error('[stripe] invalid signature', err?.message || err);
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const s = event.data.object as any;
        console.log('[webhook] checkout.session.completed', {
          session: s.id,
          customer: s.customer,
          customer_email: s.customer_details?.email,
          plan: s.mode,
        });
        // TODO: gravar/ligar cliente à tua DB (quando tiveres schema de "customers")
        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as any;
        console.log(`[webhook] ${event.type}`, {
          id: sub.id,
          status: sub.status,
          price: sub.items?.data?.[0]?.price?.id,
        });
        // TODO: atualizar estado de subscrição na tua DB
        break;
      }
      case 'invoice.payment_failed': {
        const inv = event.data.object as any;
        console.log('[webhook] invoice.payment_failed', inv.id);
        // TODO: notificar/utilizador
        break;
      }
      default:
        // evitar 500 em eventos que não tratamos
        console.log('[webhook] unhandled', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (e: any) {
    console.error('[webhook] handler error:', e);
    return NextResponse.json({ error: 'handler failure' }, { status: 500 });
  }
}
