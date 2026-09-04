/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ConsularDocument {
  id: string;
  title: string;
  code: string;
  category: 'vistos' | 'identidade' | 'notariado' | 'comunidade' | 'viagem';
  categoryLabel: string;
  description: string;
  fileFormat: 'PDF' | 'DOCX';
  fileSize: string;
  requirements: string[];
  instructions: string;
  targetAudience: 'Cidadãos Angolanos' | 'Cidadãos Estrangeiros' | 'Geral';
  downloadFileName: string;
  badge?: string;
}

export interface ConsularService {
  id: string;
  title: string;
  category: 'vistos' | 'identidade' | 'passaportes' | 'notariado' | 'comunidade';
  categoryLabel: string;
  summary: string;
  processingTime: string;
  feeInfo: string;
  requirements: string[];
  steps: string[];
  associatedDocuments: string[]; // document IDs
  observations?: string;
}

export const consularDocuments: ConsularDocument[] = [
  {
    id: 'doc-visto-solicitacao',
    title: 'Formulário Oficial de Solicitação de Visto para Angola',
    code: 'MOD-CONS-01',
    category: 'vistos',
    categoryLabel: 'Vistos & Entrada',
    description:
      'Formulário obrigatório para requerimento de vistos consulares de Turismo, Negócios, Trabalho, Curta Duração e Trânsito.',
    fileFormat: 'PDF',
    fileSize: '320 KB',
    requirements: [
      'Passaporte com validade mínima de 6 meses e 2 páginas em branco',
      'Duas (2) fotografias tipo passe recentes e a cores com fundo branco',
      'Comprovativo de reserva de voo de ida e volta',
      'Comprovativo de alojamento (reserva de hotel ou Termo de Responsabilidade reconhecido)',
      'Certificado Internacional de Vacinação (Febre Amarela obrigatória)',
      'Comprovativo de meios de subsistência durante a estadia em território angolano',
    ],
    instructions:
      'Preencha todos os campos em maiúsculas de forma legível. Não rasure o documento. Junte a documentação probatória exigida para o tipo específico de visto solicitado.',
    targetAudience: 'Cidadãos Estrangeiros',
    downloadFileName: 'Modelo_Solicitacao_Visto_Angola_Consulado.pdf',
    badge: 'Mais Solicitado',
  },
  {
    id: 'doc-bi-renovacao',
    title: 'Ficha de Requerimento para Emissão / Renovação de Bilhete de Identidade (BI)',
    code: 'MOD-CONS-02',
    category: 'identidade',
    categoryLabel: 'Identificação & Registo Civil',
    description:
      'Requerimento oficial para pedido de emissão, renovação ou 2ª via do Bilhete de Identidade nacional angolano no posto biométrico consular.',
    fileFormat: 'PDF',
    fileSize: '280 KB',
    requirements: [
      'Original ou cópia do Bilhete de Identidade anterior (mesmo caducado)',
      'Cópia integral do Assento de Nascimento (se aplicável para 1ª emissão)',
      'Passaporte nacional angolano válido',
      'Comprovativo de inscrição consular e morada atualizada em Espanha ou Andorra',
      'Presença física obrigatória do requerente para recolha de dados biométricos',
    ],
    instructions:
      'A emissão e renovação de BI exige agendamento prévio para recolha presencial de impressões digitais e fotografia facial no posto consular de Madrid.',
    targetAudience: 'Cidadãos Angolanos',
    downloadFileName: 'Requerimento_Renovacao_BI_Angola.pdf',
    badge: 'Obrigatório Presencial',
  },
  {
    id: 'doc-inscricao-consular',
    title: 'Ficha de Inscrição Consular e Atualização Cadastral',
    code: 'MOD-CONS-03',
    category: 'comunidade',
    categoryLabel: 'Comunidade & Registo',
    description:
      'Registo consular essencial que garante proteção diplomática, apoio em emergências e acesso facilitado a todos os serviços da Embaixada.',
    fileFormat: 'PDF',
    fileSize: '240 KB',
    requirements: [
      'Passaporte nacional angolano válido',
      'Bilhete de Identidade nacional ou Certidão de Nascimento',
      'Duas (2) fotografias tipo passe recentes',
      'Título de residência em Espanha (NIE / TIE ou comprovativo de pedido)',
      'Atestado ou volante de Empadronamento na cidade de residência',
    ],
    instructions:
      'O Cartão de Inscrição Consular é o documento que atesta a residência do cidadão angolano na jurisdição da Embaixada em Madrid. Deve ser renovado a cada 3 anos.',
    targetAudience: 'Cidadãos Angolanos',
    downloadFileName: 'Ficha_Inscricao_Consular_Angola_Espanha.pdf',
    badge: 'Gratuito',
  },
  {
    id: 'doc-termo-responsabilidade',
    title: 'Minuta de Termo de Responsabilidade e Garantia de Alojamento',
    code: 'MOD-CONS-04',
    category: 'vistos',
    categoryLabel: 'Vistos & Entrada',
    description:
      'Declaração formal subscrita por pessoa singular residente ou entidade sediada em Angola para acolhimento e garantia financeira de visitantes.',
    fileFormat: 'PDF',
    fileSize: '215 KB',
    requirements: [
      'Identificação completa da entidade acolhedora (pessoa singular ou coletiva em Angola)',
      'Assinatura reconhecida em cartório notarial em Angola ou na Embaixada',
      'Comprovativo de endereço de residência ou sede social em Angola',
      'Cópia do passaporte do cidadão convidado com datas previstas de estadia',
    ],
    instructions:
      'Utilize este modelo quando o alojamento do visitante for assegurado por particulares ou entidades empresariais, em alternativa à reserva de unidade hoteleira.',
    targetAudience: 'Geral',
    downloadFileName: 'Termo_Responsabilidade_Alojamento_Angola.pdf',
  },
  {
    id: 'doc-procuracao-minuta',
    title: 'Modelo de Procuração e Solicitação de Atos Notariais',
    code: 'MOD-CONS-05',
    category: 'notariado',
    categoryLabel: 'Atos Notariais',
    description:
      'Minuta orientativa para elaboração de procurações com plenos poderes ou poderes especiais para representação jurídica e bancária em Angola.',
    fileFormat: 'PDF',
    fileSize: '260 KB',
    requirements: [
      'Identificação rigorosa do Outorgante (Passaporte/BI e morada)',
      'Identificação completa do Outorgado em Angola (Nome, BI, estado civil, residência)',
      'Descrição detalhada e inequívoca dos poderes conferidos (bancários, compra/venda, heranças)',
      'Presença física do outorgante para reconhecimento presencial de assinatura',
    ],
    instructions:
      'As procurações públicas só têm plena validade jurídica após leitura, verificação de identidade e assinatura presencial perante o funcionário consular competente.',
    targetAudience: 'Geral',
    downloadFileName: 'Minuta_Procuracao_Atos_Notariais_Consulado.pdf',
  },
  {
    id: 'doc-salvo-conduto',
    title: 'Requerimento de Salvo-Conduto (Título de Viagem de Emergência)',
    code: 'MOD-CONS-06',
    category: 'viagem',
    categoryLabel: 'Documentos de Viagem',
    description:
      'Documento de viagem urgente emitido exclusivamente para regresso a Angola em caso de extravio, furto ou caducidade do passaporte.',
    fileFormat: 'PDF',
    fileSize: '210 KB',
    requirements: [
      'Auto de denúncia policial (em caso de furto ou extravio de passaporte)',
      'Cópia do passaporte anterior ou do Bilhete de Identidade angolano',
      'Duas (2) fotografias tipo passe',
      'Reserva confirmada de voo direto ou com escala técnica para Luanda',
    ],
    instructions:
      'O Salvo-Conduto é válido apenas para uma única viagem de regresso imediato à República de Angola, não permitindo deslocações a outros países terceiros.',
    targetAudience: 'Cidadãos Angolanos',
    downloadFileName: 'Requerimento_Salvo_Conduto_Emergencia.pdf',
    badge: 'Urgência',
  },
  {
    id: 'doc-registo-nascimento',
    title: 'Requerimento de Registo e Transcrição de Assento de Nascimento',
    code: 'MOD-CONS-07',
    category: 'identidade',
    categoryLabel: 'Identificação & Registo Civil',
    description:
      'Pedido de atribuição da nacionalidade angolana e registo de filhos de cidadãos angolanos nascidos em hospitais do Reino de Espanha.',
    fileFormat: 'PDF',
    fileSize: '290 KB',
    requirements: [
      'Certidão Literal de Nascimento espanhola devidamente apostilhada (Apostila de Haia)',
      'Bilhetes de Identidade e Passaportes dos progenitores angolanos',
      'Cartão de inscrição consular de pelo menos um dos progenitores',
      'Presença de ambos os pais e da criança (ou justificação legal com procuração)',
    ],
    instructions:
      'O registo de nascimento garante a nacionalidade angolana originária e permite a subsequente emissão do primeiro Passaporte e Bilhete de Identidade.',
    targetAudience: 'Cidadãos Angolanos',
    downloadFileName: 'Requerimento_Registo_Nascimento_Consular.pdf',
  },
];

