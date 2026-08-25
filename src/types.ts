/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CategoryId = 
  | 'politica'
  | 'analise-global' 
  | 'angolberica'
  | 'economia'
  | 'panorama-consular' 
  | 'kamba-cultura'
  | 'kultura-360' 
  | 'turismo'
  | 'todas'
  | 'historia'
  | 'blog';

export type NavPage = 
  | 'home' 
  | 'sobre' 
  | 'politica'
  | 'analise-global' 
  | 'angolberica'
  | 'economia'
  | 'panorama-consular' 
  | 'kamba-cultura'
  | 'kultura-360' 
  | 'turismo' 
  | 'todas'
  | 'feed' 
  | 'favorites' 
  | 'history' 
  | 'blog'
  | 'edicoes'
  | 'galeria'
  | 'videos'
  | 'admin';

export interface Comment {
  id: string;
  author: string;
  avatar?: string;
  role?: string;
  date: string;
  content: string;
  likes: number;
  likedByUser?: boolean;
  replies?: Comment[];
}

export interface Article {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  fullContent?: string[];
  category: string;
  categoryId: CategoryId;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  date: string;
  isoDate: string;
  readTime: string;
  imageUrl: string;
  gallery?: string[];
  likes: number;
  commentsCount: number;
  comments?: Comment[];
  isFeatured?: boolean;
  isCarousel?: boolean;
  isPublished?: boolean;
  tags: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
  image: string;
  isPublished?: boolean;
}

export interface VideoItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  date: string;
  views?: string;
  description: string;
  image: string;
  videoUrl?: string;
  isPublished?: boolean;
}

export interface MagazineEdition {
  id: string;
  editionNumber: number;
  title: string;
  theme: string;
  period: string;
  year: number;
  coverImage: string;
  pdfUrl?: string;
  pagesCount: number;
  highlights: string[];
  editorialNote: string;
}

export interface DiplomaticEvent {
  id: string;
  title: string;
  category: 'Cultura' | 'Diplomacia' | 'Consular' | 'Comércio' | 'Académico';
  date: string;
  time: string;
  location: string;
  city: string;
  description: string;
  organizer: string;
  imageUrl?: string;
  registrationRequired?: boolean;
}

export interface ConsularService {
  id: string;
  title: string;
  category: 'Vistos' | 'Passaportes' | 'Registo Civil' | 'Notariado' | 'Outros';
  processingTime: string;
  fees: string;
  requirements: string[];
  description: string;
  downloadableForms?: { title: string; filename: string }[];
}

export interface HistoricalMilestone {
  year: number;
  dateStr: string;
  title: string;
  description: string;
  significance: string;
  imageUrl?: string;
}
