// app/ia/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'edge';
export const alt = 'AI Finder · IA';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const { data } = await supabaseAdmin
    .from('ai_tools')
    .select('name,provider,category')
    .eq('slug', params.slug)
    .maybeSingle();

  const title = data?.name ?? 'AI Finder';
  const sub = [data?.provider, data?.category].filter(Boolean).join(' · ') || 'Comparador de IAs';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 64,
          background:
            'radial-gradient(140% 90% at 10% -10%, rgba(56,189,248,0.25), transparent 50%), radial-gradient(120% 80% at 90% 0%, rgba(129,140,248,0.22), #0b1220 55%)',
          color: 'white',
          fontFamily: 'Inter, ui-sans-serif, system-ui',
        }}
      >
        <div
          style={{
            borderRadius: 24,
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.06)',
            padding: 32,
            backdropFilter: 'blur(10px)',
          }}
        >
          <div style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.1 }}>{title}</div>
          <div style={{ marginTop: 12, fontSize: 28, opacity: 0.8 }}>{sub}</div>
          <div style={{ marginTop: 24, fontSize: 22, opacity: 0.7 }}>aifinder · meuaifinder.app</div>
        </div>
      </div>
    ),
    { ...size }
  );
}