import { GalleryItem } from '../types';
import cooperacaoBilateralImg from '../assets/images/Angola e Espanha reforçam cooperação bilateral.jpeg';
import credenciaisBalbinaImg from '../assets/images/credenciais_balbina_silva_1787483613500.jpg.jpeg';
import diaMulherAfricanaImg from '../assets/images/dia_mulher_africana_1787482964722.jpg.jpeg';
import forumRecursosMineraisImg from '../assets/images/forum_recursos_minerais_17487483460820.jpg.jpeg';
import iconMosaicoSquareImg from '../assets/images/icon_mosaico_square_1787501925065.jpg';
import imexBarcelonaImg from '../assets/images/imex_barcelona_angola_1787497730037.jpg.jpeg';
import independencia50Img from '../assets/images/independencia_50_madrid_1787496814208.jpg.jpeg';
import logoMosaicoImg from '../assets/images/logo_mosaico.jpeg';
import onuTurismoImg from '../assets/images/onu_turismo_madrid_1787497879619.jpg.jpeg';
import vityNsalambiImg from '../assets/images/vity_nsalambi_sagrada_familia_1787497295778.jpg.jpeg';

export const initialGalleryItems: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Cooperação Bilateral Angola-Espanha em Madrid',
    category: 'Diplomacia',
    date: '4 de Junho, 2026',
    description: 'Reunião de Consultas Políticas ao nível de Secretários de Estado, copresidida por Esmeralda Mendonça e Diego Martínez Belío, reforçando parcerias estratégicas.',
    image: cooperacaoBilateralImg,
    isPublished: true,
  },
  {
    id: 'gal-2',
    title: 'Apresentação de Cartas Credenciais',
    category: 'Institucional',
    date: '2026',
    description: 'Cerimónia oficial de acreditação diplomática da Embaixada da República de Angola no Reino de Espanha.',
    image: credenciaisBalbinaImg,
    isPublished: true,
  },
  {
    id: 'gal-3',
    title: 'Celebração do Dia da Mulher Africana',
    category: 'Cultura',
    date: '2026',
    description: 'Encontro comemorativo em Madrid destacando o contributo fulcral das mulheres angolanas para o desenvolvimento social e cultural.',
    image: diaMulherAfricanaImg,
    isPublished: true,
  },
  {
    id: 'gal-4',
    title: 'Fórum de Recursos Minerais e Investimento',
    category: 'Economia',
    date: '2026',
    description: 'Apresentação de oportunidades de investimento em sectores estruturantes, transição energética e mineração sustentável.',
    image: forumRecursosMineraisImg,
    isPublished: true,
  },
  {
    id: 'gal-5',
    title: 'Selo Oficial Mosaico',
    category: 'Institucional',
    date: '2026',
    description: 'Selo gráfico e representação oficial da plataforma de difusão diplomática e consular.',
    image: iconMosaicoSquareImg,
    isPublished: true,
  },
  {
    id: 'gal-6',
    title: 'Participação na Feira IMEX Barcelona',
    category: 'Economia',
    date: '2026',
    description: 'Promoção do ambiente de negócios de Angola, atração de investimento estrangeiro e fomento de parcerias com o empresariado catalão.',
    image: imexBarcelonaImg,
    isPublished: true,
  },
  {
    id: 'gal-7',
    title: 'Comemorações dos 50 Anos da Independência',
    category: 'Cultura',
    date: '2026',
    description: 'Conferências, mostras históricas e celebrações solenes alusivas ao cinquentenário da independência nacional em Madrid.',
    image: independencia50Img,
    isPublished: true,
  },
  {
    id: 'gal-8',
    title: 'Logótipo Oficial Revista Mosaico',
    category: 'Institucional',
    date: '2026',
    description: 'Identidade visual corporativa da revista oficial e plataforma diplomática da Embaixada de Angola.',
    image: logoMosaicoImg,
    isPublished: true,
  },
  {
    id: 'gal-9',
    title: 'Encontro na Sede da ONU Turismo (Madrid)',
    category: 'Diplomacia',
    date: '2026',
    description: 'Diálogo institucional focado no desenvolvimento do turismo sustentável e projeção internacional de Angola.',
    image: onuTurismoImg,
    isPublished: true,
  },
  {
    id: 'gal-10',
    title: 'Visita Institucional à Sagrada Família (Barcelona)',
    category: 'Turismo & Cultura',
    date: '2026',
    description: 'Intercâmbio cultural e contactos institucionais de alto nível realizados na Catalunha.',
    image: vityNsalambiImg,
    isPublished: true,
  },
];
