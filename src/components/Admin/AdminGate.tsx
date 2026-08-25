/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Loader2 } from 'lucide-react';
import { Article } from '../../types';
import { useAuth } from '../../lib/AuthContext';
import { AdminLoginPage } from './AdminLoginPage';
import { AdminDashboard } from './AdminDashboard';

interface AdminGateProps {
  articles: Article[];
  articlesLoading: boolean;
  articlesError: string | null;
  onArticlesChanged: () => void;
  onGoToSite: () => void;
  onShowToast: (msg: string) => void;
}

export const AdminGate: React.FC<AdminGateProps> = ({
  articles,
  articlesLoading,
  articlesError,
  onArticlesChanged,
  onGoToSite,
  onShowToast,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f5f7]">
        <Loader2 className="w-6 h-6 text-[#d9251d] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AdminLoginPage onBackToSite={onGoToSite} />;
  }

  return (
    <AdminDashboard
      articles={articles}
      loading={articlesLoading}
      loadError={articlesError}
      onArticlesChanged={onArticlesChanged}
      onGoToSite={onGoToSite}
      onShowToast={onShowToast}
    />
  );
};
