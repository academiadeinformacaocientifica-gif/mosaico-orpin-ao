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
import { NavPage, EmbassyInfo } from '../types';
import { DEFAULT_EMBASSY_INFO } from '../data/embassyData';
import { MosaicoLogo } from './MosaicoLogo';
import { sanitizeEmail, isValidEmail, isSafeUrl } from '../lib/sanitizer';
import { consumeRateLimit, checkCooldown } from '../lib/rateLimiter';

interface FooterProps {
  onNavigate: (page: NavPage) => void;
  onShowToast: (msg: string) => void;
  embassyInfo?: EmbassyInfo;
  onOpenPrivacy: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onShowToast, embassyInfo, onOpenPrivacy }) => {
  const info = embassyInfo || DEFAULT_EMBASSY_INFO;
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

    const cd = checkCooldown('newsletter', 3);
    if (!cd.allowed) {
      onShowToast(`Por favor aguarde ${cd.retryAfterSeconds}s antes de nova tentativa.`);
      return;
    }

    const cleanEmail = sanitizeEmail(email);
    if (!isValidEmail(cleanEmail)) {
      onShowToast('Por favor, introduza um endereço de e-mail válido.');
      return;
    }

    const rl = consumeRateLimit('newsletter', 3, 60);
    if (!rl.allowed) {
      onShowToast(`Limite temporário de subscrições atingido. Tente novamente em ${rl.retryAfterSeconds}s.`);
      return;
    }

    setSubscribed(true);
    onShowToast('Subscrição efectuada com sucesso no Boletim Mosaico Angola!');
    setEmail('');
  };

  return (
    <footer style={{ backgroundColor: '#FF1B1A' }} className="bg-[#FF1B1A] text-white mt-16 pt-12 pb-6">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* FOOTER MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
          
          {/* COLUMN 1: BRAND & EMBASSY IDENTITY */}
          <div>
            <div className="relative inline-block mb-4 cursor-pointer" onClick={() => onNavigate('home')}>
              <MosaicoLogo size="md" />
            </div>

            <p className="text-xs text-white/90 leading-relaxed mb-4">
              Revista oficial e plataforma de difusão diplomática, consular e cultural da <strong>{info.name}</strong>.
            </p>

            <div className="flex flex-col gap-2 text-xs text-white/90">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <span>
                  {info.addressStreet}
                  {info.addressDetails ? `, ${info.addressDetails}` : ''}
                  {info.postalCode ? `, ${info.postalCode}` : ''} {info.city}, {info.country}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-white shrink-0" />
                <span>
                  {info.phonePrimary}
                  {info.phoneSecondary ? ` / ${info.phoneSecondary}` : ''}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-white shrink-0" />
                <span className="break-all">{info.emailGeneral}</span>
              </div>
            </div>

            {/* DIRECT GOVERNMENT ACCESS */}
            <div className="mt-4 pt-3 border-t border-white/20">
              <a
                href={info.institutionalPortal}
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
                onClick={() => onNavigate('maravilhas')} 
                className="text-left hover:text-white transition-colors py-1 cursor-pointer font-medium text-amber-200"
              >
                7 Maravilhas de Angola
              </button>
              <button 
                onClick={() => onNavigate('sobre')} 
                className="text-left hover:text-white transition-colors py-1 cursor-pointer font-medium"
              >
                Sobre a Embaixada
              </button>
              <button 
                onClick={() => onNavigate('agenda-cultural')} 
                className="text-left hover:text-white transition-colors py-1 cursor-pointer font-medium text-amber-100"
              >
                Agenda Cultural
              </button>
              <button 
                onClick={() => onNavigate('agenda-diplomatica')} 
                className="text-left hover:text-white transition-colors py-1 cursor-pointer font-medium text-amber-100"
              >
                Agenda Diplomática
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
                  maxLength={254}
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

            {/* SOCIAL MEDIA LINKS */}
            <div className="mt-5 pt-4 border-t border-white/20">
              <p className="text-xs font-bold text-white uppercase tracking-wide mb-2.5">
                Redes Sociais
              </p>
              <div className="flex items-center gap-2.5">
                {[
                  {
                    name: 'Facebook',
                    href: info.socialFacebook || DEFAULT_EMBASSY_INFO.socialFacebook || 'https://www.facebook.com',
                    icon: (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
                      </svg>
                    ),
                  },
                  {
                    name: 'Instagram',
                    href: info.socialInstagram || DEFAULT_EMBASSY_INFO.socialInstagram || 'https://www.instagram.com',
                    icon: (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                    ),
                  },
                  {
                    name: 'LinkedIn',
                    href: info.socialLinkedin || DEFAULT_EMBASSY_INFO.socialLinkedin || 'https://www.linkedin.com',
                    icon: (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    ),
                  },
                  {
                    name: 'X',
                    href: info.socialX || DEFAULT_EMBASSY_INFO.socialX || 'https://x.com',
                    icon: (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    ),
                  },
                ]
                  .filter((social) => isSafeUrl(social.href))
                  .map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Seguir no ${social.name}`}
                      title={social.name}
                      className="w-9 h-9 rounded-lg bg-black/25 hover:bg-white text-white hover:text-[#FF1B1A] border border-white/25 flex items-center justify-center transition-all duration-200 shadow-xs hover:-translate-y-0.5"
                    >
                      {social.icon}
                    </a>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* COPYRIGHT BOTTOM SECTION INSIDE THE UNIFIED RED FOOTER */}
        <div className="pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/90">
          <p>© {new Date().getFullYear()} Mosaico Angola — Embaixada da República de Angola no Reino de Espanha e Principado de Andorra. Todos os direitos reservados.</p>
          <button
            onClick={onOpenPrivacy}
            className="text-white hover:text-amber-200 underline underline-offset-4 transition-colors cursor-pointer font-medium"
          >
            Política de Privacidade & Termos Legais (Lei n.º 22/11)
          </button>
        </div>
      </div>
    </footer>
  );
};
