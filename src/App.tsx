/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Routes,
  Route,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
  useOutletContext,
} from 'react-router-dom';
import { NavPage, Article, MagazineEdition, CategoryId, GalleryItem, VideoItem, ConsularDocument } from './types';
import { resolvePageFromPath, articlePath, PAGE_TO_PATH } from './lib/routes';
import { initialArticles } from './data/articles';
import { initialGalleryItems } from './data/galleryData';
import { initialVideoItems } from './data/videosData';
import { initialMagazineEditions, magazineEditions } from './data/magazineEditions';
import { angolaNaturalWonders, NaturalWonder } from './data/wondersData';
import { consularDocuments } from './data/consularServices';
import { upcomingEvents } from './data/events';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { ArticlePage } from './components/Pages/ArticlePage';
import { MagazineReaderModal } from './components/MagazineReaderModal';
import { HomePage } from './components/Pages/HomePage';
import { AboutPage } from './components/Pages/AboutPage';
import { CategoryPage } from './components/Pages/CategoryPage';
import { FeedPage } from './components/Pages/FeedPage';
import { FavoritesPage } from './components/Pages/FavoritesPage';
import { HistoryPage } from './components/Pages/HistoryPage';
import { BlogPage } from './components/Pages/BlogPage';
import { EditionsPage } from './components/Pages/EditionsPage';
import { GalleryPage } from './components/Pages/GalleryPage';
import { VideosPage } from './components/Pages/VideosPage';
import { WondersPage } from './components/Pages/WondersPage';
import { ConsularServicesPage } from './components/Pages/ConsularServicesPage';
import { ArticleCard } from './components/ArticleCard';
import { AdminGate } from './components/Admin/AdminGate';
import { fetchArticles, addArticleComment, toggleArticleLike } from './lib/articleService';
import { fetchGalleryItems, getLocalGallery } from './lib/galleryService';
import { fetchVideoItems, getLocalVideos } from './lib/videoService';
import { fetchMagazineEditions, getLocalEditions } from './lib/editionService';
import { fetchNaturalWonders, getLocalWonders } from './lib/wonderService';
import { fetchConsularDocuments, getLocalConsularDocuments } from './lib/consularDocService';
import { isSupabaseConfigured } from './lib/supabase';
import { Search, X, FolderSearch } from 'lucide-react';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = resolvePageFromPath(location.pathname);

  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        return getLocalGallery();
      } catch {
        return initialGalleryItems;
      }
    }
    return initialGalleryItems;
  });
  const [videoItems, setVideoItems] = useState<VideoItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        return getLocalVideos();
      } catch {
        return initialVideoItems;
      }
    }
    return initialVideoItems;
  });
  const [magazineEditionsList, setMagazineEditionsList] = useState<MagazineEdition[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        return getLocalEditions();
      } catch {
        return initialMagazineEditions;
      }
    }
    return initialMagazineEditions;
  });
  const [naturalWondersList, setNaturalWondersList] = useState<NaturalWonder[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        return getLocalWonders();
      } catch {
        return angolaNaturalWonders;
      }
    }
    return angolaNaturalWonders;
  });
  const [consularDocumentsList, setConsularDocumentsList] = useState<ConsularDocument[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        return getLocalConsularDocuments();
      } catch {
        return consularDocuments;
      }
    }
    return consularDocuments;
  });

  const [articlesLoading, setArticlesLoading] = useState(false);
  const [articlesError, setArticlesError] = useState<string | null>(null);

  const loadArticlesFromBackend = useCallback(async () => {
    setArticlesLoading(true);
    try {
      const remote = await fetchArticles();
      if (remote && remote.length > 0) {
        setArticles(remote);
        setArticlesError(null);
      }
    } catch (e: any) {
      console.warn('Usando artigos locais resilientes:', e);
    } finally {
      setArticlesLoading(false);
    }
  }, []);

  const loadGalleryFromBackend = useCallback(async () => {
    try {
      const remote = await fetchGalleryItems();
      if (remote && remote.length > 0) setGalleryItems(remote);
    } catch {
      // fallback
    }
  }, []);

  const loadVideosFromBackend = useCallback(async () => {
    try {
      const remote = await fetchVideoItems();
      if (remote && remote.length > 0) setVideoItems(remote);
    } catch {
      // fallback
    }
  }, []);

  const loadEditionsFromBackend = useCallback(async () => {
    try {
      const remote = await fetchMagazineEditions();
      if (remote && remote.length > 0) setMagazineEditionsList(remote);
    } catch {
      // fallback
    }
  }, []);

  const loadWondersFromBackend = useCallback(async () => {
    try {
      const remote = await fetchNaturalWonders();
      if (remote && remote.length > 0) setNaturalWondersList(remote);
    } catch {
      // fallback
    }
  }, []);

  const loadConsularDocsFromBackend = useCallback(async () => {
    try {
      const remote = await fetchConsularDocuments();
      if (remote && remote.length > 0) setConsularDocumentsList(remote);
    } catch {
      // fallback
    }
  }, []);

  useEffect(() => {
    loadArticlesFromBackend();
    loadGalleryFromBackend();
    loadVideosFromBackend();
    loadEditionsFromBackend();
    loadWondersFromBackend();
    loadConsularDocsFromBackend();
  }, [
    loadArticlesFromBackend,
    loadGalleryFromBackend,
    loadVideosFromBackend,
    loadEditionsFromBackend,
    loadWondersFromBackend,
    loadConsularDocsFromBackend,
  ]);

  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('mosaico_bookmarks_v4');
      if (saved) return new Set(JSON.parse(saved));
    } catch {
      // ignore
    }
    return new Set<string>();
  });

  const [likedIds, setLikedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('mosaico_likes_v4');
      if (saved) return new Set(JSON.parse(saved));
    } catch {
      // ignore
    }
    return new Set<string>();
  });

  const searchQuery = searchParams.get('q') ?? '';
  const setSearchQuery = useCallback(
    (q: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (q) {
            next.set('q', q);
          } else {
            next.delete('q');
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );
  const [selectedEdition, setSelectedEdition] = useState<MagazineEdition | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('mosaico_bookmarks_v4', JSON.stringify(Array.from(bookmarkedIds)));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarkedIds]);

  useEffect(() => {
    try {
      localStorage.setItem('mosaico_likes_v4', JSON.stringify(Array.from(likedIds)));
    } catch (e) {
      console.error(e);
    }
  }, [likedIds]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handleToggleBookmark = (articleId: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(articleId)) {
        next.delete(articleId);
        showToast('Artigo removido dos seus favoritos.');
      } else {
        next.add(articleId);
        showToast('Artigo guardado com sucesso nos favoritos!');
      }
      return next;
    });
  };

  const handleToggleLike = (articleId: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      const isAlreadyLiked = next.has(articleId);
      if (isAlreadyLiked) {
        next.delete(articleId);
      } else {
        next.add(articleId);
        showToast('Gosto registado no artigo!');
      }

      const increment = !isAlreadyLiked;
      toggleArticleLike(articleId, increment);

      setArticles((prevArticles) =>
        prevArticles.map((art) => {
          if (art.id === articleId) {
            return {
              ...art,
              likes: Math.max(0, art.likes + (increment ? 1 : -1)),
            };
          }
          return art;
        })
      );

      return next;
    });
  };

  const handleAddComment = (articleId: string, commentText: string, authorName: string) => {
    const newCommentObj = {
      id: `comm-${Date.now()}`,
      author: authorName,
      date: 'Hoje',
      content: commentText,
      likes: 0,
      likedByUser: false,
    };

    addArticleComment(articleId, newCommentObj);

    setArticles((prevArticles) =>
      prevArticles.map((art) => {
        if (art.id === articleId) {
          const updatedComments = [newCommentObj, ...(art.comments || [])];
          return {
            ...art,
            commentsCount: (art.commentsCount || 0) + 1,
            comments: updatedComments,
          };
        }
        return art;
      })
    );
  };

  const handleLikeComment = (articleId: string, commentId: string) => {
    setArticles((prevArticles) =>
      prevArticles.map((art) => {
        if (art.id === articleId && art.comments) {
          const updated = art.comments.map((c) => {
            if (c.id === commentId) {
              const liked = !c.likedByUser;
              return {
                ...c,
                likedByUser: liked,
                likes: c.likes + (liked ? 1 : -1),
              };
            }
            return c;
          });
          return { ...art, comments: updated };
        }
        return art;
      })
    );
  };

  const handleClearAllFavorites = () => {
    setBookmarkedIds(new Set());
    showToast('Todos os favoritos foram limpos.');
  };

  const publicArticles = useMemo(() => {
    return articles.filter((a) => a.isPublished !== false);
  }, [articles]);

  const carouselArticles = useMemo(() => {
    const featured = publicArticles.filter((a) => Boolean(a.isFeatured || a.isCarousel));
    return [...featured].sort((a, b) => {
      const dateA = a.isoDate ? new Date(a.isoDate).getTime() : 0;
      const dateB = b.isoDate ? new Date(b.isoDate).getTime() : 0;
      return dateB - dateA;
    });
  }, [publicArticles]);
  
  const secondaryArticles = useMemo(() => {
    const carouselIds = new Set(carouselArticles.map((c) => c.id));
    const nonCarousel = publicArticles.filter((a) => !carouselIds.has(a.id));
    if (nonCarousel.length >= 2) {
      return nonCarousel.slice(0, 2);
    }
    return publicArticles.filter((a) => a.id !== carouselArticles[0]?.id).slice(0, 2);
  }, [publicArticles, carouselArticles]);

  const latestArticles = useMemo(() => {
    return [...publicArticles].sort((a, b) => {
      const dateA = a.isoDate ? new Date(a.isoDate).getTime() : 0;
      const dateB = b.isoDate ? new Date(b.isoDate).getTime() : 0;
      return dateB - dateA;
    });
  }, [publicArticles]);

  const favoriteArticles = useMemo(
    () => articles.filter((a) => bookmarkedIds.has(a.id)),
    [articles, bookmarkedIds]
  );

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return publicArticles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }, [publicArticles, searchQuery]);

  const handleNavigate = (page: NavPage) => {
    const targetPath = PAGE_TO_PATH[page] || '/';
    navigate(targetPath);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenArticle = (art: Article) => {
    navigate(articlePath(art.id));
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const categoryConfigs: Partial<
    Record<CategoryId, { title: string; subtitle: string }>
  > = {
    'politica': {
      title: 'Politica',
      subtitle:
        'Notícias diplomáticas, relações bilaterais, acordos internacionais e atualidade política entre Angola, Espanha e o mundo.',
    },
    'analise-global': {
      title: 'Politica',
      subtitle:
        'Notícias diplomáticas, relações bilaterais, acordos internacionais e atualidade política entre Angola, Espanha e o mundo.',
    },
    'angolberica': {
      title: 'Angolbérica',
      subtitle:
        'O espaço de convergência linguística, científica, universitária e comercial no eixo Angola-Espanha-Ibero-América.',
    },
    'economia': {
      title: 'Economia',
      subtitle:
        'Oportunidades de investimento, comércio bilateral, infraestruturas, Corredor do Lobito e perspetivas económicas globais.',
    },
    'panorama-consular': {
      title: 'Panorama Consular',
      subtitle:
        'Informações práticas, atos notariais, vistos e apoio integral à comunidade angolana em Espanha e Andorra.',
    },
    'kamba-cultura': {
      title: 'Kamba & e Kultura',
      subtitle:
        'Expressões identitárias, tradições populares, gastronomia, fraternidade e vivências da diáspora angolana.',
    },
    'kultura-360': {
      title: 'Kultura 360',
      subtitle:
        'Agenda artística, mostras de cinema, exposições de artes plásticas, literatura e eventos musicais em Madrid, Barcelona e Luanda.',
    },
    'turismo': {
      title: 'Turismo',
      subtitle:
        'Notícias, reportagens, ecoturismo e eventos do setor turístico em Angola e no plano internacional.',
    },
    'todas': {
      title: 'Todas as Publicações',
      subtitle:
        'Explore todas as notícias, artigos, análises e comunicados oficiais independentemente da categoria.',
    },
    'historia': {
      title: 'História & Diplomacia',
      subtitle:
        'Documentos históricos, memórias e momentos marcantes das relações Angola-Espanha.',
    },
    'blog': {
      title: 'Blog & Opinião',
      subtitle:
        'Artigos de opinião, ensaios e perspetivas de especialistas em relações internacionais.',
    },
  };

  const publicGalleryItems = useMemo(
    () => galleryItems.filter((i) => i.isPublished !== false),
    [galleryItems]
  );

  const publicVideoItems = useMemo(
    () => videoItems.filter((v) => v.isPublished !== false),
    [videoItems]
  );

  const publicMagazineEditions = useMemo(
    () => magazineEditionsList.filter((e) => e.isPublished !== false),
    [magazineEditionsList]
  );

  const publicNaturalWonders = useMemo(
    () => naturalWondersList.filter((w) => w.isPublished !== false),
    [naturalWondersList]
  );

  const publicConsularDocuments = useMemo(
    () => consularDocumentsList.filter((d) => d.isPublished !== false),
    [consularDocumentsList]
  );

  const outletContext: PageOutletContext = {
    articles,
    publicArticles,
    carouselArticles,
    secondaryArticles,
    latestArticles,
    favoriteArticles,
    searchResults,
    magazineEditionsList,
    publicMagazineEditions,
    publicGalleryItems,
    publicVideoItems,
    publicNaturalWonders,
    publicConsularDocuments,
    categoryConfigs,
    bookmarkedIds,
    likedIds,
    handleOpenArticle,
    handleNavigate,
    handleToggleBookmark,
    handleToggleLike,
    handleAddComment,
    handleLikeComment,
    handleClearAllFavorites,
    showToast,
    setSelectedEdition,
  };

  return (
    <Routes>
      {/* ÁREA RESERVADA — sem cabeçalho/rodapé públicos */}
      <Route
        path="/admin"
        element={
          <AdminGate
            articles={articles}
            galleryItems={galleryItems}
            videoItems={videoItems}
            magazineEditions={magazineEditionsList}
            naturalWonders={naturalWondersList}
            consularDocs={consularDocumentsList}
            articlesLoading={articlesLoading}
            articlesError={articlesError}
            onArticlesChanged={loadArticlesFromBackend}
            onGalleryChanged={loadGalleryFromBackend}
            onVideosChanged={loadVideosFromBackend}
            onEditionsChanged={loadEditionsFromBackend}
            onWondersChanged={loadWondersFromBackend}
            onConsularDocsChanged={loadConsularDocsFromBackend}
            onGoToSite={() => handleNavigate('home')}
            onShowToast={showToast}
          />
        }
      />

      {/* SITE PÚBLICO — cada página abaixo tem o seu próprio URL partilhável */}
      <Route
        element={
          <SiteLayout
            currentPage={currentPage}
            favoritesCount={bookmarkedIds.size}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onNavigate={handleNavigate}
            onShowToast={showToast}
            articles={articles}
            onOpenArticle={handleOpenArticle}
            selectedEdition={selectedEdition}
            onCloseEdition={() => setSelectedEdition(null)}
            toastMessage={toastMessage}
            onCloseToast={() => setToastMessage(null)}
            context={outletContext}
          />
        }
      >
        <Route path="/noticia/:id" element={<ArticleRoute />} />
        <Route path="*" element={<PageSwitch />} />
      </Route>
    </Routes>
  );
}

/** Dados e ações partilhados por todas as páginas do site público. */
interface PageOutletContext {
  articles: Article[];
  publicArticles: Article[];
  carouselArticles: Article[];
  secondaryArticles: Article[];
  latestArticles: Article[];
  favoriteArticles: Article[];
  searchResults: Article[];
  magazineEditionsList: MagazineEdition[];
  publicMagazineEditions: MagazineEdition[];
  publicGalleryItems: GalleryItem[];
  publicVideoItems: VideoItem[];
  publicNaturalWonders: NaturalWonder[];
  publicConsularDocuments: ConsularDocument[];
  categoryConfigs: Partial<Record<CategoryId, { title: string; subtitle: string }>>;
  bookmarkedIds: Set<string>;
  likedIds: Set<string>;
  handleOpenArticle: (art: Article) => void;
  handleNavigate: (page: NavPage) => void;
  handleToggleBookmark: (articleId: string) => void;
  handleToggleLike: (articleId: string) => void;
  handleAddComment: (articleId: string, commentText: string, authorName: string) => void;
  handleLikeComment: (articleId: string, commentId: string) => void;
  handleClearAllFavorites: () => void;
  showToast: (msg: string) => void;
  setSelectedEdition: (edition: MagazineEdition | null) => void;
}

interface SiteLayoutProps {
  currentPage: NavPage;
  favoritesCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNavigate: (page: NavPage) => void;
  onShowToast: (msg: string) => void;
  articles: Article[];
  onOpenArticle: (art: Article) => void;
  selectedEdition: MagazineEdition | null;
  onCloseEdition: () => void;
  toastMessage: string | null;
  onCloseToast: () => void;
  context: PageOutletContext;
}

/**
 * Casca comum a todo o site público (cabeçalho, rodapé, modais).
 * O conteúdo específico de cada URL é renderizado no <Outlet /> pelas
 * rotas filhas (ArticleRoute ou PageSwitch).
 */
function SiteLayout({
  currentPage,
  favoritesCount,
  searchQuery,
  onSearchChange,
  onNavigate,
  onShowToast,
  articles,
  onOpenArticle,
  selectedEdition,
  onCloseEdition,
  toastMessage,
  onCloseToast,
  context,
}: SiteLayoutProps) {
  const location = useLocation();
  const activePage = resolvePageFromPath(location.pathname);
  const isArticleRoute = location.pathname.toLowerCase().startsWith('/noticia/');
  const showSearchOverlay = !isArticleRoute && searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f5f7] text-[#333]">
      <Header
        currentPage={activePage}
        onNavigate={onNavigate}
        favoritesCount={favoritesCount}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onOpenArticle={(id) => {
          const found = articles.find((a) => a.id === id);
          if (found) onOpenArticle(found);
        }}
      />

      <main className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 flex-1">
        {showSearchOverlay ? (
          <SearchResultsBlock
            searchQuery={searchQuery}
            results={context.searchResults}
            onClearSearch={() => onSearchChange('')}
            context={context}
          />
        ) : (
          <Outlet context={context} />
        )}
      </main>

      <Footer onNavigate={onNavigate} onShowToast={onShowToast} />

      {selectedEdition && (
        <MagazineReaderModal
          edition={selectedEdition}
          onClose={onCloseEdition}
          onShowToast={onShowToast}
        />
      )}

      <Toast message={toastMessage} onClose={onCloseToast} />
    </div>
  );
}

