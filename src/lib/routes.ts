/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NavPage } from '../types';

/**
 * Mapa único entre cada "página" lógica da aplicação (NavPage) e o seu URL
 * público, partilhável e indexável. Isto é o que dá a cada secção do portal
 * (categorias, favoritos, edições, etc.) um endereço próprio no browser,
 * mantendo ao mesmo tempo toda a navegação existente (Header, Footer,
 * WondersPage, ArticlePage, ...) inalterada — todos continuam a chamar
 * `onNavigate('politica')`, só a implementação de `onNavigate` é que passou
 * a atualizar o URL real via React Router em vez de apenas o estado interno.
 */
export const PAGE_TO_PATH: Record<NavPage, string> = {
  home: '/',
  sobre: '/sobre',
  politica: '/politica',
  'analise-global': '/analise-global',
  angolberica: '/angolberica',
  economia: '/economia',
  'panorama-consular': '/panorama-consular',
  'kamba-cultura': '/kamba-cultura',
  'kultura-360': '/kultura-360',
  turismo: '/turismo',
  maravilhas: '/maravilhas',
  todas: '/todas',
  feed: '/feed',
  favorites: '/favoritos',
  history: '/historia',
  blog: '/blog',
  edicoes: '/edicoes',
  galeria: '/galeria',
  videos: '/videos',
  admin: '/admin',
};

export const PATH_TO_PAGE: Record<string, NavPage> = Object.fromEntries(
  Object.entries(PAGE_TO_PATH).map(([page, path]) => [path, page as NavPage])
) as Record<string, NavPage>;

/** Resolve o NavPage correspondente ao pathname actual (fallback: 'home'). */
export function resolvePageFromPath(pathname: string): NavPage {
  const clean = pathname.toLowerCase().replace(/\/+$/, '') || '/';
  return PATH_TO_PAGE[clean] ?? 'home';
}

/** Constrói o URL público e partilhável de um artigo. */
export function articlePath(articleId: string): string {
  return `/noticia/${encodeURIComponent(articleId)}`;
}
