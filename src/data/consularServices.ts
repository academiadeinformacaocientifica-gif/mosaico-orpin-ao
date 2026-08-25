import { DiplomaticEvent, ConsularService } from '../types';

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

export const consularServicesList: ConsularService[] = [
  {
    id: 'cons-1',
    title: 'Passaporte Ordinário Nacional (Emissão e Renovação)',
    category: 'Passaportes',
    processingTime: '15 a 30 dias úteis',
    fees: 'Tabela Consular em vigor',
    requirements: [
      'Original e cópia do Bilhete de Identidade (BI) angolano válido',
      'Certificado de Inscrição Consular atualizado no Consulado de Madrid',
      'Passaporte anterior (para renovações)',
      '2 Fotografias tipo passe recentes a cores (fundo branco)',
      'Comprovativo de morada de residência em Espanha ou Andorra',
      'Declaração de extravio policial (em caso de roubo ou perda)'
    ],
    description: 'Documento de viagem oficial emitido pelo SME através da Secção Consular da Embaixada para cidadãos nacionais angolanos residentes.',
    downloadableForms: [
      { title: 'Formulário de Pedido de Passaporte (PDF)', filename: 'formulario_passaporte_angola.pdf' },
      { title: 'Termo de Responsabilidade para Menores (PDF)', filename: 'termo_menor_passaporte.pdf' }
    ]
  },
  {
    id: 'cons-2',
    title: 'Visto de Turismo e Negócios para Cidadãos Estrangeiros',
    category: 'Vistos',
    processingTime: '5 a 10 dias úteis (ou Isenção para estadias até 90 dias)',
    fees: 'Isento para turismo até 90 dias para cidadãos da UE / Espanha',
    requirements: [
      'Passaporte com validade mínima de 6 meses à data de entrada',
      'Comprovativo de reserva de alojamento ou carta de acolhimento',
      'Bilhete de passagem de ida e volta (reserva aérea)',
      'Certificado Internacional de Vacinação (Febre Amarela recomendada)',
      'Comprovativo de meios de subsistência suficientes durante a estadia'
    ],
    description: 'Informações sobre a nova política de isenção e simplificação de vistos turísticos para cidadãos espanhóis e europeus que viajam para Angola.',
    downloadableForms: [
      { title: 'Guia do Viajante & Isenção de Vistos (PDF)', filename: 'guia_isencao_vistos_angola.pdf' }
    ]
  },
  {
    id: 'cons-3',
    title: 'Registo de Nascimento e Assento de Menor',
    category: 'Registo Civil',
    processingTime: '10 a 15 dias úteis',
    fees: 'Gratuito até aos 5 anos de idade',
    requirements: [
      'Certidão de Nascimento espanhola ou andorrana (Literal de Nacimiento)',
      'Bilhetes de Identidade / Passaportes de ambos os progenitores',
      'Certidão de Casamento dos pais (se aplicável)',
      'Presença de ambos os pais e da criança no ato consular'
    ],
    description: 'Atribuição da nacionalidade originária e registo oficial no Livro de Nascimentos da República de Angola.',
    downloadableForms: [
      { title: 'Requerimento de Registo de Nascimento (PDF)', filename: 'requerimento_registo_nascimento.pdf' }
    ]
  },
  {
    id: 'cons-4',
    title: 'Inscrição Consular (Matrícula Obrigatória)',
    category: 'Notariado',
    processingTime: '3 a 5 dias úteis (ou no próprio dia)',
    fees: 'Gratuito',
    requirements: [
      'Original do Bilhete de Identidade ou Passaporte angolano',
      'Documento de residência espanhol (TIE / NIE / Certificado UE) ou andorrano',
      '1 Fotografia tipo passe',
      'Comprovativo de morada ou trabalho/estudo'
    ],
    description: 'A matrícula consular é indispensável para a prática de qualquer ato consular e para a proteção diplomática em situação de emergência.',
    downloadableForms: [
      { title: 'Ficha de Inscrição Consular (PDF)', filename: 'ficha_inscricao_consular.pdf' }
    ]
  },
  {
    id: 'cons-5',
    title: 'Procurações, Reconhecimento de Assinatura e Notariado',
    category: 'Notariado',
    processingTime: '24 a 48 horas',
    fees: 'De acordo com o tipo de ato notarial',
    requirements: [
      'Documento de Identificação válido (BI angolano ou Passaporte)',
      'Minuta da procuração em formato editável e impresso',
      'Presença física obrigatória do outorgante para assinatura perante o Cônsul'
    ],
    description: 'Elaboração e autenticação de instrumentos notariais com plena validade jurídica em todo o território da República de Angola.'
  }
];
