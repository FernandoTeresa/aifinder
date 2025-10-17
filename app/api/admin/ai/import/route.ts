// app/api/admin/ai/import/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { isAdminAuthenticated } from '@/lib/adminAuth';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'Ficheiro ausente' }, { status: 400 });

  const text = await file.text();
  const rows = text.split(/\r?\n/).filter(Boolean);

  // Cabeçalho esperado:
  // name,slug,provider,tier,description,category,language,tags,quality,match,value,url
  const [header, ...dataRows] = rows;
  if (!/^\s*name,slug,provider,tier,description,category,language,tags,quality,match,value,url\s*$/i.test(header)) {
    return NextResponse.json({ error: 'Cabeçalho CSV inválido' }, { status: 400 });
  }

  let inserted = 0, upserted = 0;
  for (const line of dataRows) {
    const cols = splitCsv(line);
    if (cols.length < 12) continue;
    const [name, slug, provider, tier, description, category, language, tagsRaw, quality, match, value, url] = cols;

    const payload = {
      name: name?.trim(),
      slug: slug?.trim(),
      provider: provider?.trim(),
      tier: (tier || 'standard').trim(),
      description: description?.trim(),
      category: category?.trim(),
      language: (language || 'PT').trim(),
      tags: (tagsRaw || '').split('|').map(s => s.trim()).filter(Boolean),
      quality: numOrNull(quality),
      match: numOrNull(match),
      value: numOrNull(value),
      url: url?.trim(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from('ai_tools')
      .upsert(payload, { onConflict: 'slug' })
      .select();

    if (error) return NextResponse.json({ error: `Erro na linha: ${line} · ${error.message}` }, { status: 500 });
    if (Array.isArray(data) && data.length) upserted++; else inserted++;
  }

  return NextResponse.json({ inserted, upserted });
}

function splitCsv(line: string) {
  // parse simples: suporta vírgulas dentro de aspas
  const out: string[] = [];
  let cur = '', inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') { inQ = !inQ; continue; }
    if (c === ',' && !inQ) { out.push(cur); cur=''; continue; }
    cur += c;
  }
  out.push(cur);
  return out;
}
function numOrNull(x: string | undefined) {
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}