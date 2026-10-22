/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ShieldCheck, Lock, FileText, Mail, Landmark } from 'lucide-react';

interface PrivacyModalProps {
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
        
        {/* HEADER */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>Política de Privacidade & Termos Legais</span>
              </h2>
              <p className="text-xs text-gray-300">
                Em Conformidade com a Lei n.º 22/11 de Proteção de Dados Pessoais (Angola)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-gray-700 leading-relaxed">
          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl text-amber-950 flex items-start gap-3">
            <Landmark className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-amber-900 font-bold mb-0.5">Responsável pelo Tratamento dos Dados</strong>
              O portal <strong>Mosaico Angola</strong> é a revista oficial e canal informativo da Embaixada da República de Angola no Reino de Espanha e Principado de Andorra.
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-900 text-sm mb-1.5 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#d9251d]" />
                <span>1. Recolha e Finalidade dos Dados Pessoais</span>
              </h3>
              <p>
                Recolhemos apenas os dados estritamente necessários fornecidos voluntariamente pelos utilizadores através dos formulários de contacto consular, subscrição de boletim informativo (*newsletter*) ou interações no portal: nome, e-mail e teor da mensagem. Estes dados são tratados exclusivamente para responder a pedidos consulares, partilhar atualizações diplomáticas e assegurar a comunicação institucional.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 text-sm mb-1.5 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#d9251d]" />
                <span>2. Segurança e Tratamento Confidencial</span>
              </h3>
              <p>
                Em conformidade com a <strong>Lei n.º 22/11</strong>, adotamos rigorosas medidas técnicas e organizativas de segurança (cifra TLS 1.3, RLS no Supabase, cabeçalhos de segurança HTTP e isolamento de acessos) para proteger os dados pessoais contra acesso não autorizado, perda ou alteração indevida.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 text-sm mb-1.5 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#d9251d]" />
                <span>3. Direitos dos Titulares dos Dados</span>
              </h3>
              <p>
                Enquanto titular dos dados, tem o direito de solicitar a qualquer momento o acesso, retificação ou eliminação dos seus dados pessoais armazenados nos nossos sistemas, bastando para o efeito contactar a Chancelaria através do e-mail oficial: <strong>embaixada@embajadadeangola.com</strong> ou <strong>seguranca@mosaico.ao</strong>.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 text-sm mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#d9251d]" />
                <span>4. Utilização de Cookies e Armazenamento Local</span>
              </h3>
              <p>
                O portal utiliza apenas armazenamento local (*localStorage*) estritamente necessário para gerizar sessões autenticadas de operadores credenciados e preferências de visualização. Não utilizamos cookies de terceiros para rastreio publicitário.
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">Embaixada de Angola • Madrid & Andorra</span>
          <button
            onClick={onClose}
            className="text-xs font-semibold px-4 py-2 bg-[#d9251d] hover:bg-[#b91e17] text-white rounded-xl transition-colors cursor-pointer"
          >
            Compreendido
          </button>
        </div>
      </div>
    </div>
  );
};
