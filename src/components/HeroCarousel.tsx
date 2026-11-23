import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ThumbsUp, 
  MessageSquare, 
  Bookmark, 
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Article } from '../types';

interface HeroCarouselProps {
  slides: Article[];
  onOpenArticle: (article: Article) => void;
  onToggleBookmark: (articleId: string) => void;
  onToggleLike: (articleId: string) => void;
  bookmarkedIds: Set<string>;
  likedIds: Set<string>;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  slides,
  onOpenArticle,
  onToggleBookmark,
  onToggleLike,
  bookmarkedIds,
  likedIds,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (!isPaused && slides.length > 1) {
      intervalRef.current = setInterval(nextSlide, 5500);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, slides.length]);

  if (!slides || slides.length === 0) return null;

  const current = slides[currentSlide] || slides[0];
  if (!current) return null;

  const isBookmarked = bookmarkedIds.has(current.id);
  const isLiked = likedIds.has(current.id);

  return (
    <div 
      className="card card-main w-full h-full relative overflow-hidden rounded-2xl min-h-[440px] sm:min-h-[500px] lg:h-[520px] shadow-md group bg-black"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {slides.map((slide, idx) => {
        const isActive = idx === currentSlide;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-700 ease-in-out flex flex-col justify-end ${
              isActive ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
            }`}
            style={{ backgroundImage: `url(${slide.imageUrl})` }}
          >
            {/* DARK GRADIENT OVERLAY */}
            <div className="bg-gradient-to-t from-black/95 via-black/60 to-transparent p-5 sm:p-7 flex flex-col justify-end h-full">
              <div className="flex items-center gap-2 text-white/80 text-[11px] font-medium mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#ffcc00]" />
                <span>{slide.date}</span>
                <span>•</span>
                <span>{slide.readTime}</span>
              </div>

              <h2 
                onClick={() => onOpenArticle(slide)}
                className="text-white text-lg sm:text-2xl font-bold mb-2.5 leading-snug cursor-pointer hover:text-[#ffcc00] transition-colors drop-shadow-md"
              >
                {slide.title}
              </h2>

              <p className="text-white/80 text-xs sm:text-sm line-clamp-2 mb-4 leading-relaxed max-w-xl">
                {slide.description}
              </p>

              {/* READ ARTICLE BUTTON & STATS FOOTER */}
              <div className="flex items-center justify-between border-t border-white/15 pt-3.5 text-white/90">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLike(slide.id);
                    }}
                    className={`flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors py-1 px-2 rounded-md hover:bg-white/10 ${
                      isLiked ? 'text-[#ff4d4d]' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{slide.likes + (isLiked ? 1 : 0)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenArticle(slide);
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white cursor-pointer transition-colors py-1 px-2 rounded-md hover:bg-white/10"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{slide.commentsCount}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(slide.id);
                    }}
                    className={`p-1.5 rounded-md hover:bg-white/10 transition-colors cursor-pointer ${
                      isBookmarked ? 'text-[#ffcc00]' : 'text-white/80 hover:text-white'
                    }`}
                    title={isBookmarked ? 'Remover dos favoritos' : 'Guardar nos favoritos'}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenArticle(slide)}
                    className="bg-[#d9251d] hover:bg-[#b01b14] text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors shadow-xs cursor-pointer"
                  >
                    <span>Ler Artigo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* ARROWS FOR MANUAL CONTROLS */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }}
        className="carousel-btn prev absolute top-1/2 -translate-y-1/2 left-3 w-9 h-9 rounded-full bg-black/40 hover:bg-[#d9251d] text-white flex items-center justify-center z-20 cursor-pointer transition-all opacity-80 hover:opacity-100"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }}
        className="carousel-btn next absolute top-1/2 -translate-y-1/2 right-3 w-9 h-9 rounded-full bg-black/40 hover:bg-[#d9251d] text-white flex items-center justify-center z-20 cursor-pointer transition-all opacity-80 hover:opacity-100"
        aria-label="Próximo slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* INDICATORS (DOTS) */}
      <div className="carousel-indicators absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentSlide(i)}
            className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              i === currentSlide ? 'bg-[#d9251d] w-6' : 'bg-white/50 w-2.5 hover:bg-white/80'
            }`}
            aria-label={`Ir para slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
