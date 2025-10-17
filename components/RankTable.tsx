'use client';

import { useEffect, useState } from 'react';
import { Heart, HeartOff } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';
import { toast } from 'sonner';
import RankRowSkeleton from '@/components/RankRowSkeleton';

type Modelo = {
  id: string;
  nome: string;
  fornecedor: string;
  qualidade: number; // 0–100
  match: number;     // 0–100
  valor: number;     // 0–100
  tier: string;      // Free | Standard | Premium
  slug?: string;
};

// substitui por fetch real quando ligares à tua API
const FAKE_DELAY = 650;
const modelosMock: Modelo[] = [
  { id: '1', nome: 'GPT-4o mini', fornecedor: 'OpenAI', qualidade: 88, match: 85, valor: 83, tier: 'Standard', slug: 'gpt-4o-mini' },
  { id: '2', nome: 'Perplexity', fornecedor: 'Perplexity', qualidade: 87, match: 84, valor: 80, tier: 'Premium', slug: 'perplexity' },
  { id: '3', nome: 'Claude Haiku', fornecedor: 'Anthropic', qualidade: 85, match: 82, valor: 81, tier: 'Standard', slug: 'claude-haiku' },
  { id: '4', nome: 'Gemini Flash', fornecedor: 'Google', qualidade: 83, match: 79, valor: 78, tier: 'Free', slug: 'gemini-flash' },
];

export default function RankTable() {
  const [data, setData] = useState<Modelo[] | null>(null);
  const { isFav, toggleFav } = useFavorites();

  useEffect(() => {
    let t = setTimeout(() => setData(modelosMock), FAKE_DELAY);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative z-10 mx-auto max-w-6xl px-4 pb-24">
      {/* header */}
      <div className="mb-3 grid items-center gap-3 px-2 text-xs uppercase tracking-wide text-white/40 md:grid-cols-[1.6fr_1fr_1fr_1fr_auto]">
        <div>Modelo</div>
        <div>Qualidade</div>
        <div>Match</div>
        <div>Valor</div>
        <div className="text-right">Ação</div>
      </div>

      {/* skeletons */}
      {!data && (
        <ul>
          {Array.from({ length: 4 }).map((_, i) => (
            <RankRowSkeleton key={i} />
          ))}
        </ul>
      )}

      {/* rows */}
      {data && (
        <ul>
          {data.map((m) => (
            <li key={m.id} className="glass-row mb-3 px-3 py-3 transition hover:border-white/20 hover:bg-white/10">
              <div className="grid items-center gap-3 md:grid-cols-[1.6fr_1fr_1fr_1fr_auto]">
                {/* nome + fornecedor */}
                <div className="min-w-0">
                  <a href={`/ia/${m.slug ?? encodeURIComponent(m.nome.toLowerCase().replace(/\s+/g, '-'))}`} className="truncate font-medium text-white hover:underline">
                    {m.nome}
                  </a>
                  <p className="text-xs text-white/50">{m.fornecedor} · {m.tier}</p>
                </div>

                {/* barras */}
                <Barra nome="Qualidade" valor={m.qualidade} cor="bg-cyan-400/80" />
                <Barra nome="Match" valor={m.match} cor="bg-blue-400/80" />
                <Barra nome="Valor" valor={m.valor} cor="bg-emerald-400/80" />

                {/* ações */}
                <div className="flex items-center justify-end gap-2">
                  <FavButton
                    active={isFav(m.id)}
                    onClick={() => {
                      toggleFav(m.id);
                      toast.success(isFav(m.id) ? 'Removido dos favoritos' : 'Adicionado aos favoritos');
                    }}
                  />
                  <a href={`/ia/${m.slug ?? encodeURIComponent(m.nome.toLowerCase().replace(/\s+/g, '-'))}`} className="btn-glow px-3 py-1.5 text-sm">
                    Abrir
                  </a>
                  <button
                    className="btn-glow px-3 py-1.5 text-sm"
                    onClick={() => toast.info(`Comparação iniciada: ${m.nome}`)}
                  >
                    Comparar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Barra({ nome, valor, cor }: { nome: string; valor: number; cor: string }) {
  return (
    <div>
      <div className="mb-1 text-xs text-white/50">{nome}</div>
      <div className="h-1.5 w-full rounded-full bg-white/10">
        <div className={`h-1.5 rounded-full ${cor}`} style={{ width: `${Math.max(0, Math.min(100, valor))}%` }} />
      </div>
    </div>
  );
}

function FavButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-xl border px-2.5 py-1.5 transition ${
        active
          ? 'border-rose-400/40 bg-rose-500/10 text-rose-200 hover:border-rose-400/60'
          : 'border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/10'
      }`}
      aria-label={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      title={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      {active ? <Heart className="h-4 w-4 fill-current" /> : <HeartOff className="h-4 w-4" />}
    </button>
  );
}
