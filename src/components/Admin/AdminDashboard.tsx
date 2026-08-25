/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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

  // Sorted list of articles
  const sortedArticles = [...articles].sort((a, b) => {
    const da = a.isoDate ? new Date(a.isoDate).getTime() : 0;
    const db = b.isoDate ? new Date(b.isoDate).getTime() : 0;
    return db - da;
  });

  // Articles CRUD Handlers
  const handleSaveArticle = async (id: string | null, input: ArticleInput, isPublished: boolean) => {
    if (id) {
      await updateArticle(id, { ...input, isPublished });
      onShowToast(isPublished ? 'Notícia publicada com sucesso.' : 'Rascunho guardado com sucesso.');
    } else {
      await createArticle({ ...input, isPublished });
      onShowToast(isPublished ? 'Notícia publicada com sucesso!' : 'Rascunho guardado com sucesso!');
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

  const handleDeleteArticle = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteArticle(id);
      onShowToast('Notícia removida.');
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
  const handleSaveGallery = async (id: string | null, input: GalleryInput, isPublished: boolean) => {
    if (id) {
      await updateGalleryItem(id, { ...input, isPublished });
      onShowToast(isPublished ? 'Imagem publicada na galeria.' : 'Rascunho de imagem guardado.');
    } else {
      await createGalleryItem({ ...input, isPublished });
      onShowToast(isPublished ? 'Nova imagem publicada na galeria!' : 'Rascunho de imagem guardado!');
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
      onShowToast(nextPublished ? 'Imagem publicada com sucesso!' : 'Imagem colocada em rascunho.');
      onGalleryChanged();
    } catch (err) {
      onShowToast('Erro ao atualizar estado.');
      console.error(err);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteGalleryItem(id);
      onShowToast('Imagem removida da galeria.');
      onGalleryChanged();
    } catch (err) {
      onShowToast('Não foi possível remover o item.');
      console.error(err);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  // Video CRUD Handlers
  const handleSaveVideo = async (id: string | null, input: VideoInput, isPublished: boolean) => {
    if (id) {
      await updateVideoItem(id, { ...input, isPublished });
      onShowToast(isPublished ? 'Vídeo publicado com sucesso.' : 'Rascunho de vídeo guardado.');
    } else {
      await createVideoItem({ ...input, isPublished });
      onShowToast(isPublished ? 'Novo vídeo publicado com sucesso!' : 'Rascunho de vídeo guardado!');
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
      onShowToast('Erro ao atualizar estado.');
      console.error(err);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteVideoItem(id);
      onShowToast('Vídeo removido.');
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
        <div className="max-w-[1150px] mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
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
      <main className="max-w-[1150px] mx-auto px-4 sm:px-6 py-8">
        {/* TOP TITLE & QUICK ACTION BUTTONS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#111] flex items-center gap-2">
              <Layers className="w-6 h-6 text-[#d9251d]" />
              <span>Gestão de Conteúdo</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Faça a gestão e publicação em tempo real de notícias, imagens da galeria e vídeos do portal.
            </p>
          </div>

          {/* ACTION BUTTONS (NOVA NOTÍCIA, NOVA IMAGEM, NOVO VÍDEO) */}
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
        <div className="flex items-center gap-2 border-b border-gray-200 mb-6 bg-white p-1.5 rounded-xl shadow-xs">
          <button
            onClick={() => setActiveTab('noticias')}
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
              {articles.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('galeria')}
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
              {galleryItems.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
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
              {videoItems.length}
            </span>
          </button>
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
            ) : sortedArticles.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-xs">
                <Newspaper className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-gray-800 mb-1">Ainda não há notícias</h3>
                <p className="text-xs text-gray-500 mb-4">Comece por publicar a primeira notícia.</p>
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
                {sortedArticles.map((article) => (
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
                        {article.isFeatured && (
                          <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            Destaque
                          </span>
                        )}
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
            {galleryItems.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-xs">
                <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-gray-800 mb-1">Ainda não há imagens na galeria</h3>
                <p className="text-xs text-gray-500 mb-4">Adicione fotografias e registos visuais.</p>
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
                {galleryItems.map((item) => (
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
            {videoItems.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-xs">
                <VideoIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-gray-800 mb-1">Ainda não há vídeos registados</h3>
                <p className="text-xs text-gray-500 mb-4">Adicione reportagens, transmissões e documentários.</p>
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
                {videoItems.map((item) => (
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
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {item.date} {item.videoUrl ? `• Ficheiro: ${item.videoUrl}` : ''}
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
