/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';

function parseJwtRef(token?: string): string | null {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    return typeof payload.ref === 'string' && payload.ref.length > 0 ? payload.ref : null;
  } catch {
    return null;
  }
}

function resolveSupabaseUrl(): string | null {
  const rawUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  if (rawUrl && typeof rawUrl === 'string') {
    const trimmed = rawUrl.trim();
    if (
      trimmed &&
      !trimmed.includes('•') &&
      !trimmed.includes('your-supabase') &&
      !trimmed.includes('placeholder') &&
      !trimmed.includes('example.com') &&
      (trimmed.startsWith('https://') || trimmed.startsWith('http://'))
    ) {
      try {
        const u = new URL(trimmed);
        if (u.protocol === 'https:' || u.protocol === 'http:') {
          return trimmed;
        }
      } catch {
        // invalid URL
      }
    }
  }

  // Fallback: If URL was masked or missing but a valid JWT anon key is provided, infer project URL
  const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (rawKey && !rawKey.includes('•')) {
    const ref = parseJwtRef(rawKey);
    if (ref && /^[a-z0-9_-]+$/i.test(ref)) {
      return `https://${ref}.supabase.co`;
    }
  }

  return null;
}

function resolveSupabaseAnonKey(): string | null {
  const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (rawKey && typeof rawKey === 'string') {
    const trimmed = rawKey.trim();
    if (
      trimmed &&
      !trimmed.includes('•') &&
      !trimmed.includes('placeholder') &&
      trimmed.length > 20
    ) {
      return trimmed;
    }
  }
  return null;
}

const resolvedUrl = resolveSupabaseUrl();
const resolvedKey = resolveSupabaseAnonKey();

export const isSupabaseConfigured = Boolean(resolvedUrl && resolvedKey);

if (!isSupabaseConfigured) {
  console.info(
    '[Mosaico Angolano] A utilizar o modo de demonstração local com dados editoriais enriquecidos.'
  );
}

const effectiveUrl = resolvedUrl || 'https://placeholder.supabase.co';
const effectiveKey = resolvedKey || 'placeholder-anon-key';

export const supabase = createClient(effectiveUrl, effectiveKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

