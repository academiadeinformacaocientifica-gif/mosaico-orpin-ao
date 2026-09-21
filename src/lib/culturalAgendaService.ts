/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { CulturalEvent } from '../types';
import { getStoredItem, setStoredItem } from './resilientStorage';

const LOCAL_STORAGE_KEY = 'mosaico_cultural_events_v1';
const DELETED_EVENTS_KEY = 'mosaico_deleted_cultural_events_v1';

function getDeletedEventIds(): Set<string> {
  const arr = getStoredItem<string[]>(DELETED_EVENTS_KEY, []);
  return new Set(Array.isArray(arr) ? arr.map(String) : []);
}

function markEventAsDeleted(id: string): void {
  const ids = getDeletedEventIds();
  ids.add(id);
  setStoredItem(DELETED_EVENTS_KEY, Array.from(ids));
}

function unmarkEventAsDeleted(id: string): void {
  const ids = getDeletedEventIds();
  if (ids.has(id)) {
    ids.delete(id);
    setStoredItem(DELETED_EVENTS_KEY, Array.from(ids));
  }
}

interface CulturalEventRow {
  id: string;
  title: string;
  category: string;
  date_label: string;
  time_label: string;
  location: string;
  city: string;
  description: string;
  organizer: string;
  image_url: string | null;
  registration_required: boolean;
  highlight: boolean;
  is_published: boolean;
  created_at: string;
}

export type CulturalEventInput = {
  title: string;
  category: 'Cinema' | 'Música & Dança' | 'Artes Plásticas' | 'Literatura' | 'Gastronomia' | 'Comunidade';
  date: string;
  time: string;
  location: string;
  city: string;
  description: string;
  organizer: string;
  imageUrl?: string;
  registrationRequired?: boolean;
  highlight?: boolean;
  isPublished?: boolean;
};

function rowToCulturalEvent(row: CulturalEventRow): CulturalEvent {
  return {
    id: row.id,
    title: row.title,
    category: (row.category as CulturalEvent['category']) || 'Comunidade',
    date: row.date_label,
    time: row.time_label,
    location: row.location,
    city: row.city,
    description: row.description,
    organizer: row.organizer,
    imageUrl: row.image_url || undefined,
    registrationRequired: row.registration_required ?? false,
    highlight: row.highlight ?? false,
    isPublished: row.is_published ?? true,
    createdAt: row.created_at,
  };
}

function culturalEventToRow(item: CulturalEventInput) {
  return {
    title: item.title,
    category: item.category,
    date_label: item.date,
    time_label: item.time,
    location: item.location,
    city: item.city,
    description: item.description,
    organizer: item.organizer,
    image_url: item.imageUrl || null,
    registration_required: item.registrationRequired ?? false,
    highlight: item.highlight ?? false,
    is_published: item.isPublished !== false,
  };
}

export function getLocalCulturalEvents(): CulturalEvent[] {
  const deletedIds = getDeletedEventIds();
  const saved = getStoredItem<CulturalEvent[]>(LOCAL_STORAGE_KEY, []);
  if (Array.isArray(saved)) {
    return saved.filter((e) => !deletedIds.has(e.id));
  }
  return [];
}

export function saveLocalCulturalEvents(items: CulturalEvent[]): void {
  const deletedIds = getDeletedEventIds();
  const cleanItems = items.filter((item) => !deletedIds.has(item.id));
  setStoredItem(LOCAL_STORAGE_KEY, cleanItems);
}

