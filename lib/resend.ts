// lib/resend.ts
import { Resend } from 'resend';

const key = process.env.RESEND_API_KEY;
if (!key) {
  console.warn('RESEND_API_KEY ausente — envio de emails ficará desativado.');
}

export const resend = key ? new Resend(key) : null;
