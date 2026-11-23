import React from 'react';
import { Bookmark, Trash2, BookOpen, ArrowRight, FolderHeart } from 'lucide-react';
import { Article } from '../../types';
import { ArticleCard } from '../ArticleCard';

interface FavoritesPageProps {
  favoriteArticles: Article[];
  onOpenArticle: (article: Article) => void;
  onToggleBookmark: (articleId: string) => void;
  onToggleLike: (articleId: string) => void;
  bookmarkedIds: Set<string>;
  likedIds: Set<string>;
  onClearAllFavorites: () => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  favoriteArticles,
  onOpenArticle,
  onToggleBookmark,
  onToggleLike,
  bookmarkedIds,
  likedIds,
  onClearAllFavorites,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER */}
      <div className="category-header bg-white p-6 sm:p-9 rounded-2xl my-6 sm:my-8 border-l-6 border-[#0056b3] shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111] mb-1.5">
            Os Seus Artigos Favoritos
          </h1>
          <p className="text-xs sm:text-sm text-[#666]">
            Artigos e notícias guardados para leitura posterior no seu dispositivo.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-[#e8f0fe] text-[#0056b3] px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2">
            <Bookmark className="w-4 h-4 fill-current" />
            <span>Artigos Favoritos</span>
          </div>

          {favoriteArticles.length > 0 && (
            <button
              onClick={onClearAllFavorites}
              className="text-xs text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 p-2 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              title="Limpar todos os favoritos"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Limpar Tudo</span>
            </button>
          )}
        </div>
      </div>

      {favoriteArticles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteArticles.map((art) => (
            <ArticleCard
              key={art.id}
              article={art}
              onOpenArticle={onOpenArticle}
              onToggleBookmark={onToggleBookmark}
              onToggleLike={onToggleLike}
              isBookmarked={bookmarkedIds.has(art.id)}
              isLiked={likedIds.has(art.id)}
              showDate={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-xs flex flex-col items-center justify-center p-6">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-[#0056b3] flex items-center justify-center mb-4">
            <FolderHeart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            Ainda não tem artigos guardados
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mb-6 leading-relaxed">
            Clique no ícone de marcador (<Bookmark className="w-3.5 h-3.5 inline mx-1 text-gray-400" />) em qualquer artigo ou notícia para guardar e aceder facilmente aqui.
          </p>
        </div>
      )}
    </div>
  );
};
