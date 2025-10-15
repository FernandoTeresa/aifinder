import EnhancedPricing from '@/components/EnhancedPricing';

const highlights = [
  'Cancelamento simples, sem fidelização',
  'Pagamentos com Stripe · Apple Pay · Google Pay',
  'Suporte humano a partir de Standard',
] as const;

export default function PricingPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_10%_-20%,rgba(56,189,248,0.15),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(120%_120%_at_90%_0%,rgba(129,140,248,0.12),transparent_50%)]" />

      <section className="mx-auto max-w-5xl px-4 pb-10 pt-28 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-white/60">
          Pricing
        </span>
        <h1 className="mt-6 text-4xl font-semibold text-white sm:text-5xl">Planos para acelerar a adoção de IA</h1>
        <p className="mt-4 text-sm text-white/60 sm:text-base">
          Escolhe a camada que melhor combina com o teu momento: do primeiro teste ao rollout em equipa.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-white/65">
          {highlights.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-medium text-white/70"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      <EnhancedPricing />
    </main>
  );
}
