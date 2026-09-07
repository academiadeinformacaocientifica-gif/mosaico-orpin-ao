/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { ConsularDocument, consularDocuments as initialConsularDocuments } from '../data/consularServices';
import { getStoredItem, setStoredItem } from './resilientStorage';

const LOCAL_STORAGE_KEY = 'mosaico_consular_documents_v1';
const DELETED_DOCS_KEY = 'mosaico_deleted_consular_docs_v1';

export const CONSULAR_CATEGORIES: {
  id: 'vistos' | 'identidade' | 'notariado' | 'comunidade' | 'viagem';
  label: string;
}[] = [
  { id: 'vistos', label: 'Vistos & Entrada' },
  { id: 'identidade', label: 'Identificação & Registo Civil' },
  { id: 'viagem', label: 'Documentos de Viagem' },
  { id: 'notariado', label: 'Atos Notariais' },
  { id: 'comunidade', label: 'Comunidade & Registo' },
];

function getDeletedDocIds(): Set<string> {
  const arr = getStoredItem<string[]>(DELETED_DOCS_KEY, []);
  return new Set(Array.isArray(arr) ? arr.map(String) : []);
}

function markDocAsDeleted(id: string): void {
  const ids = getDeletedDocIds();
  ids.add(id);
  setStoredItem(DELETED_DOCS_KEY, Array.from(ids));
}

function unmarkDocAsDeleted(id: string): void {
  const ids = getDeletedDocIds();
  if (ids.has(id)) {
    ids.delete(id);
    setStoredItem(DELETED_DOCS_KEY, Array.from(ids));
  }
}

interface ConsularDocRow {
  id: string;
  title: string;
  code: string;
  category: string;
  category_label: string;
  description: string;
  file_format: string;
  file_size: string;
  requirements: string[];
  instructions: string;
  target_audience: string;
  download_file_name: string;
  badge: string | null;
  file_url: string | null;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export type ConsularDocumentInput = {
  title: string;
  code: string;
  category: 'vistos' | 'identidade' | 'notariado' | 'comunidade' | 'viagem';
  categoryLabel?: string;
  description: string;
  fileFormat?: 'PDF' | 'DOCX';
  fileSize?: string;
  requirements: string[];
  instructions?: string;
  targetAudience?: 'Cidadãos Angolanos' | 'Cidadãos Estrangeiros' | 'Geral';
  downloadFileName?: string;
  badge?: string;
  fileUrl?: string;
  isPublished?: boolean;
};

function getCategoryLabel(category: string): string {
  const found = CONSULAR_CATEGORIES.find((c) => c.id === category);
  return found ? found.label : 'Serviços Consulares';
}

function rowToDoc(row: ConsularDocRow): ConsularDocument {
  return {
    id: row.id,
    title: row.title,
    code: row.code,
    category: (row.category as any) || 'vistos',
    categoryLabel: row.category_label || getCategoryLabel(row.category),
    description: row.description,
    fileFormat: (row.file_format as any) || 'PDF',
    fileSize: row.file_size || '300 KB',
    requirements: Array.isArray(row.requirements) ? row.requirements : [],
    instructions: row.instructions || '',
    targetAudience: (row.target_audience as any) || 'Geral',
    downloadFileName: row.download_file_name || `${row.code}_Consulado_Angola.pdf`,
    badge: row.badge || undefined,
    fileUrl: row.file_url || undefined,
    isPublished: row.is_published ?? true,
  };
}

function docToRow(item: ConsularDocumentInput) {
  return {
    title: item.title,
    code: item.code,
    category: item.category,
    category_label: item.categoryLabel || getCategoryLabel(item.category),
    description: item.description,
    file_format: item.fileFormat || 'PDF',
    file_size: item.fileSize || '300 KB',
    requirements: item.requirements || [],
    instructions: item.instructions || '',
    target_audience: item.targetAudience || 'Geral',
    download_file_name: item.downloadFileName || `${item.code}_Consulado_Angola.pdf`,
    badge: item.badge || null,
    file_url: item.fileUrl || null,
    is_published: item.isPublished !== false,
  };
}

export function getLocalConsularDocuments(): ConsularDocument[] {
  const filterOutDeleted = (items: ConsularDocument[]): ConsularDocument[] => {
    const deleted = getDeletedDocIds();
    return items.filter((d) => !deleted.has(d.id));
  };

  const saved = getStoredItem<ConsularDocument[]>(LOCAL_STORAGE_KEY, initialConsularDocuments);
  if (saved && saved.length > 0) {
    return filterOutDeleted(saved);
  }
  return filterOutDeleted(initialConsularDocuments);
}

export function saveLocalConsularDocuments(items: ConsularDocument[]): void {
  setStoredItem(LOCAL_STORAGE_KEY, items);
}

export async function fetchConsularDocuments(): Promise<ConsularDocument[]> {
  const filterOutDeleted = (items: ConsularDocument[]): ConsularDocument[] => {
    const deleted = getDeletedDocIds();
    return items.filter((d) => !deleted.has(d.id));
  };

  if (!isSupabaseConfigured) {
    return getLocalConsularDocuments();
  }

  try {
    const { data, error } = await supabase
      .from('consular_documents')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('Tabela consular_documents indisponível no Supabase, a carregar do armazenamento local:', error.message);
      return getLocalConsularDocuments();
    }

    if (data && data.length > 0) {
      const fromDb = (data as ConsularDocRow[]).map(rowToDoc);
      const filtered = filterOutDeleted(fromDb);
      saveLocalConsularDocuments(filtered);
      return filtered;
    }

    return getLocalConsularDocuments();
  } catch (err) {
    console.warn('Falha na ligação Supabase consular_documents:', err);
    return getLocalConsularDocuments();
  }
}

