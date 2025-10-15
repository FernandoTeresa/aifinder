'use client';
import { useState } from 'react';

export default function ContaPage() {
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState('cus_TESTE123'); // TODO: preencher a partir do teu auth/DB

  async function openPortal() {
    try {
      setLoading(true);
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || 'Erro a abrir portal');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-1">A minha conta</h1>
      <p className="text-sm opacity-70 mb-6">Gerir plano, histórico e faturação.</p>

      <div className="rounded-2xl border p-4 bg-white/70 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm opacity-70">Cliente Stripe</div>
            <div className="font-mono text-sm">{customerId || '—'}</div>
          </div>
          <button onClick={openPortal}
            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
            disabled={loading || !customerId}>
            {loading ? 'A abrir…' : 'Abrir Portal de Faturação'}
          </button>
        </div>
      </div>
    </main>
  );
}
