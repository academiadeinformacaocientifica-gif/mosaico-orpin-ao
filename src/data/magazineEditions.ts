import { MagazineEdition } from '../types';

export const initialMagazineEditions: MagazineEdition[] = [
  {
    id: 'ed-12',
    editionNumber: 12,
    title: 'Edição nº 12 - Especial Cooperação & Sustentabilidade',
    theme: 'Transição Energética e os 50 Anos de Laços Diplomáticos',
    period: 'Julho - Setembro',
    year: 2026,
    coverImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80',
    pagesCount: 64,
    highlights: [
      'Entrevista Exclusiva com a Embaixadora de Angola em Espanha',
      'Dossiê: O Corredor do Lobito e a Nova Rota Comercial Global',
      'Roteiro Turístico: Do Deserto do Namibe às Terras Altas da Huíla',
      'Galeria de Arte Contemporânea: Vozes Emergentes de Luanda em Madrid'
    ],
    editorialNote: 'Nesta 12ª edição da Revista Mosaico, mergulhamos nas transformações estruturais de Angola e no vigor renovado da nossa diplomacia na Península Ibérica.'
  },
  {
    id: 'ed-11',
    editionNumber: 11,
    title: 'Edição nº 11 - Diplomacia Económica & Inovação',
    theme: 'Investimento Estrangeiro e Parcerias Ibero-Africanas',
    period: 'Abril - Junho',
    year: 2026,
    coverImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80',
    pagesCount: 56,
    highlights: [
      'Balanço do Fórum Empresarial Hispano-Angolano',
      'Vistos e Modernização Digital Consular',
      'Semba no Mundo: Património Cultural Imaterial',
      'Jovens Bolseiros Angolanos nas Universidades Espanholas'
    ],
    editorialNote: 'A economia real faz-se com pessoas capacitadas e visão de longo prazo.'
  },
  {
    id: 'ed-10',
    editionNumber: 10,
    title: 'Edição nº 10 - Memória & Diplomacia',
    theme: '40 Anos da Chancelaria de Angola em Madrid (1984 - 2024)',
    period: 'Janeiro - Março',
    year: 2026,
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    pagesCount: 72,
    highlights: [
      'Homenagem ao primeiro Embaixador Fernando França Van-Dúnem',
      'Cronologia Fotográfica das Visitas Reais e Presidenciais',
      'A Comunidade Angolana em Espanha e Andorra: Retratos e Vidas',
      'Turismo de Natureza: As Maravilhas da Biodiversidade Angolana'
    ],
    editorialNote: 'Celebrar a memória é honrar as pontes sólidas erguidas com dedicação ao longo de quatro décadas.'
  }
];

export const magazineEditions = initialMagazineEditions;
