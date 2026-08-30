import React from 'react';
import { BookMarked, Download, BookOpen, CheckCircle2 } from 'lucide-react';
import { MagazineEdition } from '../../types';
import { initialMagazineEditions } from '../../data/magazineEditions';

interface EditionsPageProps {
  editions?: MagazineEdition[];
  onOpenEdition: (edition: MagazineEdition) => void;
  onShowToast: (msg: string) => void;
}

export const EditionsPage: React.FC<EditionsPageProps> = ({
  editions,
  onOpenEdition,
  onShowToast,
}) => {
  const displayEditions = (editions && editions.length > 0 ? editions : initialMagazineEditions)
    .filter((e) => e.isPublished !== false)
    .sort((a, b) => (b.editionNumber || 0) - (a.editionNumber || 0));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* HEADER */}
      <div className="category-header bg-white p-6 sm:p-9 rounded-2xl my-6 sm:my-8 border-l-6 border-[#d9251d] shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111] mb-1.5 flex items-center gap-2.5">
            <BookMarked className="w-6 h-6 text-[#d9251d]" />
            <span>Arquivo de Edições da Revista Mosaico</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#666]">
            Consulte, leia online e descarregue os volumes trimestrais da revista oficial da Embaixada.
          </p>
        </div>
        <div className="category-badge-count bg-[#f0f0f0] px-4 py-2 rounded-full font-semibold text-xs text-[#444] flex items-center gap-2 shrink-0">
          <BookOpen className="w-4 h-4 text-[#d9251d]" />
          <span>{displayEditions.length} Volumes Disponíveis</span>
        </div>
      </div>

      {/* EDITIONS LIST */}
      {displayEditions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-xs">
          <BookMarked className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800 mb-1">
            Nenhuma edição disponível no momento
          </h3>
          <p className="text-xs text-gray-500">
            Novos volumes da Revista Mosaico serão disponibilizados em breve.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayEditions.map((ed) => (
            <div
              key={ed.id}
              className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row gap-6 items-start"
            >
              {/* COVER */}
              <div
                onClick={() => onOpenEdition(ed)}
                className="w-full md:w-56 h-72 rounded-xl overflow-hidden bg-gray-900 shadow-md shrink-0 cursor-pointer group relative"
              >
                <img
                  src={ed.coverImage}
                  alt={ed.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-[#d9251d] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg">
                    <BookOpen className="w-4 h-4" />
                    <span>Ler Online</span>
                  </span>
                </div>
              </div>

              {/* DETAILS */}
              <div className="flex-1 flex flex-col justify-between h-full">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="bg-[#d9251d] text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-sm">
                      {ed.period} {ed.year}
                    </span>
                    <span className="text-xs font-bold text-gray-500">
                      {ed.pagesCount} Páginas em Alta Resolução
                    </span>
                  </div>

                  <h2
                    onClick={() => onOpenEdition(ed)}
                    className="text-lg sm:text-xl font-bold text-gray-900 mb-2 cursor-pointer hover:text-[#d9251d] transition-colors"
                  >
                    {ed.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-gray-600 italic mb-4 border-l-2 border-amber-400 pl-3">
                    "{ed.editorialNote}"
                  </p>

                  {ed.highlights && ed.highlights.length > 0 && (
                    <div className="bg-[#f8f9fa] p-4 rounded-xl border border-gray-200/80 mb-6">
                      <h4 className="text-xs font-bold text-gray-900 uppercase mb-2">
                        Destaques Editoriais desta Edição:
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                        {ed.highlights.map((item, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#d9251d] shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => onOpenEdition(ed)}
                    className="bg-[#d9251d] hover:bg-[#b01b14] text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Folhear Revista Digital</span>
                  </button>

                  <button
                    onClick={() => {
                      if (ed.pdfUrl) {
                        window.open(ed.pdfUrl, '_blank');
                      } else {
                        onShowToast(`A preparar transferência da ${ed.title}...`);
                      }
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#d9251d]" />
                    <span>Descarregar Ficheiro PDF</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
