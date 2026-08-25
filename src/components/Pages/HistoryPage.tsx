import React from 'react';
import { Clock, Landmark, Calendar, Award, Globe, Flag, Sparkles } from 'lucide-react';
import { diplomaticMilestones } from '../../data/history';

export const HistoryPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* HEADER */}
      <div className="category-header bg-white p-6 sm:p-9 rounded-2xl my-6 sm:my-8 border-l-6 border-[#d9251d] shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111] mb-1.5">
            História das Relações Bilaterais
          </h1>
          <p className="text-xs sm:text-sm text-[#666]">
            Cronologia diplomática e marcos históricos entre Angola, Espanha e o Principado de Andorra.
          </p>
        </div>
        <div className="category-badge-count bg-[#f0f0f0] px-4 py-2 rounded-full font-semibold text-xs text-[#444] flex items-center gap-2 shrink-0">
          <Clock className="w-4 h-4 text-[#d9251d]" />
          <span>1977 — 2026</span>
        </div>
      </div>

      {/* TIMELINE INTRODUCTION */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-xs">
        <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Flag className="w-5 h-5 text-[#d9251d]" />
          <span>Uma Parceria Estratégica Forjada no Diálogo e Fraternidade</span>
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Desde o reconhecimento recíproco e estabelecimento dos laços formais em 1977, Angola e Espanha construíram pontes duradouras fundadas no respeito mútuo, na cooperação económica, no intercâmbio científico e na fraternidade entre os seus cidadãos. Conheça os principais marcos desta trajetória histórica.
        </p>
      </div>

      {/* TIMELINE LIST */}
      <div className="relative pl-6 sm:pl-10 border-l-2 border-[#d9251d]/30 space-y-8 my-6 ml-3 sm:ml-6">
        {diplomaticMilestones.map((milestone, idx) => (
          <div key={idx} className="relative group">
            {/* TIMELINE DOT */}
            <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-[#d9251d] border-4 border-white shadow-md flex items-center justify-center text-white text-[10px] font-bold">
              •
            </div>

            <div className="bg-white p-5 sm:p-7 rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="bg-[#d9251d] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase">
                  {milestone.dateStr}
                </span>
                <span className="text-xs font-bold text-gray-400">
                  Ano {milestone.year}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-[#d9251d] transition-colors">
                {milestone.title}
              </h3>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3">
                {milestone.description}
              </p>

              <div className="bg-[#f8f9fa] p-3 rounded-xl border-l-4 border-amber-400 text-xs text-gray-700">
                <strong className="font-semibold text-gray-900 block mb-0.5">Significado Histórico:</strong>
                {milestone.significance}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
