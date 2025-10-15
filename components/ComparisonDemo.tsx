'use client';
import { useMemo, useState } from 'react';
import { models, overallScore } from '@/lib/mockModels';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpDown, Download, ExternalLink, SlidersHorizontal } from 'lucide-react';

type SortKey = 'overall' | 'quality' | 'match' | 'value';

const useCases = [
  { key: 'all', label: 'Todos' },
  { key: 'copywriting', label: 'Copywriting' },
  { key: 'general', label: 'Geral' },
  { key: 'code', label: 'Código' },
  { key: 'search', label: 'Pesquisa' },
  { key: 'vision', label: 'Visão' },
  { key: 'image', label: 'Imagem' },
  { key: 'analysis', label: 'Análise' },
  { key: 'design', label: 'Design' },
] as const;

const budgets = [
  { key: 'any', label: 'Qualquer' },
  { key: 'free', label: 'Free' },
  { key: 'standard', label: 'Standard' },
  { key: 'premium', label: 'Premium' },
] as const;

export default function ComparisonDemo() {
  const [caseKey, setCaseKey] = useState<typeof useCases[number]['key']>('all');
  const [lang, setLang] = useState<'pt' | 'en' | 'es' | 'fr' | 'de' | 'any'>('pt');
  const [budget, setBudget] = useState<typeof budgets[number]['key']>('any');
  const [sortKey, setSortKey] = useState<SortKey>('overall');
  const [desc, setDesc] = useState(true);

  const rows = useMemo(() => {
    const filtered = models
      .filter(m => {
        const okCase = caseKey === 'all' || m.useCases.includes(caseKey as any);
        const okLang = lang === 'any' || m.langs.includes(lang);
        const okBudget = budget === 'any' || m.priceTier === budget;
        return okCase && okLang && okBudget;
      })
      .map(m => ({ ...m, overall: overallScore(m) }));
    const sorted = filtered.sort((a, b) => {
      const A = (a as any)[sortKey] as number;
      const B = (b as any)[sortKey] as number;
      return (desc ? B - A : A - B);
    });
    return sorted;
  }, [caseKey, lang, budget, sortKey, desc]);

  function toCSV(data: any[]) {
    const headers = ['Modelo', 'Fornecedor', 'Preço', 'Qualidade', 'Match', 'Valor', 'Overall', 'URL'];
    const lines = data.map(r => [r.name, r.vendor, r.priceTier, r.quality, r.match, r.value, r.overall, r.url].join(','));
    return [headers.join(','), ...lines].join('\n');
  }

  function downloadCSV() {
    const csv = toCSV(rows as any[]);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'aifinder_comparacao.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  function sortBy(k: SortKey) {
    if (sortKey === k) setDesc(!desc);
    else { setSortKey(k); setDesc(true); }
  }

  return (
    <section className="relative z-10 mx-auto max-w-6xl px-4 py-14">
      <div className="mb-4 flex items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-2xl border bg-white/70 p-2 backdrop-blur">
          <span className="px-2 text-xs text-slate-500">Caso de uso</span>
          <select className="rounded-xl border px-2 py-1 text-sm" value={caseKey} onChange={e => setCaseKey(e.target.value as any)}>
            {useCases.map(u => <option key={u.key} value={u.key}>{u.label}</option>)}
          </select>
          <span className="px-2 text-xs text-slate-500">Idioma</span>
          <select className="rounded-xl border px-2 py-1 text-sm" value={lang} onChange={e => setLang(e.target.value as any)}>
            <option value="pt">PT</option><option value="en">EN</option><option value="es">ES</option><option value="fr">FR</option><option value="de">DE</option><option value="any">Qualquer</option>
          </select>
          <span className="px-2 text-xs text-slate-500">Orçamento</span>
          <select className="rounded-xl border px-2 py-1 text-sm" value={budget} onChange={e => setBudget(e.target.value as any)}>
            {budgets.map(b => <option key={b.key} value={b.key}>{b.label}</option>)}
          </select>
        </div>
        <button onClick={downloadCSV} className="ml-auto inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm hover:bg-white/60">
          <Download className="h-4 w-4" /> Exportar CSV
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white/70 backdrop-blur">
        <div className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr,auto] border-b bg-white/60 px-4 py-2 text-xs font-semibold">
          <div className="flex items-center gap-2">Modelo</div>
          <button className="flex items-center gap-1 hover:underline" onClick={() => sortBy('quality')}>Qualidade <ArrowUpDown className="h-3 w-3 opacity-60" /></button>
          <button className="flex items-center gap-1 hover:underline" onClick={() => sortBy('match')}>Match <ArrowUpDown className="h-3 w-3 opacity-60" /></button>
          <button className="flex items-center gap-1 hover:underline" onClick={() => sortBy('value')}>Valor <ArrowUpDown className="h-3 w-3 opacity-60" /></button>
          <button className="flex items-center gap-1 hover:underline" onClick={() => sortBy('overall')}>Overall <ArrowUpDown className="h-3 w-3 opacity-60" /></button>
          <div className="text-right">Ação</div>
        </div>

        <AnimatePresence initial={false}>
          {rows.map((m) => (
            <motion.div
              key={m.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: .18 }}
              className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr,auto] items-center gap-2 px-4 py-3 odd:bg-white/70"
            >
              <div className="min-w-0">
                <div className="truncate font-medium">{m.name}</div>
                <div className="text-xs opacity-60">{m.vendor} • {m.priceTier}</div>
              </div>
              <Bar value={m.quality} />
              <Bar value={m.match} />
              <Bar value={m.value} />
              <div className="font-semibold">{overallScore(m)}</div>
              <div className="text-right">
                <a href={m.url} target="_blank" className="inline-flex items-center gap-1 rounded-xl border px-2 py-1 text-xs hover:bg-white/60" rel="noreferrer">
                  Abrir <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <p className="mt-3 flex items-center gap-2 text-xs text-slate-500"><SlidersHorizontal className="h-3.5 w-3.5" /> Ranking com pesos (Qualidade 50% • Match 35% • Valor 15%).</p>
    </section>
  );
}

function Bar({ value }: { value: number }) {
  return (
    <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-200">
      <motion.div className="absolute left-0 top-0 h-full bg-slate-900" initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: .4 }} />
      <span className="absolute right-1 top-[-18px] text-xs opacity-70">{value}</span>
    </div>
  );
}
