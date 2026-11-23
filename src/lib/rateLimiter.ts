/**
 * Sistema de limitação de taxa (Rate Limiting) e proteção contra flooding no cliente.
 * Previne submissões repetitivas acidentais ou abusivas de formulários (Newsletter, Contacto, Pesquisa).
 * Armazena registos em sessionStorage com fallback em memória para proteger o utilizador e a infraestrutura.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const memoryStore: Record<string, number[]> = {};

function getStoreTimestamps(action: string): number[] {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const data = sessionStorage.getItem(`rl_${action}`);
      if (data) {
        const parsed: RateLimitRecord = JSON.parse(data);
        if (Array.isArray(parsed.timestamps)) {
          return parsed.timestamps;
        }
      }
    }
  } catch {
    // Falha silenciosa no sessionStorage (ex: modo privado estrito) -> usa memória
  }
  return memoryStore[action] || [];
}

function setStoreTimestamps(action: string, timestamps: number[]): void {
  memoryStore[action] = timestamps;
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.setItem(`rl_${action}`, JSON.stringify({ timestamps }));
    }
  } catch {
    // Ignora erro de cota ou armazenamento
  }
}

/**
 * Verifica e consome uma tentativa de ação.
 * @param action Identificador único da ação (ex: 'newsletter', 'contact')
 * @param maxAttempts Número máximo de ações permitidas na janela
 * @param windowSeconds Duração da janela temporal em segundos
 * @returns Objeto com status de permissão e tempo de espera restante
 */
export function consumeRateLimit(
  action: string,
  maxAttempts: number = 5,
  windowSeconds: number = 60
): { allowed: boolean; retryAfterSeconds: number; remaining: number } {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const currentTimestamps = getStoreTimestamps(action).filter((t) => now - t < windowMs);

  if (currentTimestamps.length >= maxAttempts) {
    const oldest = currentTimestamps[0];
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return {
      allowed: false,
      retryAfterSeconds,
      remaining: 0,
    };
  }

  currentTimestamps.push(now);
  setStoreTimestamps(action, currentTimestamps);

  return {
    allowed: true,
    retryAfterSeconds: 0,
    remaining: Math.max(0, maxAttempts - currentTimestamps.length),
  };
}

/**
 * Verifica se uma ação está temporariamente bloqueada por intervalo mínimo (cooldown entre envios seguidos).
 * @param action Identificador da ação
 * @param cooldownSeconds Segundos de espera obrigatória entre chamadas
 */
export function checkCooldown(
  action: string,
  cooldownSeconds: number = 5
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const timestamps = getStoreTimestamps(action);
  if (timestamps.length === 0) {
    return { allowed: true, retryAfterSeconds: 0 };
  }

  const lastAttempt = timestamps[timestamps.length - 1];
  const elapsed = (now - lastAttempt) / 1000;

  if (elapsed < cooldownSeconds) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil(cooldownSeconds - elapsed),
    };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}
