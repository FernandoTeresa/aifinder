'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type Account = {
  stripe_customer_id: string;
  email: string | null;
  stripe_subscription_id: string | null;
  status: string | null;
  plan: string | null;
  price_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean | null;
  canceled_at: string | null;
  updated_at: string | null;
};

export default function ContaPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [acc, setAcc] = useState<Account | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Se vier de success no checkout, apenas mostra “OK”
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const u = new URL(window.location.href);
    if (u.searchParams.get('status') === 'success') {
      toast.success('Subscrição criada/atualizada com sucesso.');
    }
  }, []);

  async function loadByEmail(e?: React.FormEvent) {
    e?.preventDefault();
    if (!email) {
      toast.warning('Indica um email');
      return;
    }
    try {
      setLoading(true);
      setNotFound(false);
      setAcc(null);
      const res = await fetch(`/api/account?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Erro');
      if (!data?.found) {
        setNotFound(true);
        return;
      }
      setAcc(data.account as Account);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Falha ao carregar a conta');
    } finally {
      setLoading(false);
    }
  }

  async function openPortal() {
    if (!acc?.stripe_customer_id) return;
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ customerId: acc.stripe_customer_id }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error(data?.error || 'Não foi possível abrir o Portal do Cliente');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Erro inesperado');
    }
  }

  return (
    <main className="relative z-10 mx-auto max-w-4xl px-4 pb-20 pt-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_10%_-20%,rgba(56,189,248,0.14),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(120%_120%_at_90%_0%,rgba(129,140,248,0.12),transparent_50%)]" />

      <h1 className="text-3xl font-semibold text-white">A minha conta</h1>
      <p className="mt-2 text-sm text-white/60">
        Aqui vais gerir o teu plano, ver histórico e faturação.
      </p>

      {/* Busca por email */}
      <form onSubmit={loadByEmail} className="mt-6 flex flex-wrap items-end gap-3">
        <label className="text-sm text-white/80">
          Email da subscrição (Stripe)
          <input
            type="email"
            className="mt-1 block w-72 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="o.teu@email.com"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'A carregar…' : 'Ver estado'}
        </button>
      </form>

      {/* Cartão de estado */}
      <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        {!acc && !notFound && (
          <p className="text-sm text-white/60">
            Introduz o email usado no checkout para veres o estado da tua subscrição.
          </p>
        )}

        {notFound && (
          <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-200">
            Cliente não encontrado no Stripe para esse email.
          </div>
        )}

        {acc && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm text-white/60">Email</div>
                <div className="text-white">{acc.email || '—'}</div>
              </div>
              <div>
                <div className="text-sm text-white/60">Plano</div>
                <div className="text-white font-medium capitalize">
                  {acc.plan || '—'} {acc.status ? `· ${acc.status}` : ''}
                </div>
              </div>
              <div>
                <div className="text-sm text-white/60">Período</div>
                <div className="text-white">
                  {acc.current_period_start
                    ? new Date(acc.current_period_start).toLocaleDateString()
                    : '—'}{' '}
                  →{' '}
                  {acc.current_period_end
                    ? new Date(acc.current_period_end).toLocaleDateString()
                    : '—'}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-white/50">
                No Portal do Cliente podes atualizar método de pagamento, consultar faturas,
                alterar ou cancelar o plano.
              </div>
              <button
                onClick={openPortal}
                disabled={!acc.stripe_customer_id}
                className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white hover:border-white/20 hover:bg-white/15 disabled:opacity-50"
              >
                Abrir Portal do Cliente
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
