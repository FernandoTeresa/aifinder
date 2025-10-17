// app/ia/[slug]/loading.tsx
export default function LoadingIa() {
  return (
    <main className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-20">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_10%_-20%,rgba(56,189,248,0.14),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(120%_120%_at_90%_0%,rgba(129,140,248,0.12),transparent_50%)]" />
      <div className="h-28 w-full animate-pulse rounded-2xl border border-white/10 bg-white/5" />
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
        ))}
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <div className="h-48 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
        <div className="h-48 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
      </div>
    </main>
  );
}
