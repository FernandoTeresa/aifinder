// app/api/admin/ping/route.ts
import { NextResponse } from 'next/server';
import { isAdminFromCookies } from '@/lib/authAdmin';

export const runtime = 'nodejs';

export async function GET() {
  if (!isAdminFromCookies()) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}