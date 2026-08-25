import React from 'react';
import { 
  FolderOpen, 
  Newspaper, 
  Calendar, 
  ThumbsUp, 
  MessageSquare, 
  Bookmark, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Article, CategoryId } from '../../types';
import { ArticleCard } from '../ArticleCard';

interface CategoryPageProps {
  categoryId: CategoryId;
  title: string;
  subtitle: string;
  articles: Article[];
  onOpenArticle: (article: Article) => void;
  onToggleBookmark: (articleId: string) => void;
  onToggleLike: (articleId: string) => void;
  bookmarkedIds: Set<string>;
  likedIds: Set<string>;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  categoryId,
  title,
  subtitle,
  articles,
  onOpenArticle,
  onToggleBookmark,
  onToggleLike,
  bookmarkedIds,
  likedIds,
}) => {
  const featuredArticle = articles[0];
  const restArticles = articles.slice(1);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* CATEGORY HEADER */}
      <div className="category-header bg-white p-6 sm:p-9 rounded-2xl my-6 sm:my-8 border-l-6 border-[#d9251d] shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111] mb-1.5">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-[#666]">
            {subtitle}
          </p>
        </div>
        <div className="category-badge-count bg-[#f0f0f0] px-4 py-2 rounded-full font-semibold text-xs text-[#444] flex items-center gap-2 w-max shrink-0">
          <Newspaper className="w-4 h-4 text-[#d9251d]" />
          <span>Secção de Artigos</span>
        </div>
      </div>

      {/* FEATURED MAIN ARTICLE (IF EXISTS) */}
      {featuredArticle && (
        <div className="featured-article bg-white rounded-2xl overflow-hidden shadow-xs border border-gray-100 grid grid-cols-1 lg:grid-cols-12 mb-8 group">
          <div className="lg:col-span-7 overflow-hidden h-64 sm:h-80 md:h-96 relative bg-gray-900 cursor-pointer" onClick={() => onOpenArticle(featuredArticle)}>
            <img
              src={featuredArticle.imageUrl}
              alt={featuredArticle.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-center bg-white">
            <span className="card-date text-xs text-[#888] font-medium mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#d9251d]" />
              <span>{featuredArticle.date}</span>
            </span>

            <h2
              onClick={() => onOpenArticle(featuredArticle)}
              className="card-title text-lg sm:text-xl font-bold text-[#111] mb-3 leading-snug cursor-pointer group-hover:text-[#d9251d] transition-colors"
            >
              {featuredArticle.title}
            </h2>

            <p className="card-description text-xs sm:text-sm text-[#666] leading-relaxed mb-6 line-clamp-3">
              {featuredArticle.subtitle || featuredArticle.description}
            </p>

            <div className="card-footer flex justify-between items-center text-xs text-[#777] border-t border-[#f0f0f0] pt-4 mt-auto">
              <div className="card-stats flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => onToggleLike(featuredArticle.id)}
                  className={`btn-like flex items-center gap-1.5 cursor-pointer font-medium ${
                    likedIds.has(featuredArticle.id) ? 'text-[#d9251d] font-bold' : 'hover:text-[#d9251d]'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${likedIds.has(featuredArticle.id) ? 'fill-current' : ''}`} />
                  <span>{featuredArticle.likes + (likedIds.has(featuredArticle.id) ? 1 : 0)}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenArticle(featuredArticle)}
                  className="btn-comment flex items-center gap-1.5 hover:text-[#d9251d] cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{featuredArticle.commentsCount}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleBookmark(featuredArticle.id)}
                  className={`p-1.5 rounded-md cursor-pointer ${
                    bookmarkedIds.has(featuredArticle.id) ? 'text-[#0056b3]' : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${bookmarkedIds.has(featuredArticle.id) ? 'fill-current' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={() => onOpenArticle(featuredArticle)}
                  className="bg-[#d9251d] hover:bg-[#b01b14] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                >
                  <span>Ler Artigo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ALL ARTICLES GRID */}
      {restArticles.length > 0 ? (
        <div>
          <h2 className="section-title text-xl font-bold text-[#111] mb-1">
            Mais Artigos em {title}
          </h2>
          <p className="section-subtitle text-xs text-[#666] mb-6">
            Acompanhe as reportagens e reflexões publicadas
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restArticles.map((art) => (
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
        </div>
      ) : (
        articles.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <FolderOpen className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500 font-medium">Nenhum artigo encontrado nesta categoria no momento.</p>
          </div>
        )
      )}
    </div>
  );
};
