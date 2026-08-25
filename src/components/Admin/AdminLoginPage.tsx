/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lock, Mail, LogIn, ArrowLeft, ShieldAlert, User, Briefcase, UserPlus } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';

interface AdminLoginPageProps {
  onBackToSite: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onBackToSite }) => {
  const { signIn, signUp } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Campos de Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Campos de Registo
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState('Editor');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!loginEmail || !loginPassword) {
      setError('Preencha o e-mail e a palavra-passe.');
      return;
    }

    if (!isSupabaseConfigured) {
      setError(
        'O Supabase ainda não está configurado. Defina as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no seu projeto para permitir o login.'
      );
      return;
    }

    setSubmitting(true);
    const { error: signInError } = await signIn(loginEmail, loginPassword);
    setSubmitting(false);

    if (signInError) {
      setError(signInError);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!regName.trim()) {
      setError('Por favor, indique o seu nome completo.');
      return;
    }

    if (!regEmail.trim() || !regEmail.includes('@')) {
      setError('Por favor, indique um e-mail válido.');
      return;
    }

    if (regPassword.length < 6) {
      setError('A palavra-passe deve ter no mínimo 6 caracteres.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError('As palavras-passe não coincidem.');
      return;
    }

    if (!isSupabaseConfigured) {
      setError(
        'O Supabase ainda não está configurado. Defina as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.'
      );
      return;
    }

    setSubmitting(true);
    const { error: signUpError } = await signUp(regName, regEmail, regPassword, regRole);
    setSubmitting(false);

    if (signUpError) {
      setError(signUpError);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f5f7] px-4 py-8">
      <div className="w-full max-w-md">
        <button
          type="button"
          onClick={onBackToSite}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#666] hover:text-[#d9251d] mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar ao site
        </button>

        <div className="bg-white rounded-2xl border border-[#e0e0e0] shadow-xs p-7 sm:p-8">
          {/* LOGO & TITULO */}
          <div className="flex flex-col items-center mb-6">
            <div className="bg-[#d9251d] text-white font-bold text-lg px-4 py-1.5 rounded-tl-xl rounded-br-xl uppercase tracking-wider mb-3">
              MOSAICO
            </div>
            <h1 className="text-lg font-bold text-[#111]">Área Reservada de Redação</h1>
            <p className="text-xs text-gray-500 mt-1 text-center">
              Gestão de conteúdos da Embaixada de Angola em Espanha e Andorra
            </p>
          </div>

          {/* ALERTA SE SUPABASE NÃO CONFIGURADO */}
          {!isSupabaseConfigured && (
            <div className="mb-5 flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg p-3">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                O backend do Supabase ainda não está configurado. Verifique as variáveis de ambiente.
              </span>
            </div>
          )}

          {/* ABAS: INICIAR SESSÃO / CRIAR PERFIL */}
          <div className="grid grid-cols-2 p-1 bg-[#f0f1f3] rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setError(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                tab === 'login'
                  ? 'bg-white text-[#111] shadow-xs'
                  : 'text-gray-500 hover:text-[#111]'
              }`}
            >
              Iniciar Sessão
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('register');
                setError(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                tab === 'register'
                  ? 'bg-white text-[#111] shadow-xs'
                  : 'text-gray-500 hover:text-[#111]'
              }`}
            >
              Criar Perfil
            </button>
          </div>

          {/* FORMULÁRIO DE LOGIN */}
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#444] mb-1.5">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="redacao@mosaico.ao"
                    autoComplete="email"
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
                className="w-full flex items-center justify-center gap-2 bg-[#d9251d] hover:bg-[#b91e17] disabled:opacity-60 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                {submitting ? 'A verificar...' : 'Entrar no Painel'}
              </button>
            </form>
          )}

          {/* FORMULÁRIO DE REGISTO / CRIAR CONTA */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#444] mb-1">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="ex: Manuel António"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#ccc] outline-none text-sm focus:border-[#d9251d] bg-[#f9f9f9] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#444] mb-1">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="redacao@mosaico.ao"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#ccc] outline-none text-sm focus:border-[#d9251d] bg-[#f9f9f9] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#444] mb-1">
                  Cargo / Função
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#ccc] outline-none text-sm focus:border-[#d9251d] bg-[#f9f9f9] focus:bg-white transition-colors cursor-pointer"
                  >
                    <option value="Editor">Editor</option>
                    <option value="Jornalista">Jornalista</option>
                    <option value="Redator">Redator</option>
                    <option value="Comunicação Institucional">Comunicação Institucional</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#444] mb-1">
                  Palavra-passe (mínimo 6 caracteres)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#ccc] outline-none text-sm focus:border-[#d9251d] bg-[#f9f9f9] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#444] mb-1">
                  Confirmar Palavra-passe
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#ccc] outline-none text-sm focus:border-[#d9251d] bg-[#f9f9f9] focus:bg-white transition-colors"
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
                className="w-full flex items-center justify-center gap-2 bg-[#d9251d] hover:bg-[#b91e17] disabled:opacity-60 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors shadow-xs cursor-pointer mt-2"
              >
                <UserPlus className="w-4 h-4" />
                {submitting ? 'A criar perfil...' : 'Criar Perfil e Entrar'}
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <p className="text-[11px] text-gray-400">
              Mosaico Angolano — Sistema de Gestão de Notícias
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
