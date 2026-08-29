/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  LogOut,
  Home,
  Loader2,
  Star,
  Newspaper,
  Image as ImageIcon,
  Video as VideoIcon,
  Layers,
  Play,
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { Article, GalleryItem, VideoItem } from '../../types';
import { useAuth } from '../../lib/AuthContext';
import { ArticleInput, createArticle, updateArticle, deleteArticle } from '../../lib/articleService';
import {
  GalleryInput,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from '../../lib/galleryService';
import {
  VideoInput,
  createVideoItem,
  updateVideoItem,
  deleteVideoItem,
} from '../../lib/videoService';
import { ArticleFormModal } from './ArticleFormModal';
import { GalleryFormModal } from './GalleryFormModal';
import { VideoFormModal } from './VideoFormModal';

type AdminTab = 'noticias' | 'galeria' | 'videos';
type StatusFilter = 'todos' | 'publicados' | 'rascunhos';

interface AdminDashboardProps {
  articles: Article[];
  galleryItems: GalleryItem[];
  videoItems: VideoItem[];
  loading: boolean;
  loadError: string | null;
  onArticlesChanged: () => void;
  onGalleryChanged: () => void;
  onVideosChanged: () => void;
  onGoToSite: () => void;
  onShowToast: (msg: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  articles,
  galleryItems,
  videoItems,
  loading,
  loadError,
  onArticlesChanged,
  onGalleryChanged,
  onVideosChanged,
  onGoToSite,
  onShowToast,
}) => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('noticias');

  // Search & Status filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos');

  // Article State
  const [articleFormOpen, setArticleFormOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  // Gallery State
  const [galleryFormOpen, setGalleryFormOpen] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);

  // Video State
  const [videoFormOpen, setVideoFormOpen] = useState(false);
  const [editingVideoItem, setEditingVideoItem] = useState<VideoItem | null>(null);

  // Deletion tracking
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Sorted & Filtered Articles
  const filteredArticles = useMemo(() => {
    return [...articles]
      .sort((a, b) => {
        const da = a.isoDate ? new Date(a.isoDate).getTime() : 0;
        const db = b.isoDate ? new Date(b.isoDate).getTime() : 0;
        return db - da;
      })
      .filter((art) => {
        if (statusFilter === 'publicados' && art.isPublished === false) return false;
        if (statusFilter === 'rascunhos' && art.isPublished !== false) return false;
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          art.title.toLowerCase().includes(q) ||
          art.category.toLowerCase().includes(q) ||
          art.description.toLowerCase().includes(q)
        );
      });
  }, [articles, searchQuery, statusFilter]);

  // Filtered Gallery Items
  const filteredGalleryItems = useMemo(() => {
    return [...galleryItems].filter((item) => {
      if (statusFilter === 'publicados' && item.isPublished === false) return false;
      if (statusFilter === 'rascunhos' && item.isPublished !== false) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    });
  }, [galleryItems, searchQuery, statusFilter]);

  // Filtered Video Items
  const filteredVideoItems = useMemo(() => {
    return [...videoItems].filter((item) => {
      if (statusFilter === 'publicados' && item.isPublished === false) return false;
      if (statusFilter === 'rascunhos' && item.isPublished !== false) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    });
  }, [videoItems, searchQuery, statusFilter]);

  // Stats Counters
  const articleStats = useMemo(() => {
    const published = articles.filter((a) => a.isPublished !== false).length;
    const drafts = articles.length - published;
    return { total: articles.length, published, drafts };
  }, [articles]);

  const galleryStats = useMemo(() => {
    const published = galleryItems.filter((i) => i.isPublished !== false).length;
    const drafts = galleryItems.length - published;
    return { total: galleryItems.length, published, drafts };
  }, [galleryItems]);

  const videoStats = useMemo(() => {
    const published = videoItems.filter((v) => v.isPublished !== false).length;
    const drafts = videoItems.length - published;
    return { total: videoItems.length, published, drafts };
  }, [videoItems]);

  // Articles CRUD Handlers
  const handleSaveArticle = async (id: string | null, input: ArticleInput) => {
    if (id) {
      await updateArticle(id, input);
      onShowToast(input.isPublished ? 'Notícia publicada com sucesso.' : 'Rascunho guardado com sucesso.');
    } else {
      await createArticle(input);
      onShowToast(input.isPublished ? 'Notícia publicada com sucesso!' : 'Rascunho guardado com sucesso!');
    }
    setArticleFormOpen(false);
    setEditingArticle(null);
    onArticlesChanged();
  };

  const handleToggleArticlePublish = async (article: Article) => {
    try {
      const nextPublished = !article.isPublished;
      await updateArticle(article.id, {
        ...article,
        isPublished: nextPublished,
      });
      onShowToast(nextPublished ? 'Notícia publicada com sucesso!' : 'Notícia colocada em rascunho.');
      onArticlesChanged();
    } catch (err) {
      onShowToast('Erro ao atualizar estado de publicação.');
      console.error(err);
    }
  };

  const handleToggleArticleFeatured = async (article: Article) => {
    try {
      const isCurrentlyFeatured = Boolean(article.isFeatured || article.isCarousel);
      const nextFeatured = !isCurrentlyFeatured;
      await updateArticle(article.id, {
        ...article,
        isFeatured: nextFeatured,
        isCarousel: nextFeatured,
      });
      onShowToast(
        nextFeatured
          ? 'Notícia colocada nos destaques (slides) da página principal!'
          : 'Notícia removida dos destaques da página principal.'
      );
      onArticlesChanged();
    } catch (err) {
      onShowToast('Erro ao atualizar destaque da notícia.');
      console.error(err);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteArticle(id);
      onShowToast('Notícia removida com sucesso.');
      onArticlesChanged();
    } catch (err) {
      onShowToast('Não foi possível remover a notícia.');
      console.error(err);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  // Gallery CRUD Handlers
  const handleSaveGallery = async (id: string | null, input: GalleryInput) => {
    if (id) {
      await updateGalleryItem(id, input);
      onShowToast(input.isPublished ? 'Imagem atualizada e publicada na galeria.' : 'Rascunho de imagem guardado.');
    } else {
      await createGalleryItem(input);
      onShowToast(input.isPublished ? 'Nova imagem publicada na galeria!' : 'Rascunho de imagem guardado!');
    }
    setGalleryFormOpen(false);
    setEditingGalleryItem(null);
    onGalleryChanged();
  };

  const handleToggleGalleryPublish = async (item: GalleryItem) => {
    try {
      const nextPublished = !item.isPublished;
      await updateGalleryItem(item.id, {
        ...item,
        isPublished: nextPublished,
      });
      onShowToast(nextPublished ? 'Imagem publicada com sucesso na galeria!' : 'Imagem colocada em rascunho.');
      onGalleryChanged();
    } catch (err) {
      onShowToast('Erro ao atualizar estado da imagem.');
      console.error(err);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteGalleryItem(id);
      onShowToast('Imagem removida da galeria com sucesso.');
      onGalleryChanged();
    } catch (err) {
      onShowToast('Não foi possível remover o registo da galeria.');
      console.error(err);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  // Video CRUD Handlers
  const handleSaveVideo = async (id: string | null, input: VideoInput) => {
    if (id) {
      await updateVideoItem(id, input);
      onShowToast(input.isPublished ? 'Vídeo atualizado e publicado com sucesso.' : 'Rascunho de vídeo guardado.');
    } else {
      await createVideoItem(input);
      onShowToast(input.isPublished ? 'Novo vídeo publicado com sucesso!' : 'Rascunho de vídeo guardado!');
    }
    setVideoFormOpen(false);
    setEditingVideoItem(null);
    onVideosChanged();
  };

  const handleToggleVideoPublish = async (item: VideoItem) => {
    try {
      const nextPublished = !item.isPublished;
      await updateVideoItem(item.id, {
        ...item,
        isPublished: nextPublished,
      });
      onShowToast(nextPublished ? 'Vídeo publicado com sucesso!' : 'Vídeo colocado em rascunho.');
      onVideosChanged();
    } catch (err) {
      onShowToast('Erro ao atualizar estado do vídeo.');
      console.error(err);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteVideoItem(id);
      onShowToast('Vídeo removido com sucesso.');
      onVideosChanged();
    } catch (err) {
      onShowToast('Não foi possível remover o vídeo.');
      console.error(err);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f5f7]">
      {/* HEADER */}
      <header className="bg-white border-b border-[#e0e0e0] sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#d9251d] text-white font-bold text-base px-3.5 py-1.5 rounded-tl-xl rounded-br-xl uppercase tracking-wider">
              MOSAICO
            </div>
            <div>
              <p className="text-sm font-bold text-[#111] leading-tight">
                {user?.name || 'Painel de Administração'}
              </p>
              <p className="text-[11px] text-gray-500 leading-tight">
                {user?.role ? `${user.role} • ` : ''}{user?.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onGoToSite}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#444] hover:text-[#d9251d] px-3 py-1.5 rounded-lg hover:bg-[#f8f9fa] transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              Ver site
            </button>
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#111] hover:bg-[#333] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-[1180px] mx-auto px-4 sm:px-6 py-8">
        {/* TOP TITLE & QUICK ACTION BUTTONS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#111] flex items-center gap-2">
              <Layers className="w-6 h-6 text-[#d9251d]" />
              <span>Gestão de Conteúdos do Portal</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Adicione, edite, publique e remova notícias, registos fotográficos da galeria e conteúdos de vídeo com sincronização instantânea.
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setEditingArticle(null);
                setArticleFormOpen(true);
              }}
              className="flex items-center gap-1.5 bg-[#d9251d] hover:bg-[#b91e17] text-white text-xs sm:text-sm font-semibold px-3.5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Notícia</span>
            </button>

            <button
              onClick={() => {
                setEditingGalleryItem(null);
                setGalleryFormOpen(true);
              }}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-3.5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <ImageIcon className="w-4 h-4" />
              <span>Nova Imagem</span>
            </button>

            <button
              onClick={() => {
                setEditingVideoItem(null);
                setVideoFormOpen(true);
              }}
              className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-semibold px-3.5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <VideoIcon className="w-4 h-4" />
              <span>Novo Vídeo</span>
            </button>
          </div>
        </div>

        {/* TABS SELECTOR */}
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 mb-6 bg-white p-1.5 rounded-xl shadow-xs">
          <button
            onClick={() => {
              setActiveTab('noticias');
              setSearchQuery('');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'noticias'
                ? 'bg-[#d9251d] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>Notícias</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'noticias' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {articleStats.total}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('galeria');
              setSearchQuery('');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'galeria'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Imagens (Galeria)</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'galeria' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {galleryStats.total}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('videos');
              setSearchQuery('');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'videos'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <VideoIcon className="w-4 h-4" />
            <span>Vídeos</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'videos' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {videoStats.total}
            </span>
          </button>
        </div>

        {/* SEARCH AND STATUS FILTER BAR */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Pesquisar em ${
                activeTab === 'noticias' ? 'notícias' : activeTab === 'galeria' ? 'galeria de imagens' : 'vídeos'
              }...`}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white outline-none focus:border-[#d9251d] transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
            <span className="text-xs text-gray-500 font-medium mr-1 hidden sm:inline">Estado:</span>
            <button
              onClick={() => setStatusFilter('todos')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                statusFilter === 'todos'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setStatusFilter('publicados')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                statusFilter === 'publicados'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              Publicados (
              {activeTab === 'noticias'
                ? articleStats.published
                : activeTab === 'galeria'
                ? galleryStats.published
                : videoStats.published}
              )
            </button>
            <button
              onClick={() => setStatusFilter('rascunhos')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                statusFilter === 'rascunhos'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              <Clock className="w-3 h-3" />
              Rascunhos (
              {activeTab === 'noticias'
                ? articleStats.drafts
                : activeTab === 'galeria'
                ? galleryStats.drafts
                : videoStats.drafts}
              )
            </button>
          </div>
        </div>

        {loadError && (
          <div className="bg-red-50 border border-red-200 text-[#d9251d] text-sm rounded-xl p-4 mb-6">
            {loadError}
          </div>
        )}

        {/* TAB 1: NOTÍCIAS */}
        {activeTab === 'noticias' && (
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-6 h-6 text-[#d9251d] animate-spin" />
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-xs">
                <Newspaper className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-gray-800 mb-1">
                  {searchQuery || statusFilter !== 'todos'
                    ? 'Nenhuma notícia encontrada com os filtros aplicados'
                    : 'Ainda não há notícias'}
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  {searchQuery || statusFilter !== 'todos'
                    ? 'Tente ajustar o termo de pesquisa ou os filtros de estado.'
                    : 'Comece por publicar a primeira notícia.'}
                </p>
                <button
                  onClick={() => {
                    setEditingArticle(null);
                    setArticleFormOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 bg-[#d9251d] hover:bg-[#b91e17] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Nova Notícia
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                {filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    className="flex items-center gap-4 px-5 py-4 border-b border-[#f0f0f0] last:border-b-0 hover:bg-[#fafafa] transition-colors"
                  >
                    <img
                      src={article.imageUrl}
                      alt=""
                      className="w-16 h-16 object-cover rounded-lg shrink-0 bg-gray-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold text-[#d9251d] uppercase tracking-wide">
                          {article.category}
                        </span>
                        {article.isPublished !== false ? (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            Publicado
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                            Rascunho
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleToggleArticleFeatured(article)}
                          className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                            article.isFeatured || article.isCarousel
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300/60'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200 border border-transparent'
                          }`}
                          title={
                            article.isFeatured || article.isCarousel
                              ? 'Notícia em Destaque nos Slides. Clique para remover do carrossel.'
                              : 'Notícia não destacada. Clique para colocar nos slides do carrossel.'
                          }
                        >
                          <Star
                            className={`w-3 h-3 ${
                              article.isFeatured || article.isCarousel
                                ? 'fill-amber-500 text-amber-500'
                                : 'text-gray-400'
                            }`}
                          />
                          <span>
                            {article.isFeatured || article.isCarousel
                              ? 'Destaque (Slides)'
                              : 'Sem Destaque'}
                          </span>
                        </button>
                      </div>
                      <h3 className="text-sm font-semibold text-[#111] truncate">{article.title}</h3>
                      <p className="text-[11px] text-gray-500">{article.date}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleToggleArticlePublish(article)}
                        className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                          article.isPublished !== false
                            ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {article.isPublished !== false ? 'Despublicar' : 'Publicar'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingArticle(article);
                          setArticleFormOpen(true);
                        }}
                        className="p-2 rounded-lg text-[#444] hover:text-[#d9251d] hover:bg-red-50 transition-colors cursor-pointer"
                        title="Editar notícia"
                        aria-label="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {confirmDeleteId === article.id ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleDeleteArticle(article.id)}
                            disabled={deletingId === article.id}
                            className="text-[11px] font-bold text-white bg-[#d9251d] px-2.5 py-1.5 rounded-lg cursor-pointer"
                          >
                            {deletingId === article.id ? '...' : 'Confirmar'}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-[11px] font-semibold text-[#666] px-2 py-1.5 cursor-pointer"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(article.id)}
                          className="p-2 rounded-lg text-[#444] hover:text-[#d9251d] hover:bg-red-50 transition-colors cursor-pointer"
                          title="Eliminar notícia"
                          aria-label="Remover"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: GALERIA DE IMAGENS */}
        {activeTab === 'galeria' && (
          <div>
            {filteredGalleryItems.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-xs">
                <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-gray-800 mb-1">
                  {searchQuery || statusFilter !== 'todos'
                    ? 'Nenhum registo fotográfico encontrado com os filtros aplicados'
                    : 'Ainda não há imagens na galeria'}
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  {searchQuery || statusFilter !== 'todos'
                    ? 'Tente ajustar o termo de pesquisa ou o filtro de estado.'
                    : 'Adicione fotografias e registos visuais oficiais.'}
                </p>
                <button
                  onClick={() => {
                    setEditingGalleryItem(null);
                    setGalleryFormOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Nova Imagem
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                {filteredGalleryItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 px-5 py-4 border-b border-[#f0f0f0] last:border-b-0 hover:bg-[#fafafa] transition-colors"
                  >
                    <img
                      src={item.image}
                      alt=""
                      className="w-16 h-16 object-cover rounded-lg shrink-0 bg-gray-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">
                          {item.category}
                        </span>
                        {item.isPublished !== false ? (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            Publicado
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                            Rascunho
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-[#111] truncate">{item.title}</h3>
                      <p className="text-[11px] text-gray-500 line-clamp-1">{item.description}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{item.date}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleToggleGalleryPublish(item)}
                        className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                          item.isPublished !== false
                            ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {item.isPublished !== false ? 'Despublicar' : 'Publicar'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingGalleryItem(item);
                          setGalleryFormOpen(true);
                        }}
                        className="p-2 rounded-lg text-[#444] hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        title="Editar imagem"
                        aria-label="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {confirmDeleteId === item.id ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleDeleteGallery(item.id)}
                            disabled={deletingId === item.id}
                            className="text-[11px] font-bold text-white bg-[#d9251d] px-2.5 py-1.5 rounded-lg cursor-pointer"
                          >
                            {deletingId === item.id ? '...' : 'Confirmar'}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-[11px] font-semibold text-[#666] px-2 py-1.5 cursor-pointer"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(item.id)}
                          className="p-2 rounded-lg text-[#444] hover:text-[#d9251d] hover:bg-red-50 transition-colors cursor-pointer"
                          title="Eliminar imagem da galeria"
                          aria-label="Remover"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: VÍDEOS */}
        {activeTab === 'videos' && (
          <div>
            {filteredVideoItems.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-xs">
                <VideoIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-gray-800 mb-1">
                  {searchQuery || statusFilter !== 'todos'
                    ? 'Nenhum vídeo encontrado com os filtros aplicados'
                    : 'Ainda não há vídeos registados'}
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  {searchQuery || statusFilter !== 'todos'
                    ? 'Tente ajustar o termo de pesquisa ou o filtro de estado.'
                    : 'Adicione reportagens, transmissões e documentários.'}
                </p>
                <button
                  onClick={() => {
                    setEditingVideoItem(null);
                    setVideoFormOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Novo Vídeo
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                {filteredVideoItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 px-5 py-4 border-b border-[#f0f0f0] last:border-b-0 hover:bg-[#fafafa] transition-colors"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                      <img
                        src={item.image}
                        alt=""
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play className="w-4 h-4 text-white fill-white" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wide">
                          {item.category}
                        </span>
                        <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                          ⏱ {item.duration}
                        </span>
                        {item.isPublished !== false ? (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            Publicado
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                            Rascunho
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-[#111] truncate">{item.title}</h3>
                      <p className="text-[11px] text-gray-500 line-clamp-1">{item.description}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1.5">
                        <span>{item.date}</span>
                        {item.videoUrl && (
                          <span className="flex items-center gap-1 text-gray-500 font-mono text-[9px] bg-gray-100 px-1.5 py-0.5 rounded max-w-xs truncate">
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                            {item.videoUrl}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleToggleVideoPublish(item)}
                        className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                          item.isPublished !== false
                            ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {item.isPublished !== false ? 'Despublicar' : 'Publicar'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingVideoItem(item);
                          setVideoFormOpen(true);
                        }}
                        className="p-2 rounded-lg text-[#444] hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
                        title="Editar vídeo"
                        aria-label="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {confirmDeleteId === item.id ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleDeleteVideo(item.id)}
                            disabled={deletingId === item.id}
                            className="text-[11px] font-bold text-white bg-[#d9251d] px-2.5 py-1.5 rounded-lg cursor-pointer"
                          >
                            {deletingId === item.id ? '...' : 'Confirmar'}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-[11px] font-semibold text-[#666] px-2 py-1.5 cursor-pointer"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(item.id)}
                          className="p-2 rounded-lg text-[#444] hover:text-[#d9251d] hover:bg-red-50 transition-colors cursor-pointer"
                          title="Eliminar vídeo"
                          aria-label="Remover"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ARTICLE FORM MODAL */}
      {articleFormOpen && (
        <ArticleFormModal
          initialArticle={editingArticle}
          onClose={() => {
            setArticleFormOpen(false);
            setEditingArticle(null);
          }}
          onSave={handleSaveArticle}
        />
      )}

      {/* GALLERY FORM MODAL */}
      {galleryFormOpen && (
        <GalleryFormModal
          initialItem={editingGalleryItem}
          onClose={() => {
            setGalleryFormOpen(false);
            setEditingGalleryItem(null);
          }}
          onSave={handleSaveGallery}
        />
      )}

      {/* VIDEO FORM MODAL */}
      {videoFormOpen && (
        <VideoFormModal
          initialItem={editingVideoItem}
          onClose={() => {
            setVideoFormOpen(false);
            setEditingVideoItem(null);
          }}
          onSave={handleSaveVideo}
        />
      )}
    </div>
  );
};
