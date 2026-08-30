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
}

export const angolaNaturalWonders: NaturalWonder[] = [
  {
    id: 'kalandula',
    number: 1,
    name: 'Quedas de Kalandula',
    officialTitle: 'Quedas de Kalandula — A Majestade das Águas de Malanje',
    province: 'Malanje',
    location: 'Município de Kalandula, Rio Lucala (a cerca de 80 km da cidade de Malanje)',
    tagline: 'A segunda maior queda de água de África e o espetáculo fluvial mais imponente de Angola',
    summary: 'Com 105 metros de altura e uma extensão de 410 metros em formato de ferradura, as Quedas de Kalandula formam um colossal véu de água sobre o leito rochoso do Rio Lucala, rodeadas por uma luxuriante floresta tropical.',
    fullDescription: [
      'As Quedas de Kalandula constituem um dos monumentos naturais mais impressionantes de todo o continente africano. Alimentadas pelas águas caudalosas do Rio Lucala — o mais importante afluente do Rio Kwanza —, as cataratas precipitam-se de uma falésia basáltica com mais de cem metros de desnível vertical, criando uma nuvem permanente de vapor de água e arco-íris espetaculares.',
      'Na época das chuvas (entre outubro e abril), o volume de água atinge o seu apogeu, cobrindo toda a extensão rochosa com uma cortina branca ensurdecedora e majestosa. Na estação seca (Cacimbo), as quedas revelam os seus recortes rochosos esculpidos ao longo de milénios e permitem caminhadas guiadas até às piscinas naturais na base.',
      'A região ao redor das quedas é rica em espécies de árvores tropicais autóctones, orquídeas selvagens e aves ribeirinhas, constituindo um dos pontos turísticos mais visitados e fotografados de Angola.'
    ],
    geographyAndNature: 'Bacia Hidrográfica do Rio Kwanza (afluente Lucala), bioma de savana arborizada e floresta de galeria com alta humidade relativa e biodiversidade ripícola.',
    howToVisit: 'Acesso asfaltado a partir de Luanda via Estrada Nacional EN230 (aprox. 380 km / 5 horas de viagem) até Malanje e daí pela ligação a Kalandula. Existem pousadas e miradouros estruturados nas imediações.',
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1920&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80'
    ],
    highlights: [
      '105 metros de queda livre de água',
      '410 metros de extensão frontal em ferradura',
      'Rio Lucala e Bacia do Kwanza',
      'Miradouros superiores e trilhos à base',
      'Património Natural protegido'
    ],
    facts: [
      { label: 'Altura da Queda', value: '105 metros' },
      { label: 'Largura da Crista', value: '410 metros' },
      { label: 'Rio Principal', value: 'Rio Lucala' },
      { label: 'Província', value: 'Malanje' },
      { label: 'Melhor Época', value: 'Todo o ano (pico hídrico: nov-abr)' }
    ]
  },
  {
    id: 'tundavala',
    number: 2,
    name: 'Fenda da Tundavala',
    officialTitle: 'Fenda da Tundavala — O Abismo Sagrado do Planalto da Huíla',
    province: 'Huíla',
    location: 'Serra da Chela, a 18 km do centro da cidade do Lubango',
    tagline: 'Um precipício monumental de mais de 1.200 metros sobre as planícies sem fim do Namibe',
    summary: 'Na borda do imenso planalto central angolano a 2.200 metros de altitude, a Fenda da Tundavala rasga a cordilheira da Chela numa escarpa abrupta e vertiginosa que se debruça sobre a vastidão costeira.',
    fullDescription: [
      'A Fenda da Tundavala é uma extraordinária formação geológica localizada na Serra da Chela, a escassos 18 quilómetros do Lubango. O planalto culmina abruptamente num desfiladeiro vertical de mais de 1.200 metros de desnível em relação à planície costeira de Moçâmedes e Bibala, oferecendo um dos horizontes mais impressionantes do mundo.',
      'Além da sua magnitude visual e do efeito térmico único proporcionado pelo encontro do ar fresco do planalto com as correntes desérticas do litoral, a Tundavala possui um profundo valor místico e cultural para os povos da região, que historicamente a consideravam um portal sagrado entre os mundos.',
      'O local é dotado de passadiços de observação, áreas de descanso e miradouros panorâmicos onde os visitantes podem contemplar um dos pores do sol mais emblemáticos de África.'
    ],
    geographyAndNature: 'Cordilheira da Serra da Chela, transição entre a savana de montanha do planalto da Huíla e a zona semiárida costeira do Namibe.',
    howToVisit: 'Acesso rápido por via rodoviária pavimentada a partir da cidade do Lubango (aprox. 20 minutos). O aeroporto Internacional da Mukanka no Lubango recebe voos regulares diários a partir de Luanda.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?auto=format&fit=crop&w=1200&q=80'
    ],
    highlights: [
      '1.200 metros de queda em corte vertical',
      'Altitude do miradouro a 2.200m sobre o nível do mar',
      'Serra da Chela e vista panorâmica do Namibe',
      'Passadiços de segurança e miradouro estruturado',
      'Espetáculo de pôr do sol inigualável'
    ],
    facts: [
      { label: 'Altitude do Miradouro', value: '2.200 metros' },
      { label: 'Desnível da Escarpa', value: '+1.200 metros' },
      { label: 'Formação Geológica', value: 'Serra da Chela' },
      { label: 'Província', value: 'Huíla (Lubango)' },
      { label: 'Distância da Cidade', value: '18 km do Lubango' }
    ]
  },
  {
    id: 'maiombe',
    number: 3,
    name: 'Floresta do Maiombe',
    officialTitle: 'Floresta do Maiombe — O Pulmão Esmeralda da Bacia do Congo',
    province: 'Cabinda',
    location: 'Região de Buco-Zau, Belize e Cacongo, Província de Cabinda',
    tagline: 'O mais rico santuário florestal pluvial de Angola e refúgio de primatas raros',
    summary: 'Segunda maior floresta tropical contínua do planeta (integrada no maciço da Bacia do Congo), com árvores colossais que ultrapassam os 50 metros de altura e uma biodiversidade excecional.',
    fullDescription: [
      'A Floresta do Maiombe estende-se por mais de 290 mil hectares no norte de Cabinda, fazendo parte do grande ecossistema florestal da África Central. É caracterizada pelo seu dossel florestal denso, vegetação estratificada com madeiras nobres (como o pau-preto, ébano e limba) e um clima quente e húmido que alimenta uma fauna vibrante.',
      'Este santuário natural abriga espécies emblemáticas e ameaçadas de extinção, incluindo gorilas-das-planícies ocidentais, chimpanzés, elefantes-da-floresta, papagaios-cinzentos africanos e centenas de borboletas e plantas medicinais.',
      'O Parque Nacional do Maiombe promove o ecoturismo sustentável, trilhos guiados com guardas florestais e iniciativas de investigação científica botânica internacional.'
    ],
    geographyAndNature: 'Floresta pluvial tropical densa e húmida, relevo ondulado com serras cobertas por névoa matinal e solos profundos ricos em biomassa.',
    howToVisit: 'Voos comerciais regulares de Luanda para a cidade de Cabinda (aprox. 45 min) e posterior deslocação terrestre para as reservas ecológicas de Buco-Zau e Belize.',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80'
    ],
    highlights: [
      'Extensão de mais de 290.000 hectares protegidos',
      'Habitat de gorilas e chimpanzés protegidos',
      'Árvores gigantescas de madeira nobre (+50m)',
      'Parque Nacional e Turismo Ecológico',
      'Reserva de Biosfera da UNESCO'
    ],
    facts: [
      { label: 'Área Florestal', value: 'Aprox. 290.000 hectares' },
      { label: 'Ecossistema', value: 'Floresta Pluvial da Bacia do Congo' },
      { label: 'Espécies Chave', value: 'Gorilas, Elefantes de Floresta' },
      { label: 'Província', value: 'Cabinda' },
      { label: 'Estatuto', value: 'Parque Nacional e Proteção Integral' }
    ]
  },
  {
    id: 'moco',
    number: 4,
    name: 'Morro do Môco',
    officialTitle: 'Morro do Môco — O Teto de Angola a 2.620 Metros',
    province: 'Huambo',
    location: 'Município de Londuimbali, Província do Huambo',
    tagline: 'O ponto mais alto de todo o território angolano e santuário de aves endémicas',
    summary: 'Com 2.620 metros de altitude máxima, o Morro do Môco ergue-se imponente no planalto central, abrigando relíquias de florestas de montanha e espécies únicas que não existem em mais nenhum lugar da Terra.',
    fullDescription: [
      'O Morro do Môco é o ponto geográfico culminante de Angola, situado no município de Londuimbali, no Huambo. O maciço rochoso eleva-se dramaticamente acima dos planaltos circundantes, exibindo vertentes íngremes e ravinas verdejantes onde subsistem as raras florestas afromontanas.',
      'A montanha é mundialmente reconhecida no meio ornitológico por ser o refúgio crítico da Francolina-do-Môco (*Pternistis swierstrai*) e de diversas outras aves e plantas endémicas adaptadas ao microclima de altitude fria.',
      'É o principal destino para entusiastas do montanhismo, caminhadas de aventura, observação de aves (*birdwatching*) e trekking em Angola.'
    ],
    geographyAndNature: 'Maciço afromontano de gnaisse e granito, encraves de floresta montana sempre-verde e pradarias de altitude com temperaturas frescas.',
    howToVisit: 'Acesso a partir da cidade do Huambo pela estrada EN250 em direção ao Londuimbali (cerca de 100 km). Recomenda-se guia local e calçado apropriado para caminhadas.',
    image: 'https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?auto=format&fit=crop&w=1920&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
    ],
    highlights: [
      'Ponto mais alto de Angola (2.620 metros)',
      'Santuário da ave Francolinus swierstrai',
      'Trilhos desafiantes de montanhismo e trekking',
      'Paisagens panorâmicas do Planalto Central',
      'Clima de montanha puro e revigorante'
    ],
    facts: [
      { label: 'Altitude Máxima', value: '2.620 metros' },
      { label: 'Tipo de Formação', value: 'Maciço Granítico Afromontano' },
      { label: 'Município', value: 'Londuimbali' },
      { label: 'Província', value: 'Huambo' },
      { label: 'Atividades', value: 'Montanhismo, Trekking, Birdwatching' }
    ]
  },
  {
    id: 'nzenzo',
    number: 5,
    name: 'Grutas do Nzenzo',
    officialTitle: 'Grutas do Nzenzo — As Catedrais Subterrâneas do Uíge',
    province: 'Uíge',
    location: 'Município de Ambuíla, Província do Uíge',
    tagline: 'Gravem cársticas ancestrais de estalactites e lagoas subterrâneas de águas cristalinas',
    summary: 'Recentemente integradas no circuito turístico nacional, as Grutas do Nzenzo constituem um assombroso labirinto subterrâneo de calcário esculpido pela água durante centenas de milhares de anos.',
    fullDescription: [
      'Descobertas para o grande público no século XXI e consagradas como uma das 7 Maravilhas Naturais, as Grutas do Nzenzo situam-se no coração da província do Uíge, no município de Ambuíla. O complexo cárstico apresenta galerias monumentais com milhares de estalactites e estalagmites com formatos esculturais fantásticos.',
      'No interior das grutas corre um rio subterrâneo de águas incrivelmente límpidas e azul-turquesa que alimenta poços de água doce límpida, reverenciados pelas populações ancestrais como águas purificadoras e de bênção.',
      'A visita guiada proporciona uma experiência espeleológica sem paralelo, cercada pela calma das florestas do norte angolano.'
    ],
    geographyAndNature: 'Relevo cárstico calcário com hidrologia subterrânea ativa, galerias de dissolução e bacia fluvial do norte.',
    howToVisit: 'Partindo da cidade do Uíge por via rodoviária em direção ao município de Ambuíla (cerca de 80 km). É aconselhável visita acompanhada por guias locais comunitários.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80'
    ],
    highlights: [
      'Salas subterrâneas de calcário milenar',
      'Estalactites e estalagmites gigantes',
      'Lagoa subterrânea cristalina de tom turquesa',
      'Espeleologia e ecoturismo de descoberta',
      'Significado sagrado e tradições locais'
    ],
    facts: [
      { label: 'Formação', value: 'Complexo Cárstico Calcário' },
      { label: 'Atração Central', value: 'Rio e Lagoa Subterrânea' },
      { label: 'Município', value: 'Ambuíla' },
      { label: 'Província', value: 'Uíge' },
      { label: 'Destaque Cultural', value: 'Águas sagradas ancestrais' }
    ]
  },
  {
    id: 'carumbo',
    number: 6,
    name: 'Lagoa do Carumbo',
    officialTitle: 'Lagoa do Carumbo — O Espelho Sagrado da Lunda Norte',
    province: 'Lunda Norte',
    location: 'Município de Capenda Camulemba, Lunda Norte',
    tagline: 'Um imenso espelho de água doce rodeado pela savana verdejante do leste angolano',
    summary: 'Com mais de 12 km de extensão, a Lagoa do Carumbo é um oásis natural tranquilo e repleto de avifauna migratória, rica em lendas tchokwe e paisagens idílicas.',
    fullDescription: [
      'A Lagoa do Carumbo é a maior bacia lacustre natural de água doce do nordeste angolano, situada no município de Capenda Camulemba. As suas águas serenas refletem o céu límpido das Lundas, rodeadas por savanas arborizadas, galerias fluviais e praias de areia fina.',
      'A lagoa desempenha um papel ecológico fundamental na regulação hídrica da bacia do Rio Cuango e serve de poiso e abrigo para milhares de aves aquáticas residentes e migratórias, como garças, patos-selvagens e águias-pesqueiras.',
      'Para além do seu valor ambiental, o Carumbo está envolto em tradições e mitologias da cultura Cokwe, que preserva o respeito sagrado pelo espírito das suas águas.'
    ],
    geographyAndNature: 'Bacia lacustre tectono-fluvial da bacia do Cuango/Congo, pradarias húmidas e ecossistemas de água doce intocados.',
    howToVisit: 'Acesso rodoviário via Dundo ou Lucapa até Capenda Camulemba. O aeroporto de Kamakenzo no Dundo dispõe de ligações aéreas regulares com Luanda.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80'
    ],
    highlights: [
      'Espelho de água natural com mais de 12 km de extensão',
      'Praias fluviais de areia fina e águas serenas',
      'Refúgio de avifauna aquática migratória',
      'Cultura e misticismo do povo Cokwe',
      'Pesca desportiva e ecoturismo'
    ],
    facts: [
      { label: 'Dimensão', value: '~12 km de comprimento' },
      { label: 'Bacia', value: 'Bacia do Rio Cuango' },
      { label: 'Município', value: 'Capenda Camulemba' },
      { label: 'Província', value: 'Lunda Norte' },
      { label: 'Atividades', value: 'Observação de Aves, Fotografia, Passeios Náuticos' }
    ]
  },
  {
    id: 'chiumbe',
    number: 7,
    name: 'Quedas do Rio Chiumbe',
    officialTitle: 'Quedas do Rio Chiumbe — As Cataratas Diamantíferas de Dala',
    province: 'Lunda Sul',
    location: 'Município de Dala / Saurimo, Província da Lunda Sul',
    tagline: 'Cataratas vigorosas e corredeiras no coração da terra dos diamantes',
    summary: 'Formadas pela passagem enérgica do Rio Chiumbe por entre os blocos rochosos da Lunda Sul, as Quedas de Dala e Chiumbe impressionam pela força da correnteza e pela beleza selvagem das suas margens.',
    fullDescription: [
      'As Quedas do Rio Chiumbe (frequentemente conhecidas na proximidade como Quedas de Dala) localizam-se na província da Lunda Sul, na ligação estratégica entre Dala e Saurimo. O Rio Chiumbe precipita-se sobre sucessivas bancadas de granito e quartzo, originando um estrondoso manto de espuma e cascatas.',
      'A ponte e os miradouros locais proporcionam uma visão privilegiada da força hidrográfica da região diamantífera, com a vegetação verdejante a contrastar com a brancura das águas revoltas.',
      'É um dos pontos de paragem obrigatória no circuito rodoviário do leste de Angola, unindo a beleza da natureza ao caloroso acolhimento das populações locais.'
    ],
    geographyAndNature: 'Relevo planáltico da Lunda Sul rasgado por vales fluviais com rápidos encachoeirados sobre rochas cristalinas.',
    howToVisit: 'Acesso direto pela estrada pavimentada que liga Saurimo ao município de Dala (cerca de 60 km). A cidade de Saurimo conta com o Aeroporto Deolinda Rodrigues com voos diretos da capital.',
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1920&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80'
    ],
    highlights: [
      'Sucessão de cataratas e corredeiras vigorosas',
      'Ponte panorâmica sobre o Rio Chiumbe',
      'Localização cénica em Dala / Saurimo',
      'Paisagem fluvial da região leste',
      'Paragem turística emblemática'
    ],
    facts: [
      { label: 'Rio Principal', value: 'Rio Chiumbe' },
      { label: 'Região', value: 'Município de Dala' },
      { label: 'Província', value: 'Lunda Sul' },
      { label: 'Acesso', value: 'Estrada Saurimo-Dala' },
      { label: 'Interesse', value: 'Paisagístico, Fluvial e Fotográfico' }
    ]
  }
];
