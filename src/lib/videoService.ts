/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { VideoItem } from '../types';
import { initialVideoItems } from '../data/videosData';

const LOCAL_STORAGE_KEY = 'mosaico_video_items_v1';

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

function getLocalVideos(): VideoItem[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Error loading local videos:', err);
  }
  return initialVideoItems;
}

function saveLocalVideos(items: VideoItem[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Error saving local videos:', err);
  }
}

export async function fetchVideoItems(): Promise<VideoItem[]> {
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

  return (data as VideoRow[]).map(rowToVideoItem);
}

export async function createVideoItem(input: VideoInput): Promise<VideoItem> {
  const isPublished = input.isPublished !== false;

  if (isSupabaseConfigured) {
    try {
      const row = videoItemToRow(input);
      const { data, error } = await supabase
        .from('video_items')
        .insert(row)
        .select()
        .single();

      if (!error && data) {
        const item = rowToVideoItem(data as VideoRow);
        const current = getLocalVideos();
        saveLocalVideos([item, ...current]);
        return item;
      }
    } catch (e) {
      console.warn('Fallback to local storage for video item:', e);
    }
  }

  // Local fallback
  const newItem: VideoItem = {
    id: `vid-${Date.now()}`,
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
  const updated = [newItem, ...current];
  saveLocalVideos(updated);
  return newItem;
}

export async function updateVideoItem(id: string, input: VideoInput): Promise<VideoItem> {
  const isPublished = input.isPublished !== false;

  if (isSupabaseConfigured) {
    try {
      const row = videoItemToRow(input);
      const { data, error } = await supabase
        .from('video_items')
        .update({ ...row, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

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
  if (isSupabaseConfigured) {
    try {
      await supabase.from('video_items').delete().eq('id', id);
    } catch (e) {
      console.warn('Error deleting video item on Supabase:', e);
    }
  }
  const current = getLocalVideos();
  const next = current.filter((i) => i.id !== id);
  saveLocalVideos(next);
}
