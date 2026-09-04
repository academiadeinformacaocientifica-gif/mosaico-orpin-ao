/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { GalleryItem } from '../types';
import { initialGalleryItems } from '../data/galleryData';
import { uploadArticleImage } from './articleService';

const LOCAL_STORAGE_KEY = 'mosaico_gallery_items_v1';
const DELETED_GALLERY_KEY = 'mosaico_deleted_gallery_v1';

function getDeletedGalleryIds(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_GALLERY_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        return new Set(arr.map(String));
      }
    }
  } catch (e) {
    console.error('Error reading deleted gallery ids:', e);
  }
  return new Set<string>();
}

function markGalleryAsDeleted(id: string): void {
  try {
    const ids = getDeletedGalleryIds();
    ids.add(id);
    localStorage.setItem(DELETED_GALLERY_KEY, JSON.stringify(Array.from(ids)));
  } catch (e) {
    console.error('Error marking gallery as deleted:', e);
  }
}

function unmarkGalleryAsDeleted(id: string): void {
  try {
    const ids = getDeletedGalleryIds();
    if (ids.has(id)) {
      ids.delete(id);
      localStorage.setItem(DELETED_GALLERY_KEY, JSON.stringify(Array.from(ids)));
    }
  } catch (e) {
    console.error('Error unmarking gallery as deleted:', e);
  }
}

interface GalleryRow {
  id: string;
  title: string;
  category: string;
  date_label: string;
  description: string;
  image_url: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export type GalleryInput = {
  title: string;
  category: string;
  date: string;
  description: string;
  image: string;
  isPublished?: boolean;
};

function rowToGalleryItem(row: GalleryRow): GalleryItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    date: row.date_label,
    description: row.description,
    image: row.image_url,
    isPublished: row.is_published ?? true,
  };
}

function galleryItemToRow(item: GalleryInput) {
  return {
    title: item.title,
    category: item.category,
    date_label: item.date,
    description: item.description,
    image_url: item.image,
    is_published: item.isPublished !== false,
  };
}

export function getLocalGallery(): GalleryItem[] {
  const deletedIds = getDeletedGalleryIds();
  const filterOutDeleted = (items: GalleryItem[]): GalleryItem[] => {
    return items.filter((item) => !deletedIds.has(item.id));
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
    console.error('Error loading local gallery:', err);
  }
  return filterOutDeleted(initialGalleryItems);
}

export function saveLocalGallery(items: GalleryItem[]): void {
  try {
    const deletedIds = getDeletedGalleryIds();
    const cleanItems = items.filter((item) => !deletedIds.has(item.id));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cleanItems));
  } catch (err) {
    console.error('Error saving local gallery:', err);
  }
}

export async function fetchGalleryItems(): Promise<GalleryItem[]> {
  const deletedIds = getDeletedGalleryIds();
  const filterOutDeleted = (items: GalleryItem[]): GalleryItem[] => {
    return items.filter((item) => !deletedIds.has(item.id));
  };

  if (!isSupabaseConfigured) {
    return getLocalGallery();
  }

  const { data, error } = await supabase
    .from('gallery_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    if (
      error.code === 'PGRST205' ||
      error.message?.includes('relation "public.gallery_items" does not exist')
    ) {
      console.warn('[Mosaico] Tabela "gallery_items" não existe ainda no Supabase. Usando armazenamento local.');
      return getLocalGallery();
    }
    console.error('Erro ao buscar galeria no Supabase:', error);
    return getLocalGallery();
  }

  if (!data || data.length === 0) {
    // If table is empty, return local gallery
    return getLocalGallery();
  }

  const fromDb = (data as GalleryRow[]).map(rowToGalleryItem);
  const validFromDb = filterOutDeleted(fromDb);
  saveLocalGallery(validFromDb);
  return validFromDb;
}

