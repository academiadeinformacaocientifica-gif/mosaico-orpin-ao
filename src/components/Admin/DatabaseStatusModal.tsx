/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  HardDrive,
  Wrench,
} from 'lucide-react';
import { checkDatabaseHealth, DbHealthReport } from '../../lib/dbHealthCheck';
import { repairBrowserStorage } from '../../lib/resilientStorage';

interface DatabaseStatusModalProps {
  onClose: () => void;
  onShowToast: (msg: string) => void;
  onRefreshAll: () => void;
}

const SUPABASE_SCHEMA_SQL = `-- ============================================================================
-- Mosaico Angolano — Esquema Completo do Backend (Supabase)
-- Notícias + Galeria Fotográfica + Vídeos + Revista Mosaico + 7 Maravilhas de Angola
-- ============================================================================

-- 1. TABELA DE UTILIZADORES / PERFIS DE REDAÇÃO -------------------------------
create table if not exists public.admin_users (
  id             text primary key,
  name           text not null,
  email          text not null unique,
  password_hash  text not null,
  role           text not null default 'Editor',
  avatar_url     text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- 2. TABELA DE ARTIGOS / NOTÍCIAS --------------------------------------------
create table if not exists public.articles (
  id             text primary key,
  title          text not null,
  subtitle       text,
  description    text not null,
  full_content   text[],
  category       text not null,
  category_id    text not null,
  author_name    text not null,
  author_role    text not null,
  author_avatar  text,
  source         text,
  date_label     text not null,
  iso_date       date not null,
  read_time      text not null,
  image_url      text not null,
  gallery        text[],
  likes          integer not null default 0,
  comments_count integer not null default 0,
  comments       jsonb not null default '[]'::jsonb,
  is_featured    boolean not null default false,
  is_carousel    boolean not null default false,
  is_published   boolean not null default true,
  tags           text[] not null default '{}',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.articles add column if not exists is_published boolean not null default true;
alter table public.articles add column if not exists source text;

-- 3. TABELA DE IMAGENS DA GALERIA -------------------------------------------
create table if not exists public.gallery_items (
  id             text primary key,
  title          text not null,
  category       text not null default 'Diplomacia',
  date_label     text not null default '2026',
  description    text not null default '',
  image_url      text not null,
  is_published   boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

do $$ begin
  alter table public.gallery_items alter column id type text;
exception when others then null;
end $$;

alter table public.gallery_items add column if not exists is_published boolean not null default true;
alter table public.gallery_items add column if not exists collection text;
alter table public.gallery_items add column if not exists images text[];

-- 4. TABELA DE VÍDEOS --------------------------------------------------------
create table if not exists public.video_items (
  id             text primary key,
  title          text not null,
  category       text not null default 'Diplomacia',
  duration       text not null default '10:00',
  date_label     text not null default '2026',
  views          text not null default '1.2mil visualizações',
  description    text not null default '',
  image_url      text not null,
  video_url      text,
  is_published   boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

do $$ begin
  alter table public.video_items alter column id type text;
exception when others then null;
end $$;

alter table public.video_items add column if not exists is_published boolean not null default true;

-- 5. TABELA DE EDIÇÕES DA REVISTA MOSAICO ------------------------------------
create table if not exists public.magazine_editions (
  id             text primary key,
  edition_number integer not null,
  title          text not null,
  theme          text not null default '',
  period         text not null default '',
  year           integer not null default 2026,
  cover_image    text not null,
  pdf_url        text,
  pages_count    integer not null default 48,
  highlights     text[] not null default '{}',
  editorial_note text not null default '',
  is_published   boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.magazine_editions add column if not exists is_published boolean not null default true;

-- 6. TABELA DAS 7 MARAVILHAS NATURAIS DE ANGOLA ------------------------------
create table if not exists public.natural_wonders (
  id                   text primary key,
  number               integer not null default 1,
  name                 text not null,
  official_title       text not null,
  province             text not null,
  location             text not null default '',
  tagline              text not null default '',
  summary              text not null,
  full_description     text[] not null default '{}',
  geography_and_nature text not null default '',
  how_to_visit         text not null default '',
  image_url            text not null,
  gallery_images       text[] not null default '{}',
  highlights           text[] not null default '{}',
  facts                jsonb not null default '[]'::jsonb,
  is_published         boolean not null default true,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

alter table public.natural_wonders add column if not exists is_published boolean not null default true;

-- 7. TABELA DE DOCUMENTOS E FORMULÁRIOS CONSULARES ---------------------------
create table if not exists public.consular_documents (
  id                 text primary key,
  title              text not null,
  code               text not null,
  category           text not null default 'vistos',
  category_label     text not null default 'Vistos & Entrada',
  description        text not null default '',
  file_format        text not null default 'PDF',
  file_size          text not null default '300 KB',
  requirements       text[] not null default '{}',
  instructions       text not null default '',
  target_audience    text not null default 'Geral',
  download_file_name text not null,
  badge              text,
  file_url           text,
  is_published       boolean not null default true,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

alter table public.consular_documents add column if not exists is_published boolean not null default true;

-- 8. SEGURANÇA E RLS EM TODAS AS TABELAS -------------------------------------
alter table public.admin_users enable row level security;
alter table public.articles enable row level security;
alter table public.consular_documents enable row level security;
alter table public.gallery_items enable row level security;
alter table public.video_items enable row level security;
alter table public.magazine_editions enable row level security;
alter table public.natural_wonders enable row level security;

-- Políticas de Acesso
drop policy if exists "Permitir leitura de perfis de admin" on public.admin_users;
create policy "Permitir leitura de perfis de admin" on public.admin_users for select using (true);
drop policy if exists "Permitir registo de novos perfis" on public.admin_users;
create policy "Permitir registo de novos perfis" on public.admin_users for insert with check (true);
drop policy if exists "Permitir atualização de perfil" on public.admin_users;
create policy "Permitir atualização de perfil" on public.admin_users for update using (true) with check (true);

drop policy if exists "Leitura pública de notícias" on public.articles;
create policy "Leitura pública de notícias" on public.articles for select using (true);
drop policy if exists "Inserção de notícias" on public.articles;
create policy "Inserção de notícias" on public.articles for insert with check (true);
drop policy if exists "Atualização de notícias" on public.articles;
create policy "Atualização de notícias" on public.articles for update using (true) with check (true);
drop policy if exists "Remoção de notícias" on public.articles;
create policy "Remoção de notícias" on public.articles for delete using (true);

drop policy if exists "Leitura pública de documentos consulares" on public.consular_documents;
create policy "Leitura pública de documentos consulares" on public.consular_documents for select using (true);
drop policy if exists "Inserção de documentos consulares" on public.consular_documents;
create policy "Inserção de documentos consulares" on public.consular_documents for insert with check (true);
drop policy if exists "Atualização de documentos consulares" on public.consular_documents;
create policy "Atualização de documentos consulares" on public.consular_documents for update using (true) with check (true);
drop policy if exists "Remoção de documentos consulares" on public.consular_documents;
create policy "Remoção de documentos consulares" on public.consular_documents for delete using (true);

drop policy if exists "Leitura pública de galeria" on public.gallery_items;
create policy "Leitura pública de galeria" on public.gallery_items for select using (true);
drop policy if exists "Inserção de galeria" on public.gallery_items;
create policy "Inserção de galeria" on public.gallery_items for insert with check (true);
drop policy if exists "Atualização de galeria" on public.gallery_items;
create policy "Atualização de galeria" on public.gallery_items for update using (true) with check (true);
drop policy if exists "Remoção de galeria" on public.gallery_items;
create policy "Remoção de galeria" on public.gallery_items for delete using (true);

drop policy if exists "Leitura pública de vídeos" on public.video_items;
create policy "Leitura pública de vídeos" on public.video_items for select using (true);
drop policy if exists "Inserção de vídeos" on public.video_items;
create policy "Inserção de vídeos" on public.video_items for insert with check (true);
drop policy if exists "Atualização de vídeos" on public.video_items;
create policy "Atualização de vídeos" on public.video_items for update using (true) with check (true);
drop policy if exists "Remoção de vídeos" on public.video_items;
create policy "Remoção de vídeos" on public.video_items for delete using (true);

drop policy if exists "Leitura pública de edições" on public.magazine_editions;
create policy "Leitura pública de edições" on public.magazine_editions for select using (true);
drop policy if exists "Inserção de edições" on public.magazine_editions;
create policy "Inserção de edições" on public.magazine_editions for insert with check (true);
drop policy if exists "Atualização de edições" on public.magazine_editions;
create policy "Atualização de edições" on public.magazine_editions for update using (true) with check (true);
drop policy if exists "Remoção de edições" on public.magazine_editions;
create policy "Remoção de edições" on public.magazine_editions for delete using (true);

drop policy if exists "Leitura pública de maravilhas" on public.natural_wonders;
create policy "Leitura pública de maravilhas" on public.natural_wonders for select using (true);
drop policy if exists "Inserção de maravilhas" on public.natural_wonders;
create policy "Inserção de maravilhas" on public.natural_wonders for insert with check (true);
drop policy if exists "Atualização de maravilhas" on public.natural_wonders;
create policy "Atualização de maravilhas" on public.natural_wonders for update using (true) with check (true);
drop policy if exists "Remoção de maravilhas" on public.natural_wonders;
create policy "Remoção de maravilhas" on public.natural_wonders for delete using (true);

-- 8. BUCKET DE IMAGENS -------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('article-images', 'article-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Leitura pública de imagens de notícias" on storage.objects;
create policy "Leitura pública de imagens de notícias" on storage.objects for select using (bucket_id = 'article-images');
drop policy if exists "Envio de imagens de notícias" on storage.objects;
create policy "Envio de imagens de notícias" on storage.objects for insert with check (bucket_id = 'article-images');
drop policy if exists "Atualização de imagens de notícias" on storage.objects;
create policy "Atualização de imagens de notícias" on storage.objects for update using (bucket_id = 'article-images') with check (bucket_id = 'article-images');
drop policy if exists "Remoção de imagens de notícias" on storage.objects;
create policy "Remoção de imagens de notícias" on storage.objects for delete using (bucket_id = 'article-images');
`;

