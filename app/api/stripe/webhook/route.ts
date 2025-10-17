// app/api/stripe/webhook/route.ts
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import type Stripe from 'stripe';

export const runtime = 'nodejs'; // garante Buffer/streams em App Router

/** ──────────────────────────────────────────────────────────────────────────
 * Helpers
 * ────────────────────────────────────────────────────────────────────────── */

async function upsertCustomer(email?: string | null, stripeCustomerId?: string | null) {
  if (!stripeCustomerId) return;

  // Se não recebemos email na sessão, tentamos obter do Stripe
  let finalEmail = email ?? null;
  if (!finalEmail) {
    const cust = await stripe.customers.retrieve(stripeCustomerId);
    if (cust && !('deleted' in cust)) {
      finalEmail = (cust.email as string) ?? null;
    }
  }

  await supabaseAdmin
    .from('customers')
    .upsert(
      {
        stripe_customer_id: stripeCustomerId,
        // se for null, não envia — evita violar unique se não houver email
        email: finalEmail ?? undefined,
      },
      { onConflict: 'stripe_customer_id' }
    );
}

function inferPlanFromSubscription(sub: Stripe.Subscription, planFromMeta?: string | null) {
  // prioridade: metadados do checkout
  if (planFromMeta) return planFromMeta;

  // tenta a "nickname" do preço (ex.: "standard", "premium")
  const nick = sub.items?.data?.[0]?.price?.nickname;
  if (nick && typeof nick === 'string') return nick.toLowerCase();

  // fallback para o id do price (ex.: price_123)
  const priceId = sub.items?.data?.[0]?.price?.id;
  if (priceId && typeof priceId === 'string') return priceId;

  return null;
}

async function upsertSubscription(sub: Stripe.Subscription, planFromMeta?: string | null) {
  const stripeSubId = sub.id;
  const customerId = sub.customer as string;
  const status = sub.status;
  const periodEnd = sub.current_period_end
    ? new Date(sub.current_period_end * 1000).toISOString()
    : null;

  const plan = inferPlanFromSubscription(sub, planFromMeta);

  await supabaseAdmin
    .from('subscriptions')
    .upsert(
      {
        id: stripeSubId,
        customer_id: customerId,
        plan: plan ?? undefined,
        status,
        current_period_end: periodEnd,
      },
      { onConflict: 'id' }
    );
}

/** ──────────────────────────────────────────────────────────────────────────
 * Webhook handler
 * ────────────────────────────────────────────────────────────────────────── */

export async function POST(req: Request) {
  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json({ error: 'Missing STRIPE_WEBHOOK_SECRET' }, { status: 500 });
    }

    // ⚠️ ler raw body (necessário para validar a assinatura)
    const raw = Buffer.from(await req.arrayBuffer());
    const event = stripe.webhooks.constructEvent(raw, signature, webhookSecret);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        const customerId = session.customer as string | null;
        const email =
          session.customer_email ||
          (session.metadata?.email as string | undefined) ||
          null;

        // 1) guarda/atualiza o customer
        await upsertCustomer(email, customerId);

        // 2) se houve subscrição, guarda/atualiza também
        if (session.subscription) {
          const sub = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          const planFromMeta = (session.metadata?.plan as string | undefined) || null;
          await upsertSubscription(sub, planFromMeta);
        }

        console.log('[stripe] checkout.session.completed', {
          customerId,
          email,
          subscription: session.subscription,
          plan: session.metadata?.plan,
        });
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;

        // tenta garantir o customer em DB (email pode vir noutro evento)
        await upsertCustomer(undefined, sub.customer as string);

        // guarda/atualiza a subscrição
        await upsertSubscription(sub, null);

        console.log(`[stripe] ${event.type}`, {
          subscription: sub.id,
          customer: sub.customer,
          status: sub.status,
        });
        break;
      }

      default: {
        // Não tratados — regista só para referência
        console.log('[stripe] unhandled event:', event.type);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    // Logs úteis — mas sem expor conteúdo sensível em produção
    console.error('stripe webhook error:', err?.message || err);
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }
}
