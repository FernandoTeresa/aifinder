'use client';
import { useMemo } from 'react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { models } from '@/lib/mockModels';

export default function FavoritosPage() {
  const [favorites] = useLocalStorage<string[]>('af_favs', []);
  const favModels = useMemo(() => models.filter(m => favorites.includes(m.id)), [favorites]);

  function exportCSV() {
    const headers = ['Modelo', 'Fornecedor', 'Preço'];
    const rows = favModels.map(m => [m.name, m.vendor, m.priceTier].join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'favoritos_aifinder.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-4 flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Favoritos</h1>
        <button
          onClick={exportCSV}
          className="rounded-xl border px-3 py-1.5 text-sm hover:bg-white/60"
        >
          Exportar CSV
        </button>
      </div>
      {favModels.length === 0 ? (
        <p className="opacity-70">
          Ainda não tens favoritos. Marca na tabela (estrela).
        </p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {favModels.map(m => (
            <article
              key={m.id}
              className="rounded-2xl border bg-white/70 p-4 backdrop-blur"
            >
              <h2 className="text-lg font-semibold">{m.name}</h2>
              <div className="text-xs opacity-60">
                {m.vendor} • {m.priceTier}
              </div>
              <div className="mt-2 text-sm opacity-80">
                {m.useCases.join(', ')}
              </div>
              <a
                href={`/comparar?ids=${m.id}`}
                className="mt-3 inline-block rounded-xl border px-3 py-1.5 text-sm hover:bg-white/60"
              >
                Comparar
              </a>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
