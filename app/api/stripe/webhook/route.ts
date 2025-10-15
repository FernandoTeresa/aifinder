// app/api/stripe/webhook/route.ts
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export const runtime = 'nodejs'; // garante compatibilidade para streams/buffer

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) return NextResponse.json({ error: 'Missing STRIPE_WEBHOOK_SECRET' }, { status: 500 });

  const buf = Buffer.from(await req.arrayBuffer());

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        // @ts-ignore
        console.log('Checkout completed', event.data.object?.id, event.data.object?.metadata);
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        // @ts-ignore
        console.log('Subscription event', event.type, event.data.object?.id);
        break;
      default:
        console.log('Unhandled event type', event.type);
    }
  } catch (err) {
    console.error('Webhook handling error', err);
    return NextResponse.json({ received: true, ok: false }, { status: 500 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

// Precisamos do body cru para verificar a assinatura:
export const config = {
  api: {
    bodyParser: false,
  },
} as any;