export const consularServices: ConsularService[] = [
  {
    id: 'serv-vistos',
    title: 'Vistos de Entrada para a República de Angola',
    category: 'vistos',
    categoryLabel: 'Vistos & Turismo',
    summary:
      'Processamento de pedidos de vistos consulares para turismo, negócios, trabalho, curta duração e visitas familiares a Angola.',
    processingTime: '5 a 8 dias úteis (Turismo/Negócios) | 15 dias (Trabalho)',
    feeInfo: 'Consultar tabela oficial de emolumentos consulares em vigor',
    requirements: [
      'Passaporte válido por mais de 6 meses com páginas suficientes',
      'Formulário consular preenchido e assinado (MOD-CONS-01)',
      'Certificado Internacional de Vacinação (Febre Amarela)',
      'Reserva de hotel ou Termo de Responsabilidade com firma reconhecida',
      'Comprovativo de rendimentos ou meios de subsistência',
    ],
    steps: [
      'Descarregar e preencher o Modelo de Solicitação de Visto (MOD-CONS-01)',
      'Reunir todos os comprovativos exigidos (passaporte, vacinas, bilhetes, alojamento)',
      'Efetuar o agendamento através do sistema ou enviar pedido para o e-mail consular',
      'Comparecer na Secção Consular em Madrid para entrega e pagamento de emolumentos',
      'Levantar o passaporte com a vinheta do visto no prazo estipulado',
    ],
    associatedDocuments: ['doc-visto-solicitacao', 'doc-termo-responsabilidade'],
    observations:
      'Ao abrigo do Decreto Presidencial nº 189/23, cidadãos com passaporte espanhol e da União Europeia beneficiam de isenção de visto para estadias de turismo até 30 dias por entrada (máximo 90 dias por ano), mantendo-se a obrigatoriedade de apresentação de passaporte válido e comprovativo de estadia na fronteira.',
  },
  {
    id: 'serv-bi',
    title: 'Renovação e Emissão do Bilhete de Identidade',
    category: 'identidade',
    categoryLabel: 'Bilhete de Identidade & Registo',
    summary:
      'Posto oficial de recolha biométrica para emissão, renovação e 2ª via do Bilhete de Identidade nacional de cidadãos angolanos.',
    processingTime: '20 a 30 dias (produção centralizada em Luanda)',
    feeInfo: 'Taxa consular para renovação ou 2ª via',
    requirements: [
      'BI anterior (original ou cópia) ou Certidão de Nascimento',
      'Passaporte angolano atualizado',
      'Comprovativo de inscrição consular atualizada em Espanha',
      'Presença presencial obrigatória para biometria (impressões e foto)',
    ],
    steps: [
      'Descarregar a Ficha de Requerimento de BI (MOD-CONS-02)',
      'Verificar a validade da inscrição consular e atualizar se necessário',
      'Agendar marcação presencial para a recolha de dados biométricos',
      'Comparecer na Embaixada em Madrid com os documentos originais',
      'Aguardar notificação por e-mail/SMS para levantamento do cartão emitido',
    ],
    associatedDocuments: ['doc-bi-renovacao', 'doc-inscricao-consular'],
    observations:
      'Os menores de idade devem comparecer acompanhados por um dos progenitores munido de documento de identificação angolano válido.',
  },
  {
    id: 'serv-passaporte',
    title: 'Emissão e Renovação de Passaportes Nacionais',
    category: 'passaportes',
    categoryLabel: 'Passaportes & Viagem',
    summary:
      'Tramitação e recolha de pedidos de Passaporte Ordinário Angolano para cidadãos residentes em Espanha e Andorra.',
    processingTime: '30 a 45 dias úteis (emissão central pelo SME em Angola)',
    feeInfo: 'Emolumento oficial do Serviço de Migração e Estrangeiros (SME)',
    requirements: [
      'Bilhete de Identidade angolano válido (obrigatório)',
      'Passaporte angolano caducado ou a caducar (para renovação)',
      'Cartão de inscrição consular válido',
      'Três (3) fotografias recentes tipo passe com fundo branco',
      'Comprovativo de profissão ou ocupação no estrangeiro',
    ],
    steps: [
      'Garantir que o Bilhete de Identidade angolano se encontra válido',
      'Preencher o formulário do SME disponibilizado no atendimento consular',
      'Comparecer no posto de Madrid para captura de fotografia e impressões digitais',
      'Efetuar o pagamento dos emolumentos por transferência ou cartão bancário',
      'Acompanhar o estado do processo até à receção do passaporte emitido',
    ],
    associatedDocuments: ['doc-salvo-conduto', 'doc-inscricao-consular'],
    observations:
      'Em caso de viagem urgente com passaporte extraviado, pode ser solicitado paralelamente um Salvo-Conduto de Emergência.',
  },
  {
    id: 'serv-notariado',
    title: 'Atos Notariais, Procurações e Legalizações',
    category: 'notariado',
    categoryLabel: 'Notariado & Reconhecimentos',
    summary:
      'Reconhecimento de assinaturas, lavratura de procurações públicas, autenticações de fotocópias e legalização de documentos civis e académicos.',
    processingTime: '2 a 4 dias úteis',
    feeInfo: 'Variável consoante o número de assinaturas e páginas do instrumento notarial',
    requirements: [
      'Documento de identificação válido do requerente (BI ou Passaporte)',
      'Texto da minuta da procuração em língua portuguesa',
      'Identificação completa do mandatário (procurador) em Angola',
      'Documentos originais a autenticar ou legalizar',
    ],
    steps: [
      'Descarregar e preparar a Minuta de Procuração (MOD-CONS-05)',
      'Enviar previamente o rascunho por e-mail para validação jurídica pelos serviços consulares',
      'Agendar atendimento presencial na Secção Consular',
      'Assinar presencialmente perante o funcionário consular credenciado',
      'Levantar o documento original legalizado com selo branco e vinheta oficial',
    ],
    associatedDocuments: ['doc-procuracao-minuta'],
  },
  {
    id: 'serv-comunidade',
    title: 'Inscrição Consular e Apoio à Comunidade',
    category: 'comunidade',
    categoryLabel: 'Apoio à Comunidade',
    summary:
      'Inscrição diplomática, emissão de Certificado de Residência Consular para isenção aduaneira de bens pessoais e proteção ao cidadão.',
    processingTime: '24 a 48 horas',
    feeInfo: 'Inscrição Consular: Gratuita | Certificado de Residência: Sob consulta',
    requirements: [
      'Passaporte angolano ou Bilhete de Identidade',
      'Duas fotografias a cores tipo passe',
      'Empadronamiento ou certificado de residência emitido pela autoridade local espanhola',
      'Cópia do NIE / TIE',
    ],
    steps: [
      'Descarregar a Ficha de Inscrição Consular (MOD-CONS-03)',
      'Preencher com todos os contactos atualizados (morada, telefone, e-mail)',
      'Submeter no balcão consular ou via correio eletrónico com os anexos exigidos',
      'Levantamento do Cartão de Inscrição Consular',
    ],
    associatedDocuments: ['doc-inscricao-consular'],
    observations:
      'O Certificado de Residência Consular para efeitos de Bagagem de Mudança (regresso definitivo a Angola com isenção de direitos aduaneiros) exige comprovação de residência legal continuada de pelo menos 12 meses no estrangeiro.',
  },
];

export const consularInfo = {
  sectionTitle: 'Secção Consular da Embaixada da República de Angola em Espanha',
  jurisdiction: 'Reino de Espanha e Principado de Andorra',
  address: 'Calle Serrano, 64, 2º Andar, 28001 Madrid, Espanha',
  metroStations: 'Metro: Rubén Darío (Linha 5), Núñez de Balboa (Linhas 5 e 9) ou Serrano (Linha 4)',
  schedulePublic: 'Segunda a Sexta-feira: 09h30 às 13h30',
  scheduleDeliveries: 'Levantamento de Documentos: 14h00 às 15h30',
  closedDays: 'Encerrado aos sábados, domingos e feriados oficiais de Angola e Espanha',
  phone: '(+34) 914 356 166',
  emailConsular: 'servicos.consulares@embaixadadeangola.es',
  emailGeral: 'embaixada@embaixadadeangola.es',
  website: 'https://embaixadadeangola.es',
};
