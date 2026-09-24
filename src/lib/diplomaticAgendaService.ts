/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { DiplomaticEvent } from '../types';
import { getStoredItem, setStoredItem } from './resilientStorage';

const LOCAL_STORAGE_KEY = 'mosaico_diplomatic_events_v1';
const DELETED_EVENTS_KEY = 'mosaico_deleted_diplomatic_events_v1';

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

interface DiplomaticEventRow {
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
  status: string;
  is_published: boolean;
  created_at: string;
}

export type DiplomaticEventInput = {
  title: string;
  category: 'Cultura' | 'Diplomacia' | 'Consular' | 'Comércio' | 'Académico';
  date: string;
  time: string;
  location: string;
  city: string;
  description: string;
  organizer: string;
  imageUrl?: string;
  registrationRequired?: boolean;
  status?: 'Agendado' | 'Em Curso' | 'Concluído';
  isPublished?: boolean;
};

function rowToDiplomaticEvent(row: DiplomaticEventRow): DiplomaticEvent {
  return {
    id: row.id,
    title: row.title,
    category: (row.category as DiplomaticEvent['category']) || 'Diplomacia',
    date: row.date_label,
    time: row.time_label,
    location: row.location,
    city: row.city,
    description: row.description,
    organizer: row.organizer,
    imageUrl: row.image_url || undefined,
    registrationRequired: row.registration_required ?? false,
    status: (row.status as DiplomaticEvent['status']) || 'Agendado',
    isPublished: row.is_published ?? true,
    createdAt: row.created_at,
  };
}

function diplomaticEventToRow(item: DiplomaticEventInput) {
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
    status: item.status || 'Agendado',
    is_published: item.isPublished !== false,
  };
}

export function getLocalDiplomaticEvents(): DiplomaticEvent[] {
  const deletedIds = getDeletedEventIds();
  const saved = getStoredItem<DiplomaticEvent[]>(LOCAL_STORAGE_KEY, []);
  if (Array.isArray(saved)) {
    return saved.filter((e) => !deletedIds.has(e.id));
  }
  return [];
}

export function saveLocalDiplomaticEvents(items: DiplomaticEvent[]): void {
  const deletedIds = getDeletedEventIds();
  const cleanItems = items.filter((item) => !deletedIds.has(item.id));
  setStoredItem(LOCAL_STORAGE_KEY, cleanItems);
}

export async function fetchDiplomaticEvents(): Promise<DiplomaticEvent[]> {
  const deletedIds = getDeletedEventIds();
  const filterOutDeleted = (items: DiplomaticEvent[]): DiplomaticEvent[] => {
    return items.filter((item) => !deletedIds.has(item.id));
  };

  if (!isSupabaseConfigured) {
    return getLocalDiplomaticEvents();
  }

  try {
    const { data, error } = await supabase
      .from('diplomatic_events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      if (
        error.code === 'PGRST205' ||
        error.message?.includes('relation "public.diplomatic_events" does not exist')
      ) {
        console.warn('[Mosaico] Tabela "diplomatic_events" não existe ainda no Supabase. Usando armazenamento local.');
      } else {
        console.warn('[Mosaico] Aviso ao consultar compromissos diplomáticos no Supabase (usando dados locais):', error.message || error);
      }
      return getLocalDiplomaticEvents();
    }

    if (!data || data.length === 0) {
      return getLocalDiplomaticEvents();
    }

    const remoteEvents = data.map(rowToDiplomaticEvent);
    const activeEvents = filterOutDeleted(remoteEvents);
    saveLocalDiplomaticEvents(activeEvents);
    return activeEvents;
  } catch (netErr) {
    console.warn('[Mosaico] Falha de rede/conexão ao buscar compromissos diplomáticos no Supabase. Usando armazenamento local resiliente:', netErr);
    return getLocalDiplomaticEvents();
  }
}

export async function createDiplomaticEvent(input: DiplomaticEventInput): Promise<DiplomaticEvent> {
  const id = `dip-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  unmarkEventAsDeleted(id);

  const newEvent: DiplomaticEvent = {
    id,
    ...input,
    registrationRequired: input.registrationRequired ?? false,
    status: input.status || 'Agendado',
    isPublished: input.isPublished !== false,
    createdAt: new Date().toISOString(),
  };

  // 1. Guardar localmente
  const current = getLocalDiplomaticEvents();
  const updated = [newEvent, ...current];
  saveLocalDiplomaticEvents(updated);

  // 2. Se Supabase configurado, persistir
  if (isSupabaseConfigured) {
    try {
      const row = {
        id,
        ...diplomaticEventToRow(input),
      };

      const { data, error } = await supabase
        .from('diplomatic_events')
        .insert([row])
        .select()
        .single();

      if (error) {
        console.warn('[Mosaico] Falha ao persistir compromisso diplomático no Supabase, mantido localmente:', error.message);
      } else if (data) {
        return rowToDiplomaticEvent(data);
      }
    } catch (err) {
      console.warn('[Mosaico] Exceção de rede ao persistir compromisso diplomático no Supabase, mantido localmente:', err);
    }
  }

  return newEvent;
}

export async function updateDiplomaticEvent(
  id: string,
  input: Partial<DiplomaticEventInput>
): Promise<DiplomaticEvent> {
  // 1. Atualizar localmente
  const current = getLocalDiplomaticEvents();
  const index = current.findIndex((e) => e.id === id);
  if (index === -1) {
    throw new Error('Compromisso diplomático não encontrado');
  }

  const updatedEvent: DiplomaticEvent = {
    ...current[index],
    ...input,
  };
  current[index] = updatedEvent;
  saveLocalDiplomaticEvents(current);

  // 2. Se Supabase configurado, atualizar
  if (isSupabaseConfigured) {
    try {
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
      if (input.status !== undefined) patch.status = input.status;
      if (input.isPublished !== undefined) patch.is_published = input.isPublished;

      const { data, error } = await supabase
        .from('diplomatic_events')
        .update(patch)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.warn('[Mosaico] Falha ao atualizar compromisso diplomático no Supabase, mantido localmente:', error.message);
      } else if (data) {
        return rowToDiplomaticEvent(data);
      }
    } catch (err) {
      console.warn('[Mosaico] Exceção de rede ao atualizar compromisso diplomático no Supabase, mantido localmente:', err);
    }
  }

  return updatedEvent;
}

export async function toggleDiplomaticEventPublish(id: string): Promise<DiplomaticEvent> {
  const current = getLocalDiplomaticEvents();
  const index = current.findIndex((e) => e.id === id);
  if (index === -1) {
    throw new Error('Compromisso diplomático não encontrado');
  }

  const currentStatus = current[index].isPublished !== false;
  const newStatus = !currentStatus;

  return updateDiplomaticEvent(id, { isPublished: newStatus });
}

export async function deleteDiplomaticEvent(id: string): Promise<void> {
  markEventAsDeleted(id);

  // 1. Remover localmente
  const current = getLocalDiplomaticEvents();
  const filtered = current.filter((e) => e.id !== id);
  saveLocalDiplomaticEvents(filtered);

  // 2. Remover do Supabase se configurado
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from('diplomatic_events')
        .delete()
        .eq('id', id);

      if (error) {
        console.warn('[Mosaico] Falha ao apagar compromisso diplomático no Supabase:', error.message);
      }
    } catch (err) {
      console.warn('[Mosaico] Exceção de rede ao apagar compromisso diplomático no Supabase:', err);
    }
  }
}
