import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  MapPin, 
  Clock, 
  Share2, 
  Building2, 
  Search, 
  Tag, 
  CalendarPlus,
  Sparkles,
  Ticket,
  X,
  ChevronRight,
  Info
} from 'lucide-react';
import { CulturalEvent } from '../../types';
import { getLocalCulturalEvents } from '../../lib/culturalAgendaService';

interface CulturalAgendaPageProps {
  events?: CulturalEvent[];
  onShowToast?: (message: string) => void;
}

export const CulturalAgendaPage: React.FC<CulturalAgendaPageProps> = ({ events: propEvents, onShowToast }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('Todas');
  const [selectedEvent, setSelectedEvent] = useState<CulturalEvent | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedEvent(null);
      }
    };
    if (selectedEvent) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedEvent]);

  const baseEvents = propEvents ?? getLocalCulturalEvents();
  const publishedEvents = baseEvents.filter((e) => e.isPublished !== false);

  const categories = ['Todas', 'Cinema', 'Música & Dança', 'Artes Plásticas', 'Literatura', 'Gastronomia', 'Comunidade'];
  const cities = ['Todas', 'Madrid', 'Barcelona'];

  const filteredEvents = publishedEvents.filter((event) => {
    const matchesCategory = selectedCategory === 'Todas' || event.category === selectedCategory;
    const matchesCity = selectedCity === 'Todas' || event.city.toLowerCase().includes(selectedCity.toLowerCase());
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesCity && matchesSearch;
  });

  const handleShare = (event: CulturalEvent) => {
    if (navigator.share) {
      navigator.share({
        title: `${event.title} | Agenda Cultural Mosaico`,
        text: `${event.title} - ${event.date} em ${event.location}, ${event.city}.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${event.title} - ${event.date} às ${event.time} em ${event.location}. Mais informações no Portal Mosaico.`);
      onShowToast?.('Ligação do evento copiada para a área de transferência!');
    }
  };

  const handleAddToCalendar = (event: CulturalEvent) => {
    // Generate .ics calendar file
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Revista Mosaico//Agenda Cultural//PT',
      'BEGIN:VEVENT',
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}\\n\\nOrganizador: ${event.organizer}`,
      `LOCATION:${event.location}, ${event.city}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.id}-agenda-cultural.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    onShowToast?.(`Evento adicionado ao seu calendário: ${event.title}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* HEADER BANNER */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-stone-900 via-neutral-900 to-red-950 text-white p-8 sm:p-12 mb-10 shadow-xl border border-white/10">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/30 border border-red-500/40 text-red-200 text-xs font-semibold uppercase tracking-wider mb-4">
            <CalendarDays className="w-3.5 h-3.5 text-red-400" />
            <span>Programação Oficial</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
            Agenda Cultural
          </h1>
          <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
            Acompanhe as mostras de cinema, exposições artísticas, espetáculos de dança, conferências literárias e celebrações que projetam a identidade cultural e a diáspora de Angola no Reino de Espanha e Andorra.
          </p>
        </div>

        {/* SUBTLE BACKGROUND ACCENT */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 pointer-events-none">
          <CalendarDays className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-xs border border-gray-200 mb-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* SEARCH INPUT */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar por evento, artista, local ou organizador..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#d9251d]/20 focus:border-[#d9251d] transition-all"
            />
          </div>

          {/* CITY FILTER */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Cidade:</span>
            <div className="inline-flex rounded-lg bg-gray-100 p-1 border border-gray-200">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                    selectedCity === city
                      ? 'bg-white text-gray-900 shadow-xs font-semibold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CATEGORY TABS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <span className="text-xs text-gray-400 font-medium mr-1 flex items-center gap-1 shrink-0">
            <Tag className="w-3.5 h-3.5" />
            <span>Categoria:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs whitespace-nowrap px-3 py-1.5 rounded-full font-medium transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#d9251d] text-white shadow-xs font-bold'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* EVENTS GRID */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-red-300 transition-all hover:shadow-xl flex flex-col group cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#d9251d]/40"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedEvent(event);
                }
              }}
            >
              {/* IMAGE HEADER */}
              <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-1.5 text-xs text-stone-200 font-medium mb-1">
                    <CalendarDays className="w-3.5 h-3.5 text-red-400" />
                    <span>{event.date}</span>
                  </div>
                </div>
              </div>

              {/* CARD BODY */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-[#d9251d] transition-colors line-clamp-2 mb-2">
                    {event.title}
                  </h3>

                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-4">
                    {event.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-gray-500 pt-2 border-t border-gray-100 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#d9251d] shrink-0" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#d9251d] shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{event.location}, {event.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="line-clamp-1 text-gray-500 font-medium">{event.organizer}</span>
                    </div>
                  </div>
                </div>

                {/* CARD FOOTER ACTIONS */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 mt-auto">
                  <div className="flex items-center gap-2">
                    {event.registrationRequired ? (
                      <span className="text-[10px] bg-amber-50 text-amber-700 font-semibold px-2 py-0.5 rounded-sm border border-amber-200 flex items-center gap-1">
                        <Ticket className="w-3 h-3 text-amber-600" />
                        <span>Inscrição Prévia</span>
                      </span>
                    ) : (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-sm border border-emerald-200">
                        Entrada Livre
                      </span>
                    )}

                    <span className="text-[11px] font-semibold text-[#d9251d] inline-flex items-center group-hover:translate-x-0.5 transition-transform">
                      Ver mais
                      <ChevronRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCalendar(event);
                      }}
                      className="p-1.5 text-gray-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Adicionar ao Calendário (.ics)"
                    >
                      <CalendarPlus className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(event);
                      }}
                      className="p-1.5 text-gray-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Partilhar Evento"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
          <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800 mb-1">Nenhum evento encontrado</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Não foram localizados eventos para os filtros selecionados. Tente ajustar os termos de pesquisa ou selecionar outra categoria.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('Todas');
              setSelectedCity('Todas');
              setSearchQuery('');
            }}
            className="mt-4 text-xs font-semibold text-[#d9251d] hover:underline"
          >
            Limpar todos os filtros
          </button>
        </div>
      )}

      {/* MODAL DE VISUALIZAÇÃO COMPLETA DO EVENTO */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs overflow-y-auto animate-fadeIn"
          onClick={() => setSelectedEvent(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-event-title"
        >
          <div 
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 my-auto flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HERO IMAGE COM BOTÃO FECHAR */}
            <div className="relative h-56 sm:h-72 w-full overflow-hidden bg-stone-900 shrink-0">
              <img
                src={selectedEvent.imageUrl}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />
              
              {/* BOTÃO FECHAR SUPERIOR */}
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all hover:scale-105"
                title="Fechar (Esc)"
              >
                <X className="w-5 h-5" />
              </button>

              {/* INFORMAÇÕES DE CABEÇALHO NA IMAGEM */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-xs font-medium text-stone-200 mb-2">
                  <CalendarDays className="w-3.5 h-3.5 text-red-400" />
                  <span>{selectedEvent.date}</span>
                  <span className="opacity-60">•</span>
                  <Clock className="w-3.5 h-3.5 text-red-400" />
                  <span>{selectedEvent.time}</span>
                </div>
                <h2 id="modal-event-title" className="text-lg sm:text-2xl font-extrabold text-white leading-tight drop-shadow-md">
                  {selectedEvent.title}
                </h2>
              </div>
            </div>

            {/* CONTEÚDO COM SCROLL INTERNO */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              {/* CARTÕES DE METADADOS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200/80 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-100 text-[#d9251d] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">Localização</span>
                    <p className="text-xs font-semibold text-gray-900 leading-snug">{selectedEvent.location}</p>
                    <p className="text-[11px] text-gray-500">{selectedEvent.city}</p>
                  </div>
                </div>

                <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200/80 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">Organização</span>
                    <p className="text-xs font-semibold text-gray-900 leading-snug">{selectedEvent.organizer}</p>
                    <p className="text-[11px] text-gray-500">Promotor Oficial</p>
                  </div>
                </div>
              </div>

              {/* TIPO DE INGRESSO / ACESSO */}
              <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-200/80">
                <div className="flex items-center gap-2.5">
                  <Ticket className="w-4 h-4 text-[#d9251d]" />
                  <span className="text-xs font-medium text-gray-700">Acesso ao Evento:</span>
                </div>
                {selectedEvent.registrationRequired ? (
                  <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Inscrição Prévia Obrigatória
                  </span>
                ) : (
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Entrada Livre / Gratuita
                  </span>
                )}
              </div>

              {/* DESCRIÇÃO COMPLETA */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-[#d9251d]" />
                  <span>Sobre este Evento</span>
                </h4>
                <div className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-stone-50/50 p-4 rounded-xl border border-stone-100">
                  {selectedEvent.description}
                </div>
              </div>
            </div>

            {/* RODAPÉ DO MODAL COM AÇÕES */}
            <div className="p-4 sm:p-5 bg-stone-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 rounded-xl transition-colors"
              >
                Fechar
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleShare(selectedEvent)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl shadow-xs transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Partilhar</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAddToCalendar(selectedEvent)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#d9251d] hover:bg-[#b81d16] rounded-xl shadow-md shadow-red-600/20 transition-all hover:scale-[1.02]"
                >
                  <CalendarPlus className="w-3.5 h-3.5" />
                  <span>Adicionar ao Calendário</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
