import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
        404
      </span>
      <h1 className="text-3xl font-semibold text-white">Página não encontrada</h1>
      <p className="text-sm text-white/60">
        O caminho que procuras não existe. Regressa ao início e continua a explorar novas IAs.
      </p>
      <Link
        className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/20"
        href="/"
      >
        Voltar à página inicial
      </Link>
    </main>
  );
}
