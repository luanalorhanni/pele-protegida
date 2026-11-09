import type { SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const supabaseConfigured = Boolean(url && key);

let client: Promise<SupabaseClient> | null = null;

/**
 * Cliente com a chave PUBLICÁVEL (papel `anon`). Nunca use a service role key no front-end.
 * Sem login: não guarda sessão nem renova token.
 * Carregado sob demanda (só quando há algo para enviar), para deixar a primeira tela leve.
 */
export function getSupabase(): Promise<SupabaseClient> | null {
  if (!url || !key) return null;
  client ??= import('@supabase/supabase-js').then(({ createClient }) =>
    createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    }),
  );
  return client;
}

if (!supabaseConfigured && import.meta.env.DEV) {
  console.warn(
    '[Pele Protegida] VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY não configuradas: respostas ficam só na fila local.',
  );
}
