import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Calendar, 
  MapPin, 
  Compass, 
  Award,
  Users,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';
import { Article, MagazineEdition, DiplomaticEvent, NavPage, GalleryItem } from '../../types';
import { NaturalWonder } from '../../data/wondersData';
import { HeroCarousel } from '../HeroCarousel';
import { ArticleCard } from '../ArticleCard';
import { WondersBanner } from '../WondersBanner';

interface HomePageProps {
  carouselArticles: Article[];
  secondaryArticles: Article[];
  latestArticles: Article[];
  magazineEditions: MagazineEdition[];
  upcomingEvents: DiplomaticEvent[];
  galleryItems?: GalleryItem[];
  wonders?: NaturalWonder[];
  onOpenArticle: (article: Article) => void;
  onOpenEdition: (edition: MagazineEdition) => void;
  onToggleBookmark: (articleId: string) => void;
  onToggleLike: (articleId: string) => void;
  bookmarkedIds: Set<string>;
  likedIds: Set<string>;
  onNavigate: (page: NavPage) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  carouselArticles,
  secondaryArticles,
  latestArticles,
  magazineEditions,
  upcomingEvents,
  galleryItems = [],
  wonders,
  onOpenArticle,
  onOpenEdition,
  onToggleBookmark,
  onToggleLike,
  bookmarkedIds,
  likedIds,
  onNavigate,
}) => {
  // Regra: Sempre apenas as 4 imagens mais recentes publicadas
  const featuredImages = galleryItems.slice(0, 4);
  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      
      {/* HERO SECTION GRID: MAIN CAROUSEL + SECONDARY CARDS */}
      <section className={`hero-section ${secondaryArticles.length > 0 ? 'grid grid-cols-1 lg:grid-cols-3 gap-5 lg:h-[520px]' : 'w-full'} my-6 sm:my-8`}>
        {/* CAROUSEL */}
        <div className={secondaryArticles.length > 0 ? 'lg:col-span-2 h-full' : 'w-full'}>
          <HeroCarousel
            slides={carouselArticles}
            onOpenArticle={onOpenArticle}
            onToggleBookmark={onToggleBookmark}
            onToggleLike={onToggleLike}
            bookmarkedIds={bookmarkedIds}
            likedIds={likedIds}
          />
        </div>

        {/* SECONDARY CARDS (EXACTLY TWO FIXED) */}
        {secondaryArticles.length > 0 && (
          <div className="lg:col-span-1 flex flex-col gap-4 lg:h-[520px]">
            {secondaryArticles.slice(0, 2).map((art) => (
              <div 
                key={art.id}
                onClick={() => onOpenArticle(art)}
                className="flex-1 bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer border border-gray-100 group relative"
              >
                <div className="w-full h-32 overflow-hidden flex-shrink-0 bg-gray-100">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3.5 flex flex-col justify-between flex-grow">
                  <div>
                    <div className="text-[11px] text-[#888] mb-1 flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#d9251d]" />
                      <span>{art.date}</span>
                    </div>
                    <h3 className="text-xs sm:text-[13px] font-bold text-[#111] leading-snug line-clamp-2 group-hover:text-[#d9251d] transition-colors">
                      {art.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-[#777] mt-2 pt-2 border-t border-gray-50">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3 text-[#d9251d]" />
                      {art.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {art.commentsCount}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION: ÚLTIMAS PUBLICAÇÕES (4-COLUMN GRID) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="section-title text-xl sm:text-2xl font-bold text-[#111]">
              Últimas Publicações
            </h2>
            <p className="section-subtitle text-xs sm:text-sm text-[#666]">
              Espaço de reflexão sobre temas políticos, culturais e económicos
            </p>
          </div>

          <button
            onClick={() => onNavigate('todas')}
            className="text-xs font-bold text-[#d9251d] hover:text-[#b01b14] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Ver Todas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {latestArticles.slice(0, 4).map((art) => (
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
      </section>

      {/* SHOWCASE BANNER: AS 7 MARAVILHAS NATURAIS & TURISMO DE ANGOLA COM SLIDES / TRANSIÇÃO */}
      <WondersBanner wonders={wonders} onNavigate={onNavigate} />

      {/* SECTION: REVISTA MOSAICO - EDIÇÕES DIGITAIS */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111]">
              Edições da Revista Mosaico
            </h2>
            <p className="text-xs text-[#666] mt-0.5">
              Consulte e descarregue as publicações trimestrais da Chancelaria
            </p>
          </div>

          <button
            onClick={() => onNavigate('edicoes')}
            className="text-xs font-bold text-[#d9251d] hover:text-[#b01b14] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Ver Arquivo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {magazineEditions.map((ed) => (
            <div
              key={ed.id}
              onClick={() => onOpenEdition(ed)}
              className="bg-[#f8f9fa] hover:bg-white rounded-xl p-4 border border-gray-200 transition-all hover:shadow-md cursor-pointer group flex gap-4 items-center"
            >
              <div className="w-20 h-28 rounded-lg overflow-hidden bg-gray-200 shrink-0 shadow-sm relative">
                <img
                  src={ed.coverImage}
                  alt={ed.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] px-1 rounded-sm font-bold">
                  {ed.year}
                </span>
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#d9251d] uppercase block mb-1">
                    {ed.period}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#d9251d] transition-colors line-clamp-2">
                    {ed.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 line-clamp-1 mt-1">
                    {ed.theme}
                  </p>
                </div>
                <span className="text-[10px] text-gray-400 font-medium mt-2 flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-[#d9251d]" />
                  <span>Ler Edição Online</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: IMAGENS E MOMENTOS DIPLOMÁTICOS */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="section-title text-xl sm:text-2xl font-bold text-[#111]">
              Imagens
            </h2>
            <p className="section-subtitle text-xs sm:text-sm text-[#666]">
              Registo visual das cimeiras, visitas oficiais e eventos culturais em Espanha e Andorra
            </p>
          </div>

          <button
            onClick={() => onNavigate('galeria')}
            className="text-xs font-bold text-[#d9251d] hover:text-[#b01b14] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Ver Imagens Completas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {featuredImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {featuredImages.map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigate('galeria')}
                className="bg-white rounded-xl border border-gray-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col"
              >
                <div className="h-36 overflow-hidden relative bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  {item.date && (
                    <span className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[9px] font-medium px-1.5 py-0.5 rounded">
                      {item.date}
                    </span>
                  )}
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <h3 className="text-xs font-bold text-gray-900 line-clamp-2 mb-1 group-hover:text-[#d9251d] transition-colors">
                    {item.title}
                  </h3>
                  <span className="text-[11px] font-medium text-[#d9251d] inline-flex items-center gap-1 mt-1">
                    <span>Ver Imagem</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-200 text-gray-500 text-xs">
            Nenhuma imagem disponível no momento.
          </div>
        )}
      </section>

    </div>
  );
};
