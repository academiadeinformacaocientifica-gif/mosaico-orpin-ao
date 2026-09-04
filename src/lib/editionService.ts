/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { MagazineEdition } from '../types';
import { initialMagazineEditions } from '../data/magazineEditions';
import { uploadArticleImage } from './articleService';

const LOCAL_STORAGE_KEY = 'mosaico_magazine_editions_v1';
const DELETED_EDITIONS_KEY = 'mosaico_deleted_editions_v1';
const DELETED_NUMBERS_KEY = 'mosaico_deleted_edition_numbers_v1';

export function getDeletedEditionIds(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_EDITIONS_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return new Set(arr);
    }
  } catch (e) {
    console.error('Error reading deleted edition ids:', e);
  }
  return new Set();
}

export function getDeletedEditionNumbers(): Set<number> {
  try {
    const raw = localStorage.getItem(DELETED_NUMBERS_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return new Set(arr.map(Number));
    }
  } catch (e) {
    console.error('Error reading deleted edition numbers:', e);
  }
  return new Set();
}

function markEditionAsDeleted(id: string, editionNumber?: number): void {
  try {
    const ids = getDeletedEditionIds();
    ids.add(id);
    localStorage.setItem(DELETED_EDITIONS_KEY, JSON.stringify(Array.from(ids)));

    if (typeof editionNumber === 'number' && !isNaN(editionNumber)) {
      const nums = getDeletedEditionNumbers();
      nums.add(editionNumber);
      localStorage.setItem(DELETED_NUMBERS_KEY, JSON.stringify(Array.from(nums)));
    }
  } catch (e) {
    console.error('Error marking edition as deleted:', e);
  }
}

function unmarkEditionAsDeleted(id: string, editionNumber?: number): void {
  try {
    const ids = getDeletedEditionIds();
    if (ids.has(id)) {
      ids.delete(id);
      localStorage.setItem(DELETED_EDITIONS_KEY, JSON.stringify(Array.from(ids)));
    }
    if (typeof editionNumber === 'number' && !isNaN(editionNumber)) {
      const nums = getDeletedEditionNumbers();
      if (nums.has(editionNumber)) {
        nums.delete(editionNumber);
        localStorage.setItem(DELETED_NUMBERS_KEY, JSON.stringify(Array.from(nums)));
      }
    }
  } catch (e) {
    console.error('Error unmarking edition as deleted:', e);
  }
}

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

export function getLocalEditions(): MagazineEdition[] {
  const deletedIds = getDeletedEditionIds();
  const deletedNums = getDeletedEditionNumbers();

  const filterOutDeleted = (items: MagazineEdition[]): MagazineEdition[] => {
    return items.filter(
      (item) => !deletedIds.has(item.id) && (item.editionNumber === undefined || !deletedNums.has(item.editionNumber))
    );
  };

  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return filterOutDeleted(parsed);
      }
    }
  } catch (err) {
    console.error('Error loading local magazine editions:', err);
  }
  return filterOutDeleted(initialMagazineEditions);
}

export function saveLocalEditions(items: MagazineEdition[]): void {
  try {
    const deletedIds = getDeletedEditionIds();
    const deletedNums = getDeletedEditionNumbers();
    const cleanItems = items.filter(
      (item) => !deletedIds.has(item.id) && (item.editionNumber === undefined || !deletedNums.has(item.editionNumber))
    );
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cleanItems));
  } catch (err) {
    console.error('Error saving local magazine editions:', err);
  }
}

export async function fetchMagazineEditions(): Promise<MagazineEdition[]> {
  const deletedIds = getDeletedEditionIds();
  const deletedNums = getDeletedEditionNumbers();

  const filterOutDeleted = (items: MagazineEdition[]): MagazineEdition[] => {
    return items.filter(
      (item) => !deletedIds.has(item.id) && (item.editionNumber === undefined || !deletedNums.has(item.editionNumber))
    );
  };

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

    const fromDb = (data as EditionRow[]).map(rowToEdition);
    const validFromDb = filterOutDeleted(fromDb);
    // Keep local cache in sync so initial load on refresh is instantaneous
    saveLocalEditions(validFromDb);
    return validFromDb;
  } catch (err) {
    console.warn('Erro ao conectar ao Supabase para edições:', err);
    return getLocalEditions();
  }
}

export async function createMagazineEdition(input: MagazineEditionInput): Promise<MagazineEdition> {
  const isPublished = input.isPublished !== false;
  const newId = `ed-${input.editionNumber}-${Date.now()}`;

  // Se o número ou id foi apagado anteriormente, remove da lista negra para permitir recriação
  unmarkEditionAsDeleted(newId, input.editionNumber);

  if (isSupabaseConfigured) {
    try {
      const row = {
        id: newId,
        ...editionToRow(input),
      };
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

      // Se der erro de coluna 'id', tenta sem passar id explícito
      if (error && (error.message?.includes('id') || error.code === '42703')) {
        const { id: _id, ...rowWithoutId } = row;
        const retryResult = await supabase
          .from('magazine_editions')
          .insert([rowWithoutId])
          .select()
          .single();
        data = retryResult.data;
        error = retryResult.error;
      }

      if (!error && data) {
        const newEdition = rowToEdition(data as EditionRow);
        const current = getLocalEditions();
        const updated = [newEdition, ...current.filter((i) => i.id !== newEdition.id)];
        saveLocalEditions(updated);
        return newEdition;
      }
    } catch (e) {
      console.warn('Fallback to local storage for magazine edition:', e);
    }
  }

  // Local fallback
  const newEdition: MagazineEdition = {
    id: newId,
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
  const updated = [newEdition, ...current.filter((i) => i.id !== newId)];
  saveLocalEditions(updated);
  return newEdition;
}

export async function updateMagazineEdition(id: string, input: MagazineEditionInput): Promise<MagazineEdition> {
  const isPublished = input.isPublished !== false;

  // Garante que a edição editada não conste como apagada
  unmarkEditionAsDeleted(id, input.editionNumber);

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

export async function deleteMagazineEdition(id: string, editionNumber?: number): Promise<void> {
  // 1. Marca imediatamente como eliminado na lista negra permanente do browser
  markEditionAsDeleted(id, editionNumber);

  // 2. Remove imediatamente do armazenamento local para que recarregamentos não mostrem o item
  const current = getLocalEditions();
  const next = current.filter(
    (i) => i.id !== id && (editionNumber === undefined || i.editionNumber !== editionNumber)
  );
  saveLocalEditions(next);

  // 3. Executa a eliminação no Supabase (se configurado)
  if (isSupabaseConfigured) {
    try {
      // Tentativa de remoção pelo campo 'id'
      const { error: idError } = await supabase
        .from('magazine_editions')
        .delete()
        .eq('id', id);

      if (idError) {
        console.warn('[Mosaico] Aviso ao eliminar edição por ID no Supabase:', idError.message || idError);
      }

      // Tentativa complementar pelo número da edição se fornecido
      if (typeof editionNumber === 'number' && !isNaN(editionNumber)) {
        const { error: numError } = await supabase
          .from('magazine_editions')
          .delete()
          .eq('edition_number', editionNumber);

        if (numError && !idError) {
          console.warn('[Mosaico] Aviso ao eliminar por edition_number no Supabase:', numError.message || numError);
        }
      }
    } catch (e) {
      console.warn('Erro ao comunicar remoção de edição ao Supabase:', e);
    }
  }
}

export { uploadArticleImage as uploadMagazineCover };
