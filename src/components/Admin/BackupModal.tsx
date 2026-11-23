/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Download,
  ShieldCheck,
  HardDrive,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  RotateCcw,
  Sparkles,
  Server,
  Layers
} from 'lucide-react';
import {
  Article,
  GalleryItem,
  VideoItem,
  MagazineEdition,
  ConsularDocument,
  CulturalEvent,
  DiplomaticEvent,
  EmbassyInfo,
} from '../../types';
import { NaturalWonder } from '../../data/wondersData';
import { createBackupPackage, downloadBackupJson, validateBackupFile } from '../../lib/backupService';
import { isSupabaseConfigured } from '../../lib/supabase';
import { getSecurityLogs, clearSecurityLogs, logSecurityEvent, SecurityLogEntry } from '../../lib/auditLogger';
import { Activity, RefreshCw, Trash } from 'lucide-react';

interface BackupModalProps {
  onClose: () => void;
  onShowToast: (msg: string) => void;
  data: {
    articles: Article[];
    galleryItems: GalleryItem[];
    videoItems: VideoItem[];
    magazineEditions: MagazineEdition[];
    naturalWonders: NaturalWonder[];
    consularDocs: ConsularDocument[];
    culturalEvents: CulturalEvent[];
    diplomaticEvents: DiplomaticEvent[];
    embassyInfo?: EmbassyInfo;
    userEmail?: string;
  };
}

