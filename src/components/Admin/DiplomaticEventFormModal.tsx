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
  Landmark,
  MapPin,
  Clock,
  Briefcase,
  CheckCircle2,
  Link as LinkIcon,
} from 'lucide-react';
import { DiplomaticEvent } from '../../types';
import { DiplomaticEventInput } from '../../lib/diplomaticAgendaService';

const DIPLOMATIC_CATEGORIES: DiplomaticEvent['category'][] = [
  'Diplomacia',
  'Comércio',
  'Consular',
  'Académico',
  'Cultura',
];

const DIPLOMATIC_STATUSES: NonNullable<DiplomaticEvent['status']>[] = [
  'Agendado',
  'Em Curso',
  'Concluído',
];

interface DiplomaticEventFormModalProps {
  initialItem: DiplomaticEvent | null;
  onClose: () => void;
  onSave: (id: string | null, input: DiplomaticEventInput) => Promise<void>;
}

export const DiplomaticEventFormModal: React.FC<DiplomaticEventFormModalProps> = ({
  initialItem,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(initialItem);
  const [title, setTitle] = useState(initialItem?.title || '');
  const [category, setCategory] = useState<DiplomaticEvent['category']>(initialItem?.category || 'Diplomacia');
  const [date, setDate] = useState(initialItem?.date || '');
  const [time, setTime] = useState(initialItem?.time || '10:00 - 13:00 CEST');
  const [location, setLocation] = useState(initialItem?.location || '');
  const [city, setCity] = useState(initialItem?.city || 'Madrid');
  const [description, setDescription] = useState(initialItem?.description || '');
  const [organizer, setOrganizer] = useState(
    initialItem?.organizer || 'Embaixada da República de Angola no Reino de Espanha'
  );
  const [imageUrl, setImageUrl] = useState(initialItem?.imageUrl || '');
  const [registrationRequired, setRegistrationRequired] = useState(initialItem?.registrationRequired ?? false);
  const [status, setStatus] = useState<NonNullable<DiplomaticEvent['status']>>(initialItem?.status || 'Agendado');
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
      setError('O título do compromisso diplomático é obrigatório.');
      return;
    }
    if (!date.trim()) {
      setError('A data do compromisso é obrigatória.');
      return;
    }
    if (!location.trim()) {
      setError('O local do compromisso é obrigatório.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload: DiplomaticEventInput = {
        title: title.trim(),
        category,
        date: date.trim(),
        time: time.trim() || '10:00 - 13:00 CEST',
        location: location.trim(),
        city: city.trim() || 'Madrid',
        description: description.trim(),
        organizer: organizer.trim() || 'Embaixada de Angola',
        imageUrl: imageUrl.trim() || undefined,
        registrationRequired,
        status,
        isPublished,
      };

      await onSave(initialItem?.id || null, payload);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Falha ao guardar compromisso diplomático.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-8">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-[#1e2330] text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center">
              <Landmark className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isEditing ? 'Editar Compromisso Diplomático' : 'Novo Compromisso Diplomático'}
              </h3>
              <p className="text-xs text-gray-300">
                Protocolo bilateral, consultas políticas e cooperação institucional
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
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
              Título do Compromisso Oficial *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Consultas Políticas Bilaterais de Alto Nível Angola - Espanha"
              className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none"
              required
            />
          </div>

          {/* ÂMBITO / CATEGORIA E ESTADO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Âmbito do Encontro *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DiplomaticEvent['category'])}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none bg-white"
              >
                {DIPLOMATIC_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Estado do Compromisso *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as NonNullable<DiplomaticEvent['status']>)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none bg-white"
              >
                {DIPLOMATIC_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* CIDADE E LOCAL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Cidade *
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex: Madrid, Barcelona, Andorra-a-Velha..."
                className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Local / Edifício Oficial *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex: Palacio de Santa Cruz / MAEC"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* DATA E HORÁRIO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Data do Compromisso *
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="Ex: 15 de Outubro de 2026"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Horário Protocolar
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Ex: 10:00 - 13:00 CEST"
                className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none"
              />
            </div>
          </div>

          {/* ENTIDADE ORGANIZADORA */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Organização / Chancelaria
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                placeholder="Ex: Embaixada de Angola & Ministério dos Assuntos Exteriores de Espanha"
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none"
              />
            </div>
          </div>

          {/* DESCRIÇÃO */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Resumo Protocolar / Ordem de Trabalhos
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Descreva os temas em debate, delegações participantes, acordos a analisar..."
              className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none resize-none"
            />
          </div>

          {/* IMAGEM INSTITUCIONAL */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Imagem Institucional de Apoio
            </label>
            
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-2">
              <div className="relative flex-1 w-full">
                <LinkIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="URL público da imagem (https://...)"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none"
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
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
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
                  alt="Pré-visualização do compromisso"
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

          {/* OPÇÕES: INSCRIÇÃO E PUBLICAÇÃO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-100">
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer p-2 rounded-lg bg-gray-50 hover:bg-gray-100">
              <input
                type="checkbox"
                checked={registrationRequired}
                onChange={(e) => setRegistrationRequired(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Requer Credenciação / Inscrição Prévia</span>
              </span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer p-2 rounded-lg bg-gray-50 hover:bg-gray-100">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
              <span>Visível na Agenda Pública</span>
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
              className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>A guardar...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? 'Atualizar Compromisso' : 'Agendar Compromisso'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
