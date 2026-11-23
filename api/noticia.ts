/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface ServerlessRequest {
  query: Record<string, string | string[] | undefined>;
  headers: Record<string, string | string[] | undefined>;
}

interface ServerlessResponse {
  setHeader(name: string, value: string): this;
  status(code: number): this;
  send(body: any): this;
}

// Mapa de salvaguarda com artigos pré-instalados e as suas imagens públicas estáticas
const FALLBACK_ARTICLES: Record<
  string,
  { title: string; description: string; imageUrl: string; category?: string }
> = {
  'art-cooperacao-bilateral-angola-espanha-2026': {
    title: 'Angola e Espanha reforçam cooperação bilateral e parceria estratégica em Madrid',
    description:
      'Reunião de Consultas Políticas ao nível de Secretários de Estado aprofunda laços diplomáticos, investimentos estruturantes em energias renováveis e Corredor do Lobito.',
    imageUrl: '/images/Angola%20e%20Espanha%20refor%C3%A7am%20coopera%C3%A7%C3%A3o%20bilateral.jpeg',
    category: 'Politica',
  },
  'art-onu-turismo-madrid-2026': {
    title: 'Angola e ONU Turismo Reforçam Cooperação Estratégica em Madrid',
    description:
      'A Embaixadora Balbina Malheiros Dias da Silva apresentou cartas credenciais à Secretária-Geral da ONU Turismo, Shaikha Nasser Al Nowais.',
    imageUrl: '/images/onu_turismo_madrid_1787497879619.jpg.jpeg',
    category: 'Turismo',
  },
  'art-imex-barcelona-2026': {
    title: 'Angola Reafirma Posicionamento Estratégico na IMEX Barcelona 2026',
    description:
      'Com mais de 280 reuniões bilaterais com 31 países e articulação com a Foment del Treball Nacional, país consolida-se como destino prioritário.',
    imageUrl: '/images/imex_barcelona_angola_1787497730037.jpg.jpeg',
    category: 'Economia',
  },
  'art-vity-claude-nsalambi-uia': {
    title:
      'Liderança Global: Bastonário Vity Claude Nsalambi alcança reconhecimento histórico no Congresso Mundial da UIA em Barcelona',
    description:
      'O Bastonário da Ordem dos Arquitectos de Angola conquistou o segundo maior número de votos a nível mundial para a Presidência da UIA na Sagrada Família.',
    imageUrl: '/images/vity_nsalambi_sagrada_familia_1787497295778.jpg.jpeg',
    category: 'Kultura 360',
  },
  'art-50-anos-independencia': {
    title:
      'Madrid celebra o 50.º Aniversário da Independência de Angola com uma jornada histórica de diplomacia e cultura',
    description:
      'Comemoração oficial uniu encontro institucional de alto nível no Hotel Intercontinental e o multitudinário "Dia de Angola 2025" em Las Ventas.',
    imageUrl: '/images/independencia_50_madrid_1787496814208.jpg.jpeg',
    category: 'Politica',
  },
  'art-credenciais-balbina-silva': {
    title:
      'Apresentação de Cartas Credenciais de Balbina Silva no Palácio Real de Madrid',
    description:
      'A Embaixadora de Angola entregou as suas credenciais diplomáticas a Sua Majestade o Rei Filipe VI de Espanha.',
    imageUrl: '/images/credenciais_balbina_silva_1787483613500.jpg.jpeg',
    category: 'Politica',
  },
  'art-forum-recursos-minerais': {
    title:
      'Fórum Internacional de Recursos Minerais destaca Potencial Geológico de Angola',
    description:
      'Encontro em Madrid promove parcerias de exploração sustentável, diamantes, terras raras e investimento ibérico.',
    imageUrl: '/images/forum_recursos_minerais_17487483460820.jpg.jpeg',
    category: 'Economia',
  },
  'art-dia-mulher-africana': {
    title:
      'Dia da Mulher Africana celebrado com homenagem à liderança feminina e diplomacia',
    description:
      'Solenidade em Madrid destaca o papel das mulheres angolanas na diplomacia, ciência, cultura e desenvolvimento socioeconómico.',
    imageUrl: '/images/dia_mulher_africana_1787482964722.jpg.jpeg',
    category: 'Kamba & e Kultura',
  },
};

const DEFAULT_TITLE = 'MOSAICO ANGOLANO - Portal Oficial & Revista Online';
const DEFAULT_DESC =
  'Revista oficial e portal informativo da Embaixada da República de Angola no Reino de Espanha e Principado de Andorra com notícias diplomáticas, consulares, culturais e turísticas.';
