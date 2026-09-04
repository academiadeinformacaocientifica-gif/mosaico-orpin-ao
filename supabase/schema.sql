-- ============================================================================
-- Mosaico Angolano — Esquema do Backend (Supabase)
-- Gestão de Notícias + Gestão de Perfis de Redação
-- ============================================================================
-- Copie e cole este script completo no SQL Editor do seu projecto Supabase e clique em RUN.
-- ============================================================================

-- 1. TABELA DE UTILIZADORES / PERFIS DE ADMINISTRAÇÃO -------------------------
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

create index if not exists admin_users_email_idx on public.admin_users (email);

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

-- Garantir coluna is_published em tabelas existentes
alter table public.articles add column if not exists is_published boolean not null default true;

create index if not exists articles_iso_date_idx on public.articles (iso_date desc);
create index if not exists articles_category_id_idx on public.articles (category_id);

-- 3. PERMISSÕES E SEGURANÇA (RLS) --------------------------------------------

-- Habilitar RLS
alter table public.admin_users enable row level security;
alter table public.articles enable row level security;

-- Políticas para admin_users
drop policy if exists "Permitir leitura de perfis de admin" on public.admin_users;
create policy "Permitir leitura de perfis de admin"
  on public.admin_users for select
  using (true);

drop policy if exists "Permitir registo de novos perfis" on public.admin_users;
create policy "Permitir registo de novos perfis"
  on public.admin_users for insert
  with check (true);

drop policy if exists "Permitir atualização de perfil" on public.admin_users;
create policy "Permitir atualização de perfil"
  on public.admin_users for update
  using (true)
  with check (true);

-- Políticas para articles (acesso total para consulta pública e gestão de redação)
drop policy if exists "Leitura pública de notícias" on public.articles;
create policy "Leitura pública de notícias"
  on public.articles for select
  using (true);

drop policy if exists "Inserção de notícias" on public.articles;
create policy "Inserção de notícias"
  on public.articles for insert
  with check (true);

drop policy if exists "Atualização de notícias" on public.articles;
create policy "Atualização de notícias"
  on public.articles for update
  using (true)
  with check (true);

drop policy if exists "Remoção de notícias" on public.articles;
create policy "Remoção de notícias"
  on public.articles for delete
  using (true);

-- 4. BUCKET DE IMAGENS DAS NOTÍCIAS (STORAGE) --------------------------------
insert into storage.buckets (id, name, public)
values ('article-images', 'article-images', true)
on conflict (id) do nothing;

drop policy if exists "Leitura pública de imagens de notícias" on storage.objects;
create policy "Leitura pública de imagens de notícias"
  on storage.objects for select
  using (bucket_id = 'article-images');

drop policy if exists "Envio de imagens de notícias" on storage.objects;
create policy "Envio de imagens de notícias"
  on storage.objects for insert
  with check (bucket_id = 'article-images');

drop policy if exists "Atualização de imagens de notícias" on storage.objects;
create policy "Atualização de imagens de notícias"
  on storage.objects for update
  using (bucket_id = 'article-images')
  with check (bucket_id = 'article-images');

drop policy if exists "Remoção de imagens de notícias" on storage.objects;
create policy "Remoção de imagens de notícias"
  on storage.objects for delete
  using (bucket_id = 'article-images');

-- 5. TABELA DE IMAGENS DA GALERIA -------------------------------------------
create table if not exists public.gallery_items (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  category       text not null default 'Diplomacia',
  date_label     text not null default '2026',
  description    text not null default '',
  image_url      text not null,
  is_published   boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.gallery_items add column if not exists is_published boolean not null default true;
alter table public.gallery_items enable row level security;

drop policy if exists "Leitura pública de galeria" on public.gallery_items;
create policy "Leitura pública de galeria"
  on public.gallery_items for select
  using (true);

drop policy if exists "Inserção de galeria" on public.gallery_items;
create policy "Inserção de galeria"
  on public.gallery_items for insert
  with check (true);

drop policy if exists "Atualização de galeria" on public.gallery_items;
create policy "Atualização de galeria"
  on public.gallery_items for update
  using (true)
  with check (true);

drop policy if exists "Remoção de galeria" on public.gallery_items;
create policy "Remoção de galeria"
  on public.gallery_items for delete
  using (true);

-- 6. TABELA DE VÍDEOS --------------------------------------------------------
create table if not exists public.video_items (
  id             uuid primary key default gen_random_uuid(),
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

alter table public.video_items add column if not exists is_published boolean not null default true;
alter table public.video_items enable row level security;

drop policy if exists "Leitura pública de vídeos" on public.video_items;
create policy "Leitura pública de vídeos"
  on public.video_items for select
  using (true);

drop policy if exists "Inserção de vídeos" on public.video_items;
create policy "Inserção de vídeos"
  on public.video_items for insert
  with check (true);

drop policy if exists "Atualização de vídeos" on public.video_items;
create policy "Atualização de vídeos"
  on public.video_items for update
  using (true)
  with check (true);

drop policy if exists "Remoção de vídeos" on public.video_items;
create policy "Remoção de vídeos"
  on public.video_items for delete
  using (true);

-- 7. TABELA DE EDIÇÕES DA REVISTA MOSAICO ------------------------------------
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
alter table public.magazine_editions enable row level security;

drop policy if exists "Leitura pública de edições" on public.magazine_editions;
create policy "Leitura pública de edições"
  on public.magazine_editions for select
  using (true);

drop policy if exists "Inserção de edições" on public.magazine_editions;
create policy "Inserção de edições"
  on public.magazine_editions for insert
  with check (true);

drop policy if exists "Atualização de edições" on public.magazine_editions;
create policy "Atualização de edições"
  on public.magazine_editions for update
  using (true)
  with check (true);

drop policy if exists "Remoção de edições" on public.magazine_editions;
create policy "Remoção de edições"
  on public.magazine_editions for delete
  using (true);

create index if not exists idx_magazine_editions_number on public.magazine_editions(edition_number desc);
create index if not exists idx_magazine_editions_published on public.magazine_editions(is_published);

