/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Utilitário para otimização e compressão de imagens no cliente (Browser).
 * Reduz fotos de câmaras e smartphones (3-15MB) para versões leves (~80-180KB)
 * em formato JPEG/WebP com qualidade 82% e resolução máxima de 1600px.
 * Isso impede que o localStorage esgote a quota (QuotaExceededError) e
 * acelera o carregamento do portal.
 */

export interface OptimizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: 'image/jpeg' | 'image/webp';
}

const DEFAULT_OPTIONS: Required<OptimizeOptions> = {
  maxWidth: 1600,
  maxHeight: 1600,
  quality: 0.82,
  mimeType: 'image/jpeg',
};

export async function fileToDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

export async function optimizeImage(
  input: File | Blob | string,
  options?: OptimizeOptions
): Promise<string> {
  // Se for um URL remoto normal (https://...) ou imagem já leve (svg, etc.), retorna direto
  if (typeof input === 'string') {
    if (input.startsWith('http://') || input.startsWith('https://')) {
      return input;
    }
    if (input.startsWith('data:image/svg+xml')) {
      return input;
    }
    // Se for um dataUrl pequeno (< 50KB), não precisa reprocessar
    if (input.startsWith('data:image/') && input.length < 60000) {
      return input;
    }
  }

  const opts = { ...DEFAULT_OPTIONS, ...options };

  try {
    const sourceDataUrl = typeof input === 'string' ? input : await fileToDataUrl(input);

    return await new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (!width || !height) {
          resolve(sourceDataUrl);
          return;
        }

        // Calcula proporções máximas mantendo o rácio
        if (width > opts.maxWidth || height > opts.maxHeight) {
          if (width / height > opts.maxWidth / opts.maxHeight) {
            height = Math.round((height * opts.maxWidth) / width);
            width = opts.maxWidth;
          } else {
            width = Math.round((width * opts.maxHeight) / height);
            height = opts.maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(sourceDataUrl);
          return;
        }

        // Fundo branco para imagens com transparência convertidas para JPEG
        if (opts.mimeType === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        try {
          const optimized = canvas.toDataURL(opts.mimeType, opts.quality);
          resolve(optimized);
        } catch {
          // Fallback caso canvas.toDataURL falhe
          resolve(sourceDataUrl);
        }
      };

      img.onerror = () => {
        // Se a imagem falhar ao carregar no canvas, devolve original
        resolve(sourceDataUrl);
      };

      img.src = sourceDataUrl;
    });
  } catch (err) {
    console.warn('[ImageOptimizer] Aviso ao otimizar imagem, mantendo formato base:', err);
    if (typeof input === 'string') return input;
    return fileToDataUrl(input);
  }
}
