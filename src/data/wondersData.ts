/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NaturalWonder {
  id: string;
  number: number;
  name: string;
  province: string;
  location: string;
  tagline: string;
  description: string;
  image: string;
  highlights: string[];
}

export const angolaNaturalWonders: NaturalWonder[] = [
  {
    id: 'kalandula',
    number: 1,
    name: 'Quedas de Kalandula',
    province: 'Malanje',
    location: 'Município de Kalandula, Rio Lucala',
    tagline: 'A segunda maior queda de água de África',
    description: 'Com 105 metros de altura e uma extensão de 410 metros em ferradura, as Quedas de Kalandula formam um colossal véu de água sobre o leito rochoso do Rio Lucala, envolvidas por densa vegetação tropical.',
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1920&q=85',
    highlights: ['105m de queda livre', '410m de largura em ferradura', 'Rio Lucala', 'Miradouro panorâmico'],
  },
  {
    id: 'tundavala',
    number: 2,
    name: 'Fenda da Tundavala',
    province: 'Huíla',
    location: 'Serra da Chela, Lubango',
    tagline: 'O abismo monumental sobre a planície de Benguela',
    description: 'Um impressionante precipício de mais de 1.200 metros na borda do planalto central da Huíla, de onde se contempla uma vista infinita sobre a estepe costeira do Namibe e a cordilheira da Chela.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=85',
    highlights: ['1.200m de desnível vertical', 'Planalto da Chela', 'Pôr do sol cinematográfico', 'Lubango'],
  },
  {
    id: 'maiombe',
    number: 3,
    name: 'Floresta do Maiombe',
    province: 'Cabinda',
    location: 'Região de Buco-Zau e Belize, Cabinda',
    tagline: 'O pulmão verde e santuário de primatas de Angola',
    description: 'Extensa floresta pluvial densa que integra a Bacia do Congo, lar de árvores gigantescas com mais de 50 metros, gorilas-das-planícies, chimpanzés e centenas de espécies de aves raras e medicinais.',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=85',
    highlights: ['Floresta pluvial tropical', 'Biodiversidade da Bacia do Congo', 'Madeiras nobres', 'Fauna protegida'],
  },
  {
    id: 'moco',
    number: 4,
    name: 'Morro do Môco',
    province: 'Huambo',
    location: 'Município de Londuimbali, Huambo',
    tagline: 'O cume mais alto de Angola a 2.620 metros de altitude',
    description: 'O ponto culminante de todo o território angolano, coroado por florestas de altitude repletas de aves endémicas exclusivas (como a Francolinus swierstrai) e paisagens montanhosas de tirar o fôlego.',
    image: 'https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?auto=format&fit=crop&w=1920&q=85',
    highlights: ['2.620 metros de altitude máxima', 'Aves endémicas protegidas', 'Trilhos de montanhismo', 'Londuimbali'],
  },
  {
    id: 'nzenzo',
    number: 5,
    name: 'Grutas do Nzenzo',
    province: 'Uíge',
    location: 'Município de Ambuíla, Uíge',
    tagline: 'Catedrais subterrâneas de estalactites e águas sagradas',
    description: 'Formações cársticas milenares recentemente descobertas na província do Uíge, com galerias subterrâneas de estalactites, estalagmites e lagoas de água doce cristalina cercadas por misticismo e lendas ancestrais.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=85',
    highlights: ['Galerias cársticas milenares', 'Lagoa subterrânea cristalina', 'Ambuíla', 'Ecoturismo e espeleologia'],
  },
  {
    id: 'carumbo',
    number: 6,
    name: 'Lagoa do Carumbo',
    province: 'Lunda Norte',
    location: 'Município de Capenda Camulemba, Lunda Norte',
    tagline: 'O espelho de água sereno e mítico do leste angolano',
    description: 'Uma vasta e enigmática lagoa natural rodeada por savanas arborizadas e praias fluviais de areia fina, de grande importância hidrológica e refúgio vital para aves aquáticas migratórias.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=85',
    highlights: ['Espelho de água natural intocado', 'Aves migratórias aquáticas', 'Lunda Norte', 'Tranquilidade e pesca'],
  },
  {
    id: 'chiumbe',
    number: 7,
    name: 'Quedas do Rio Chiumbe',
    province: 'Lunda Sul',
    location: 'Próximo a Saurimo e Dala, Lunda Sul',
    tagline: 'Cataratas vigorosas no coração da terra dos diamantes',
    description: 'Sequência espetacular de quedas e corredeiras vigorosas formadas pelo Rio Chiumbe ao rasgar o maciço rochoso da Lunda Sul, cercadas por margens verdejantes de beleza intocada.',
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1920&q=85',
    highlights: ['Corredeiras e cataratas rochosas', 'Rio Chiumbe / Dala', 'Lunda Sul', 'Paisagem fluvial pura'],
  },
];
