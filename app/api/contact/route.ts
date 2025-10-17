// app/api/account/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email') ?? undefined;
  const customerId = searchParams.get('customer_id') ?? undefined;

  if (!email && !customerId) {
    return NextResponse.json({ error: 'Fornece ?email= ou ?customer_id=' }, { status: 400 });
  }

  try {
    let query = supabaseAdmin.from('billing_overview').select('*').limit(1);
    if (customerId) {
      query = query.eq('stripe_customer_id', customerId);
    } else if (email) {
      query = query.eq('email', email.toLowerCase());
    }

    const { data, error } = await query.maybeSingle();
    if (error) throw error;

    if (!data) {
      return NextResponse.json({ ok: true, found: false });
    }

    return NextResponse.json({ ok: true, found: true, account: data });
  } catch (err: any) {
    console.error('[account] error:', err?.message || err);
    return NextResponse.json({ error: 'Falha ao obter conta' }, { status: 500 });
  }
}
