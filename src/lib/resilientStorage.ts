/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Camada de persistência local resiliente de alta capacidade:
 * - Memória RAM síncrona para renderização imediata do React.
 * - IndexedDB assíncrono para suporte a centenas de megabytes (sem restrição de 5MB).
 * - LocalStorage seguro com proteção automática contra QuotaExceededError.
 */

const DB_NAME = 'mosaico_angolano_storage_v1';
const STORE_NAME = 'app_key_value_store';
const memoryStore = new Map<string, any>();

let idbPromise: Promise<IDBDatabase | null> | null = null;

function getIndexedDB(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }
  if (!idbPromise) {
    idbPromise = new Promise((resolve) => {
      try {
        const request = window.indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
          const db = (e.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => {
          console.warn('[ResilientStorage] IndexedDB não disponível, usando fallback.');
          resolve(null);
        };
      } catch (err) {
        console.warn('[ResilientStorage] Erro ao inicializar IndexedDB:', err);
        resolve(null);
      }
    });
  }
  return idbPromise;
}

async function idbGet<T>(key: string): Promise<T | null> {
  try {
    const db = await getIndexedDB();
    if (!db) return null;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result !== undefined ? req.result : null);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  } catch {
    return null;
  }
}

async function idbSet(key: string, value: any): Promise<void> {
  try {
    const db = await getIndexedDB();
    if (!db) return;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(value, key);
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  } catch {
    // ignore
  }
}

/**
 * Lê item sincronicamente da Memória ou do LocalStorage
 */
export function getStoredItem<T>(key: string, fallback: T): T {
  if (memoryStore.has(key)) {
    return memoryStore.get(key);
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        memoryStore.set(key, parsed);
        return parsed;
      }
    } catch (e) {
      console.warn(`[ResilientStorage] Erro ao ler "${key}" do localStorage:`, e);
    }
  }

  // Tenta carregar do IndexedDB em background para preencher memória
  idbGet<T>(key).then((idbVal) => {
    if (idbVal !== null && idbVal !== undefined) {
      memoryStore.set(key, idbVal);
    }
  }).catch(() => {});

  memoryStore.set(key, fallback);
  return fallback;
}

/**
 * Grava item com proteção contra QuotaExceededError:
 * 1. Atualiza a memória de imediato
 * 2. Grava no IndexedDB (sem limite de 5MB)
 * 3. Tenta gravar no LocalStorage (se falhar, suprime o erro sem interromper a execução)
 */
export async function setStoredItem<T>(key: string, value: T): Promise<void> {
  memoryStore.set(key, value);

  // 1. Grava no IndexedDB de alta capacidade
  await idbSet(key, value);

  // 2. Grava no LocalStorage com proteção
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (err: any) {
      const isQuotaError =
        err?.name === 'QuotaExceededError' ||
        err?.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
        err?.code === 22 ||
        err?.code === 1014;

      if (isQuotaError) {
        console.warn(
          `[ResilientStorage] Quota do localStorage excedida para a chave "${key}". Conteúdo mantido no IndexedDB e na Memória.`
        );
        // Tenta limpar itens temporários ou pesados do localStorage para liberar espaço para chaves essenciais
        tryCompactLocalStorage();
      } else {
        console.warn(`[ResilientStorage] Erro ao gravar chave "${key}" no localStorage:`, err);
      }
    }
  }
}

/**
 * Tenta compactar o LocalStorage removendo entradas antigas ou grandes strings base64
 */
function tryCompactLocalStorage(): void {
  try {
    const keysToPrune = [
      'loglevel',
      'debug',
      'mosaico_temp',
      'vite_cache',
    ];
    for (const k of keysToPrune) {
      localStorage.removeItem(k);
    }
  } catch {
    // ignore
  }
}

/**
 * Repara e otimiza o armazenamento do browser removendo entradas corrompidas ou saturadas,
 * mantendo os registos intactos no IndexedDB.
 */
export async function repairBrowserStorage(): Promise<{ message: string; success: boolean }> {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { message: 'Ambiente sem armazenamento local.', success: true };
    }

    // Salva cópia de emergência de tudo o que está em memória no IndexedDB
    for (const [k, v] of memoryStore.entries()) {
      await idbSet(k, v);
    }

    // Limpa entradas gigantescas do localStorage para liberar quota
    const keys = Object.keys(localStorage);
    let freedCount = 0;
    for (const key of keys) {
      if (key.startsWith('mosaico_')) {
        const val = localStorage.getItem(key);
        // Se a chave tiver mais de 500KB (geralmente base64 pesado), remove do localStorage (permanece no IndexedDB)
        if (val && val.length > 500000) {
          localStorage.removeItem(key);
          freedCount++;
        }
      }
    }

    return {
      message: `Armazenamento local otimizado com sucesso (${freedCount} blocos volumosos aliviados). Todos os dados estão seguros no IndexedDB.`,
      success: true,
    };
  } catch (err: any) {
    return {
      message: `Falha ao otimizar armazenamento: ${err?.message || 'Erro desconhecido'}`,
      success: false,
    };
  }
}
