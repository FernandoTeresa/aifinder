// lib/supabaseAdmin.ts
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE!;

if (!url || !serviceKey) {
  // Não lançar erro na import — só log (para build não falhar em CI sem secrets)
  console.warn('[supabaseAdmin] SUPABASE_URL ou SUPABASE_SERVICE_ROLE ausentes');
}

export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