function SearchResultsBlock({
  searchQuery,
  results,
  onClearSearch,
  context,
}: {
  searchQuery: string;
  results: Article[];
  onClearSearch: () => void;
  context: PageOutletContext;
}) {
  return (
    <div className="py-6 sm:py-8 space-y-6">
      <div className="bg-white p-6 rounded-2xl border-l-6 border-[#d9251d] shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111] flex items-center gap-2">
            <Search className="w-5 h-5 text-[#d9251d]" />
            <span>Resultados da Pesquisa: "{searchQuery}"</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Encontrados {results.length} artigos correspondentes
          </p>
        </div>
        <button
          onClick={onClearSearch}
          className="text-xs font-semibold text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          <span>Limpar Pesquisa</span>
        </button>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((art) => (
            <ArticleCard
              key={art.id}
              article={art}
              onOpenArticle={context.handleOpenArticle}
              onToggleBookmark={context.handleToggleBookmark}
              onToggleLike={context.handleToggleLike}
              isBookmarked={context.bookmarkedIds.has(art.id)}
              isLiked={context.likedIds.has(art.id)}
              showDate={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-xs">
          <FolderSearch className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800 mb-1">
            Nenhum artigo encontrado
          </h3>
          <p className="text-xs text-gray-500">
            Tente pesquisar por outros termos como "turismo", "diplomacia", "vistos" ou "sustentabilidade".
          </p>
        </div>
      )}
    </div>
  );
}

/** Rota /noticia/:id — URL próprio e partilhável para cada artigo. */
function ArticleRoute() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const context = useOutletContext<PageOutletContext>();
  const article = context.articles.find((a) => a.id === id);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!article) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-xs my-8">
        <h1 className="text-lg font-bold text-gray-800 mb-2">Artigo não encontrado</h1>
        <p className="text-sm text-gray-500 mb-4">
          Este artigo pode ter sido removido ou o link está incorrecto.
        </p>
        <button
          onClick={() => navigate('/')}
          className="text-xs font-semibold text-white bg-[#d9251d] hover:bg-[#b81e17] px-4 py-2 rounded-lg cursor-pointer transition-colors"
        >
          Voltar à página inicial
        </button>
      </div>
    );
  }

  return (
    <ArticlePage
      article={article}
      onBack={() => navigate(-1)}
      onNavigate={context.handleNavigate}
      onToggleBookmark={context.handleToggleBookmark}
      onToggleLike={context.handleToggleLike}
      onAddComment={context.handleAddComment}
      onLikeComment={context.handleLikeComment}
      isBookmarked={context.bookmarkedIds.has(article.id)}
      isLiked={context.likedIds.has(article.id)}
      onShowToast={context.showToast}
      onOpenArticle={context.handleOpenArticle}
      allArticles={context.articles}
    />
  );
}

