// app/api/ai/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const { data, error } = await supabaseAdmin
      .from('ai_tools')
      .select('*')
      .order('quality', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[API /ai] Supabase error:', error.message);
      return NextResponse.json({ error: 'Erro ao carregar dados' }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (e: any) {
    console.error('[API /ai] error:', e);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
