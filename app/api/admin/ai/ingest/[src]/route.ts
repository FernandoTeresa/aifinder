import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { upsertBatch } from '@/lib/ingest/merge';
import { fetchSampleCsv } from '@/lib/ingest/sources/sample_csv';
import { fetchProviderApi } from '@/lib/ingest/sources/provider_api';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

export async function POST(req: Request, { params }: { params: { src: string } }) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const url = new URL(req.url);
  const feed = url.searchParams.get('url') || '';

  const started = new Date();
  let stats = { inserted: 0, updated: 0, unchanged: 0, deactivated: 0 };

  try {
    let rows = [];
    if (params.src === 'sample_csv') {
      if (!feed) throw new Error('query param ?url= obrigatório');
      rows = await fetchSampleCsv(feed);
    } else if (params.src === 'provider_api') {
      if (!feed) throw new Error('query param ?url= obrigatório');
      rows = await fetchProviderApi(feed);
    } else {
      return NextResponse.json({ error: 'Fonte desconhecida' }, { status: 400 });
    }

    stats = await upsertBatch(rows);

    await supabaseAdmin.from('ai_ingest_audit').insert({
      source: params.src,
      run_started_at: started.toISOString(),
      stats,
      errors: null
    });

    return NextResponse.json({ ok: true, stats });
  } catch (e: any) {
    await supabaseAdmin.from('ai_ingest_audit').insert({
      source: params.src,
      run_started_at: started.toISOString(),
      stats,
      errors: [String(e?.message || e)]
    });
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
