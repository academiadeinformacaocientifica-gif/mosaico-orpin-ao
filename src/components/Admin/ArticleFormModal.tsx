/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { X, Upload, Loader2, Save, Newspaper } from 'lucide-react';
import { Article, CategoryId } from '../../types';
import { ArticleInput, slugify, uploadArticleImage } from '../../lib/articleService';

const CATEGORY_OPTIONS: { id: CategoryId; label: string }[] = [
  { id: 'politica', label: 'Política' },
  { id: 'analise-global', label: 'Análise Global' },
  { id: 'angolberica', label: 'Angolbérica' },
  { id: 'economia', label: 'Economia' },
  { id: 'panorama-consular', label: 'Panorama Consular' },
  { id: 'kamba-cultura', label: 'Kamba & e Kultura' },
  { id: 'kultura-360', label: 'Kultura 360' },
  { id: 'turismo', label: 'Turismo' },
  { id: 'historia', label: 'História' },
  { id: 'blog', label: 'Blog' },
];

interface ArticleFormModalProps {
  initialArticle: Article | null; // null = criar novo
  onClose: () => void;
  onSave: (id: string | null, input: ArticleInput, isPublished: boolean) => Promise<void>;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatDateLabel(iso: string): string {
  const months = [
    'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
    'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO',
  ];
  const d = new Date(`${iso}T00:00:00`);
  if (isNaN(d.getTime())) return iso;
  return `${d.getDate()} DE ${months[d.getMonth()]} DE ${d.getFullYear()}`;
}

export const ArticleFormModal: React.FC<ArticleFormModalProps> = ({
  initialArticle,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(initialArticle);
  const [title, setTitle] = useState(initialArticle?.title || '');
  const [subtitle, setSubtitle] = useState(initialArticle?.subtitle || '');
  const [description, setDescription] = useState(initialArticle?.description || '');
  const [fullContent, setFullContent] = useState(
    (initialArticle?.fullContent || []).join('\n\n')
  );
  const [categoryId, setCategoryId] = useState<CategoryId>(
    initialArticle?.categoryId || 'politica'
  );
  const [authorName, setAuthorName] = useState(
    initialArticle?.author.name || 'Serviços de Comunicação e Imprensa'
  );
  const [authorRole, setAuthorRole] = useState(
    initialArticle?.author.role || 'Embaixada de Angola em Espanha'
  );
  const [isoDate, setIsoDate] = useState(initialArticle?.isoDate || todayIso());
  const [readTime, setReadTime] = useState(initialArticle?.readTime || '3 min de leitura');
  const [imageUrl, setImageUrl] = useState(initialArticle?.imageUrl || '');
  const [tags, setTags] = useState((initialArticle?.tags || []).join(', '));
  const [isFeatured, setIsFeatured] = useState(
    Boolean(initialArticle?.isFeatured || initialArticle?.isCarousel)
  );

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
      const url = await uploadArticleImage(file);
      setImageUrl(url);
    } catch (err) {
      setError('Falha ao enviar a imagem. Tente novamente.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleAction = async (isPublished: boolean) => {
    setError(null);

    if (!title.trim() || !description.trim() || !imageUrl.trim()) {
      setError('Título, descrição e imagem de capa são obrigatórios.');
      return;
    }

    const categoryLabel = CATEGORY_OPTIONS.find((c) => c.id === categoryId)?.label || categoryId;

    const input: ArticleInput = {
      id: initialArticle?.id || slugify(title),
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      description: description.trim(),
      fullContent: fullContent
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean),
      category: categoryLabel,
      categoryId,
      author: {
        name: authorName.trim(),
        role: authorRole.trim(),
      },
      date: formatDateLabel(isoDate),
      isoDate,
      readTime: readTime.trim(),
      imageUrl: imageUrl.trim(),
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      isFeatured,
      isCarousel: isFeatured,
      isPublished,
      likes: initialArticle?.likes,
      commentsCount: initialArticle?.commentsCount,
      comments: initialArticle?.comments,
    };

    setSaving(true);
    try {
      await onSave(initialArticle?.id || null, input, isPublished);
    } catch (err) {
      setError('Não foi possível guardar a notícia. Tente novamente.');
      console.error(err);
      setSaving(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAction(true);
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 flex items-start sm:items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#eee] sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-base font-bold text-[#111]">
            {isEditing ? 'Editar Notícia' : 'Nova Notícia'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-[#444] mb-1.5">Título *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#ccc] outline-none text-sm focus:border-[#d9251d]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#444] mb-1.5">Subtítulo</label>
            <input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#ccc] outline-none text-sm focus:border-[#d9251d]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#444] mb-1.5">
              Descrição / lead (resumo curto) *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-[#ccc] outline-none text-sm focus:border-[#d9251d] resize-y"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#444] mb-1.5">
              Corpo da notícia (um parágrafo por bloco, separado por linha em branco)
            </label>
            <textarea
              value={fullContent}
              onChange={(e) => setFullContent(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 rounded-lg border border-[#ccc] outline-none text-sm focus:border-[#d9251d] resize-y"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#444] mb-1.5">Categoria</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value as CategoryId)}
                className="w-full px-3 py-2 rounded-lg border border-[#ccc] outline-none text-sm focus:border-[#d9251d] bg-white"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#444] mb-1.5">Data</label>
              <input
                type="date"
                value={isoDate}
                onChange={(e) => setIsoDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#ccc] outline-none text-sm focus:border-[#d9251d]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#444] mb-1.5">Autor</label>
              <input
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#ccc] outline-none text-sm focus:border-[#d9251d]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#444] mb-1.5">Cargo/Função</label>
              <input
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#ccc] outline-none text-sm focus:border-[#d9251d]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#444] mb-1.5">
              Tempo de leitura
            </label>
            <input
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#ccc] outline-none text-sm focus:border-[#d9251d]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#444] mb-1.5">
              Imagem de capa *
            </label>
            <div className="flex items-center gap-3">
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://... ou envie um ficheiro"
                className="flex-1 px-3 py-2 rounded-lg border border-[#ccc] outline-none text-sm focus:border-[#d9251d]"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="shrink-0 flex items-center gap-1.5 bg-[#111] hover:bg-[#333] disabled:opacity-60 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
              >
                {uploading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                {uploading ? 'A enviar...' : 'Enviar'}
              </button>
            </div>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Pré-visualização"
                className="mt-2 h-28 w-full object-cover rounded-lg border border-[#eee]"
                referrerPolicy="no-referrer"
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#444] mb-1.5">
              Tags (separadas por vírgula)
            </label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Diplomacia, Madrid, Turismo"
              className="w-full px-3 py-2 rounded-lg border border-[#ccc] outline-none text-sm focus:border-[#d9251d]"
            />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="accent-[#d9251d] w-4 h-4 mt-0.5"
              />
              <div>
                <span className="block text-xs font-bold text-gray-900">
                  Destaque na Página Principal (Slides)
                </span>
                <span className="block text-[11px] text-gray-500 mt-0.5">
                  Se ativado, esta notícia será apresentada nos slides do carrossel principal no topo da página inicial. Se desativado, aparecerá apenas na secção de notícias gerais e na sua categoria.
                </span>
              </div>
            </label>
          </div>

          {error && (
            <p className="text-xs font-medium text-[#d9251d] bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </form>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#eee]">
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
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Newspaper className="w-4 h-4" />}
            Publicar Notícia
          </button>
        </div>
      </div>
    </div>
  );
};
