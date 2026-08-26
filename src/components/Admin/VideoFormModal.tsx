/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { X, Upload, Loader2, Save, Video as VideoIcon } from 'lucide-react';
import { VideoItem } from '../../types';
import { VideoInput } from '../../lib/videoService';
import { uploadGalleryImage } from '../../lib/galleryService';

const VIDEO_CATEGORIES = [
  'Cultura & Moda',
  'Diplomacia',
  'Institucional',
  'Cultura',
  'Economia',
  'Turismo & Cultura',
  'Entrevistas',
  'Reportagens',
];

interface VideoFormModalProps {
  initialItem: VideoItem | null;
  onClose: () => void;
  onSave: (id: string | null, input: VideoInput) => Promise<void>;
}

export const VideoFormModal: React.FC<VideoFormModalProps> = ({
  initialItem,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(initialItem);
  const [title, setTitle] = useState(initialItem?.title || '');
  const [category, setCategory] = useState(initialItem?.category || 'Diplomacia');
  const [duration, setDuration] = useState(initialItem?.duration || '12:30');
  const [date, setDate] = useState(initialItem?.date || `${new Date().getFullYear()}`);
  const [description, setDescription] = useState(initialItem?.description || '');
  const [image, setImage] = useState(initialItem?.image || '');
  const [videoUrl, setVideoUrl] = useState(initialItem?.videoUrl || '');

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadGalleryImage(file);
      setImage(url);
    } catch (err) {
      setError('Falha ao enviar a miniatura. Tente novamente ou use um URL direto.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleAction = async (isPublished: boolean) => {
    setError(null);

    if (!title.trim() || !description.trim() || !image.trim()) {
      setError('Título, descrição e imagem de miniatura são obrigatórios.');
      return;
    }

    const input: VideoInput = {
      title: title.trim(),
      category: category.trim(),
      duration: duration.trim() || '10:00',
      date: date.trim() || `${new Date().getFullYear()}`,
      description: description.trim(),
      image: image.trim(),
      videoUrl: videoUrl.trim() || undefined,
      isPublished,
    };

    setSaving(true);
    try {
      await onSave(initialItem?.id || null, input);
    } catch (err) {
      setError('Não foi possível guardar o vídeo. Tente novamente.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 flex items-start sm:items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-xl my-8 shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-[#f0f0f0] flex items-center justify-between bg-gradient-to-r from-red-50 to-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#d9251d] text-white flex items-center justify-center">
              <VideoIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#111]">
                {isEditing ? 'Editar Vídeo' : 'Adicionar Novo Vídeo'}
              </h2>
              <p className="text-[11px] text-gray-500">
                Registo audiovisual para a secção de vídeos do portal
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
        <div className="p-6 space-y-4 max-h-[calc(85vh-130px)] overflow-y-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-[#d9251d] text-xs rounded-xl p-3">
              {error}
            </div>
          )}

          {/* TÍTULO */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Título do Vídeo *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Reportagem Especial: Diplomacia Económica em Madrid"
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#d9251d] focus:ring-1 focus:ring-[#d9251d]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* CATEGORIA */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Categoria *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#d9251d] focus:ring-1 focus:ring-[#d9251d]"
              >
                {VIDEO_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* DURAÇÃO */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Duração (ex: 15:30)
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="15:30"
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#d9251d] focus:ring-1 focus:ring-[#d9251d]"
              />
            </div>

            {/* DATA */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Data / Ano
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Ex: 2026"
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#d9251d] focus:ring-1 focus:ring-[#d9251d]"
              />
            </div>
          </div>

          {/* URL DO VÍDEO */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Ficheiro ou URL do Vídeo (MP4, YouTube, Vimeo ou link direto)
            </label>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Ex: videos/meu-video.mp4 ou https://..."
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#d9251d] focus:ring-1 focus:ring-[#d9251d]"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Pode ser um vídeo local (ex: <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700">videos/GALA MISS ANGOLA-ESPANHA.mp4</code>) ou um link externo.
            </p>
          </div>

          {/* MINIATURA / CAPA */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Imagem de Miniatura / Capa *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="URL da miniatura (https://...)"
                className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#d9251d] focus:ring-1 focus:ring-[#d9251d]"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-2 rounded-lg transition-colors shrink-0 cursor-pointer"
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#d9251d]" />
                ) : (
                  <Upload className="w-4 h-4 text-[#d9251d]" />
                )}
                <span>{uploading ? 'A carregar...' : 'Carregar'}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            {image && (
              <div className="mt-3 relative rounded-lg overflow-hidden border border-gray-200 aspect-video bg-gray-100 max-h-48">
                <img
                  src={image}
                  alt="Pré-visualização"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>

          {/* DESCRIÇÃO */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Descrição do Vídeo *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o conteúdo do vídeo, os temas abordados e os oradores..."
              className="w-full text-sm border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-[#d9251d] focus:ring-1 focus:ring-[#d9251d]"
            />
          </div>
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
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <VideoIcon className="w-4 h-4" />}
            Publicar Vídeo
          </button>
        </div>
      </div>
    </div>
  );
};
