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

export default function UseCasesCarousel() {
  const ref = useRef<HTMLDivElement>(null);

  function scrollByX(x: number) {
    ref.current?.scrollBy({ left: x, behavior: 'smooth' });
  }

  return (
    <section className="relative z-10 mx-auto max-w-6xl px-4 py-14">
      {/* header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white md:text-3xl">Casos de uso</h2>

        {/* nav buttons */}
        <div className="hidden gap-2 md:flex">
          <button
            aria-label="Anterior"
            onClick={() => scrollByX(-360)}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-white hover:border-white/20 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            aria-label="Seguinte"
            onClick={() => scrollByX(360)}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-white hover:border-white/20 hover:bg-white/10"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* scroller */}
      <div
        ref={ref}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{ scrollbarWidth: 'none' }}
      >
        {/* hide scrollbar for webkit */}
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {items.map((it, i) => (
          <motion.article
            key={it.title}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            className="glass-card min-w-[280px] snap-start p-5 transition hover:border-white/20 hover:bg-white/10"
          >
            {/* hairline superior */}
            <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-60" />

            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">
              #{String(i + 1).padStart(2, '0')}
            </div>
            <h3 className="mt-1 text-lg font-semibold text-white">{it.title}</h3>
            <p className="mt-1 text-sm text-white/70">{it.desc}</p>

            {/* brilho suave */}
            <div
              className="pointer-events-none absolute -inset-8 opacity-0 blur-2xl transition duration-300 group-hover:opacity-100"
              style={{
                background:
                  'radial-gradient(40% 40% at 50% 0%, rgba(56,189,248,0.18), transparent)',
              }}
            />
          </motion.article>
        ))}
      </div>
    </section>
  );
}
