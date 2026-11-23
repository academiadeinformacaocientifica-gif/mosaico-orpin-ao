/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lock, Mail, LogIn, ArrowLeft, ShieldAlert, ShieldCheck, KeyRound } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { logSecurityEvent } from '../../lib/auditLogger';

interface AdminLoginPageProps {
  onBackToSite: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onBackToSite }) => {
  const { signIn } = useAuth();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!loginEmail || !loginPassword) {
      setError('Por favor introduza o e-mail e a palavra-passe.');
      return;
    }

    if (!isSupabaseConfigured) {
      setError(
        'O Supabase ainda não está configurado. Defina as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no seu projeto para permitir a autenticação.'
      );
      return;
    }

    setSubmitting(true);
    const { error: signInError } = await signIn(loginEmail, loginPassword);
    setSubmitting(false);

    if (signInError) {
      setError(signInError);
      logSecurityEvent({
        type: 'AUTH_LOGIN_FAILURE',
        actorEmail: loginEmail,
        details: signInError,
      });
    } else {
      logSecurityEvent({
        type: 'AUTH_LOGIN_SUCCESS',
        actorEmail: loginEmail,
        details: 'Autenticação bem-sucedida no painel editorial via Supabase Auth.',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f5f7] px-4 py-8">
      <div className="w-full max-w-md">
        <button
          type="button"
          onClick={onBackToSite}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#666] hover:text-[#d9251d] mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar ao portal público
        </button>

        <div className="bg-white rounded-2xl border border-[#e0e0e0] shadow-sm p-7 sm:p-8">
          {/* LOGO & TITULO */}
          <div className="flex flex-col items-center mb-6">
            <div className="bg-[#d9251d] text-white font-bold text-lg px-4 py-1.5 rounded-tl-xl rounded-br-xl uppercase tracking-wider mb-3 shadow-xs">
              MOSAICO ANGOLA
            </div>
            <h1 className="text-lg font-bold text-[#111]">Área Reservada de Redação</h1>
            <p className="text-xs text-gray-500 mt-1 text-center">
              Gestão de conteúdos da Embaixada de Angola em Espanha e Andorra
            </p>
          </div>

          {/* ALERTA SE SUPABASE NÃO CONFIGURADO */}
          {!isSupabaseConfigured && (
            <div className="mb-5 flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg p-3">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <span>
                O backend do Supabase ainda não está configurado. Defina as variáveis de ambiente para ativar o acesso.
              </span>
            </div>
          )}

          {/* AVISO DE ACESSO RESTRITO INSTITUCIONAL */}
          <div className="mb-6 flex items-start gap-2.5 bg-blue-50/70 border border-blue-200/60 rounded-xl p-3 text-xs text-blue-900 leading-relaxed">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#0052cc]" />
            <div>
              <span className="font-semibold text-blue-950">Acesso Restrito & Auditado: </span>
              Apenas operadores previamente credenciados no sistema central de autenticação têm autorização para aceder ao painel.
            </div>
          </div>

          {/* FORMULÁRIO DE LOGIN */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#444] mb-1.5">
                E-mail Institucional
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="utilizador@mosaico.ao"
                  autoComplete="email"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#ccc] outline-none text-sm focus:border-[#d9251d] bg-[#f9f9f9] focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#444] mb-1.5">
                Palavra-passe
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#ccc] outline-none text-sm focus:border-[#d9251d] bg-[#f9f9f9] focus:bg-white transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="text-xs font-medium text-[#d9251d] bg-red-50 border border-red-100 rounded-lg p-3 leading-relaxed">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-[#d9251d] hover:bg-[#b91e17] disabled:opacity-60 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors shadow-xs cursor-pointer mt-1"
            >
              <LogIn className="w-4 h-4" />
              {submitting ? 'A verificar credenciais...' : 'Iniciar Sessão'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-[11px] text-gray-400">
              <KeyRound className="w-3 h-3 text-gray-400" />
              <span>Autenticação protegida via Supabase Auth</span>
            </div>
            <p className="text-[10px] text-gray-400">
              Para solicitação de credenciais, contacte a administração editorial.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
