// app/api/admin/ai/update/[id]/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { checkAdminToken } from '@/lib/authAdmin';

export const runtime = 'nodejs';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = checkAdminToken(req);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.msg }, { status: auth.status });

  const id = params.id;
  const body = await req.json();
  const allowed = ['name','slug','provider','tier','description','category','language','tags','quality','match','value','url','active'] as const;

  const patch: Record<string, any> = {};
  for (const k of allowed) {
    if (k in body) patch[k] = body[k];
  }

  if ('quality' in patch) patch.quality = clamp(patch.quality, 0, 100);
  if ('match' in patch) patch.match = clamp(patch.match, 0, 100);
  if ('value' in patch) patch.value = clamp(patch.value, 0, 100);

  const { data, error } = await supabaseAdmin.from('ai_tools').update(patch).eq('id', id).select('*').single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, item: data });
}

function clamp(n: any, min: number, max: number) {
  const v = Number.isFinite(n) ? Number(n) : 0;
  return Math.max(min, Math.min(max, v));
}
