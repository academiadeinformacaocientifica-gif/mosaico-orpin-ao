import React, { useState } from 'react';
import { Video as VideoIcon, Play, Search, Filter, Share2, Eye, Calendar, Sparkles, X, Check } from 'lucide-react';

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

interface VideoItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  date: string;
  views: string;
  description: string;
  image: string;
  videoUrl?: string;
}

const videoItems: VideoItem[] = [
  {
    id: 'vid-gala',
    title: 'Gala Miss Angola-Espanha: Celebração da Beleza e Cultura',
    category: 'Cultura & Moda',
    duration: '18:30',
    date: '2026',
    views: '5.2mil visualizações',
    description: 'Transmissão oficial da prestigiada Gala Miss Angola-Espanha em Madrid, enaltecendo a elegância, o talento e a identidade cultural angolana na diáspora.',
    image: independencia50Img,
    videoUrl: 'videos/GALA MISS ANGOLA-ESPANHA.mp4'
  },
  {
    id: 'vid-1',
    title: 'Reportagem Especial: Cooperação Bilateral Angola-Espanha em Madrid',
    category: 'Diplomacia',
    duration: '14:20',
    date: 'Junho de 2026',
    views: '3.4mil visualizações',
    description: 'Cobertura completa da reunião de consultas políticas copresidida pelos Secretários de Estado, destacando acordos estratégicos e laços históricos.',
    image: cooperacaoBilateralImg
  },
  {
    id: 'vid-2',
    title: 'Cerimónia de Apresentação de Cartas Credenciais',
    category: 'Institucional',
    duration: '08:45',
    date: '2026',
    views: '2.1mil visualizações',
    description: 'Registo oficial da acreditação diplomática da Embaixada de Angola no Reino de Espanha.',
    image: credenciaisBalbinaImg
  },
  {
    id: 'vid-3',
    title: 'Conferência: O Contributo da Mulher na Diáspora e em Angola',
    category: 'Cultura',
    duration: '22:10',
    date: '2026',
    views: '1.8mil visualizações',
    description: 'Painel comemorativo do Dia da Mulher Africana realizado em Madrid, abordando liderança, cultura e desenvolvimento.',
    image: diaMulherAfricanaImg
  },
  {
    id: 'vid-4',
    title: 'Fórum Económico: Oportunidades de Investimento e Recursos Minerais',
    category: 'Economia',
    duration: '35:00',
    date: '2026',
    views: '4.2mil visualizações',
    description: 'Debate executivo sobre transição energética, mineração sustentável e parcerias empresariais Angola-Espanha.',
    image: forumRecursosMineraisImg
  },
  {
    id: 'vid-5',
    title: 'Selo Oficial Mosaico: Identidade e Difusão',
    category: 'Institucional',
    duration: '03:15',
    date: '2026',
    views: '950 visualizações',
    description: 'Apresentação institucional da plataforma digital e revista oficial da Embaixada de Angola.',
    image: iconMosaicoSquareImg
  },
  {
    id: 'vid-6',
    title: 'Missão Empresarial IMEX Barcelona: Negócios e Parcerias',
    category: 'Economia',
    duration: '18:50',
    date: '2026',
    views: '2.9mil visualizações',
    description: 'Destaques da participação de Angola na feira IMEX em Barcelona, promovendo o ecossistema empresarial nacional.',
    image: imexBarcelonaImg
  },
  {
    id: 'vid-7',
    title: 'Cinquentenário da Independência Nacional em Madrid',
    category: 'Cultura',
    duration: '45:30',
    date: '2026',
    views: '6.7mil visualizações',
    description: 'Celebrações solenes, concertos e mostras históricas marcando os 50 anos da independência da República de Angola.',
    image: independencia50Img
  },
  {
    id: 'vid-8',
    title: 'Documentário: A Trajetória da Revista Mosaico',
    category: 'Institucional',
    duration: '12:00',
    date: '2026',
    views: '1.5mil visualizações',
    description: 'Como a plataforma de difusão diplomática conecta cidadãos, autoridades e investidores na Europa e em Angola.',
    image: logoMosaicoImg
  },
  {
    id: 'vid-9',
    title: 'Encontro de Alto Nível na Sede da ONU Turismo (Madrid)',
    category: 'Diplomacia',
    duration: '15:40',
    date: '2026',
    views: '3.1mil visualizações',
    description: 'Estratégias conjuntas para o fomento do turismo sustentável e projeção internacional de Angola.',
    image: onuTurismoImg
  },
  {
    id: 'vid-10',
    title: 'Intercâmbio Cultural e Institucional na Catalunha',
    category: 'Turismo & Cultura',
    duration: '16:20',
    date: '2026',
    views: '2.4mil visualizações',
    description: 'Registo da visita institucional à Catalunha, estreitando laços culturais entre Angola, Espanha e Andorra.',
    image: vityNsalambiImg
  }
];

