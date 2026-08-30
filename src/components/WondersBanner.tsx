/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Compass } from 'lucide-react';
import { angolaNaturalWonders } from '../data/wondersData';
import { NavPage } from '../types';

interface WondersBannerProps {
  onNavigate: (page: NavPage) => void;
}

export const WondersBanner: React.FC<WondersBannerProps> = ({ onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const DURATION_MS = 6000;

  // Auto-advance slideshow seamlessly in the background (like a background video)
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % angolaNaturalWonders.length);
    }, DURATION_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <section 
      className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 text-white min-h-[420px] sm:min-h-[480px] flex flex-col justify-center p-6 sm:p-12 transition-all duration-700 select-none"
      aria-label="Turismo e Maravilhas Naturais de Angola"
    >
      {/* BACKGROUND SLIDESHOW WITH CROSSFADE AND KEN BURNS EFFECT (VIDEO-LIKE TRANSITION) */}
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

      {/* MAIN HERO CONTENT */}
      <div className="relative z-30 max-w-2xl">
        <h2 className="text-2xl sm:text-4xl font-extrabold mb-4 leading-tight tracking-tight text-white drop-shadow-md">
          Descubra as 7 Maravilhas Naturais e o Turismo de Angola
        </h2>

        <p className="text-stone-200 text-xs sm:text-base leading-relaxed mb-8 drop-shadow-sm font-normal max-w-xl">
          Com isenção e facilitação de vistos para cidadãos da União Europeia e Espanha, explore desde as colossais <strong className="text-white font-semibold">Quedas de Kalandula</strong> ao monumental precipício da <strong className="text-white font-semibold">Fenda da Tundavala</strong> e à biodiversidade da <strong className="text-white font-semibold">Floresta do Maiombe</strong>.
        </p>

        {/* ACTION BUTTON */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('maravilhas')}
            className="bg-[#d9251d] hover:bg-[#b01b14] active:scale-95 text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer shadow-lg shadow-red-950/40 border border-red-500/30"
          >
            <Compass className="w-4 h-4" />
            <span>Explorar Guia Turístico</span>
          </button>
        </div>
      </div>
    </section>
  );
};
