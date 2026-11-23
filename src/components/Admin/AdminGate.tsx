/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Loader2 } from 'lucide-react';
import {
  Article,
  GalleryItem,
  VideoItem,
  MagazineEdition,
  ConsularDocument,
  CulturalEvent,
  DiplomaticEvent,
  EmbassyInfo,
} from '../../types';
import { NaturalWonder } from '../../data/wondersData';
import { useAuth } from '../../lib/AuthContext';
import { AdminLoginPage } from './AdminLoginPage';
import { AdminDashboard } from './AdminDashboard';

interface AdminGateProps {
  articles: Article[];
  galleryItems: GalleryItem[];
  videoItems: VideoItem[];
  magazineEditions: MagazineEdition[];
  naturalWonders: NaturalWonder[];
  consularDocs: ConsularDocument[];
  culturalEvents: CulturalEvent[];
  diplomaticEvents: DiplomaticEvent[];
  embassyInfo: EmbassyInfo;
  articlesLoading: boolean;
  articlesError: string | null;
  onArticlesChanged: () => void;
  onGalleryChanged: () => void;
  onVideosChanged: () => void;
  onEditionsChanged: () => void;
  onWondersChanged: () => void;
  onConsularDocsChanged: () => void;
  onCulturalEventsChanged: () => void;
  onDiplomaticEventsChanged: () => void;
  onEmbassyInfoChanged: (updated: EmbassyInfo) => void;
  onGoToSite: () => void;
  onShowToast: (msg: string) => void;
}

export const AdminGate: React.FC<AdminGateProps> = ({
  articles,
  galleryItems,
  videoItems,
  magazineEditions,
  naturalWonders,
  consularDocs,
  culturalEvents,
  diplomaticEvents,
  embassyInfo,
  articlesLoading,
  articlesError,
  onArticlesChanged,
  onGalleryChanged,
  onVideosChanged,
  onEditionsChanged,
  onWondersChanged,
  onConsularDocsChanged,
  onCulturalEventsChanged,
  onDiplomaticEventsChanged,
  onEmbassyInfoChanged,
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
      galleryItems={galleryItems}
      videoItems={videoItems}
      magazineEditions={magazineEditions}
      naturalWonders={naturalWonders}
      consularDocs={consularDocs}
      culturalEvents={culturalEvents}
      diplomaticEvents={diplomaticEvents}
      embassyInfo={embassyInfo}
      loading={articlesLoading}
      loadError={articlesError}
      onArticlesChanged={onArticlesChanged}
      onGalleryChanged={onGalleryChanged}
      onVideosChanged={onVideosChanged}
      onEditionsChanged={onEditionsChanged}
      onWondersChanged={onWondersChanged}
      onConsularDocsChanged={onConsularDocsChanged}
      onCulturalEventsChanged={onCulturalEventsChanged}
      onDiplomaticEventsChanged={onDiplomaticEventsChanged}
      onEmbassyInfoChanged={onEmbassyInfoChanged}
      onGoToSite={onGoToSite}
      onShowToast={onShowToast}
    />
  );
};
