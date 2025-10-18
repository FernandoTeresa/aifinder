// app/api/admin/ping/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const auth = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || '';
  if (!process.env.ADMIN_TOKEN || auth !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ ok: true, t: Date.now() });
}
