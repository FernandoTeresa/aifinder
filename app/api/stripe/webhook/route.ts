// app/api/stripe/webhook/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import type Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs'; // precisamos de Buffer/streams

// ——— Helpers ————————————————————————————————————————————————————————————————

async function upsertCustomer({
  stripeCustomerId,
  email,
}: {
  stripeCustomerId: string;
  email?: string | null;
}) {
  // email é útil para reconciliar; se não houver, mantém o que existir
  const { error } = await supabaseAdmin
    .from('customers')
    .upsert(
      {
        stripe_customer_id: stripeCustomerId,
        email: email ?? null,
      },
      { onConflict: 'stripe_customer_id' }
    );

  if (error) {
    console.error('[webhook] upsertCustomer error:', error);
    throw error;
  }
}

function toDate(ts?: number | null) {
  return ts ? new Date(ts * 1000).toISOString() : null;
}

async function upsertSubscription(sub: Stripe.Subscription) {
  const stripe_subscription_id = sub.id;
  const stripe_customer_id =
    typeof sub.customer === 'string' ? sub.customer : sub.customer?.id || null;
  const price_id =
    (sub.items.data[0]?.price?.id as string | undefined) ?? null;

  const plan =
    (sub.items.data[0]?.price?.nickname as string | undefined) ||
    (sub.items.data[0]?.price?.metadata?.plan as string | undefined) ||
    (sub.metadata?.plan as string | undefined) ||
    null;

  const payload = {
    stripe_subscription_id,
    stripe_customer_id,
    price_id,
    status: sub.status,
    current_period_start: toDate(sub.current_period_start),
    current_period_end: toDate(sub.current_period_end),
    cancel_at_period_end: sub.cancel_at_period_end ?? false,
    canceled_at: toDate(sub.canceled_at),
    plan,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .upsert(payload, { onConflict: 'stripe_subscription_id' });

  if (error) {
    console.error('[webhook] upsertSubscription error:', error);
    throw error;
  }
}

async function flagInvoice(customerId: string, lastInvoiceStatus: 'paid' | 'failed') {
  // Campos opcionais na tabela customers (se existirem):
  //   - last_invoice_status text
  //   - last_invoice_at timestamptz
  const { error } = await supabaseAdmin
    .from('customers')
    .update({
      last_invoice_status: lastInvoiceStatus,
      last_invoice_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customerId);

  if (error) {
    // não falhar por causa disto; só log
    console.warn('[webhook] flagInvoice warn:', error.message);
  }
}

// ——— Webhook handler ————————————————————————————————————————————————

export async function POST(req: Request) {
  const sig = headers().get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET missing');
    return NextResponse.json(
      { error: 'Webhook desconfigurado' },
      { status: 500 }
    );
  }
  if (!sig) {
    return NextResponse.json({ error: 'Assinatura em falta' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    // ⚠️ Stripe exige RAW body (string), não JSON já parseado
    const raw = await req.text();
    event = stripe.webhooks.constructEvent(raw, sig, webhookSecret);
  } catch (err: any) {
    console.error('[webhook] constructEvent error:', err?.message || err);
    return NextResponse.json({ error: 'Assinatura inválida' }, { status: 400 });
  }

  try {
    switch (event.type) {
      // ——— Sessão concluída (checkout) ———
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        const customerId =
          (session.customer as string) ||
          (session.customer_details?.customer as string) ||
          '';

        // email fornecido pelo cliente no Checkout
        const email =
          session.customer_details?.email ||
          (session.customer_email as string | undefined) ||
          null;

        if (customerId) {
          await upsertCustomer({ stripeCustomerId: customerId, email });
        }

        // Se já houver subs attachada à sessão, faz upsert
        if (session.subscription) {
          const subscriptionId =
            typeof session.subscription === 'string'
              ? session.subscription
              : (session.subscription as any)?.id;

          if (subscriptionId) {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            await upsertSubscription(subscription);
          }
        }

        break;
      }

      // ——— Subscription lifecycle ———
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        // garantir customer registado
        const custId =
          typeof subscription.customer === 'string'
            ? subscription.customer
            : subscription.customer?.id || '';
        if (custId) {
          // tentar obter email do customer (pode não existir)
          let email: string | undefined;
          try {
            const c = await stripe.customers.retrieve(custId);
            if (!('deleted' in c) && c.email) email = c.email;
          } catch {
            // ignore
          }
          await upsertCustomer({ stripeCustomerId: custId, email });
        }

        await upsertSubscription(subscription);
        break;
      }

      // ——— Invoices (opcional, mas útil para sinalizar estado de cobrança) ———
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        const custId =
          typeof invoice.customer === 'string'
            ? invoice.customer
            : invoice.customer?.id || '';
        if (custId) await flagInvoice(custId, 'paid');
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const custId =
          typeof invoice.customer === 'string'
            ? invoice.customer
            : invoice.customer?.id || '';
        if (custId) await flagInvoice(custId, 'failed');
        break;
      }

      default: {
        // Outros eventos são ignorados de propósito
        // console.log('[webhook] unhandled event:', event.type);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error(`[webhook] handler error (${event.type}):`, err?.message || err);
    // 2xx faz o Stripe considerar “entregue”; como é erro nosso, devolvemos 500 para re-try
    return NextResponse.json({ error: 'Erro no processamento' }, { status: 500 });
  }
}
