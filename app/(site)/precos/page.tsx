
'use client';
import Pricing from '@/components/Pricing';

export default function PrecosPage() {
  const mockEmail = 'apoio@aifinder.com';
  const mockUserId = '00000000-0000-0000-0000-000000000000';
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="max-w-6xl mx-auto px-4 py-12">
        <header className="mb-8">
          <div className="inline-flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-[#0A2540] text-white grid place-items-center font-bold">AF</div>
            <div>
              <h1 className="text-3xl font-bold leading-tight">AI Finder — Planos</h1>
              <p className="text-sm opacity-70 -mt-0.5">Escolhe o plano certo para ti</p>
            </div>
          </div>
        </header>

        <div className="rounded-2xl border p-6 bg-white/70 backdrop-blur">
          <p className="opacity-80 mb-6">Método de pagamento: <strong>Cartão de crédito/débito</strong> via Stripe Checkout — com <strong>Apple Pay</strong> e <strong>Google Pay</strong> quando disponíveis no dispositivo/navegador. Futuro: <strong>MB Way</strong>.</p>
          <Pricing email={mockEmail} userId={mockUserId} />
          <p className="text-xs opacity-70 mt-3">* Limites a definir por ti. Podemos implementar fair‑use ou créditos.</p>
          <p className="text-xs opacity-70 mt-1">Método de pagamento: Cartão de crédito/débito via Stripe Checkout — com <strong>Apple Pay</strong> e <strong>Google Pay</strong> quando disponíveis no dispositivo/navegador. Futuro: <strong>MB Way</strong>.</p>
        </div>
      </section>
    </main>
  );
}
