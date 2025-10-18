// lib/adminAuth.ts
import { cookies } from 'next/headers';

export const adminCookieName = 'admin_token';

export function expectedAdminToken(): string {
  // usa segredo privado em produção
  return process.env.ADMIN_TOKEN || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '';
}

export function validateToken(token?: string | null): boolean {
  const expected = expectedAdminToken();
  return Boolean(token && expected && token === expected);
}

export function getTokenFromCookies(): string | undefined {
  return cookies().get(adminCookieName)?.value;
}

export function isAdminFromCookies(): boolean {
  return validateToken(getTokenFromCookies());
}
