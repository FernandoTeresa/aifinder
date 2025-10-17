// app/api/admin/login/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { token } = await req.json().catch(() => ({}));
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set('admin_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 8, // 8h
  });
  return res;
}