/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { Article, CategoryId, Comment } from '../types';
import { initialArticles } from '../data/articles';
import { optimizeImage, fileToDataUrl } from './imageOptimizer';
import { getStoredItem, setStoredItem } from './resilientStorage';

const LOCAL_STORAGE_KEY = 'mosaico_articles_v5';

interface ArticleRow {
  id: string;
  title: string;
  subtitle: string | null;
  description: string;
  full_content: string[] | null;
  category: string;
  category_id: CategoryId;
  author_name: string;
  author_role: string;
  author_avatar: string | null;
  source?: string | null;
  date_label: string;
  iso_date: string;
  read_time: string;
  image_url: string;
  gallery: string[] | null;
  likes: number;
  comments_count: number;
  comments: Comment[] | null;
  is_featured: boolean;
  is_carousel: boolean;
  is_published: boolean;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export type ArticleInput = Omit<Article, 'likes' | 'commentsCount' | 'comments'> & {
  likes?: number;
  commentsCount?: number;
  comments?: Comment[];
  isPublished?: boolean;
};

function rowToArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle || undefined,
    description: row.description,
    fullContent: row.full_content || undefined,
    category: row.category,
    categoryId: row.category_id,
    author: {
      name: row.author_name,
      role: row.author_role,
      avatar: row.author_avatar || undefined,
    },
    source: row.source || undefined,
    date: row.date_label,
    isoDate: row.iso_date,
    readTime: row.read_time,
    imageUrl: row.image_url,
    gallery: row.gallery || undefined,
    likes: row.likes,
    commentsCount: row.comments_count,
    comments: row.comments || undefined,
    isFeatured: Boolean(row.is_featured),
    isCarousel: Boolean(row.is_carousel),
    isPublished: row.is_published ?? true,
    tags: row.tags || [],
  };
}

function articleToRow(article: ArticleInput): Omit<ArticleRow, 'created_at' | 'updated_at'> {
  return {
    id: article.id,
    title: article.title,
    subtitle: article.subtitle || null,
    description: article.description,
    full_content: article.fullContent || null,
    category: article.category,
    category_id: article.categoryId,
    author_name: article.author.name,
    author_role: article.author.role,
    author_avatar: article.author.avatar || null,
    source: article.source || null,
    date_label: article.date,
    iso_date: article.isoDate,
    read_time: article.readTime,
    image_url: article.imageUrl,
    gallery: article.gallery || null,
    likes: article.likes ?? 0,
    comments_count: article.commentsCount ?? 0,
    comments: article.comments || [],
    is_featured: Boolean(article.isFeatured),
    is_carousel: Boolean(article.isCarousel),
    is_published: article.isPublished !== false,
    tags: article.tags || [],
  };
}

function getLocalArticles(): Article[] {
  const items = getStoredItem<Article[]>(LOCAL_STORAGE_KEY, initialArticles);
  return Array.isArray(items) && items.length > 0 ? items : initialArticles;
}

function saveLocalArticles(items: Article[]) {
  setStoredItem(LOCAL_STORAGE_KEY, items);
}

export function slugify(title: string): string {
  const base = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
    .replace(/^-+|-+$/g, '');
  const suffix = Math.random().toString(36).slice(2, 7);
  return `art-${base || 'noticia'}-${suffix}`;
}

export async function fetchArticles(): Promise<Article[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('iso_date', { ascending: false });

      if (error) {
        console.warn('[Mosaico Angolano] Erro ao obter artigos do Supabase:', error.message || error);
        return getLocalArticles();
      }
      if (data && Array.isArray(data) && data.length > 0) {
        const fromDb = (data as ArticleRow[]).map(rowToArticle);
        saveLocalArticles(fromDb);
        return fromDb;
      }
    } catch (err) {
      console.warn('[Mosaico Angolano] Falha de ligação ao Supabase:', err);
    }
  }
  return getLocalArticles();
}

export async function createArticle(article: ArticleInput): Promise<Article> {
  const newArticle: Article = {
    id: article.id || slugify(article.title),
    title: article.title,
    subtitle: article.subtitle,
    description: article.description,
    fullContent: article.fullContent,
    category: article.category,
    categoryId: article.categoryId,
    author: article.author,
    source: article.source,
    date: article.date,
    isoDate: article.isoDate,
    readTime: article.readTime,
    imageUrl: article.imageUrl,
    gallery: article.gallery,
    likes: article.likes ?? 0,
    commentsCount: article.commentsCount ?? 0,
    comments: article.comments || [],
    isFeatured: Boolean(article.isFeatured),
    isCarousel: Boolean(article.isCarousel),
    isPublished: article.isPublished !== false,
    tags: article.tags || [],
  };

  if (isSupabaseConfigured) {
    const row = articleToRow(newArticle);
    try {
      let { data, error } = await supabase
        .from('articles')
        .insert(row)
        .select()
        .single();

      if (error && (error.code === 'PGRST204' || error.message?.includes('is_published') || error.message?.includes('source'))) {
        const fallbackRow: any = { ...row };
        if (error.message?.includes('is_published') || error.code === 'PGRST204') delete fallbackRow.is_published;
        if (error.message?.includes('source') || error.code === 'PGRST204') delete fallbackRow.source;
        const retryResult = await supabase
          .from('articles')
          .insert(fallbackRow)
          .select()
          .single();
        data = retryResult.data;
        error = retryResult.error;
      }

      if (!error && data) {
        const saved = rowToArticle(data as ArticleRow);
        // Retain client source if database didn't have the column yet
        if (!saved.source && newArticle.source) {
          saved.source = newArticle.source;
        }
        const current = getLocalArticles();
        saveLocalArticles([saved, ...current.filter((a) => a.id !== saved.id)]);
        return saved;
      }
    } catch (err) {
      console.warn('Erro ao guardar no Supabase, a guardar localmente:', err);
    }
  }

  const current = getLocalArticles();
  const updated = [newArticle, ...current.filter((a) => a.id !== newArticle.id)];
  saveLocalArticles(updated);
  return newArticle;
}

