// app/api/admin/ai/list/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const auth = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || '';
  if (!process.env.ADMIN_TOKEN || auth !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  // TODO: aqui ligamos à Supabase para ler public.ai_tools
  // por agora devolvemos uma lista vazia para não bloquear o deploy
  return NextResponse.json({ items: [] });
}
