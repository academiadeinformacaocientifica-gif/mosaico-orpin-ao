/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { GalleryItem } from '../types';
import { initialGalleryItems } from '../data/galleryData';
import { uploadArticleImage } from './articleService';

const LOCAL_STORAGE_KEY = 'mosaico_gallery_items_v1';

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

function getLocalGallery(): GalleryItem[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Error loading local gallery:', err);
  }
  return initialGalleryItems;
}

function saveLocalGallery(items: GalleryItem[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Error saving local gallery:', err);
  }
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
    // If table is empty, return local gallery
    return getLocalGallery();
  }

  return (data as GalleryRow[]).map(rowToGalleryItem);
}

export async function createGalleryItem(input: GalleryInput): Promise<GalleryItem> {
  const isPublished = input.isPublished !== false;

  if (isSupabaseConfigured) {
    try {
      const row = galleryItemToRow(input);
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

      if (!error && data) {
        const item = rowToGalleryItem(data as GalleryRow);
        // Also update local
        const current = getLocalGallery();
        saveLocalGallery([item, ...current]);
        return item;
      }
    } catch (e) {
      console.warn('Fallback to local storage for gallery item:', e);
    }
  }

  // Local fallback
  const newItem: GalleryItem = {
    id: `gal-${Date.now()}`,
    title: input.title,
    category: input.category,
    date: input.date,
    description: input.description,
    image: input.image,
    isPublished,
  };

  const current = getLocalGallery();
  const updated = [newItem, ...current];
  saveLocalGallery(updated);
  return newItem;
}

export async function updateGalleryItem(id: string, input: GalleryInput): Promise<GalleryItem> {
  const isPublished = input.isPublished !== false;

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
  if (isSupabaseConfigured) {
    try {
      await supabase.from('gallery_items').delete().eq('id', id);
    } catch (e) {
      console.warn('Error deleting gallery item on Supabase:', e);
    }
  }
  const current = getLocalGallery();
  const next = current.filter((i) => i.id !== id);
  saveLocalGallery(next);
}

export { uploadArticleImage as uploadGalleryImage };
