/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';
import type { Session, User } from '@supabase/supabase-js';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  createdAt?: string;
}

interface AuthContextValue {
  user: AdminUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function mapSupabaseUserToAdminUser(user: User): AdminUser {
  const meta = user.user_metadata || {};
  return {
    id: user.id,
    name: meta.name || meta.full_name || (user.email ? user.email.split('@')[0] : 'Operador'),
    email: user.email || '',
    role: meta.role || 'Administrador',
    avatarUrl: meta.avatar_url || undefined,
    createdAt: user.created_at,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // 1. Obter sessão ativa no Supabase Auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(mapSupabaseUserToAdminUser(session.user));
      } else {
        setUser(null);
      }
      setLoading(false);
    }).catch((err) => {
      console.warn('[Auth] Erro ao recuperar sessão do Supabase:', err);
      setLoading(false);
    });

    // 2. Escutar mudanças em tempo real no estado de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session: Session | null) => {
      if (session?.user) {
        setUser(mapSupabaseUserToAdminUser(session.user));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    if (!isSupabaseConfigured) {
      return { error: 'O Supabase ainda não está configurado. Defina as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.' };
    }

    const cleanEmail = email.trim().toLowerCase();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        if (
          error.message.includes('Invalid login credentials') ||
          error.message.includes('invalid_credentials')
        ) {
          return {
            error:
              'Credenciais incorretas ou utilizador não autorizado. O acesso é reservado a operadores previamente registados no painel do Supabase.',
          };
        }
        if (error.message.includes('Email not confirmed')) {
          return {
            error:
              'O e-mail deste utilizador ainda não foi confirmado no Supabase. Confirme o utilizador no painel do Supabase (Authentication > Users).',
          };
        }
        return { error: `Erro de autenticação: ${error.message}` };
      }

      if (data?.user) {
        setUser(mapSupabaseUserToAdminUser(data.user));
      }

      return { error: null };
    } catch (err: any) {
      return {
        error:
          err?.message ||
          'Não foi possível estabelecer ligação ao servidor de autenticação.',
      };
    }
  };

  const signOut = async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('[Auth] Erro ao encerrar sessão:', err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return ctx;
}
