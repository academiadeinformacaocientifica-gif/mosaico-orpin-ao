import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ExternalLink, 
  Send, 
  Award, 
  Globe, 
  Landmark, 
  Users, 
  CheckCircle2 
} from 'lucide-react';

interface AboutPageProps {
  onShowToast: (msg: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onShowToast }) => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('Geral');
  const [contactMessage, setContactMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setSubmitted(true);
    onShowToast('A sua mensagem foi enviada com sucesso à Chancelaria Diplomática!');
    setContactName('');
    setContactEmail('');
    setContactMessage('');
  };

  return (
    <div className="animate-in fade-in duration-300">
      {/* CATEGORY HEADER */}
      <div className="category-header bg-white p-6 sm:p-9 rounded-2xl my-6 sm:my-8 border-l-6 border-[#d9251d] shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111] mb-1.5">
            Sobre a Embaixada
          </h1>
          <p className="text-xs sm:text-sm text-[#666]">
            Informações institucionais, história diplomática e dados de contacto da Chancelaria.
          </p>
        </div>
        <div className="category-badge-count bg-[#f0f0f0] px-4 py-2 rounded-full font-semibold text-xs text-[#444] flex items-center gap-2 w-max shrink-0">
          <Landmark className="w-4 h-4 text-[#d9251d]" />
          <span>Missão Diplomática Oficial</span>
        </div>
      </div>

      {/* ABOUT GRID (2 COLUMNS: MAIN + SIDEBAR) */}
      <div className="about-grid grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        
        {/* MAIN COLUMN (2 FR) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* HISTORY & BILATERAL RELATIONS CARD */}
          <div className="about-card bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-[#111] mb-4 pb-3 border-b-2 border-[#f0f0f0] flex items-center gap-2.5">
              <Landmark className="w-5 h-5 text-[#d9251d]" />
              <span>História e Relações Bilaterais</span>
            </h2>
            <div className="space-y-3.5 text-xs sm:text-sm text-[#555] leading-relaxed">
              <p>
                As relações diplomáticas entre a <strong>República de Angola</strong> e o <strong>Reino de Espanha</strong> foram formalmente estabelecidas a <strong>19 de outubro de 1977</strong>, marcando o início de uma trajetória sólida de cooperação mútua, diálogo político e amizade fraterna entre os dois Estados soberanos.
              </p>
              <p>
                A representação diplomática em Madrid tem desempenhado, ao longo das décadas, um papel fundamental no fortalecimento dos laços institucionais, económicos e culturais. O marco da implantação da Chancelaria diplomática consolidou-se com a apresentação das primeiras cartas credenciais, em <strong>maio de 1984</strong>, pelo primeiro Embaixador Extraordinário e Plenipotenciário de Angola em Espanha, <strong>Dr. Fernando França Van-Dúnem</strong>.
              </p>
              <p>
                Desde então, a parceria estratégica entre Angola e Espanha tem-se aprofundado em diversos domínios de interesse comum, promovendo o intercâmbio comercial, o apoio à comunidade angolana residente e a cooperação bilateral em fóruns multilaterais internacionais. A jurisdição da missão diplomática abrange igualmente a representação de Angola junto do <strong>Principado de Andorra</strong>.
              </p>
            </div>

            {/* BOTÃO DE ACESSO AO GOVERNO NA SECÇÃO SOBRE */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-3">
              <a
                href="https://www.governo.gov.ao"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gov-about inline-flex items-center gap-2 bg-[#d9251d] hover:bg-[#b01b14] text-white px-5 py-3 rounded-lg font-semibold text-xs transition-colors shadow-xs"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Portal Institucional</span>
              </a>
            </div>
          </div>

          {/* DIPLOMATIC PILLARS & AREAS OF FOCUS */}
          <div className="about-card bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-[#111] mb-4 pb-3 border-b-2 border-[#f0f0f0] flex items-center gap-2.5">
              <Award className="w-5 h-5 text-[#d9251d]" />
              <span>Pilares de Atuação da Missão Diplomática</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#555]">
              <div className="bg-[#f8f9fa] p-4 rounded-xl border border-gray-200/70">
                <h3 className="font-bold text-gray-900 text-sm mb-1.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#d9251d]" />
                  <span>Diplomacia Económica & Negócios</span>
                </h3>
                <p className="leading-relaxed">
                  Promoção do investimento direto espanhol em setores não petrolíferos: agricultura, logística (Corredor do Lobito), pescas e energia solar.
                </p>
              </div>

              <div className="bg-[#f8f9fa] p-4 rounded-xl border border-gray-200/70">
                <h3 className="font-bold text-gray-900 text-sm mb-1.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#d9251d]" />
                  <span>Apoio Consular & Diáspora</span>
                </h3>
                <p className="leading-relaxed">
                  Emissão de passaportes, vistos, registo civil e proteção jurídica para cidadãos angolanos residentes em Espanha e Andorra.
                </p>
              </div>

              <div className="bg-[#f8f9fa] p-4 rounded-xl border border-gray-200/70">
                <h3 className="font-bold text-gray-900 text-sm mb-1.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#d9251d]" />
                  <span>Intercâmbio Cultural & Académico</span>
                </h3>
                <p className="leading-relaxed">
                  Difusão da literatura, música, cinema e gastronomia de Angola, além de bolsas de estudo e parcerias interuniversitárias.
                </p>
              </div>

              <div className="bg-[#f8f9fa] p-4 rounded-xl border border-gray-200/70">
                <h3 className="font-bold text-gray-900 text-sm mb-1.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#d9251d]" />
                  <span>Cooperação Multilateral</span>
                </h3>
                <p className="leading-relaxed">
                  Articulação em conferências internacionais, compromissos climáticos (ODS 2030) e alianças de segurança no Atlântico Sul.
                </p>
              </div>
            </div>
          </div>

          {/* INTERACTIVE MESSAGE FORM TO EMBASSY */}
          <div className="about-card bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-[#111] mb-2 pb-3 border-b-2 border-[#f0f0f0] flex items-center gap-2.5">
              <Mail className="w-5 h-5 text-[#d9251d]" />
              <span>Contactar a Chancelaria Diplomática</span>
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Envie uma mensagem formal ou pedido de informação à equipa da Embaixada.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Ex: João Baptista Silva"
                    className="w-full p-2.5 text-xs bg-[#f9f9f9] border border-gray-300 rounded-lg outline-none focus:border-[#d9251d] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Correio Eletrónico</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com"
                    className="w-full p-2.5 text-xs bg-[#f9f9f9] border border-gray-300 rounded-lg outline-none focus:border-[#d9251d] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Assunto / Departamento</label>
                <select
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  className="w-full p-2.5 text-xs bg-[#f9f9f9] border border-gray-300 rounded-lg outline-none focus:border-[#d9251d]"
                >
                  <option value="Geral">Informações Gerais e Institucionais</option>
                  <option value="Consular">Assuntos Consulares e Vistos</option>
                  <option value="Economico">Gabinete Económico e Investimento</option>
                  <option value="Cultural">Sector Cultural e Revista Mosaico</option>
                  <option value="Imprensa">Gabinete de Imprensa e Comunicação</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mensagem</label>
                <textarea
                  rows={4}
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Escreva a sua mensagem com clareza..."
                  className="w-full p-2.5 text-xs bg-[#f9f9f9] border border-gray-300 rounded-lg outline-none focus:border-[#d9251d] resize-none"
                />
              </div>

              <button
                type="submit"
                className="bg-[#d9251d] hover:bg-[#b01b14] text-white text-xs font-bold px-5 py-3 rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submeter Mensagem</span>
              </button>

              {submitted && (
                <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 p-3 rounded-lg border border-emerald-200 mt-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Mensagem registada no protocolo consular. Entraremos em contacto brevemente.</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* SIDEBAR COLUMN (1 FR) */}
        <div className="about-sidebar space-y-6">
          
          {/* LOCATION & CONTACT CARD */}
          <div className="about-card bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
            <h2 className="text-base sm:text-lg font-bold text-[#111] mb-3 pb-3 border-b-2 border-[#f0f0f0] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#d9251d]" />
              <span>Localização e Contactos</span>
            </h2>
            <p className="text-xs text-[#555] leading-relaxed mb-4">
              A Chancelaria da Embaixada da República de Angola no Reino de Espanha está estrategicamente situada no centro de Madrid, no prestigiado Bairro de Salamanca.
            </p>
            
            <ul className="contact-info-list space-y-4 text-xs text-[#444]">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#d9251d] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-gray-900 mb-0.5 text-xs">Endereço Oficial</strong>
                  Calle de Lagasca, nº 88, 2ª Planta, 28001 Madrid, Espanha
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#d9251d] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-gray-900 mb-0.5 text-xs">Telefones Centrais</strong>
                  +34 91 435 61 66<br />+34 91 435 64 30
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#d9251d] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-gray-900 mb-0.5 text-xs">Correio Eletrónico</strong>
                  <span className="break-all">embaixada.espanha@mirex.gov.ao</span><br />
                  <span className="break-all text-gray-500">gabembajador@embajadadeangola.com</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#d9251d] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-gray-900 mb-0.5 text-xs">Horário de Funcionamento</strong>
                  Segunda a sexta-feira, das 09:00 às 14:00 (Fuso horário de Madrid)
                </div>
              </li>
            </ul>
          </div>

          {/* JURISDICTION & DIPLOMATIC ACCREDITATION */}
          <div className="about-card bg-gradient-to-br from-[#1c2028] to-[#111317] text-white p-6 rounded-2xl shadow-sm border border-gray-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#ffcc00] mb-2 flex items-center gap-1.5">
              <Globe className="w-4 h-4" />
              <span>Circunscrição & Jurisdição</span>
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              A Missão Diplomática em Madrid detém jurisdição em todo o território espanhol e jurisdição concorrente no <strong>Principado de Andorra</strong>, prestando serviços consulares integrais e promovendo as relações bilaterais de amizade e cooperação.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
