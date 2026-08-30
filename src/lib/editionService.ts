/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { MagazineEdition } from '../types';
import { initialMagazineEditions } from '../data/magazineEditions';
import { uploadArticleImage } from './articleService';

const LOCAL_STORAGE_KEY = 'mosaico_magazine_editions_v1';

interface EditionRow {
  id: string;
  edition_number: number;
  title: string;
  theme: string;
  period: string;
  year: number;
  cover_image: string;
  pdf_url: string | null;
  pages_count: number;
  highlights: string[] | null;
  editorial_note: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export type MagazineEditionInput = {
  editionNumber: number;
  title: string;
  theme: string;
  period: string;
  year: number;
  coverImage: string;
  pdfUrl?: string;
  pagesCount: number;
  highlights: string[];
  editorialNote: string;
  isPublished?: boolean;
};

function rowToEdition(row: EditionRow): MagazineEdition {
  return {
    id: row.id,
    editionNumber: Number(row.edition_number) || 1,
    title: row.title,
    theme: row.theme,
    period: row.period,
    year: Number(row.year) || new Date().getFullYear(),
    coverImage: row.cover_image,
    pdfUrl: row.pdf_url || undefined,
    pagesCount: Number(row.pages_count) || 48,
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    editorialNote: row.editorial_note || '',
    isPublished: row.is_published ?? true,
  };
}

function editionToRow(item: MagazineEditionInput) {
  return {
    edition_number: item.editionNumber,
    title: item.title,
    theme: item.theme,
    period: item.period,
    year: item.year,
    cover_image: item.coverImage,
    pdf_url: item.pdfUrl || null,
    pages_count: item.pagesCount,
    highlights: item.highlights || [],
    editorial_note: item.editorialNote,
    is_published: item.isPublished !== false,
  };
}

function getLocalEditions(): MagazineEdition[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Error loading local magazine editions:', err);
  }
  return initialMagazineEditions;
}

function saveLocalEditions(items: MagazineEdition[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Error saving local magazine editions:', err);
  }
}

export async function fetchMagazineEditions(): Promise<MagazineEdition[]> {
  if (!isSupabaseConfigured) {
    return getLocalEditions();
  }

  try {
    const { data, error } = await supabase
      .from('magazine_editions')
      .select('*')
      .order('edition_number', { ascending: false });

    if (error) {
      if (
        error.code === 'PGRST205' ||
        error.message?.includes('relation "public.magazine_editions" does not exist')
      ) {
        console.warn('[Mosaico] Tabela "magazine_editions" não existe ainda no Supabase. Usando armazenamento local.');
        return getLocalEditions();
      }
      console.error('Erro ao buscar edições de revista no Supabase:', error);
      return getLocalEditions();
    }

    if (!data || data.length === 0) {
      return getLocalEditions();
    }

    return (data as EditionRow[]).map(rowToEdition);
  } catch (err) {
    console.warn('Erro ao conectar ao Supabase para edições:', err);
    return getLocalEditions();
  }
}

export async function createMagazineEdition(input: MagazineEditionInput): Promise<MagazineEdition> {
  const isPublished = input.isPublished !== false;

  if (isSupabaseConfigured) {
    try {
      const row = editionToRow(input);
      let { data, error } = await supabase
        .from('magazine_editions')
        .insert([row])
        .select()
        .single();

      if (error && (error.code === 'PGRST204' || error.message?.includes('is_published'))) {
        const { is_published: _p, ...rowWithoutPublished } = row;
        const retryResult = await supabase
          .from('magazine_editions')
          .insert([rowWithoutPublished])
          .select()
          .single();
        data = retryResult.data;
        error = retryResult.error;
      }

      if (!error && data) {
        const newEdition = rowToEdition(data as EditionRow);
        const current = getLocalEditions();
        const updated = [newEdition, ...current];
        saveLocalEditions(updated);
        return newEdition;
      }
    } catch (e) {
      console.warn('Fallback to local storage for magazine edition:', e);
    }
  }

  // Local fallback
  const newEdition: MagazineEdition = {
    id: 'ed-' + Date.now(),
    editionNumber: input.editionNumber,
    title: input.title,
    theme: input.theme,
    period: input.period,
    year: input.year,
    coverImage: input.coverImage,
    pdfUrl: input.pdfUrl,
    pagesCount: input.pagesCount,
    highlights: input.highlights,
    editorialNote: input.editorialNote,
    isPublished,
  };

  const current = getLocalEditions();
  const updated = [newEdition, ...current];
  saveLocalEditions(updated);
  return newEdition;
}

export async function updateMagazineEdition(id: string, input: MagazineEditionInput): Promise<MagazineEdition> {
  const isPublished = input.isPublished !== false;

  if (isSupabaseConfigured) {
    try {
      const row = editionToRow(input);
      const updatePayload: any = { ...row, updated_at: new Date().toISOString() };
      let { data, error } = await supabase
        .from('magazine_editions')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error && (error.code === 'PGRST204' || error.message?.includes('is_published'))) {
        const { is_published: _p, ...payloadWithoutPublished } = updatePayload;
        const retryResult = await supabase
          .from('magazine_editions')
          .update(payloadWithoutPublished)
          .eq('id', id)
          .select()
          .single();
        data = retryResult.data;
        error = retryResult.error;
      }

      if (!error && data) {
        const updatedEdition = rowToEdition(data as EditionRow);
        const current = getLocalEditions();
        const next = current.map((i) => (i.id === id ? updatedEdition : i));
        saveLocalEditions(next);
        return updatedEdition;
      }
    } catch (e) {
      console.warn('Fallback to local storage for magazine edition update:', e);
    }
  }

  // Local fallback
  const current = getLocalEditions();
  const updatedEdition: MagazineEdition = {
    id,
    editionNumber: input.editionNumber,
    title: input.title,
    theme: input.theme,
    period: input.period,
    year: input.year,
    coverImage: input.coverImage,
    pdfUrl: input.pdfUrl,
    pagesCount: input.pagesCount,
    highlights: input.highlights,
    editorialNote: input.editorialNote,
    isPublished,
  };
  const next = current.map((i) => (i.id === id ? updatedEdition : i));
  saveLocalEditions(next);
  return updatedEdition;
}

export async function deleteMagazineEdition(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('magazine_editions').delete().eq('id', id);
    } catch (e) {
      console.warn('Error deleting magazine edition on Supabase:', e);
    }
  }
  const current = getLocalEditions();
  const next = current.filter((i) => i.id !== id);
  saveLocalEditions(next);
}

export { uploadArticleImage as uploadMagazineCover };
