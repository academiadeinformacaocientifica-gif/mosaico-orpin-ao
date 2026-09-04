/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  Plane, 
  Calendar, 
  CheckCircle2, 
  Info, 
  ArrowLeft, 
  Share2, 
  Layers, 
  ChevronRight,
  ShieldCheck,
  Sun,
  Camera,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { angolaNaturalWonders, NaturalWonder } from '../../data/wondersData';
import { Article, NavPage } from '../../types';
import { ArticleCard } from '../ArticleCard';

interface WondersPageProps {
  onNavigate: (page: NavPage) => void;
  articles?: Article[];
  wonders?: NaturalWonder[];
  onOpenArticle?: (article: Article) => void;
  onToggleBookmark?: (id: string) => void;
  onToggleLike?: (id: string) => void;
  bookmarkedIds?: Set<string>;
  likedIds?: Set<string>;
  onShowToast?: (msg: string) => void;
}

export const WondersPage: React.FC<WondersPageProps> = ({
  onNavigate,
  articles = [],
  wonders,
  onOpenArticle,
  onToggleBookmark,
  onToggleLike,
  bookmarkedIds = new Set(),
  likedIds = new Set(),
  onShowToast,
}) => {
  const activeWonders = wonders && wonders.length > 0 ? wonders : angolaNaturalWonders;
  const [activeWonderId, setActiveWonderId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ src: string; title: string } | null>(null);
  const [expandedWonder, setExpandedWonder] = useState<Record<string, boolean>>({
    kalandula: true,
    tundavala: true,
    maiombe: true,
    moco: true,
    nzenzo: true,
    carumbo: true,
    chiumbe: true,
  });

  const tourismArticles = articles.filter(
    (a) => a.categoryId === 'turismo' || a.category.toLowerCase().includes('turismo') || a.tags.some(t => t.toLowerCase().includes('turismo') || t.toLowerCase().includes('viag'))
  );

  const toggleExpand = (id: string) => {
    setExpandedWonder(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'As 7 Maravilhas Naturais de Angola | Revista Mosaico',
        text: 'Descubra as 7 Maravilhas Naturais de Angola: Kalandula, Tundavala, Maiombe, Morro do Môco, Nzenzo, Carumbo e Chiumbe.',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      if (onShowToast) {
        onShowToast('Link da página copiado para a área de transferência!');
      }
    }
  };

  const scrollToWonder = (id: string) => {
    setActiveWonderId(id);
    const element = document.getElementById(`wonder-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* BREADCRUMB & TOP NAV BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200/80 pb-4">
        <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
          <button 
            onClick={() => onNavigate('home')}
            className="hover:text-[#d9251d] transition-colors cursor-pointer"
          >
            Início
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-900 font-bold">As 7 Maravilhas de Angola</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Partilhar</span>
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar</span>
          </button>
        </div>
      </div>

      {/* HERO BANNER DE APRESENTAÇÃO */}
      <section className="relative rounded-3xl overflow-hidden shadow-xl border border-stone-800 bg-[#0f1115] text-white p-6 sm:p-12">
        <div className="absolute inset-0 z-0 opacity-25">
          <img 
            src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1920&q=80" 
            alt="Natureza de Angola" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0f1115] via-[#0f1115]/90 to-transparent" />

        <div className="relative z-20 max-w-3xl space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            As 7 Maravilhas Naturais de Angola
          </h1>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
            Eleitas oficialmente através de votação popular em âmbito nacional para consagrar os maiores tesouros geográficos, hidrográficos e ecológicos do território angolano. Conheça cada uma das sete maravilhas com fotografias, enquadramento geográfico, história e dicas práticas de visitação.
          </p>

          {/* ISENÇÃO DE VISTOS INFO BOX */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Isenção de Vistos para Turismo em Angola</span>
                  <span className="text-[10px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded">Em vigor</span>
                </h4>
                <p className="text-xs text-stone-300 mt-0.5">
                  Cidadãos de Espanha, Portugal e de toda a União Europeia beneficiam de isenção de vistos de turismo para estadas de até 30 dias por entrada (máx. 90 dias por ano).
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('panorama-consular')}
              className="shrink-0 bg-white hover:bg-stone-100 text-stone-950 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <span>Ver Requisitos</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* QUICK JUMP NAVIGATION BAR (AS 7 MARAVILHAS) */}
      <section className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-3 px-1">
          <Layers className="w-4 h-4 text-[#d9251d]" />
          <span className="text-xs font-bold uppercase tracking-wider text-stone-800">
            Navegar pelas 7 Maravilhas:
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {activeWonders.map((wonder) => {
            const isCurrent = activeWonderId === wonder.id;
            return (
              <button
                key={wonder.id}
                onClick={() => scrollToWonder(wonder.id)}
                className={`flex flex-col items-start p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#d9251d] text-white border-[#d9251d] shadow-sm'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200/80'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                    isCurrent ? 'bg-white text-[#d9251d]' : 'bg-[#d9251d] text-white'
                  }`}>
                    {wonder.number}
                  </span>
                  <span className={`text-[10px] font-semibold truncate ${isCurrent ? 'text-white/80' : 'text-stone-500'}`}>
                    {wonder.province}
                  </span>
                </div>
                <span className="text-xs font-bold truncate w-full">
                  {wonder.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* APRESENTAÇÃO DETALHADA UMA A UMA */}
      <div className="space-y-12">
        {activeWonders.map((wonder) => {
          const isExpanded = expandedWonder[wonder.id] !== false;

          return (
            <article
              key={wonder.id}
              id={`wonder-${wonder.id}`}
              className="bg-white rounded-3xl border border-gray-200/80 shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg scroll-mt-24"
            >
              {/* HEADER DO CARD DA MARAVILHA */}
              <div className="p-6 sm:p-8 border-b border-gray-100 bg-gradient-to-r from-stone-50 to-white flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#d9251d] text-white flex items-center justify-center text-xl font-black shadow-md shadow-red-950/20 shrink-0">
                    #{wonder.number}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="bg-[#d9251d]/10 text-[#d9251d] text-xs font-bold px-2.5 py-0.5 rounded-md border border-[#d9251d]/20 uppercase">
                        Província de {wonder.province}
                      </span>
                      <span className="text-xs text-stone-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span>{wonder.location}</span>
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                      {wonder.name}
                    </h2>
                    <p className="text-xs sm:text-sm font-semibold text-amber-700 mt-1">
                      {wonder.tagline}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleExpand(wonder.id)}
                    className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer border border-stone-200 flex items-center gap-1 text-xs font-semibold"
                    title={isExpanded ? 'Recolher detalhes' : 'Expandir detalhes'}
                  >
                    <span>{isExpanded ? 'Recolher' : 'Expandir'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* CONTEÚDO PRINCIPAL: IMAGEM PRINCIPAL + DESCRIÇÃO COMPLETA */}
              <div className="p-6 sm:p-8 space-y-8">
                {/* GRID: IMAGEM PRINCIPAL COM MINI-GALERIA E DESTAQUES */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* IMAGEM PRINCIPAL (7 COLUNAS) */}
                  <div className="lg:col-span-7 space-y-3">
                    <div 
                      className="relative rounded-2xl overflow-hidden bg-stone-900 shadow-md aspect-video group cursor-pointer"
                      onClick={() => setSelectedImage({ src: wonder.image, title: `${wonder.name} — ${wonder.province}` })}
                    >
                      <img
                        src={wonder.image}
                        alt={wonder.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <div className="text-white text-xs flex items-center gap-1.5 font-medium">
                          <Camera className="w-4 h-4" />
                          <span>Clique para ampliar a fotografia</span>
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-white/20">
                        {wonder.province}
                      </div>
                    </div>

                    {/* MINI-GALERIA DE FOTOS */}
                    {wonder.galleryImages && wonder.galleryImages.length > 0 && (
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {wonder.galleryImages.map((imgUrl, imgIdx) => (
                          <button
                            key={imgIdx}
                            onClick={() => setSelectedImage({ src: imgUrl, title: `${wonder.name} (Ângulo ${imgIdx + 1})` })}
                            className="w-24 h-16 rounded-xl overflow-hidden border-2 border-transparent hover:border-[#d9251d] shrink-0 transition-all cursor-pointer relative group"
                          >
                            <img
                              src={imgUrl}
                              alt={`${wonder.name} ${imgIdx + 1}`}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* FACTOS RÁPIDOS & DESTAQUES (5 COLUNAS) */}
                  <div className="lg:col-span-5 space-y-4">
                    {/* CARTÃO DE FATOS */}
                    <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200/80">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3 flex items-center gap-1.5">
                        <Info className="w-4 h-4 text-[#d9251d]" />
                        <span>Ficha Técnica & Fatos</span>
                      </h4>
                      <dl className="space-y-2.5 text-xs">
                        {wonder.facts.map((fact, fIdx) => (
                          <div key={fIdx} className="flex items-center justify-between border-b border-stone-200/60 pb-1.5 last:border-0 last:pb-0">
                            <dt className="text-stone-500 font-medium">{fact.label}</dt>
                            <dd className="text-stone-900 font-bold text-right">{fact.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>

                    {/* DESTAQUES ESPECÍFICOS */}
                    <div className="bg-white rounded-2xl p-5 border border-stone-200/80">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Destaques Únicos</span>
                      </h4>
                      <ul className="space-y-2">
                        {wonder.highlights.map((highlight, hIdx) => (
                          <li key={hIdx} className="text-xs text-stone-700 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#d9251d] mt-1.5 shrink-0" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* TEXTO COMPLETO E DETALHADO (QUANDO EXPANDIDO) */}
                {isExpanded && (
                  <div className="pt-6 border-t border-gray-100 space-y-6 animate-in fade-in duration-300">
                    <div>
                      <h3 className="text-lg font-bold text-stone-900 mb-3">
                        Descrição & Valor Patrimonial
                      </h3>
                      <div className="space-y-3 text-stone-700 text-sm sm:text-base leading-relaxed">
                        {wonder.fullDescription.map((paragraph, pIdx) => (
                          <p key={pIdx}>{paragraph}</p>
                        ))}
                      </div>
                    </div>

                    {/* GEOGRAFIA, NATUREZA & DICAS DE VISITA */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-200/70">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-2 flex items-center gap-1.5">
                          <Sun className="w-4 h-4 text-emerald-700" />
                          <span>Geografia & Ecossistema</span>
                        </h4>
                        <p className="text-xs sm:text-sm text-emerald-950/80 leading-relaxed">
                          {wonder.geographyAndNature}
                        </p>
                      </div>

                      <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-200/70">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-amber-700" />
                          <span>Como Chegar & Acesso</span>
                        </h4>
                        <p className="text-xs sm:text-sm text-amber-950/80 leading-relaxed">
                          {wonder.howToVisit}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* SECÇÃO INFORMATIVA SOBRE TURISMO EM ANGOLA */}
      <section className="bg-stone-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-stone-800 space-y-6">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Guia de Viagem para Angola</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Planeie a sua viagem aos encantos de Angola
          </h3>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            Angola combina diversidade geográfica inigualável — desde as praias tropicais do Atlântico e o deserto milenar do Namibe aos planaltos temperados e florestas pluviais da bacia do Congo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <Plane className="w-6 h-6 text-[#d9251d] mb-3" />
            <h4 className="text-sm font-bold text-white mb-1">Conexões Aéreas</h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Voos diretos e frequentes a partir de Madrid e Lisboa para o Aeroporto Internacional de Luanda e o novo Aeroporto Internacional Dr. António Agostinho Neto (AIAAN).
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <ShieldCheck className="w-6 h-6 text-emerald-400 mb-3" />
            <h4 className="text-sm font-bold text-white mb-1">Isenção de Vistos</h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Cidadãos espanhóis e europeus não necessitam de visto prévio para estadas turísticas até 30 dias. Basta apresentar passaporte válido e comprovativo de alojamento.
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <Calendar className="w-6 h-6 text-amber-400 mb-3" />
            <h4 className="text-sm font-bold text-white mb-1">Melhor Época para Visitar</h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              O período de Cacimbo (maio a setembro) oferece temperaturas frescas e agradáveis ideais para safaris e passeios montanhosos.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-stone-400">
            Para informações sobre certidões consulares ou serviços da Embaixada de Angola em Espanha:
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('panorama-consular')}
              className="bg-[#d9251d] hover:bg-[#b01b14] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Serviços Consulares</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('sobre')}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer border border-white/20"
            >
              Contactos da Embaixada
            </button>
          </div>
        </div>
      </section>

      {/* ARTIGOS RELACIONADOS COM TURISMO E CULTURA */}
      {tourismArticles.length > 0 && (
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-stone-900">
                Artigos e Reportagens de Turismo
              </h3>
              <p className="text-xs text-stone-500">
                Publicações da Revista Mosaico sobre cultura, património e turismo em Angola
              </p>
            </div>
            <button
              onClick={() => onNavigate('todas')}
              className="text-xs font-bold text-[#d9251d] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ver todas as notícias</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tourismArticles.slice(0, 3).map((art) => (
              <ArticleCard
                key={art.id}
                article={art}
                onClick={onOpenArticle ? () => onOpenArticle(art) : () => {}}
                onToggleBookmark={onToggleBookmark ? () => onToggleBookmark(art.id) : () => {}}
                onToggleLike={onToggleLike ? () => onToggleLike(art.id) : () => {}}
                isBookmarked={bookmarkedIds.has(art.id)}
                isLiked={likedIds.has(art.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* MODAL LIGHTBOX PARA ZOOM DE IMAGEM */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="max-w-5xl w-full bg-stone-950 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-black/70 flex items-center justify-between border-b border-stone-800 text-white">
              <span className="text-xs sm:text-sm font-bold truncate">
                {selectedImage.title}
              </span>
              <button
                onClick={() => setSelectedImage(null)}
                className="bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1 rounded-lg transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
            <div className="max-h-[80vh] flex items-center justify-center bg-black">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="max-h-[75vh] w-auto max-w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
