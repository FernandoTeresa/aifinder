// app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';

type Plan = 'free' | 'standard' | 'premium';
type PaidPlan = Extract<Plan, 'standard' | 'premium'>;
type Body = { plan?: unknown; userId?: unknown };

const ALLOWED_PLANS: ReadonlySet<Plan> = new Set<Plan>(['free', 'standard', 'premium']);
const PRICE_IDS: Record<PaidPlan, string | undefined> = {
  standard: process.env.STRIPE_PRICE_ID_STANDARD,
  premium: process.env.STRIPE_PRICE_ID_PREMIUM,
};
const SUCCESS_PATH = '/conta?status=success';
const CANCEL_PATH = '/precos?status=cancelled';

export const runtime = 'nodejs';

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

  const planCandidate = body.plan;
  const rawUserId = body.userId;

  if (typeof planCandidate !== 'string' || !ALLOWED_PLANS.has(planCandidate as Plan)) {
    return NextResponse.json({ error: 'Plano inválido.' }, { status: 400 });
  }

  const plan = planCandidate as Plan;
  let userId: string | undefined;
  if (typeof rawUserId !== 'undefined') {
    if (typeof rawUserId !== 'string') {
      return NextResponse.json({ error: 'ID de utilizador inválido.' }, { status: 400 });
    }
    const trimmed = rawUserId.trim();
    if (trimmed) {
      if (!/^[A-Za-z0-9_-]{2,64}$/.test(trimmed)) {
        return NextResponse.json({ error: 'ID de utilizador inválido.' }, { status: 400 });
      }
      userId = trimmed;
    }
  }

  const siteUrl = getBaseUrl();

  if (plan === 'free') {
    return NextResponse.json({ url: buildAbsoluteUrl(siteUrl, SUCCESS_PATH) });
  }

  const priceId = PRICE_IDS[plan as PaidPlan];
  if (!priceId) {
    return NextResponse.json(
      { error: `Price ID em falta para o plano: ${plan}.` },
      { status: 500 },
    );
  }

  try {
    const metadata: Record<string, string> = { plan, app: 'aifinder' };
    if (userId) metadata.userId = userId;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      payment_method_types: ['card'],
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      phone_number_collection: { enabled: false },
      success_url: buildAbsoluteUrl(siteUrl, SUCCESS_PATH),
      cancel_url: buildAbsoluteUrl(siteUrl, CANCEL_PATH),
      metadata,
      ...(userId ? { client_reference_id: userId } : {}),
    });

    if (!session?.url) {
      return NextResponse.json({ error: 'Sessão criada sem URL.' }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    const msg = err?.raw?.message || err?.message || String(err);
    console.error('[checkout] error:', err);
    return NextResponse.json({ error: `Erro Stripe: ${msg}` }, { status: 500 });
  }
}
