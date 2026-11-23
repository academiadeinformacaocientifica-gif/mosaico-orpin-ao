/**
 * Utilitário de sanitização e validação de entradas para o portal Mosaico Angola.
 * Previne ataques de XSS (Cross-Site Scripting), injeção de scripts,
 * truncamento defensivo de strings (anti-DoS) e validação de formatos.
 */

/**
 * Remove tags HTML, atributos de eventos perigosos e caracteres nulos.
 */
export function stripHtml(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    // Remove tags script, style, iframe, object, embed e seu conteúdo
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    // Remove todas as outras tags HTML
    .replace(/<\/?[^>]+(>|$)/g, '')
    // Remove pseudo-protocolos perigosos
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/data:\s*text\/html/gi, '');
}

/**
 * Sanitiza e normaliza texto comum de entrada do utilizador.
 * @param input Texto a sanitizar
 * @param maxLength Limite máximo opcional de caracteres
 */
export function sanitizeText(input: string, maxLength?: number): string {
  if (!input || typeof input !== 'string') return '';

  let sanitized = stripHtml(input)
    // Remove caracteres de controlo (ASCII 0 a 31 e 127) exceto nova linha e tabulação
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim();

  if (maxLength && maxLength > 0 && sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength).trim();
  }

  return sanitized;
}

/**
 * Sanitiza termos de pesquisa para a barra de busca e filtros de conteúdo.
 * Limite predefinido: 100 caracteres.
 */
export function sanitizeSearchQuery(query: string, maxLength: number = 100): string {
  if (!query || typeof query !== 'string') return '';

  return sanitizeText(query, maxLength)
    // Remove operadores de injeção potencialmente problemáticos em filtros textuais
    .replace(/[\0\x08\x09\x1a\n\r"';\\%]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Sanitiza e normaliza um endereço de e-mail.
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return '';
  return email
    .toLowerCase()
    .replace(/[\s<>()[\]\\,;:\x00-\x1F\x7F]/g, '')
    .trim()
    .slice(0, 254);
}

/**
 * Valida se um e-mail possui estrutura RFC compatível e segura.
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const sanitized = sanitizeEmail(email);
  if (sanitized.length < 5 || sanitized.length > 254) return false;

  // Regex robusta e segura (sem risco de backtracking exponencial ReDoS)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(sanitized);
}

/**
 * Verifica se um URL é seguro para links externos ou de mídia (permite apenas https, http ou caminhos relativos).
 * Bloqueia esquemas como javascript:, data:, vbscript:, etc.
 */
export function isSafeUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim().toLowerCase();

  // Permite caminhos relativos legítimos
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return true;

  // Permite protocolos Web seguros
  if (trimmed.startsWith('https://') || trimmed.startsWith('http://') || trimmed.startsWith('mailto:')) {
    return !trimmed.includes('javascript:') && !trimmed.includes('data:');
  }

  return false;
}
