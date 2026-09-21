/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Mosaico Angolano ErrorBoundary] Erro capturado:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center p-4 font-sans selection:bg-[#d9251d] selection:text-white">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-neutral-200/80 text-center">
            <div className="w-16 h-16 bg-red-50 text-[#d9251d] rounded-full flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-serif font-bold text-neutral-900 mb-2">
              Instabilidade Momentânea
            </h1>

            <p className="text-sm text-neutral-600 mb-6 leading-relaxed">
              Ocorreu uma interrupção inesperada ao carregar este conteúdo. Pode recarregar a página ou regressar à página principal.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#d9251d] hover:bg-[#b81d16] text-white font-medium text-sm transition-colors cursor-pointer shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Recarregar Página
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium text-sm transition-colors cursor-pointer"
              >
                <Home className="w-4 h-4" />
                Página Inicial
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
