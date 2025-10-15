'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

import { Button, GhostButton } from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const stats = [
  { value: '180+', label: 'Modelos avaliados' },
  { value: '92%', label: 'Matches aprovados' },
  { value: '48h', label: 'Atualizações contínuas' },
] as const;

const suggestions = [
  { name: 'BrightCopy', score: '96%', tags: ['Copywriting', 'PT-PT', 'Campanhas'], accent: 'from-sky-400/80 via-cyan-400/60 to-sky-500/70' },
  { name: 'LaunchGenie', score: '92%', tags: ['E-commerce', 'Multicanal'], accent: 'from-indigo-400/80 via-violet-400/60 to-indigo-500/70' },
] as const;

export default function Hero() {
  return (
    <section className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]"
      >
        <div className="text-center lg:text-left">
          <Badge>Inovação • 2025</Badge>
          <motion.h1
            className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease: 'easeOut' }}
          >
            Encontra a{' '}
            <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              IA perfeita
            </span>{' '}
            para a tua próxima entrega
          </motion.h1>

          <p className="mx-auto mt-5 max-w-2xl text-base text-white/70 lg:mx-0 lg:text-lg">
            O AI Finder combina inteligência de pesquisa com curadoria humana para recomendar modelos alinhados ao teu
            brief, budget e stack. Experimenta um fluxo de descoberta ágil e transparente.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Button as={Link} href="/precos">
              Começar agora <ArrowRight className="h-4 w-4" />
            </Button>
            <GhostButton onClick={() => window.scrollTo({ top: 900, behavior: 'smooth' })}>
              Ver como funciona
            </GhostButton>
          </div>

          <div className="mt-10 grid w-full gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:grid-cols-3">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-left sm:text-center">
                <div className="text-2xl font-semibold text-white">{value}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.28em] text-white/50">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, rotate: -3 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.9, type: 'spring', bounce: 0.25 }}
          className="relative mx-auto w-full max-w-xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/[0.04] to-transparent p-6 shadow-[0_40px_120px_-55px_rgba(56,189,248,0.8)] backdrop-blur-2xl"
        >
          <div className="absolute inset-x-8 top-6 h-32 rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-transparent blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.32em] text-white/60">
              <Sparkles className="h-4 w-4 text-sky-300" />
              Matching Engine
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-[#050816]/80 p-4">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.28em] text-white/50">
                <span>Objetivo</span>
                <span>Confiança</span>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-white/80">
                <span>Campanha Ads · Tom divertido · PT</span>
                <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-xs font-semibold text-sky-200">Auto</span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {suggestions.map(({ name, score, tags, accent }) => (
                <div key={name} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 shadow-[0_20px_45px_-35px_rgba(148,163,184,0.9)]">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">{name}</span>
                    <span className="text-xs font-semibold text-white/70">{score}</span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${accent}`}
                      style={{ width: score }}
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-white/60">
                    {tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
