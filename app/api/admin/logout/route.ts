// app/api/admin/logout/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  // limpa cookie local usado no painel (se estiver em uso no teu login)
  res.headers.append('Set-Cookie', `admin_token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);
  return res;
}