export const BackupModal: React.FC<BackupModalProps> = ({ onClose, onShowToast, data }) => {
  const [activeTab, setActiveTab] = useState<'export' | 'recovery' | 'logs'>('export');
  const [isExporting, setIsExporting] = useState(false);
  const [logs, setLogs] = useState<SecurityLogEntry[]>(() => getSecurityLogs());
  const [lastBackupTime, setLastBackupTime] = useState<string | null>(() => {
    try {
      return localStorage.getItem('mosaico_last_backup_at');
    } catch {
      return null;
    }
  });

  const totalRecords =
    data.articles.length +
    data.galleryItems.length +
    data.videoItems.length +
    data.magazineEditions.length +
    data.naturalWonders.length +
    data.consularDocs.length +
    data.culturalEvents.length +
    data.diplomaticEvents.length +
    (data.embassyInfo ? 1 : 0);

  const handleDownload = async () => {
    try {
      setIsExporting(true);
      const { jsonString, filename } = await createBackupPackage(data);
      downloadBackupJson(jsonString, filename);

      const now = new Date().toLocaleString('pt-PT');
      setLastBackupTime(now);
      try {
        localStorage.setItem('mosaico_last_backup_at', now);
      } catch {
        // ignora erro de armazenamento
      }

      logSecurityEvent({
        type: 'BACKUP_EXPORT',
        actorEmail: data.userEmail,
        details: `Cópia integral descarregada (${totalRecords} registos). Ficheiro: ${filename}`,
      });
      setLogs(getSecurityLogs());

      onShowToast(`Cópia de segurança (${filename}) descarregada com sucesso!`);
    } catch (err) {
      console.error(err);
      onShowToast('Erro ao gerar a cópia de segurança.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
        
        {/* MODAL HEADER */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>Cópias de Segurança & Recuperação (Backup & DR)</span>
              </h2>
              <p className="text-xs text-gray-300">
                Soberania de dados e continuidade operacional do portal Mosaico Angola
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TABS */}
        <div className="flex border-b border-gray-200 bg-gray-50 px-5 pt-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('export')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'export'
                ? 'border-[#d9251d] text-[#d9251d]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Exportar Backup Integral</span>
          </button>
          <button
            onClick={() => setActiveTab('recovery')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'recovery'
                ? 'border-[#d9251d] text-[#d9251d]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Plano de Recuperação (DR)</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('logs');
              setLogs(getSecurityLogs());
            }}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'logs'
                ? 'border-[#d9251d] text-[#d9251d]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Auditoria & Logs ({logs.length})</span>
          </button>
        </div>

        {/* CONTENT BODY */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'export' ? (
            <>
              {/* STATUS SUMMARY BANNER */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    <Server className="w-4 h-4 text-[#d9251d]" />
                    <span>Origem dos Dados:</span>
                    <span className={isSupabaseConfigured ? 'text-emerald-700' : 'text-amber-700'}>
                      {isSupabaseConfigured ? 'Supabase Cloud (PostgreSQL)' : 'Armazenamento Local Resiliente'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Total de <strong>{totalRecords} registos</strong> prontos para serem salvaguardados.
                  </p>
                  {lastBackupTime && (
                    <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Último descarregamento efetuado: {lastBackupTime}</span>
                    </p>
                  )}
                </div>

                <button
                  onClick={handleDownload}
                  disabled={isExporting}
                  className="bg-[#d9251d] hover:bg-[#b01b14] disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm hover:shadow shrink-0 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{isExporting ? 'A gerar...' : 'Descarregar Backup JSON'}</span>
                </button>
              </div>

              {/* TABLE COUNTS BREAKDOWN */}
              <div>
                <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-gray-500" />
                  <span>Conteúdos Incluídos na Cópia de Segurança</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 bg-white border border-gray-200 rounded-xl">
                    <span className="text-gray-500 block text-[11px]">Notícias & Artigos</span>
                    <strong className="text-gray-900 text-sm">{data.articles.length}</strong>
                  </div>
                  <div className="p-3 bg-white border border-gray-200 rounded-xl">
                    <span className="text-gray-500 block text-[11px]">Edições da Revista</span>
                    <strong className="text-gray-900 text-sm">{data.magazineEditions.length}</strong>
                  </div>
                  <div className="p-3 bg-white border border-gray-200 rounded-xl">
                    <span className="text-gray-500 block text-[11px]">7 Maravilhas</span>
                    <strong className="text-gray-900 text-sm">{data.naturalWonders.length}</strong>
                  </div>
                  <div className="p-3 bg-white border border-gray-200 rounded-xl">
                    <span className="text-gray-500 block text-[11px]">Galeria Fotográfica</span>
                    <strong className="text-gray-900 text-sm">{data.galleryItems.length}</strong>
                  </div>
                  <div className="p-3 bg-white border border-gray-200 rounded-xl">
                    <span className="text-gray-500 block text-[11px]">Vídeos Oficiais</span>
                    <strong className="text-gray-900 text-sm">{data.videoItems.length}</strong>
                  </div>
                  <div className="p-3 bg-white border border-gray-200 rounded-xl">
                    <span className="text-gray-500 block text-[11px]">Documentos Consulares</span>
                    <strong className="text-gray-900 text-sm">{data.consularDocs.length}</strong>
                  </div>
                  <div className="p-3 bg-white border border-gray-200 rounded-xl">
                    <span className="text-gray-500 block text-[11px]">Agenda Cultural</span>
                    <strong className="text-gray-900 text-sm">{data.culturalEvents.length}</strong>
                  </div>
                  <div className="p-3 bg-white border border-gray-200 rounded-xl">
                    <span className="text-gray-500 block text-[11px]">Agenda Diplomática</span>
                    <strong className="text-gray-900 text-sm">{data.diplomaticEvents.length}</strong>
                  </div>
                  <div className="p-3 bg-white border border-gray-200 rounded-xl">
                    <span className="text-gray-500 block text-[11px]">Dados da Embaixada</span>
                    <strong className="text-emerald-700 text-sm">Configurado</strong>
                  </div>
                </div>
              </div>

              {/* SECURITY ASSURANCE NOTE */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  O ficheiro de cópia de segurança é descarregado diretamente no formato aberto JSON universal, assinado com checksum de validação, permitindo restauro rápido em qualquer momento sem dependência exclusiva de fornecedores cloud.
                </p>
              </div>
            </>
          ) : activeTab === 'recovery' ? (
            <>
              {/* DISASTER RECOVERY POLICY */}
              <div className="space-y-4 text-xs text-gray-600 leading-relaxed">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                  <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Métricas de Continuidade de Negócio</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <span className="text-[11px] text-gray-500 font-bold block uppercase">RTO (Tempo de Recuperação)</span>
                      <strong className="text-sm text-gray-900">&lt; 15 Minutos</strong>
                      <p className="text-[11px] text-gray-500 mt-0.5">Rollback instantâneo na Vercel e restauro da base de dados.</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <span className="text-[11px] text-gray-500 font-bold block uppercase">RPO (Ponto de Recuperação)</span>
                      <strong className="text-sm text-gray-900">&lt; 24 Horas</strong>
                      <p className="text-[11px] text-gray-500 mt-0.5">Backups diários na cloud + cópias sob demanda em JSON.</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-3">
                  <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-[#d9251d]" />
                    <span>Procedimento de Restauração de Emergência</span>
                  </h4>
                  <ol className="list-decimal pl-4 space-y-2 text-gray-700">
                    <li>
                      <strong>Falha de Código/Frontend (Vercel)</strong>: Aceder ao painel da Vercel em <em>Deployments</em>, selecionar a versão anterior estável e clicar em <em>Instant Rollback</em> (tempo: &lt; 5 segundos).
                    </li>
                    <li>
                      <strong>Falha de Dados (Supabase)</strong>: No painel do Supabase, aceder a <em>Database &gt; Backups</em> para restaurar o snapshot automático, ou utilizar o ficheiro JSON de backup descarregado.
                    </li>
                    <li>
                      <strong>Regra 3-2-1 de Salvaguarda</strong>: Recomenda-se descarregar um backup JSON antes de grandes eventos diplomáticos e arquivá-lo num suporte externo seguro da Chancelaria.
                    </li>
                  </ol>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <div>
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-[#d9251d]" />
                    <span>Registo de Auditoria Operacional</span>
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Histórico higienizado de ações e acessos ao painel ({logs.length} registos)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setLogs(getSecurityLogs());
                      onShowToast('Registos de auditoria atualizados.');
                    }}
                    className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    title="Atualizar lista"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  {logs.length > 0 && (
                    <button
                      onClick={() => {
                        if (window.confirm('Tem a certeza que deseja limpar o histórico local de auditoria?')) {
                          clearSecurityLogs();
                          setLogs([]);
                          onShowToast('Histórico de auditoria limpo.');
                        }
                      }}
                      className="text-[11px] text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash className="w-3 h-3" />
                      <span>Limpar</span>
                    </button>
                  )}
                </div>
              </div>

              {/* PRIVACY SHIELD BADGE */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11px]">
                  <strong>Proteção de Dados (Lei n.º 22/11 de Angola):</strong> Palavras-passe, credenciais e chaves criptográficas são 100% omitidas e expurgadas antes de qualquer registo de auditoria.
                </p>
              </div>

              {logs.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-400">
                  Nenhum evento de segurança registado nesta sessão.
                </div>
              ) : (
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                  {logs.map((log) => {
                    let badgeClass = 'bg-gray-100 text-gray-700 border-gray-200';
                    if (log.type === 'AUTH_LOGIN_SUCCESS') {
                      badgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                    } else if (log.type === 'AUTH_LOGIN_FAILURE') {
                      badgeClass = 'bg-rose-50 text-rose-800 border-rose-200';
                    } else if (log.type === 'BACKUP_EXPORT') {
                      badgeClass = 'bg-blue-50 text-blue-800 border-blue-200';
                    }

                    return (
                      <div
                        key={log.id}
                        className="p-3 bg-white border border-gray-200 rounded-xl flex flex-col gap-1.5 shadow-2xs text-xs"
                      >
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeClass}`}>
                            {log.type}
                          </span>
                          <span className="text-[11px] text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(log.timestamp).toLocaleString('pt-PT')}
                          </span>
                        </div>
                        <p className="text-gray-800 font-medium text-xs">{log.details}</p>
                        {log.actorEmail && (
                          <span className="text-[11px] text-gray-500">
                            Operador: <strong className="text-gray-700">{log.actorEmail}</strong>
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">Mosaico Angola • Protocolo de Contingência</span>
          <button
            onClick={onClose}
            className="text-xs font-semibold px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
