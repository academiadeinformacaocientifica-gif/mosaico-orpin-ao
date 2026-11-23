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
  CalendarDays,
  MapPin,
  Clock,
  Sparkles,
  Ticket,
  Link as LinkIcon,
} from 'lucide-react';
import { CulturalEvent } from '../../types';
import { CulturalEventInput } from '../../lib/culturalAgendaService';

const CULTURAL_CATEGORIES: CulturalEvent['category'][] = [
  'Cinema',
  'Música & Dança',
  'Artes Plásticas',
  'Literatura',
  'Gastronomia',
  'Comunidade',
];

interface CulturalEventFormModalProps {
  initialItem: CulturalEvent | null;
  onClose: () => void;
  onSave: (id: string | null, input: CulturalEventInput) => Promise<void>;
}

export const CulturalEventFormModal: React.FC<CulturalEventFormModalProps> = ({
  initialItem,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(initialItem);
  const [title, setTitle] = useState(initialItem?.title || '');
  const [category, setCategory] = useState<CulturalEvent['category']>(initialItem?.category || 'Cinema');
  const [date, setDate] = useState(initialItem?.date || '');
  const [time, setTime] = useState(initialItem?.time || '18:00 - 20:00 CEST');
  const [location, setLocation] = useState(initialItem?.location || '');
  const [city, setCity] = useState(initialItem?.city || 'Madrid');
  const [description, setDescription] = useState(initialItem?.description || '');
  const [organizer, setOrganizer] = useState(
    initialItem?.organizer || 'Sector Cultural da Embaixada da República de Angola'
  );
  const [imageUrl, setImageUrl] = useState(initialItem?.imageUrl || '');
  const [registrationRequired, setRegistrationRequired] = useState(initialItem?.registrationRequired ?? false);
  const [highlight, setHighlight] = useState(initialItem?.highlight ?? false);
  const [isPublished, setIsPublished] = useState(initialItem?.isPublished ?? true);

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor selecione um ficheiro de imagem válido (JPG, PNG, WEBP).');
      return;
    }

    setUploadingImage(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
        setUploadingImage(false);
      };
      reader.onerror = () => {
        setError('Falha ao processar o ficheiro de imagem.');
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setError('Erro ao carregar a imagem.');
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('O título do evento cultural é obrigatório.');
      return;
    }
    if (!date.trim()) {
      setError('A data do evento é obrigatória.');
      return;
    }
    if (!location.trim()) {
      setError('O local do evento é obrigatório.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload: CulturalEventInput = {
        title: title.trim(),
        category,
        date: date.trim(),
        time: time.trim() || '18:00 - 20:00 CEST',
        location: location.trim(),
        city: city.trim() || 'Madrid',
        description: description.trim(),
        organizer: organizer.trim() || 'Embaixada de Angola',
        imageUrl: imageUrl.trim() || undefined,
        registrationRequired,
        highlight,
        isPublished,
      };

      await onSave(initialItem?.id || null, payload);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Falha ao guardar evento cultural.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-8">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-stone-900 text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600/30 border border-red-500/40 flex items-center justify-center">
              <CalendarDays className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isEditing ? 'Editar Evento Cultural' : 'Novo Evento Cultural'}
              </h3>
              <p className="text-xs text-stone-300">
                Programação cultural, mostras, literatura e diáspora angolana
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              {error}
            </div>
          )}

          {/* TÍTULO */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Título do Evento *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Ciclo de Cinema Angolano: Novas Vozes e Narrativas"
              className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d9251d]/20 focus:border-[#d9251d] outline-none"
              required
            />
          </div>

          {/* CATEGORIA E CIDADE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Categoria Cultural *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CulturalEvent['category'])}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d9251d]/20 focus:border-[#d9251d] outline-none bg-white"
              >
                {CULTURAL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Cidade *
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex: Madrid, Barcelona, Valência..."
                className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d9251d]/20 focus:border-[#d9251d] outline-none"
                required
              />
            </div>
          </div>

          {/* DATA E HORÁRIO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Data do Evento *
              </label>
              <div className="relative">
                <CalendarDays className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="Ex: 28 de Outubro de 2026"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d9251d]/20 focus:border-[#d9251d] outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Horário
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="Ex: 18:30 - 21:00 CEST"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d9251d]/20 focus:border-[#d9251d] outline-none"
                />
              </div>
            </div>
          </div>

          {/* LOCAL E ORGANIZADOR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Local / Espaço *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex: Cineteca Madrid - Matadero"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d9251d]/20 focus:border-[#d9251d] outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Entidade Organizadora
              </label>
              <input
                type="text"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                placeholder="Ex: Sector Cultural da Embaixada de Angola"
                className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d9251d]/20 focus:border-[#d9251d] outline-none"
              />
            </div>
          </div>

          {/* DESCRIÇÃO */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Sinopse / Descrição do Evento
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Descreva a programação, artistas intervenientes, relevância cultural..."
              className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d9251d]/20 focus:border-[#d9251d] outline-none resize-none"
            />
          </div>

          {/* IMAGEM DE CAPA */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Imagem de Capa do Evento
            </label>
            
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-2">
              <div className="relative flex-1 w-full">
                <LinkIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="URL público da imagem (https://...)"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d9251d]/20 focus:border-[#d9251d] outline-none"
                />
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageFileChange}
                accept="image/*"
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
              >
                {uploadingImage ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>Carregar Ficheiro</span>
              </button>
            </div>

            {imageUrl && (
              <div className="relative mt-2 h-36 w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <img
                  src={imageUrl}
                  alt="Pré-visualização do evento"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 bg-black/70 hover:bg-red-600 text-white p-1 rounded-md text-xs transition-colors"
                  title="Remover imagem"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* OPÇÕES: INSCRIÇÃO, DESTAQUE, PUBLICAÇÃO */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-gray-100">
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer p-2 rounded-lg bg-gray-50 hover:bg-gray-100">
              <input
                type="checkbox"
                checked={registrationRequired}
                onChange={(e) => setRegistrationRequired(e.target.checked)}
                className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
              />
              <span className="flex items-center gap-1">
                <Ticket className="w-3.5 h-3.5 text-amber-600" />
                <span>Inscrição Prévia</span>
              </span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer p-2 rounded-lg bg-gray-50 hover:bg-gray-100">
              <input
                type="checkbox"
                checked={highlight}
                onChange={(e) => setHighlight(e.target.checked)}
                className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
              />
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Destaque Principal</span>
              </span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer p-2 rounded-lg bg-gray-50 hover:bg-gray-100">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
              />
              <span>Publicado no Portal</span>
            </label>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-xs font-bold text-white bg-[#d9251d] hover:bg-[#b51e17] rounded-lg shadow-sm flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>A guardar...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? 'Atualizar Evento' : 'Publicar Evento'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
