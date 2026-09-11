/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { GalleryItem } from '../types';
import { initialGalleryItems } from '../data/galleryData';
import { uploadArticleImage } from './articleService';
import { getStoredItem, setStoredItem } from './resilientStorage';

const LOCAL_STORAGE_KEY = 'mosaico_gallery_items_v1';
const DELETED_GALLERY_KEY = 'mosaico_deleted_gallery_v1';

function getDeletedGalleryIds(): Set<string> {
  const arr = getStoredItem<string[]>(DELETED_GALLERY_KEY, []);
  return new Set(Array.isArray(arr) ? arr.map(String) : []);
}

function markGalleryAsDeleted(id: string): void {
  const ids = getDeletedGalleryIds();
  ids.add(id);
  setStoredItem(DELETED_GALLERY_KEY, Array.from(ids));
}

function unmarkGalleryAsDeleted(id: string): void {
  const ids = getDeletedGalleryIds();
  if (ids.has(id)) {
    ids.delete(id);
    setStoredItem(DELETED_GALLERY_KEY, Array.from(ids));
  }
}

interface GalleryRow {
  id: string;
  title: string;
  category: string;
  date_label: string;
  description: string;
  image_url: string;
  images?: string[] | null;
  collection?: string | null;
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
  images?: string[];
  collection?: string;
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
    images: row.images || undefined,
    collection: row.collection || undefined,
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
    images: item.images || null,
    collection: item.collection || null,
    is_published: item.isPublished !== false,
  };
}

const LEGACY_MOCK_GALLERY_IDS = new Set([
  'gal-1', 'gal-2', 'gal-3', 'gal-4', 'gal-5', 'gal-6', 'gal-7', 'gal-8', 'gal-9', 'gal-10'
]);

function isLegacyMockGallery(item: { id: string; title?: string }): boolean {
  if (LEGACY_MOCK_GALLERY_IDS.has(item.id)) return true;
  if (item.title && (
    item.title.includes('IMEX Barcelona') ||
    item.title.includes('50 Anos da Independência') ||
    item.title.includes('Cooperação Bilateral Angola-Espanha')
  )) {
    return true;
  }
  return false;
}

function filterOutDeletedGallery(items: GalleryItem[]): GalleryItem[] {
  const deletedIds = getDeletedGalleryIds();
  return items.filter((item) => !isLegacyMockGallery(item) && !deletedIds.has(item.id));
}

export function getLocalGallery(): GalleryItem[] {
  const saved = getStoredItem<GalleryItem[]>(LOCAL_STORAGE_KEY, initialGalleryItems);
  if (Array.isArray(saved) && saved.length > 0) {
    return filterOutDeletedGallery(saved);
  }
  return filterOutDeletedGallery(initialGalleryItems);
}

export function saveLocalGallery(items: GalleryItem[]): void {
  const cleanItems = filterOutDeletedGallery(items);
  setStoredItem(LOCAL_STORAGE_KEY, cleanItems);
}

export async function fetchGalleryItems(): Promise<GalleryItem[]> {
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
    const local = getLocalGallery();
    if (local.length > 0) {
      const rows = local.map((item) => ({
        id: item.id,
        ...galleryItemToRow(item),
      }));
      (async () => {
        try {
          await supabase.from('gallery_items').upsert(rows, { onConflict: 'id' });
          console.log('[Mosaico] Galeria inicial sincronizada com sucesso no Supabase.');
        } catch (err) {
          console.warn('Erro ao semear galeria inicial:', err);
        }
      })();
    }
    return local;
  }

  const fromDb = (data as GalleryRow[]).map(rowToGalleryItem);
  const validFromDb = filterOutDeletedGallery(fromDb);
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

      if (error && (error.code === 'PGRST204' || error.message?.includes('is_published') || error.message?.includes('collection') || error.message?.includes('images'))) {
        const fallbackRow: any = { ...row };
        if (error.message?.includes('is_published') || error.code === 'PGRST204') delete fallbackRow.is_published;
        if (error.message?.includes('collection') || error.code === 'PGRST204') delete fallbackRow.collection;
        if (error.message?.includes('images') || error.code === 'PGRST204') delete fallbackRow.images;
        const retryResult = await supabase
          .from('gallery_items')
          .insert(fallbackRow)
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
        if (!item.collection && input.collection) item.collection = input.collection;
        if (!item.images && input.images) item.images = input.images;
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
    images: input.images,
    collection: input.collection,
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

      if (error && (error.code === 'PGRST204' || error.message?.includes('is_published') || error.message?.includes('collection') || error.message?.includes('images'))) {
        const fallbackPayload: any = { ...updatePayload };
        if (error.message?.includes('is_published') || error.code === 'PGRST204') delete fallbackPayload.is_published;
        if (error.message?.includes('collection') || error.code === 'PGRST204') delete fallbackPayload.collection;
        if (error.message?.includes('images') || error.code === 'PGRST204') delete fallbackPayload.images;
        const retryResult = await supabase
          .from('gallery_items')
          .update(fallbackPayload)
          .eq('id', id)
          .select()
          .single();
        data = retryResult.data;
        error = retryResult.error;
      }

      if (!error && data) {
        const updatedItem = rowToGalleryItem(data as GalleryRow);
        if (!updatedItem.collection && input.collection) updatedItem.collection = input.collection;
        if (!updatedItem.images && input.images) updatedItem.images = input.images;
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
    images: input.images,
    collection: input.collection,
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

export async function createGalleryItems(inputs: GalleryInput[]): Promise<GalleryItem[]> {
  const results: GalleryItem[] = [];
  for (let i = 0; i < inputs.length; i++) {
    const item = await createGalleryItem(inputs[i]);
    results.push(item);
  }
  return results;
}

export { uploadArticleImage as uploadGalleryImage };
