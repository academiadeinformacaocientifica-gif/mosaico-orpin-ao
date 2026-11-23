# Backend de Gestão de Notícias & Segurança RLS (Supabase)

O portal Mosaico possui uma área reservada de redação (`/admin` ou clicando em **Área Reservada** no rodapé).

A segurança foi blindada com **Row Level Security (RLS)** e o acesso é **exclusivamente restrito a entidades/utilizadores criados previamente no painel central do Supabase Auth**. Não é permitido auto-registo público no frontend.

---

## 1. Executar o Esquema SQL no Supabase

1. Aceda ao seu projeto em **[supabase.com](https://supabase.com)**.
2. No menu lateral esquerdo, clique em **SQL Editor**.
3. Abra o ficheiro [`supabase/schema.sql`](./supabase/schema.sql), copie todo o código, cole no editor do Supabase e clique em **Run**.
   
> **O que o script configura:**
> - A tabela `public.profiles` vinculada com chave estrangeira e trigger automático ao sistema de utilizadores do Supabase (`auth.users`).
> - As tabelas de conteúdos (`articles`, `magazine_editions`, `gallery_items`, `video_items`, `natural_wonders`, `consular_documents`, `cultural_events`, `diplomatic_events`).
> - O bucket de armazenamento `article-images` para upload de multimédia.
> - **Políticas RLS Estritas:**
>   - Leitura pública apenas de conteúdos aprovados e publicados (`is_published = true`).
>   - Inserção, edição e eliminação (`INSERT`, `UPDATE`, `DELETE`) **100% bloqueadas a acessos anónimos** e restritas a utilizadores autenticados com token JWT válido.

---

## 2. Configurar as Variáveis de Ambiente

No seu ficheiro `.env` (ou no painel do cPanel / Vercel / Cloud Run):

```env
VITE_SUPABASE_URL="https://seu-projeto.supabase.co"
VITE_SUPABASE_ANON_KEY="sua-chave-anon-publica"
```

*(Pode obter estes dois valores no Supabase em **Project Settings → API**)*.

---

## 3. Como Criar Utilizadores e Aceder ao Painel de Redação

O acesso ao painel de administração é rigorosamente restrito:

1. No dashboard do seu projeto no **Supabase**, aceda ao menu lateral **Authentication**.
2. Clique na aba **Users** e em seguida no botão **Add user** > **Create user**.
3. Preencha:
   - **Email**: o endereço institucional do operador (ex.: `redacao@mosaico.ao`).
   - **Password**: uma palavra-passe forte (mínimo 6 caracteres).
   - Marque a opção **Auto Confirm User?** (para permitir login imediato sem necessidade de clicar em link de confirmação por e-mail).
   - *(Opcional)* Em **User Metadata**, pode definir o nome do operador:
     ```json
     {
       "name": "Manuel António",
       "role": "Administrador"
     }
     ```
4. Clique em **Create user**.
5. Agora aceda ao portal Mosaico em `/admin`, insira o e-mail e palavra-passe criados no Supabase e clique em **Iniciar Sessão**.

---

## 4. Gestão de Notícias e Conteúdos

Uma vez autenticado no painel `/admin`, terá permissão total para:
- **Artigos & Notícias:** Criar, editar, definir destaques e carrossel, carregar fotos e eliminar notícias.
- **Multimédia:** Enviar fotografias para a Galeria e gerir Vídeos da Embaixada.
- **Revista Mosaico:** Adicionar novas edições em PDF e atualizar capas.
- **7 Maravilhas & Documentos Consulares:** Gerir fichas técnicas e documentos descarregáveis.

---

## 5. Política de Cópias de Segurança e Recuperação de Desastres (Backup & DR)

Para garantir a soberania da informação da Embaixada e a continuidade ininterrupta do serviço:

### A. Cópias de Segurança (Backups)
1. **Soberania e Descarregamento em 1 Clique**:
   - No painel administrativo (`/admin`), clique no botão **Backup & DR**.
   - Clique em **Descarregar Backup JSON** para salvar imediatamente um arquivo consolidado contendo todas as notícias, agendas, galeria, vídeos, edições e dados diplomáticos com assinatura de integridade.
2. **Backups Gerenciados na Nuvem**:
   - O Supabase realiza backups diários automáticos da base de dados PostgreSQL.
   - Os ficheiros enviados para o bucket de armazenamento são replicados de forma redundante em centros de dados certificados.
3. **Regra 3-2-1 Recomendada**:
   - Manter 3 cópias dos dados (Base de dados de produção, cópias automáticas na cloud e ficheiro JSON exportado em suporte físico/seguro da Chancelaria).

### B. Plano de Recuperação de Desastres (DR)
- **RTO (Recovery Time Objective)**: Inferior a 15 minutos.
  - Em caso de falha de código ou frontend na **Vercel**, aceda ao painel de *Deployments* e ative o **Instant Rollback** para a versão anterior em menos de 5 segundos.
- **RPO (Recovery Point Objective)**: Máximo de 24 horas (ou minutos mediante exportação manual antes de grandes alterações).
- **Procedimento de Teste Periódico**:
  - Recomenda-se realizar trimestralmente um teste de descarregamento do backup JSON e conferência dos totais de registos para garantir a integridade dos arquivos históricos.

---

## 6. Monitorização Contínua, Health Check e Alertas 24/7 (UptimeRobot)

Para garantir que a equipa seja notificada no telemóvel ou e-mail de imediato caso ocorra qualquer instabilidade:

1. Aceda a **[uptimerobot.com](https://uptimerobot.com)** (plano gratuito disponível).
2. Clique em **Add New Monitor**:
   - **Monitor Type**: `HTTP(s)`
   - **Friendly Name**: `Mosaico Angola - Portal Oficial`
   - **URL (or IP)**: `https://mosaico.ao/api/health`
   - **Monitoring Interval**: `5 minutes`
   - **Alert Contacts To Notify**: Selecionar os e-mails e números de telemóvel dos responsáveis técnicos.
3. Clique em **Create Monitor**.
4. **Resultado**: Se o portal sofrer qualquer queda, a equipa recebe um alerta automático em menos de 60 segundos com o código de erro, sem esperar que os cidadãos reportem a anomalia.
