/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { VideoItem } from '../types';
import { initialVideoItems } from '../data/videosData';
import { getStoredItem, setStoredItem } from './resilientStorage';

const LOCAL_STORAGE_KEY = 'mosaico_video_items_v1';
const DELETED_VIDEOS_KEY = 'mosaico_deleted_videos_v1';

function getDeletedVideoIds(): Set<string> {
  const arr = getStoredItem<string[]>(DELETED_VIDEOS_KEY, []);
  return new Set(Array.isArray(arr) ? arr.map(String) : []);
}

function markVideoAsDeleted(id: string): void {
  const ids = getDeletedVideoIds();
  ids.add(id);
  setStoredItem(DELETED_VIDEOS_KEY, Array.from(ids));
}

function unmarkVideoAsDeleted(id: string): void {
  const ids = getDeletedVideoIds();
  if (ids.has(id)) {
    ids.delete(id);
    setStoredItem(DELETED_VIDEOS_KEY, Array.from(ids));
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

  const saved = getStoredItem<VideoItem[]>(LOCAL_STORAGE_KEY, initialVideoItems);
  if (Array.isArray(saved) && saved.length > 0) {
    return filterOutDeleted(saved);
  }
  return filterOutDeleted(initialVideoItems);
}

export function saveLocalVideos(items: VideoItem[]): void {
  const deletedIds = getDeletedVideoIds();
  const cleanItems = items.filter((item) => !deletedIds.has(item.id));
  setStoredItem(LOCAL_STORAGE_KEY, cleanItems);
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
    const local = getLocalVideos();
    if (local.length > 0) {
      const rows = local.map((item) => ({
        id: item.id,
        ...videoItemToRow(item),
      }));
      (async () => {
        try {
          await supabase.from('video_items').upsert(rows, { onConflict: 'id' });
          console.log('[Mosaico] Vídeos iniciais sincronizados com sucesso no Supabase.');
        } catch (err) {
          console.warn('Erro ao semear vídeos iniciais:', err);
        }
      })();
    }
    return local;
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

/**
 * Envia um ficheiro de vídeo (MP4, WebM, MOV, etc.) para o Supabase Storage
 * no bucket article-images (subpasta videos/) gerando um URL público permanente.
 */
export async function uploadVideoFile(
  file: File,
  onProgress?: (message: string) => void
): Promise<string> {
  if (onProgress) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    onProgress(`A preparar vídeo (${sizeMb} MB)...`);
  }

  if (isSupabaseConfigured) {
    try {
      const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const path = `videos/${Date.now()}-${cleanName}`;

      if (onProgress) {
        onProgress('A enviar vídeo para o armazenamento na nuvem...');
      }

      const { data, error } = await supabase.storage
        .from('article-images')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type || 'video/mp4',
        });

      if (!error && data) {
        const { data: pubData } = supabase.storage.from('article-images').getPublicUrl(path);
        if (pubData?.publicUrl) {
          return pubData.publicUrl;
        }
      } else if (error) {
        console.warn('[Storage] Aviso ao enviar vídeo para o Supabase:', error.message);
      }
    } catch (err) {
      console.warn('[Storage] Falha no upload de vídeo para o Supabase:', err);
    }
  }

  // Fallback local: cria um URL de objeto temporário do navegador
  return URL.createObjectURL(file);
}

/**
 * Extrai a duração e uma miniatura inicial de um ficheiro de vídeo local.
 */
export function extractVideoMetadata(file: File): Promise<{
  thumbnailUrl: string;
  durationStr: string;
}> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.URL) {
      resolve({ thumbnailUrl: '', durationStr: '10:00' });
      return;
    }

    try {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;

      const blobUrl = URL.createObjectURL(file);
      video.src = blobUrl;

      const cleanup = () => {
        try {
          URL.revokeObjectURL(blobUrl);
        } catch {
          // ignore
        }
      };

      video.onloadedmetadata = () => {
        const totalSeconds = Math.round(video.duration || 0);
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        const durationStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

        // Salta para 1 segundo ou 25% da duração para capturar miniatura com conteúdo
        const seekTime = Math.min(1.0, video.duration > 0 ? video.duration / 4 : 0.5);
        video.currentTime = seekTime;
      };

      video.onseeked = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = Math.min(video.videoWidth || 800, 1280);
          canvas.height = Math.min(video.videoHeight || 450, 720);
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.82);
            cleanup();
            const totalSeconds = Math.round(video.duration || 0);
            const mins = Math.floor(totalSeconds / 60);
            const secs = totalSeconds % 60;
            const durationStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
            resolve({ thumbnailUrl, durationStr });
            return;
          }
        } catch {
          // Canvas capture pode falhar em codecs restritos
        }
        cleanup();
        const totalSeconds = Math.round(video.duration || 0);
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        resolve({ thumbnailUrl: '', durationStr: `${mins}:${secs < 10 ? '0' : ''}${secs}` });
      };

      video.onerror = () => {
        cleanup();
        resolve({ thumbnailUrl: '', durationStr: '' });
      };
    } catch {
      resolve({ thumbnailUrl: '', durationStr: '' });
    }
  });
}
