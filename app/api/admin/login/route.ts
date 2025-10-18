// app/api/admin/login/route.ts
import { NextResponse } from 'next/server';
import { adminCookieName, expectedAdminToken } from '@/lib/authAdmin';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  // aceita form-urlencoded ou JSON
  let password = '';
  const ct = req.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    const body = await req.json().catch(() => ({}));
    password = body?.password || '';
  } else if (ct.includes('application/x-www-form-urlencoded')) {
    const form = await req.formData();
    password = String(form.get('password') || '');
  }

  if (!password) {
    return NextResponse.json({ ok: false, error: 'Password vazia' }, { status: 400 });
  }

  if (password !== expectedAdminToken()) {
    return NextResponse.json({ ok: false, error: 'Credenciais inválidas' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });

  // define cookie
  const oneWeek = 60 * 60 * 24 * 7;
  res.cookies.set({
    name: adminCookieName,
    value: password,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: oneWeek,
  });

  return res;
}
