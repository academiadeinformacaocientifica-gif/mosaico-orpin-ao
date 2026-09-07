/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { X, Upload, Loader2, Save, Video as VideoIcon, CheckCircle2, Play } from 'lucide-react';
import { VideoItem } from '../../types';
import { VideoInput, uploadVideoFile, extractVideoMetadata } from '../../lib/videoService';
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

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setError(null);
    try {
      const url = await uploadGalleryImage(file);
      setImage(url);
    } catch (err) {
      setError('Falha ao enviar a miniatura. Tente novamente ou use um URL direto.');
      console.error(err);
    } finally {
      setUploadingImage(false);
      if (imageFileInputRef.current) {
        imageFileInputRef.current.value = '';
      }
    }
  };

  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificação de tamanho
    const maxMb = 150;
    const fileMb = file.size / (1024 * 1024);
    if (fileMb > maxMb) {
      setError(`O ficheiro tem ${fileMb.toFixed(1)}MB. Recomendamos vídeos até ${maxMb}MB para melhor desempenho, ou use um link do YouTube/Vimeo.`);
    }

    setUploadingVideo(true);
    setError(null);
    setVideoUploadProgress(`A carregar ficheiro (${fileMb.toFixed(1)} MB)...`);

    try {
      // 1. Extrai previamente metadados (duração e miniatura automática) do ficheiro
      extractVideoMetadata(file)
        .then((meta) => {
          if (meta.durationStr && (!duration || duration === '12:30')) {
            setDuration(meta.durationStr);
          }
          if (meta.thumbnailUrl && !image) {
            setImage(meta.thumbnailUrl);
          }
        })
        .catch(() => {
          // Extração silenciosa
        });

      // 2. Envia para o Supabase Storage
      const uploadedUrl = await uploadVideoFile(file, (msg) => {
        setVideoUploadProgress(msg);
      });

      setVideoUrl(uploadedUrl);
      setVideoUploadProgress(null);
    } catch (err: any) {
      setError('Erro ao enviar o vídeo: ' + (err?.message || 'Falha de rede'));
      console.error(err);
    } finally {
      setUploadingVideo(false);
      if (videoFileInputRef.current) {
        videoFileInputRef.current.value = '';
      }
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

          {/* FICHEIRO OU URL DO VÍDEO */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-gray-700">
                Ficheiro ou URL do Vídeo (MP4, WebM, YouTube, Vimeo)
              </label>
              <span className="text-[10px] text-gray-500 font-normal">
                Carregue do computador ou cole um link
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="URL do vídeo (https://...) ou clique em Carregar Vídeo"
                className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#d9251d] focus:ring-1 focus:ring-[#d9251d]"
              />
              <button
                type="button"
                onClick={() => videoFileInputRef.current?.click()}
                disabled={uploadingVideo}
                className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-[#d9251d] border border-red-200 text-xs font-semibold px-3 py-2 rounded-lg transition-colors shrink-0 cursor-pointer disabled:opacity-60"
              >
                {uploadingVideo ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#d9251d]" />
                ) : (
                  <Upload className="w-4 h-4 text-[#d9251d]" />
                )}
                <span>{uploadingVideo ? 'A enviar...' : 'Carregar Vídeo'}</span>
              </button>
              <input
                ref={videoFileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
                onChange={handleVideoFileChange}
                className="hidden"
              />
            </div>

            {uploadingVideo && videoUploadProgress && (
              <div className="mt-2 flex items-center gap-2 p-2.5 bg-red-50/70 border border-red-100 rounded-lg text-xs text-[#d9251d]">
                <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                <span className="font-medium">{videoUploadProgress}</span>
              </div>
            )}

            {videoUrl && (
              <div className="mt-2.5 p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Vídeo pronto para reprodução
                  </span>
                  <button
                    type="button"
                    onClick={() => setVideoUrl('')}
                    className="text-[11px] text-red-600 hover:text-red-700 hover:underline cursor-pointer"
                  >
                    Remover vídeo
                  </button>
                </div>
                <div className="rounded-lg overflow-hidden bg-black aspect-video max-h-52 flex items-center justify-center">
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            <p className="text-[11px] text-gray-500 mt-1">
              Formatos suportados: <strong>MP4, WebM, MOV</strong> (armazenamento na nuvem) ou links do YouTube/Vimeo.
            </p>
          </div>

          {/* MINIATURA / CAPA */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-gray-700">
                Imagem de Miniatura / Capa *
              </label>
              <span className="text-[10px] text-gray-500 font-normal">
                Gerada automaticamente do vídeo ou envie outra
              </span>
            </div>
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
                onClick={() => imageFileInputRef.current?.click()}
                disabled={uploadingImage}
                className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-2 rounded-lg transition-colors shrink-0 cursor-pointer disabled:opacity-60"
              >
                {uploadingImage ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#d9251d]" />
                ) : (
                  <Upload className="w-4 h-4 text-[#d9251d]" />
                )}
                <span>{uploadingImage ? 'A carregar...' : 'Carregar'}</span>
              </button>
              <input
                ref={imageFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
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
            disabled={saving || uploadingImage || uploadingVideo}
            className="flex items-center gap-1.5 bg-gray-200 hover:bg-gray-300 disabled:opacity-60 text-gray-800 text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Guardar Rascunho
          </button>
          <button
            type="button"
            onClick={() => handleAction(true)}
            disabled={saving || uploadingImage || uploadingVideo}
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
