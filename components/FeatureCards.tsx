import { ListFilter, Rocket, SlidersHorizontal } from 'lucide-react';

const items = [
  {
    icon: ListFilter,
    title: 'Pesquisa multi-IA',
    desc: 'Indexamos modelos generativos, agentes e APIs com metadata acionável.',
    detail: 'Filtra por idioma, tom, compliance, limites de custo e integrações disponíveis.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Match inteligente',
    desc: 'O motor pondera objetivo, orçamento e feedback da equipe.',
    detail: 'Cada sugestão traz score, riscos conhecidos e recomendações rápidas de implementação.',
  },
  {
    icon: Rocket,
    title: 'Escolha e ação',
    desc: 'Guarda favoritos, exporta playbooks e conecta com o fornecedor em 1 clique.',
    detail: 'Integra com Slack, Notion e CRMs populares para acelerar o go-live.',
  },
] as const;

export default function FeatureCards() {
  return (
    <section className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-10">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">Como funciona</h2>
        <p className="mt-3 text-sm text-white/60 sm:text-base">
          Uma experiência guiada para sair da exploração e chegar à decisão com insights confiáveis e contexto operacional.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {items.map(({ icon: Icon, title, desc, detail }) => (
          <article
            key={title}
            className="
              group relative overflow-hidden glass-card p-8
              transition duration-400 hover:border-white/20 hover:bg-white/10
            "
          >
            {/* hairline superior suave */}
            <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-60" />

            {/* ícone */}
            <div
              className="
                inline-flex size-12 items-center justify-center rounded-2xl
                bg-white/10 text-cyan-200 transition
                group-hover:scale-[1.03] group-hover:text-white
              "
            >
              <Icon className="h-5 w-5" />
            </div>

            {/* textos */}
            <h3 className="mt-6 text-xl font-semibold text-white">{title}</h3>
            <p className="mt-3 text-sm text-white/70">{desc}</p>
            <p className="mt-4 text-xs text-white/55">{detail}</p>

            {/* brilho suave ao pair */}
            <div className="pointer-events-none absolute -inset-8 opacity-0 blur-2xl transition group-hover:opacity-100"
                 style={{ background: 'radial-gradient(40% 40% at 50% 0%, rgba(56,189,248,0.18), transparent)' }} />
          </article>
        ))}
      </div>
    </section>
  );
}
