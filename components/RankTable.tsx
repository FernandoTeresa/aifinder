'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import FavoriteToggle from '@/components/FavoriteToggle';

type Tool = {
  id: string;
  name: string;
  slug?: string | null;
  provider?: string | null;
  tier?: string | null;
  quality?: number | null;
  match?: number | null;
  value?: number | null;
};

export default function RankTable() {
  const [items, setItems] = useState<Tool[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setItems(null);
        const res = await fetch('/api/ai?limit=50', { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Falha ao carregar IA');
        if (!cancelled) setItems(Array.isArray(data) ? data : data.items || []);
      } catch (e: any) {
        if (!cancelled) {
          setItems([]);
          toast.error(e?.message || 'Erro ao carregar catálogo');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="lista" className="relative z-10 mx-auto max-w-6xl px-4 pb-24">
      {/* cabeçalho da tabela */}
      <div className="mb-3 grid items-center gap-3 px-2 text-xs uppercase tracking-wide text-white/40 md:grid-cols-[1.6fr_1fr_1fr_1fr_auto]">
        <div>Modelo</div>
        <div>Qualidade</div>
        <div>Match</div>
        <div>Valor</div>
        <div className="text-right">Ação</div>
      </div>

      {/* skeletons */}
      {!items && (
        <ul>
          {Array.from({ length: 6 }).map((_, i) => (
            <RowSkeleton key={i} />
          ))}
        </ul>
      )}

      {/* lista */}
      {items && (
        <ul>
          {items.length === 0 ? (
            <li className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/60 backdrop-blur-xl">
              Sem resultados. Adiciona IAs em <code className="text-white/80">/admin</code>.
            </li>
          ) : (
            items.map((m) => (
              <li
                key={m.id}
                className="mb-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/10"
              >
                <div className="grid items-center gap-3 md:grid-cols-[1.6fr_1fr_1fr_1fr_auto]">
                  {/* Modelo */}
                  <div className="min-w-0">
                    {m.slug ? (
                      <Link
                        href={`/ia/${m.slug}`}
                        className="truncate font-medium text-white hover:underline"
                      >
                        {m.name}
                      </Link>
                    ) : (
                      <span className="truncate font-medium text-white">{m.name}</span>
                    )}
                    <p className="text-xs text-white/50">
                      {(m.provider || '—')} · {(m.tier || '—')}
                    </p>
                  </div>

                  {/* métricas */}
                  <Meter label="Qualidade" value={m.quality ?? 0} color="bg-cyan-400/80" />
                  <Meter label="Match" value={m.match ?? 0} color="bg-blue-400/80" />
                  <Meter label="Valor" value={m.value ?? 0} color="bg-emerald-400/80" />

                  {/* ações */}
                  <div className="flex items-center justify-end gap-2">
                    <FavoriteToggle id={m.id} />
                    {m.slug ? (
                      <Link href={`/ia/${m.slug}`} className="btn-glow px-3 py-1.5 text-sm">
                        Abrir
                      </Link>
                    ) : (
                      <button className="btn-glow cursor-not-allowed px-3 py-1.5 text-sm opacity-60">
                        Abrir
                      </button>
                    )}
                    <button
                      className="btn-glow px-3 py-1.5 text-sm"
                      onClick={() => toast.info(`Comparação iniciada: ${m.name}`)}
                    >
                      Comparar
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </section>
  );
}

/* ---------- componentes auxiliares ---------- */

function Meter({ label, value, color }: { label: string; value: number; color: string }) {
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div>
      <div className="mb-1 text-xs text-white/50">{label}</div>
      <div className="h-1.5 w-full rounded-full bg-white/10">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function RowSkeleton() {
  return (
    <li className="mb-3 animate-pulse rounded-2xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-xl">
      <div className="grid items-center gap-3 md:grid-cols-[1.6fr_1fr_1fr_1fr_auto]">
        <div className="min-w-0">
          <div className="h-4 w-40 rounded bg-white/10" />
          <div className="mt-2 h-3 w-28 rounded bg-white/10" />
        </div>
        <div className="h-1.5 w-full rounded bg-white/10" />
        <div className="h-1.5 w-full rounded bg-white/10" />
        <div className="h-1.5 w-full rounded bg-white/10" />
        <div className="ml-auto flex gap-2">
          <div className="h-8 w-10 rounded-xl bg-white/10" />
          <div className="h-8 w-20 rounded-xl bg-white/10" />
          <div className="h-8 w-24 rounded-xl bg-white/10" />
        </div>
      </div>
    </li>
  );
}
