'use client';

import { useEffect, useState } from 'react';

export default function ContaPage() {
  const [email, setEmail] = useState('');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function verificarConta() {
    if (!email) return;
    setLoading(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/account', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data?.error) {
        setStatusMsg(`❌ ${data.error}`);
      } else if (data?.portalUrl) {
        window.location.href = data.portalUrl;
      } else {
        setStatusMsg('✅ Subscrição criada/atualizada com sucesso.');
      }
    } catch (e) {
      console.error(e);
      setStatusMsg('⚠️ Erro ao contactar o servidor.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black px-4 py-24 text-slate-100">
      <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl shadow-[0_0_25px_rgba(56,189,248,0.1)]">
        <h1 className="text-3xl font-semibold text-white">A minha conta</h1>
        <p className="mt-2 text-sm text-white/60">
          Aqui vais gerir o teu plano, ver histórico e faturação.
        </p>

        {statusMsg && (
          <div
            className={`mt-6 rounded-xl border px-4 py-3 text-sm font-medium ${
              statusMsg.startsWith('✅')
                ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-300'
                : statusMsg.startsWith('❌')
                ? 'border-rose-400/40 bg-rose-500/10 text-rose-300'
                : 'border-amber-400/40 bg-amber-500/10 text-amber-300'
            }`}
          >
            {statusMsg}
          </div>
        )}

        <div className="mt-8 space-y-3">
          <label className="text-sm font-medium text-white/70">
            Email da subscrição (Stripe)
          </label>
          <input
            type="email"
            placeholder="o.teu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:border-cyan-400/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
          />
        </div>

        <button
          onClick={verificarConta}
          disabled={loading || !email}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40"
        >
          {loading ? 'A verificar...' : 'Abrir Portal do Cliente'}
        </button>

        <p className="mt-6 text-xs text-white/40 leading-relaxed">
          No Portal do Cliente podes atualizar método de pagamento, consultar
          faturas, alterar ou cancelar o plano. Apple Pay e Google Pay são
          suportados no checkout.
        </p>
      </div>
    </main>
  );
}
