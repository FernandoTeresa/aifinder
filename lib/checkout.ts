// lib/checkout.ts
export type PlanKey = 'free' | 'standard' | 'premium';

export async function startCheckout(plan: PlanKey, extra?: Record<string, string>) {
  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ plan, ...extra }),
    });
    const data = await res.json();

    if (data?.url) {
      window.location.href = data.url; // Stripe Checkout
      return;
    }
    alert(data?.error || 'Erro ao iniciar checkout');
  } catch (e) {
    console.error(e);
    alert('Erro inesperado ao iniciar checkout.');
  }
}