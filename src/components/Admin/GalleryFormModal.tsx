/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import {
  X,
  Upload,
  Loader2,
  Save,
  Image as ImageIcon,
  Trash2,
  Star,
  Plus,
  FolderArchive,
  Link as LinkIcon,
} from 'lucide-react';
import { GalleryItem } from '../../types';
import { GalleryInput, uploadGalleryImage } from '../../lib/galleryService';

const GALLERY_CATEGORIES = [
  'Diplomacia',
  'Institucional',
  'Cultura',
  'Economia',
  'Turismo & Cultura',
  'Eventos',
  'Comunidade',
];

interface GalleryFormModalProps {
  initialItem: GalleryItem | null;
  onClose: () => void;
  onSave: (id: string | null, input: GalleryInput | GalleryInput[]) => Promise<void>;
}

export const GalleryFormModal: React.FC<GalleryFormModalProps> = ({
  initialItem,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(initialItem);
  const [title, setTitle] = useState(initialItem?.title || '');
  const [collection, setCollection] = useState(initialItem?.collection || '');
  const [category, setCategory] = useState(initialItem?.category || 'Diplomacia');
  const [date, setDate] = useState(initialItem?.date || `${new Date().getFullYear()}`);
  const [description, setDescription] = useState(initialItem?.description || '');

  // Suporte a múltiplas imagens
  const [images, setImages] = useState<string[]>(() => {
    if (initialItem) {
      if (initialItem.images && initialItem.images.length > 0) {
        return initialItem.images;
      }
      if (initialItem.image) {
        return [initialItem.image];
      }
    }
    return [];
  });

  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);
    const total = files.length;
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        setUploadProgressText(`A processar fotografia ${i + 1} de ${total}...`);
        const url = await uploadGalleryImage(files[i]);
        uploadedUrls.push(url);
      }
      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err) {
      setError('Falha ao enviar algumas imagens. Pode tentar novamente ou usar URLs diretos.');
      console.error(err);
    } finally {
      setUploading(false);
      setUploadProgressText('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (images.includes(trimmed)) {
      setError('Esta imagem já se encontra na lista.');
      return;
    }
    setImages((prev) => [...prev, trimmed]);
    setUrlInput('');
    setError(null);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetAsCover = (indexToCover: number) => {
    setImages((prev) => {
      const selected = prev[indexToCover];
      const rest = prev.filter((_, idx) => idx !== indexToCover);
      return [selected, ...rest];
    });
  };

  const handleAction = async (isPublished: boolean) => {
    setError(null);

    if (!title.trim() || !description.trim()) {
      setError('Título e descrição são obrigatórios.');
      return;
    }

    if (images.length === 0) {
      setError('Por favor selecione ou carregue pelo menos uma imagem para a galeria.');
      return;
    }

    setSaving(true);
    try {
      if (isEditing && initialItem) {
        // Edição de um registo existente
        const input: GalleryInput = {
          title: title.trim(),
          collection: collection.trim() || undefined,
          category: category.trim(),
          date: date.trim() || `${new Date().getFullYear()}`,
          description: description.trim(),
          image: images[0],
          images,
          isPublished,
        };
        await onSave(initialItem.id, input);
      } else if (images.length === 1) {
        // Registo individual
        const input: GalleryInput = {
          title: title.trim(),
          collection: collection.trim() || undefined,
          category: category.trim(),
          date: date.trim() || `${new Date().getFullYear()}`,
          description: description.trim(),
          image: images[0],
          images,
          isPublished,
        };
        await onSave(null, input);
      } else {
        // Múltiplas imagens: cria registos para cada foto integrados na mesma colecção
        const collectionName = collection.trim() || title.trim();
        const inputs: GalleryInput[] = images.map((imgUrl, idx) => ({
          title: `${title.trim()} (${idx + 1}/${images.length})`,
          collection: collectionName,
          category: category.trim(),
          date: date.trim() || `${new Date().getFullYear()}`,
          description: description.trim(),
          image: imgUrl,
          images,
          isPublished,
        }));
        await onSave(null, inputs);
      }
    } catch (err) {
      setError('Não foi possível guardar na galeria. Tente novamente.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-xs flex items-start sm:items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl my-6 shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-[#f0f0f0] flex items-center justify-between bg-gradient-to-r from-red-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#d9251d] text-white flex items-center justify-center shadow-xs">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#111]">
                {isEditing ? 'Editar Registo da Galeria' : 'Adicionar Fotografias à Galeria'}
              </h2>
              <p className="text-[11px] text-gray-500">
                Envio individual ou em lote por Colecção / Álbum fotográfico
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-white/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM BODY */}
        <div className="p-6 space-y-5 max-h-[calc(85vh-130px)] overflow-y-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-[#d9251d] text-xs font-medium rounded-xl p-3">
              {error}
            </div>
          )}

          {/* CAMPOS: TÍTULO & COLECÇÃO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Título do Registo / Evento *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Audiência Oficial com Autoridades Espanholas"
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#d9251d] focus:ring-1 focus:ring-[#d9251d]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                <FolderArchive className="w-3.5 h-3.5 text-[#d9251d]" />
                <span>Colecção / Álbum (opcional)</span>
              </label>
              <input
                type="text"
                value={collection}
                onChange={(e) => setCollection(e.target.value)}
                placeholder="Ex: Cimeira Bilateral 2026, Visita de Estado..."
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#d9251d] focus:ring-1 focus:ring-[#d9251d]"
              />
            </div>
          </div>

          {/* CAMPOS: CATEGORIA & DATA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Categoria *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#d9251d] focus:ring-1 focus:ring-[#d9251d]"
              >
                {GALLERY_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Data ou Ano do Registo
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Ex: 2026 ou 15 de Junho, 2026"
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#d9251d] focus:ring-1 focus:ring-[#d9251d]"
              />
            </div>
          </div>

          {/* SECÇÃO DE FOTOGRAFIAS (MULTI-UPLOAD) */}
          <div className="space-y-3 bg-gray-50/80 p-4 rounded-xl border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-bold text-gray-800">
                  Fotografias da Galeria *
                </label>
                <p className="text-[11px] text-gray-500">
                  Pode selecionar múltiplos ficheiros no seu computador ou dispositivo.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-700 shadow-2xs">
                  {images.length === 0
                    ? '0 fotos selecionadas'
                    : `${images.length} ${images.length === 1 ? 'foto selecionada' : 'fotos selecionadas'}`}
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-1.5 bg-[#d9251d] hover:bg-[#b01b14] disabled:opacity-60 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs shrink-0"
                >
                  {uploading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>{uploading ? 'A carregar...' : 'Carregar Fotos'}</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFilesChange}
                  className="hidden"
                />
              </div>
            </div>

            {uploading && (
              <div className="flex items-center gap-2 text-xs font-medium text-[#d9251d] bg-red-50 p-2.5 rounded-lg border border-red-100 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span>{uploadProgressText || 'A processar e otimizar imagens...'}</span>
              </div>
            )}

            {/* GRELHA DE MINIATURAS SELECIONADAS */}
            {images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                {images.map((imgUrl, index) => {
                  const isCover = index === 0;
                  return (
                    <div
                      key={`${imgUrl}-${index}`}
                      className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-2xs"
                    >
                      <img
                        src={imgUrl}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />

                      {/* Badge de Foto de Capa */}
                      {isCover ? (
                        <div className="absolute top-1.5 left-1.5 bg-[#d9251d] text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          <span>Capa</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetAsCover(index)}
                          title="Definir como fotografia de capa"
                          className="opacity-0 group-hover:opacity-100 absolute top-1.5 left-1.5 bg-black/70 hover:bg-black text-white text-[9px] font-semibold px-1.5 py-0.5 rounded transition-opacity cursor-pointer"
                        >
                          Tornar Capa
                        </button>
                      )}

                      {/* Botão de Remover */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        title="Remover esta foto"
                        className="absolute top-1.5 right-1.5 bg-red-600/90 hover:bg-red-700 text-white p-1 rounded-md transition-colors cursor-pointer shadow-xs"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>

                      {/* Numeração no rodapé */}
                      <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-xs text-white text-[9px] px-1.5 py-0.5 rounded">
                        #{index + 1}
                      </div>
                    </div>
                  );
                })}

                {/* Botão para adicionar mais fotos */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-[#d9251d] hover:bg-red-50/50 flex flex-col items-center justify-center gap-1 text-gray-500 hover:text-[#d9251d] transition-colors cursor-pointer p-2"
                >
                  <Plus className="w-5 h-5" />
                  <span className="text-[11px] font-semibold text-center">Mais fotos</span>
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 hover:border-[#d9251d] rounded-xl p-6 text-center bg-white cursor-pointer hover:bg-red-50/30 transition-colors"
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-gray-700">
                  Clique aqui para carregar fotografias do seu dispositivo
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Pode selecionar múltiplas fotos de uma só vez (JPEG, PNG, WebP)
                </p>
              </div>
            )}

            {/* ADICIONAR POR URL */}
            <div className="pt-2 border-t border-gray-200/60">
              <label className="block text-[11px] font-semibold text-gray-600 mb-1 flex items-center gap-1">
                <LinkIcon className="w-3 h-3 text-gray-400" />
                <span>Ou adicionar fotografia por link / URL directo</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddUrl();
                    }
                  }}
                  placeholder="Cole o endereço web da imagem (https://...)"
                  className="flex-1 text-xs border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#d9251d] focus:ring-1 focus:ring-[#d9251d] bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddUrl}
                  disabled={!urlInput.trim()}
                  className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>

          {/* DESCRIÇÃO */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Descrição / Legenda Fotográfica *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o contexto, personalidades presentes ou detalhes do evento..."
              className="w-full text-sm border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-[#d9251d] focus:ring-1 focus:ring-[#d9251d]"
            />
          </div>

          {images.length > 1 && !isEditing && (
            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl flex items-start gap-2.5 text-xs text-blue-800">
              <FolderArchive className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Publicação em Lote por Colecção</p>
                <p className="text-[11px] text-blue-700 mt-0.5">
                  Serão criados <strong>{images.length} registos fotográficos</strong> com a colecção{' '}
                  <strong>&ldquo;{collection.trim() || title.trim() || 'Nova Colecção'}&rdquo;</strong>,
                  permitindo aos visitantes navegar facilmente por todas as imagens do evento.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="px-6 py-4 bg-gray-50 border-t border-[#f0f0f0] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-[#666] hover:text-[#111] px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => handleAction(false)}
            disabled={saving || uploading}
            className="flex items-center gap-1.5 bg-gray-200 hover:bg-gray-300 disabled:opacity-60 text-gray-800 text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Guardar Rascunho
          </button>
          <button
            type="button"
            onClick={() => handleAction(true)}
            disabled={saving || uploading}
            className="flex items-center gap-1.5 bg-[#d9251d] hover:bg-[#b91e17] disabled:opacity-60 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
            <span>
              {images.length > 1 && !isEditing
                ? `Publicar ${images.length} Fotografias`
                : 'Publicar Imagem'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
