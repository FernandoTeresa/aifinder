// lib/adminAuth.ts
import { cookies, headers } from 'next/headers';

export function isAdminAuthenticated() {
  const token = cookies().get('admin_token')?.value || headers().get('x-admin-token');
  const ok = !!process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN;
  return ok;
}