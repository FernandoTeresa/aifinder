import { models } from '@/lib/mockModels';
import Link from 'next/link';

export default function IaDetail({ params }: { params: { id: string } }) {
  const m = models.find(x => x.id === params.id);
  if (!m) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="text-2xl font-semibold">IA não encontrada</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <Link href="/" className="text-sm underline opacity-70">
        ← Voltar
      </Link>
      <h1 className="mt-2 text-3xl font-semibold">{m.name}</h1>
      <div className="opacity-70 text-sm">{m.vendor} • {m.priceTier}</div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border bg-white/70 p-4 backdrop-blur">
          <h2 className="font-semibold">Pontuações</h2>
          <ul className="mt-2 text-sm space-y-1">
            <li>Qualidade: {m.quality}</li>
            <li>Match: {m.match}</li>
            <li>Valor: {m.value}</li>
            <li>Idiomas: {m.langs.join(', ')}</li>
            <li>Casos de uso: {m.useCases.join(', ')}</li>
          </ul>
        </section>

        <section className="rounded-2xl border bg-white/70 p-4 backdrop-blur">
          <h2 className="font-semibold">Ação</h2>
          <a
            href={m.url}
            target="_blank"
            className="mt-2 inline-block rounded-xl border px-3 py-1.5 text-sm hover:bg-white/60"
          >
            Ir para o site
          </a>
          <a
            href={`/comparar?ids=${m.id}`}
            className="ml-2 inline-block rounded-xl border px-3 py-1.5 text-sm hover:bg-white/60"
          >
            Comparar
          </a>
        </section>
      </div>
    </main>
  );
}
