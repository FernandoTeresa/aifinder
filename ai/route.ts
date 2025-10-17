// app/api/ai/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const { data, error } = await supabaseAdmin
      .from('ai_tools')
      .select('*')
      .order('quality', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[API /ai] Erro Supabase:', error.message);
      return NextResponse.json({ error: 'Erro ao carregar dados.' }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (err) {
    console.error('[API /ai] Erro inesperado:', err);
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
  }
}