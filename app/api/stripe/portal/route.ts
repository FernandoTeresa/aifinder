// app/api/stripe/portal/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';

export const runtime = 'nodejs';

function baseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const h = headers();
  const proto = h.get('x-forwarded-proto') ?? 'http';
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000';
  return `${proto}://${host}`;
}

export async function POST(req: Request) {
  try {
    const { customerId } = await req.json();
    if (!customerId) {
      return NextResponse.json({ error: 'customerId em falta' }, { status: 400 });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${baseUrl()}/conta`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('[portal] error:', err?.message || err);
    return NextResponse.json({ error: 'Falha ao abrir Portal do Cliente' }, { status: 500 });
  }
}
