// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_15%_-20%,rgba(56,189,248,0.18),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(120%_120%_at_85%_0%,rgba(129,140,248,0.14),transparent_55%)]" />

      <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
          404
        </div>
        <h1 className="mt-5 text-3xl font-semibold text-white">Página não encontrada</h1>
        <p className="mt-3 text-sm text-white/60">
          O caminho que procuras não existe. Regressa ao início ou explora novos modelos.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Página inicial
          </Link>
          <Link
            href="/precos"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:border-white/20 hover:bg-white/10"
          >
            Ver planos
          </Link>
        </div>
      </div>
    </main>
  );
}
