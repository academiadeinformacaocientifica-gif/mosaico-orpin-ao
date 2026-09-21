/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Article } from '../types';

export const DEFAULT_PORTAL_META = {
  title: 'MOSAICO - Revista Oficial da Embaixada de Angola em Espanha',
  description:
    'Revista oficial e portal informativo da Embaixada da República de Angola no Reino de Espanha e Principado de Andorra com notícias diplomáticas, consulares, culturais e turísticas.',
  image: '/src/assets/images/icon_mosaico_square_1787501925065.jpg',
  type: 'website',
};

/**
 * Converte qualquer URL de imagem (relativo ou absoluto) num URL absoluto público
 * com protocolo https://, que é obrigatório para crawlers de redes sociais (WhatsApp,
 * Facebook, X/Twitter, LinkedIn, Telegram).
 */
export function getAbsoluteImageUrl(imageUrl?: string, baseUrl?: string): string {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  const base =
    baseUrl ||
    (typeof window !== 'undefined' ? window.location.origin : 'https://mosaico-angola.vercel.app');
  const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  return `${base}${cleanPath}`;
}

function setOrCreateMeta(
  attrName: 'name' | 'property',
  attrValue: string,
  content: string
): void {
  if (typeof document === 'undefined') return;
  let element = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setOrCreateLink(rel: string, href: string): void {
  if (typeof document === 'undefined') return;
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

/**
 * Atualiza todas as tags de Open Graph e Twitter Card no <head> dinamicamente.
 * Garante que a foto de capa e título do artigo apareçam corretamente ao partilhar
 * ou navegar directamente no artigo.
 */
export function updateArticleMetaTags(article: Article): void {
  if (typeof window === 'undefined') return;

  const title = `${article.title} | MOSAICO ANGOLANO`;
  const description = article.description || article.subtitle || DEFAULT_PORTAL_META.description;
  const absoluteImage = getAbsoluteImageUrl(article.imageUrl);
  const currentUrl = window.location.href;

  // Atualizar título do documento
  document.title = title;

  // Meta padrão de descrição
  setOrCreateMeta('name', 'description', description);

  // Open Graph (WhatsApp, Facebook, LinkedIn, Telegram)
  setOrCreateMeta('property', 'og:type', 'article');
  setOrCreateMeta('property', 'og:site_name', 'MOSAICO ANGOLANO');
  setOrCreateMeta('property', 'og:title', article.title);
  setOrCreateMeta('property', 'og:description', description);
  setOrCreateMeta('property', 'og:url', currentUrl);
  if (absoluteImage) {
    setOrCreateMeta('property', 'og:image', absoluteImage);
    setOrCreateMeta('property', 'og:image:secure_url', absoluteImage);
    setOrCreateMeta('property', 'og:image:alt', article.title);
    setOrCreateMeta('property', 'og:image:width', '1200');
    setOrCreateMeta('property', 'og:image:height', '630');
    setOrCreateLink('image_src', absoluteImage);
  }

  // Twitter / X Card
  setOrCreateMeta('name', 'twitter:card', 'summary_large_image');
  setOrCreateMeta('name', 'twitter:title', article.title);
  setOrCreateMeta('name', 'twitter:description', description);
  setOrCreateMeta('name', 'twitter:url', currentUrl);
  if (absoluteImage) {
    setOrCreateMeta('name', 'twitter:image', absoluteImage);
    setOrCreateMeta('name', 'twitter:image:alt', article.title);
  }
}

/**
 * Restaura os metadados padrão do portal (usado ao sair de um artigo).
 */
export function resetPortalMetaTags(): void {
  if (typeof window === 'undefined') return;

  const origin = window.location.origin;
  const defaultImage = getAbsoluteImageUrl(DEFAULT_PORTAL_META.image, origin);

  document.title = DEFAULT_PORTAL_META.title;
  setOrCreateMeta('name', 'description', DEFAULT_PORTAL_META.description);

  setOrCreateMeta('property', 'og:type', 'website');
  setOrCreateMeta('property', 'og:site_name', 'MOSAICO ANGOLANO');
  setOrCreateMeta('property', 'og:title', DEFAULT_PORTAL_META.title);
  setOrCreateMeta('property', 'og:description', DEFAULT_PORTAL_META.description);
  setOrCreateMeta('property', 'og:url', origin);
  if (defaultImage) {
    setOrCreateMeta('property', 'og:image', defaultImage);
    setOrCreateMeta('property', 'og:image:secure_url', defaultImage);
    setOrCreateLink('image_src', defaultImage);
  }

  setOrCreateMeta('name', 'twitter:card', 'summary_large_image');
  setOrCreateMeta('name', 'twitter:title', DEFAULT_PORTAL_META.title);
  setOrCreateMeta('name', 'twitter:description', DEFAULT_PORTAL_META.description);
  if (defaultImage) {
    setOrCreateMeta('name', 'twitter:image', defaultImage);
  }
}
