/**
 * Utilitário de Carregamento Adaptativo de Rede & Poupança de Dados
 * Concebido especialmente para a realidade das telecomunicações em Angola (redes 3G/4G com tarifários por megabyte).
 * Deteta a API Network Information (navigator.connection) e o modo Save-Data do utilizador.
 */

interface NetworkInformation extends EventTarget {
  readonly effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  readonly saveData?: boolean;
  readonly downlink?: number;
  readonly rtt?: number;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}

function getNetworkConnection(): NetworkInformation | undefined {
  if (typeof navigator === 'undefined') return undefined;
  const nav = navigator as NavigatorWithConnection;
  return nav.connection || nav.mozConnection || nav.webkitConnection;
}

/**
 * Verifica se o utilizador está numa rede lenta (2G, 3G ou alta latência RTT > 600ms).
 */
export function isSlowConnection(): boolean {
  const conn = getNetworkConnection();
  if (!conn) return false;

  if (conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g' || conn.effectiveType === '3g') {
    return true;
  }

  if (typeof conn.rtt === 'number' && conn.rtt > 600) {
    return true;
  }

  return false;
}

/**
 * Verifica se o modo 'Poupança de Dados' (Data Saver) está ativado no navegador móvel.
 */
export function isSaveDataEnabled(): boolean {
  const conn = getNetworkConnection();
  return Boolean(conn?.saveData);
}

/**
 * Determina se a aplicação deve entrar em modo defensivo de consumo reduzido de dados.
 */
export function shouldReduceDataUsage(): boolean {
  return isSaveDataEnabled() || isSlowConnection();
}

/**
 * Retorna a categoria estimada de velocidade de ligação.
 */
export function getConnectionSpeed(): 'slow' | 'medium' | 'fast' {
  const conn = getNetworkConnection();
  if (!conn || !conn.effectiveType) return 'fast';

  if (conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g') {
    return 'slow';
  }
  if (conn.effectiveType === '3g') {
    return 'medium';
  }
  return 'fast';
}
