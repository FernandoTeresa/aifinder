import crypto from 'crypto';

export function stableHash(obj: unknown) {
  const s = JSON.stringify(obj, Object.keys(obj as object).sort());
  return crypto.createHash('sha256').update(s).digest('hex');
}