// lib/authAdmin.ts
/**
 * Valida o token do admin a partir do header.
 * Aceita:
 *  - Authorization: Bearer <ADMIN_TOKEN>
 *  - x-admin-token: <ADMIN_TOKEN>
 */
export function checkAdminToken(req: Request):
  | { ok: true }
  | { ok: false; status: number; msg: string } {
  const expected = process.env.ADMIN_TOKEN ?? '';

  if (!expected) {
    return { ok: false, status: 500, msg: 'ADMIN_TOKEN não configurado no servidor' };
  }

  const auth = req.headers.get('authorization') || '';
  const bearer = auth.toLowerCase().startsWith('bearer ') ? auth.slice(7) : '';
  const headerToken = req.headers.get('x-admin-token') || '';

  const provided = bearer || headerToken;

  if (!provided || provided !== expected) {
    return { ok: false, status: 401, msg: 'Não autorizado' };
  }
  return { ok: true };
}
