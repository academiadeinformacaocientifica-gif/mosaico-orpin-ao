/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { VideoItem } from '../types';
import { initialVideoItems } from '../data/videosData';

const LOCAL_STORAGE_KEY = 'mosaico_video_items_v1';
const DELETED_VIDEOS_KEY = 'mosaico_deleted_videos_v1';

function getDeletedVideoIds(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_VIDEOS_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        return new Set(arr.map(String));
      }
    }
  } catch (e) {
    console.error('Error reading deleted video ids:', e);
  }
  return new Set<string>();
}

function markVideoAsDeleted(id: string): void {
  try {
    const ids = getDeletedVideoIds();
    ids.add(id);
    localStorage.setItem(DELETED_VIDEOS_KEY, JSON.stringify(Array.from(ids)));
  } catch (e) {
    console.error('Error marking video as deleted:', e);
  }
}

function unmarkVideoAsDeleted(id: string): void {
  try {
    const ids = getDeletedVideoIds();
    if (ids.has(id)) {
      ids.delete(id);
      localStorage.setItem(DELETED_VIDEOS_KEY, JSON.stringify(Array.from(ids)));
    }
  } catch (e) {
    console.error('Error unmarking video as deleted:', e);
  }
}

interface VideoRow {
  id: string;
  title: string;
  category: string;
  duration: string;
  date_label: string;
  views: string | null;
  description: string;
  image_url: string;
  video_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export type VideoInput = {
  title: string;
  category: string;
  duration: string;
  date: string;
  views?: string;
  description: string;
  image: string;
  videoUrl?: string;
  isPublished?: boolean;
};

function rowToVideoItem(row: VideoRow): VideoItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    duration: row.duration || '10:00',
    date: row.date_label,
    views: row.views || '1.2mil visualizações',
    description: row.description,
    image: row.image_url,
    videoUrl: row.video_url || undefined,
    isPublished: row.is_published ?? true,
  };
}

function videoItemToRow(item: VideoInput) {
  return {
    title: item.title,
    category: item.category,
    duration: item.duration || '10:00',
    date_label: item.date,
    views: item.views || '1.2mil visualizações',
    description: item.description,
    image_url: item.image,
    video_url: item.videoUrl || null,
    is_published: item.isPublished !== false,
  };
}

export function getLocalVideos(): VideoItem[] {
  const deletedIds = getDeletedVideoIds();
  const filterOutDeleted = (items: VideoItem[]): VideoItem[] => {
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
    console.error('Error loading local videos:', err);
  }
  return filterOutDeleted(initialVideoItems);
}

export function saveLocalVideos(items: VideoItem[]): void {
  try {
    const deletedIds = getDeletedVideoIds();
    const cleanItems = items.filter((item) => !deletedIds.has(item.id));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cleanItems));
  } catch (err) {
    console.error('Error saving local videos:', err);
  }
}

export async function fetchVideoItems(): Promise<VideoItem[]> {
  const deletedIds = getDeletedVideoIds();
  const filterOutDeleted = (items: VideoItem[]): VideoItem[] => {
    return items.filter((item) => !deletedIds.has(item.id));
  };

  if (!isSupabaseConfigured) {
    return getLocalVideos();
  }

  const { data, error } = await supabase
    .from('video_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    if (
      error.code === 'PGRST205' ||
      error.message?.includes('relation "public.video_items" does not exist')
    ) {
      console.warn('[Mosaico] Tabela "video_items" não existe ainda no Supabase. Usando armazenamento local.');
      return getLocalVideos();
    }
    console.error('Erro ao buscar vídeos no Supabase:', error);
    return getLocalVideos();
  }

  if (!data || data.length === 0) {
    return getLocalVideos();
  }

  const fromDb = (data as VideoRow[]).map(rowToVideoItem);
  const validFromDb = filterOutDeleted(fromDb);
  saveLocalVideos(validFromDb);
  return validFromDb;
}