export async function fetchCulturalEvents(): Promise<CulturalEvent[]> {
  const deletedIds = getDeletedEventIds();
  const filterOutDeleted = (items: CulturalEvent[]): CulturalEvent[] => {
    return items.filter((item) => !deletedIds.has(item.id));
  };

  if (!isSupabaseConfigured) {
    return getLocalCulturalEvents();
  }

  const { data, error } = await supabase
    .from('cultural_events')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    if (
      error.code === 'PGRST205' ||
      error.message?.includes('relation "public.cultural_events" does not exist')
    ) {
      console.warn('[Mosaico] Tabela "cultural_events" não existe ainda no Supabase. Usando armazenamento local.');
      return getLocalCulturalEvents();
    }
    console.error('Erro ao buscar eventos culturais no Supabase:', error);
    return getLocalCulturalEvents();
  }

  if (!data || data.length === 0) {
    return getLocalCulturalEvents();
  }

  const remoteEvents = data.map(rowToCulturalEvent);
  const activeEvents = filterOutDeleted(remoteEvents);
  saveLocalCulturalEvents(activeEvents);
  return activeEvents;
}

export async function createCulturalEvent(input: CulturalEventInput): Promise<CulturalEvent> {
  const id = `cult-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  unmarkEventAsDeleted(id);

  const newEvent: CulturalEvent = {
    id,
    ...input,
    registrationRequired: input.registrationRequired ?? false,
    highlight: input.highlight ?? false,
    isPublished: input.isPublished !== false,
    createdAt: new Date().toISOString(),
  };

  // 1. Guardar localmente
  const current = getLocalCulturalEvents();
  const updated = [newEvent, ...current];
  saveLocalCulturalEvents(updated);

  // 2. Se Supabase configurado, persistir
  if (isSupabaseConfigured) {
    const row = {
      id,
      ...culturalEventToRow(input),
    };

    const { data, error } = await supabase
      .from('cultural_events')
      .insert([row])
      .select()
      .single();

    if (error) {
      console.warn('[Mosaico] Falha ao persistir evento cultural no Supabase, mantido localmente:', error.message);
    } else if (data) {
      return rowToCulturalEvent(data);
    }
  }

  return newEvent;
}

export async function updateCulturalEvent(
  id: string,
  input: Partial<CulturalEventInput>
): Promise<CulturalEvent> {
  // 1. Atualizar localmente
  const current = getLocalCulturalEvents();
  const index = current.findIndex((e) => e.id === id);
  if (index === -1) {
    throw new Error('Evento cultural não encontrado');
  }

  const updatedEvent: CulturalEvent = {
    ...current[index],
    ...input,
  };
  current[index] = updatedEvent;
  saveLocalCulturalEvents(current);

  // 2. Se Supabase configurado, atualizar
  if (isSupabaseConfigured) {
    const patch: Record<string, unknown> = {};
    if (input.title !== undefined) patch.title = input.title;
    if (input.category !== undefined) patch.category = input.category;
    if (input.date !== undefined) patch.date_label = input.date;
    if (input.time !== undefined) patch.time_label = input.time;
    if (input.location !== undefined) patch.location = input.location;
    if (input.city !== undefined) patch.city = input.city;
    if (input.description !== undefined) patch.description = input.description;
    if (input.organizer !== undefined) patch.organizer = input.organizer;
    if (input.imageUrl !== undefined) patch.image_url = input.imageUrl || null;
    if (input.registrationRequired !== undefined) patch.registration_required = input.registrationRequired;
    if (input.highlight !== undefined) patch.highlight = input.highlight;
    if (input.isPublished !== undefined) patch.is_published = input.isPublished;

    const { data, error } = await supabase
      .from('cultural_events')
      .update(patch)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.warn('[Mosaico] Falha ao atualizar evento cultural no Supabase, mantido localmente:', error.message);
    } else if (data) {
      return rowToCulturalEvent(data);
    }
  }

  return updatedEvent;
}

export async function deleteCulturalEvent(id: string): Promise<void> {
  markEventAsDeleted(id);

  // 1. Remover localmente
  const current = getLocalCulturalEvents();
  const filtered = current.filter((e) => e.id !== id);
  saveLocalCulturalEvents(filtered);

  // 2. Remover do Supabase se configurado
  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from('cultural_events')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('[Mosaico] Falha ao apagar evento cultural no Supabase:', error.message);
    }
  }
}
