/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from './supabase';

export interface TableStatus {
  key: string;
  name: string;
  label: string;
  exists: boolean;
  status: 'connected' | 'missing' | 'error';
  itemCount?: number;
  error?: string;
}

export interface DbHealthReport {
  isConfigured: boolean;
  supabaseUrl: string;
  tables: TableStatus[];
  allReady: boolean;
  storageReady: boolean;
}

const TABLES_TO_CHECK = [
  { key: 'articles', name: 'articles', label: 'Notícias & Artigos' },
  { key: 'gallery_items', name: 'gallery_items', label: 'Galeria Fotográfica' },
  { key: 'video_items', name: 'video_items', label: 'Vídeos & Reportagens' },
  { key: 'magazine_editions', name: 'magazine_editions', label: 'Edições da Revista Mosaico' },
  { key: 'natural_wonders', name: 'natural_wonders', label: '7 Maravilhas de Angola' },
];

export async function checkDatabaseHealth(): Promise<DbHealthReport> {
  const url = import.meta.env.VITE_SUPABASE_URL || '';

  if (!isSupabaseConfigured) {
    return {
      isConfigured: false,
      supabaseUrl: '',
      tables: TABLES_TO_CHECK.map((t) => ({
        ...t,
        exists: false,
        status: 'missing',
        error: 'Supabase não configurado no .env (a operar em modo local resiliente)',
      })),
      allReady: false,
      storageReady: false,
    };
  }

  const results: TableStatus[] = [];

  for (const t of TABLES_TO_CHECK) {
    try {
      const { data, error, count } = await supabase
        .from(t.name)
        .select('id', { count: 'exact', head: false })
        .limit(1);

      if (error) {
        if (
          error.code === 'PGRST205' ||
          error.message?.includes('does not exist') ||
          error.message?.includes('schema cache')
        ) {
          results.push({
            ...t,
            exists: false,
            status: 'missing',
            error: 'Tabela ainda não criada no Supabase',
          });
        } else {
          results.push({
            ...t,
            exists: false,
            status: 'error',
            error: error.message,
          });
        }
      } else {
        results.push({
          ...t,
          exists: true,
          status: 'connected',
          itemCount: typeof count === 'number' ? count : (Array.isArray(data) ? (data as any[]).length : 0),
        });
      }
    } catch (err: any) {
      results.push({
        ...t,
        exists: false,
        status: 'error',
        error: err?.message || 'Erro de conexão',
      });
    }
  }

  // Verifica Bucket de Storage
  let storageReady = false;
  try {
    const { data, error } = await supabase.storage.getBucket('article-images');
    if (!error && data) {
      storageReady = true;
    }
  } catch {
    storageReady = false;
  }

  const allReady = results.every((r) => r.status === 'connected') && storageReady;

  return {
    isConfigured: true,
    supabaseUrl: url,
    tables: results,
    allReady,
    storageReady,
  };
}
