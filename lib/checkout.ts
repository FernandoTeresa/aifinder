// lib/checkout.ts
export type PlanKey = 'free' | 'standard' | 'premium';

/**
 * Inicia o checkout no backend e redireciona para o Stripe.
 * Devolve { ok: true } se obteve URL e iniciou o redirecionamento.
 * Lança erro com mensagem amigável em caso de falha.
 */
export async function startCheckout(plan: PlanKey, extra?: Record<string, string>) {
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ plan, ...extra }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || 'Erro ao iniciar checkout');
  }

  if (data?.url) {
    // redireciona imediatamente
    window.location.href = data.url as string;
    return { ok: true };
  }

  throw new Error('Sessão de checkout criada sem URL.');
}
