// app/api/stripe/portal/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';

type Body = { customerId?: unknown };

const CUSTOMER_ID_REGEX = /^cus_[A-Za-z0-9]+$/;
const RETURN_PATH = '/conta';

export const runtime = 'nodejs';

function baseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  try {
    const h = headers();
    const proto = h.get('x-forwarded-proto') ?? 'http';
    const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000';
    return `${proto}://${host}`;
  } catch {
    return 'http://localhost:3000';
  }
}

function buildAbsoluteUrl(origin: string, path: string) {
  return new URL(path, origin).toString();
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido.' }, { status: 400 });
  }

  const rawCustomerId = body.customerId;
  if (typeof rawCustomerId !== 'string') {
    return NextResponse.json({ error: 'customerId em falta' }, { status: 400 });
  }

  const customerId = rawCustomerId.trim();
  if (!CUSTOMER_ID_REGEX.test(customerId)) {
    return NextResponse.json({ error: 'customerId inválido' }, { status: 400 });
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: buildAbsoluteUrl(baseUrl(), RETURN_PATH),
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('[portal] error:', err?.message || err);
    return NextResponse.json({ error: 'Falha ao abrir Portal do Cliente' }, { status: 500 });
  }
}
