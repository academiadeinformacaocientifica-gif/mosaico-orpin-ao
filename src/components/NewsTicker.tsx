import React, { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import { Article } from '../types';

interface NewsTickerProps {
  articles: Article[];
  onOpenArticle: (article: Article) => void;
}

export const NewsTicker: React.FC<NewsTickerProps> = ({
  articles,
  onOpenArticle,
}) => {
  // Garantir itens suficientes para um scroll suave e contínuo em qualquer resolução
  const tickerItems = useMemo(() => {
    if (!articles || articles.length === 0) return [];
    let base = [...articles];
    // Repetir a base se for pequena para preencher ecrãs largos
    while (base.length < 8) {
      base = [...base, ...articles];
    }
    // Duplicar a lista exatamente ao meio para o loop de 0% a -50% ser 100% contínuo
    return [...base, ...base];
  }, [articles]);

  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white border-b border-stone-200/90 shadow-xs select-none">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 flex items-center h-10 overflow-hidden">
        {/* BADGE DESTAQUES FIXA À ESQUERDA */}
        <div className="shrink-0 z-20 flex items-center gap-1.5 bg-[#d9251d] text-white px-3 py-1 rounded-sm text-[11px] font-bold uppercase tracking-wider shadow-xs mr-3 sm:mr-4">
          <TrendingUp className="w-3.5 h-3.5 text-white/90 animate-pulse" />
          <span className="hidden sm:inline">Em Destaque</span>
          <span className="sm:hidden">Destaques</span>
        </div>

        {/* FAIXA DO SCROLLER COM FADE NAS BORDAS */}
        <div className="relative flex-1 h-full overflow-hidden flex items-center">
          {/* Efeito de fade suave na saída do badge */}
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          
          {/* Efeito de fade suave no lado direito */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* TRILHO DE ANIMAÇÃO CONTÍNUA (MARQUEE) */}
          <div className="animate-ticker flex items-center py-1">
            {tickerItems.map((article, idx) => (
              <button
                key={`${article.id}-${idx}`}
                type="button"
                onClick={() => onOpenArticle(article)}
                className="group flex items-center shrink-0 cursor-pointer text-left px-3 py-0.5 text-xs text-stone-700 hover:text-[#d9251d] transition-colors"
                title={article.title}
              >
                <span className="font-semibold text-stone-800 group-hover:text-[#d9251d] group-hover:underline underline-offset-2 transition-colors">
                  {article.title}
                </span>

                {/* Separador entre títulos */}
                <span className="inline-flex items-center justify-center ml-5 text-stone-300 font-light select-none group-hover:text-stone-400 transition-colors" aria-hidden="true">
                  |
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
