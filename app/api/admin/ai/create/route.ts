// app/api/admin/ai/create/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { checkAdminToken } from '@/lib/authAdmin';

export const runtime = 'nodejs';

type Body = {
  name: string;
  slug: string;
  provider?: string;
  tier?: string;
  description?: string;
  category?: string;
  language?: string;
  tags?: string[];
  quality?: number; // 0-100
  match?: number;   // 0-100
  value?: number;   // 0-100
  url?: string;
  active?: boolean;
};

export async function POST(req: Request) {
  const auth = checkAdminToken(req);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.msg }, { status: auth.status });

  const body = (await req.json()) as Body;

  if (!body?.name || !body?.slug) {
    return NextResponse.json({ ok: false, error: 'name e slug são obrigatórios' }, { status: 400 });
  }

  const row = {
    name: body.name,
    slug: body.slug,
    provider: body.provider ?? null,
    tier: body.tier ?? null,
    description: body.description ?? null,
    category: body.category ?? null,
    language: body.language ?? null,
    tags: body.tags ?? [],
    quality: clamp(body.quality, 0, 100),
    match: clamp(body.match, 0, 100),
    value: clamp(body.value, 0, 100),
    url: body.url ?? null,
    active: body.active ?? true,
  };

  const { data, error } = await supabaseAdmin.from('ai_tools').insert(row).select('*').single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, item: data });
}

function clamp(n: any, min: number, max: number) {
  const v = Number.isFinite(n) ? Number(n) : 0;
  return Math.max(min, Math.min(max, v));
}
