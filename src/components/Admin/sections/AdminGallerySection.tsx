/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react';
import { GalleryItem } from '../../../types';
import {
  GalleryInput,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from '../../../lib/galleryService';
import { GalleryFormModal } from '../GalleryFormModal';

interface AdminGallerySectionProps {
  galleryItems: GalleryItem[];
  searchQuery: string;
  statusFilter: 'todos' | 'publicados' | 'rascunhos';
  createTrigger?: number;
  onGalleryChanged: () => void;
  onShowToast: (msg: string) => void;
}

export const AdminGallerySection: React.FC<AdminGallerySectionProps> = ({
  galleryItems,
  searchQuery,
  statusFilter,
  createTrigger,
  onGalleryChanged,
  onShowToast,
}) => {
  const [galleryFormOpen, setGalleryFormOpen] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (createTrigger && createTrigger > 0) {
      setEditingGalleryItem(null);
      setGalleryFormOpen(true);
    }
  }, [createTrigger]);

  const filteredGalleryItems = useMemo(() => {
    return [...galleryItems].filter((item) => {
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
  }, [galleryItems, searchQuery, statusFilter]);

  const handleSaveGallery = async (id: string | null, input: GalleryInput | GalleryInput[]) => {
    try {
      if (id && !Array.isArray(input)) {
        await updateGalleryItem(id, input);
        onShowToast(input.isPublished ? 'Imagem atualizada e sincronizada na galeria com sucesso!' : 'Rascunho de imagem guardado.');
      } else {
        const list = Array.isArray(input) ? input : [input];
        for (const item of list) {
          await createGalleryItem(item);
        }
        onShowToast(
          list.length > 1
            ? `${list.length} fotografias adicionadas e sincronizadas com sucesso à galeria!`
            : list[0]?.isPublished
            ? 'Nova imagem publicada e sincronizada na galeria!'
            : 'Rascunho de imagem guardado!'
        );
      }
      setGalleryFormOpen(false);
      setEditingGalleryItem(null);
      onGalleryChanged();
    } catch (err: any) {
      console.error('Erro ao guardar imagem:', err);
      onShowToast(`Erro ao gravar imagem: ${err.message || 'Falha de comunicação com a base de dados.'}`);
    }
  };

  const handleToggleGalleryPublish = async (item: GalleryItem) => {
    try {
      const nextPublished = !item.isPublished;
      await updateGalleryItem(item.id, {
        ...item,
        isPublished: nextPublished,
      });
      onShowToast(nextPublished ? 'Imagem publicada com sucesso na galeria!' : 'Imagem colocada em rascunho.');
      onGalleryChanged();
    } catch (err) {
      onShowToast('Erro ao atualizar estado da imagem.');
      console.error(err);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteGalleryItem(id);
      onShowToast('Imagem removida da galeria com sucesso.');
      onGalleryChanged();
    } catch (err) {
      onShowToast('Não foi possível remover o registo da galeria.');
      console.error(err);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div>
      {filteredGalleryItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-xs">
          <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-gray-800 mb-1">
            {searchQuery || statusFilter !== 'todos'
              ? 'Nenhum registo fotográfico encontrado com os filtros aplicados'
              : 'Ainda não há imagens na galeria'}
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            {searchQuery || statusFilter !== 'todos'
              ? 'Tente ajustar o termo de pesquisa ou o filtro de estado.'
              : 'Adicione fotografias e registos visuais oficiais.'}
          </p>
          <button
            onClick={() => {
              setEditingGalleryItem(null);
              setGalleryFormOpen(true);
            }}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Nova Imagem
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          {filteredGalleryItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 px-5 py-4 border-b border-[#f0f0f0] last:border-b-0 hover:bg-[#fafafa] transition-colors"
            >
              <img
                src={item.image}
                alt=""
                className="w-16 h-16 object-cover rounded-lg shrink-0 bg-gray-100"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">
                    {item.category}
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
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-gray-400">{item.date}</span>
                  {item.collection && (
                    <span className="text-[10px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                      Colecção: {item.collection}
                    </span>
                  )}
                  {item.images && item.images.length > 1 && (
                    <span className="text-[10px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {item.images.length} fotos
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleToggleGalleryPublish(item)}
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
                    setEditingGalleryItem(item);
                    setGalleryFormOpen(true);
                  }}
                  className="p-2 rounded-lg text-[#444] hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                  title="Editar imagem"
                  aria-label="Editar"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                {confirmDeleteId === item.id ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDeleteGallery(item.id)}
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
                    title="Eliminar imagem da galeria"
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

      {galleryFormOpen && (
        <GalleryFormModal
          initialItem={editingGalleryItem}
          onClose={() => {
            setGalleryFormOpen(false);
            setEditingGalleryItem(null);
          }}
          onSave={handleSaveGallery}
        />
      )}
    </div>
  );
};