export async function createGalleryItem(input: GalleryInput): Promise<GalleryItem> {
  const isPublished = input.isPublished !== false;
  const newId = `gal-${Date.now()}`;

  // Se o id foi marcado como apagado anteriormente, remove da blacklist
  unmarkGalleryAsDeleted(newId);

  if (isSupabaseConfigured) {
    try {
      const row = {
        id: newId,
        ...galleryItemToRow(input),
      };
      let { data, error } = await supabase
        .from('gallery_items')
        .insert(row)
        .select()
        .single();

      if (error && (error.code === 'PGRST204' || error.message?.includes('is_published'))) {
        const { is_published: _p, ...rowWithoutPublished } = row as any;
        const retryResult = await supabase
          .from('gallery_items')
          .insert(rowWithoutPublished)
          .select()
          .single();
        data = retryResult.data;
        error = retryResult.error;
      }

      // Se der erro por passar id explícito, tenta sem passar id
      if (error && (error.message?.includes('id') || error.code === '42703')) {
        const { id: _id, ...rowWithoutId } = row;
        const retryResult = await supabase
          .from('gallery_items')
          .insert(rowWithoutId)
          .select()
          .single();
        data = retryResult.data;
        error = retryResult.error;
      }

      if (!error && data) {
        const item = rowToGalleryItem(data as GalleryRow);
        unmarkGalleryAsDeleted(item.id);
        const current = getLocalGallery();
        const updated = [item, ...current.filter((i) => i.id !== item.id)];
        saveLocalGallery(updated);
        return item;
      }
    } catch (e) {
      console.warn('Fallback to local storage for gallery item:', e);
    }
  }

  // Local fallback
  const newItem: GalleryItem = {
    id: newId,
    title: input.title,
    category: input.category,
    date: input.date,
    description: input.description,
    image: input.image,
    isPublished,
  };

  const current = getLocalGallery();
  const updated = [newItem, ...current.filter((i) => i.id !== newId)];
  saveLocalGallery(updated);
  return newItem;
}

export async function updateGalleryItem(id: string, input: GalleryInput): Promise<GalleryItem> {
  const isPublished = input.isPublished !== false;
  unmarkGalleryAsDeleted(id);

  if (isSupabaseConfigured) {
    try {
      const row = galleryItemToRow(input);
      const updatePayload: any = { ...row, updated_at: new Date().toISOString() };
      let { data, error } = await supabase
        .from('gallery_items')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error && (error.code === 'PGRST204' || error.message?.includes('is_published'))) {
        const { is_published: _p, ...payloadWithoutPublished } = updatePayload;
        const retryResult = await supabase
          .from('gallery_items')
          .update(payloadWithoutPublished)
          .eq('id', id)
          .select()
          .single();
        data = retryResult.data;
        error = retryResult.error;
      }

      if (!error && data) {
        const updatedItem = rowToGalleryItem(data as GalleryRow);
        const current = getLocalGallery();
        const next = current.map((i) => (i.id === id ? updatedItem : i));
        saveLocalGallery(next);
        return updatedItem;
      }
    } catch (e) {
      console.warn('Fallback to local storage for gallery update:', e);
    }
  }

  // Local fallback
  const current = getLocalGallery();
  const updatedItem: GalleryItem = {
    id,
    title: input.title,
    category: input.category,
    date: input.date,
    description: input.description,
    image: input.image,
    isPublished,
  };
  const next = current.map((i) => (i.id === id ? updatedItem : i));
  saveLocalGallery(next);
  return updatedItem;
}

export async function deleteGalleryItem(id: string): Promise<void> {
  // 1. Marca imediatamente como eliminado na blacklist do browser
  markGalleryAsDeleted(id);

  // 2. Remove imediatamente do armazenamento local
  const current = getLocalGallery();
  const next = current.filter((i) => i.id !== id);
  saveLocalGallery(next);

  // 3. Executa eliminação no Supabase se configurado
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('gallery_items').delete().eq('id', id);
      if (error) {
        console.warn('[Mosaico] Aviso ao eliminar galeria no Supabase:', error.message || error);
      }
    } catch (e) {
      console.warn('Error deleting gallery item on Supabase:', e);
    }
  }
}

export { uploadArticleImage as uploadGalleryImage };
