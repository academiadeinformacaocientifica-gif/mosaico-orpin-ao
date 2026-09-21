/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Landmark, 
  MapPin, 
  Clock, 
  Briefcase, 
  CheckCircle2,
  AlertTriangle 
} from 'lucide-react';
import { DiplomaticEvent } from '../../../types';
import {
  DiplomaticEventInput,
  createDiplomaticEvent,
  updateDiplomaticEvent,
  deleteDiplomaticEvent,
} from '../../../lib/diplomaticAgendaService';
import { DiplomaticEventFormModal } from '../DiplomaticEventFormModal';

interface AdminDiplomaticAgendaSectionProps {
  diplomaticEvents: DiplomaticEvent[];
  searchQuery: string;
  statusFilter: 'todos' | 'publicados' | 'rascunhos';
  createTrigger?: number;
  onEventsChanged: () => void;
  onShowToast: (msg: string) => void;
}

export const AdminDiplomaticAgendaSection: React.FC<AdminDiplomaticAgendaSectionProps> = ({
  diplomaticEvents,
  searchQuery,
  statusFilter,
  createTrigger,
  onEventsChanged,
  onShowToast,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DiplomaticEvent | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (createTrigger && createTrigger > 0) {
      setEditingItem(null);
      setModalOpen(true);
    }
  }, [createTrigger]);

  const filteredEvents = useMemo(() => {
    return [...diplomaticEvents].filter((item) => {
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
  }, [diplomaticEvents, searchQuery, statusFilter]);

  const handleSave = async (id: string | null, input: DiplomaticEventInput) => {
    try {
      if (id) {
        await updateDiplomaticEvent(id, input);
        onShowToast('Compromisso diplomático atualizado com sucesso!');
      } else {
        await createDiplomaticEvent(input);
        onShowToast('Novo compromisso diplomático agendado com sucesso!');
      }
      onEventsChanged();
    } catch (err: unknown) {
      console.error(err);
      onShowToast(err instanceof Error ? err.message : 'Erro ao guardar compromisso diplomático.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteDiplomaticEvent(id);
      setConfirmDeleteId(null);
      onShowToast('Compromisso diplomático removido com sucesso.');
      onEventsChanged();
    } catch (err: unknown) {
      console.error(err);
      onShowToast('Falha ao remover compromisso.');
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
            <Landmark className="w-5 h-5 text-amber-600" />
            <span>Gestão da Agenda Missão Diplomática</span>
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Cadastre reuniões bilaterais, consultas políticas, cimeiras empresariais e atos de chancelaria
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingItem(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Novo Compromisso Diplomático</span>
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
                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 bg-[#1e2330]">
                      <Landmark className="w-8 h-8 mb-1 text-amber-400/60" />
                      <span className="text-[11px]">Compromisso Institucional</span>
                    </div>
                  )}

                  {/* CATEGORY & STATUS BADGES */}
                  <span className="absolute top-2.5 left-2.5 bg-stone-900/90 text-amber-400 border border-amber-500/40 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                    {event.category}
                  </span>

                  <span className="absolute top-2.5 right-2.5 bg-white/90 text-gray-800 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{event.status || 'Agendado'}</span>
                  </span>
                </div>

                {/* DETAILS */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      event.isPublished !== false
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {event.isPublished !== false ? 'Público' : 'Rascunho'}
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
                      <Clock className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                      <span className="truncate">{event.date} • {event.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-800">
                      <Briefcase className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="truncate font-medium">{event.organizer}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD ACTIONS */}
              <div className="p-4 pt-2 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-1">
                  {event.registrationRequired && (
                    <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded-sm border border-amber-200 font-medium">
                      Credenciação
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(event);
                      setModalOpen(true);
                    }}
                    className="p-1.5 text-gray-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Editar compromisso"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(event.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar compromisso"
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
                    <span>Eliminar este compromisso diplomático?</span>
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
          <Landmark className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-gray-800 mb-1">Nenhum compromisso diplomático agendado</h4>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
            Utilize o botão abaixo para registar o primeiro encontro protocolar ou evento institucional da Missão.
          </p>
          <button
            type="button"
            onClick={() => {
              setEditingItem(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold transition-colors"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Agendar Primeiro Compromisso</span>
          </button>
        </div>
      )}

      {/* FORM MODAL */}
      {modalOpen && (
        <DiplomaticEventFormModal
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
