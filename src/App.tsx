/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { NavPage, Article, MagazineEdition, CategoryId, GalleryItem, VideoItem } from './types';
import { initialArticles } from './data/articles';
import { initialGalleryItems } from './data/galleryData';
import { initialVideoItems } from './data/videosData';
import { initialMagazineEditions, magazineEditions } from './data/magazineEditions';
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
import { ArticleCard } from './components/ArticleCard';
import { AdminGate } from './components/Admin/AdminGate';
import { fetchArticles } from './lib/articleService';
import { fetchGalleryItems } from './lib/galleryService';
import { fetchVideoItems } from './lib/videoService';
import { fetchMagazineEditions } from './lib/editionService';
import { isSupabaseConfigured } from './lib/supabase';
import { Search, X, FolderSearch } from 'lucide-react';

function getInitialPage(): NavPage {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
    const hash = window.location.hash.toLowerCase().replace(/^#\/?/, '');
    if (path === '/admin' || hash === 'admin') {
      return 'admin';
    }
  }
  return 'home';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavPage>(getInitialPage);
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(initialGalleryItems);
  const [videoItems, setVideoItems] = useState<VideoItem[]>(initialVideoItems);
  const [magazineEditionsList, setMagazineEditionsList] = useState<MagazineEdition[]>(initialMagazineEditions);
  const [articlesLoading, setArticlesLoading] = useState(isSupabaseConfigured);
  const [articlesError, setArticlesError] = useState<string | null>(null);

  const loadArticlesFromBackend = useCallback(async () => {
    setArticlesLoading(true);
    setArticlesError(null);
    try {
      const fromDb = await fetchArticles();
      if (fromDb && fromDb.length > 0) {
        setArticles(fromDb);
      } else {
        setArticles(initialArticles);
      }
    } catch (err) {
      console.warn('[Mosaico Angolano] Erro ao carregar notícias, a utilizar catálogo padrão:', err);
      setArticles(initialArticles);
    } finally {
      setArticlesLoading(false);
    }
  }, []);

  const loadGalleryFromBackend = useCallback(async () => {
    try {
      const items = await fetchGalleryItems();
      setGalleryItems(items.length > 0 ? items : initialGalleryItems);
    } catch (err) {
      console.error('Erro ao carregar galeria:', err);
    }
  }, []);

  const loadVideosFromBackend = useCallback(async () => {
    try {
      const items = await fetchVideoItems();
      setVideoItems(items.length > 0 ? items : initialVideoItems);
    } catch (err) {
      console.error('Erro ao carregar vídeos:', err);
    }
  }, []);

  const loadEditionsFromBackend = useCallback(async () => {
    try {
      const items = await fetchMagazineEditions();
      setMagazineEditionsList(items.length > 0 ? items : initialMagazineEditions);
    } catch (err) {
      console.error('Erro ao carregar edições da revista:', err);
    }
  }, []);

  useEffect(() => {
    loadArticlesFromBackend();
    loadGalleryFromBackend();
    loadVideosFromBackend();
    loadEditionsFromBackend();
  }, [loadArticlesFromBackend, loadGalleryFromBackend, loadVideosFromBackend, loadEditionsFromBackend]);

  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
      const hash = window.location.hash.toLowerCase().replace(/^#\/?/, '');
      const onAdmin = path === '/admin' || hash === 'admin';
      setCurrentPage((prev) => {
        if (onAdmin) return 'admin';
        return prev === 'admin' ? 'home' : prev;
      });
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const wantsAdminPath = currentPage === 'admin';
    const isOnAdminPath = window.location.pathname.replace(/\/$/, '') === '/admin';
    if (wantsAdminPath && !isOnAdminPath) {
      window.history.pushState({}, '', '/admin');
    } else if (!wantsAdminPath && isOnAdminPath) {
      window.history.pushState({}, '', '/');
    }
  }, [currentPage]);

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

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
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
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
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

      setArticles((prevArticles) =>
        prevArticles.map((art) => {
          if (art.id === articleId) {
            return {
              ...art,
              likes: Math.max(0, art.likes + (isAlreadyLiked ? -1 : 1)),
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

    setSelectedArticle((prev) => {
      if (prev && prev.id === articleId) {
        return {
          ...prev,
          commentsCount: (prev.commentsCount || 0) + 1,
          comments: [newCommentObj, ...(prev.comments || [])],
        };
      }
      return prev;
    });
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

    setSelectedArticle((prev) => {
      if (prev && prev.id === articleId && prev.comments) {
        const updated = prev.comments.map((c) => {
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
        return { ...prev, comments: updated };
      }
      return prev;
    });
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
    // Fallback se houver poucos artigos fora do carrossel
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
    setCurrentPage(page);
    setSelectedArticle(null);
    setSearchQuery('');
  };

  const handleOpenArticle = (art: Article) => {
    const fresh = articles.find((a) => a.id === art.id) || art;
    setSelectedArticle(fresh);
    setSearchQuery('');
  };

  const categoryConfigs: Record<
    CategoryId,
    { title: string; subtitle: string }
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
        'Roteiros inesquecíveis, paisagens de cortar a respiração, ecoturismo e a isenção de vistos para viajantes.',
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

  if (currentPage === 'admin') {
    return (
      <AdminGate
        articles={articles}
        galleryItems={galleryItems}
        videoItems={videoItems}
        magazineEditions={magazineEditionsList}
        articlesLoading={articlesLoading}
        articlesError={articlesError}
        onArticlesChanged={loadArticlesFromBackend}
        onGalleryChanged={loadGalleryFromBackend}
        onVideosChanged={loadVideosFromBackend}
        onEditionsChanged={loadEditionsFromBackend}
        onGoToSite={() => handleNavigate('home')}
        onShowToast={showToast}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f5f7] text-[#333]">
      {/* HEADER */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        favoritesCount={bookmarkedIds.size}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenArticle={(id) => {
          const found = articles.find((a) => a.id === id);
          if (found) handleOpenArticle(found);
        }}
      />

      {/* MAIN CONTAINER */}
      <main className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 flex-1">
        {selectedArticle ? (
          <ArticlePage
            article={selectedArticle}
            onBack={() => setSelectedArticle(null)}
            onNavigate={handleNavigate}
            onToggleBookmark={handleToggleBookmark}
            onToggleLike={handleToggleLike}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
            isBookmarked={bookmarkedIds.has(selectedArticle.id)}
            isLiked={likedIds.has(selectedArticle.id)}
            onShowToast={showToast}
            onOpenArticle={handleOpenArticle}
            allArticles={articles}
          />
        ) : searchQuery.trim() ? (
          <div className="py-6 sm:py-8 space-y-6">
            <div className="bg-white p-6 rounded-2xl border-l-6 border-[#d9251d] shadow-xs flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#111] flex items-center gap-2">
                  <Search className="w-5 h-5 text-[#d9251d]" />
                  <span>Resultados da Pesquisa: "{searchQuery}"</span>
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  Encontrados {searchResults.length} artigos correspondentes
                </p>
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-semibold text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Limpar Pesquisa</span>
              </button>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((art) => (
                  <ArticleCard
                    key={art.id}
                    article={art}
                    onOpenArticle={handleOpenArticle}
                    onToggleBookmark={handleToggleBookmark}
                    onToggleLike={handleToggleLike}
                    isBookmarked={bookmarkedIds.has(art.id)}
                    isLiked={likedIds.has(art.id)}
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
        ) : (
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

            {/* CATEGORY PAGES */}
            {currentPage in categoryConfigs && (
              <CategoryPage
                categoryId={currentPage as CategoryId}
                title={categoryConfigs[currentPage as CategoryId].title}
                subtitle={categoryConfigs[currentPage as CategoryId].subtitle}
                articles={currentPage === 'todas' ? publicArticles : publicArticles.filter((a) => {
                  if (a.categoryId === currentPage) return true;
                  if (currentPage === 'politica' && (a.categoryId === 'analise-global' || a.category.toLowerCase().includes('politic') || a.category.toLowerCase().includes('análise'))) return true;
                  if (currentPage === 'economia' && (a.categoryId === 'economia' || a.category.toLowerCase().includes('economi'))) return true;
                  if (currentPage === 'kamba-cultura' && (a.categoryId === 'kamba-cultura' || a.category.toLowerCase().includes('kamba'))) return true;
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
          </>
        )}
      </main>

      {/* FOOTER */}
      <Footer onNavigate={handleNavigate} onShowToast={showToast} />

      {/* MAGAZINE DIGITAL FLIPBOOK READER MODAL */}
      {selectedEdition && (
        <MagazineReaderModal
          edition={selectedEdition}
          onClose={() => setSelectedEdition(null)}
          onShowToast={showToast}
        />
      )}

      {/* TOAST NOTIFICATION */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
