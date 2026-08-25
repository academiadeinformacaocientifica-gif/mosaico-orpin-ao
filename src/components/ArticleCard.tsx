import React from 'react';
import { ThumbsUp, MessageSquare, Bookmark, Calendar } from 'lucide-react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  onOpenArticle: (article: Article) => void;
  onToggleBookmark: (articleId: string) => void;
  onToggleLike: (articleId: string) => void;
  isBookmarked: boolean;
  isLiked: boolean;
  showDate?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onOpenArticle,
  onToggleBookmark,
  onToggleLike,
  isBookmarked,
  isLiked,
  showDate = false,
}) => {
  return (
    <div className="card bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col relative group border border-gray-100 hover:-translate-y-1">
      {/* CARD IMAGE */}
      <div 
        className="overflow-hidden h-48 w-full cursor-pointer bg-gray-100 relative"
        onClick={() => onOpenArticle(article)}
      >
        <img
          src={article.imageUrl}
          alt={article.title}
          className="card-img w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* CARD CONTENT */}
      <div className="card-content p-4 sm:p-5 flex flex-col justify-between flex-grow">
        <div>
          {showDate && (
            <div className="card-date text-[11px] text-[#888] mb-1.5 flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#d9251d]" />
              <span>{article.date}</span>
            </div>
          )}

          <h3
            onClick={() => onOpenArticle(article)}
            className="card-title text-sm sm:text-[15px] font-bold text-[#111] mb-2 leading-snug cursor-pointer group-hover:text-[#d9251d] transition-colors line-clamp-2"
          >
            {article.title}
          </h3>

          {article.description && (
            <p className="card-description text-xs text-[#666] mb-3.5 leading-relaxed line-clamp-2">
              {article.description}
            </p>
          )}
        </div>

        {/* CARD FOOTER */}
        <div className="card-footer flex justify-between items-center text-xs text-[#777] border-t border-[#f0f0f0] pt-3 mt-auto">
          <div className="card-stats flex items-center gap-3.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleLike(article.id);
              }}
              className={`btn-like flex items-center gap-1 cursor-pointer transition-colors ${
                isLiked ? 'text-[#d9251d] font-bold' : 'hover:text-[#d9251d]'
              }`}
              title="Gostar"
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="like-count text-xs">{article.likes + (isLiked ? 1 : 0)}</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenArticle(article);
              }}
              className="btn-comment flex items-center gap-1 text-[#777] hover:text-[#d9251d] cursor-pointer transition-colors"
              title="Comentários"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="text-xs">{article.commentsCount}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(article.id);
            }}
            className={`btn-bookmark cursor-pointer transition-colors p-1 rounded-sm ${
              isBookmarked ? 'text-[#0056b3] font-bold' : 'text-[#777] hover:text-[#0056b3]'
            }`}
            title={isBookmarked ? 'Remover dos favoritos' : 'Guardar artigo'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current text-[#0056b3]' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
