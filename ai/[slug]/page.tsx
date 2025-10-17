// app/ia/[slug]/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import FavoriteToggle from '@/components/FavoriteToggle';

type Tool = {
  id: string;
  name: string;
  slug: string;
  provider?: string | null;
  category?: string | null;
  website?: string | null;
  tier?: string | null;
  languages?: string[] | null;
  compliance?: string[] | null;
  tags?: string[] | null;
  quality?: number | null;
  match?: number | null;
  value?: number | null;
  pricing?: any | null;
  meta?: any | null;
  updated_at?: string | null;
};

export const revalidate = 60;

// ——— SEO ———
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const { data } = await supabaseAdmin
    .from('ai_tools')
    .select('name, provider, category, slug')
    .eq('slug', params.slug)
    .maybeSingle();

  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const title = data?.name ? `${data.name} — AI Finder` : 'AI Finder · Detalhe do modelo';
  const description = data
    ? `Ficha do modelo ${data.name}${data.provider ? ` da ${data.provider}` : ''} · categoria ${data.category || '—'}.`
    : 'Ficha do modelo de IA.';

  // aponta para a imagem OG dinâmica (abaixo)
  const ogUrl = `${base}/ia/${params.slug}/opengraph-image`;

  return {
    metadataBase: new URL(base),
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/ia/${params.slug}`,
      siteName: 'AI Finder',
      type: 'article',
      images: [{ url: ogUrl }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogUrl],
    },
  };
}

// ——— Data ———
async function getTool(slug: string): Promise<Tool | null> {
  const { data, error } = await supabaseAdmin
    .from('ai_tools')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) {
    console.error('[ia/slug] supabase error:', error.message);
    return null;
  }
  return data as Tool | null;
}

async function getRelated(tool: Tool) {
  // Relacionadas por categoria ou primeira tag
  const tag = tool.tags?.[0];
  let q = supabaseAdmin.from('ai_tools').select('id,name,slug,provider,tier,quality,match,value').neq('id', tool.id).limit(6);

  if (tool.category) q = q.eq('category', tool.category);
  else if (tag) q = q.contains('tags', [tag]);

  const { data, error } = await q;
  if (error) {
    console.warn('[ia/slug] related error:', error.message);
    return [];
  }
  return data || [];
}

export default async function IaDetailPage({ params }: { params: { slug: string } }) {
  const tool = await getTool(params.slug);
  if (!tool) return notFound();

  const related = await getRelated(tool);
  const pct = (n?: number | null) => `${Math.max(0, Math.min(100, n ?? 0))}%`;

  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    applicationCategory: tool.category || 'AIApplication',
    operatingSystem: 'Web',
    offers: tool.pricing
      ? Object.entries(tool.pricing).map(([k, v]: any) => ({
          '@type': 'Offer',
          name: k,
          priceCurrency: 'EUR',
          price: typeof v?.monthly === 'number' ? v.monthly : undefined,
        }))
      : undefined,
    url: `${base}/ia/${tool.slug}`,
    sameAs: tool.website ? [tool.website] : undefined,
    aggregateRating: tool.quality
      ? {
          '@type': 'AggregateRating',
          ratingValue: tool.quality,
          bestRating: 100,
          ratingCount: 10,
        }
      : undefined,
  };

  return (
    <main className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-20">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_10%_-20%,rgba(56,189,248,0.14),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(120%_120%_at_90%_0%,rgba(129,140,248,0.12),transparent_50%)]" />

      {/* JSON-LD */}
      <Script id="ia-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="mb-4 text-xs text-white/60">
        <Link href="/" className="hover:underline">Início</Link>
        <span className="mx-1">/</span>
        <Link href="/#lista" className="hover:underline">Catálogo</Link>
        <span className="mx-1">/</span>
        <span className="text-white/80">{tool.name}</span>
      </nav>

      {/* Header */}
      <header className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-white">{tool.name}</h1>
            <p className="mt-1 text-sm text-white/60">
              {tool.provider || '—'} · {tool.category || '—'} · {tool.tier || '—'}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {tool.tags?.map((t) => (
                <span key={t} className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/80">
                  #{t}
                </span>
              ))}
              {tool.languages?.length ? (
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-wide text-white/60">
                  {tool.languages.join(' ')}
                </span>
              ) : null}
              {tool.compliance?.length ? (
                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] uppercase tracking-wide text-emerald-200">
                  {tool.compliance.join(' ')}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FavoriteToggle id={tool.id} />
            {tool.website && (
              <a
                href={tool.website}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Visitar website
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Métricas */}
      <section className="mt-6 grid gap-6 md:grid-cols-3">
        <CardMeter label="Qualidade" width={pct(tool.quality)} color="bg-cyan-400/80" />
        <CardMeter label="Match" width={pct(tool.match)} color="bg-blue-400/80" />
        <CardMeter label="Valor" width={pct(tool.value)} color="bg-emerald-400/80" />
      </section>

      {/* Conteúdo */}
      <section className="mt-6 grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <h2 className="text-lg font-semibold text-white">Sobre</h2>
          <p className="mt-2 text-sm text-white/70">
            {tool.meta?.description || 'Sem descrição detalhada. Atualiza este campo no Admin para enriquecer a ficha.'}
          </p>

          {tool.meta?.integrations && Array.isArray(tool.meta.integrations) && (
            <>
              <h3 className="mt-4 text-sm font-semibold text-white">Integrações</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {tool.meta.integrations.map((name: string) => (
                  <span key={name} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
                    {name}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <h2 className="text-lg font-semibold text-white">Preços</h2>
          <div className="mt-3 space-y-2 text-sm text-white/80">
            {tool.pricing ? (
              Object.entries(tool.pricing).map(([k, v]: any) => (
                <div key={k} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <span className="capitalize text-white/80">{k}</span>
                  <span className="text-white">{typeof v?.monthly === 'number' ? `${v.monthly}€/mês` : '—'}</span>
                </div>
              ))
            ) : (
              <p className="text-white/60">Sem informação de preços.</p>
            )}
          </div>
        </div>
      </section>

      {/* Relacionadas */}
      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-white">Relacionadas</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r: any) => (
              <li key={r.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl hover:border-white/20 hover:bg-white/10 transition">
                <Link href={`/ia/${r.slug}`} className="font-medium text-white hover:underline">
                  {r.name}
                </Link>
                <p className="text-xs text-white/50">{r.provider || '—'} · {r.tier || '—'}</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <MiniMeter label="Qual" value={r.quality} />
                  <MiniMeter label="Match" value={r.match} />
                  <MiniMeter label="Valor" value={r.value} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

function CardMeter({ label, width, color }: { label: string; width: string; color: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="text-sm text-white/60">{label}</div>
      <div className="mt-2 h-1.5 w-full rounded-full bg-white/10">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width }} />
      </div>
    </div>
  );
}

function MiniMeter({ label, value }: { label: string; value?: number | null }) {
  const w = `${Math.max(0, Math.min(100, value ?? 0))}%`;
  return (
    <div>
      <div className="mb-1 text-[11px] text-white/50">{label}</div>
      <div className="h-1 w-full rounded-full bg-white/10">
        <div className="h-1 rounded-full bg-white/40" style={{ width: w }} />
      </div>
    </div>
  );
}
