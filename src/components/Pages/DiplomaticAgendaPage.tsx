import React, { useState } from 'react';
import { 
  Landmark, 
  MapPin, 
  Clock, 
  Share2, 
  Building2, 
  Search, 
  Tag, 
  CalendarPlus,
  Briefcase,
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';
import { DiplomaticEvent } from '../../types';
import { getLocalDiplomaticEvents } from '../../lib/diplomaticAgendaService';

interface DiplomaticAgendaPageProps {
  events?: DiplomaticEvent[];
  onShowToast?: (message: string) => void;
}

export const DiplomaticAgendaPage: React.FC<DiplomaticAgendaPageProps> = ({ events: propEvents, onShowToast }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const baseEvents = propEvents ?? getLocalDiplomaticEvents();
  const publishedEvents = baseEvents.filter((e) => e.isPublished !== false);

  const categories = ['Todas', 'Diplomacia', 'Comércio', 'Consular', 'Académico'];

  const filteredEvents = publishedEvents.filter((event) => {
    const matchesCategory = selectedCategory === 'Todas' || event.category === selectedCategory;
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.city.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleShare = (event: DiplomaticEvent) => {
    if (navigator.share) {
      navigator.share({
        title: `${event.title} | Agenda Missão Diplomática`,
        text: `${event.title} - ${event.date} em ${event.location}, ${event.city}.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${event.title} - ${event.date} às ${event.time} em ${event.location}. Missão Diplomática de Angola.`);
      onShowToast?.('Ligação do compromisso diplomático copiada!');
    }
  };

  const handleAddToCalendar = (event: DiplomaticEvent) => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Embaixada de Angola em Espanha//Agenda Diplomatica//PT',
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
    link.setAttribute('download', `${event.id}-agenda-diplomatica.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    onShowToast?.(`Compromisso oficial adicionado ao calendário: ${event.title}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* HEADER BANNER */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#1a1c23] via-[#242938] to-[#111827] text-white p-8 sm:p-12 mb-10 shadow-xl border border-white/10">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Landmark className="w-3.5 h-3.5 text-amber-400" />
            <span>Missão Diplomática da República de Angola</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
            Agenda Missão Diplomática
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
            Registo oficial das atividades protocolares, consultas políticas bilaterais com o Governo Espanhol, fóruns empresariais e cooperação estratégica com organismos multilaterais no Reino de Espanha e no Principado de Andorra.
          </p>
        </div>

        {/* SUBTLE BACKGROUND ACCENT */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 pointer-events-none">
          <Landmark className="w-80 h-80 text-white" />
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
              placeholder="Pesquisar por compromisso, organismo, local ou tema..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all"
            />
          </div>

          {/* TOTAL COUNTER BADGE */}
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <CalendarCheck className="w-4 h-4 text-amber-600" />
            <span>{filteredEvents.length} compromissos institucionais listados</span>
          </div>
        </div>

        {/* CATEGORY TABS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <span className="text-xs text-gray-400 font-medium mr-1 flex items-center gap-1 shrink-0">
            <Tag className="w-3.5 h-3.5" />
            <span>Âmbito:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs whitespace-nowrap px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-amber-400 shadow-xs font-bold border border-amber-500/30'
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
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-amber-300 transition-all hover:shadow-lg flex flex-col group"
            >
              {/* IMAGE HEADER */}
              <div className="relative h-44 w-full overflow-hidden bg-stone-900">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-black/30 to-transparent" />
                
                {/* CATEGORY BADGE */}
                <span className="absolute top-3 left-3 bg-stone-900/90 text-amber-400 border border-amber-500/40 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                  {event.category}
                </span>

                {/* STATUS BADGE */}
                <span className="absolute top-3 right-3 bg-white/90 text-gray-800 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>{event.status || 'Agendado'}</span>
                </span>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-1.5 text-xs text-amber-200 font-semibold mb-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{event.date}</span>
                  </div>
                </div>
              </div>

              {/* CARD BODY */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-amber-700 transition-colors line-clamp-2 mb-2">
                    {event.title}
                  </h3>

                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-4">
                    {event.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-gray-500 pt-2 border-t border-gray-100 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{event.location}, {event.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="line-clamp-1 text-gray-700 font-medium">{event.organizer}</span>
                    </div>
                  </div>
                </div>

                {/* CARD FOOTER ACTIONS */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 mt-auto">
                  <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                    <Briefcase className="w-3 h-3 text-amber-600" />
                    <span>Protocolo Oficial</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleAddToCalendar(event)}
                      className="p-1.5 text-gray-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Adicionar à Agenda (.ics)"
                    >
                      <CalendarPlus className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleShare(event)}
                      className="p-1.5 text-gray-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Partilhar Compromisso"
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
          <Landmark className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800 mb-1">Nenhum compromisso encontrado</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Não foram localizados compromissos institucionais para a categoria ou termo pesquisado.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('Todas');
              setSearchQuery('');
            }}
            className="mt-4 text-xs font-semibold text-amber-700 hover:underline"
          >
            Limpar todos os filtros
          </button>
        </div>
      )}
    </div>
  );
};
