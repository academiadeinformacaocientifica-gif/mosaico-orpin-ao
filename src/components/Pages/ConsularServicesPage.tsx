/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  CheckCircle2,
  Clock,
  Calendar,
  Building2,
  Phone,
  Mail,
  MapPin,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Plane,
  Stamp,
  Globe2,
  HelpCircle,
  Printer,
  Sparkles,
} from 'lucide-react';
import { Article } from '../../types';
import {
  consularDocuments,
  consularServices,
  consularInfo,
  ConsularDocument,
  ConsularService,
} from '../../data/consularServices';
import { generateAndDownloadConsularDocument } from '../../lib/consularDocDownload';

interface ConsularServicesPageProps {
  articles?: Article[];
  onOpenArticle?: (article: Article) => void;
  onShowToast: (message: string) => void;
}

type FilterCategory = 'todos' | 'documentos' | 'vistos' | 'identidade' | 'passaportes' | 'notariado';

export const ConsularServicesPage: React.FC<ConsularServicesPageProps> = ({
  articles = [],
  onOpenArticle,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('todos');
  const [expandedDocId, setExpandedDocId] = useState<string | null>('doc-visto-solicitacao');
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>('serv-vistos');

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    return consularDocuments.filter((doc) => {
      const matchesSearch =
        searchQuery === '' ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.requirements.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        activeFilter === 'todos' ||
        activeFilter === 'documentos' ||
        (activeFilter === 'vistos' && doc.category === 'vistos') ||
        (activeFilter === 'identidade' && doc.category === 'identidade') ||
        (activeFilter === 'passaportes' && (doc.category === 'viagem' || doc.id.includes('passaporte') || doc.id.includes('salvo'))) ||
        (activeFilter === 'notariado' && doc.category === 'notariado');

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeFilter]);

  // Filtered services
  const filteredServices = useMemo(() => {
    return consularServices.filter((service) => {
      const matchesSearch =
        searchQuery === '' ||
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.requirements.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        activeFilter === 'todos' ||
        (activeFilter === 'vistos' && service.category === 'vistos') ||
        (activeFilter === 'identidade' && service.category === 'identidade') ||
        (activeFilter === 'passaportes' && service.category === 'passaportes') ||
        (activeFilter === 'notariado' && service.category === 'notariado');

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeFilter]);

  // Consular notices/articles
  const consularArticles = useMemo(() => {
    return articles.filter(
      (a) =>
        a.categoryId === 'panorama-consular' ||
        a.category.toLowerCase().includes('consular') ||
        a.category.toLowerCase().includes('comunidade')
    );
  }, [articles]);

  const handleDownload = (doc: ConsularDocument) => {
    try {
      generateAndDownloadConsularDocument(doc);
      onShowToast(`A preparar modelo "${doc.title}" para download/impressão.`);
    } catch (err) {
      console.error(err);
      onShowToast('Não foi possível gerar o documento. Tente novamente.');
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300 pb-12">
      {/* 1. HERO HEADER */}
      <div className="bg-white p-6 sm:p-9 rounded-2xl my-6 sm:my-8 border-l-6 border-[#d9251d] shadow-xs flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div className="max-w-3xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111] mb-2 tracking-tight">
            Serviços Consulares & Modelos de Documentos
          </h1>
          <p className="text-sm text-[#555] leading-relaxed">
            Atendimento oficial ao cidadão, modelos de solicitação de vistos para Angola, renovação do Bilhete de Identidade (BI), passaportes nacionais, atos notariais e proteção da comunidade angolana em Espanha e Andorra.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
          <div className="bg-[#f8f9fa] border border-[#e5e7eb] px-4 py-3 rounded-xl flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#d9251d]" />
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Atendimento ao Público</p>
              <p className="text-xs font-bold text-[#111]">09h30 às 13h30 (Seg. a Sex.)</p>
            </div>
          </div>
          <div className="bg-red-50/70 border border-red-100 px-4 py-3 rounded-xl flex items-center gap-3">
            <Mail className="w-5 h-5 text-[#d9251d]" />
            <div>
              <p className="text-[11px] font-bold text-red-700 uppercase tracking-wide">Agendamentos Consulares</p>
              <p className="text-xs font-bold text-[#111] truncate max-w-[200px]">servicos.consulares@...</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SEARCH AND CATEGORY FILTER TABS */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar por formulário, visto, Bilhete de Identidade, procuração ou requisito..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d9251d]/20 focus:border-[#d9251d] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold px-1.5 py-0.5"
              >
                Limpar
              </button>
            )}
          </div>

          <span className="text-xs font-semibold text-gray-500 hidden sm:inline px-2">
            {filteredDocuments.length} modelos disponíveis
          </span>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-gray-400 font-bold uppercase text-[10px] tracking-wider shrink-0 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Filtrar:
          </span>
          {[
            { id: 'todos', label: 'Todos os Serviços & Ficheiros' },
            { id: 'documentos', label: 'Modelos para Download' },
            { id: 'vistos', label: 'Vistos para Angola' },
            { id: 'identidade', label: 'Bilhete de Identidade & Registo' },
            { id: 'passaportes', label: 'Passaportes & Viagem' },
            { id: 'notariado', label: 'Atos Notariais' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as FilterCategory)}
              className={`px-3.5 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-[#111] text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. CENTRO DE DOCUMENTOS E MINUTAS OFICIAIS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#111] flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-[#d9251d]" />
              <span>Modelos e Requerimentos Oficiais para Download</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Descarregue, preencha e imprima os modelos em formato normalizado da Secção Consular.
            </p>
          </div>
          <span className="text-xs font-bold bg-red-100 text-[#d9251d] px-3 py-1 rounded-full">
            {filteredDocuments.length} Formulários
          </span>
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 shadow-xs">
            <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-gray-700">Nenhum modelo encontrado</p>
            <p className="text-xs text-gray-500 mt-1">Tente ajustar o termo de pesquisa ou o filtro ativo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocuments.map((doc) => {
              const isExpanded = expandedDocId === doc.id;
              return (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 flex flex-col justify-between hover:border-gray-300 transition-all group"
                >
                  <div>
                    {/* Header tags */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-black bg-gray-100 text-gray-700 px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                          {doc.code}
                        </span>
                        <span className="text-[10px] font-bold bg-red-50 text-[#d9251d] px-2 py-0.5 rounded-full">
                          {doc.categoryLabel}
                        </span>
                        {doc.badge && (
                          <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                            {doc.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">
                        {doc.fileFormat} • {doc.fileSize}
                      </span>
                    </div>

                    {/* Title & Desc */}
                    <h3 className="text-sm font-bold text-[#111] group-hover:text-[#d9251d] transition-colors leading-snug mb-1.5">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed mb-3">
                      {doc.description}
                    </p>

                    {/* Expandable requirements */}
                    <div className="border-t border-gray-100 pt-2.5 mb-3">
                      <button
                        onClick={() => setExpandedDocId(isExpanded ? null : doc.id)}
                        className="flex items-center justify-between w-full text-[11px] font-bold text-gray-500 hover:text-gray-800 py-1 transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Documentos e Requisitos Necessários ({doc.requirements.length})
                        </span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {isExpanded && (
                        <div className="mt-2 bg-gray-50/70 p-3 rounded-xl border border-gray-100 text-[11px] space-y-1.5 animate-in fade-in duration-150">
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            {doc.requirements.map((req, idx) => (
                              <li key={idx} className="leading-tight">
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                          {doc.instructions && (
                            <p className="text-[10px] text-gray-400 italic pt-1 border-t border-gray-200/60 mt-1.5">
                              Nota: {doc.instructions}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100 mt-auto">
                    <span className="text-[11px] font-semibold text-gray-400">
                      Destinatários: <strong className="text-gray-700">{doc.targetAudience}</strong>
                    </span>

                    <button
                      onClick={() => handleDownload(doc)}
                      className="inline-flex items-center gap-1.5 bg-[#d9251d] hover:bg-[#b51d16] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs hover:shadow cursor-pointer active:scale-95"
                      title="Descarregar modelo oficial preenchível"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descarregar Modelo (PDF)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. GUIA COMPLETO DE SERVIÇOS PASSO A PASSO */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#111] flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#d9251d]" />
              <span>Guia de Trâmites, Prazos & Procedimentos Consulares</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Consulte os requisitos obrigatórios, taxas aplicáveis e o fluxo de atendimento para cada serviço.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {filteredServices.map((service) => {
            const isExpanded = expandedServiceId === service.id;
            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden transition-all"
              >
                <div
                  onClick={() => setExpandedServiceId(isExpanded ? null : service.id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black bg-red-50 text-[#d9251d] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {service.categoryLabel}
                      </span>
                      <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        Prazo: {service.processingTime}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#111]">{service.title}</h3>
                    <p className="text-xs text-gray-600">{service.summary}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      className="text-xs font-bold text-[#d9251d] hover:underline flex items-center gap-1"
                    >
                      {isExpanded ? 'Ocultar detalhes' : 'Ver guia completo'}
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 border-t border-gray-100 bg-[#fafafa]/50 space-y-5 animate-in fade-in duration-150">
                    {/* Steps grid */}
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-2.5 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Passo a Passo do Procedimento
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
                        {service.steps.map((step, idx) => (
                          <div
                            key={idx}
                            className="bg-white p-3 rounded-xl border border-gray-200 text-xs shadow-2xs space-y-1"
                          >
                            <span className="w-5 h-5 rounded-full bg-[#111] text-white font-bold text-[10px] flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <p className="text-gray-700 leading-snug font-medium pt-1">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Requirements and fees */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-2">
                        <h5 className="text-xs font-bold text-[#111] uppercase tracking-wide flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-[#d9251d]" />
                          Documentos Obrigatórios
                        </h5>
                        <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                          {service.requirements.map((req, i) => (
                            <li key={i}>{req}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-2">
                        <h5 className="text-xs font-bold text-[#111] uppercase tracking-wide flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          Custos & Emolumentos
                        </h5>
                        <p className="text-xs text-gray-700 leading-relaxed font-medium">
                          {service.feeInfo}
                        </p>
                        {service.observations && (
                          <p className="text-[11px] text-amber-800 bg-amber-50/80 p-2.5 rounded-lg border border-amber-200 mt-2">
                            {service.observations}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Associated documents download bar */}
                    {service.associatedDocuments && service.associatedDocuments.length > 0 && (
                      <div className="bg-red-50/60 border border-red-100 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="text-xs">
                          <p className="font-bold text-[#111]">Modelos e Formulários associados a este serviço:</p>
                          <p className="text-gray-500 text-[11px]">
                            Descarregue os documentos necessários antes de comparecer no atendimento.
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {service.associatedDocuments.map((docId) => {
                            const foundDoc = consularDocuments.find((d) => d.id === docId);
                            if (!foundDoc) return null;
                            return (
                              <button
                                key={docId}
                                onClick={() => handleDownload(foundDoc)}
                                className="inline-flex items-center gap-1 bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-2xs"
                              >
                                <Download className="w-3 h-3 text-[#d9251d]" />
                                <span>{foundDoc.code} ({foundDoc.categoryLabel})</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. INFORMAÇÕES DE ATENDIMENTO, HORÁRIOS & AGENDAMENTO */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-xl font-bold text-[#111] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#d9251d]" />
            <span>Atendimento Presencial, Morada & Agendamentos</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Orientações para deslocação à Secção Consular da Embaixada em Madrid.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Localização */}
          <div className="space-y-2.5 bg-gray-50/70 p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 text-gray-900 font-bold">
              <MapPin className="w-4 h-4 text-[#d9251d]" />
              <span>Morada Oficial</span>
            </div>
            <p className="text-gray-700 leading-relaxed">
              <strong>{consularInfo.address}</strong>
            </p>
            <p className="text-gray-500 text-[11px]">
              {consularInfo.metroStations}
            </p>
            <p className="text-gray-500 text-[11px]">
              Jurisdição: <strong>{consularInfo.jurisdiction}</strong>
            </p>
          </div>

          {/* Horários */}
          <div className="space-y-2.5 bg-gray-50/70 p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 text-gray-900 font-bold">
              <Clock className="w-4 h-4 text-[#d9251d]" />
              <span>Horários de Funcionamento</span>
            </div>
            <p className="text-gray-700">
              Atendimento e Entrada de Processos:<br />
              <strong>{consularInfo.schedulePublic}</strong>
            </p>
            <p className="text-gray-700">
              Levantamento de Documentos Emitidos:<br />
              <strong>{consularInfo.scheduleDeliveries}</strong>
            </p>
            <p className="text-gray-400 text-[10px]">
              {consularInfo.closedDays}
            </p>
          </div>

          {/* Contactos & Agendamento */}
          <div className="space-y-2.5 bg-gray-50/70 p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 text-gray-900 font-bold">
              <Mail className="w-4 h-4 text-[#d9251d]" />
              <span>Marcações & Contacto Direto</span>
            </div>
            <p className="text-gray-700">
              E-mail da Secção Consular:<br />
              <a
                href={`mailto:${consularInfo.emailConsular}`}
                className="text-[#d9251d] font-bold hover:underline"
              >
                {consularInfo.emailConsular}
              </a>
            </p>
            <p className="text-gray-700">
              Telefone Geral:<br />
              <strong>{consularInfo.phone}</strong>
            </p>
            <p className="text-gray-500 text-[11px]">
              Recomenda-se enviar com antecedência a cópia dos documentos e o formulário preenchido por correio eletrónico para validação prévia.
            </p>
          </div>
        </div>
      </section>

      {/* 6. COMUNICADOS E NOTÍCIAS CONSULARES */}
      {consularArticles.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#111] flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-[#d9251d]" />
              <span>Avisos e Comunicados da Secção Consular</span>
            </h2>
            <span className="text-xs font-semibold text-gray-500">
              {consularArticles.length} publicações
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {consularArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => onOpenArticle && onOpenArticle(art)}
                className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs hover:shadow-sm transition-all cursor-pointer flex gap-4 items-start group"
              >
                <img
                  src={art.image}
                  alt=""
                  className="w-20 h-20 rounded-xl object-cover shrink-0 bg-gray-100 border border-gray-200"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#d9251d] uppercase">
                      {art.category}
                    </span>
                    <span className="text-[10px] text-gray-400">• {art.date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#111] group-hover:text-[#d9251d] transition-colors line-clamp-2">
                    {art.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {art.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
