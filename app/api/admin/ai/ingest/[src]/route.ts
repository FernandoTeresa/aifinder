// app/api/admin/ai/ingest/[src]/route.ts
import { NextResponse } from 'next/server';
import { mergeTools } from '@/lib/ingest/merge';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

type LoadFn = (params: Record<string, string | undefined>) => Promise<ReturnType<typeof mergeTools> extends (infer U)[] ? U[] : any[]>;

const SOURCES: Record<string, () => Promise<{ load: LoadFn }>> = {
  sample_csv: () => import('@/lib/ingest/sources/sample_csv'),
  provider_api: () => import('@/lib/ingest/sources/provider_api'),
};

export async function POST(
  req: Request,
  { params }: { params: { src: string } }
) {
  try {
    // auth simples
    const token = req.headers.get('x-admin-token') ?? '';
    if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const urlObj = new URL(req.url);
    const searchParams = Object.fromEntries(urlObj.searchParams.entries());

    const loader = SOURCES[params.src];
    if (!loader) {
      return NextResponse.json({ error: `fonte desconhecida: ${params.src}` }, { status: 400 });
    }

    const { load } = await loader();
    const incoming = await load(searchParams);

    // carrega atuais
    const { data: current, error: e1 } = await supabaseAdmin
      .from('ai_tools')
      .select('*');
    if (e1) throw e1;

    const merged = mergeTools(current ?? [], incoming);

    // upsert (por slug)
    const { error: e2 } = await supabaseAdmin
      .from('ai_tools')
      .upsert(merged, { onConflict: 'slug' });
    if (e2) throw e2;

    return NextResponse.json({ ok: true, added: incoming.length, total: merged.length });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
