import { DiplomaticEvent } from '../types';

export const upcomingEvents: DiplomaticEvent[] = [
  {
    id: 'ev-1',
    title: 'Ciclo de Cinema Angolano: Novas Vozes e Narrativas',
    category: 'Cultura',
    date: '28 de Agosto de 2026',
    time: '18:30 - 21:00 CEST',
    location: 'Cineteca Madrid - Matadero',
    city: 'Madrid',
    description: 'Projeção de três curtas-metragens premiadas de realizadores angolanos, seguida de debate com a realizadora convidada e tertúlia cultural com apoio da Embaixada.',
    organizer: 'Embaixada de Angola & Cineteca Madrid',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80',
    registrationRequired: true
  },
  {
    id: 'ev-2',
    title: 'Mesa Redonda: Oportunidades no Corredor do Lobito e Logística Sustentável',
    category: 'Comércio',
    date: '04 de Setembro de 2026',
    time: '10:00 - 13:00 CEST',
    location: 'Cámara Oficial de Comercio de España',
    city: 'Madrid',
    description: 'Encontro com empresários dos setores ferroviário, portuário e agroalimentar espanhóis interessados em parcerias diretas no mercado angolano.',
    organizer: 'Gabinete Económico da Embaixada & Câmara de Comércio',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80',
    registrationRequired: true
  },
  {
    id: 'ev-3',
    title: 'Noite do Semba & Kizomba: Dança, Ritmos e Gastronomia',
    category: 'Cultura',
    date: '12 de Setembro de 2026',
    time: '19:00 - 23:30 CEST',
    location: 'Centro Cultural Ibero-Americano',
    city: 'Barcelona',
    description: 'Oficina de passos tradicionais de Semba, demonstrações de dança ao vivo e degustação de especialidades gastronómicas angolanas.',
    organizer: 'Associação da Comunidade Angolana na Catalunha',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    registrationRequired: false
  },
  {
    id: 'ev-4',
    title: 'Jornada Informativa: Bolsas de Estudo e Mobilidade Universitária Ibero-Angolana',
    category: 'Académico',
    date: '18 de Setembro de 2026',
    time: '16:00 - 18:00 CEST',
    location: 'Auditório da Chancelaria (Calle Lagasca 88) & Online via Zoom',
    city: 'Madrid / Híbrido',
    description: 'Sessão de esclarecimento sobre programas de bolsas de licenciatura, mestrado e doutoramento para cidadãos angolanos em Espanha e Andorra.',
    organizer: 'Sector de Educação da Embaixada & FUNIBER',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
    registrationRequired: true
  }
];
