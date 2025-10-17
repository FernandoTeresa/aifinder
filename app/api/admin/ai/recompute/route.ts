import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

export async function POST() {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // pega ativos
  const { data, error } = await supabaseAdmin
    .from('ai_tools')
    .select('id, tier, category, tags, quality, match, value, is_active')
    .eq('is_active', true)
    .limit(2000);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const updates = (data || []).map(row => {
    const boostTier = row.tier === 'free' ? 6 : row.tier === 'standard' ? 2 : 0;
    const boostCategory = row.category?.toLowerCase() === 'programação' ? 3 : 0;
    const boostTags = (row.tags || []).includes('API') ? 2 : 0;

    const newQuality = clamp((row.quality ?? 70) + boostTags);
    const newMatch   = clamp((row.match   ?? 70) + boostCategory);
    const newValue   = clamp((row.value   ?? 70) + boostTier);

    return { id: row.id, quality: newQuality, match: newMatch, value: newValue, updated_at: new Date().toISOString() };
  });

  // batch updates (chunks)
  const chunk = 200;
  for (let i = 0; i < updates.length; i += chunk) {
    const slice = updates.slice(i, i + chunk);
    const { error: err2 } = await supabaseAdmin.from('ai_tools').upsert(slice);
    if (err2) return NextResponse.json({ error: err2.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, updated: updates.length });
}

function clamp(n: number) { return Math.max(0, Math.min(100, Math.round(n))); }
