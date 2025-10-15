'use client';

import Link from 'next/link';
import type { PropsWithChildren } from 'react';

import Badge from '@/components/ui/Badge';
import { Button, GhostButton } from '@/components/ui/Button';
import { startCheckout } from '@/lib/checkout';

type PlanKey = 'standard' | 'premium';

type BoxProps = PropsWithChildren<{ className?: string }>;

const freeFeatures = ['Pesquisa e ranking', 'Comparações básicas', 'Favoritos até 5'];
const standardFeatures = ['Comparações detalhadas', 'Links diretos para IAs', 'Favoritos até 100', 'Export CSV'];
const premiumFeatures = ['Relatórios e histórico', 'Export CSV/JSON', 'Alertas de preço', 'Suporte prioritário'];
const perks = [
  { title: 'Onboarding guiado', description: 'Checklist de adoção e templates para a tua equipa aplicar as IAs de forma rápida.' },
  { title: 'Segurança alinhada à UE', description: 'Infraestrutura localizada na União Europeia e revisões periódicas de compliance.' },
  { title: 'Curadoria mensal', description: 'Resumo editorial com novos modelos, casos de uso e alertas de riscos.' },
];

function Box({ children, className = '' }: BoxProps) {
  return (
    <div className={`relative rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 backdrop-blur-xl ${className}`}>
      {children}
    </div>
  );
}

export default function EnhancedPricing({ email = 'apoio@aifinder.com', userId = '0000' }) {
  // Mantens os teus componentes de UI; só ligamos ao Stripe via util
  const subscribe = async (plan: PlanKey) => {
    await startCheckout(plan, { email, userId });
  };

  return (
    <>
      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-28 pt-10">
        <div className="mx-auto max-w-2xl text-center">
          <Badge>Pricing 2025</Badge>
          <h2 className="mt-5 text-3xl font-semibold text-white sm:text-4xl">Planos flexíveis para crescer</h2>
          <p className="mt-3 text-sm text-white/60 sm:text-base">
            Acede a recomendações de IA fiáveis com camadas que acompanham a maturidade da tua operação.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.1fr_1fr]">
          {/* FREE */}
          <Box className="border-white/5 bg-white/[0.04] text-white/70">
            <h3 className="text-lg font-semibold text-white">Free</h3>
            <p className="mt-2 text-sm text-white/60">Para explorar o ecossistema.</p>
            <div className="mt-6 text-3xl font-bold text-white">
              0€
              <span className="ml-1 text-sm font-medium text-white/50">/mês</span>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-white/65">
              {freeFeatures.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {/* Mantém o teu GhostButton com as tuas cores/estilos */}
            <GhostButton as={Link} href="/conta" className="mt-8 w-full justify-center text-white">
              Criar conta
            </GhostButton>
          </Box>

          {/* STANDARD (mais popular) */}
          <Box className="relative border-white/20 bg-gradient-to-b from-white/[0.12] via-white/[0.08] to-white/[0.03] text-white shadow-[0_35px_80px_-45px_rgba(56,189,248,0.9)]">
            <div className="absolute right-6 top-6">
              <Badge>⭐ Mais popular</Badge>
            </div>
            <h3 className="text-lg font-semibold text-white">Standard</h3>
            <p className="mt-2 text-sm text-white/70">Equipes que precisam de contexto e ação.</p>
            <div className="mt-6 text-3xl font-bold text-white">
              9,90€
              <span className="ml-1 text-sm font-medium text-white/60">/mês</span>
            </div>
            <p className="mt-2 text-xs uppercase tracking-[0.28em] text-white/50">Até 100 execuções/mês</p>
            <ul className="mt-6 space-y-2 text-sm text-white/70">
              {standardFeatures.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {/* Mantém o teu Button (cores intactas) e troca só o onClick */}
            <Button className="mt-8 w-full justify-center" onClick={() => subscribe('standard')}>
              Subscrever Standard
            </Button>
          </Box>

          {/* PREMIUM */}
          <Box className="border-white/15 bg-white/[0.05] text-white/75">
            <div className="absolute right-6 top-6">
              <Badge>👑 Profissional</Badge>
            </div>
            <h3 className="text-lg font-semibold text-white">Premium</h3>
            <p className="mt-2 text-sm text-white/65">Organizações com governança avançada.</p>
            <div className="mt-6 text-3xl font-bold text-white">
              19,90€
              <span className="ml-1 text-sm font-medium text-white/60">/mês</span>
            </div>
            <p className="mt-2 text-xs uppercase tracking-[0.28em] text-white/50">Ilimitado (fair-use)</p>
            <ul className="mt-6 space-y-2 text-sm text-white/70">
              {premiumFeatures.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {/* Mantém o teu Button e apenas liga ao checkout */}
            <Button className="mt-8 w-full justify-center" onClick={() => subscribe('premium')}>
              Subscrever Premium
            </Button>
          </Box>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-6xl px-4 pb-20">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
          <div className="grid gap-6 md:grid-cols-3">
            {perks.map(({ title, description }) => (
              <div key={title}>
                <h4 className="text-sm font-semibold text-white">{title}</h4>
                <p className="mt-2 text-xs text-white/60">{description}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-xs text-white/60">
            <span>Precisas de um plano Enterprise ou suporte dedicado?</span>
            <Link
              className="rounded-full border border-white/15 px-4 py-1.5 font-semibold text-white transition hover:border-white/30 hover:text-white"
              href="mailto:apoio@aifinder.com"
            >
              Falar com a equipa
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
