/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.trim() !== '' &&
  supabaseAnonKey.trim() !== '' &&
  !supabaseUrl.includes('your-supabase')
);

if (!isSupabaseConfigured) {
  console.warn(
    '[Mosaico Angolano] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY não definidas. ' +
    'A aplicação está a utilizar os dados de demonstração locais. ' +
    'Para ligar ao Supabase, configure o ficheiro .env.'
  );
}

const effectiveUrl = isSupabaseConfigured ? supabaseUrl! : 'https://placeholder.supabase.co';
const effectiveKey = isSupabaseConfigured ? supabaseAnonKey! : 'placeholder-anon-key';

export const supabase = createClient(effectiveUrl, effectiveKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

