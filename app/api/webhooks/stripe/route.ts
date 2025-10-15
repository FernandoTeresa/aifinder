
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return new NextResponse("Bad signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        // TODO: Upsert na BD (Supabase) para ativar plano e guardar current_period_end
        break;
      }
      case "invoice.paid": {
        // TODO: atualizar período e reset de contadores se necessário
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        // TODO: refletir alterações/cancelamentos
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.error(e);
  }

  return NextResponse.json({ received: true });
}