export const DatabaseStatusModal: React.FC<DatabaseStatusModalProps> = ({
  onClose,
  onShowToast,
  onRefreshAll,
}) => {
  const [report, setReport] = useState<DbHealthReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [repairing, setRepairing] = useState(false);

  const runCheck = async () => {
    setLoading(true);
    try {
      const rep = await checkDatabaseHealth();
      setReport(rep);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runCheck();
  }, []);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopied(true);
    onShowToast('Código SQL copiado para a área de transferência!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleRepairStorage = async () => {
    setRepairing(true);
    try {
      const res = await repairBrowserStorage();
      onShowToast(res.message);
      onRefreshAll();
      await runCheck();
    } catch (err: any) {
      onShowToast('Erro ao reparar armazenamento: ' + (err?.message || 'Falha'));
    } finally {
      setRepairing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 flex items-start sm:items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-[#f0f0f0] flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#111] text-white flex items-center justify-center">
              <Database className="w-4 h-4 text-[#d9251d]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#111]">
                Diagnóstico da Conexão & Base de Dados
              </h2>
              <p className="text-[11px] text-gray-500">
                Estado em tempo real da conexão entre o Frontend, Supabase e Armazenamento Local
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

        {/* CONTENT BODY */}
        <div className="p-6 space-y-5 max-h-[calc(85vh-130px)] overflow-y-auto text-sm text-[#333]">
          {/* STATUS CARDS */}
          {loading ? (
            <div className="flex items-center justify-center py-10 text-gray-400 gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-[#d9251d]" />
              <span>A verificar tabelas no Supabase...</span>
            </div>
          ) : (
            <>
              {/* RESUMO GERAL */}
              <div
                className={`p-4 rounded-xl border ${
                  report?.allReady
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50/70 border-amber-200 text-amber-950'
                }`}
              >
                <div className="flex items-start gap-3">
                  {report?.allReady ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h3 className="font-bold text-xs uppercase tracking-wider">
                      {report?.allReady
                        ? 'Todas as Tabelas Conectadas e Prontas no Supabase'
                        : 'Modo Híbrido Ativo: Armazenamento Local Resiliente (IndexedDB)'}
                    </h3>
                    <p className="text-xs mt-1 leading-relaxed opacity-90">
                      {report?.allReady
                        ? 'O banco de dados na nuvem está 100% configurado com todas as tabelas e políticas de acesso ativas. As alterações são sincronizadas na nuvem.'
                        : 'Algumas tabelas ainda não foram criadas no seu projeto Supabase. Os conteúdos que adicionar ou apagar estão a ser guardados com segurança no Armazenamento Local Resiliente (IndexedDB + Memória), garantindo que nada se perde. Para ativar a nuvem completa, execute o script SQL abaixo no Supabase.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* LISTA DE TABELAS */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Estado Individual das Tabelas & Recursos
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {report?.tables.map((tbl) => (
                    <div
                      key={tbl.key}
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        {tbl.status === 'connected' ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 shadow-xs shadow-emerald-400" />
                        ) : (
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 shadow-xs shadow-amber-400" />
                        )}
                        <div>
                          <p className="text-xs font-bold text-gray-900 leading-tight">
                            {tbl.label}
                          </p>
                          <p className="text-[10px] text-gray-500 font-mono">
                            tabela: {tbl.name}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        {tbl.status === 'connected' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            Conectado ({tbl.itemCount} registos)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3" />
                            Pendente no Supabase (Local Ativo)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Bucket de Storage */}
                  <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-2.5">
                      {report?.storageReady ? (
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                      )}
                      <div>
                        <p className="text-xs font-bold text-gray-900 leading-tight">
                          Armazenamento de Imagens & Mídia
                        </p>
                        <p className="text-[10px] text-gray-500 font-mono">
                          bucket: article-images
                        </p>
                      </div>
                    </div>
                    <div>
                      {report?.storageReady ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Bucket Ativo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                          <HardDrive className="w-3 h-3" />
                          Otimização Local Ativa
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* AÇÕES E SCRIPT SQL */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">
                      Script SQL Atualizado para o Supabase
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Cria as tabelas em falta, ativa a galeria, vídeos, revista e as 7 maravilhas.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopySql}
                      className="flex items-center gap-1.5 bg-[#d9251d] hover:bg-[#b91e17] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all shadow-xs cursor-pointer active:scale-95"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Código SQL</span>
                        </>
                      )}
                    </button>
                    <a
                      href="https://supabase.com/dashboard"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                      <span>Abrir Supabase</span>
                    </a>
                  </div>
                </div>

                <div className="bg-[#1e1e1e] text-gray-300 rounded-lg p-3 text-[11px] font-mono max-h-32 overflow-y-auto leading-relaxed select-all">
                  <pre>{SUPABASE_SCHEMA_SQL.slice(0, 700)}...</pre>
                </div>

                <ol className="text-[11px] text-gray-600 list-decimal list-inside space-y-1 bg-white p-2.5 rounded-lg border border-gray-100">
                  <li>Clique no botão acima <strong>"Copiar Código SQL"</strong>.</li>
                  <li>No Supabase, vá ao menu lateral <strong>SQL Editor</strong> e clique em <strong>New Query</strong>.</li>
                  <li>Cole o código copiado e clique no botão verde <strong>Run</strong>.</li>
                  <li>Volte aqui e clique em <strong>"Atualizar Estado"</strong> abaixo!</li>
                </ol>
              </div>

              {/* FERRAMENTA DE REPARO DO NAVEGADOR */}
              <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-blue-900">
                      Otimização do Armazenamento do Browser
                    </h5>
                    <p className="text-[11px] text-blue-800/80">
                      Se tiver encontrado erros de quota no passado, clique aqui para desobstruir o localStorage mantendo todos os dados seguros no IndexedDB.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRepairStorage}
                  disabled={repairing}
                  className="flex items-center gap-1.5 bg-white hover:bg-blue-100 text-blue-800 border border-blue-300 text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 transition-colors cursor-pointer"
                >
                  <Wrench className="w-3.5 h-3.5 text-blue-600" />
                  <span>{repairing ? 'A reparar...' : 'Otimizar Armazenamento'}</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-[#f0f0f0] flex items-center justify-between">
          <button
            type="button"
            onClick={runCheck}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#d9251d]' : ''}`} />
            <span>Verificar Novamente</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-white bg-[#111] hover:bg-[#333] px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Fechar Diagnóstico
          </button>
        </div>
      </div>
    </div>
  );
};
