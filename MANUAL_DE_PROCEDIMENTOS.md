# MANUAL DE PROCEDIMENTOS E DOCUMENTAÇÃO OFICIAL DA PLATAFORMA
## MOSAICO ANGOLA — REVISTA OFICIAL & PORTAL DIPLOMÁTICO
### Embaixada da República de Angola no Reino de Espanha e Principado de Andorra
**Versão:** 1.0.0  
**Classificação:** Uso Institucional, Operacional e Técnico  
**Data de Emissão:** 2026  

---

## ÍNDICE GERAL

1. [Identidade, Missão e Objectivos Estratégicos](#1-identidade-missão-e-objectivos-estratégicos)
2. [Arquitectura de Software e Infraestrutura Tecnológica](#2-arquitectura-de-software-e-infraestrutura-tecnológica)
3. [Mapeamento Completo de Páginas e Rotas](#3-mapeamento-completo-de-páginas-e-rotas)
4. [Manual de Procedimentos da Área Reservada de Redacção (/admin)](#4-manual-de-procedimentos-da-área-reservada-de-redacção-admin)
   - 4.1. [Autenticação e Acesso Seguro](#41-autenticação-e-acesso-seguro)
   - 4.2. [Gestão Editorial de Artigos e Notícias](#42-gestão-editorial-de-artigos-e-notícias)
   - 4.3. [Gestão das Edições da Revista (PDF/Digital)](#43-gestão-das-edições-da-revista-pdfdigital)
   - 4.4. [Gestão de Serviços e Documentos Consulares](#44-gestão-de-serviços-e-documentos-consulares)
   - 4.5. [Gestão de Agendas (Cultural e Diplomática)](#45-gestão-de-agendas-cultural-e-diplomática)
   - 4.6. [Gestão de Multimédia (Galeria e Vídeos Oficiais)](#46-gestão-de-multimédia-galeria-e-vídeos-oficiais)
5. [Nível de Segurança e Recursos de Blindagem Cibernética](#5-nível-de-segurança-e-recursos-de-blindagem-cibernética)
   - 5.1. [Row Level Security (RLS) no PostgreSQL](#51-row-level-security-rls-no-postgresql)
   - 5.2. [Cabeçalhos HTTP de Segurança Máxima (Vercel Edge)](#52-cabeçalhos-http-de-segurança-máxima-vercel-edge)
   - 5.3. [Sanitização Anti-XSS e Protecção de Entradas](#53-sanitização-anti-xss-e-protecção-de-entradas)
   - 5.4. [Rate Limiting (Protecção Contra Ataques de Força Bruta)](#54-rate-limiting-protecção-contra-ataques-de-força-bruta)
   - 5.5. [Ficheiro de Divulgação de Segurança (RFC 9116) e Anti-Scraping](#55-ficheiro-de-divulgação-de-segurança-rfc-9116-e-anti-scraping)
6. [Plano de Recuperação de Desastres (DR) e Continuidade de Negócio](#6-plano-de-recuperação-de-desastres-dr-e-continuidade-de-negócio)
   - 6.1. [Métricas de Recuperação (RTO e RPO)](#61-métricas-de-recuperação-rto-e-rpo)
   - 6.2. [Cenários de Contingência e Procedimento Operacional](#62-cenários-de-contingência-e-procedimento-operacional)
7. [Política de Cópias de Segurança (Backups) e Soberania de Dados](#7-política-de-cópias-de-segurança-backups-e-soberania-de-dados)
   - 7.1. [Soberania de Dados e Descarregamento JSON com 1 Clique](#71-soberania-de-dados-e-descarregamento-json-com-1-clique)
   - 7.2. [Backups Diários Automatizados na Nuvem](#72-backups-diários-automatizados-na-nuvem)
   - 7.3. [Regra 3-2-1 Recomendada](#73-regra-3-2-1-recomendada)
8. [Monitorização Contínua 24/7 e Auditoria de Segurança](#8-monitorização-contínua-247-e-auditoria-de-segurança)
   - 8.1. [Endpoint de Saúde (/api/health) e UptimeRobot](#81-endpoint-de-saúde-apihealth-e-uptimerobot)
   - 8.2. [Sistema de Auditoria e Higienização de Logs (Lei n.º 22/11 de Angola)](#82-sistema-de-auditoria-e-higienização-de-logs-lei-nº-2211-de-angola)
9. [Desempenho e Adaptação à Conectividade em Angola](#9-desempenho-e-adaptação-à-conectividade-em-angola)
10. [Conformidade Legal com a Protecção de Dados Pessoais](#10-conformidade-legal-com-a-protecção-de-dados-pessoais)

---

## 1. Identidade, Missão e Objectivos Estratégicos

### 1.1. O Que É a Plataforma
O **Mosaico Angola** é a publicação editorial oficial e portal de difusão diplomática da **Embaixada da República de Angola no Reino de Espanha e Principado de Andorra**. A plataforma serve como o principal canal de comunicação digital e institucional da missão diplomática, disponibilizando informações verificadas sobre relações bilaterais, assistência consular, eventos culturais, património nacional e oportunidades económicas.

### 1.2. Missão
Fortalecer a imagem de Angola no espaço ibérico e internacional, promovendo a cooperação política, económica e cultural, e prestando assistência informativa rigorosa, acessível e segura a todos os cidadãos angolanos e público em geral.

### 1.3. Objectivos Estratégicos
- **Soberania da Informação**: Garantir que as notícias e comunicações oficiais da Embaixada são difundidas sem distorções nem dependência de intermediários.
- **Transparência Consular**: Facilitar o acesso a formulários, tabelas de emolumentos, requisitos de vistos e avisos oficiais aos cidadãos.
- **Divulgação do Património Nacional**: Promover a cultura angolana e as 7 Maravilhas de Angola enquanto destinos de excelência turística e patrimonial.
- **Segurança e Privacidade dos Dados**: Proteger os dados de contacto e consultas dos cidadãos em conformidade rigorosa com a legislação da República de Angola e convenções internacionais.

---

## 2. Arquitectura de Software e Infraestrutura Tecnológica

A plataforma adota padrões de engenharia de software modernos, combinando uma camada de apresentação rápida e responsiva com serviços de computação em nuvem distribuídos:

```
[ Visitante / Cidadão / Redator ]
               │
               ▼ (HTTPS / TLS 1.3)
    ┌───────────────────────┐
    │    Vercel Anycast     │ ──► Headers HSTS, CSP, COOP, Cache Imutável
    │       Edge CDN        │ ──► Serverless: /api/noticia (OG Tags)
    └───────────────────────┘ ──► Serverless: /api/health (Uptime Monitor)
               │
               ▼
    ┌───────────────────────┐
    │  React 19 SPA + Vite  │ ──► Single Page Application ultra-rápida
    │   Tailwind CSS v4     │ ──► Roteamento limpo /noticia/:id
    │  networkAdaptive.ts   │ ──► Poupança de dados para redes lentas
    └───────────────────────┘
               │ (Tokens JWT / SSL)
               ▼
    ┌───────────────────────┐
    │     Supabase Cloud    │ ──► Base de Dados PostgreSQL 15+
    │    (B-Tree Indexes)   │ ──► Row Level Security (RLS) Estrito
    │   Supabase Auth / RLS │ ──► Bucket 'article-images' (Storage)
    └───────────────────────┘
```

- **Frontend**: Single Page Application (SPA) desenvolvida em React 19, TypeScript e Vite.
- **Estilização**: Tailwind CSS com paleta de identidade institucional da República de Angola (Rubro diplomático `#d9251d`, amarelo-âmbar, preto e branco).
- **Roteamento Híbrido**: React Router DOM (v7) com URLs limpos e partilháveis (`/noticia/:id`), permitindo partilhas com pré-visualização enriquecida no WhatsApp, Facebook, LinkedIn, Twitter e Telegram.
- **Camada Serverless**: Vercel Serverless Functions para manipulação de metatags dinâmicas e sondagem de disponibilidade.
- **Base de Dados e Autenticação**: Supabase gerenciado com PostgreSQL 15+, autenticação de operadores por tokens JWT com encriptação e regras de segurança de nível de linha (*Row Level Security*).

---

## 3. Mapeamento Completo de Páginas e Rotas

| Rota | Nome da Página | Conteúdo e Finalidade |
| :--- | :--- | :--- |
| `/` ou `/home` | **Página Inicial** | Destaques da actualidade, carrossel dinâmico, ticker de manchetes, secção bilateral Angola-Espanha e atalhos rápidos. |
| `/noticia/:id` | **Artigo Completo** | Notícia individual com leitura integral, galeria do artigo, botões de partilha social, comentários moderados e artigos recomendados. |
| `/politica` | **Política & Diplomacia** | Acordos bilaterais, audiências de Estado, cimeiras e comunicados oficiais da diplomacia angolana. |
| `/economia` | **Economia & Negócios** | Fóruns empresariais, recursos minerais, Corredor do Lobito, energias renováveis e investimento estrangeiro. |
| `/panorama-consular` | **Panorama Consular** | Informações sobre vistos, passaportes, registos civis, legalizações e formulários descarregáveis. |
| `/kultura-360` | **Kultura 360** | Artes plásticas, exposições, dança tradicional, literatura, gastronomia e música de Angola. |
| `/turismo` | **Turismo** | Roteiros turísticos pelas 18 províncias, parques nacionais e guias de viagem. |
| `/maravilhas` | **7 Maravilhas de Angola** | Guia das 7 Maravilhas Naturais eleitas com fichas técnicas, fotografias e valorização do património ambiental. |
| `/edicoes` | **Revista Mosaico Digital** | Arquivo histórico de todas as edições em PDF da Revista Mosaico Angola, com leitor interativo incorporado. |
| `/galeria` | **Galeria de Imagens** | Acervo fotográfico oficial em alta resolução, organizado por datas e missões diplomáticas. |
| `/videos` | **Vídeos Oficiais** | Reportagens em vídeo, discursos, solenidades e conferências da Embaixada. |
| `/agenda-cultural` | **Agenda Cultural** | Calendário de comemorações, exposições e actividades culturais em Espanha e Andorra. |
| `/agenda-diplomatica` | **Agenda Diplomática** | Calendário institucional de missões diplomáticas, visitas bilaterais e missões consulares itinerantes. |
| `/history` | **História Bilateral** | Cronologia detalhada da cooperação de amizade entre Angola e Espanha desde 1975 até à atualidade. |
| `/sobre` | **Sobre a Chancelaria** | Morada oficial, contactos telefónicos de urgência, equipa diplomática e formulário de mensagem seguro. |
| `/favoritos` | **Artigos Guardados** | Coleção pessoal de artigos favoritados pelo utilizador para leitura diferida. |
| `/admin` | **Área Reservada** | Painel restrito de redacção e administração de conteúdos (requer autenticação prévia). |

---

## 4. Manual de Procedimentos da Área Reservada de Redacção (/admin)

### 4.1. Autenticação e Acesso Seguro
1. O acesso à Área Reservada é estritamente individual e restrito aos membros credenciados da equipa editorial da Embaixada.
2. Não existe auto-registo público no portal. Os novos operadores devem ser criados previamente pelo Administrador de TI no painel central do Supabase (`Authentication > Users > Add User`).
3. Para iniciar sessão, aceda a `/admin` ou clique em **Área Reservada** no rodapé do portal. Introduza o e-mail institucional e a palavra-passe correspondente.
4. Qualquer tentativa de login incorreta é registada no sistema de auditoria para prevenção de acessos indevidos.

### 4.2. Gestão Editorial de Artigos e Notícias
- **Criar Notícia**:
  1. No painel `/admin`, clique no botão **"+ Nova Notícia"** no menu lateral esquerdo.
  2. Preencha o **Título**, a **Categoria Temática** (Política, Economia, Cultura, etc.) e o **Subtítulo**.
  3. Insira o texto do artigo. Pode utilizar parágrafos separados para uma diagramação limpa e profissional.
  4. Adicione o URL da imagem de capa (ou utilize o carregamento direto).
  5. Se a notícia for de extrema relevância institucional, marque a opção **"Destaque no Carrossel Principal"** para que apareça nos slides da página inicial.
  6. Defina o estado como **"Publicado"** para visibilidade pública imediata ou mantenha desmarcado para guardar como **"Rascunho"**.
- **Editar ou Eliminar Notícia**:
  - Na lista de notícias, utilize o ícone de lápis para editar o conteúdo ou o ícone de cesto de lixo para eliminar (requer confirmação expressa).

### 4.3. Gestão das Edições da Revista (PDF/Digital)
1. No menu lateral, aceda à secção **"Revista Mosaico"** e clique em **"+ Nova Edição"**.
2. Indique o **Número da Edição**, o **Título Temático**, o **Período** (ex.: "Janeiro - Março 2026") e o **Ano**.
3. Adicione a imagem de alta qualidade da capa da revista e o link/ficheiro PDF correspondente.
4. Clique em **Guardar Edição**. A edição ficará imediatamente disponível para leitura pública em `/edicoes`.

### 4.4. Gestão de Serviços e Documentos Consulares
1. Na secção **"Documentos Consulares"**, clique em **"+ Novo Documento"**.
2. Selecione a categoria (ex.: *Vistos*, *Registo Civil*, *Notariado*, *Passaportes*).
3. Preencha a descrição, instruções passo a passo, requisitos documentais exigidos e anexe o formulário descarregável em formato PDF.
4. Ao publicar, o cidadão poderá descarregar o documento oficial diretamente no portal.

### 4.5. Gestão de Agendas (Cultural e Diplomática)
1. Selecione a aba **Agenda Cultural** ou **Agenda Diplomática**.
2. Clique no botão de criação, defina a **Data do Evento**, a **Hora**, o **Local** (ex.: Madrid, Barcelona, Andorra), o **Organizador** e a descrição do ato diplomático ou cultural.
3. Marque se o evento requer inscrição prévia por parte do público.

### 4.6. Gestão de Multimédia (Galeria e Vídeos Oficiais)
- **Galeria de Fotos**: Permite o envio de fotografias oficiais em alta resolução, com título, data e identificação da missão diplomática.
- **Vídeos Oficiais**: Permite a publicação de reportagens e solenidades em vídeo, com indicação do orador, tempo de duração e descrição.

---

## 5. Nível de Segurança e Recursos de Blindagem Cibernética

A segurança da plataforma foi desenhada segundo o princípio de **Defesa em Profundidade (*Defense in Depth*)**:

### 5.1. Row Level Security (RLS) no PostgreSQL
- **100% das tabelas da base de dados** têm o RLS ativado permanentemente.
- **Políticas de Leitura (`SELECT`)**: O público em geral só consegue ler registos marcados como publicados (`is_published = true`).
- **Políticas de Escrita (`INSERT`, `UPDATE`, `DELETE`)**: Totalmente vedadas a pedidos anónimos. Qualquer tentativa de alteração sem um token JWT criptografado emitido pelo Supabase Auth é rejeitada pelo motor PostgreSQL com erro `401/403 Unauthorized`.

### 5.2. Cabeçalhos HTTP de Segurança Máxima (Vercel Edge)
Todas as respostas web são enviadas com cabeçalhos de segurança estritos:
- `Content-Security-Policy`: Restringe a execução de scripts e carregamento de recursos exclusivamente a origens autorizadas.
- `Strict-Transport-Security (HSTS)`: `max-age=63072000; includeSubDomains; preload`, obrigando todos os navegadores a utilizar encriptação TLS moderna (HTTPS).
- `X-Frame-Options: SAMEORIGIN`: Proteção contra ataques de sequestro de clique (*Clickjacking*), impedindo a incorporação do portal em páginas de terceiros.
- `Cross-Origin-Opener-Policy (COOP): same-origin`: Isola o processo de navegação contra fugas de dados entre separadores.
- `X-Content-Type-Options: nosniff`: Impede que os ficheiros sejam interpretados com tipos MIME falsos.

### 5.3. Sanitização Anti-XSS e Protecção de Entradas
- Todas as entradas introduzidas por utilizadores (pesquisas, subscrição de boletins, comentários e formulários de contacto) são higienizadas através do módulo `sanitizer.ts`, eliminando tags de script maliciosas e caracteres de injeção HTML.

### 5.4. Rate Limiting (Protecção Contra Ataques de Força Bruta)
- O módulo `rateLimiter.ts` implementa janelas deslizantes de controlo de frequência no cliente e no servidor.
- Tentativas excessivas de envio em formulários ou tentativas de autenticação incorretas são temporariamente bloqueadas, prevenindo ataques de dicionário ou sobrecarga de recursos.

### 5.5. Ficheiro de Divulgação de Segurança (RFC 9116) e Anti-Scraping
- O portal disponibiliza publicamente `/public/.well-known/security.txt`, em conformidade com o padrão internacional **RFC 9116**, estabelecendo o canal oficial de reporte responsável de incidentes (`seguranca@mosaico.ao`).
- O ficheiro `/public/robots.txt` proíbe expressamente a indexação de motores de busca na directoria administrativa (`Disallow: /admin`), protegendo a consola de gestão.

---

## 6. Plano de Recuperação de Desastres (DR) e Continuidade de Negócio

Para assegurar que o portal institucional nunca sofra interrupções prolongadas, está em vigor o seguinte protocolo:

### 6.1. Métricas de Recuperação (RTO e RPO)
- **RTO (Recovery Time Objective / Tempo Máximo de Recuperação)**: **< 15 Minutos**.
  - Em caso de falha de código no frontend ou build na Vercel, o tempo de restauração através de *Instant Rollback* é inferior a **5 segundos**.
- **RPO (Recovery Point Objective / Ponto Máximo de Perda de Dados)**: **< 24 Horas** (ou minutos mediante exportação manual prévia).

### 6.2. Cenários de Contingência e Procedimento Operacional

| Cenário de Incidente | Causa Potencial | Procedimento Operacional de Resolução | Tempo Estimado |
| :--- | :--- | :--- | :--- |
| **Falha de Frontend / Código** | Erro de compilação ou script na Vercel. | Aceder ao painel Vercel em *Deployments*, selecionar a versão anterior estável e clicar em **Instant Rollback**. | < 5 segundos |
| **Corrupção de Dados no Supabase** | Eliminação acidental por operador ou falha de base de dados. | No painel do Supabase, aceder a *Database > Backups* e restaurar o snapshot automático, ou importar o último ficheiro JSON de backup. | < 10 minutos |
| **Queda do Fornecedor de Nuvem** | Indisponibilidade global da região de servidores. | Redirecionamento de DNS para a réplica secundária com reexecução do script `supabase/schema.sql`. | < 30 minutos |

---

## 7. Política de Cópias de Segurança (Backups) e Soberania de Dados

### 7.1. Soberania de Dados e Descarregamento JSON com 1 Clique
1. O painel administrativo possui um botão dedicado **"Backup & DR"**.
2. Ao clicar em **"Descarregar Backup JSON"**, o sistema compila instantaneamente todos os dados do portal num único ficheiro `.json`:
   - Todas as notícias e artigos completos.
   - Acervo completo da Galeria de Fotos e Vídeos.
   - Todas as edições e temas da Revista Mosaico.
   - Fichas técnicas das 7 Maravilhas de Angola.
   - Documentos e avisos consulares.
   - Agendas Cultural e Diplomática.
   - Informações e contactos institucionais da Embaixada.
3. O ficheiro é assinado com um *checksum* criptográfico para validação de integridade.

### 7.2. Backups Diários Automatizados na Nuvem
- O Supabase efetua cópias de segurança diárias automatizadas da base de dados PostgreSQL com replicação geográfica multi-zona.
- Os ficheiros multimédia enviados para o bucket de armazenamento são guardados em armazenamento redundante.

### 7.3. Regra 3-2-1 Recomendada
Recomenda-se que a equipa da Chancelaria siga o padrão internacional 3-2-1:
- **3 Cópias dos Dados**: Base de dados de produção, cópias automáticas na cloud e cópia em ficheiro JSON exportado.
- **2 Suportes Distintos**: Armazenamento na nuvem e suporte de armazenamento local seguro da Chancelaria.
- **1 Cópia Externa**: Manter um backup JSON seguro fora do ambiente principal de produção antes de grandes eventos institucionais.

---

## 8. Monitorização Contínua 24/7 e Auditoria de Segurança

### 8.1. Endpoint de Saúde (/api/health) e UptimeRobot
A aplicação disponibiliza a rota serverless `/api/health`, que responde com o estado operacional, carimbo de data/hora ISO e tempo de atividade da infraestrutura.

**Como Ativar a Monitorização Gratuita 24/7:**
1. Aceda a [uptimerobot.com](https://uptimerobot.com) e crie uma conta gratuita.
2. Clique em **Add New Monitor**:
   - **Tipo de Monitor**: `HTTP(s)`
   - **Nome**: `Mosaico Angola - Portal Oficial`
   - **URL**: `https://mosaico.ao/api/health`
   - **Intervalo de Sondagem**: `5 minutos`
   - **Contactos de Alerta**: Inserir e-mails e números de telemóvel dos responsáveis técnicos.
3. Se o portal sofrer qualquer interrupção, a equipa recebe um alerta automático em menos de 60 segundos com o código de diagnóstico.

### 8.2. Sistema de Auditoria e Higienização de Logs (Lei n.º 22/11 de Angola)
O sistema integra um serviço de auditoria operacional (`auditLogger.ts`):
- Regista eventos críticos: inícios de sessão bem-sucedidos, tentativas falhadas, transferências de cópias de segurança e alterações de dados.
- **Conformidade Estrita com a Lei n.º 22/11 de Angola**: Palavras-passe, senhas e chaves criptográficas são **100% omitidas e expurgadas** antes da gravação de qualquer log, garantindo que nenhum dado confidencial é exposto.
- Os operadores podem consultar o histórico de auditoria em tempo real no painel administrativo no separador **"Auditoria & Logs"**.

---

## 9. Desempenho e Adaptação à Conectividade em Angola

Para assegurar uma experiência fluida aos leitores que acedem a partir de Angola através de redes móveis (3G/4G) ou com tarifários de dados limitados:
1. **Pré-conexão DNS e TLS (`index.html`)**: Diretivas `preconnect` e `dns-prefetch` para Google Fonts e Supabase, eliminando o atraso de múltiplos apertos de mão (*handshakes*) e poupando até 400ms na ligação inicial.
2. **Índices B-Tree Compostos no PostgreSQL**: Consultas públicas filtradas por `(is_published, iso_date desc)` e `(is_published, category_id, iso_date desc)`, garantindo tempos de carregamento inferiores a 10 milissegundos mesmo sob elevado tráfego.
3. **Mecanismo Adaptativo de Rede (`networkAdaptive.ts`)**: Suporte ao modo de "Poupança de Dados" (*Save-Data*) dos smartphones e deteção de redes lentas (2G/3G) para privilegiar o carregamento diferido (*lazy loading*) de imagens e poupar bateria e saldo de dados.

---

## 10. Conformidade Legal com a Protecção de Dados Pessoais

- **Política de Privacidade e Termos Legais (`PrivacyModal.tsx`)**: Modal institucional acessível permanentemente no rodapé do portal, informando com total transparência o responsável pelo tratamento dos dados (Embaixada de Angola em Madrid), a finalidade das comunicações e o canal para exercício dos direitos de acesso, rectificação e eliminação.
- **Consentimento em Formulários**: Caixas de seleção de aceitação expressa nos formulários de subscrição de boletins informativos e mensagens de contacto.
- **Ausência de Cookies de Terceiros**: A plataforma utiliza apenas armazenamento local técnico estritamente necessário à navegação e sessão dos operadores, não recorrendo a rastreadores de publicidade de terceiros.

---

*Manual aprovado para preservação de conhecimento, suporte operacional da Chancelaria e auditoria técnica da plataforma Mosaico Angola.*
