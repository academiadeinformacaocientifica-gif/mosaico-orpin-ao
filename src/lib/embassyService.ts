/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { EmbassyInfo } from '../types';
import { DEFAULT_EMBASSY_INFO } from '../data/embassyData';
import { getStoredItem, setStoredItem } from './resilientStorage';

const LOCAL_STORAGE_KEY = 'mosaico_embassy_info_v1';

interface EmbassyInfoRow {
  id: string;
  name: string;
  jurisdiction: string;
  chancery_title: string;
  chancery_subtitle: string | null;
  address_street: string;
  address_details: string | null;
  postal_code: string;
  city: string;
  country: string;
  phone_primary: string;
  phone_secondary: string | null;
  fax: string | null;
  email_general: string;
  email_ambassador: string | null;
  email_consular: string | null;
  email_commercial: string | null;
  office_hours: string;
  consular_hours: string | null;
  website: string;
  institutional_portal: string;
  google_maps_url: string | null;
  updated_at: string;
}

function rowToEmbassyInfo(row: EmbassyInfoRow): EmbassyInfo {
  return {
    id: row.id || DEFAULT_EMBASSY_INFO.id,
    name: row.name || DEFAULT_EMBASSY_INFO.name,
    jurisdiction: row.jurisdiction || DEFAULT_EMBASSY_INFO.jurisdiction,
    chanceryTitle: row.chancery_title || DEFAULT_EMBASSY_INFO.chanceryTitle,
    chancerySubtitle: row.chancery_subtitle || DEFAULT_EMBASSY_INFO.chancerySubtitle,
    addressStreet: row.address_street || DEFAULT_EMBASSY_INFO.addressStreet,
    addressDetails: row.address_details || DEFAULT_EMBASSY_INFO.addressDetails,
    postalCode: row.postal_code || DEFAULT_EMBASSY_INFO.postalCode,
    city: row.city || DEFAULT_EMBASSY_INFO.city,
    country: row.country || DEFAULT_EMBASSY_INFO.country,
    phonePrimary: row.phone_primary || DEFAULT_EMBASSY_INFO.phonePrimary,
    phoneSecondary: row.phone_secondary || DEFAULT_EMBASSY_INFO.phoneSecondary,
    fax: row.fax || DEFAULT_EMBASSY_INFO.fax,
    emailGeneral: row.email_general || DEFAULT_EMBASSY_INFO.emailGeneral,
    emailAmbassador: row.email_ambassador || DEFAULT_EMBASSY_INFO.emailAmbassador,
    emailConsular: row.email_consular || DEFAULT_EMBASSY_INFO.emailConsular,
    emailCommercial: row.email_commercial || DEFAULT_EMBASSY_INFO.emailCommercial,
    officeHours: row.office_hours || DEFAULT_EMBASSY_INFO.officeHours,
    consularHours: row.consular_hours || DEFAULT_EMBASSY_INFO.consularHours,
    website: row.website || DEFAULT_EMBASSY_INFO.website,
    institutionalPortal: row.institutional_portal || DEFAULT_EMBASSY_INFO.institutionalPortal,
    googleMapsUrl: row.google_maps_url || DEFAULT_EMBASSY_INFO.googleMapsUrl,
    updatedAt: row.updated_at,
  };
}

function embassyInfoToRow(info: EmbassyInfo) {
  return {
    id: info.id || DEFAULT_EMBASSY_INFO.id,
    name: info.name,
    jurisdiction: info.jurisdiction,
    chancery_title: info.chanceryTitle,
    chancery_subtitle: info.chancerySubtitle || null,
    address_street: info.addressStreet,
    address_details: info.addressDetails || null,
    postal_code: info.postalCode,
    city: info.city,
    country: info.country,
    phone_primary: info.phonePrimary,
    phone_secondary: info.phoneSecondary || null,
    fax: info.fax || null,
    email_general: info.emailGeneral,
    email_ambassador: info.emailAmbassador || null,
    email_consular: info.emailConsular || null,
    email_commercial: info.emailCommercial || null,
    office_hours: info.officeHours,
    consular_hours: info.consularHours || null,
    website: info.website,
    institutional_portal: info.institutionalPortal,
    google_maps_url: info.googleMapsUrl || null,
    updated_at: new Date().toISOString(),
  };
}