/** Todas as restantes páginas do site — o URL já determina qual delas mostrar. */
function PageSwitch() {
  const location = useLocation();
  const currentPage = resolvePageFromPath(location.pathname);
  const context = useOutletContext<PageOutletContext>();
  const {
    publicArticles,
    carouselArticles,
    secondaryArticles,
    latestArticles,
    favoriteArticles,
    magazineEditionsList,
    publicMagazineEditions,
    publicGalleryItems,
    publicVideoItems,
    publicNaturalWonders,
    publicConsularDocuments,
    categoryConfigs,
    bookmarkedIds,
    likedIds,
    handleOpenArticle,
    handleNavigate,
    handleToggleBookmark,
    handleToggleLike,
    handleClearAllFavorites,
    showToast,
    setSelectedEdition,
  } = context;

  return (
    <>
      {/* HOME PAGE */}
      {currentPage === 'home' && (
        <HomePage
          carouselArticles={carouselArticles}
          secondaryArticles={secondaryArticles}
          latestArticles={latestArticles}
          magazineEditions={publicMagazineEditions}
          upcomingEvents={upcomingEvents}
          galleryItems={publicGalleryItems}
          wonders={publicNaturalWonders}
          onOpenArticle={handleOpenArticle}
          onOpenEdition={setSelectedEdition}
          onToggleBookmark={handleToggleBookmark}
          onToggleLike={handleToggleLike}
          bookmarkedIds={bookmarkedIds}
          likedIds={likedIds}
          onNavigate={handleNavigate}
        />
      )}

      {/* SOBRE A EMBAIXADA */}
      {currentPage === 'sobre' && <AboutPage onShowToast={showToast} />}

      {/* SERVIÇOS CONSULARES E DOCUMENTAÇÃO */}
      {currentPage === 'panorama-consular' && (
        <ConsularServicesPage
          documents={publicConsularDocuments}
          articles={publicArticles}
          onOpenArticle={handleOpenArticle}
          onShowToast={showToast}
        />
      )}

      {/* CATEGORY PAGES */}
      {currentPage in categoryConfigs && currentPage !== 'panorama-consular' && (
        <CategoryPage
          categoryId={currentPage as CategoryId}
          title={categoryConfigs[currentPage as CategoryId]!.title}
          subtitle={categoryConfigs[currentPage as CategoryId]!.subtitle}
          articles={currentPage === 'todas' ? publicArticles : publicArticles.filter((a) => {
            if (a.categoryId === currentPage) return true;
            if (currentPage === 'politica' && (a.categoryId === 'analise-global' || a.category.toLowerCase().includes('politic') || a.category.toLowerCase().includes('análise'))) return true;
            if (currentPage === 'economia' && (a.categoryId === 'economia' || a.category.toLowerCase().includes('economi'))) return true;
            if (currentPage === 'kamba-cultura' && (a.categoryId === 'kamba-cultura' || a.category.toLowerCase().includes('kamba'))) return true;
            if (currentPage === 'turismo' && (a.categoryId === 'turismo' || a.category.toLowerCase().includes('turismo'))) return true;
            return a.category.toLowerCase().includes(currentPage.replace('-', ' '));
          })}
          onOpenArticle={handleOpenArticle}
          onToggleBookmark={handleToggleBookmark}
          onToggleLike={handleToggleLike}
          bookmarkedIds={bookmarkedIds}
          likedIds={likedIds}
        />
      )}

      {/* MEU FEED */}
      {currentPage === 'feed' && (
        <FeedPage
          articles={publicArticles}
          onOpenArticle={handleOpenArticle}
          onToggleBookmark={handleToggleBookmark}
          onToggleLike={handleToggleLike}
          bookmarkedIds={bookmarkedIds}
          likedIds={likedIds}
        />
      )}

      {/* FAVORITOS */}
      {currentPage === 'favorites' && (
        <FavoritesPage
          favoriteArticles={favoriteArticles}
          onOpenArticle={handleOpenArticle}
          onToggleBookmark={handleToggleBookmark}
          onToggleLike={handleToggleLike}
          bookmarkedIds={bookmarkedIds}
          likedIds={likedIds}
          onClearAllFavorites={handleClearAllFavorites}
        />
      )}

      {/* HISTÓRIA */}
      {currentPage === 'history' && <HistoryPage />}

      {/* BLOG */}
      {currentPage === 'blog' && (
        <BlogPage
          articles={publicArticles.filter((a) => a.categoryId === 'blog' || a.category.includes('Opinião'))}
          onOpenArticle={handleOpenArticle}
          onToggleBookmark={handleToggleBookmark}
          onToggleLike={handleToggleLike}
          bookmarkedIds={bookmarkedIds}
          likedIds={likedIds}
        />
      )}

      {/* EDIÇÕES REVISTA */}
      {currentPage === 'edicoes' && (
        <EditionsPage
          editions={magazineEditionsList}
          onOpenEdition={setSelectedEdition}
          onShowToast={showToast}
        />
      )}

      {/* IMAGENS (GALERIA) */}
      {currentPage === 'galeria' && (
        <GalleryPage items={publicGalleryItems} onShowToast={showToast} />
      )}

      {/* VÍDEOS */}
      {currentPage === 'videos' && (
        <VideosPage items={publicVideoItems} onShowToast={showToast} />
      )}

      {/* AS 7 MARAVILHAS DE ANGOLA & GUIA TURÍSTICO */}
      {currentPage === 'maravilhas' && (
        <WondersPage
          wonders={publicNaturalWonders}
          onNavigate={handleNavigate}
          articles={publicArticles}
          onOpenArticle={handleOpenArticle}
          onToggleBookmark={handleToggleBookmark}
          onToggleLike={handleToggleLike}
          bookmarkedIds={bookmarkedIds}
          likedIds={likedIds}
          onShowToast={showToast}
        />
      )}
    </>
  );
}
