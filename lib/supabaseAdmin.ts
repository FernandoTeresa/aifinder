// lib/supabaseAdmin.ts
import { createClient } from '@supabase/supabase-js';

// ⚠️ Usa a service role key (não a pública)
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE!;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('❌ Missing Supabase environment variables (SUPABASE_URL or SUPABASE_SERVICE_ROLE)');
}

// Cliente com permissões administrativas (server-side only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});