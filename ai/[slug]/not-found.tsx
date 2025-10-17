// app/ia/[slug]/not-found.tsx
import Link from 'next/link';

export default function NotFoundIa() {
  return (
    <main className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_15%_-20%,rgba(56,189,248,0.18),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(120%_120%_at_85%_0%,rgba(129,140,248,0.14),transparent_55%)]" />
      <h1 className="text-3xl font-semibold text-white">Modelo não encontrado</h1>
      <p className="mt-2 text-sm text-white/60">
        Verifica o endereço ou volta ao catálogo.
      </p>
      <div className="mt-6">
        <Link
          href="/"
          className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          Página inicial
        </Link>
      </div>
    </main>
  );
}