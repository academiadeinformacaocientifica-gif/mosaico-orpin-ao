/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Pencil, Trash2, Compass, MapPin } from 'lucide-react';
import { NaturalWonder } from '../../../data/wondersData';
import {
  NaturalWonderInput,
  createNaturalWonder,
  updateNaturalWonder,
  deleteNaturalWonder,
} from '../../../lib/wonderService';
import { WonderFormModal } from '../WonderFormModal';

interface AdminWondersSectionProps {
  naturalWonders: NaturalWonder[];
  searchQuery: string;
  statusFilter: 'todos' | 'publicados' | 'rascunhos';
  createTrigger?: number;
  onWondersChanged: () => void;
  onShowToast: (msg: string) => void;
}

export const AdminWondersSection: React.FC<AdminWondersSectionProps> = ({
  naturalWonders,
  searchQuery,
  statusFilter,
  createTrigger,
  onWondersChanged,
  onShowToast,
}) => {
  const [wonderFormOpen, setWonderFormOpen] = useState(false);
  const [editingWonder, setEditingWonder] = useState<NaturalWonder | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (createTrigger && createTrigger > 0) {
      setEditingWonder(null);
      setWonderFormOpen(true);
    }
  }, [createTrigger]);

  const filteredNaturalWonders = useMemo(() => {
    return [...naturalWonders]
      .sort((a, b) => (a.number || 0) - (b.number || 0))
      .filter((w) => {
        if (statusFilter === 'publicados' && w.isPublished === false) return false;
        if (statusFilter === 'rascunhos' && w.isPublished !== false) return false;
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          w.name.toLowerCase().includes(q) ||
          w.province.toLowerCase().includes(q) ||
          w.location.toLowerCase().includes(q) ||
          w.summary.toLowerCase().includes(q) ||
          w.tagline.toLowerCase().includes(q)
        );
      });
  }, [naturalWonders, searchQuery, statusFilter]);

  const handleSaveWonder = async (id: string | null, input: NaturalWonderInput) => {
    if (id) {
      await updateNaturalWonder(id, input);
      onShowToast(
        input.isPublished !== false
          ? 'Maravilha natural atualizada com sucesso!'
          : 'Rascunho guardado com sucesso.'
      );
    } else {
      await createNaturalWonder(input);
      onShowToast(
        input.isPublished !== false
          ? 'Nova maravilha natural criada com sucesso!'
          : 'Rascunho criado com sucesso.'
      );
    }
    setWonderFormOpen(false);
    setEditingWonder(null);
    onWondersChanged();
  };

  const handleToggleWonderPublish = async (wonder: NaturalWonder) => {
    const nextPublished = wonder.isPublished === false;
    try {
      await updateNaturalWonder(wonder.id, {
        number: wonder.number,
        name: wonder.name,
        officialTitle: wonder.officialTitle,
        province: wonder.province,
        location: wonder.location,
        tagline: wonder.tagline,
        summary: wonder.summary,
        fullDescription: wonder.fullDescription,
        geographyAndNature: wonder.geographyAndNature,
        howToVisit: wonder.howToVisit,
        image: wonder.image,
        galleryImages: wonder.galleryImages,
        highlights: wonder.highlights,
        facts: wonder.facts,
        isPublished: nextPublished,
      });
      onShowToast(
        nextPublished
          ? 'Maravilha natural publicada no portal!'
          : 'Maravilha colocada em rascunho.'
      );
      onWondersChanged();
    } catch (err) {
      onShowToast('Erro ao atualizar estado da maravilha natural.');
      console.error(err);
    }
  };

  const handleDeleteWonder = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteNaturalWonder(id);
      onShowToast('Maravilha natural removida com sucesso.');
      onWondersChanged();
    } catch (err) {
      onShowToast('Não foi possível remover a maravilha natural.');
      console.error(err);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-emerald-900/10 border border-emerald-900/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-950">
              7 Maravilhas Naturais e Turismo de Angola
            </h3>
            <p className="text-xs text-emerald-800">
              Faça a gestão completa dos patrimónios naturais, províncias, fotografias, destaques e fichas turísticas.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingWonder(null);
            setWonderFormOpen(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Maravilha</span>
        </button>
      </div>

      {filteredNaturalWonders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-xs">
          <Compass className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#111] mb-1">
            Nenhuma maravilha encontrada
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            {searchQuery ? 'Nenhum resultado corresponde à pesquisa.' : 'Ainda não existem maravilhas registadas.'}
          </p>
          <button
            onClick={() => {
              setEditingWonder(null);
              setWonderFormOpen(true);
            }}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Primeira Maravilha</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredNaturalWonders.map((wonder) => (
            <div
              key={wonder.id}
              className="bg-white rounded-xl p-4 border border-gray-200/80 shadow-xs hover:border-gray-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                <div className="relative w-24 h-20 sm:w-28 sm:h-20 rounded-lg overflow-hidden shrink-0 bg-stone-100 border border-gray-200">
                  <img
                    src={wonder.image}
                    alt={wonder.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-1 left-1 bg-[#d9251d] text-white text-[10px] font-black w-5 h-5 rounded-md flex items-center justify-center shadow-xs">
                    #{wonder.number}
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Província de {wonder.province}
                    </span>
                    {wonder.isPublished !== false ? (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        Publicado
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                        Rascunho
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-[#111] truncate">
                    {wonder.name}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                    {wonder.tagline || wonder.summary}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                    <span className="truncate">{wonder.location}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => handleToggleWonderPublish(wonder)}
                  className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    wonder.isPublished !== false
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {wonder.isPublished !== false ? 'Despublicar' : 'Publicar'}
                </button>
                <button
                  onClick={() => {
                    setEditingWonder(wonder);
                    setWonderFormOpen(true);
                  }}
                  className="p-2 rounded-lg text-[#444] hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                  title="Editar maravilha natural"
                  aria-label="Editar"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                {confirmDeleteId === wonder.id ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDeleteWonder(wonder.id)}
                      disabled={deletingId === wonder.id}
                      className="text-[11px] font-bold text-white bg-[#d9251d] px-2.5 py-1.5 rounded-lg cursor-pointer"
                    >
                      {deletingId === wonder.id ? '...' : 'Confirmar'}
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="text-[11px] font-semibold text-[#666] px-2 py-1.5 cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(wonder.id)}
                    className="p-2 rounded-lg text-[#444] hover:text-[#d9251d] hover:bg-red-50 transition-colors cursor-pointer"
                    title="Eliminar maravilha natural"
                    aria-label="Remover"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {wonderFormOpen && (
        <WonderFormModal
          initialWonder={editingWonder}
          onClose={() => {
            setWonderFormOpen(false);
            setEditingWonder(null);
          }}
          onSave={handleSaveWonder}
        />
      )}
    </div>
  );
};
