/**
 * Sistema de Auditoria de Segurança e Registo de Eventos (Security Audit Logger)
 * Garante rastreabilidade operacional de acordo com a Lei de Proteção de Dados de Angola (Lei n.º 22/11).
 * Higieniza rigorosamente qualquer dado sensível (palavras-passe e segredos NUNCA são registados).
 */

export type SecurityEventType =
  | 'AUTH_LOGIN_SUCCESS'
  | 'AUTH_LOGIN_FAILURE'
  | 'AUTH_LOGOUT'
  | 'BACKUP_EXPORT'
  | 'CONTENT_CREATE'
  | 'CONTENT_UPDATE'
  | 'CONTENT_DELETE'
  | 'RATE_LIMIT_TRIGGERED'
  | 'SECURITY_VIOLATION';

export interface SecurityLogEntry {
  id: string;
  type: SecurityEventType;
  timestamp: string;
  actorEmail?: string;
  details: string;
  ipPlaceholder?: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface SecurityLogInput {
  type: SecurityEventType;
  actorEmail?: string;
  details: string;
  metadata?: Record<string, string | number | boolean>;
}

const STORAGE_KEY = 'mosaico_security_audit_logs_v1';
const MAX_LOG_ENTRIES = 100;

/**
 * Filtra chaves proibidas que possam conter senhas, tokens ou dados confidenciais.
 */
function sanitizeMetadata(meta?: Record<string, string | number | boolean>): Record<string, string | number | boolean> | undefined {
  if (!meta) return undefined;
  const clean: Record<string, string | number | boolean> = {};

  for (const [key, val] of Object.entries(meta)) {
    const lowerKey = key.toLowerCase();
    if (
      lowerKey.includes('password') ||
      lowerKey.includes('senha') ||
      lowerKey.includes('token') ||
      lowerKey.includes('secret') ||
      lowerKey.includes('key') ||
      lowerKey.includes('auth')
    ) {
      clean[key] = '[CONFIDENCIAL_REMOVIDO]';
    } else {
      clean[key] = val;
    }
  }

  return clean;
}

/**
 * Obtém os registos de auditoria gravados localmente.
 */
export function getSecurityLogs(): SecurityLogEntry[] {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    }
  } catch {
    // Falha silenciosa
  }
  return [];
}

/**
 * Regista um evento de auditoria de segurança de forma higienizada.
 */
export function logSecurityEvent(input: SecurityLogInput): SecurityLogEntry {
  const timestamp = new Date().toISOString();
  const id = `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  const entry: SecurityLogEntry = {
    id,
    type: input.type,
    timestamp,
    actorEmail: input.actorEmail ? input.actorEmail.toLowerCase().trim() : undefined,
    details: input.details,
    metadata: sanitizeMetadata(input.metadata),
  };

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const current = getSecurityLogs();
      const updated = [entry, ...current].slice(0, MAX_LOG_ENTRIES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  } catch {
    // Falha silenciosa de quota
  }

  return entry;
}

/**
 * Limpa o histórico de auditoria local.
 */
export function clearSecurityLogs(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignora
  }
}
