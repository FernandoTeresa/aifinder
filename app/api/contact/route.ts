// app/api/account/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CUSTOMER_ID_REGEX = /^cus_[A-Za-z0-9]+$/;

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const emailParam = searchParams.get('email');
  const customerIdParam = searchParams.get('customer_id');

  const customerId = customerIdParam?.trim();
  const email = emailParam?.trim().toLowerCase();

  if (!email && !customerId) {
    return NextResponse.json({ error: 'Fornece ?email= ou ?customer_id=' }, { status: 400 });
  }

  if (email && !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'Email inválido.' }, { status: 400 });
  }

  if (customerId && !CUSTOMER_ID_REGEX.test(customerId)) {
    return NextResponse.json({ error: 'customer_id inválido.' }, { status: 400 });
  }

  try {
    let query = supabaseAdmin.from('billing_overview').select('*').limit(1);
    if (customerId) {
      query = query.eq('stripe_customer_id', customerId);
    } else if (email) {
      query = query.eq('email', email);
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
