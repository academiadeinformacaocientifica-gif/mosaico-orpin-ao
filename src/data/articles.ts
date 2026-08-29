import { Article } from '../types';
import diaMulherAfricanaImg from '../assets/images/dia_mulher_africana_1787482964722.jpg.jpeg';
import forumRecursosMineraisImg from '../assets/images/forum_recursos_minerais_17487483460820.jpg.jpeg';
import credenciaisBalbinaImg from '../assets/images/credenciais_balbina_silva_1787483613500.jpg.jpeg';
import independencia50Img from '../assets/images/independencia_50_madrid_1787496814208.jpg.jpeg';
import vityNsalambiImg from '../assets/images/vity_nsalambi_sagrada_familia_1787497295778.jpg.jpeg';
import imexBarcelonaImg from '../assets/images/imex_barcelona_angola_1787497730037.jpg.jpeg';
import onuTurismoImg from '../assets/images/onu_turismo_madrid_1787497879619.jpg.jpeg';
import cooperacaoBilateralImg from '../assets/images/Angola e Espanha reforçam cooperação bilateral.jpeg';

export const initialArticles: Article[] = [
  // NOTÍCIA NOVA: ANGOLA E ESPANHA REFORÇAM COOPERAÇÃO BILATERAL
  {
    id: 'art-cooperacao-bilateral-angola-espanha-2026',
    title: 'Angola e Espanha reforçam cooperação bilateral e parceria estratégica em Madrid',
    subtitle: 'Reunião de Consultas Políticas ao nível de Secretários de Estado aprofunda laços diplomáticos, investimentos estruturantes em energias renováveis, Corredor do Lobito e parcerias académicas.',
    description: 'No âmbito do aprofundamento das relações político-diplomáticas, a República de Angola e o Reino de Espanha realizaram em Madrid a Reunião de Consultas Políticas, copresidida por Esmeralda Mendonça e Diego Martínez Belío.',
    fullContent: [
      'No âmbito do aprofundamento das relações político-diplomáticas, a República de Angola e o Reino de Espanha realizaram, a 4 de Junho de 2026, em Madrid, a Reunião de Consultas Políticas ao nível de Secretários de Estado.',
      'O encontro copresidido pela Secretária de Estado para as Relações Exteriores de Angola, Esmeralda Mendonça, e pelo Secretário de Estado para os Negócios Estrangeiros e Assuntos Globais de Espanha, Diego Martínez Belío, serviu para passar em revista o estado da cooperação bilateral e analisar a conjuntura internacional.',
      'Principais Deliberações e Áreas de Cooperação:',
      '• Parceria Económica e Estruturante: Reiteração do interesse espanhol em investir em energias renováveis e na plataforma logística regional angolana, com enfoque no Corredor do Lobito e no Aeroporto Internacional Dr. António Agostinho Neto.',
      '• Ensino Superior e Cultura: Valorização das parcerias académicas — como a ligação entre a Universidade do Cuanza e a Universidade Europeia do Atlântico (FUNIBER) — e o compromisso mútuo na promoção internacional do Carnaval angolano.',
      '• Geopolítica e Paz Regional: Reconhecimento do papel preponderante de Angola na mediação de conflitos nas regiões da CEEAC e da SADC, bem como o sucesso da sua liderança na Presidência da União Africana e na organização da 7.ª Cimeira UA-UE.',
      '• Agendas Globais e Multilateralismo: Convergência na necessidade de reformas no Sistema das Nações Unidas, promoção de políticas de igualdade de género e concertação diplomática no âmbito das candidaturas de ambos os países à Direção-Geral da FAO.',
      'Com um percurso histórico consolidado desde 1977, as duas nações reafirmam o compromisso de criar novas oportunidades de investimento, diversificar as trocas comerciais e fortalecer o intercâmbio institucional em prol do desenvolvimento mútuo.',
      'SERVIÇOS DE COMUNICAÇÃO INSTITUCIONAL E IMPRENSA DA EMBAIXADA DE ANGOLA NO REINO DE ESPANHA.'
    ],
    category: 'Politica',
    categoryId: 'politica',
    author: {
      name: 'Serviços de Comunicação e Imprensa',
      role: 'Embaixada de Angola em Espanha',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
    },
    date: '04 DE JUNHO DE 2026',
    isoDate: '2026-06-04',
    readTime: '4 min de leitura',
    imageUrl: cooperacaoBilateralImg,
    likes: 67,
    commentsCount: 11,
    isFeatured: true,
    isCarousel: true,
    tags: ['Cooperação Bilateral', 'Esmeralda Mendonça', 'Diego Martínez Belío', 'Madrid', 'Espanha-Angola', 'Corredor do Lobito', 'FUNIBER', 'Diplomacia'],
    comments: [
      {
        id: 'c-coop-1',
        author: 'Dr. Fernando Gaspar',
        role: 'Analista de Relações Internacionais',
        date: '04 de Junho de 2026',
        content: 'Um marco diplomático fundamental que reforça a posição de liderança regional de Angola e a parceria estratégica ibérica.',
        likes: 18
      }
    ]
  },
  // NOTÍCIA 1: ANGOLA E ONU TURISMO REFORÇAM COOPERAÇÃO ESTRATÉGICA EM MADRID
  {
    id: 'art-onu-turismo-madrid-2026',
    title: 'Angola e ONU Turismo Reforçam Cooperação Estratégica em Madrid',
    subtitle: 'A Embaixadora Balbina Malheiros Dias da Silva apresentou cartas credenciais à Secretária-Geral da ONU Turismo, Shaikha Nasser Al Nowais, impulsionando a cooperação técnica e o investimento no turismo angolano.',
    description: 'Acreditação solene na sede da ONU Turismo em Madrid reforça assistência técnica, programas de capacitação, promoção do guia "Tourism Doing Business: Investing in Angola" e preparação do Global Tourism Forum 2026 em Luanda.',
    fullContent: [
      'Na passada quinta-feira, 16 de abril, Sua Excelência a Embaixadora Extraordinária e Plenipotenciária da República de Angola no Reino de Espanha, Balbina Malheiros Dias da Silva, apresentou formalmente as suas Cartas Credenciais à Secretária-Geral da ONU Turismo, Shaikha Nasser Al Nowais.',
      'O acto solene, realizado na sede da organização em Madrid, consolidou a acreditação de Angola junto desta agência especializada das Nações Unidas e reafirmou o compromisso do Estado angolano com o desenvolvimento estratégico do sector.',
      'Durante o encontro, a liderança da ONU Turismo reiterou a total abertura para apoiar o crescimento do turismo em Angola através de assistência técnica permanente e programas de capacitação especializados para a força de trabalho local.',
      'A parceria estratégica foca-se na diversificação económica e na promoção do país como destino de excelência, destacando-se o crescimento de 30% nas chegadas internacionais e o lançamento do guia de investimento "Tourism Doing Business: Investing in Angola".',
      'A Embaixadora reforçou a intenção de trabalhar em estreita colaboração com a equipa técnica da organização para integrar o turismo na agenda de desenvolvimento nacional, com especial destaque para o Global Tourism Forum Investment Summit Angola, que terá lugar em Luanda em junho de 2026.',
      'SERVIÇOS DE COMUNICAÇÃO INSTITUCIONAL E IMPRENSA DA EMBAIXADA DE ANGOLA NO REINO DE ESPANHA.'
    ],
    category: 'Turismo',
    categoryId: 'turismo',
    author: {
      name: 'Serviços de Comunicação e Imprensa',
      role: 'Embaixada de Angola em Espanha',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
    },
    date: '16 DE ABRIL DE 2026',
    isoDate: '2026-04-16',
    readTime: '3 min de leitura',
    imageUrl: onuTurismoImg,
    likes: 82,
    commentsCount: 19,
    isFeatured: true,
    isCarousel: true,
    tags: ['ONU Turismo', 'Balbina da Silva', 'Shaikha Nasser Al Nowais', 'Madrid', 'Cartas Credenciais', 'Turismo em Angola', 'Tourism Doing Business', 'Global Tourism Forum'],
    comments: [
      {
        id: 'c-onu-1',
        author: 'Dr. Jaime Mavinga',
        role: 'Associação de Operadores Turísticos e Hoteleiros de Angola',
        date: '16 de Abril de 2026',
        content: 'Um passo diplomático e institucional fundamental para colocar o potencial turístico e ecoturístico de Angola no radar dos investidores mundiais!',
        likes: 24
      },
      {
        id: 'c-onu-2',
        author: 'Carmen Del Castillo',
        role: 'Especialista em Cooperação Multilateral',
        date: '17 de Abril de 2026',
        content: 'Parabéns à Embaixadora Balbina da Silva e à equipa da ONU Turismo por esta aliança estratégica tão promissora sediada em Madrid.',
        likes: 15
      }
    ]
  },
  // NOTÍCIA 1: ANGOLA REAFIRMA POSICIONAMENTO ESTRATÉGICO NA IMEX BARCELONA 2026
  {
    id: 'art-imex-barcelona-2026',
    title: 'Angola Reafirma Posicionamento Estratégico na IMEX Barcelona 2026',
    subtitle: 'Com mais de 280 reuniões bilaterais com 31 países e articulação com a Foment del Treball Nacional, país consolida-se como destino prioritário para investimento da Península Ibérica.',
    description: 'A República de Angola consolidou, com assinalável êxito, a sua presença na IMEX Barcelona 2026, promovendo oportunidades em indústria transformadora, energia, farmacêutica e construção.',
    fullContent: [
      'A República de Angola consolidou, com assinalável êxito, a sua presença na IMEX Barcelona 2026, reafirmando o país como um destino prioritário para o investimento direto estrangeiro no continente africano.',
      'A participação angolana neste prestigiado certame internacional evidenciou o crescente interesse do tecido empresarial da Península Ibérica (Espanha e Portugal) nas oportunidades decorrentes da política de diversificação económica nacional.',
      'Destaques da Missão Institucional:',
      '• Dinamismo Comercial: Realização de mais de 280 reuniões bilaterais com especialistas de 31 países, estabelecendo uma plataforma de diálogo profícua para futuras parcerias.',
      '• Articulação Regional: Reunião de alto nível com a Foment del Treball Nacional, com o intuito de coordenar futuras jornadas empresariais e visitas institucionais de relevo.',
      '• Sectores de Convergência: Identificação de projectos concretos em áreas estratégicas como a Indústria Transformadora, Energia, Indústria Farmacêutica e Construção.',
      'A Dr.ª Paula Francinette Cordeiro Lisboa (Adida Comercial da Península Ibérica – Espanha e Portugal) salientou a importância estratégica deste evento, observando que: “Esta edição refletiu uma procura acentuada por parte de empresas que pretendem realizar missões comerciais a Angola, com o firme propósito de identificar parceiros locais e concretizar investimentos.”',
      'Este desempenho institucional reflete o compromisso do Estado Angolano no reforço dos laços económicos com os parceiros da Península Ibérica, promovendo uma imagem de estabilidade, crescimento e abertura ao mercado global.',
      'SERVIÇOS DE COMUNICAÇÃO INSTITUCIONAL E IMPRENSA DA EMBAIXADA DE ANGOLA NO REINO DE ESPANHA.'
    ],
    category: 'Economia',
    categoryId: 'economia',
    author: {
      name: 'Aditadoria Comercial da Península Ibérica',
      role: 'Embaixada de Angola em Espanha e Portugal',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80'
    },
    date: '18 DE JUNHO DE 2026',
    isoDate: '2026-06-18',
    readTime: '3 min de leitura',
    imageUrl: imexBarcelonaImg,
    likes: 76,
    commentsCount: 15,
    isFeatured: false,
    isCarousel: false,
    tags: ['IMEX Barcelona', 'Aditadoria Comercial', 'Paula Francinette Cordeiro Lisboa', 'Foment del Treball', 'Economia', 'Investimento', 'Península Ibérica', 'Indústria Transformadora'],
    comments: [
      {
        id: 'c-imex-1',
        author: 'Joan Puigdemont',
        role: 'Foment del Treball Nacional',
        date: '18 de Junho de 2026',
        content: 'Excelente representação institucional de Angola na IMEX. As reuniões de trabalho abriram portas muito concretas para parcerias com as empresas catalãs e espanholas.',
        likes: 21
      },
      {
        id: 'c-imex-2',
        author: 'Dr. Afonso Henriques Neto',
        role: 'Consultor de Comércio Externo',
        date: '19 de Junho de 2026',
        content: 'Mais de 280 reuniões bilaterais demonstram a assertividade da diplomacia económica angolana na Península Ibérica. Parabéns à equipa comercial!',
        likes: 16
      }
    ]
  },
  // NOTÍCIA 2: LIDERANÇA GLOBAL: BASTONÁRIO VITY CLAUDE NSALAMBI NO CONGRESSO MUNDIAL DA UIA
  {
    id: 'art-vity-claude-nsalambi-uia',
    title: 'Liderança Global: Bastonário Vity Claude Nsalambi alcança reconhecimento histórico no Congresso Mundial da UIA em Barcelona',
    subtitle: 'O Bastonário da Ordem dos Arquitectos de Angola conquistou o segundo maior número de votos a nível mundial para a Presidência da UIA e presidiu ao júri do Prémio Robert Matthew na Sagrada Família.',
    description: 'Votação histórica no CCIB e presença marcante na Basílica da Sagrada Família e no Disseny Hub Barcelona consolidam o prestígio da arquitetura angolana e africana no topo mundial.',
    fullContent: [
      'O Bastonário da Ordem dos Arquitectos de Angola, Arquitecto Vity Claude Nsalambi, alcançou um resultado histórico ao conquistar o segundo maior número de votos a nível mundial na eleição para a Presidência da União Internacional dos Arquitectos (UIA), realizada no Centro de Convenções Internacional de Barcelona (CCIB).',
      'Esta votação expressiva consolida a liderança geopolítica do Bastonário e reafirma o prestígio internacional de Angola e do continente africano no topo da arquitetura global.',
      'Com o acompanhamento permanente da Missão Diplomática de Angola no Reino de Espanha, uma comitiva recorde de mais de 500 profissionais demonstrou a capacidade técnica nacional no evento.',
      'O prestígio do Bastonário foi igualmente evidente na Basílica da Sagrada Família, onde assumiu a magistratura de Presidente do Júri para a entrega do Prémio Robert Matthew, numa solenidade que contou com a presença de Sua Exa. o Presidente da República Portuguesa, António José Seguro, e do Ministro da Cultura de Espanha, Ernest Urtasun.',
      'Em paralelo, a Ordem dos Arquitectos de Angola marcou uma presença inédita com um pavilhão próprio no Disseny Hub Barcelona, projetando o talento nacional e defendendo oportunidades urgentes para a jovem população de arquitetos em África perante os desafios urbanos e climáticos globais.',
      'A Embaixada de Angola no Reino de Espanha felicita o Bastonário Vity Claude Nsalambi pelo marco histórico alcançado, estende as saudações institucionais à liderança eleita da UIA — Arq. Li Zhang (China), Teresa Táboas (Espanha) e Marco Vázquez (México) — e reafirma o seu compromisso com a valorização e projeção internacional dos arquitetos angolanos, em benefício do desenvolvimento do território nacional.',
      'SERVIÇOS DE COMUNICAÇÃO INSTITUCIONAL E IMPRENSA DA EMBAIXADA DE ANGOLA NO REINO DE ESPANHA.'
    ],
    category: 'Kultura 360',
    categoryId: 'kultura-360',
    author: {
      name: 'Serviços de Comunicação e Imprensa',
      role: 'Embaixada de Angola em Espanha',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
    },
    date: '15 DE JULHO DE 2026',
    isoDate: '2026-07-15',
    readTime: '4 min de leitura',
    imageUrl: vityNsalambiImg,
    likes: 95,
    commentsCount: 31,
    isFeatured: false,
    isCarousel: false,
    tags: ['Ordem dos Arquitectos de Angola', 'Vity Claude Nsalambi', 'UIA Barcelona', 'Sagrada Família', 'Prémio Robert Matthew', 'Disseny Hub Barcelona', 'Angolbérica', 'Arquitetura'],
    comments: [
      {
        id: 'c-uia-1',
        author: 'Arq. Paula Ndongala',
        role: 'Ordem dos Arquitectos de Angola',
        date: '15 de Julho de 2026',
        content: 'Um momento de consagração que enche de orgulho toda a classe e dignifica a arquitetura angolana no maior palco internacional em Barcelona!',
        likes: 34
      },
      {
        id: 'c-uia-2',
        author: 'Josep Maria Vidal',
        role: 'Col·legi d Arquitectes de Catalunya (COAC)',
        date: '16 de Julho de 2026',
        content: 'Extraordinária participação da delegação angolana na Sagrada Família e no CCIB. Parabéns ao Bastonário Vity Claude Nsalambi.',
        likes: 18
      }
    ]
  },
  // NOTÍCIA 3: 50.º ANIVERSÁRIO DA INDEPENDÊNCIA DE ANGOLA EM MADRID
  {
    id: 'art-50-anos-independencia',
    title: 'Madrid celebra o 50.º Aniversário da Independência de Angola com uma jornada histórica de diplomacia, cultura e projeção internacional',
    subtitle: 'Comemoração oficial uniu encontro institucional de alto nível no Hotel Intercontinental e o multitudinário "Dia de Angola 2025" sob a Cúpula de Las Ventas com mais de 5.000 participantes.',
    description: 'Pela primeira vez, Madrid foi o cenário de uma grande celebração internacional que uniu diplomacia, cultura e sociedade civil em torno do jubileu de ouro da independência angolana.',
    fullContent: [
      'Pela primeira vez, Madrid foi o cenário de uma grande celebração internacional que uniu diplomacia, cultura e sociedade civil em torno do 50.º Aniversário da Independência de Angola.',
      'A comemoração, organizada pela Embaixada de Angola, reuniu autoridades, representantes diplomáticos, líderes empresariais e milhares de cidadãos, consolidando a relação entre ambos os países e projetando a imagem de uma Angola moderna, diversa e em crescimento.',
      'Um encontro institucional de alto nível no Hotel Intercontinental de Madrid contou com a participação de embaixadores, representantes do Governo de Espanha e da Comunidade de Madrid, bem como de organismos internacionais e empresários de ambos os países.',
      'A cerimónia foi presidida por Balbina Malheiros Dias da Silva, Embaixadora de Angola em Espanha, que proferiu um discurso patriótico e profundamente simbólico, no qual destacou os cinquenta anos de independência como um marco de soberania, paz e esperança.',
      'Durante a sua intervenção, a embaixadora recordou a histórica visita de Sua Majestade o Rei Filipe VI a Angola em 2023, que marcou um ponto de viragem nas relações bilaterais e consolidou a Espanha como um parceiro estratégico dentro da política africana de Angola. Sublinhou ainda o compromisso do país com a diversificação económica e o crescimento sustentável, convidando os empresários espanhóis a investir “num país que oferece segurança, estabilidade e confiança”.',
      'Malheiros Dias da Silva também reivindicou o papel de Angola como ator-chave na prevenção e resolução de conflitos, a sua recente presidência da União Africana e a sua legítima aspiração a ocupar um assento no Conselho de Segurança das Nações Unidas, reafirmando a vontade do país de contribuir ativamente para a paz e a cooperação internacional.',
      'Na fotografia oficial do ato institucional: Abel Coelho de Mendoça, embaixador da Guiné-Bissau em Espanha, e Balbina Malheiros Dias da Silva, Embaixadora de Angola em Espanha.',
      'O ato terminou com um almoço de gastronomia angolana, acompanhado pelas interpretações dos hinos nacionais de Angola e de Espanha por um quarteto de cordas, num ambiente que simbolizou a amizade e o respeito mútuo entre ambos os povos.',
      'Uma grande celebração cultural sob a Cúpula de Cristal de Las Ventas: À tarde, a jornada prosseguiu com o DIA DE ANGOLA 2025, um evento cultural multitudinário realizado sob a majestosa Cúpula de Cristal da Plaza de Toros de Las Ventas, que reuniu mais de 5.000 participantes.',
      'A embaixadora deu as boas-vindas ao público com um discurso carregado de emoção e orgulho nacional, no qual apresentou o Angola Day como uma plataforma pioneira de diplomacia cultural que reflete a energia, a criatividade e a hospitalidade do povo angolano.',
      '“A Angola de hoje é um país em transformação — afirmou — com estabilidade política, uma economia em processo de diversificação e um compromisso firme com o desenvolvimento sustentável. Este festival mostra o melhor da nossa alma: a nossa música, a nossa gastronomia, a nossa arte e, acima de tudo, a nossa alegria.”',
      'Na sua intervenção, sublinhou também que este modelo de evento representa uma nova forma de promoção internacional de Angola, combinando cultura, turismo e economia. Nas palavras da embaixadora, o êxito desta primeira edição servirá de inspiração “para outras embaixadas angolanas e países acreditados”, constituindo a primeira vez que um país apresenta em Espanha a sua diversificação cultural, turística e económica num evento com onze horas de duração.',
      'O programa combinou música, dança, carnaval, gastronomia e produtos FEITOS EM ANGOLA, que contaram com uma ampla representação de marcas nacionais. O público desfrutou das atuações ao vivo de reconhecidos artistas angolanos: Daniel Nascimento, Tony Do Fumo Jr, Bruna Tatiana, Klaudio Hoshai, Doddy, DJ Malvado, Sandra Cordeiro, Noite e Dia e As Gingas Do Maculusso, entre outros.',
      'Ao longo de todo o dia, os participantes puderam percorrer uma área expositiva dedicada ao turismo, à cultura e aos produtos angolanos, juntamente com stands de patrocinadores e empresas colaboradoras, gerando oportunidades de intercâmbio e visibilidade internacional.',
      'Aliança entre Angola e Espanha: O sucesso do Dia de Angola 2025 foi possível graças ao apoio de numerosas entidades que contribuíram para o desenvolvimento e a projeção do evento, destacando-se o papel dos patrocinadores espanhóis e angolanos no fortalecimento dos vínculos económicos e culturais entre ambos os países.',
      'Entre eles: BNI, Deutsche Bank, Diplomatic, Elecnor, Globaltech Desarrollos e Ingeniería, Grupo AGEM Ingeniería y Proyectos S.A.U, Makiber, Media Nova, QUANTUN, Refriango, S. Tulumba Investimentos e Participações S.A., Satec, Spendin, TAAG, Unitel e Xcaliburmp, Inapem, Banco Yetu, Hisumer, Amej e da colaboração com a agência Brand Comunicación.',
      'A embaixadora destacou que este encontro “é uma demonstração de como a diplomacia cultural pode transformar-se num motor de desenvolvimento, cooperação e entendimento entre os povos”.',
      'O Dia de Angola 2025 consolida-se assim como um modelo de referência para a promoção da imagem do país, mostrando uma Angola aberta ao mundo, rica em cultura e cheia de oportunidades.'
    ],
    category: 'Politica',
    categoryId: 'politica',
    author: {
      name: 'Serviços de Comunicação e Imprensa',
      role: 'Embaixada de Angola em Espanha',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
    },
    date: '11 DE NOVEMBRO DE 2025',
    isoDate: '2025-11-11',
    readTime: '6 min de leitura',
    imageUrl: independencia50Img,
    likes: 89,
    commentsCount: 24,
    isFeatured: true,
    isCarousel: false,
    tags: ['50 Anos de Independência', 'Dia de Angola 2025', 'Las Ventas', 'Hotel Intercontinental', 'Diplomacia Cultural', 'Balbina da Silva', 'Feito em Angola', 'Música Angolana'],
    comments: [
      {
        id: 'c-indep-1',
        author: 'Mário Rui de Carvalho',
        role: 'Comunidade Angolana em Madrid',
        date: '11 de Novembro de 2025',
        content: 'Um dia inesquecível em Las Ventas e no Hotel Intercontinental! Orgulho imenso em ver a nossa bandeira, cultura e artistas a brilharem com tanta grandeza em Espanha.',
        likes: 27
      },
      {
        id: 'c-indep-2',
        author: 'Elena Fernández Moreno',
        role: 'Relações Culturais Internacionais',
        date: '12 de Novembro de 2025',
        content: 'Extraordinária demonstração de diplomacia cultural. A riqueza musical e gastronómica de Angola conquistou Madrid!',
        likes: 15
      }
    ]
  },
  // NOTÍCIA 4: BALBINA DA SILVA, ACREDITADA NO REINO DE ESPANHA
  {
    id: 'art-acreditacao-balbina-silva',
    title: 'Balbina da Silva, acreditada no Reino de Espanha como Embaixadora Extraordinária e Plenipotenciária',
    subtitle: 'A diplomata entregou as suas cartas credenciais a Sua Majestade o Rei Filipe VI, tornando-se a primeira mulher a liderar a missão diplomática angolana em Espanha.',
    description: 'A Embaixadora Balbina Malheiros Dias da Silva formalizou a sua acreditação junto do Rei Filipe VI, reforçando o novo paradigma de diplomacia económica e cooperação estratégica.',
    fullContent: [
      'A Embaixadora Extraordinária e Plenipotenciária da República de Angola no Reino de Espanha, Balbina Malheiros Dias da Silva, apresentou hoje, 12 de setembro de 2025, as suas cartas credenciais ao Rei Filipe VI, formalizando a sua acreditação como representante diplomática de Angola em Espanha.',
      'A Embaixadora foi nomeada pelo Presidente da República a 11 de fevereiro de 2025, com o objectivo de fortalecer as relações diplomáticas e económicas entre Angola e Espanha, no quadro do novo paradigma de diplomacia económica que visa atrair mais investimentos externos para Angola, sendo Espanha um parceiro prioritário neste âmbito, com destaque para as áreas de cooperação nos sectores da agricultura, energia, infraestruturas, tecnologia e formação profissional.',
      'A cerimônia de entrega das cartas credenciais contou também com a presença dos Embaixadores da Argentina, Senegal, Guatemala, Suíça e Islândia, que também apresentaram as suas credenciais ao Rei Filipe VI.',
      'Durante a cerimônia, S.Excia. a Embaixadora transmitiu as saudações do Presidente da República de Angola, João Manuel Gonçalves Lourenço, à Sua Majestade o Rei Filipe VI.',
      'Na breve troca de impressões entre o monarca espanhol e a diplomata angolana, foi reiterada a vontade dos dois Estados aprofundarem as relações de cooperação e de amizade já bastante fortes entre ambos, tendo paralelamente sido abordadas questões ligadas ao Multilateralismo e o interesse do Monarca espanhol ver acrescida a participação de empresas espanholas em Angola, especialmente no presente contexto de desenvolvimento do Corredor do Lobito.',
      'Por sua vez, Balbina da Silva informou que está a ser preparado um Fórum Económico Angola-Espanha, agendado para o dia 2 de outubro do presente ano.',
      'Balbina da Silva torna-se assim na nona Embaixadora Extraordinária e Plenipotenciária da República de Angola no Reino de Espanha e a primeira mulher a ocupar este cargo durante os 38 anos de relações bilaterais entre os dois países.',
      'SERVIÇOS DE COMUNICAÇÃO INSTITUCIONAL E IMPRENSA DA EMBAIXADA DE ANGOLA NO REINO DE ESPANHA.'
    ],
    category: 'Politica',
    categoryId: 'politica',
    author: {
      name: 'Serviços de Comunicação e Imprensa',
      role: 'Embaixada de Angola em Espanha',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
    },
    date: '12 DE SETEMBRO DE 2025',
    isoDate: '2025-09-12',
    readTime: '3 min de leitura',
    imageUrl: credenciaisBalbinaImg,
    likes: 64,
    commentsCount: 18,
    isFeatured: true,
    isCarousel: true,
    tags: ['Cartas Credenciais', 'Rei Filipe VI', 'Embaixadora Balbina da Silva', 'Politica', 'Diplomacia', 'Espanha-Angola', 'Corredor do Lobito'],
    comments: [
      {
        id: 'c-acred-1',
        author: 'Dr. António Manuel de Sousa',
        role: 'Conselheiro Diplomático',
        date: '12 de Setembro de 2025',
        content: 'Um marco histórico extraordinário para a diplomacia angolana ao ter a primeira mulher à frente da missão em Madrid perante a Coroa Espanhola.',
        likes: 19
      }
    ]
  },
  // NOTÍCIA 5: FÓRUM DE INVESTIMENTO EM RECURSOS MINERAIS, PETRÓLEO E GÁS (MADRID)
  {
    id: 'art-forum-recursos-minerais',
    title: 'Angola apresenta em Madrid as suas oportunidades de investimento em recursos minerais, Petróleo e Gás e reforça a sua aposta em alianças estratégicas com Espanha',
    subtitle: 'Fórum na Câmara de Comércio de Madrid reuniu o Ministro Diamantino Azevedo, a Embaixadora Balbina da Silva e líderes empresariais para debater minerais críticos, gás e parcerias público-privadas.',
    description: 'A Cámara Oficial de Comercio, Industria y Servicios de Madrid acolheu o fórum empresarial "Investment in the Mineral Resources Sector", centrado na cooperação económica bilateral e atração de investimento privado.',
    fullContent: [
      'A Cámara Oficial de Comercio, Industria y Serviços de Madrid acolheu esta manhã o fórum empresarial “Investment in the Mineral Resources Sector”, uma jornada centrada nas oportunidades de investimento e cooperação entre Angola e Espanha no âmbito dos recursos minerais, energéticos e estratégicos.',
      'O Fórum reuniu representantes institucionais, organismos públicos, entidades técnicas e empresas interessadas em conhecer o potencial mineiro de Angola e as novas oportunidades de colaboração resultantes das reformas impulsionadas pelo Executivo angolano.',
      'Esta Conferência bilateral focou-se na análise de oportunidades de investimento e cooperação empresarial entre ambos os países, com especial atenção ao sector dos recursos minerais, Petróleo e Gás e das matérias-primas estratégicas.',
      'O evento contou com a participação da embaixadora da República de Angola em Espanha, Balbina Malheiros Dias da Silva, e do ministro dos recursos minerais, Petróleo e Gás de Angola, Diamantino Pedro Azevedo. Estiveram também presentes representantes institucionais, empresas e peritos ligados ao setor extrativo.',
      'A abertura institucional esteve a cargo de Ángel Asensio, que destacou que Angola “se consolida como um dos mercados mais interessantes da África Subsaariana”, sublinhando as suas previsões de crescimento económico, situadas entre os 4 % e os 5 %, bem como a sua crescente relevância internacional no mercado dos minerais e das matérias-primas estratégicas.',
      'O presidente da Câmara de Comércio de Madrid, Ángel Asensio, destacou ainda o crescente interesse que Angola desperta nas empresas espanholas. Sublinhou ainda as oportunidades que o país oferece em áreas como a mineração, a energia, as infraestruturas, a engenharia, as tecnologias da informação, o ambiente e os serviços especializados.',
      'Posteriormente, interveio a Embaixadora da República de Angola no Reino de Espanha, Balbina Malheiros Dias da Silva, que reafirmou o compromisso do Governo de Angola com a inovação, a transformação e a modernização do sector dos recursos minerais, Petróleo e Gás, colocando o foco na geração de benefícios recíprocos e sustentáveis através da cooperação internacional e da captação de investimento estrangeiro.',
      'A importância e a intervenção central do encontro foi realizada por Diamantino Pedro Azevedo, que transmitiu aos participantes a visão estratégica do Executivo angolano para o desenvolvimento do sector extractivo e energético.',
      'Durante a sua exposição, o ministro destacou a estabilidade política, jurídica e fiscal do país como elemento essencial para atrair investimentos de longo prazo e recordou que Angola está a impulsionar profundas reformas estruturais orientadas para reforçar a credibilidade institucional e gerar um ambiente favorável aos negócios internacionais.',
      '“O futuro é definido pelo gás”, afirmou o ministro, apontando este recurso como um dos pilares estratégicos da industrialização de Angola e do seu processo de diversificação económica.',
      'Da mesma forma, fez especial referência ao papel dos minerais críticos e estratégicos no contexto da transição energética global, defendendo um modelo de desenvolvimento baseado na sustentabilidade e no fortalecimento da indústria local. Neste sentido, sublinhou que “a riqueza de um recurso está na sua capacidade de gerar riqueza onde é extraído”.',
      'O ministro insistiu ainda que “não há investimento sem credibilidade e não há credibilidade sem reformas”, definindo Espanha como “um parceiro natural” para Angola e destacando que o país africano procura “mais do que investimento, parceiros de longo prazo”.',
      'A jornada terminou com uma mesa-redonda moderada por Juan Carlos Rodríguez-Ovejero, Senior Advisor in Extractive Industries da SATEC, seguida de um espaço de networking entre empresas e instituições, igualmente com intervenções técnicas de Domingos Cordeiro, Luzayadio Dikiesse e Joaquim Leite da Costa.',
      'O programa incluiu apresentações sobre o potencial geológico de Angola, o quadro regulamentar para o investimento estrangeiro e a indústria do diamante. Foram também debatidos os corredores logísticos de Luanda, Lobito e Moçâmedes, bem como os instrumentos europeus de financiamento para projetos relacionados com matérias-primas críticas.',
      'Do mesmo modo, o encontro abordou as possibilidades de colaboração com parceiros locais e o papel das parcerias público-privadas no desenvolvimento de projetos empresariais vinculados ao sector mineiro e às cadeias de valor estratégicas.',
      'Durante estas apresentações foram expostos diferentes mecanismos de colaboração público-privada (PPP), destacando-se o quadro jurídico angolano para associações estratégicas internacionais, a segurança jurídica para investidores e a vontade de promover projectos estruturados com participação de empresas estrangeiras e operadores locais.',
      'As apresentações valorizaram igualmente o potencial geológico de Angola e a informação técnica disponível para investidores internacionais através de organismos como o IGEO, incluindo dados relacionados com prospecção, exploração e oportunidades mineiras.',
      'Um dos blocos de maior interesse esteve relacionado com a indústria diamantífera angolana, onde foram apresentados números de exportação e posicionamento internacional. Segundo os dados apresentados durante o fórum, Angola exportou em 2025 mais de 17,3 milhões de quilates, alcançando um valor superior a 1,760 mil milhões de dólares, tendo os Emirados Árabes Unidos (Dubai), Bélgica e Hong Kong como principais destinos.',
      'A reunião terminou com uma mesa-redonda centrada nos processos de contratação, licitação, exportação e prospecção mineira, bem como nos procedimentos de acesso à informação técnica e geológica disponível para empresas e investidores.',
      'A jornada serviu para reforçar o interesse mútuo de Angola e Espanha em consolidar novas oportunidades de cooperação económica e industrial em sectores estratégicos ligados aos recursos minerais, Petróleo e Gás.',
      'A mensagem final transmitida durante o encontro resumiu o espírito da jornada: Angola possui um enorme potencial mineral e procura parceiros internacionais capazes de contribuir para a diversificação e para o desenvolvimento sustentável do sector mineiro do país.',
      'O Fórum de Negócios e Investimento Angola-Espanha reuniu representantes institucionais, empresas e peritos do sector extrativo para analisar oportunidades de cooperação em recursos minerais, energia, infraestruturas e matérias-primas estratégicas. Com este fórum, a Câmara de Madrid continua a acompanhar as empresas no seu acesso aos mercados internacionais, ligando-as a instituições, parceiros estratégicos e oportunidades de investimento e cooperação empresarial.',
      'SERVIÇOS DE COMUNICAÇÃO INSTITUCIONAL E IMPRENSA DA EMBAIXADA DE ANGOLA NO REINO DE ESPANHA, em Madrid aos 18 de Maio de 2026.'
    ],
    category: 'Economia',
    categoryId: 'economia',
    author: {
      name: 'Serviços de Comunicação e Imprensa',
      role: 'Embaixada de Angola em Espanha',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    date: '18 DE MAIO DE 2026',
    isoDate: '2026-05-18',
    readTime: '6 min de leitura',
    imageUrl: forumRecursosMineraisImg,
    likes: 48,
    commentsCount: 9,
    isFeatured: false,
    isCarousel: false,
    tags: ['Recursos Minerais', 'Petróleo e Gás', 'Câmara de Comércio de Madrid', 'Investimento', 'Economia', 'Corredor do Lobito', 'Espanha-Angola'],
    comments: [
      {
        id: 'c-forum-1',
        author: 'Eng. Manuel de Oliveira',
        role: 'Investidor e Consultor Energético',
        date: '18 de Maio de 2026',
        content: 'Excelente iniciativa em Madrid. A segurança jurídica e a clareza sobre o potencial de gás e minerais críticos são decisivas para os investimentos bilaterais.',
        likes: 14
      }
    ]
  },
  // NOTÍCIA 6: DIA DA MULHER AFRICANA
  {
    id: 'art-dia-mulher-africana',
    title: 'Embaixada de Angola em Espanha assinala o Dia da Mulher Africana com debate, cultura e compromisso com o desenvolvimento do continente',
    subtitle: 'Cerimónia em parceria com a Fundação ConÁfrica contou com reflexão sobre o protagonismo feminino, exposição de Francisca Blázquez e mensagem da Embaixadora Balbina da Silva.',
    description: 'A Embaixada da República de Angola no Reino de Espanha celebrou o Dia da Mulher Africana com debate sobre protagonismo feminino, artes plásticas e compromisso bilateral de empoderamento.',
    fullContent: [
      'Madrid, 31 de julho de 2026 – A Embaixada da República de Angola no Reino de Espanha celebrou, na tarde de sexta-feira, na sua sede, o Dia da Mulher Africana, data instituída a 31 de julho de 1962, durante a Conferência das Mulheres Africanas, realizada em Dar es Salaam, Tanzânia. A cerimónia foi organizada em parceria com a Fundação ConÁfrica e contou com a presença de diplomatas, autoridades, intelectuais, artistas e membros da comunidade na diáspora.',
      'O evento constituiu uma plataforma de reflexão sobre o papel determinante das mulheres na construção de uma África mais justa, próspera e sustentável.',
      'A programação integrou um debate sobre o protagonismo feminino, bem como uma exposição da artista Francisca Blázquez. As suas obras de grande formato integraram a cenografia e conferiram ao momento um forte simbolismo cultural.',
      'Durante o debate, os oradores destacaram os avanços alcançados pelas mulheres africanas nos domínios da educação, empreendedorismo, ciência e governação, sublinhando ainda os desafios que persistem em matéria de igualdade de oportunidades e acesso a direitos.',
      'Foi igualmente reafirmado o compromisso de Angola e de Espanha em promover políticas de inclusão e de empoderamento feminino, tanto a nível nacional como no quadro da cooperação bilateral e multilateral.',
      'A Embaixada de Angola em Espanha, Balbina Malheiros Dias da Silva, no uso da palavra, enalteceu a resiliência e a criatividade das mulheres do continente e apelou ao reforço das parcerias entre instituições, sector privado e sociedade civil para acelerar o desenvolvimento inclusivo em África.',
      'A cerimónia encerrou com um momento cultural que valorizou a diversidade e a riqueza artística do continente, reafirmando a aposta da Embaixada no diálogo, na cultura e na diplomacia como instrumentos de aproximação entre os povos.',
      'Serviços de Comunicação Institucional e Imprensa da Embaixada da República de Angola no Reino de Espanha, em Madrid, aos 31 de julho de 2026.'
    ],
    category: 'Panorama Consular',
    categoryId: 'panorama-consular',
    author: {
      name: 'Serviços de Comunicação e Imprensa',
      role: 'Embaixada de Angola em Espanha',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
    },
    date: '31 DE JULHO DE 2026',
    isoDate: '2026-07-31',
    readTime: '4 min de leitura',
    imageUrl: diaMulherAfricanaImg,
    likes: 52,
    commentsCount: 16,
    isFeatured: false,
    isCarousel: false,
    tags: ['Dia da Mulher Africana', 'Embaixada de Angola', 'Fundação ConÁfrica', 'Empoderamento Feminino', 'Cultura', 'Diplomacia'],
    comments: [
      {
        id: 'c-mulher-1',
        author: 'Dra. Maria Esperança',
        role: 'Membro da Diáspora Angolana em Madrid',
        date: '31 de Julho de 2026',
        content: 'Um momento de enorme orgulho e reflexão profunda. Parabéns à Embaixada e à Embaixadora Balbina da Silva por honrarem a força e determinação da mulher africana.',
        likes: 12
      },
      {
        id: 'c-mulher-2',
        author: 'Carlos Alberto Viana',
        role: 'Associação Cultural ConÁfrica',
        date: '01 de Agosto de 2026',
        content: 'Excelente parceria com a Fundação ConÁfrica. A arte e o debate enriqueceram a celebração desta data histórica.',
        likes: 8
      }
    ]
  }
];