export async function updateArticle(id: string, article: ArticleInput): Promise<Article> {
  const updatedArticle: Article = {
    id,
    title: article.title,
    subtitle: article.subtitle,
    description: article.description,
    fullContent: article.fullContent,
    category: article.category,
    categoryId: article.categoryId,
    author: article.author,
    source: article.source,
    date: article.date,
    isoDate: article.isoDate,
    readTime: article.readTime,
    imageUrl: article.imageUrl,
    gallery: article.gallery,
    likes: article.likes ?? 0,
    commentsCount: article.commentsCount ?? 0,
    comments: article.comments || [],
    isFeatured: Boolean(article.isFeatured),
    isCarousel: Boolean(article.isCarousel),
    isPublished: article.isPublished !== false,
    tags: article.tags || [],
  };

  if (isSupabaseConfigured) {
    const row = articleToRow(updatedArticle);
    try {
      const updatePayload: any = { ...row, updated_at: new Date().toISOString() };
      let { data, error } = await supabase
        .from('articles')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error && (error.code === 'PGRST204' || error.message?.includes('is_published') || error.message?.includes('source'))) {
        const fallbackPayload: any = { ...updatePayload };
        if (error.message?.includes('is_published') || error.code === 'PGRST204') delete fallbackPayload.is_published;
        if (error.message?.includes('source') || error.code === 'PGRST204') delete fallbackPayload.source;
        const retryResult = await supabase
          .from('articles')
          .update(fallbackPayload)
          .eq('id', id)
          .select()
          .single();
        data = retryResult.data;
        error = retryResult.error;
      }

      if (!error && data) {
        const saved = rowToArticle(data as ArticleRow);
        if (!saved.source && updatedArticle.source) {
          saved.source = updatedArticle.source;
        }
        const current = getLocalArticles();
        saveLocalArticles(current.map((a) => (a.id === id ? saved : a)));
        return saved;
      }
    } catch (err) {
      console.warn('Erro ao atualizar no Supabase, a atualizar localmente:', err);
    }
  }

  const current = getLocalArticles();
  const exists = current.some((a) => a.id === id);
  const updatedList = exists
    ? current.map((a) => (a.id === id ? updatedArticle : a))
    : [updatedArticle, ...current];
  saveLocalArticles(updatedList);
  return updatedArticle;
}

export async function deleteArticle(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('articles').delete().eq('id', id);
    } catch (err) {
      console.warn('Erro ao eliminar no Supabase:', err);
    }
  }
  const current = getLocalArticles();
  saveLocalArticles(current.filter((a) => a.id !== id));
}

export async function uploadArticleImage(file: File): Promise<string> {
  // 1. Otimiza previamente a fotografia no browser (reduz de 5-15MB para ~100-150KB)
  let optimizedDataUrl: string;
  try {
    optimizedDataUrl = await optimizeImage(file, { maxWidth: 1600, maxHeight: 1600, quality: 0.82 });
  } catch {
    optimizedDataUrl = await fileToDataUrl(file);
  }

  // 2. Se o Supabase estiver configurado, tenta enviar para o bucket oficial
  if (isSupabaseConfigured) {
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      // Converte o DataURL otimizado em Blob para envio eficiente
      let uploadPayload: Blob | File = file;
      if (optimizedDataUrl.startsWith('data:')) {
        const fetchRes = await fetch(optimizedDataUrl);
        uploadPayload = await fetchRes.blob();
      }

      const { error } = await supabase.storage
        .from('article-images')
        .upload(path, uploadPayload, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/jpeg',
        });

      if (!error) {
        const { data } = supabase.storage.from('article-images').getPublicUrl(path);
        if (data?.publicUrl) {
          return data.publicUrl;
        }
      } else {
        console.warn('[Storage] Aviso no bucket "article-images" do Supabase:', error.message);
      }
    } catch (err) {
      console.warn('[Storage] Falha ao enviar para o bucket do Supabase, usando versão local otimizada:', err);
    }
  }

  // 3. Fallback: devolve a versão otimizada leve (< 150KB), evitando QuotaExceededError
  return optimizedDataUrl;
}

export async function addArticleComment(articleId: string, comment: Comment): Promise<void> {
  const current = getLocalArticles();
  const updated = current.map((a) => {
    if (a.id === articleId) {
      return {
        ...a,
        commentsCount: (a.commentsCount || 0) + 1,
        comments: [comment, ...(a.comments || [])],
      };
    }
    return a;
  });
  saveLocalArticles(updated);
}

export async function toggleArticleLike(articleId: string, increment: boolean): Promise<void> {
  const current = getLocalArticles();
  const updated = current.map((a) => {
    if (a.id === articleId) {
      return {
        ...a,
        likes: Math.max(0, a.likes + (increment ? 1 : -1)),
      };
    }
    return a;
  });
  saveLocalArticles(updated);
}

