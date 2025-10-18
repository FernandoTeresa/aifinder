// app/api/admin/ai/delete/[id]/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { checkAdminToken } from '@/lib/authAdmin';

export const runtime = 'nodejs';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const auth = checkAdminToken(req);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.msg }, { status: auth.status });

  const id = params.id;
  const { error } = await supabaseAdmin.from('ai_tools').delete().eq('id', id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}