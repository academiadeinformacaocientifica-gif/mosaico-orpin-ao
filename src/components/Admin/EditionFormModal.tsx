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
  BookMarked,
  Plus,
  Trash2,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { MagazineEdition } from '../../types';
import {
  MagazineEditionInput,
  uploadMagazineCover,
} from '../../lib/editionService';

const PERIOD_SUGGESTIONS = [
  'Janeiro - Março',
  'Abril - Junho',
  'Julho - Setembro',
  'Outubro - Dezembro',
  'Edição Especial Anual',
];

interface EditionFormModalProps {
  initialEdition: MagazineEdition | null;
  onClose: () => void;
  onSave: (id: string | null, input: MagazineEditionInput) => Promise<void>;
}

export const EditionFormModal: React.FC<EditionFormModalProps> = ({
  initialEdition,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(initialEdition);

  const [editionNumber, setEditionNumber] = useState<number>(
    initialEdition?.editionNumber || 13
  );
  const [title, setTitle] = useState(initialEdition?.title || '');
  const [theme, setTheme] = useState(initialEdition?.theme || '');
  const [period, setPeriod] = useState(
    initialEdition?.period || 'Julho - Setembro'
  );
  const [year, setYear] = useState<number>(
    initialEdition?.year || new Date().getFullYear()
  );
  const [pagesCount, setPagesCount] = useState<number>(
    initialEdition?.pagesCount || 64
  );
  const [coverImage, setCoverImage] = useState(
    initialEdition?.coverImage || ''
  );
  const [pdfUrl, setPdfUrl] = useState(initialEdition?.pdfUrl || '');
  const [editorialNote, setEditorialNote] = useState(
    initialEdition?.editorialNote || ''
  );
  const [highlights, setHighlights] = useState<string[]>(
    initialEdition?.highlights && initialEdition.highlights.length > 0
      ? initialEdition.highlights
      : [
          'Entrevista Exclusiva com a Chancelaria',
          'Dossiê Diplomático e Parcerias Estratégicas',
        ]
  );
  const [newHighlight, setNewHighlight] = useState('');

  const [uploadingCover, setUploadingCover] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  const handleCoverFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    setError(null);
    try {
      const url = await uploadMagazineCover(file);
      setCoverImage(url);
    } catch (err) {
      setError(
        'Falha ao enviar a imagem de capa. Tente novamente ou use um URL direto.'
      );
      console.error(err);
    } finally {
      setUploadingCover(false);
    }
  };

  const handleAddHighlight = () => {
    if (!newHighlight.trim()) return;
    setHighlights([...highlights, newHighlight.trim()]);
    setNewHighlight('');
  };

  const handleRemoveHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const handleAction = async (isPublished: boolean) => {
    setError(null);

    if (!title.trim() || !theme.trim() || !coverImage.trim()) {
      setError('O Título, Tema e Imagem de Capa são obrigatórios.');
      return;
    }

    if (!editorialNote.trim()) {
      setError('A Nota Editorial / Resumo é obrigatória.');
      return;
    }

    const input: MagazineEditionInput = {
      editionNumber: Number(editionNumber) || 1,
      title: title.trim(),
      theme: theme.trim(),
      period: period.trim(),
      year: Number(year) || new Date().getFullYear(),
      pagesCount: Number(pagesCount) || 48,
      coverImage: coverImage.trim(),
      pdfUrl: pdfUrl.trim() || undefined,
      highlights: highlights.filter((h) => h.trim().length > 0),
      editorialNote: editorialNote.trim(),
      isPublished,
    };

    setSaving(true);
    try {
      await onSave(initialEdition?.id || null, input);
    } catch (err) {
      setError(
        'Não foi possível guardar a edição da revista. Tente novamente.'
      );
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 flex items-start sm:items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-[#f0f0f0] flex items-center justify-between bg-gradient-to-r from-amber-50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <BookMarked className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#111]">
                {isEditing
                  ? 'Editar Edição da Revista Mosaico'
                  : 'Criar Nova Edição da Revista Mosaico'}
              </h2>
              <p className="text-[11px] text-gray-500">
                Publicação trimestral da Chancelaria de Angola
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

          {/* NUMERO, ANO E PAGINAS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#333] mb-1">
                Número da Edição *
              </label>
              <input
                type="number"
                min="1"
                value={editionNumber}
                onChange={(e) => setEditionNumber(Number(e.target.value))}
                placeholder="Ex: 13"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:border-amber-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#333] mb-1">
                Ano de Publicação *
              </label>
              <input
                type="number"
                min="1980"
                max="2100"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                placeholder="Ex: 2026"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:border-amber-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#333] mb-1">
                Nº de Páginas *
              </label>
              <input
                type="number"
                min="1"
                value={pagesCount}
                onChange={(e) => setPagesCount(Number(e.target.value))}
                placeholder="Ex: 64"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:border-amber-600 outline-none"
              />
            </div>
          </div>

          {/* TITULO */}
          <div>
            <label className="block text-xs font-bold text-[#333] mb-1">
              Título da Edição *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Edição nº 13 - Especial Cooperação Bilateral & Sustentabilidade"
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:border-amber-600 outline-none"
            />
          </div>

          {/* TEMA / SUBTITULO */}
          <div>
            <label className="block text-xs font-bold text-[#333] mb-1">
              Tema Principal / Subtítulo *
            </label>
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="Ex: Transição Energética e os 50 Anos de Laços Diplomáticos"
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:border-amber-600 outline-none"
            />
          </div>

          {/* PERIODO */}
          <div>
            <label className="block text-xs font-bold text-[#333] mb-1">
              Período / Trimestre *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="Ex: Julho - Setembro"
                className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:border-amber-600 outline-none"
              />
              <select
                onChange={(e) => {
                  if (e.target.value) setPeriod(e.target.value);
                }}
                className="px-2.5 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50 text-gray-700 outline-none"
                defaultValue=""
              >
                <option value="" disabled>
                  Sugestões
                </option>
                {PERIOD_SUGGESTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* CAPA DA REVISTA */}
          <div>
            <label className="block text-xs font-bold text-[#333] mb-1">
              Capa da Revista (Imagem) *
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://... ou faça upload"
                  className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:border-amber-600 outline-none"
                />
                <input
                  type="file"
                  ref={coverFileInputRef}
                  onChange={handleCoverFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => coverFileInputRef.current?.click()}
                  disabled={uploadingCover}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors shrink-0"
                >
                  {uploadingCover ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>Upload Imagem</span>
                </button>
              </div>

              {coverImage && (
                <div className="relative w-28 h-36 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 shadow-xs">
                  <img
                    src={coverImage}
                    alt="Pré-visualização da capa"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
            </div>
          </div>

          {/* PDF URL OU LINK DE DESCARGA */}
          <div>
            <label className="block text-xs font-bold text-[#333] mb-1">
              Ficheiro PDF ou Link de Descarga (Opcional)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                placeholder="https://exemplo.com/revista-edicao-13.pdf"
                className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:border-amber-600 outline-none"
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">
              Link direto para o documento completo em PDF que os leitores poderão descarregar.
            </p>
          </div>

          {/* NOTA EDITORIAL */}
          <div>
            <label className="block text-xs font-bold text-[#333] mb-1">
              Nota Editorial / Resumo do Volume *
            </label>
            <textarea
              rows={3}
              value={editorialNote}
              onChange={(e) => setEditorialNote(e.target.value)}
              placeholder="Apresentação das temáticas e visão editorial deste volume..."
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:border-amber-600 outline-none resize-y"
            />
          </div>

          {/* DESTAQUES DA EDIÇÃO */}
          <div>
            <label className="block text-xs font-bold text-[#333] mb-1">
              Destaques Editoriais desta Edição (Tópicos)
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddHighlight();
                    }
                  }}
                  placeholder="Adicionar destaque (ex: Entrevista Exclusiva com a Embaixadora)..."
                  className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:border-amber-600 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddHighlight}
                  className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar</span>
                </button>
              </div>

              {highlights.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-1.5">
                  {highlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200/80 text-xs text-gray-700"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(idx)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="px-6 py-4 bg-gray-50 border-t border-[#f0f0f0] flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={() => handleAction(false)}
            disabled={saving || uploadingCover}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileText className="w-3.5 h-3.5" />
            )}
            <span>Guardar como Rascunho</span>
          </button>

          <button
            type="button"
            onClick={() => handleAction(true)}
            disabled={saving || uploadingCover}
            className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all shadow-xs"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>
              {isEditing ? 'Guardar Alterações' : 'Publicar Edição da Revista'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
