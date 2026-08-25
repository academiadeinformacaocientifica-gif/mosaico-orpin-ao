import React, { useState } from 'react';
import { Image as ImageIcon, Search, Filter, Download, X, Eye, Calendar, Sparkles } from 'lucide-react';

import cooperacaoBilateralImg from '../../assets/images/Angola e Espanha reforçam cooperação bilateral.jpeg';
import credenciaisBalbinaImg from '../../assets/images/credenciais_balbina_silva_1787483613500.jpg.jpeg';
import diaMulherAfricanaImg from '../../assets/images/dia_mulher_africana_1787482964722.jpg.jpeg';
import forumRecursosMineraisImg from '../../assets/images/forum_recursos_minerais_17487483460820.jpg.jpeg';
import iconMosaicoSquareImg from '../../assets/images/icon_mosaico_square_1787501925065.jpg';
import imexBarcelonaImg from '../../assets/images/imex_barcelona_angola_1787497730037.jpg.jpeg';
import independencia50Img from '../../assets/images/independencia_50_madrid_1787496814208.jpg.jpeg';
import logoMosaicoImg from '../../assets/images/logo_mosaico.jpeg';
import onuTurismoImg from '../../assets/images/onu_turismo_madrid_1787497879619.jpg.jpeg';
import vityNsalambiImg from '../../assets/images/vity_nsalambi_sagrada_familia_1787497295778.jpg.jpeg';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
  image: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Cooperação Bilateral Angola-Espanha em Madrid',
    category: 'Diplomacia',
    date: '4 de Junho, 2026',
    description: 'Reunião de Consultas Políticas ao nível de Secretários de Estado, copresidida por Esmeralda Mendonça e Diego Martínez Belío, reforçando parcerias estratégicas.',
    image: cooperacaoBilateralImg
  },
  {
    id: 'gal-2',
    title: 'Apresentação de Cartas Credenciais',
    category: 'Institucional',
    date: '2026',
    description: 'Cerimónia oficial de acreditação diplomática da Embaixada da República de Angola no Reino de Espanha.',
    image: credenciaisBalbinaImg
  },
  {
    id: 'gal-3',
    title: 'Celebração do Dia da Mulher Africana',
    category: 'Cultura',
    date: '2026',
    description: 'Encontro comemorativo em Madrid destacando o contributo fulcral das mulheres angolanas para o desenvolvimento social e cultural.',
    image: diaMulherAfricanaImg
  },
  {
    id: 'gal-4',
    title: 'Fórum de Recursos Minerais e Investimento',
    category: 'Economia',
    date: '2026',
    description: 'Apresentação de oportunidades de investimento em sectores estruturantes, transição energética e mineração sustentável.',
    image: forumRecursosMineraisImg
  },
  {
    id: 'gal-5',
    title: 'Selo Oficial Mosaico',
    category: 'Institucional',
    date: '2026',
    description: 'Selo gráfico e representação oficial da plataforma de difusão diplomática e consular.',
    image: iconMosaicoSquareImg
  },
  {
    id: 'gal-6',
    title: 'Participação na Feira IMEX Barcelona',
    category: 'Economia',
    date: '2026',
    description: 'Promoção do ambiente de negócios de Angola, atração de investimento estrangeiro e fomento de parcerias com o empresariado catalão.',
    image: imexBarcelonaImg
  },
  {
    id: 'gal-7',
    title: 'Comemorações dos 50 Anos da Independência',
    category: 'Cultura',
    date: '2026',
    description: 'Conferências, mostras históricas e celebrações solenes alusivas ao cinquentenário da independência nacional em Madrid.',
    image: independencia50Img
  },
  {
    id: 'gal-8',
    title: 'Logótipo Oficial Revista Mosaico',
    category: 'Institucional',
    date: '2026',
    description: 'Identidade visual corporativa da revista oficial e plataforma diplomática da Embaixada de Angola.',
    image: logoMosaicoImg
  },
  {
    id: 'gal-9',
    title: 'Encontro na Sede da ONU Turismo (Madrid)',
    category: 'Diplomacia',
    date: '2026',
    description: 'Diálogo institucional focado no desenvolvimento do turismo sustentável e projeção internacional de Angola.',
    image: onuTurismoImg
  },
  {
    id: 'gal-10',
    title: 'Visita Institucional à Sagrada Família (Barcelona)',
    category: 'Turismo & Cultura',
    date: '2026',
    description: 'Intercâmbio cultural e contactos institucionais de alto nível realizados na Catalunha.',
    image: vityNsalambiImg
  }
];

interface GalleryPageProps {
  onShowToast: (msg: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ onShowToast }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);

  const categories = ['todos', 'Diplomacia', 'Institucional', 'Cultura', 'Economia', 'Turismo & Cultura'];

  const filteredItems = galleryItems.filter((item) => {
    const matchesCategory = selectedCategory === 'todos' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
          <span>{galleryItems.length} Registos Fotográficos</span>
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
            placeholder="Pesquisar imagens..."
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
              onClick={() => setActiveImage(item)}
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
                    <span>Ver Imagem Completa</span>
                  </span>
                </div>
                <span className="absolute top-3 left-3 bg-[#d9251d] text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded shadow-xs">
                  {item.category}
                </span>
                <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-1 rounded">
                  {item.date}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2 group-hover:text-[#d9251d] transition-colors leading-snug">
                    {item.title}
                  </h3>
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

      {/* LIGHTBOX MODAL */}
      {activeImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setActiveImage(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-gray-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-[#d9251d] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                  {activeImage.category}
                </span>
                <span className="text-xs text-gray-300">{activeImage.date}</span>
              </div>
              <button
                onClick={() => setActiveImage(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-black flex-1 flex items-center justify-center overflow-hidden p-2">
              <img
                src={activeImage.image}
                alt={activeImage.title}
                className="max-h-[60vh] max-w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-6 bg-white space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                {activeImage.title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {activeImage.description}
              </p>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  Embaixada da República de Angola no Reino de Espanha e Principado de Andorra
                </span>
                <button
                  onClick={() => {
                    onShowToast(`A descarregar "${activeImage.title}"...`);
                  }}
                  className="bg-[#d9251d] hover:bg-[#b01b14] text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
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