/**
 * Get synchronously from local resilient storage or fallback defaults
 */
export function getLocalEmbassyInfo(): EmbassyInfo {
  const stored = getStoredItem<EmbassyInfo | null>(LOCAL_STORAGE_KEY, null);
  if (stored && typeof stored === 'object' && stored.name) {
    return { ...DEFAULT_EMBASSY_INFO, ...stored };
  }
  return { ...DEFAULT_EMBASSY_INFO };
}

/**
 * Save synchronously to local resilient storage
 */
export function saveLocalEmbassyInfo(info: EmbassyInfo): void {
  setStoredItem(LOCAL_STORAGE_KEY, info);
}

/**
 * Fetch embassy info from Supabase with graceful fallback
 */
export async function fetchEmbassyInfo(): Promise<EmbassyInfo> {
  const local = getLocalEmbassyInfo();

  if (!isSupabaseConfigured) {
    return local;
  }

  try {
    const { data, error } = await supabase
      .from('embassy_info')
      .select('*')
      .eq('id', DEFAULT_EMBASSY_INFO.id)
      .maybeSingle();

    if (error) {
      console.warn('Supabase: falha ao buscar embassy_info, usando local:', error.message);
      return local;
    }

    if (!data) {
      // Table exists but is empty -> try to seed it
      await seedDefaultEmbassyInfo();
      return local;
    }

    const parsed = rowToEmbassyInfo(data as EmbassyInfoRow);
    saveLocalEmbassyInfo(parsed);
    return parsed;
  } catch (err) {
    console.warn('Erro ao conectar ao Supabase para dados da embaixada:', err);
    return local;
  }
}

/**
 * Seed default embassy info into Supabase if not yet present
 */
async function seedDefaultEmbassyInfo(): Promise<void> {
  if (!isSupabaseConfigured) return;

  try {
    const row = embassyInfoToRow(DEFAULT_EMBASSY_INFO);
    await supabase.from('embassy_info').upsert(row);
  } catch (err) {
    console.warn('Não foi possível semear embassy_info no Supabase:', err);
  }
}

/**
 * Update embassy info in Supabase & LocalStorage
 */
export async function updateEmbassyInfo(info: EmbassyInfo): Promise<EmbassyInfo> {
  const updatedInfo: EmbassyInfo = {
    ...info,
    id: info.id || DEFAULT_EMBASSY_INFO.id,
    updatedAt: new Date().toISOString(),
  };

  // Always update local storage first
  saveLocalEmbassyInfo(updatedInfo);

  if (!isSupabaseConfigured) {
    return updatedInfo;
  }

  try {
    const row = embassyInfoToRow(updatedInfo);
    const { data, error } = await supabase
      .from('embassy_info')
      .upsert(row)
      .select()
      .single();

    if (error) {
      console.warn('Erro ao atualizar embassy_info no Supabase:', error.message);
      return updatedInfo;
    }

    if (data) {
      const parsed = rowToEmbassyInfo(data as EmbassyInfoRow);
      saveLocalEmbassyInfo(parsed);
      return parsed;
    }
  } catch (err) {
    console.warn('Falha na sincronização remota de embassy_info:', err);
  }

  return updatedInfo;
}

/**
 * Reset embassy info to defaults
 */
export async function resetEmbassyInfoToDefaults(): Promise<EmbassyInfo> {
  const resetInfo: EmbassyInfo = {
    ...DEFAULT_EMBASSY_INFO,
    updatedAt: new Date().toISOString(),
  };
  return await updateEmbassyInfo(resetInfo);
}