export async function createVideoItem(input: VideoInput): Promise<VideoItem> {
  const isPublished = input.isPublished !== false;
  const newId = `vid-${Date.now()}`;

  // Se o id foi marcado como apagado anteriormente, remove da blacklist
  unmarkVideoAsDeleted(newId);

  if (isSupabaseConfigured) {
    try {
      const row = {
        id: newId,
        ...videoItemToRow(input),
      };
      let { data, error } = await supabase
        .from('video_items')
        .insert(row)
        .select()
        .single();

      if (error && (error.code === 'PGRST204' || error.message?.includes('is_published'))) {
        const { is_published: _p, ...rowWithoutPublished } = row as any;
        const retryResult = await supabase
          .from('video_items')
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
          .from('video_items')
          .insert(rowWithoutId)
          .select()
          .single();
        data = retryResult.data;
        error = retryResult.error;
      }

      if (!error && data) {
        const item = rowToVideoItem(data as VideoRow);
        unmarkVideoAsDeleted(item.id);
        const current = getLocalVideos();
        const updated = [item, ...current.filter((i) => i.id !== item.id)];
        saveLocalVideos(updated);
        return item;
      }
    } catch (e) {
      console.warn('Fallback to local storage for video item:', e);
    }
  }

  // Local fallback
  const newItem: VideoItem = {
    id: newId,
    title: input.title,
    category: input.category,
    duration: input.duration || '10:00',
    date: input.date,
    views: input.views || '1.0mil visualizações',
    description: input.description,
    image: input.image,
    videoUrl: input.videoUrl,
    isPublished,
  };

  const current = getLocalVideos();
  const updated = [newItem, ...current.filter((i) => i.id !== newId)];
  saveLocalVideos(updated);
  return newItem;
}

export async function updateVideoItem(id: string, input: VideoInput): Promise<VideoItem> {
  const isPublished = input.isPublished !== false;
  unmarkVideoAsDeleted(id);

  if (isSupabaseConfigured) {
    try {
      const row = videoItemToRow(input);
      const updatePayload: any = { ...row, updated_at: new Date().toISOString() };
      let { data, error } = await supabase
        .from('video_items')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error && (error.code === 'PGRST204' || error.message?.includes('is_published'))) {
        const { is_published: _p, ...payloadWithoutPublished } = updatePayload;
        const retryResult = await supabase
          .from('video_items')
          .update(payloadWithoutPublished)
          .eq('id', id)
          .select()
          .single();
        data = retryResult.data;
        error = retryResult.error;
      }

      if (!error && data) {
        const updatedItem = rowToVideoItem(data as VideoRow);
        const current = getLocalVideos();
        const next = current.map((i) => (i.id === id ? updatedItem : i));
        saveLocalVideos(next);
        return updatedItem;
      }
    } catch (e) {
      console.warn('Fallback to local storage for video update:', e);
    }
  }

  // Local fallback
  const current = getLocalVideos();
  const updatedItem: VideoItem = {
    id,
    title: input.title,
    category: input.category,
    duration: input.duration || '10:00',
    date: input.date,
    views: input.views || '1.0mil visualizações',
    description: input.description,
    image: input.image,
    videoUrl: input.videoUrl,
    isPublished,
  };
  const next = current.map((i) => (i.id === id ? updatedItem : i));
  saveLocalVideos(next);
  return updatedItem;
}

export async function deleteVideoItem(id: string): Promise<void> {
  // 1. Marca imediatamente como eliminado na blacklist do browser
  markVideoAsDeleted(id);

  // 2. Remove imediatamente do armazenamento local
  const current = getLocalVideos();
  const next = current.filter((i) => i.id !== id);
  saveLocalVideos(next);

  // 3. Executa eliminação no Supabase se configurado
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('video_items').delete().eq('id', id);
      if (error) {
        console.warn('[Mosaico] Aviso ao eliminar vídeo no Supabase:', error.message || error);
      }
    } catch (e) {
      console.warn('Error deleting video item on Supabase:', e);
    }
  }
}
