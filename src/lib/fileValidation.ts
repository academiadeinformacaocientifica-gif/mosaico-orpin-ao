/**
 * Utilitário de validação de ficheiros para uploads no portal Mosaico.
 * Garante segurança, integridade de tipos MIME e controlo de peso máximo.
 */

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

const ALLOWED_IMAGE_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.svg',
]);

const ALLOWED_DOC_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
]);

const ALLOWED_DOC_EXTENSIONS = new Set([
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.txt',
]);

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) return '';
  return filename.slice(lastDot).toLowerCase();
}

/**
 * Valida se um ficheiro de imagem cumpre os requisitos de extensão, tipo MIME e tamanho máximo.
 * Limite predefinido: 15 MB.
 */
export function validateImageFile(
  file: File,
  maxBytes: number = 15 * 1024 * 1024
): FileValidationResult {
  if (!file) {
    return { valid: false, error: 'Nenhum ficheiro selecionado.' };
  }

  // 1. Validação de peso
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `O ficheiro "${file.name}" tem ${formatFileSize(file.size)}, excedendo o limite de ${formatFileSize(maxBytes)}.`,
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: `O ficheiro "${file.name}" está vazio ou corrompido.`,
    };
  }

  // 2. Validação de extensão
  const ext = getFileExtension(file.name);
  if (!ALLOWED_IMAGE_EXTENSIONS.has(ext)) {
    return {
      valid: false,
      error: `Formato de ficheiro não suportado (${ext || 'sem extensão'}). Formatos aceites: JPG, PNG, WEBP, GIF, SVG.`,
    };
  }

  // 3. Validação de MIME Type (se fornecido pelo browser)
  if (file.type && !ALLOWED_IMAGE_TYPES.has(file.type.toLowerCase())) {
    return {
      valid: false,
      error: `Tipo de ficheiro inválido (${file.type}). Por favor selecione uma imagem válida.`,
    };
  }

  return { valid: true };
}

/**
 * Valida se um documento cumpre os requisitos de formato oficial e peso máximo.
 * Limite predefinido: 20 MB.
 */
export function validateDocumentFile(
  file: File,
  maxBytes: number = 20 * 1024 * 1024
): FileValidationResult {
  if (!file) {
    return { valid: false, error: 'Nenhum documento selecionado.' };
  }

  // 1. Validação de peso
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `O documento "${file.name}" tem ${formatFileSize(file.size)}, excedendo o limite de ${formatFileSize(maxBytes)}.`,
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: `O documento "${file.name}" está vazio ou corrompido.`,
    };
  }

  // 2. Validação de extensão
  const ext = getFileExtension(file.name);
  if (!ALLOWED_DOC_EXTENSIONS.has(ext)) {
    return {
      valid: false,
      error: `Formato de documento não autorizado (${ext || 'sem extensão'}). Formatos aceites: PDF, DOCX, DOC, XLS, XLSX.`,
    };
  }

  // 3. Validação de MIME Type
  if (file.type && !ALLOWED_DOC_TYPES.has(file.type.toLowerCase())) {
    return {
      valid: false,
      error: `Tipo de documento não permitido (${file.type}). Por favor selecione um documento oficial (PDF, Word ou Excel).`,
    };
  }

  return { valid: true };
}
