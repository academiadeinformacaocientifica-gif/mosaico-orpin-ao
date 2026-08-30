/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  MapPin, 
  Phone, 
  ExternalLink, 
  Send, 
  CheckCircle2, 
  Globe, 
  BookOpen 
} from 'lucide-react';
import { NavPage } from '../types';
import { MosaicoLogo } from './MosaicoLogo';

interface FooterProps {
  onNavigate: (page: NavPage) => void;
  onShowToast: (msg: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onShowToast }) => {
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (!agreed) {
      onShowToast('Por favor, confirme que concorda em receber atualizações diplomáticas.');
      return;
    }
    setSubscribed(true);
    onShowToast('Subscrição efectuada com sucesso no Boletim Mosaico Angolano!');
    setEmail('');
  };

  return (
    <footer style={{ backgroundColor: '#FF1B1A' }} className="bg-[#FF1B1A] text-white mt-16 pt-12 pb-6">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* FOOTER MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
          
          {/* COLUMN 1: BRAND & EMBASSY IDENTITY */}
          <div>
            <div className="relative inline-block mb-3.5 pb-2.5 cursor-pointer" onClick={() => onNavigate('home')}>
              <MosaicoLogo size="md" />
              {/* ANGOLAN FLAG COLOR STRIP ACCENT */}
              <div className="mt-2 w-full h-[4px] rounded-[2px] bg-gradient-to-r from-white via-[#ffcc00] to-black" />
            </div>

            <p className="text-xs text-white/90 leading-relaxed mb-4">
              Revista oficial e plataforma de difusão diplomática, consular e cultural da <strong>Embaixada da República de Angola no Reino de Espanha e Principado de Andorra</strong>.
            </p>

            <div className="flex flex-col gap-2 text-xs text-white/90">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <span>Calle de Lagasca, nº 88, 2ª Planta, 28001 Madrid, Espanha</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-white shrink-0" />
                <span>+34 91 435 61 66 / +34 91 435 64 30</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-white shrink-0" />
                <span>embaixada.espanha@mirex.gov.ao</span>
              </div>
            </div>

            {/* DIRECT GOVERNMENT ACCESS */}
            <div className="mt-4 pt-3 border-t border-white/20">
              <a
                href="https://www.governo.gov.ao"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white hover:text-white/80 font-bold inline-flex items-center gap-1.5 transition-colors underline underline-offset-2"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Portal Institucional</span>
              </a>
            </div>
          </div>

          {/* COLUMN 2: QUICK NAVIGATION */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wide flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-white" />
              <span>Secções & Navegação</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-white/90">
              <button 
                onClick={() => onNavigate('politica')} 
                className="text-left hover:text-white transition-colors py-1 cursor-pointer font-medium"
              >
                Politica
              </button>
              <button 
                onClick={() => onNavigate('angolberica')} 
                className="text-left hover:text-white transition-colors py-1 cursor-pointer font-medium"
              >
                Angolbérica
              </button>
              <button 
                onClick={() => onNavigate('economia')} 
                className="text-left hover:text-white transition-colors py-1 cursor-pointer font-medium"
              >
                Economia
              </button>
              <button 
                onClick={() => onNavigate('panorama-consular')} 
                className="text-left hover:text-white transition-colors py-1 cursor-pointer font-medium"
              >
                Panorama Consular
              </button>
              <button 
                onClick={() => onNavigate('kultura-360')} 
                className="text-left hover:text-white transition-colors py-1 cursor-pointer font-medium"
              >
                Kultura 360
              </button>
              <button 
                onClick={() => onNavigate('turismo')} 
                className="text-left hover:text-white transition-colors py-1 cursor-pointer font-medium"
              >
                Turismo
              </button>
              <button 
                onClick={() => onNavigate('sobre')} 
                className="text-left hover:text-white transition-colors py-1 cursor-pointer font-medium"
              >
                Sobre a Embaixada
              </button>
              <button 
                onClick={() => onNavigate('history')} 
                className="text-left hover:text-white transition-colors py-1 cursor-pointer font-medium"
              >
                História Bilateral
              </button>
              <button 
                onClick={() => onNavigate('edicoes')} 
                className="text-left hover:text-white transition-colors py-1 cursor-pointer font-medium"
              >
                Revista Impressa / PDF
              </button>
              <button 
                onClick={() => onNavigate('galeria')} 
                className="text-left hover:text-white transition-colors py-1 cursor-pointer font-medium"
              >
                Imagens
              </button>
              <button 
                onClick={() => onNavigate('videos')} 
                className="text-left hover:text-white transition-colors py-1 cursor-pointer font-medium"
              >
                Vídeos
              </button>
            </div>
          </div>

          {/* COLUMN 3: NEWSLETTER SUBSCRIPTION */}
          <div>
            <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wide flex items-center gap-2">
              <Mail className="w-4 h-4 text-white" />
              <span>Subscrever Boletim Informativo</span>
            </h4>
            <p className="text-xs text-white/90 mb-3 leading-relaxed">
              Receba comunicações oficiais, novidades consulares, oportunidades de investimento e agenda cultural diretamente no seu e-mail.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="O seu e-mail de contacto..."
                  required
                  className="flex-grow p-2.5 text-xs border border-white/30 rounded-md outline-none bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-white"
                />
                <button
                  type="submit"
                  className="bg-black/30 hover:bg-black/50 text-white border border-white/20 px-4 py-2.5 rounded-md font-semibold text-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Aderir</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-white/90 mt-1">
                <input
                  type="checkbox"
                  id="terms-footer"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  required
                  className="w-3.5 h-3.5 accent-black cursor-pointer"
                />
                <label htmlFor="terms-footer" className="cursor-pointer">
                  Concordo em receber atualizações diplomáticas e culturais.
                </label>
              </div>

              {subscribed && (
                <div className="flex items-center gap-1.5 text-xs text-white bg-black/30 p-2 rounded-md border border-white/20 mt-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>Subscrição registada. Obrigado pelo seu interesse!</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* COPYRIGHT BOTTOM SECTION INSIDE THE UNIFIED RED FOOTER */}
        <div className="pt-6 border-t border-white/20 text-center text-xs text-white/90">
          <p>© {new Date().getFullYear()} Mosaico — Embaixada da República de Angola no Reino de Espanha e Principado de Andorra. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
