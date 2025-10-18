// lib/supabaseAdmin.ts
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE;

/**
 * Cliente apenas para operações de servidor, usando a SERVICE_ROLE.
 * NUNCA expor esta key no browser.
 */
if (!url || !key) {
  // lançar cedo para evitar 500 silencioso
  throw new Error('SUPABASE_URL ou SUPABASE_SERVICE_ROLE em falta nas envs');
}

export const supabaseAdmin = createClient(url, key, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
