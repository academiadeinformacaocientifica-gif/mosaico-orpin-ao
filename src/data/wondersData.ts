/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WonderFact {
  label: string;
  value: string;
}

export interface NaturalWonder {
  id: string;
  number: number;
  name: string;
  officialTitle: string;
  province: string;
  location: string;
  tagline: string;
  summary: string;
  fullDescription: string[];
  geographyAndNature: string;
  howToVisit: string;
  image: string;
  galleryImages: string[];
  highlights: string[];
  facts: WonderFact[];
  isPublished?: boolean;
}

export const angolaNaturalWonders: NaturalWonder[] = [
  {
    id: 'wonder-1789124173826',
    number: 1,
    name: 'Quedas de Kalandula',
    officialTitle: 'Quedas de Kalandula',
    province: 'Malanje',
    location: 'Kalandula',
    tagline: 'Uma das maiores quedas de água de África e o espetáculo fluvial mais imponente de Malanje',
    summary: 'Localizadas na província de Malanje, no município de Kalandula, estas magníficas quedas de água no rio Lucala destacam-se pelos seguintes aspetos:\n\nDimensões: Têm cerca de 105 metros de altura e estendem-se por uma vasta extensão de mais de 400 metros de largura, criando uma cortina de água monumental.\n\nPaisagem: Estão inseridas numa zona de vegetação luxuriante, oferecendo um cenário panorâmico espetacular que atrai visitantes, fotógrafos e turistas de todo o mundo.\n\nAcesso: Situam-se a cerca de 85 km da cidade de Malanje, sendo um ponto de paragem obrigatório para quem explora a região norte/central do país, juntamente com outras maravilhas naturais próximas, como as Pedras Negras de Pungo Andongo.',
    fullDescription: [
      'Localizadas na província de Malanje, no município de Kalandula, estas magníficas quedas de água no rio Lucala destacam-se pelos seguintes aspetos:\n\nDimensões: Têm cerca de 105 metros de altura e estendem-se por uma vasta extensão de mais de 400 metros de largura, criando uma cortina de água monumental.\n\nPaisagem: Estão inseridas numa zona de vegetação luxuriante, oferecendo um cenário panorâmico espetacular que atrai visitantes, fotógrafos e turistas de todo o mundo.\n\nAcesso: Situam-se a cerca de 85 km da cidade de Malanje, sendo um ponto de paragem obrigatório para quem explora a região norte/central do país, juntamente com outras maravilhas naturais próximas, como as Pedras Negras de Pungo Andongo.'
    ],
    geographyAndNature: 'Bacia Hidrográfica do Rio Kwanza (afluente Lucala), bioma de vegetação luxuriante e rica biodiversidade.',
    howToVisit: 'Situam-se a cerca de 85 km da cidade de Malanje, com acesso rodoviário pavimentado.',
    image: 'https://zrukdgvgnopkakwqyveu.supabase.co/storage/v1/object/public/article-images/1789124161188-a0cnpq.jpg',
    galleryImages: [
      'https://zrukdgvgnopkakwqyveu.supabase.co/storage/v1/object/public/article-images/1789124161188-a0cnpq.jpg'
    ],
    highlights: [
      'Paisagem de tirar o fôlego',
      'Acesso pavimentado e seguro',
      '105 metros de altura',
      'Mais de 400 metros de largura'
    ],
    facts: [
      { label: 'Classificação', value: '7 Maravilhas Naturais de Angola' },
      { label: 'Melhor Época', value: 'Todo o ano' },
      { label: 'Província', value: 'Malanje' },
      { label: 'Município', value: 'Kalandula' }
    ],
    isPublished: true
  }
];
