import Stripe from 'stripe';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { customerId, return_url } = await req.json();
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Missing STRIPE_SECRET_KEY' }, { status: 500 });
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: return_url || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000/conta',
    });

    return NextResponse.json({ url: session.url });
  } catch (err:any) {
    return NextResponse.json({ error: err.message || 'Portal error' }, { status: 500 });
  }
}
