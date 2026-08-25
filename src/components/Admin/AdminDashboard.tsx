/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Pencil, Trash2, LogOut, Home, Loader2, Star, Newspaper } from 'lucide-react';
import { Article } from '../../types';
import { useAuth } from '../../lib/AuthContext';
import { ArticleInput, createArticle, updateArticle, deleteArticle } from '../../lib/articleService';
import { ArticleFormModal } from './ArticleFormModal';

interface AdminDashboardProps {
  articles: Article[];
  loading: boolean;
  loadError: string | null;
  onArticlesChanged: () => void;
  onGoToSite: () => void;
  onShowToast: (msg: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  articles,
  loading,
  loadError,
  onArticlesChanged,
  onGoToSite,
  onShowToast,
}) => {
  const { user, signOut } = useAuth();
  const [formOpen, setFormOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const sortedArticles = [...articles].sort((a, b) => {
    const da = a.isoDate ? new Date(a.isoDate).getTime() : 0;
    const db = b.isoDate ? new Date(b.isoDate).getTime() : 0;
    return db - da;
  });

  const openNewForm = () => {
    setEditingArticle(null);
    setFormOpen(true);
  };

  const openEditForm = (article: Article) => {
    setEditingArticle(article);
    setFormOpen(true);
  };

  const handleSave = async (id: string | null, input: ArticleInput) => {
    if (id) {
      await updateArticle(id, input);
      onShowToast('Notícia actualizada com sucesso.');
    } else {
      await createArticle(input);
      onShowToast('Notícia publicada com sucesso.');
    }
    setFormOpen(false);
    setEditingArticle(null);
    onArticlesChanged();
  };

  const handleDelete = async (id: string) => {
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

  return (
    <div className="min-h-screen bg-[#f4f5f7]">
      {/* HEADER */}
      <header className="bg-white border-b border-[#e0e0e0] sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
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
              className="flex items-center gap-1.5 text-xs font-semibold text-[#444] hover:text-[#d9251d] px-3 py-1.5 rounded-lg hover:bg-[#f8f9fa] transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              Ver site
            </button>
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#111] hover:bg-[#333] px-3 py-1.5 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-[#111]">Gestão de Notícias</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {loading ? 'A carregar...' : `${articles.length} notícias publicadas`}
            </p>
          </div>
          <button
            onClick={openNewForm}
            className="flex items-center gap-1.5 bg-[#d9251d] hover:bg-[#b91e17] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Nova Notícia
          </button>
        </div>

        {loadError && (
          <div className="bg-red-50 border border-red-200 text-[#d9251d] text-sm rounded-xl p-4 mb-6">
            {loadError}
          </div>
        )}

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
              onClick={openNewForm}
              className="inline-flex items-center gap-1.5 bg-[#d9251d] hover:bg-[#b91e17] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
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
                    onClick={() => openEditForm(article)}
                    className="p-2 rounded-lg text-[#444] hover:text-[#d9251d] hover:bg-red-50 transition-colors cursor-pointer"
                    aria-label="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  {confirmDeleteId === article.id ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleDelete(article.id)}
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
      </main>

      {formOpen && (
        <ArticleFormModal
          initialArticle={editingArticle}
          onClose={() => {
            setFormOpen(false);
            setEditingArticle(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};
