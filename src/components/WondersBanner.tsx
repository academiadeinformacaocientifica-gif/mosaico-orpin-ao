/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  Video, 
  MapPin, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Info, 
  X, 
  CheckCircle2,
  ExternalLink,
  Layers
} from 'lucide-react';
import { angolaNaturalWonders, NaturalWonder } from '../data/wondersData';
import { NavPage } from '../types';

interface WondersBannerProps {
  onNavigate: (page: NavPage) => void;
}

export const WondersBanner: React.FC<WondersBannerProps> = ({ onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedWonder, setSelectedWonder] = useState<NaturalWonder | null>(null);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const DURATION_MS = 6000;
  const TICK_MS = 50;

  const currentWonder = angolaNaturalWonders[currentIndex];

  // Auto-advance slideshow timer & progress bar
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    setProgress(0);
    const startTime = Date.now();

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / DURATION_MS) * 100);
      setProgress(pct);
    }, TICK_MS);

    timerRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % angolaNaturalWonders.length);
    }, DURATION_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [currentIndex, isPlaying]);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? angolaNaturalWonders.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % angolaNaturalWonders.length);
  };

  const handleSelectWonder = (index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex(index);
  };

  const openModalWithWonder = (wonder: NaturalWonder) => {
    setSelectedWonder(wonder);
    setShowDetailsModal(true);
  };

  return (
    <>
      <section 
        className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 text-white min-h-[460px] sm:min-h-[520px] flex flex-col justify-between p-6 sm:p-10 transition-all duration-700 select-none group"
        aria-label="As 7 Maravilhas Naturais de Angola"
      >
        {/* BACKGROUND SLIDESHOW WITH CROSSFADE AND KEN BURNS EFFECT */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-stone-950">
          {angolaNaturalWonders.map((wonder, idx) => {
            const isActive = idx === currentIndex;
            return (
              <div
                key={wonder.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img
                  src={wonder.image}
                  alt={wonder.name}
                  className={`w-full h-full object-cover object-center transform transition-transform duration-[7000ms] ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                  referrerPolicy="no-referrer"
                />
              </div>
            );
          })}

          {/* GRADIENT OVERLAYS FOR OPTIMAL TEXT CONTRAST */}
          <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/95 via-black/60 to-black/35" />
          <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/90 via-black/50 to-transparent max-w-3xl" />
          <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_20%_30%,rgba(217,37,29,0.15),transparent_60%)]" />
        </div>

        {/* TOP CONTROLS */}
        <div className="relative z-30 flex items-center justify-end gap-2">
          {/* PLAY/PAUSE TOGGLE */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-black/50 hover:bg-black/80 backdrop-blur-md text-white/80 hover:text-white p-2 rounded-full border border-white/15 transition-colors cursor-pointer text-xs flex items-center gap-1.5"
            title={isPlaying ? 'Pausar transição' : 'Retomar transição'}
            aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>

          {/* PREV/NEXT CONTROLS */}
          <div className="flex items-center bg-black/50 backdrop-blur-md rounded-full border border-white/15 p-0.5">
            <button
              onClick={handlePrev}
              className="p-1.5 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
              title="Maravilha anterior"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
              title="Próxima maravilha"
              aria-label="Seguinte"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* MODAL TRIGGER: VER TODAS */}
          <button
            onClick={() => openModalWithWonder(currentWonder)}
            className="bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Ver as 7</span>
          </button>
        </div>

        {/* MIDDLE / MAIN HERO CONTENT */}
        <div className="relative z-30 max-w-2xl my-auto py-6 sm:py-8">
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-3 leading-tight tracking-tight text-white drop-shadow-md">
            Descubra as 7 Maravilhas Naturais e o Turismo de Angola
          </h2>

          <p className="text-stone-200 text-xs sm:text-base leading-relaxed mb-6 drop-shadow-sm font-normal max-w-xl">
            Com isenção e facilitação de vistos para cidadãos da União Europeia e Espanha, explore desde as colossais <strong className="text-white font-semibold">Quedas de Kalandula</strong> ao monumental precipício da <strong className="text-white font-semibold">Fenda da Tundavala</strong> e à biodiversidade da <strong className="text-white font-semibold">Floresta do Maiombe</strong>.
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('turismo')}
              className="bg-[#d9251d] hover:bg-[#b01b14] active:scale-95 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-red-950/40 border border-red-500/30"
            >
              <Compass className="w-4 h-4" />
              <span>Explorar Guia Turístico</span>
            </button>

            <button
              onClick={() => onNavigate('videos')}
              className="bg-black/50 hover:bg-black/70 active:scale-95 backdrop-blur-md text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl transition-all cursor-pointer border border-white/25 flex items-center gap-2"
            >
              <Video className="w-4 h-4 text-red-400" />
              <span>Ver Vídeos Institucionais</span>
            </button>

            <button
              onClick={() => openModalWithWonder(currentWonder)}
              className="bg-white/10 hover:bg-white/20 active:scale-95 backdrop-blur-md text-stone-200 hover:text-white text-xs sm:text-sm font-medium px-4 py-3 rounded-xl transition-all cursor-pointer border border-white/15 flex items-center gap-1.5"
            >
              <Info className="w-4 h-4 text-amber-300" />
              <span>Saber mais sobre {currentWonder.name}</span>
            </button>
          </div>
        </div>

        {/* BOTTOM BAR: INTERACTIVE SLIDES TRACKER & PROGRESS */}
        <div className="relative z-30 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* SLIDES PILLS WITH TITLES */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {angolaNaturalWonders.map((wonder, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={wonder.id}
                  onClick={(e) => handleSelectWonder(idx, e)}
                  className={`group relative text-left py-1.5 px-2.5 sm:px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 border ${
                    isActive
                      ? 'bg-white text-gray-950 border-white shadow-md scale-105'
                      : 'bg-black/40 text-stone-300 border-white/10 hover:bg-white/20 hover:text-white'
                  }`}
                  title={`${wonder.number}. ${wonder.name} (${wonder.province})`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isActive ? 'bg-[#d9251d] text-white' : 'bg-white/20 text-white'
                    }`}>
                      {wonder.number}
                    </span>
                    <span className="hidden md:inline truncate max-w-[110px]">
                      {wonder.name.replace('Quedas de ', '').replace('Fenda da ', '').replace('Floresta do ', '').replace('Grutas do ', '').replace('Lagoa do ', '').replace('Morro do ', '')}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ACTIVE WONDER CAPTION & PROGRESS */}
          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-stone-300">
            <span className="text-[11px] text-stone-300 truncate max-w-[240px] font-medium">
              📍 <span className="text-white font-bold">{currentWonder.name}</span> ({currentWonder.province})
            </span>
            <div className="w-16 h-1.5 bg-white/20 rounded-full overflow-hidden shrink-0">
              <div 
                className="h-full bg-[#d9251d] transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* MODAL: AS 7 MARAVILHAS NATURAIS DE ANGOLA */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#121418] text-white border border-gray-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            {/* MODAL HEADER */}
            <div className="p-6 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-[#121418]/95 backdrop-blur-md z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#d9251d] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    As 7 Maravilhas Naturais de Angola
                  </h3>
                  <p className="text-xs text-stone-400">
                    Eleitas oficialmente para a promoção e preservação do património nacional
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MODAL CONTENT: LIST OF 7 WONDERS */}
            <div className="p-6 space-y-6">
              {angolaNaturalWonders.map((w, i) => {
                const isSelected = selectedWonder?.id === w.id || (!selectedWonder && i === currentIndex);
                return (
                  <div
                    key={w.id}
                    className={`rounded-2xl border p-4 sm:p-5 transition-all ${
                      isSelected
                        ? 'bg-stone-900 border-[#d9251d]/60 shadow-lg'
                        : 'bg-stone-900/40 border-gray-800/80 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row gap-5 items-start">
                      <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden bg-stone-950 shrink-0 relative group">
                        <img
                          src={w.image}
                          alt={w.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2 left-2 bg-black/75 text-white text-[10px] font-black px-2 py-0.5 rounded">
                          #{w.number}
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="bg-[#d9251d] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                            Província de {w.province}
                          </span>
                          <span className="text-xs text-stone-400 font-medium">
                            {w.location}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-white mb-1">
                          {w.name}
                        </h4>
                        <p className="text-xs text-amber-300 font-semibold mb-2">
                          {w.tagline}
                        </p>
                        <p className="text-xs text-stone-300 leading-relaxed mb-3">
                          {w.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5">
                          {w.highlights.map((h, hIdx) => (
                            <span
                              key={hIdx}
                              className="inline-flex items-center gap-1 text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded-md border border-stone-700/60"
                            >
                              <CheckCircle2 className="w-3 h-3 text-[#d9251d]" />
                              <span>{h}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* MODAL FOOTER */}
            <div className="p-6 border-t border-gray-800 bg-[#121418] flex flex-wrap items-center justify-between gap-3 sticky bottom-0 z-10">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  onNavigate('turismo');
                }}
                className="bg-[#d9251d] hover:bg-[#b01b14] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>Ir para a Página de Turismo</span>
              </button>

              <button
                onClick={() => setShowDetailsModal(false)}
                className="bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
