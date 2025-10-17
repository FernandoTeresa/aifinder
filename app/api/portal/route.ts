// app/api/portal/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';

type Body = { email?: unknown };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RETURN_PATH = '/conta';

function getBaseUrl() {
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

  const emailCandidate = body.email;
  if (typeof emailCandidate !== 'string') {
    return NextResponse.json({ error: 'Email é obrigatório.' }, { status: 400 });
  }

  const email = emailCandidate.trim().toLowerCase();
  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'Email inválido.' }, { status: 400 });
  }

  try {
    const { data: customers } = await stripe.customers.list({ email, limit: 1 });
    const customer = customers.at(0);

    if (!customer) {
      return NextResponse.json(
        { error: 'Cliente não encontrado no Stripe para esse email.' },
        { status: 404 },
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: buildAbsoluteUrl(getBaseUrl(), RETURN_PATH),
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    console.error('Stripe portal error:', err?.message || err);
    return NextResponse.json({ error: 'Erro ao criar sessão do Portal' }, { status: 500 });
  }
}