export async function createConsularDocument(input: ConsularDocumentInput): Promise<ConsularDocument> {
  const isPublished = input.isPublished !== false;

  if (isSupabaseConfigured) {
    try {
      const row = docToRow(input);
      const { data, error } = await supabase
        .from('consular_documents')
        .insert(row)
        .select()
        .single();

      if (!error && data) {
        const item = rowToDoc(data as ConsularDocRow);
        unmarkDocAsDeleted(item.id);
        const current = getLocalConsularDocuments();
        const updated = [...current.filter((d) => d.id !== item.id), item];
        saveLocalConsularDocuments(updated);
        return item;
      }
    } catch (err) {
      console.warn('Erro ao criar no Supabase, guardando localmente:', err);
    }
  }

  // Fallback Local
  const id = `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const newDoc: ConsularDocument = {
    id,
    title: input.title,
    code: input.code,
    category: input.category,
    categoryLabel: input.categoryLabel || getCategoryLabel(input.category),
    description: input.description,
    fileFormat: input.fileFormat || 'PDF',
    fileSize: input.fileSize || '300 KB',
    requirements: input.requirements || [],
    instructions: input.instructions || '',
    targetAudience: input.targetAudience || 'Geral',
    downloadFileName: input.downloadFileName || `${input.code}_Consulado_Angola.pdf`,
    badge: input.badge,
    fileUrl: input.fileUrl,
    isPublished,
  };

  unmarkDocAsDeleted(id);
  const current = getLocalConsularDocuments();
  const updated = [...current, newDoc];
  saveLocalConsularDocuments(updated);
  return newDoc;
}

export async function updateConsularDocument(
  id: string,
  input: ConsularDocumentInput
): Promise<ConsularDocument> {
  const isPublished = input.isPublished !== false;

  if (isSupabaseConfigured) {
    try {
      const updatePayload = {
        ...docToRow(input),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('consular_documents')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        const updatedItem = rowToDoc(data as ConsularDocRow);
        const current = getLocalConsularDocuments();
        const next = current.map((d) => (d.id === id ? updatedItem : d));
        saveLocalConsularDocuments(next);
        return updatedItem;
      }
    } catch (err) {
      console.warn('Erro ao atualizar no Supabase, guardando localmente:', err);
    }
  }

  // Fallback Local
  const current = getLocalConsularDocuments();
  const updatedItem: ConsularDocument = {
    id,
    title: input.title,
    code: input.code,
    category: input.category,
    categoryLabel: input.categoryLabel || getCategoryLabel(input.category),
    description: input.description,
    fileFormat: input.fileFormat || 'PDF',
    fileSize: input.fileSize || '300 KB',
    requirements: input.requirements || [],
    instructions: input.instructions || '',
    targetAudience: input.targetAudience || 'Geral',
    downloadFileName: input.downloadFileName || `${input.code}_Consulado_Angola.pdf`,
    badge: input.badge,
    fileUrl: input.fileUrl,
    isPublished,
  };
  const next = current.map((d) => (d.id === id ? updatedItem : d));
  saveLocalConsularDocuments(next);
  return updatedItem;
}

export async function deleteConsularDocument(id: string): Promise<void> {
  markDocAsDeleted(id);

  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('consular_documents').delete().eq('id', id);
      if (error) {
        console.warn('Erro ao eliminar no Supabase:', error.message);
      }
    } catch (err) {
      console.warn('Erro ao eliminar no Supabase:', err);
    }
  }

  const current = getLocalConsularDocuments();
  saveLocalConsularDocuments(current.filter((d) => d.id !== id));
}

export async function uploadConsularDocumentFile(file: File): Promise<string> {
  if (isSupabaseConfigured) {
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf';
      const path = `docs/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error } = await supabase.storage
        .from('article-images')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type || 'application/pdf',
        });

      if (!error) {
        const { data } = supabase.storage.from('article-images').getPublicUrl(path);
        if (data?.publicUrl) {
          return data.publicUrl;
        }
      }
    } catch (err) {
      console.warn('Falha no upload para bucket Supabase, usando leitor de ficheiro:', err);
    }
  }

  // Fallback to data URL or object URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
