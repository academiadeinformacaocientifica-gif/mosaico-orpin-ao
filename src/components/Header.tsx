import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  Bookmark, 
  Clock, 
  BookOpen, 
  Search, 
  Building2, 
  Newspaper, 
  Menu, 
  X, 
  BookMarked, 
  Calendar, 
  Compass, 
  FileText,
  Info,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NavPage } from '../types';
import { MosaicoLogo } from './MosaicoLogo';

interface HeaderProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  favoritesCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenArticle: (articleId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  favoritesCount,
  searchQuery,
  onSearchChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  const quickSearchTags = [
    'ONU Turismo',
    'Balbina da Silva',
    'IMEX Barcelona',
    'Vity Nsalambi',
    'Guia Consular',
    'Economia'
  ];

  // Close search focus on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchFocused) {
        setIsSearchFocused(false);
        searchInputRef.current?.blur();
        mobileSearchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchFocused]);

  const mainNavItems: { id: NavPage; label: string }[] = [
    { id: 'politica', label: 'Politica' },
    { id: 'angolberica', label: 'Angolbérica' },
    { id: 'economia', label: 'Economia' },
    { id: 'panorama-consular', label: 'Panorama Consular' },
    { id: 'kultura-360', label: 'Kultura 360' },
    { id: 'turismo', label: 'Turismo' },
  ];

  const secondaryNavItems: { id: NavPage; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'sobre', label: 'Sobre', icon: <Info className="w-4 h-4" /> },
    { id: 'feed', label: 'Meu Feed', icon: <Newspaper className="w-4 h-4" /> },
    { 
      id: 'favorites', 
      label: 'Favoritos', 
      icon: <Bookmark className="w-4 h-4" />, 
      badge: favoritesCount 
    },
    { id: 'history', label: 'História', icon: <Clock className="w-4 h-4" /> },
    { id: 'blog', label: 'Blog', icon: <FileText className="w-4 h-4" /> },
    { id: 'edicoes', label: 'Edições', icon: <BookMarked className="w-4 h-4" /> },
  ];

  const handleNavClick = (page: NavPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setIsSearchFocused(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTagClick = (tag: string) => {
    onSearchChange(tag);
    setIsSearchFocused(false);
  };

  return (
    <>
      {/* SOFT BACKDROP DIMMING OVERLAY WITH FADE ANIMATION */}
      <AnimatePresence>
        {isSearchFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={() => setIsSearchFocused(false)}
            className="fixed inset-0 bg-black/55 backdrop-blur-[2px] z-40 transition-all cursor-pointer"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <header className={`bg-white border-b border-[#e0e0e0] sticky top-0 shadow-xs transition-colors duration-200 ${isSearchFocused ? 'z-50' : 'z-30'}`}>
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          {/* TOP BAR */}
          <div className="flex items-center justify-between py-3.5 border-b border-[#f0f0f0]">
            {/* LOGO & EMBASSY SUBTITLE */}
            <div 
              className="flex items-center gap-3.5 cursor-pointer group"
              onClick={() => handleNavClick('home')}
            >
              <div id="logo-btn" className="transition-transform group-hover:scale-105">
                <MosaicoLogo size="md" />
              </div>
              <div className="text-[10px] font-bold text-[#444] uppercase leading-snug tracking-[0.5px] border-l-2 border-[#d9251d] pl-2.5 max-w-[280px] hidden sm:block">
                REVISTA DA EMBAIXADA DA REPÚBLICA DE ANGOLA NO REINO DE ESPANHA E PRINCIPADO DE ANDORRA
              </div>
            </div>

            {/* DESKTOP MAIN NAVIGATION */}
            <nav className="hidden lg:flex items-center gap-1.5">
              <ul className="flex items-center gap-1 list-none m-0 p-0">
                {mainNavItems.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      className={`font-semibold text-[11px] transition-all cursor-pointer px-2.5 py-1.5 rounded-sm whitespace-nowrap ${
                        currentPage === item.id
                          ? 'text-white bg-[#d9251d] shadow-xs'
                          : 'text-[#444] hover:text-white hover:bg-[#d9251d]'
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
                <li>
                  <a
                    href="https://www.governo.gov.ao"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#111] hover:bg-[#d9251d] text-white text-[11px] font-bold rounded-full px-3.5 py-1.5 flex items-center gap-1.5 transition-colors shadow-xs ml-1"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Portal Institucional</span>
                  </a>
                </li>
              </ul>
            </nav>

            {/* MOBILE MENU TOGGLE */}
            <div className="flex items-center gap-2 lg:hidden">
              <a
                href="https://www.governo.gov.ao"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#111] text-white text-[10px] font-bold rounded-full px-2.5 py-1 flex items-center gap-1"
              >
                <Building2 className="w-3 h-3" />
                <span>Institucional</span>
              </a>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#444] hover:text-[#d9251d] focus:outline-none"
                aria-label="Abrir Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* SECONDARY NAV BAR */}
          <div className="hidden lg:flex items-center justify-between py-2.5">
            <ul className="flex items-center gap-2 list-none m-0 p-0 flex-wrap">
              {secondaryNavItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      className={`text-[13px] font-medium flex items-center gap-1.5 cursor-pointer transition-all px-2.5 py-1 rounded-sm ${
                        isActive
                          ? 'text-[#d9251d] font-bold bg-[#f8f9fa] border-b-2 border-[#d9251d]'
                          : 'text-[#666] hover:text-[#d9251d] hover:bg-[#f8f9fa]'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      {item.badge !== undefined && (
                        <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ml-0.5 ${
                          item.badge > 0 ? 'bg-[#d9251d] text-white' : 'bg-[#e5e7eb] text-[#666]'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* SEARCH BOX WITH ANIMATED SOFT FOCUS & OVERLAY */}
            <div className={`relative transition-all duration-300 ${isSearchFocused ? 'z-50' : 'z-10'}`}>
              <motion.div 
                animate={{
                  width: isSearchFocused ? '380px' : '240px',
                  scale: isSearchFocused ? 1.02 : 1,
                }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className={`relative flex items-center rounded-full transition-shadow duration-300 ${
                  isSearchFocused 
                    ? 'ring-4 ring-[#d9251d]/15 shadow-xl shadow-black/10 bg-white border border-[#d9251d]' 
                    : 'border border-[#ccc] bg-[#f9f9f9] shadow-xs'
                }`}
              >
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                  <MosaicoLogo variant="icon" size="sm" className="!w-4 !h-4 !rounded-xs shrink-0" />
                  <Search className={`w-3.5 h-3.5 transition-colors ${isSearchFocused ? 'text-[#d9251d]' : 'text-[#888]'}`} />
                </div>
                
                <input
                  ref={searchInputRef}
                  type="text"
                  id="search-input"
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={isSearchFocused ? "Escreva para pesquisar notícias, temas..." : "Pesquisar notícias, temas..."}
                  className="w-full pl-14 pr-16 py-2 rounded-full outline-none text-xs text-[#222] bg-transparent font-medium"
                />

                {/* Clear Button and ESC hint */}
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {searchQuery && (
                    <button
                      onClick={() => {
                        onSearchChange('');
                        searchInputRef.current?.focus();
                      }}
                      className="text-gray-400 hover:text-red-600 text-xs font-bold p-1 transition-colors"
                      title="Limpar pesquisa"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {isSearchFocused && (
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-sm border border-gray-200 pointer-events-none">
                      ESC
                    </span>
                  )}
                </div>
              </motion.div>

              {/* QUICK SUGGESTIONS DROPDOWN WHEN SEARCH IS FOCUSED */}
              <AnimatePresence>
                {isSearchFocused && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-full min-w-[340px] bg-white rounded-xl shadow-2xl border border-gray-200 p-3.5 z-50 text-left"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-[#d9251d]" />
                        Sugestões de Pesquisa
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {searchQuery ? 'Filtrando...' : 'Temas populares'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {quickSearchTags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleTagClick(tag)}
                          className="text-xs bg-[#f4f5f7] hover:bg-[#d9251d] hover:text-white text-[#444] px-2.5 py-1 rounded-full font-medium transition-colors flex items-center gap-1"
                        >
                          <Sparkles className="w-2.5 h-2.5 opacity-60" />
                          {tag}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* MOBILE SLIDE-DOWN DRAWER */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-[#f0f0f0] flex flex-col gap-3">
              {/* Mobile Search */}
              <div className="relative mb-2">
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                  <MosaicoLogo variant="icon" size="sm" className="!w-4 !h-4 !rounded-xs" />
                  <Search className="w-3.5 h-3.5 text-[#888]" />
                </div>
                <input
                  ref={mobileSearchInputRef}
                  type="text"
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Pesquisar notícias..."
                  className="w-full pl-13 pr-4 py-2 rounded-lg border border-[#ccc] text-sm outline-none bg-[#f9f9f9] focus:border-[#d9251d] focus:bg-white"
                />
              </div>

              <div className="text-[11px] font-bold text-[#888] uppercase tracking-wider mb-1">
                Categorias Principais
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {mainNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`text-left text-xs font-semibold p-2 rounded-sm ${
                      currentPage === item.id
                        ? 'bg-[#d9251d] text-white'
                        : 'bg-[#f4f5f7] text-[#333] hover:bg-[#e5e7eb]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="text-[11px] font-bold text-[#888] uppercase tracking-wider mt-3 mb-1">
                Navegação & Utilidades
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {secondaryNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-2 text-xs font-medium p-2 rounded-sm ${
                      currentPage === item.id
                        ? 'bg-[#d9251d] text-white'
                        : 'bg-[#f4f5f7] text-[#444] hover:bg-[#e5e7eb]'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="bg-[#d9251d] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-auto">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};
