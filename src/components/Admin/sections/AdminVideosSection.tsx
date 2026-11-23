/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Pencil, Trash2, Video as VideoIcon, Play, ExternalLink } from 'lucide-react';
import { VideoItem } from '../../../types';
import {
  VideoInput,
  createVideoItem,
  updateVideoItem,
  deleteVideoItem,
} from '../../../lib/videoService';
import { VideoFormModal } from '../VideoFormModal';

interface AdminVideosSectionProps {
  videoItems: VideoItem[];
  searchQuery: string;
  statusFilter: 'todos' | 'publicados' | 'rascunhos';
  createTrigger?: number;
  onVideosChanged: () => void;
  onShowToast: (msg: string) => void;
}

export const AdminVideosSection: React.FC<AdminVideosSectionProps> = ({
  videoItems,
  searchQuery,
  statusFilter,
  createTrigger,
  onVideosChanged,
  onShowToast,
}) => {
  const [videoFormOpen, setVideoFormOpen] = useState(false);
  const [editingVideoItem, setEditingVideoItem] = useState<VideoItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (createTrigger && createTrigger > 0) {
      setEditingVideoItem(null);
      setVideoFormOpen(true);
    }
  }, [createTrigger]);

  const filteredVideoItems = useMemo(() => {
    return [...videoItems].filter((item) => {
      if (statusFilter === 'publicados' && item.isPublished === false) return false;
      if (statusFilter === 'rascunhos' && item.isPublished !== false) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    });
  }, [videoItems, searchQuery, statusFilter]);

  const handleSaveVideo = async (id: string | null, input: VideoInput) => {
    if (id) {
      await updateVideoItem(id, input);
      onShowToast(input.isPublished ? 'Vídeo atualizado e publicado com sucesso.' : 'Rascunho de vídeo guardado.');
    } else {
      await createVideoItem(input);
      onShowToast(input.isPublished ? 'Novo vídeo publicado com sucesso!' : 'Rascunho de vídeo guardado!');
    }
    setVideoFormOpen(false);
    setEditingVideoItem(null);
    onVideosChanged();
  };

  const handleToggleVideoPublish = async (item: VideoItem) => {
    try {
      const nextPublished = !item.isPublished;
      await updateVideoItem(item.id, {
        ...item,
        isPublished: nextPublished,
      });
      onShowToast(nextPublished ? 'Vídeo publicado com sucesso!' : 'Vídeo colocado em rascunho.');
      onVideosChanged();
    } catch (err) {
      onShowToast('Erro ao atualizar estado do vídeo.');
      console.error(err);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteVideoItem(id);
      onShowToast('Vídeo removido com sucesso.');
      onVideosChanged();
    } catch (err) {
      onShowToast('Não foi possível remover o vídeo.');
      console.error(err);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div>
      {filteredVideoItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-xs">
          <VideoIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-gray-800 mb-1">
            {searchQuery || statusFilter !== 'todos'
              ? 'Nenhum vídeo encontrado com os filtros aplicados'
              : 'Ainda não há vídeos registados'}
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            {searchQuery || statusFilter !== 'todos'
              ? 'Tente ajustar o termo de pesquisa ou o filtro de estado.'
              : 'Adicione reportagens, transmissões e documentários.'}
          </p>
          <button
            onClick={() => {
              setEditingVideoItem(null);
              setVideoFormOpen(true);
            }}
            className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Novo Vídeo
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          {filteredVideoItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 px-5 py-4 border-b border-[#f0f0f0] last:border-b-0 hover:bg-[#fafafa] transition-colors"
            >
              <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                <img
                  src={item.image}
                  alt=""
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Play className="w-4 h-4 text-white fill-white" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wide">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                    ⏱ {item.duration}
                  </span>
                  {item.isPublished !== false ? (
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Publicado
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      Rascunho
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-[#111] truncate">{item.title}</h3>
                <p className="text-[11px] text-gray-500 line-clamp-1">{item.description}</p>
                <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1.5">
                  <span>{item.date}</span>
                  {item.videoUrl && (
                    <span className="flex items-center gap-1 text-gray-500 font-mono text-[9px] bg-gray-100 px-1.5 py-0.5 rounded max-w-xs truncate">
                      <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      {item.videoUrl}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleToggleVideoPublish(item)}
                  className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    item.isPublished !== false
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {item.isPublished !== false ? 'Despublicar' : 'Publicar'}
                </button>
                <button
                  onClick={() => {
                    setEditingVideoItem(item);
                    setVideoFormOpen(true);
                  }}
                  className="p-2 rounded-lg text-[#444] hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
                  title="Editar vídeo"
                  aria-label="Editar"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                {confirmDeleteId === item.id ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDeleteVideo(item.id)}
                      disabled={deletingId === item.id}
                      className="text-[11px] font-bold text-white bg-[#d9251d] px-2.5 py-1.5 rounded-lg cursor-pointer"
                    >
                      {deletingId === item.id ? '...' : 'Confirmar'}
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
                    onClick={() => setConfirmDeleteId(item.id)}
                    className="p-2 rounded-lg text-[#444] hover:text-[#d9251d] hover:bg-red-50 transition-colors cursor-pointer"
                    title="Eliminar vídeo"
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

      {videoFormOpen && (
        <VideoFormModal
          initialItem={editingVideoItem}
          onClose={() => {
            setVideoFormOpen(false);
            setEditingVideoItem(null);
          }}
          onSave={handleSaveVideo}
        />
      )}
    </div>
  );
};
