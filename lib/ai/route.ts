// app/api/ai/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q')?.trim();
  const category = url.searchParams.get('category') || undefined;
  const tag = url.searchParams.get('tag') || undefined;
  const limit = Number(url.searchParams.get('limit') || 20);
  const offset = Number(url.searchParams.get('offset') || 0);

  try {
    let query = supabaseAdmin.from('ai_tools').select('*', { count: 'exact' });

    if (q) {
      // pesquisa simples por name/provider
      query = query.or(`name.ilike.%${q}%,provider.ilike.%${q}%`);
    }
    if (category) query = query.eq('category', category);
    if (tag) query = query.contains('tags', [tag]);

    query = query.order('match', { ascending: false }).range(offset, offset + limit - 1);

    const { data, error, count } = await query;
    if (error) throw error;

    return NextResponse.json({ ok: true, items: data, count: count ?? data?.length ?? 0 });
  } catch (err: any) {
    console.error('[api/ai] error:', err?.message || err);
    return NextResponse.json({ error: 'Falha ao listar IA' }, { status: 500 });
  }
}