interface VideosPageProps {
  onShowToast: (msg: string) => void;
}

export const VideosPage: React.FC<VideosPageProps> = ({ onShowToast }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const categories = ['todos', 'Diplomacia', 'Institucional', 'Cultura', 'Cultura & Moda', 'Economia', 'Turismo & Cultura'];

  const filteredVideos = videoItems.filter((item) => {
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
            <VideoIcon className="w-6 h-6 text-[#d9251d]" />
            <span>Videoteca Oficial & Reportagens</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#666]">
            Assista aos registos audiovisuais das cimeiras bilaterais, fóruns económicos, entrevistas e eventos culturais da Embaixada.
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 px-4 py-2 rounded-full font-semibold text-xs text-[#d9251d] flex items-center gap-2 shrink-0">
          <Sparkles className="w-4 h-4" />
          <span>{videoItems.length} Vídeos Disponíveis</span>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 shrink-0 mr-2">
            <Filter className="w-3.5 h-3.5 text-[#d9251d]" />
            <span>Categoria:</span>
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
              {cat === 'todos' ? 'Todos os Vídeos' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar vídeos..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none focus:border-[#d9251d] transition-colors"
          />
        </div>
      </div>

      {/* VIDEOS GRID */}
      {filteredVideos.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
          <VideoIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800 mb-1">Nenhum vídeo encontrado</h3>
          <p className="text-xs text-gray-500">Tente pesquisar por outro termo ou categoria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => {
                setActiveVideo(video);
                setIsPlaying(true);
              }}
              className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="h-48 overflow-hidden relative bg-gray-900">
                <img
                  src={video.image}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#d9251d] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>
                <span className="absolute top-3 left-3 bg-[#d9251d] text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded shadow-xs">
                  {video.category}
                </span>
                <span className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded">
                  {video.duration}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2 group-hover:text-[#d9251d] transition-colors leading-snug">
                    {video.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#d9251d]" />
                    <span>{video.date}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-gray-400" />
                    <span>{video.views}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIDEO PLAYER MODAL */}
      {activeVideo && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setActiveVideo(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[95vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-gray-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-[#d9251d] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                  {activeVideo.category}
                </span>
                <span className="text-xs text-gray-300">Duração: {activeVideo.duration}</span>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* VIDEO PLAYER */}
            <div className="bg-black aspect-video relative flex items-center justify-center overflow-hidden">
              {activeVideo.videoUrl ? (
                <video
                  src={activeVideo.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                <>
                  <img
                    src={activeVideo.image}
                    alt={activeVideo.title}
                    className="w-full h-full object-cover opacity-80"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-6">
                    <div className="flex justify-between items-center">
                      <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-white"></span>
                        Transmissão Oficial Mosaico TV
                      </span>
                      <span className="text-xs text-white/80 bg-black/50 px-3 py-1 rounded">
                        {activeVideo.views}
                      </span>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                      {isPlaying ? (
                        <div className="text-center space-y-3 bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-white/20 max-w-lg">
                          <div className="w-14 h-14 rounded-full bg-[#d9251d] text-white flex items-center justify-center mx-auto shadow-lg animate-bounce">
                            <Play className="w-6 h-6 fill-white ml-0.5" />
                          </div>
                          <h4 className="text-sm font-bold text-white">A reproduzir vídeo institucional</h4>
                          <p className="text-xs text-gray-300">
                            O sinal oficial da Embaixada de Angola em Espanha está em transmissão contínua.
                          </p>
                          <button
                            onClick={() => setIsPlaying(false)}
                            className="bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                          >
                            Pausar Reprodução
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setIsPlaying(true)}
                          className="w-16 h-16 rounded-full bg-[#d9251d] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Play className="w-8 h-8 fill-white ml-1" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="w-full bg-white/30 h-1.5 rounded-full overflow-hidden cursor-pointer">
                        <div className="bg-[#d9251d] w-2/5 h-full"></div>
                      </div>
                      <div className="flex justify-between text-[11px] text-white/80">
                        <span>04:15 / {activeVideo.duration}</span>
                        <span>HD 1080p • Embaixada de Angola</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="p-6 bg-white space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                  {activeVideo.title}
                </h2>
                <button
                  onClick={() => {
                    onShowToast('Link do vídeo copiado para a área de transferência!');
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer shrink-0"
                >
                  <Share2 className="w-4 h-4 text-[#d9251d]" />
                  <span>Partilhar Vídeo</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {activeVideo.description}
              </p>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>Publicado em {activeVideo.date} • Canal Oficial Mosaico</span>
                <span className="font-bold text-[#d9251d] flex items-center gap-1">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Conteúdo Oficial Verificado</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
