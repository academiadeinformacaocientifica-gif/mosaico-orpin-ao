import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Search,
  Filter,
  Download,
  X,
  Eye,
  Calendar,
  Sparkles,
  FolderArchive,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { GalleryItem } from '../../types';
import { initialGalleryItems } from '../../data/galleryData';

interface GalleryPageProps {
  items?: GalleryItem[];
  onShowToast: (msg: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ items = initialGalleryItems, onShowToast }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);
  const [activeSubIndex, setActiveSubIndex] = useState<number>(0);

  const categories = ['todos', 'Diplomacia', 'Institucional', 'Cultura', 'Economia', 'Turismo & Cultura'];

  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === 'todos' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      (item.collection && item.collection.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  // When opening a lightbox, initialize subIndex to the current image
  const handleOpenLightbox = (item: GalleryItem) => {
    setActiveImage(item);
    if (item.images && item.images.length > 0) {
      const idx = item.images.indexOf(item.image);
      setActiveSubIndex(idx >= 0 ? idx : 0);
    } else {
      setActiveSubIndex(0);
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeImage) return;
      if (e.key === 'Escape') {
        setActiveImage(null);
      } else if (activeImage.images && activeImage.images.length > 1) {
        if (e.key === 'ArrowRight') {
          setActiveSubIndex((prev) => (prev + 1) % (activeImage.images?.length || 1));
        } else if (e.key === 'ArrowLeft') {
          setActiveSubIndex((prev) =>
            prev === 0 ? (activeImage.images?.length || 1) - 1 : prev - 1
          );
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImage]);

  const currentImageUrl =
    activeImage?.images && activeImage.images.length > 0
      ? activeImage.images[activeSubIndex] || activeImage.image
      : activeImage?.image || '';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* HEADER */}
      <div className="bg-white p-6 sm:p-9 rounded-2xl my-6 sm:my-8 border-l-6 border-[#d9251d] shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111] mb-1.5 flex items-center gap-2.5">
            <ImageIcon className="w-6 h-6 text-[#d9251d]" />
            <span>Imagens</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#666]">
            Registo visual oficial das cimeiras, visitas bilaterais, encontros diplomáticos e eventos culturais da Embaixada.
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 px-4 py-2 rounded-full font-semibold text-xs text-[#d9251d] flex items-center gap-2 shrink-0">
          <Sparkles className="w-4 h-4" />
          <span>{items.length} Registos Fotográficos</span>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 shrink-0 mr-2">
            <Filter className="w-3.5 h-3.5 text-[#d9251d]" />
            <span>Filtrar:</span>
          </span>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer capitalize ${
                selectedCategory === cat
                  ? 'bg-[#d9251d] text-white font-bold shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat === 'todos' ? 'Todas as Fotografias' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar imagens ou colecções..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none focus:border-[#d9251d] transition-colors"
          />
        </div>
      </div>

      {/* GALLERY GRID */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800 mb-1">Nenhum resultado encontrado</h3>
          <p className="text-xs text-gray-500">Tente pesquisar por outro termo ou categoria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenLightbox(item)}
              className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="h-56 overflow-hidden relative bg-gray-900">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="bg-white/90 backdrop-blur-xs text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#d9251d]" />
                    <span>Ver Fotografia Completa</span>
                  </span>
                </div>
                <span className="absolute top-3 left-3 bg-[#d9251d] text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded shadow-xs">
                  {item.category}
                </span>
                <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-1 rounded">
                  {item.date}
                </span>

                {item.images && item.images.length > 1 && (
                  <span className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    <span>{item.images.length} fotos</span>
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1.5 group-hover:text-[#d9251d] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  {item.collection && (
                    <div className="mb-2">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                        <FolderArchive className="w-3 h-3 text-purple-600 shrink-0" />
                        <span className="truncate max-w-[200px]">Colecção: {item.collection}</span>
                      </span>
                    </div>
                  )}
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.date}</span>
                  </span>
                  <span className="font-bold text-[#d9251d] group-hover:underline">
                    Ampliar →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIGHTBOX MODAL COM SUPORTE A ÁLBUM / COLECÇÃO */}
      {activeImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setActiveImage(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* LIGHTBOX HEADER */}
            <div className="p-4 bg-gray-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#d9251d] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                  {activeImage.category}
                </span>
                {activeImage.collection && (
                  <span className="bg-white/10 text-gray-200 text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
                    <FolderArchive className="w-3 h-3 text-[#d9251d]" />
                    <span>Colecção: {activeImage.collection}</span>
                  </span>
                )}
                <span className="text-xs text-gray-400">{activeImage.date}</span>
              </div>
              <button
                onClick={() => setActiveImage(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                title="Fechar (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* LIGHTBOX IMAGE VIEWER WITH PREV / NEXT */}
            <div className="bg-black flex-1 relative flex items-center justify-center overflow-hidden min-h-[320px] max-h-[58vh]">
              <img
                src={currentImageUrl}
                alt={activeImage.title}
                className="max-h-[56vh] max-w-full object-contain transition-all duration-300"
                referrerPolicy="no-referrer"
              />

              {/* Botões de Navegação Anterior / Seguinte se houver múltiplas fotos */}
              {activeImage.images && activeImage.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSubIndex((prev) =>
                        prev === 0 ? (activeImage.images?.length || 1) - 1 : prev - 1
                      );
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs"
                    title="Fotografia anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSubIndex((prev) =>
                        (prev + 1) % (activeImage.images?.length || 1)
                      );
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs"
                    title="Próxima fotografia"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-xs text-white text-[11px] font-medium px-3 py-1 rounded-full">
                    {activeSubIndex + 1} de {activeImage.images.length} fotos
                  </div>
                </>
              )}
            </div>

            {/* FAIXA DE MINIATURAS DA COLECÇÃO / ÁLBUM */}
            {activeImage.images && activeImage.images.length > 1 && (
              <div className="bg-gray-950 p-2.5 flex items-center gap-2 overflow-x-auto border-t border-gray-800">
                {activeImage.images.map((thumbUrl, idx) => (
                  <button
                    key={`${thumbUrl}-${idx}`}
                    onClick={() => setActiveSubIndex(idx)}
                    className={`relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activeSubIndex === idx
                        ? 'border-[#d9251d] scale-105 shadow-md'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={thumbUrl}
                      alt={`Miniatura ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* LIGHTBOX DETAILS */}
            <div className="p-5 sm:p-6 bg-white space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                {activeImage.title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {activeImage.description}
              </p>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2">
                <span className="text-[11px] text-gray-400">
                  Embaixada da República de Angola no Reino de Espanha e Principado de Andorra
                </span>
                <button
                  onClick={() => {
                    onShowToast(`A descarregar fotografia da colecção...`);
                  }}
                  className="bg-[#d9251d] hover:bg-[#b01b14] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Descarregar Fotografia</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
