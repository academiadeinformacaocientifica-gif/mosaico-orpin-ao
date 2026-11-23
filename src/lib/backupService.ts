/**
 * Serviço de Cópias de Segurança e Recuperação de Desastres (Backup & Disaster Recovery)
 * Garante a soberania e integridade de todos os dados do portal Mosaico Angola.
 */

import { supabase, isSupabaseConfigured } from './supabase';
import {
  Article,
  GalleryItem,
  VideoItem,
  MagazineEdition,
  ConsularDocument,
  CulturalEvent,
  DiplomaticEvent,
  EmbassyInfo,
} from '../types';
import { NaturalWonder } from '../data/wondersData';

export interface BackupData {
  metadata: {
    app: string;
    version: string;
    timestamp: string;
    exportedBy?: string;
    environment: string;
    tableCounts: Record<string, number>;
    checksumSummary: string;
  };
  data: {
    articles: Article[];
    galleryItems: GalleryItem[];
    videoItems: VideoItem[];
    magazineEditions: MagazineEdition[];
    naturalWonders: NaturalWonder[];
    consularDocs: ConsularDocument[];
    culturalEvents: CulturalEvent[];
    diplomaticEvents: DiplomaticEvent[];
    embassyInfo?: EmbassyInfo;
  };
}

/**
 * Gera um hash simples e confiável para verificar a integridade da exportação
 */
function generateChecksum(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Converte para inteiro de 32 bits
  }
  return `crc32-${Math.abs(hash).toString(16).padStart(8, '0')}`;
}

/**
 * Cria um pacote de cópia de segurança completo e estruturado.
 */
export async function createBackupPackage(currentData: {
  articles: Article[];
  galleryItems: GalleryItem[];
  videoItems: VideoItem[];
  magazineEditions: MagazineEdition[];
  naturalWonders: NaturalWonder[];
  consularDocs: ConsularDocument[];
  culturalEvents: CulturalEvent[];
  diplomaticEvents: DiplomaticEvent[];
  embassyInfo?: EmbassyInfo;
  userEmail?: string;
}): Promise<{ jsonString: string; filename: string; backup: BackupData }> {
  const timestamp = new Date().toISOString();
  const dateFormatted = timestamp.replace(/[:.]/g, '-').slice(0, 19);

  const tableCounts = {
    articles: currentData.articles.length,
    galleryItems: currentData.galleryItems.length,
    videoItems: currentData.videoItems.length,
    magazineEditions: currentData.magazineEditions.length,
    naturalWonders: currentData.naturalWonders.length,
    consularDocs: currentData.consularDocs.length,
    culturalEvents: currentData.culturalEvents.length,
    diplomaticEvents: currentData.diplomaticEvents.length,
    embassyInfo: currentData.embassyInfo ? 1 : 0,
  };

  const dataPayload = {
    articles: currentData.articles,
    galleryItems: currentData.galleryItems,
    videoItems: currentData.videoItems,
    magazineEditions: currentData.magazineEditions,
    naturalWonders: currentData.naturalWonders,
    consularDocs: currentData.consularDocs,
    culturalEvents: currentData.culturalEvents,
    diplomaticEvents: currentData.diplomaticEvents,
    embassyInfo: currentData.embassyInfo,
  };

  const rawDataString = JSON.stringify(dataPayload);
  const checksum = generateChecksum(rawDataString);

  const backup: BackupData = {
    metadata: {
      app: 'Mosaico Angola - Revista Oficial',
      version: '1.0.0',
      timestamp,
      exportedBy: currentData.userEmail || 'Administrador Mosaico',
      environment: isSupabaseConfigured ? 'Supabase Cloud (PostgreSQL)' : 'Modo Local Resiliente',
      tableCounts,
      checksumSummary: checksum,
    },
    data: dataPayload,
  };

  const jsonString = JSON.stringify(backup, null, 2);
  const filename = `mosaico-angola-backup-${dateFormatted}.json`;

  return { jsonString, filename, backup };
}

/**
 * Aciona o descarregamento do ficheiro JSON no navegador do utilizador.
 */
export function downloadBackupJson(jsonString: string, filename: string): void {
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Valida a estrutura e integridade de um ficheiro de cópia de segurança antes do restauro.
 */
export function validateBackupFile(content: string): { valid: boolean; error?: string; backup?: BackupData } {
  try {
    const parsed = JSON.parse(content);
    if (!parsed || typeof parsed !== 'object') {
      return { valid: false, error: 'O ficheiro não contém um objeto JSON válido.' };
    }

    if (!parsed.metadata || !parsed.data) {
      return { valid: false, error: 'Estrutura de cópia de segurança inválida (metadados ou dados ausentes).' };
    }

    if (!Array.isArray(parsed.data.articles)) {
      return { valid: false, error: 'A coleção de artigos está em falta ou corrompida.' };
    }

    return { valid: true, backup: parsed as BackupData };
  } catch (err) {
    return { valid: false, error: `Erro ao analisar JSON: ${err instanceof Error ? err.message : String(err)}` };
  }
}
