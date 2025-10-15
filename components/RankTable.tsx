'use client';
import { useEffect, useMemo } from 'react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { models as allModels, overallScore } from '@/lib/mockModels';
import { ArrowUpDown, ChevronLeft, ChevronRight, ExternalLink, Star, StarOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type SortKey = 'overall' | 'quality' | 'match' | 'value' | 'name';
const PAGE_SIZES = [5, 10, 20];

export default function RankTable() {
  const [caseKey, setCaseKey] = useLocalStorage<'all' | string>('af_case_key', 'all');
  const [lang, setLang] = useLocalStorage<'pt'|'en'|'es'|'fr'|'de'|'any'>('af_lang', 'pt');
  const [budget, setBudget] = useLocalStorage<'any'|'free'|'standard'|'premium'>('af_budget', 'any');
  const [onlyFavs, setOnlyFavs] = useLocalStorage<boolean>('af_only_favs', false);
  const [pageSize, setPageSize] = useLocalStorage<number>('af_page_size', 10);
  const [page, setPage] = useLocalStorage<number>('af_page', 1);
  const [sortKey, setSortKey] = useLocalStorage<SortKey>('af_sort', 'overall');
  const [desc, setDesc] = useLocalStorage<boolean>('af_desc', true);
  const [query, setQuery] = useLocalStorage<string>('af_query', '');
  const [favorites, setFavorites] = useLocalStorage<string[]>('af_favs', []);

  const rows = useMemo(() => {
    const filtered = allModels
      .filter(m => {
        const okCase   = caseKey === 'all' || m.useCases.includes(caseKey as any);
        const okLang   = lang === 'any'    || m.langs.includes(lang);
        const okBudget = budget === 'any'  || m.priceTier === budget;
        const okQuery  = !query || (m.name + ' ' + m.vendor).toLowerCase().includes(query.toLowerCase());
        const okFav    = !onlyFavs || favorites.includes(m.id);
        return okCase && okLang && okBudget && okQuery && okFav;
      })
      .map(m => ({ ...m, overall: overallScore(m) }));

    const sorted = filtered.sort((a: any, b: any) => {
      const A = sortKey === 'name' ? String(a[sortKey]).toLowerCase() : Number(a[sortKey]);
      const B = sortKey === 'name' ? String(b[sortKey]).toLowerCase() : Number(b[sortKey]);
      if (A < B) return desc ? 1 : -1;
      if (A > B) return desc ? -1 : 1;
      return 0;
    });

    return sorted;
  }, [caseKey, lang, budget, onlyFavs, query, favorites, sortKey, desc]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(page, totalPages);
  useEffect(() => { if (page !== safePage) setPage(safePage); }, [totalPages]);
  const paged = rows.slice((safePage - 1) * pageSize, safePage * pageSize);

  function toggleFav(id: string) {
    setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }
  function sortBy(k: SortKey) {
    if (sortKey === k) setDesc(!desc);
    else { setSortKey(k); setDesc(true); }
  }

  return (
    <section className="relative z-10 mx-auto max-w-6xl px-4 py-14">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setPage(1); }}
          placeholder="Procurar modelo ou fornecedor…"
          className="min-w-[260px] flex-1 rounded-xl border px-3 py-2 text-sm"
        />
        <select className="rounded-xl border px-2 py-2 text-sm" value={caseKey} onChange={e => { setCaseKey(e.target.value); setPage(1); }}>
          {['all','copywriting','general','code','search','vision','image','analysis','design'].map(k =>
            <option key={k} value={k}>{k === 'all' ? 'Todos' : k}</option>
          )}
        </select>
        <select className="rounded-xl border px-2 py-2 text-sm" value={lang} onChange={e => { setLang(e.target.value as any); setPage(1); }}>
          <option value="pt">PT</option><option value="en">EN</option><option value="es">ES</option><option value="fr">FR</option><option value="de">DE</option><option value="any">Qualquer</option>
        </select>
        <select className="rounded-xl border px-2 py-2 text-sm" value={budget} onChange={e => { setBudget(e.target.value as any); setPage(1); }}>
          <option value="any">Qualquer</option><option value="free">Free</option><option value="standard">Standard</option><option value="premium">Premium</option>
        </select>
        <label className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm">
          <input type="checkbox" checked={onlyFavs} onChange={e => { setOnlyFavs(e.target.checked); setPage(1); }} />
          Só favoritos
        </label>
        <select className="rounded-xl border px-2 py-2 text-sm" value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}>
          {PAGE_SIZES.map(n => <option key={n} value={n}>{n}/página</option>)}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white/70 backdrop-blur">
        <div className="grid grid-cols-[auto,2fr,1fr,1fr,1fr,1fr,auto] items-center gap-2 border-b bg-white/60 px-4 py-2 text-xs font-semibold">
          <div className="text-center">Fav</div>
          <button className="flex items-center gap-1 hover:underline text-left" onClick={() => sortBy('name')}>Modelo <ArrowUpDown className="h-3 w-3 opacity-60" /></button>
          <button className="flex items-center gap-1 hover:underline" onClick={() => sortBy('quality')}>Qualidade <ArrowUpDown className="h-3 w-3 opacity-60" /></button>
          <button className="flex items-center gap-1 hover:underline" onClick={() => sortBy('match')}>Match <ArrowUpDown className="h-3 w-3 opacity-60" /></button>
          <button className="flex items-center gap-1 hover:underline" onClick={() => sortBy('value')}>Valor <ArrowUpDown className="h-3 w-3 opacity-60" /></button>
          <button className="flex items-center gap-1 hover:underline" onClick={() => sortBy('overall')}>Overall <ArrowUpDown className="h-3 w-3 opacity-60" /></button>
          <div className="text-right">Ação</div>
        </div>

        {/* <- aqui estava o bug: initial={false} (minúsculo) */}
        <AnimatePresence initial={false}>
          {paged.map((m) => (
            <motion.div
              key={m.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: .18 }}
              className="grid grid-cols-[auto,2fr,1fr,1fr,1fr,1fr,auto] items-center gap-2 px-4 py-3 odd:bg-white/70"
            >
              <button
                aria-label="Favorito"
                onClick={() => toggleFav(m.id)}
                className="mx-auto rounded-lg border p-1 hover:bg-white/60"
                title={favorites.includes(m.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              >
                {favorites.includes(m.id) ? <Star className="h-4 w-4 fill-slate-900" /> : <StarOff className="h-4 w-4" />}
              </button>

              <div className="min-w-0">
                <div className="truncate font-medium">{m.name}</div>
                <div className="text-xs opacity-60">{m.vendor} • {m.priceTier}</div>
              </div>
              <Bar value={m.quality} />
              <Bar value={m.match} />
              <Bar value={m.value} />
              <div className="font-semibold">{overallScore(m)}</div>
              <div className="text-right">
                <a href={m.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-xl border px-2 py-1 text-xs hover:bg-white/60">
                  Abrir <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.div>
          ))}

          {paged.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 py-8 text-center text-sm opacity-70">
              Sem resultados com os filtros atuais.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm">
        <div className="opacity-70">Página {safePage} de {totalPages} • {rows.length} resultados</div>
        <div className="flex items-center gap-2">
          <button disabled={safePage <= 1} onClick={() => setPage(safePage - 1)} className="rounded-xl border px-3 py-1.5 disabled:opacity-50">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span>{safePage}</span>
          <button disabled={safePage >= totalPages} onClick={() => setPage(safePage + 1)} className="rounded-xl border px-3 py-1.5 disabled:opacity-50">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function Bar({ value }: { value: number }) {
  return (
    <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-200">
      <motion.div
        className="absolute left-0 top-0 h-full bg-slate-900"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: .4 }}
      />
      <span className="absolute right-1 top-[-18px] text-xs opacity-70">{value}</span>
    </div>
  );
}
