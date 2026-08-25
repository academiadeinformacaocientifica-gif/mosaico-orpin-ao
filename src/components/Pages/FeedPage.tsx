import React, { useState } from 'react';
import { Newspaper, Filter, Sparkles } from 'lucide-react';
import { Article } from '../../types';
import { ArticleCard } from '../ArticleCard';

interface FeedPageProps {
  articles: Article[];
  onOpenArticle: (article: Article) => void;
  onToggleBookmark: (articleId: string) => void;
  onToggleLike: (articleId: string) => void;
  bookmarkedIds: Set<string>;
  likedIds: Set<string>;
}

export const FeedPage: React.FC<FeedPageProps> = ({
  articles,
  onOpenArticle,
  onToggleBookmark,
  onToggleLike,
  bookmarkedIds,
  likedIds,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('todos');

  // Extract all unique tags
  const allTags = Array.from(
    new Set(articles.flatMap((a) => a.tags || []))
  );

  const filteredArticles = selectedTag === 'todos'
    ? articles
    : articles.filter((a) => a.tags?.includes(selectedTag));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER */}
      <div className="category-header bg-white p-6 sm:p-9 rounded-2xl my-6 sm:my-8 border-l-6 border-[#d9251d] shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111] mb-1.5 flex items-center gap-2.5">
            <span>Meu Feed Personalizado</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#666]">
            Filtre as publicações e análises de acordo com os seus interesses e tópicos preferidos.
          </p>
        </div>
        <div className="category-badge-count bg-[#f0f0f0] px-4 py-2 rounded-full font-semibold text-xs text-[#444] flex items-center gap-2 shrink-0">
          <Newspaper className="w-4 h-4 text-[#d9251d]" />
          <span>Feed Personalizado</span>
        </div>
      </div>

      {/* TOPIC FILTER CHIPS */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 shrink-0 mr-2">
          <Filter className="w-3.5 h-3.5 text-[#d9251d]" />
          <span>Tópicos:</span>
        </span>

        <button
          onClick={() => setSelectedTag('todos')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
            selectedTag === 'todos'
              ? 'bg-[#d9251d] text-white shadow-xs'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todos os Tópicos
        </button>

        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
              selectedTag === tag
                ? 'bg-[#d9251d] text-white font-bold shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* FEED GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((art) => (
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
