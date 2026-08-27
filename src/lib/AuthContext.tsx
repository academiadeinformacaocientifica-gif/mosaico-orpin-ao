/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';

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
  signUp: (name: string, email: string, password: string, role?: string) => Promise<{ error: string | null }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = 'mosaico_admin_session_user';

// Gera um hash SHA-256 seguro no browser sem bibliotecas externas
async function hashPassword(password: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(`mosaico_salt_v1_${password}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Recupera a sessão guardada no localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Não foi possível restaurar sessão salva:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    if (!isSupabaseConfigured) {
      return { error: 'O Supabase ainda não está configurado no projeto.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const passwordHash = await hashPassword(password);

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id, name, email, role, avatar_url, password_hash, created_at')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (error) {
        if (error.code === 'PGRST205' || error.message?.includes('does not exist')) {
          return {
            error: 'A tabela "admin_users" ainda não foi criada no Supabase. Execute o ficheiro supabase/schema.sql no SQL Editor do Supabase.',
          };
        }
        return { error: `Erro ao consultar base de dados: ${error.message}` };
      }

      if (!data) {
        return { error: 'Nenhum perfil encontrado com este e-mail. Crie uma conta na aba "Criar Perfil".' };
      }

      if (data.password_hash !== passwordHash) {
        return { error: 'Palavra-passe incorreta. Verifique as credenciais.' };
      }

      const loggedUser: AdminUser = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role || 'Editor',
        avatarUrl: data.avatar_url || undefined,
        createdAt: data.created_at,
      };

      setUser(loggedUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser));
      return { error: null };
    } catch (err: any) {
      if (err?.message?.includes('Failed to fetch') || err?.name === 'TypeError') {
        return { error: 'Não foi possível estabelecer ligação ao servidor da base de dados. Verifique a ligação à rede.' };
      }
      return { error: err.message || 'Ocorreu um erro ao tentar iniciar sessão.' };
    }
  };

  const signUp = async (
    name: string,
    email: string,
    password: string,
    role: string = 'Editor'
  ): Promise<{ error: string | null }> => {
    if (!isSupabaseConfigured) {
      return { error: 'O Supabase ainda não está configurado no projeto.' };
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) return { error: 'Introduza o seu nome completo.' };
    if (!cleanEmail || !cleanEmail.includes('@')) return { error: 'Introduza um e-mail válido.' };
    if (password.length < 6) return { error: 'A palavra-passe deve ter pelo menos 6 caracteres.' };

    try {
      // 1. Verificar se já existe utilizador com o mesmo e-mail
      const { data: existingUser, error: checkError } = await supabase
        .from('admin_users')
        .select('id')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (checkError && !checkError.message?.includes('does not exist')) {
        if (checkError.message?.includes('Failed to fetch')) {
          return { error: 'Não foi possível ligar ao servidor da base de dados. Verifique a rede.' };
        }
        return { error: `Erro de verificação: ${checkError.message}` };
      }

      if (existingUser) {
        return { error: 'Já existe uma conta registada com este e-mail. Utilize "Iniciar Sessão".' };
      }

      // 2. Criar novo utilizador
      const passwordHash = await hashPassword(password);
      const newId = `adm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

      const { data, error: insertError } = await supabase
        .from('admin_users')
        .insert({
          id: newId,
          name: cleanName,
          email: cleanEmail,
          password_hash: passwordHash,
          role: role.trim() || 'Editor',
        })
        .select()
        .single();

      if (insertError) {
        if (insertError.code === 'PGRST205' || insertError.message?.includes('does not exist')) {
          return {
            error: 'A tabela "admin_users" ainda não foi criada no Supabase. Execute o script supabase/schema.sql no SQL Editor do Supabase.',
          };
        }
        if (insertError.message?.includes('Failed to fetch')) {
          return { error: 'Não foi possível ligar ao servidor da base de dados.' };
        }
        return { error: `Erro ao criar perfil: ${insertError.message}` };
      }

      const createdUser: AdminUser = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        avatarUrl: data.avatar_url || undefined,
        createdAt: data.created_at,
      };

      setUser(createdUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(createdUser));
      return { error: null };
    } catch (err: any) {
      if (err?.message?.includes('Failed to fetch') || err?.name === 'TypeError') {
        return { error: 'Não foi possível estabelecer ligação ao servidor do Supabase. Verifique a rede.' };
      }
      return { error: err.message || 'Ocorreu um erro ao registar o perfil.' };
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return ctx;
}
