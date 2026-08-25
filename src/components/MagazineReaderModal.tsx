import React, { useState } from 'react';
import { 
  X, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  FileText, 
  Share2, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { MagazineEdition } from '../types';

interface MagazineReaderModalProps {
  edition: MagazineEdition | null;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const MagazineReaderModal: React.FC<MagazineReaderModalProps> = ({
  edition,
  onClose,
  onShowToast,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (!edition) return null;

  const totalSimulatedPages = 12;

  const handleDownload = () => {
    onShowToast(`A preparar transferência em PDF da ${edition.title}...`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-[#1f242d] text-white w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-700">
        
        {/* HEADER */}
        <div className="bg-[#151921] px-4 sm:px-6 py-3.5 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-[#d9251d] text-white font-bold text-xs px-2.5 py-1 rounded-sm uppercase">
              REVISTA DIGITAL
            </span>
            <span className="text-sm font-bold text-gray-200 hidden sm:inline truncate max-w-md">
              {edition.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="bg-[#d9251d] hover:bg-[#b01b14] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Descarregar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* READER CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col md:flex-row gap-6 items-center justify-center">
          
          {/* COVER / PAGE PREVIEW */}
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <div className="relative w-full max-w-xs rounded-xl overflow-hidden shadow-2xl border-4 border-gray-700 bg-gray-900 group">
              <img
                src={edition.coverImage}
                alt={edition.title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 flex flex-col justify-end">
                <span className="bg-[#d9251d] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm w-max mb-1">
                  Mosaico Angolano
                </span>
                <h3 className="text-white text-base font-bold">{edition.title}</h3>
                <p className="text-gray-300 text-xs mt-1">{edition.theme}</p>
                <div className="text-[10px] text-gray-400 mt-2 flex items-center justify-between">
                  <span>{edition.period} {edition.year}</span>
                  <span>{edition.pagesCount} Páginas</span>
                </div>
              </div>
            </div>

            {/* SIMULATED PAGE NAVIGATION */}
            <div className="flex items-center gap-4 mt-4 text-xs text-gray-300">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-md bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span>Folha {currentPage} de {totalSimulatedPages}</span>
              <button
                disabled={currentPage >= totalSimulatedPages}
                onClick={() => setCurrentPage((p) => Math.min(totalSimulatedPages, p + 1))}
                className="p-1.5 rounded-md bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* EDITORIAL SUMMARY & INDEX */}
          <div className="w-full md:w-1/2 flex flex-col gap-4 text-left">
            <div>
              <span className="text-xs font-bold text-[#ffcc00] uppercase tracking-wider">
                Índice & Destaques Editoriais
              </span>
              <h2 className="text-xl font-bold text-white mt-1">{edition.theme}</h2>
              <p className="text-xs text-gray-300 mt-2 leading-relaxed italic border-l-2 border-[#d9251d] pl-3">
                "{edition.editorialNote}"
              </p>
            </div>

            <div className="bg-gray-800/80 p-4 rounded-xl border border-gray-700">
              <h4 className="text-xs font-bold text-gray-200 uppercase mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#d9251d]" />
                <span>Nesta Edição:</span>
              </h4>
              <ul className="space-y-2 text-xs text-gray-300">
                {edition.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#ffcc00] shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleDownload}
                className="bg-[#d9251d] hover:bg-[#b01b14] text-white text-xs font-bold py-2.5 px-4 rounded-lg flex items-center gap-2 cursor-pointer shadow-md transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Descarregar Edição Completa (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