const DEFAULT_IMAGE = '/images/icon_mosaico_square_1787501925065.jpg';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default async function handler(req: ServerlessRequest, res: ServerlessResponse) {
  const articleId = (req.query.id as string) || '';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'mosaico-angola.vercel.app';
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const baseUrl = `${proto}://${host}`;
  const canonicalUrl = `${baseUrl}/noticia/${encodeURIComponent(articleId)}`;

  let title = DEFAULT_TITLE;
  let description = DEFAULT_DESC;
  let imageUrl = DEFAULT_IMAGE;

  // 1. Tenta obter o artigo da tabela articles no Supabase (se configurado)
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (articleId && supabaseUrl && supabaseKey) {
    try {
      const endpoint = `${supabaseUrl.replace(/\/+$/, '')}/rest/v1/articles?id=eq.${encodeURIComponent(
        articleId
      )}&select=title,description,subtitle,image_url`;
      const sRes = await fetch(endpoint, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      });

      if (sRes.ok) {
        const data = await sRes.json();
        if (Array.isArray(data) && data.length > 0 && data[0]) {
          const row = data[0];
          title = row.title || title;
          description = row.description || row.subtitle || description;
          if (row.image_url) {
            imageUrl = row.image_url;
          }
        }
      }
    } catch {
      // fallback silencioso
    }
  }

  // 2. Se não encontrou no Supabase, tenta o mapa local de salvaguarda
  if (title === DEFAULT_TITLE && articleId && FALLBACK_ARTICLES[articleId]) {
    const fallback = FALLBACK_ARTICLES[articleId];
    title = fallback.title;
    description = fallback.description;
    imageUrl = fallback.imageUrl;
  }

  // 3. Garante que a imagem é um URL absoluto com https://
  let absoluteImageUrl = imageUrl;
  if (!absoluteImageUrl.startsWith('http://') && !absoluteImageUrl.startsWith('https://')) {
    const cleanImgPath = absoluteImageUrl.startsWith('/') ? absoluteImageUrl : `/${absoluteImageUrl}`;
    absoluteImageUrl = `${baseUrl}${cleanImgPath}`;
  }

  // 4. Constrói o HTML com metatags enriquecidas de Open Graph para WhatsApp, Facebook, LinkedIn, Twitter e Telegram
  const html = `<!doctype html>
<html lang="pt">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)} | MOSAICO ANGOLANO</title>
    <meta name="description" content="${escapeHtml(description)}" />

    <!-- Metatags Open Graph para WhatsApp, Facebook, LinkedIn, Telegram -->
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="MOSAICO ANGOLANO" />
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(absoluteImageUrl)}" />
    <meta property="og:image:secure_url" content="${escapeHtml(absoluteImageUrl)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(title)}" />

    <!-- Twitter / X Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${escapeHtml(canonicalUrl)}" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(absoluteImageUrl)}" />

    <link rel="image_src" href="${escapeHtml(absoluteImageUrl)}" />
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
    <link rel="icon" type="image/jpeg" href="${baseUrl}/images/icon_mosaico_square_1787501925065.jpg" />

    <!-- Se for aberto por um utilizador humano, redireciona suavemente para a página da notícia no portal -->
    <script>
      window.location.replace("${escapeHtml(canonicalUrl)}");
    </script>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 720px; margin: 40px auto; padding: 0 20px; color: #222; line-height: 1.6;">
    <p style="font-size: 13px; color: #d9251d; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">MOSAICO ANGOLANO • REVISTA ONLINE</p>
    <h1 style="font-size: 26px; line-height: 1.3; color: #111;">${escapeHtml(title)}</h1>
    <p style="font-size: 16px; color: #555;">${escapeHtml(description)}</p>
    <div style="margin: 24px 0;">
      <img src="${escapeHtml(absoluteImageUrl)}" alt="${escapeHtml(title)}" style="max-width: 100%; border-radius: 12px; box-shadow: 0 4px 14px rgba(0,0,0,0.1);" />
    </div>
    <p style="margin-top: 24px;">
      <a href="${escapeHtml(canonicalUrl)}" style="display: inline-block; background-color: #d9251d; color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">
        Ler artigo completo no portal &rarr;
      </a>
    </p>
  </body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=120, s-maxage=300');
  return res.status(200).send(html);
}
