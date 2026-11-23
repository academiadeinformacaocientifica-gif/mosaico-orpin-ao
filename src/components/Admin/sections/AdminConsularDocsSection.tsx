/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Pencil, Trash2, FileText, Download, CheckCircle2 } from 'lucide-react';
import { ConsularDocument } from '../../../types';
import {
  ConsularDocumentInput,
  createConsularDocument,
  updateConsularDocument,
  deleteConsularDocument,
} from '../../../lib/consularDocService';
import { generateAndDownloadConsularDocument } from '../../../lib/consularDocDownload';
import { ConsularDocFormModal } from '../ConsularDocFormModal';

interface AdminConsularDocsSectionProps {
  consularDocs: ConsularDocument[];
  searchQuery: string;
  statusFilter: 'todos' | 'publicados' | 'rascunhos';
  createTrigger?: number;
  onConsularDocsChanged: () => void;
  onShowToast: (msg: string) => void;
}

export const AdminConsularDocsSection: React.FC<AdminConsularDocsSectionProps> = ({
  consularDocs,
  searchQuery,
  statusFilter,
  createTrigger,
  onConsularDocsChanged,
  onShowToast,
}) => {
  const [consularDocFormOpen, setConsularDocFormOpen] = useState(false);
  const [editingConsularDoc, setEditingConsularDoc] = useState<ConsularDocument | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (createTrigger && createTrigger > 0) {
      setEditingConsularDoc(null);
      setConsularDocFormOpen(true);
    }
  }, [createTrigger]);

  const filteredConsularDocs = useMemo(() => {
    return [...consularDocs].filter((doc) => {
      if (statusFilter === 'publicados' && doc.isPublished === false) return false;
      if (statusFilter === 'rascunhos' && doc.isPublished !== false) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.code.toLowerCase().includes(q) ||
        doc.category.toLowerCase().includes(q) ||
        (doc.categoryLabel && doc.categoryLabel.toLowerCase().includes(q)) ||
        doc.description.toLowerCase().includes(q) ||
        (doc.targetAudience && doc.targetAudience.toLowerCase().includes(q)) ||
        doc.requirements.some((r) => r.toLowerCase().includes(q))
      );
    });
  }, [consularDocs, searchQuery, statusFilter]);

  const handleSaveConsularDoc = async (id: string | null, input: ConsularDocumentInput) => {
    if (id) {
      await updateConsularDocument(id, input);
      onShowToast(input.isPublished ? 'Documento consular atualizado e publicado com sucesso.' : 'Rascunho de documento guardado.');
    } else {
      await createConsularDocument(input);
      onShowToast(input.isPublished ? 'Novo documento consular publicado com sucesso!' : 'Novo rascunho de documento guardado.');
    }
    setConsularDocFormOpen(false);
    setEditingConsularDoc(null);
    onConsularDocsChanged();
  };

  const handleToggleConsularDocPublish = async (doc: ConsularDocument) => {
    try {
      const nextPublished = !doc.isPublished;
      await updateConsularDocument(doc.id, {
        title: doc.title,
        code: doc.code,
        category: doc.category,
        categoryLabel: doc.categoryLabel,
        description: doc.description,
        fileFormat: doc.fileFormat,
        fileSize: doc.fileSize,
        requirements: doc.requirements,
        instructions: doc.instructions,
        targetAudience: doc.targetAudience,
        downloadFileName: doc.downloadFileName,
        badge: doc.badge,
        fileUrl: doc.fileUrl,
        isPublished: nextPublished,
      });
      onShowToast(
        nextPublished
          ? 'Documento consular publicado no portal!'
          : 'Documento consular colocado em rascunho.'
      );
      onConsularDocsChanged();
    } catch (err) {
      onShowToast('Erro ao atualizar estado do documento consular.');
      console.error(err);
    }
  };

  const handleDeleteConsularDoc = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteConsularDocument(id);
      onShowToast('Documento consular removido com sucesso.');
      onConsularDocsChanged();
    } catch (err) {
      onShowToast('Não foi possível remover o documento consular.');
      console.error(err);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-rose-950/10 border border-rose-900/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-800 text-white flex items-center justify-center shrink-0 shadow-xs">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-rose-950">
              Documentos e Requerimentos Consulares Oficiais
            </h3>
            <p className="text-xs text-rose-800">
              Faça a gestão dos formulários descarregáveis, minutas, requisitos exigidos e modelos para visto, passaporte e registo consular.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingConsularDoc(null);
            setConsularDocFormOpen(true);
          }}
          className="bg-rose-800 hover:bg-rose-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Documento</span>
        </button>
      </div>

      {filteredConsularDocs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-xs">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#111] mb-1">
            Nenhum documento consular encontrado
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            {searchQuery ? 'Nenhum resultado corresponde à pesquisa.' : 'Ainda não existem documentos consulares registados.'}
          </p>
          <button
            onClick={() => {
              setEditingConsularDoc(null);
              setConsularDocFormOpen(true);
            }}
            className="inline-flex items-center gap-1.5 bg-rose-800 hover:bg-rose-900 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Primeiro Documento</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredConsularDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200/80 shadow-xs hover:border-gray-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-800 flex items-center justify-center shrink-0 border border-rose-100">
                  <FileText className="w-5 h-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-rose-800 bg-rose-100/70 px-2 py-0.5 rounded-md">
                      {doc.code}
                    </span>
                    <span className="text-[10px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                      {doc.categoryLabel || doc.category}
                    </span>
                    {doc.targetAudience && (
                      <span className="text-[10px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                        {doc.targetAudience}
                      </span>
                    )}
                    {doc.badge && (
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                        {doc.badge}
                      </span>
                    )}
                    {doc.isPublished !== false ? (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        Publicado
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                        Rascunho
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-[#111] leading-snug">
                    {doc.title}
                  </h3>

                  <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                    {doc.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-gray-500">
                    <span className="font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md">
                      {doc.requirements?.length || 0} requisitos exigidos
                    </span>
                    <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-700 font-bold">
                      {doc.fileFormat} • {doc.fileSize}
                    </span>
                    {doc.fileUrl && (
                      <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3 h-3" /> Ficheiro anexo oficial
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => generateAndDownloadConsularDocument(doc)}
                  className="text-[11px] font-semibold text-gray-700 hover:text-rose-800 bg-gray-100 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  title="Testar descarregamento do documento"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Descarregar</span>
                </button>

                <button
                  onClick={() => handleToggleConsularDocPublish(doc)}
                  className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    doc.isPublished !== false
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      : 'bg-rose-800 hover:bg-rose-900 text-white'
                  }`}
                >
                  {doc.isPublished !== false ? 'Despublicar' : 'Publicar'}
                </button>

                <button
                  onClick={() => {
                    setEditingConsularDoc(doc);
                    setConsularDocFormOpen(true);
                  }}
                  className="p-2 rounded-lg text-[#444] hover:text-rose-800 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Editar documento consular"
                  aria-label="Editar"
                >
                  <Pencil className="w-4 h-4" />
                </button>

                {confirmDeleteId === doc.id ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDeleteConsularDoc(doc.id)}
                      disabled={deletingId === doc.id}
                      className="text-[11px] font-bold text-white bg-[#d9251d] px-2.5 py-1.5 rounded-lg cursor-pointer"
                    >
                      {deletingId === doc.id ? '...' : 'Confirmar'}
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
                    onClick={() => setConfirmDeleteId(doc.id)}
                    className="p-2 rounded-lg text-[#444] hover:text-[#d9251d] hover:bg-red-50 transition-colors cursor-pointer"
                    title="Eliminar documento consular"
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

      {consularDocFormOpen && (
        <ConsularDocFormModal
          initialDoc={editingConsularDoc}
          onClose={() => {
            setConsularDocFormOpen(false);
            setEditingConsularDoc(null);
          }}
          onSave={handleSaveConsularDoc}
        />
      )}
    </div>
  );
};
