import React from 'react';
import { FileText, Feather, Calendar, ThumbsUp, MessageSquare, Bookmark } from 'lucide-react';
import { Article } from '../../types';
import { ArticleCard } from '../ArticleCard';

interface BlogPageProps {
  articles: Article[];
  onOpenArticle: (article: Article) => void;
  onToggleBookmark: (articleId: string) => void;
  onToggleLike: (articleId: string) => void;
  bookmarkedIds: Set<string>;
  likedIds: Set<string>;
}

export const BlogPage: React.FC<BlogPageProps> = ({
  articles,
  onOpenArticle,
  onToggleBookmark,
  onToggleLike,
  bookmarkedIds,
  likedIds,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* HEADER */}
      <div className="category-header bg-white p-6 sm:p-9 rounded-2xl my-6 sm:my-8 border-l-6 border-[#d9251d] shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111] mb-1.5 flex items-center gap-2">
            <Feather className="w-6 h-6 text-[#d9251d]" />
            <span>Blog & Colunas de Opinião</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#666]">
            Ensaios, reflexões diplomáticas e artigos de opinião dos colaboradores da Revista Mosaico.
          </p>
        </div>
        <div className="category-badge-count bg-[#f0f0f0] px-4 py-2 rounded-full font-semibold text-xs text-[#444] flex items-center gap-2 shrink-0">
          <FileText className="w-4 h-4 text-[#d9251d]" />
          <span>Colunas de Opinião</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((art) => (
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
  );
};
