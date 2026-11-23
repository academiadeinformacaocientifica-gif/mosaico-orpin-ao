-- ============================================================================
-- Mosaico Angolano — Esquema Completo do Backend & Segurança RLS (Supabase)
-- Notícias + Galeria + Vídeos + Revista + 7 Maravilhas + Documentos + Agendas
-- ============================================================================
-- COPIE E COLE ESTE SCRIPT NO SQL EDITOR DO SEU PROJECTO SUPABASE E CLIQUE EM "RUN".
-- ============================================================================

-- 1. TABELA DE PERFIS DE OPERADORES AUTENTICADOS (Supabase Auth) -------------
-- Utilizadores são criados exclusivamente em: Supabase > Authentication > Users
create table if not exists public.profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  name           text not null,
  email          text not null,
  role           text not null default 'Editor',
  avatar_url     text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Trigger para sincronizar perfil automaticamente quando um operador é criado em auth.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, role, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'role', 'Administrador'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update set
    email = excluded.email,
    updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update on auth.users
  for each row execute procedure public.handle_new_user();

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
create index if not exists articles_iso_date_idx on public.articles (iso_date desc);
create index if not exists articles_category_id_idx on public.articles (category_id);

-- 3. TABELA DE IMAGENS DA GALERIA (Fotos Oficiais) ---------------------------
create table if not exists public.gallery_items (
  id             text primary key,
  title          text not null,
  category       text not null default 'Diplomacia',
  date_label     text not null default '2026',
  description    text not null default '',
  image_url      text not null,
  is_published   boolean not null default true,
  collection     text,
  images         text[],
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

-- 4. TABELA DE VÍDEOS INSTITUCIONAIS E REPORTAGENS ---------------------------
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
create index if not exists idx_magazine_editions_number on public.magazine_editions(edition_number desc);

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
create index if not exists idx_natural_wonders_number on public.natural_wonders(number asc);

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
create index if not exists idx_consular_docs_category on public.consular_documents(category);

-- 8. TABELA DE AGENDA CULTURAL -----------------------------------------------
create table if not exists public.cultural_events (
  id                    text primary key,
  title                 text not null,
  category              text not null default 'Comunidade',
  date_label            text not null,
  time_label            text not null,
  location              text not null,
  city                  text not null default 'Madrid',
  description           text not null default '',
  organizer             text not null default 'Sector Cultural da Embaixada',
  image_url             text,
  registration_required boolean not null default false,
  highlight             boolean not null default false,
  is_published          boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- 9. TABELA DE AGENDA MISSÃO DIPLOMÁTICA ------------------------------------
create table if not exists public.diplomatic_events (
  id                    text primary key,
  title                 text not null,
  category              text not null default 'Diplomacia',
  date_label            text not null,
  time_label            text not null,
  location              text not null,
  city                  text not null default 'Madrid',
  description           text not null default '',
  organizer             text not null default 'Embaixada de Angola',
  image_url             text,
  registration_required boolean not null default false,
  status                text not null default 'Agendado',
  is_published          boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- ============================================================================
-- 10. POLÍTICAS DE SEGURANÇA E ACESSO RÍGIDAS (Row Level Security - RLS)
-- ============================================================================

-- Habilitar RLS em todas as tabelas
alter table public.profiles enable row level security;
alter table public.articles enable row level security;
alter table public.consular_documents enable row level security;
alter table public.gallery_items enable row level security;
alter table public.video_items enable row level security;
alter table public.magazine_editions enable row level security;
alter table public.natural_wonders enable row level security;
alter table public.cultural_events enable row level security;
alter table public.diplomatic_events enable row level security;

-- 10.1 PROFILES (Apenas autenticados)
drop policy if exists "Perfis visíveis apenas por autenticados" on public.profiles;
create policy "Perfis visíveis apenas por autenticados"
  on public.profiles for select
  using (auth.role() = 'authenticated');

drop policy if exists "Utilizadores editam próprio perfil" on public.profiles;
create policy "Utilizadores editam próprio perfil"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 10.2 ARTICLES (Leitura de publicados para todos; escrita exclusiva para autenticados)
drop policy if exists "Leitura pública de notícias" on public.articles;
drop policy if exists "Inserção de notícias" on public.articles;
drop policy if exists "Atualização de notícias" on public.articles;
drop policy if exists "Remoção de notícias" on public.articles;
drop policy if exists "Leitura de notícias publicadas ou por autenticados" on public.articles;
drop policy if exists "Inserção de notícias apenas por autenticados" on public.articles;
drop policy if exists "Atualização de notícias apenas por autenticados" on public.articles;
drop policy if exists "Remoção de notícias apenas por autenticados" on public.articles;

create policy "Leitura de notícias publicadas ou por autenticados"
  on public.articles for select
  using (is_published = true or auth.role() = 'authenticated');

create policy "Inserção de notícias apenas por autenticados"
  on public.articles for insert
  with check (auth.role() = 'authenticated');

create policy "Atualização de notícias apenas por autenticados"
  on public.articles for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Remoção de notícias apenas por autenticados"
  on public.articles for delete
  using (auth.role() = 'authenticated');

-- 10.3 GALLERY_ITEMS
drop policy if exists "Leitura pública de galeria" on public.gallery_items;
drop policy if exists "Inserção de galeria" on public.gallery_items;
drop policy if exists "Atualização de galeria" on public.gallery_items;
drop policy if exists "Remoção de galeria" on public.gallery_items;
drop policy if exists "Leitura de galeria publicada ou por autenticados" on public.gallery_items;
drop policy if exists "Inserção de galeria apenas por autenticados" on public.gallery_items;
drop policy if exists "Atualização de galeria apenas por autenticados" on public.gallery_items;
drop policy if exists "Remoção de galeria apenas por autenticados" on public.gallery_items;

create policy "Leitura de galeria publicada ou por autenticados"
  on public.gallery_items for select
  using (is_published = true or auth.role() = 'authenticated');

create policy "Inserção de galeria apenas por autenticados"
  on public.gallery_items for insert
  with check (auth.role() = 'authenticated');

create policy "Atualização de galeria apenas por autenticados"
  on public.gallery_items for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Remoção de galeria apenas por autenticados"
  on public.gallery_items for delete
  using (auth.role() = 'authenticated');

-- 10.4 VIDEO_ITEMS
drop policy if exists "Leitura pública de vídeos" on public.video_items;
drop policy if exists "Inserção de vídeos" on public.video_items;
drop policy if exists "Atualização de vídeos" on public.video_items;
drop policy if exists "Remoção de vídeos" on public.video_items;
drop policy if exists "Leitura de vídeos publicados ou por autenticados" on public.video_items;
drop policy if exists "Inserção de vídeos apenas por autenticados" on public.video_items;
drop policy if exists "Atualização de vídeos apenas por autenticados" on public.video_items;
drop policy if exists "Remoção de vídeos apenas por autenticados" on public.video_items;

create policy "Leitura de vídeos publicados ou por autenticados"
  on public.video_items for select
  using (is_published = true or auth.role() = 'authenticated');

create policy "Inserção de vídeos apenas por autenticados"
  on public.video_items for insert
  with check (auth.role() = 'authenticated');

create policy "Atualização de vídeos apenas por autenticados"
  on public.video_items for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Remoção de vídeos apenas por autenticados"
  on public.video_items for delete
  using (auth.role() = 'authenticated');

-- 10.5 MAGAZINE_EDITIONS
drop policy if exists "Leitura pública de edições" on public.magazine_editions;
drop policy if exists "Inserção de edições" on public.magazine_editions;
drop policy if exists "Atualização de edições" on public.magazine_editions;
drop policy if exists "Remoção de edições" on public.magazine_editions;
drop policy if exists "Leitura de edições publicadas ou por autenticados" on public.magazine_editions;
drop policy if exists "Inserção de edições apenas por autenticados" on public.magazine_editions;
drop policy if exists "Atualização de edições apenas por autenticados" on public.magazine_editions;
drop policy if exists "Remoção de edições apenas por autenticados" on public.magazine_editions;

create policy "Leitura de edições publicadas ou por autenticados"
  on public.magazine_editions for select
  using (is_published = true or auth.role() = 'authenticated');

create policy "Inserção de edições apenas por autenticados"
  on public.magazine_editions for insert
  with check (auth.role() = 'authenticated');

create policy "Atualização de edições apenas por autenticados"
  on public.magazine_editions for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Remoção de edições apenas por autenticados"
  on public.magazine_editions for delete
  using (auth.role() = 'authenticated');

-- 10.6 NATURAL_WONDERS
drop policy if exists "Leitura pública de maravilhas" on public.natural_wonders;
drop policy if exists "Inserção de maravilhas" on public.natural_wonders;
drop policy if exists "Atualização de maravilhas" on public.natural_wonders;
drop policy if exists "Remoção de maravilhas" on public.natural_wonders;
drop policy if exists "Leitura de maravilhas publicadas ou por autenticados" on public.natural_wonders;
drop policy if exists "Inserção de maravilhas apenas por autenticados" on public.natural_wonders;
drop policy if exists "Atualização de maravilhas apenas por autenticados" on public.natural_wonders;
drop policy if exists "Remoção de maravilhas apenas por autenticados" on public.natural_wonders;

create policy "Leitura de maravilhas publicadas ou por autenticados"
  on public.natural_wonders for select
  using (is_published = true or auth.role() = 'authenticated');

create policy "Inserção de maravilhas apenas por autenticados"
  on public.natural_wonders for insert
  with check (auth.role() = 'authenticated');

create policy "Atualização de maravilhas apenas por autenticados"
  on public.natural_wonders for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Remoção de maravilhas apenas por autenticados"
  on public.natural_wonders for delete
  using (auth.role() = 'authenticated');

-- 10.7 CONSULAR_DOCUMENTS
drop policy if exists "Leitura pública de documentos consulares" on public.consular_documents;
drop policy if exists "Inserção de documentos consulares" on public.consular_documents;
drop policy if exists "Atualização de documentos consulares" on public.consular_documents;
drop policy if exists "Remoção de documentos consulares" on public.consular_documents;
drop policy if exists "Leitura de docs consulares publicados ou por autenticados" on public.consular_documents;
drop policy if exists "Inserção de docs consulares apenas por autenticados" on public.consular_documents;
drop policy if exists "Atualização de docs consulares apenas por autenticados" on public.consular_documents;
drop policy if exists "Remoção de docs consulares apenas por autenticados" on public.consular_documents;

create policy "Leitura de docs consulares publicados ou por autenticados"
  on public.consular_documents for select
  using (is_published = true or auth.role() = 'authenticated');

create policy "Inserção de docs consulares apenas por autenticados"
  on public.consular_documents for insert
  with check (auth.role() = 'authenticated');

create policy "Atualização de docs consulares apenas por autenticados"
  on public.consular_documents for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Remoção de docs consulares apenas por autenticados"
  on public.consular_documents for delete
  using (auth.role() = 'authenticated');

-- 10.8 CULTURAL_EVENTS
drop policy if exists "Leitura pública de eventos culturais" on public.cultural_events;
drop policy if exists "Inserção de eventos culturais" on public.cultural_events;
drop policy if exists "Atualização de eventos culturais" on public.cultural_events;
drop policy if exists "Remoção de eventos culturais" on public.cultural_events;
drop policy if exists "Leitura de eventos culturais publicados ou por autenticados" on public.cultural_events;
drop policy if exists "Inserção de eventos culturais apenas por autenticados" on public.cultural_events;
drop policy if exists "Atualização de eventos culturais apenas por autenticados" on public.cultural_events;
drop policy if exists "Remoção de eventos culturais apenas por autenticados" on public.cultural_events;

create policy "Leitura de eventos culturais publicados ou por autenticados"
  on public.cultural_events for select
  using (is_published = true or auth.role() = 'authenticated');

create policy "Inserção de eventos culturais apenas por autenticados"
  on public.cultural_events for insert
  with check (auth.role() = 'authenticated');

create policy "Atualização de eventos culturais apenas por autenticados"
  on public.cultural_events for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Remoção de eventos culturais apenas por autenticados"
  on public.cultural_events for delete
  using (auth.role() = 'authenticated');

-- 10.9 DIPLOMATIC_EVENTS
drop policy if exists "Leitura pública de agenda diplomática" on public.diplomatic_events;
drop policy if exists "Inserção de agenda diplomática" on public.diplomatic_events;
drop policy if exists "Atualização de agenda diplomática" on public.diplomatic_events;
drop policy if exists "Remoção de agenda diplomática" on public.diplomatic_events;
drop policy if exists "Leitura de agenda diplomática publicada ou por autenticados" on public.diplomatic_events;
drop policy if exists "Inserção de agenda diplomática apenas por autenticados" on public.diplomatic_events;
drop policy if exists "Atualização de agenda diplomática apenas por autenticados" on public.diplomatic_events;
drop policy if exists "Remoção de agenda diplomática apenas por autenticados" on public.diplomatic_events;

create policy "Leitura de agenda diplomática publicada ou por autenticados"
  on public.diplomatic_events for select
  using (is_published = true or auth.role() = 'authenticated');

create policy "Inserção de agenda diplomática apenas por autenticados"
  on public.diplomatic_events for insert
  with check (auth.role() = 'authenticated');

create policy "Atualização de agenda diplomática apenas por autenticados"
  on public.diplomatic_events for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Remoção de agenda diplomática apenas por autenticados"
  on public.diplomatic_events for delete
  using (auth.role() = 'authenticated');

-- ============================================================================
-- 11. STORAGE / BUCKET DE IMAGENS E MULTIMÉDIA COM RLS RESTRITO
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('article-images', 'article-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Leitura pública de imagens de notícias" on storage.objects;
drop policy if exists "Envio de imagens de notícias" on storage.objects;
drop policy if exists "Atualização de imagens de notícias" on storage.objects;
drop policy if exists "Remoção de imagens de notícias" on storage.objects;
drop policy if exists "Leitura pública de imagens" on storage.objects;
drop policy if exists "Envio de imagens apenas por autenticados" on storage.objects;
drop policy if exists "Atualização de imagens apenas por autenticados" on storage.objects;
drop policy if exists "Remoção de imagens apenas por autenticados" on storage.objects;

create policy "Leitura pública de imagens"
  on storage.objects for select
  using (bucket_id = 'article-images');

create policy "Envio de imagens apenas por autenticados"
  on storage.objects for insert
  with check (bucket_id = 'article-images' and auth.role() = 'authenticated');

create policy "Atualização de imagens apenas por autenticados"
  on storage.objects for update
  using (bucket_id = 'article-images' and auth.role() = 'authenticated')
  with check (bucket_id = 'article-images' and auth.role() = 'authenticated');

create policy "Remoção de imagens apenas por autenticados"
  on storage.objects for delete
  using (bucket_id = 'article-images' and auth.role() = 'authenticated');
