const highlights = [
  'Stripe Climate Partner',
  'Infra na UE · ISO 27001',
  'Sem tracking 3rd-party',
  'Suporte < 24h · Equipa híbrida',
] as const;

export default function TrustBar() {
  return (
    <div className="relative z-10 mx-auto max-w-6xl px-4 pb-12 pt-6">
      <div className="rounded-[2.25rem] border border-white/10 bg-white/[0.05] px-6 py-5 backdrop-blur-xl">
        <div className="text-center text-[11px] uppercase tracking-[0.35em] text-white/40">Confiança e segurança</div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-white/60">
          {highlights.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 font-medium text-white/70 transition hover:border-white/25 hover:text-white"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
