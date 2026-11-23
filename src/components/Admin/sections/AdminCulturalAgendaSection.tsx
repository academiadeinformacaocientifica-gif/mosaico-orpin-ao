/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  CalendarDays, 
  MapPin, 
  Clock, 
  Sparkles, 
  Ticket,
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';
import { CulturalEvent } from '../../../types';
import {
  CulturalEventInput,
  createCulturalEvent,
  updateCulturalEvent,
  deleteCulturalEvent,
  toggleCulturalEventPublish,
} from '../../../lib/culturalAgendaService';
import { CulturalEventFormModal } from '../CulturalEventFormModal';

interface AdminCulturalAgendaSectionProps {
  culturalEvents: CulturalEvent[];
  searchQuery: string;
  statusFilter: 'todos' | 'publicados' | 'rascunhos';
  createTrigger?: number;
  onEventsChanged: () => void;
  onShowToast: (msg: string) => void;
}

export const AdminCulturalAgendaSection: React.FC<AdminCulturalAgendaSectionProps> = ({
  culturalEvents,
  searchQuery,
  statusFilter,
  createTrigger,
  onEventsChanged,
  onShowToast,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CulturalEvent | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (createTrigger && createTrigger > 0) {
      setEditingItem(null);
      setModalOpen(true);
    }
  }, [createTrigger]);

  const filteredEvents = useMemo(() => {
    return [...culturalEvents].filter((item) => {
      if (statusFilter === 'publicados' && item.isPublished === false) return false;
      if (statusFilter === 'rascunhos' && item.isPublished !== false) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.organizer.toLowerCase().includes(q)
      );
    });
  }, [culturalEvents, searchQuery, statusFilter]);

  const handleSave = async (id: string | null, input: CulturalEventInput) => {
    try {
      if (id) {
        await updateCulturalEvent(id, input);
        onShowToast('Evento cultural atualizado com sucesso!');
      } else {
        await createCulturalEvent(input);
        onShowToast('Novo evento cultural registado com sucesso!');
      }
      onEventsChanged();
    } catch (err: unknown) {
      console.error(err);
      onShowToast(err instanceof Error ? err.message : 'Erro ao guardar evento.');
    }
  };

  const handleTogglePublish = async (event: CulturalEvent) => {
    try {
      const updated = await toggleCulturalEventPublish(event.id);
      onShowToast(
        updated.isPublished !== false
          ? 'Evento publicado no portal com sucesso!'
          : 'Evento movido para rascunho.'
      );
      onEventsChanged();
    } catch (err: unknown) {
      console.error(err);
      onShowToast('Falha ao alterar estado de publicação.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteCulturalEvent(id);
      setConfirmDeleteId(null);
      onShowToast('Evento cultural removido com sucesso.');
      onEventsChanged();
    } catch (err: unknown) {
      console.error(err);
      onShowToast('Falha ao remover o evento.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* SECTION TOP BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-xs">
        <div>
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-[#d9251d]" />
            <span>Gestão da Agenda Cultural</span>
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Cadastre ciclos de cinema, concertos, tertúlias e iniciativas culturais da diáspora
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingItem(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#d9251d] hover:bg-[#b51e17] text-white rounded-lg text-xs font-bold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Evento Cultural</span>
        </button>
      </div>

      {/* EVENTS LIST */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* IMAGE / BANNER PREVIEW */}
                <div className="relative h-40 w-full bg-stone-900 overflow-hidden">
                  {event.imageUrl ? (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-500 bg-stone-100">
                      <CalendarDays className="w-8 h-8 mb-1" />
                      <span className="text-[11px]">Sem imagem de capa</span>
                    </div>
                  )}

                  {/* CATEGORY & HIGHLIGHT BADGES */}
                  <span className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                    {event.category}
                  </span>

                  {event.highlight && (
                    <span className="absolute top-2.5 right-2.5 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-3 h-3" />
                      <span>Destaque</span>
                    </span>
                  )}
                </div>

                {/* DETAILS */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      event.isPublished !== false
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {event.isPublished !== false ? 'Publicado' : 'Rascunho'}
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium">
                      {event.city}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-gray-900 line-clamp-2" title={event.title}>
                    {event.title}
                  </h4>

                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="space-y-1 text-xs text-gray-500 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span className="truncate">{event.date} • {event.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD ACTIONS */}
              <div className="p-4 pt-2 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-1">
                  {event.registrationRequired && (
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-sm border border-amber-200 flex items-center gap-1 font-medium">
                      <Ticket className="w-3 h-3" />
                      <span>Inscrição</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(event)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      event.isPublished !== false
                        ? 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
                        : 'text-amber-600 hover:text-amber-700 hover:bg-amber-50'
                    }`}
                    title={event.isPublished !== false ? 'Despublicar (mudar para rascunho)' : 'Publicar no portal'}
                  >
                    {event.isPublished !== false ? (
                      <Eye className="w-3.5 h-3.5" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(event);
                      setModalOpen(true);
                    }}
                    className="p-1.5 text-gray-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Editar evento"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(event.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar evento"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* CONFIRM DELETE MODAL OVERLAY */}
              {confirmDeleteId === event.id && (
                <div className="p-3 bg-red-50 border-t border-red-200 flex flex-col gap-2 animate-fadeIn">
                  <div className="flex items-center gap-1.5 text-xs text-red-800 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-600" />
                    <span>Eliminar este evento cultural?</span>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-gray-600 hover:bg-gray-200 rounded"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      disabled={deletingId === event.id}
                      onClick={() => handleDelete(event.id)}
                      className="px-2.5 py-1 text-[11px] font-bold text-white bg-red-600 hover:bg-red-700 rounded shadow-xs disabled:opacity-50"
                    >
                      {deletingId === event.id ? 'A eliminar...' : 'Confirmar'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200 shadow-xs">
          <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-gray-800 mb-1">Nenhum evento cultural cadastrado</h4>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
            Utilize o botão abaixo para criar o primeiro evento da programação cultural da Embaixada.
          </p>
          <button
            type="button"
            onClick={() => {
              setEditingItem(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#d9251d] hover:bg-[#b51e17] text-white rounded-lg text-xs font-bold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Primeiro Evento</span>
          </button>
        </div>
      )}

      {/* FORM MODAL */}
      {modalOpen && (
        <CulturalEventFormModal
          initialItem={editingItem}
          onClose={() => {
            setModalOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};
