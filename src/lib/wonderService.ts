/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { NaturalWonder, WonderFact, angolaNaturalWonders } from '../data/wondersData';
import { uploadArticleImage } from './articleService';
import { getStoredItem, setStoredItem } from './resilientStorage';

const LOCAL_STORAGE_KEY = 'mosaico_natural_wonders_v1';
const DELETED_WONDERS_KEY = 'mosaico_deleted_wonders_v1';

const LEGACY_MOCK_WONDER_IDS = new Set([
  'kalandula',
  'tundavala',
  'maiombe',
  'moco',
  'nzenzo',
  'carumbo',
  'chiumbe',
]);

function isLegacyMockWonder(item: { id: string; name?: string; image?: string }): boolean {
  if (LEGACY_MOCK_WONDER_IDS.has(item.id)) return true;
  // Filter out any leftover mock wonder that used Unsplash stock images
  if (
    item.image &&
    (item.image.includes('images.unsplash.com/photo-1547471080') ||
      item.image.includes('images.unsplash.com/photo-1464822759023') ||
      item.image.includes('images.unsplash.com/photo-1448375240586') ||
      item.image.includes('images.unsplash.com/photo-1465056836041') ||
      item.image.includes('images.unsplash.com/photo-1518709268805') ||
      item.image.includes('images.unsplash.com/photo-1506744038136') ||
      item.image.includes('images.unsplash.com/photo-1432405972618'))
  ) {
    return true;
  }
  return false;
}

function getDeletedWonderIds(): Set<string> {
  const arr = getStoredItem<string[]>(DELETED_WONDERS_KEY, []);
  return new Set(Array.isArray(arr) ? arr.map(String) : []);
}

function markWonderAsDeleted(id: string): void {
  const ids = getDeletedWonderIds();
  ids.add(id);
  setStoredItem(DELETED_WONDERS_KEY, Array.from(ids));
}

function unmarkWonderAsDeleted(id: string): void {
  const ids = getDeletedWonderIds();
  if (ids.has(id)) {
    ids.delete(id);
    setStoredItem(DELETED_WONDERS_KEY, Array.from(ids));
  }
}

