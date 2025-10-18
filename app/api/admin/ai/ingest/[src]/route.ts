// app/api/admin/ai/ingest/[src]/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(
  _req: Request,
  { params }: { params: { src: string } }
) {
  // auth simples por bearer
  const auth = _req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || '';
  if (!process.env.ADMIN_TOKEN || auth !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const src = (params.src || '').toLowerCase();

  if (src === 'sample_csv') {
    // TODO: ler CSV (ex.: de /public/seed/ai-tools.csv), normalizar e gravar
    return NextResponse.json({ ok: true, imported: 0, note: 'stub CSV — implementar parsing + upsert' });
  }

  if (src === 'provider_api') {
    // TODO: call a APIs (ex.: OpenRouter / Model Garden), normalizar e gravar
    return NextResponse.json({ ok: true, imported: 0, note: 'stub provider API — implementar fetch + upsert' });
  }

  return NextResponse.json({ ok: false, error: 'fonte desconhecida' }, { status: 400 });
}
