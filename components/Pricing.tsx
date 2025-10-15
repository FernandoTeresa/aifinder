
'use client';
import { useState } from 'react';

export default function Pricing({ email, userId }: { email: string; userId: string }) {
  const [loading, setLoading] = useState<string | null>(null);
  async function subscribe(plan: 'standard'|'premium') {
    setLoading(plan);
    const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan, email, userId }) });
    const data = await res.json();
    setLoading(null);
    if (data.url) window.location.href = data.url;
    else alert(data.error || 'Erro no checkout');
  }
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="rounded-2xl p-6 border shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-1">Free</h2>
        <div className="text-3xl font-bold mb-2">0€<span className="text-sm font-medium opacity-60"> /mês</span></div>
        <p className="text-sm opacity-80 mb-4">Pesquisas ilimitadas · sem uso direto</p>
        <ul className="text-sm space-y-2 mb-6 opacity-90 list-disc ml-5">
          <li>Pesquisa e ranking</li>
          <li>Comparações básicas</li>
          <li>Favoritos (até 5)</li>
        </ul>
        <button className="w-full rounded-xl border py-2.5 text-sm font-medium">Criar conta</button>
      </div>

      <div className="rounded-2xl p-6 border shadow-sm bg-white">
        <div className="flex items-center gap-2 mb-1"><span className="text-xs px-2 py-0.5 rounded-full border">⭐ Standard</span></div>
        <div className="text-3xl font-bold mb-2">9,90€ <span className="text-sm font-medium opacity-60"> /mês</span></div>
        <p className="text-sm opacity-80 mb-4">Até 100 execuções/mês</p>
        <ul className="text-sm space-y-2 mb-6 opacity-90 list-disc ml-5">
          <li>Comparações detalhadas</li>
          <li>Usar IAs via link</li>
          <li>Favoritos até 100</li>
          <li>Exportação simples (CSV)</li>
        </ul>
        <button className="w-full rounded-xl border py-2.5 text-sm font-medium" onClick={()=>subscribe('standard')}>
          {loading==='standard'?'Aguarda…':'Subscrever Standard (Cartão / Apple Pay / Google Pay)'}
        </button>
      </div>

      <div className="rounded-2xl p-6 border shadow-sm bg-white">
        <div className="flex items-center gap-2 mb-1"><span className="text-xs px-2 py-0.5 rounded-full border">👑 Premium</span></div>
        <div className="text-3xl font-bold mb-2">19,90€ <span className="text-sm font-medium opacity-60"> /mês</span></div>
        <p className="text-sm opacity-80 mb-4">Ilimitado (fair‑use)</p>
        <ul className="text-sm space-y-2 mb-6 opacity-90 list-disc ml-5">
          <li>Histórico e relatórios</li>
          <li>Export CSV/JSON avançado</li>
          <li>Alertas de variação de preços</li>
          <li>Suporte prioritário</li>
        </ul>
        <button className="w-full rounded-xl border py-2.5 text-sm font-medium" onClick={()=>subscribe('premium')}>
          {loading==='premium'?'Aguarda…':'Subscrever Premium (Cartão / Apple Pay / Google Pay)'}
        </button>
      </div>
    </div>
  );
}