interface WonderRow {
  id: string;
  number: number;
  name: string;
  official_title: string;
  province: string;
  location: string;
  tagline: string;
  summary: string;
  full_description: string[];
  geography_and_nature: string;
  how_to_visit: string;
  image_url: string;
  gallery_images: string[];
  highlights: string[];
  facts: WonderFact[];
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export type NaturalWonderInput = {
  number?: number;
  name: string;
  officialTitle: string;
  province: string;
  location: string;
  tagline: string;
  summary: string;
  fullDescription: string[];
  geographyAndNature: string;
  howToVisit: string;
  image: string;
  galleryImages: string[];
  highlights: string[];
  facts: WonderFact[];
  isPublished?: boolean;
};

function rowToWonder(row: WonderRow): NaturalWonder {
  return {
    id: row.id,
    number: row.number || 1,
    name: row.name,
    officialTitle: row.official_title,
    province: row.province,
    location: row.location,
    tagline: row.tagline,
    summary: row.summary,
    fullDescription: Array.isArray(row.full_description) ? row.full_description : [row.summary],
    geographyAndNature: row.geography_and_nature || '',
    howToVisit: row.how_to_visit || '',
    image: row.image_url,
    galleryImages: Array.isArray(row.gallery_images) ? row.gallery_images : [],
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    facts: Array.isArray(row.facts) ? row.facts : [],
    isPublished: row.is_published ?? true,
  };
}

function wonderToRow(item: NaturalWonderInput) {
  return {
    number: item.number || 1,
    name: item.name,
    official_title: item.officialTitle,
    province: item.province,
    location: item.location,
    tagline: item.tagline,
    summary: item.summary,
    full_description: item.fullDescription,
    geography_and_nature: item.geographyAndNature,
    how_to_visit: item.howToVisit,
    image_url: item.image,
    gallery_images: item.galleryImages,
    highlights: item.highlights,
    facts: item.facts,
    is_published: item.isPublished !== false,
  };
}

function filterOutDeletedWonders(items: NaturalWonder[]): NaturalWonder[] {
  const deletedIds = getDeletedWonderIds();
  return items.filter((item) => !isLegacyMockWonder(item) && !deletedIds.has(item.id));
}

export function getLocalWonders(): NaturalWonder[] {
  const saved = getStoredItem<NaturalWonder[]>(LOCAL_STORAGE_KEY, angolaNaturalWonders);
  if (Array.isArray(saved) && saved.length > 0) {
    return filterOutDeletedWonders(saved);
  }
  return filterOutDeletedWonders(angolaNaturalWonders);
}

export function saveLocalWonders(items: NaturalWonder[]): void {
  const cleanItems = filterOutDeletedWonders(items);
  setStoredItem(LOCAL_STORAGE_KEY, cleanItems);
}

export async function fetchNaturalWonders(): Promise<NaturalWonder[]> {
  if (!isSupabaseConfigured) {
    return getLocalWonders();
  }

  try {
    const { data, error } = await supabase
      .from('natural_wonders')
      .select('*')
      .order('number', { ascending: true });

    if (error) {
      if (
        error.code === 'PGRST205' ||
        error.message?.includes('relation "public.natural_wonders" does not exist')
      ) {
        console.warn('[Mosaico] Tabela "natural_wonders" não existe ainda no Supabase. Usando dados locais.');
        return getLocalWonders();
      }
      console.error('Erro ao buscar maravilhas naturais no Supabase:', error);
      return getLocalWonders();
    }

    if (!data || data.length === 0) {
      return getLocalWonders();
    }

    const fromDb = (data as WonderRow[]).map(rowToWonder);
    const validFromDb = filterOutDeletedWonders(fromDb);
    saveLocalWonders(validFromDb);
    return validFromDb;
  } catch (err) {
    console.warn('Erro ao conectar ao Supabase para maravilhas:', err);
    return getLocalWonders();
  }
}

export async function createNaturalWonder(input: NaturalWonderInput): Promise<NaturalWonder> {
  const isPublished = input.isPublished !== false;
  const current = getLocalWonders();
  const nextNumber = input.number || (current.length > 0 ? Math.max(...current.map((w) => w.number || 0)) + 1 : 1);
  const newId = `wonder-${Date.now()}`;

  unmarkWonderAsDeleted(newId);

  if (isSupabaseConfigured) {
    try {
      const row = {
        id: newId,
        ...wonderToRow({ ...input, number: nextNumber }),
      };
      let { data, error } = await supabase
        .from('natural_wonders')
        .insert(row)
        .select()
        .single();

      if (error && (error.code === 'PGRST204' || error.message?.includes('is_published'))) {
        const { is_published: _p, ...rowWithoutPublished } = row as any;
        const retryResult = await supabase
          .from('natural_wonders')
          .insert(rowWithoutPublished)
          .select()
          .single();
        data = retryResult.data;
        error = retryResult.error;
      }

      if (error && (error.message?.includes('id') || error.code === '42703')) {
        const { id: _id, ...rowWithoutId } = row;
        const retryResult = await supabase
          .from('natural_wonders')
          .insert(rowWithoutId)
          .select()
          .single();
        data = retryResult.data;
        error = retryResult.error;
      }

      if (!error && data) {
        const item = rowToWonder(data as WonderRow);
        unmarkWonderAsDeleted(item.id);
        const updated = [item, ...current.filter((i) => i.id !== item.id)];
        saveLocalWonders(updated);
        return item;
      }
    } catch (e) {
      console.warn('Fallback to local storage for natural wonder creation:', e);
    }
  }

  // Local fallback
  const newWonder: NaturalWonder = {
    id: newId,
    number: nextNumber,
    name: input.name,
    officialTitle: input.officialTitle || input.name,
    province: input.province,
    location: input.location,
    tagline: input.tagline,
    summary: input.summary,
    fullDescription: input.fullDescription && input.fullDescription.length > 0 ? input.fullDescription : [input.summary],
    geographyAndNature: input.geographyAndNature,
    howToVisit: input.howToVisit,
    image: input.image,
    galleryImages: input.galleryImages || [],
    highlights: input.highlights || [],
    facts: input.facts || [],
    isPublished,
  };

  const updated = [...current.filter((i) => i.id !== newId), newWonder];
  saveLocalWonders(updated);
  return newWonder;
}

export async function updateNaturalWonder(id: string, input: NaturalWonderInput): Promise<NaturalWonder> {
  const isPublished = input.isPublished !== false;
  unmarkWonderAsDeleted(id);

  if (isSupabaseConfigured) {
    try {
      const row = wonderToRow(input);
      const updatePayload: any = { ...row, updated_at: new Date().toISOString() };
      let { data, error } = await supabase
        .from('natural_wonders')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error && (error.code === 'PGRST204' || error.message?.includes('is_published'))) {
        const { is_published: _p, ...payloadWithoutPublished } = updatePayload;
        const retryResult = await supabase
          .from('natural_wonders')
          .update(payloadWithoutPublished)
          .eq('id', id)
          .select()
          .single();
        data = retryResult.data;
        error = retryResult.error;
      }

      if (!error && data) {
        const updatedItem = rowToWonder(data as WonderRow);
        const current = getLocalWonders();
        const next = current.map((i) => (i.id === id ? updatedItem : i));
        saveLocalWonders(next);
        return updatedItem;
      }
    } catch (e) {
      console.warn('Fallback to local storage for wonder update:', e);
    }
  }

  // Local fallback
  const current = getLocalWonders();
  const existing = current.find((w) => w.id === id);
  const updatedItem: NaturalWonder = {
    id,
    number: input.number || existing?.number || 1,
    name: input.name,
    officialTitle: input.officialTitle || input.name,
    province: input.province,
    location: input.location,
    tagline: input.tagline,
    summary: input.summary,
    fullDescription: input.fullDescription && input.fullDescription.length > 0 ? input.fullDescription : [input.summary],
    geographyAndNature: input.geographyAndNature,
    howToVisit: input.howToVisit,
    image: input.image,
    galleryImages: input.galleryImages || [],
    highlights: input.highlights || [],
    facts: input.facts || [],
    isPublished,
  };
  const next = current.map((i) => (i.id === id ? updatedItem : i));
  saveLocalWonders(next);
  return updatedItem;
}

export async function deleteNaturalWonder(id: string): Promise<void> {
  // 1. Marca imediatamente como eliminado na blacklist do browser
  markWonderAsDeleted(id);

  // 2. Remove imediatamente do armazenamento local
  const current = getLocalWonders();
  const next = current.filter((i) => i.id !== id);
  saveLocalWonders(next);

  // 3. Executa eliminação no Supabase se configurado
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('natural_wonders').delete().eq('id', id);
      if (error) {
        console.warn('[Mosaico] Aviso ao eliminar maravilha no Supabase:', error.message || error);
      }
    } catch (e) {
      console.warn('Error deleting natural wonder on Supabase:', e);
    }
  }
}

export { uploadArticleImage as uploadWonderImage };
