// app/api/admin/ai/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { isAdminAuthenticated } from '@/lib/authAdmin';

export async function GET() {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data, error } = await supabaseAdmin.from('ai_tools').select('*').order('updated_at', { ascending: false }).limit(200);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const payload = {
    name: body.name,
    slug: body.slug,
    provider: body.provider,
    tier: body.tier,
    description: body.description,
    category: body.category,
    language: body.language || 'PT',
    tags: body.tags || [],
    quality: body.quality ?? null,
    match: body.match ?? null,
    value: body.value ?? null,
    url: body.url,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseAdmin
    .from('ai_tools')
    .upsert(payload, { onConflict: 'slug' })
    .select()
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
