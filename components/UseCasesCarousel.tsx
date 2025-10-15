'use client';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const items = [
  { title: 'Copywriting', desc: 'Textos persuasivos, anúncios e descrições de produto.' },
  { title: 'SEO & Pesquisa', desc: 'Briefings, keywords e clusters de conteúdo.' },
  { title: 'Suporte & Assistentes', desc: 'Bots e fluxos de atendimento com contexto.' },
  { title: 'Programação', desc: 'Pair programming, refactors e revisões de PR.' },
  { title: 'Análise de dados', desc: 'Exploração de datasets e geração de insights.' },
  { title: 'Design & Imagem', desc: 'Geração de imagens e variações criativas.' },
];

export default function UseCasesCarousel(){
  const ref = useRef<HTMLDivElement>(null);
  function scrollByX(x:number){ ref.current?.scrollBy({ left: x, behavior: 'smooth' }); }

  return (
    <section className="relative z-10 mx-auto max-w-6xl px-4 py-14">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold md:text-3xl">Casos de uso</h2>
        <div className="hidden gap-2 md:flex">
          <button aria-label="Anterior" onClick={()=>scrollByX(-360)} className="rounded-xl border p-2 hover:bg-white/60"><ArrowLeft className="h-4 w-4" /></button>
          <button aria-label="Seguinte" onClick={()=>scrollByX(360)} className="rounded-xl border p-2 hover:bg-white/60"><ArrowRight className="h-4 w-4" /></button>
        </div>
      </div>
      <div ref={ref} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
        {items.map((it, i) => (
          <motion.article
            key={it.title}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="min-w-[280px] snap-start rounded-2xl border bg-white/70 p-5 backdrop-blur"
          >
            <div className="text-sm opacity-60">#{String(i+1).padStart(2,'0')}</div>
            <h3 className="mt-1 text-lg font-semibold">{it.title}</h3>
            <p className="mt-1 text-sm opacity-80">{it.desc}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
