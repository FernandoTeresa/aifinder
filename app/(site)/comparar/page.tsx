'use client';
import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { models } from '@/lib/mockModels';

export default function CompararPage() {
  const search = useSearchParams();
  const ids = (search.get('ids') || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .slice(0, 3);
  const chosen = useMemo(() => models.filter(m => ids.includes(m.id)), [ids]);

  if (chosen.length === 0) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="text-2xl font-semibold mb-2">Comparar IAs</h1>
        <p className="opacity-70">
          Não recebemos IDs. Volta à Home e escolhe “Comparar”.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Comparação</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {chosen.map(m => (
          <article
            key={m.id}
            className="rounded-2xl border bg-white/70 p-4 backdrop-blur"
          >
            <h2 className="text-lg font-semibold">{m.name}</h2>
            <div className="text-xs opacity-60">
              {m.vendor} • {m.priceTier}
            </div>
            <ul className="mt-3 text-sm space-y-1">
              <li><b>Qualidade:</b> {m.quality}</li>
              <li><b>Match:</b> {m.match}</li>
              <li><b>Valor:</b> {m.value}</li>
              <li><b>Idiomas:</b> {m.langs.join(', ')}</li>
              <li><b>Casos de uso:</b> {m.useCases.join(', ')}</li>
            </ul>
            <a
              href={m.url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block rounded-xl border px-3 py-1.5 text-sm hover:bg-white/60"
            >
              Ir para o site
            </a>
          </article>
        ))}
      </div>
    </main>
  );
}
