/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { Article, CategoryId, Comment } from '../types';

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
    date: row.date_label,
    isoDate: row.iso_date,
    readTime: row.read_time,
    imageUrl: row.image_url,
    gallery: row.gallery || undefined,
    likes: row.likes,
    commentsCount: row.comments_count,
    comments: row.comments || undefined,
    isFeatured: row.is_featured,
    isCarousel: row.is_carousel,
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
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('iso_date', { ascending: false });

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('relation "public.articles" does not exist') || error.message?.includes('does not exist')) {
        console.warn('[Mosaico Angolano] Tabela "articles" não encontrada no Supabase. A utilizar catálogo de artigos editorial.');
        return [];
      }
      console.warn('[Mosaico Angolano] Erro ao obter artigos do Supabase:', error.message || error);
      return [];
    }
    if (!data || !Array.isArray(data)) return [];
    return (data as ArticleRow[]).map(rowToArticle);
  } catch (err) {
    console.warn('[Mosaico Angolano] Não foi possível ligar ao Supabase (modo offline/demonstração ativado):', err);
    return [];
  }
}

export async function createArticle(article: ArticleInput): Promise<Article> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não configurado. Defina as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no ficheiro .env.');
  }
  const row = articleToRow(article);
  try {
    let { data, error } = await supabase
      .from('articles')
      .insert(row)
      .select()
      .single();

    // If is_published column does not exist in user's schema, retry without it
    if (error && (error.code === 'PGRST204' || error.message?.includes('is_published'))) {
      const { is_published: _p, ...rowWithoutPublished } = row as any;
      const retryResult = await supabase
        .from('articles')
        .insert(rowWithoutPublished)
        .select()
        .single();
      data = retryResult.data;
      error = retryResult.error;
    }

    if (error) {
      if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        throw new Error('Não foi possível estabelecer ligação ao servidor do Supabase. Verifique a rede.');
      }
      throw error;
    }
    return rowToArticle(data as ArticleRow);
  } catch (err: any) {
    if (err?.message?.includes('Failed to fetch') || err?.name === 'TypeError') {
      throw new Error('Falha de ligação à base de dados. Verifique a configuração do Supabase.');
    }
    throw err;
  }
}

export async function updateArticle(id: string, article: ArticleInput): Promise<Article> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não configurado. Defina as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
  }
  const row = articleToRow(article);
  try {
    const updatePayload: any = { ...row, updated_at: new Date().toISOString() };
    let { data, error } = await supabase
      .from('articles')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    // If is_published column does not exist in user's schema, retry without it
    if (error && (error.code === 'PGRST204' || error.message?.includes('is_published'))) {
      const { is_published: _p, ...payloadWithoutPublished } = updatePayload;
      const retryResult = await supabase
        .from('articles')
        .update(payloadWithoutPublished)
        .eq('id', id)
        .select()
        .single();
      data = retryResult.data;
      error = retryResult.error;
    }

    if (error) {
      if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        throw new Error('Não foi possível estabelecer ligação ao servidor do Supabase. Verifique a rede.');
      }
      throw error;
    }
    return rowToArticle(data as ArticleRow);
  } catch (err: any) {
    if (err?.message?.includes('Failed to fetch') || err?.name === 'TypeError') {
      throw new Error('Falha de ligação à base de dados. Verifique a configuração do Supabase.');
    }
    throw err;
  }
}

export async function deleteArticle(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não configurado. Impossível eliminar da base de dados.');
  }
  try {
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) {
      if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        throw new Error('Não foi possível estabelecer ligação ao servidor do Supabase.');
      }
      throw error;
    }
  } catch (err: any) {
    if (err?.message?.includes('Failed to fetch') || err?.name === 'TypeError') {
      throw new Error('Falha de ligação à base de dados. Verifique a configuração do Supabase.');
    }
    throw err;
  }
}

export async function uploadArticleImage(file: File): Promise<string> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não configurado. Impossível carregar imagem.');
  }
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  try {
    const { error } = await supabase.storage
      .from('article-images')
      .upload(path, file, { cacheControl: '3600', upsert: false });

    if (error) {
      if (error.message?.includes('Bucket not found') || error.message?.includes('not found') || error.message?.includes('does not exist')) {
        throw new Error('O bucket "article-images" não foi encontrado no Supabase Storage. Crie um bucket público com esse nome no painel do Supabase.');
      }
      throw error;
    }

    const { data } = supabase.storage.from('article-images').getPublicUrl(path);
    return data.publicUrl;
  } catch (err: any) {
    if (err?.message?.includes('Failed to fetch') || err?.name === 'TypeError') {
      throw new Error('Falha de ligação ao armazenamento de ficheiros do Supabase.');
    }
    throw err;
  }
}

