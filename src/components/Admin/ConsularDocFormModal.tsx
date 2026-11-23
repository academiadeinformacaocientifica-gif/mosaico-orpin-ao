/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import {
  X,
  FileText,
  Upload,
  Loader2,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  FileUp,
  Link2,
} from 'lucide-react';
import { ConsularDocument } from '../../data/consularServices';
import {
  ConsularDocumentInput,
  CONSULAR_CATEGORIES,
  uploadConsularDocumentFile,
} from '../../lib/consularDocService';

interface ConsularDocFormModalProps {
  initialDoc: ConsularDocument | null;
  onClose: () => void;
  onSave: (id: string | null, input: ConsularDocumentInput) => Promise<void>;
}

export const ConsularDocFormModal: React.FC<ConsularDocFormModalProps> = ({
  initialDoc,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(initialDoc);

  const [title, setTitle] = useState(initialDoc?.title || '');
  const [code, setCode] = useState(initialDoc?.code || '');
  const [category, setCategory] = useState<
    'vistos' | 'identidade' | 'notariado' | 'comunidade' | 'viagem'
  >(initialDoc?.category || 'vistos');
  const [targetAudience, setTargetAudience] = useState<
    'Cidadãos Angolanos' | 'Cidadãos Estrangeiros' | 'Geral'
  >(initialDoc?.targetAudience || 'Geral');
  const [badge, setBadge] = useState(initialDoc?.badge || '');
  const [fileFormat, setFileFormat] = useState<'PDF' | 'DOCX'>(
    initialDoc?.fileFormat || 'PDF'
  );
  const [fileSize, setFileSize] = useState(initialDoc?.fileSize || '300 KB');
  const [downloadFileName, setDownloadFileName] = useState(
    initialDoc?.downloadFileName || ''
  );
  const [description, setDescription] = useState(initialDoc?.description || '');
  const [instructions, setInstructions] = useState(initialDoc?.instructions || '');
  const [fileUrl, setFileUrl] = useState(initialDoc?.fileUrl || '');
  const [isPublished, setIsPublished] = useState(initialDoc?.isPublished !== false);

  // Requirements list state
  const [requirements, setRequirements] = useState<string[]>(
    initialDoc?.requirements && initialDoc.requirements.length > 0
      ? initialDoc.requirements
      : ['']
  );
  const [newRequirementText, setNewRequirementText] = useState('');

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddRequirement = () => {
    if (!newRequirementText.trim()) return;
    setRequirements((prev) => [...prev.filter(Boolean), newRequirementText.trim()]);
    setNewRequirementText('');
  };

  const handleRemoveRequirement = (index: number) => {
    setRequirements((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateRequirement = (index: number, val: string) => {
    setRequirements((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMessage(null);

    try {
      // Auto-set file format and size
      const ext = file.name.split('.').pop()?.toUpperCase();
      if (ext === 'PDF' || ext === 'DOCX') {
        setFileFormat(ext as 'PDF' | 'DOCX');
      }
      const sizeKb = Math.round(file.size / 1024);
      setFileSize(sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`);

      if (!downloadFileName) {
        setDownloadFileName(file.name);
      }

      const uploadedUrl = await uploadConsularDocumentFile(file);
      setFileUrl(uploadedUrl);
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Erro ao carregar ficheiro. Pode colar um link direto ou deixar que o sistema gere o modelo oficial.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage('O título do documento é obrigatório.');
      return;
    }
    if (!code.trim()) {
      setErrorMessage('O código do documento (ex.: MOD-CONS-01) é obrigatório.');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('A descrição do documento é obrigatória.');
      return;
    }

    const cleanRequirements = requirements
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    if (newRequirementText.trim()) {
      cleanRequirements.push(newRequirementText.trim());
    }

    if (cleanRequirements.length === 0) {
      setErrorMessage('Adicione pelo menos 1 documento ou requisito necessário.');
      return;
    }

    setSaving(true);
    setErrorMessage(null);

    try {
      const categoryItem = CONSULAR_CATEGORIES.find((c) => c.id === category);

      const payload: ConsularDocumentInput = {
        title: title.trim(),
        code: code.trim().toUpperCase(),
        category,
        categoryLabel: categoryItem?.label || 'Serviços Consulares',
        targetAudience,
        badge: badge.trim() || undefined,
        fileFormat,
        fileSize: fileSize.trim() || '300 KB',
        downloadFileName:
          downloadFileName.trim() ||
          `${code.trim().replace(/\s+/g, '_')}_Consulado_Angola.${fileFormat.toLowerCase()}`,
        description: description.trim(),
        instructions: instructions.trim(),
        requirements: cleanRequirements,
        fileUrl: fileUrl.trim() || undefined,
        isPublished,
      };

      await onSave(initialDoc ? initialDoc.id : null, payload);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Erro ao guardar documento consular.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="p-5 bg-gradient-to-r from-rose-900 to-[#111] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-rose-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {isEditing ? 'Editar Documento Consular' : 'Novo Documento Consular'}
              </h2>
              <p className="text-xs text-gray-300">
                Gestão de formulários, minutas e requerimentos do Panorama Consular
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY FORM */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800 text-xs sm:text-sm">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. DADOS DE IDENTIFICAÇÃO */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Identificação do Modelo Consular</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Título Oficial do Requerimento / Modelo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex.: Formulário Oficial de Solicitação de Visto para Angola"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-rose-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Código do Modelo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Ex.: MOD-CONS-01"
                  className="w-full text-xs sm:text-sm font-mono font-bold px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-rose-600 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Categoria Consular
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-rose-600 transition-colors cursor-pointer"
                >
                  {CONSULAR_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Destinatários
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as any)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-rose-600 transition-colors cursor-pointer"
                >
                  <option value="Geral">Geral (Todos os Cidadãos)</option>
                  <option value="Cidadãos Angolanos">Cidadãos Angolanos</option>
                  <option value="Cidadãos Estrangeiros">Cidadãos Estrangeiros</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Destaque / Badge (Opcional)
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="Ex.: Mais Solicitado, Urgência..."
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-rose-600 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* 2. FORMATO E FICHEIRO DE DOWNLOAD */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-2">
              <FileUp className="w-4 h-4" />
              <span>Formato & Ficheiro para Download</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Formato de Ficheiro
                </label>
                <select
                  value={fileFormat}
                  onChange={(e) => setFileFormat(e.target.value as any)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-rose-600 transition-colors cursor-pointer font-bold"
                >
                  <option value="PDF">PDF (Documento Portátil)</option>
                  <option value="DOCX">DOCX (Microsoft Word)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Tamanho Estimado
                </label>
                <input
                  type="text"
                  value={fileSize}
                  onChange={(e) => setFileSize(e.target.value)}
                  placeholder="Ex.: 320 KB"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-rose-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nome do Ficheiro (ao descarregar)
                </label>
                <input
                  type="text"
                  value={downloadFileName}
                  onChange={(e) => setDownloadFileName(e.target.value)}
                  placeholder="Ex.: Modelo_Solicitacao_Visto.pdf"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-rose-600 transition-colors"
                />
              </div>
            </div>

            {/* UPLOAD OU LINK DO FICHEIRO */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/80 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <FileUp className="w-4 h-4 text-rose-700" />
                    <span>Ficheiro Anexo Oficial (Opcional)</span>
                  </label>
                  <p className="text-[11px] text-gray-500">
                    Pode anexar um documento real (PDF/Word) ou deixar vazio para que o sistema gere a minuta com carimbo oficial e dados formatados.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf,.docx,.doc,application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="bg-white border border-gray-300 hover:border-rose-600 text-gray-700 hover:text-rose-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {uploading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>{fileUrl ? 'Substituir Ficheiro' : 'Carregar Ficheiro'}</span>
                  </button>
                </div>
              </div>

              {/* URL or Direct input */}
              <div className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="Ou cole o link direto para o ficheiro (ex: https://exemplo.com/documento.pdf)..."
                  className="w-full text-xs px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-rose-600 transition-colors"
                />
                {fileUrl && (
                  <button
                    type="button"
                    onClick={() => setFileUrl('')}
                    className="text-gray-400 hover:text-red-500 text-xs p-1"
                    title="Remover ficheiro"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 3. DESCRIÇÃO E INSTRUÇÕES */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Descrição e Finalidade do Documento <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve resumo sobre para que serve este documento oficial..."
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-rose-600 transition-colors leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Instruções de Preenchimento / Notas Importantes (Opcional)
              </label>
              <textarea
                rows={2}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Ex.: Preencha todos os campos em maiúsculas de forma legível. Não rasure o documento..."
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-rose-600 transition-colors leading-relaxed"
              />
            </div>
          </div>

          {/* 4. REQUISITOS NECESSÁRIOS */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Documentos e Requisitos Necessários ({requirements.filter(Boolean).length})</span>
                </label>
                <p className="text-[11px] text-gray-500">
                  Adicione cada documento, certificado ou comprovativo exigido para este trâmite consular.
                </p>
              </div>
            </div>

            {/* List of current requirements */}
            <div className="space-y-2">
              {requirements.map((req, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-rose-50 text-rose-800 font-bold text-[10px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => handleUpdateRequirement(idx, e.target.value)}
                    placeholder={`Requisito #${idx + 1} (ex.: Passaporte com validade mínima de 6 meses)...`}
                    className="flex-1 text-xs sm:text-sm px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-rose-600 transition-colors"
                  />
                  {requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRequirement(idx)}
                      className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      title="Eliminar requisito"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add requirement box */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newRequirementText}
                onChange={(e) => setNewRequirementText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRequirement();
                  }
                }}
                placeholder="Digitar novo requisito e pressionar Adicionar ou Enter..."
                className="flex-1 text-xs sm:text-sm px-3.5 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-rose-600 transition-colors"
              />
              <button
                type="button"
                onClick={handleAddRequirement}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 text-rose-700" />
                <span>Adicionar</span>
              </button>
            </div>
          </div>

          {/* 5. ESTADO DE PUBLICAÇÃO */}
          <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublished"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 text-rose-700 rounded border-gray-300 focus:ring-rose-500 cursor-pointer"
            />
            <label htmlFor="isPublished" className="text-xs font-bold text-gray-800 cursor-pointer select-none">
              Publicar este documento no Panorama Consular (visível para o público descarregar)
            </label>
          </div>
        </form>

        {/* FOOTER ACTIONS */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={saving || uploading}
            className="flex items-center gap-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs hover:shadow transition-all cursor-pointer disabled:opacity-50 active:scale-98"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>A guardar documento...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEditing ? 'Atualizar Documento' : 'Publicar Documento'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
