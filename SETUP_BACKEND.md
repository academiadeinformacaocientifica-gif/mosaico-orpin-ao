# Backend de Gestão de Notícias — Guia de Configuração (Supabase)

O portal possui uma área reservada (`/admin` ou clicando em **Área Reservada** no rodapé) onde é possível **criar perfil de redação, iniciar sessão e gerir notícias** (criar, editar, remover e enviar fotos) com sincronização em tempo real no Supabase.

---

## 1. Executar o Esquema SQL no Supabase

1. Aceda ao seu projeto em **[supabase.com](https://supabase.com)**.
2. No menu lateral, clique em **SQL Editor**.
3. Abra o ficheiro [`supabase/schema.sql`](./supabase/schema.sql), copie todo o código, cole no editor do Supabase e clique em **Run**.
   
> **O que o script cria:**
> - A tabela `public.admin_users` para armazenamento de contas e perfis de redação (com palavra-passe encriptada).
> - A tabela `public.articles` para as notícias e publicações.
> - O bucket de armazenamento `article-images` para uploads de capas de artigos.
> - Todas as políticas de acesso e segurança (RLS).

---

## 2. Configurar as Variáveis de Ambiente

No seu ficheiro `.env` (ou nas configurações da Vercel / Netlify / Cloud Run):

```env
VITE_SUPABASE_URL="https://seu-projeto.supabase.co"
VITE_SUPABASE_ANON_KEY="sua-chave-anon-publica"
```

*(Pode obter estes dois valores no Supabase em **Project Settings → API**)*.

---

## 3. Como Criar Conta e Aceder

1. Abra o site e vá a `/admin` (ou clique no link **Área Reservada** no rodapé).
2. Na aba **"Criar Perfil"**:
   - Introduza o seu **Nome Completo**.
   - Introduza o seu **E-mail**.
   - Selecione o seu **Cargo / Função** (*Editor, Jornalista, Redator, etc.*).
   - Defina a sua **Palavra-passe** (mínimo 6 caracteres).
   - Clique em **"Criar Perfil e Entrar"**.
3. A conta é guardada diretamente na tabela `admin_users` do Supabase e entra de imediato no painel de administração!
4. Nas próximas visitas, basta utilizar a aba **"Iniciar Sessão"** com o mesmo e-mail e palavra-passe.

---

## 4. Gestão de Notícias

No painel de administração (`/admin`), poderá:
- Clicar em **Nova Notícia** para redigir um artigo, escolher categoria, marcar como destaque/carrossel e anexar imagem.
- **Editar** notícias existentes com pré-visualização.
- **Eliminar** notícias com confirmação instantânea.
- Os artigos publicados ficam imediatamente visíveis na página inicial e nas respetivas secções de categorias do portal.
