import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ThumbsUp, 
  Bookmark, 
  Share2, 
  Calendar, 
  Clock, 
  User, 
  Send, 
  Volume2, 
  VolumeX, 
  Check, 
  MessageSquare,
  Sparkles,
  Heart,
  ChevronRight,
  ArrowUp,
  Tag
} from 'lucide-react';
import { Article, NavPage } from '../../types';

interface ArticlePageProps {
  article: Article;
  onBack: () => void;
  onNavigate: (page: NavPage) => void;
  onToggleBookmark: (articleId: string) => void;
  onToggleLike: (articleId: string) => void;
  onAddComment: (articleId: string, commentText: string, authorName: string) => void;
  onLikeComment: (articleId: string, commentId: string) => void;
  isBookmarked: boolean;
  isLiked: boolean;
  onShowToast: (msg: string) => void;
  onOpenArticle: (article: Article) => void;
  allArticles: Article[];
}

export const ArticlePage: React.FC<ArticlePageProps> = ({
  article,
  onBack,
  onNavigate,
  onToggleBookmark,
  onToggleLike,
  onAddComment,
  onLikeComment,
  isBookmarked,
  isLiked,
  onShowToast,
  onOpenArticle,
  allArticles,
}) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // Scroll window to top when article is loaded or changes
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Stop any speech synthesis if running
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [article.id]);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${article.title} - Leia na Revista Mosaico: ${url}`);
      setCopiedLink(true);
      onShowToast('Link do artigo copiado para a área de transferência!');
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      onShowToast('A reprodução de áudio não é suportada no seu navegador.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const textToRead = `${article.title}. ${article.subtitle || ''}. ${article.description}. ${article.fullContent?.join(' ') || ''}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'pt-PT';
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
      onShowToast('A reproduzir áudio do artigo em voz alta...');
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const finalAuthor = authorName.trim() || 'Leitor(a) Mosaico';
    onAddComment(article.id, newComment.trim(), finalAuthor);
    setNewComment('');
    onShowToast('Comentário publicado com sucesso!');
  };

  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id && (a.categoryId === article.categoryId || a.category === article.category))
    .slice(0, 3);

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'large':
        return 'text-lg sm:text-xl leading-relaxed sm:leading-loose';
      case 'xlarge':
        return 'text-xl sm:text-2xl leading-loose';
      default:
        return 'text-[16px] sm:text-[17px] leading-relaxed sm:leading-[1.8]';
    }
  };

  return (
    <article className="py-6 sm:py-8 space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* BREADCRUMB & TOP NAVIGATION */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium overflow-x-auto py-1">
          <button
            onClick={onBack}
            className="text-gray-700 hover:text-[#d9251d] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar</span>
          </button>
          <span>/</span>
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-[#d9251d] transition-colors cursor-pointer"
          >
            Início
          </button>
          <span>/</span>
          <span className="text-gray-500 font-medium truncate max-w-xs">
            Notícia
          </span>
        </div>

        {/* READER TOOLS: AUDIO + FONT + SHARE */}
        <div className="flex items-center gap-2">
          {/* AUDIO PLAYER */}
          <button
            onClick={handleToggleSpeech}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isPlayingAudio 
                ? 'bg-[#d9251d] text-white shadow-xs' 
                : 'bg-white text-gray-700 hover:text-black hover:bg-gray-100 border border-gray-200 shadow-xs'
            }`}
            title={isPlayingAudio ? 'Parar leitura' : 'Ouvir artigo em áudio'}
          >
            {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#d9251d]" />}
            <span>{isPlayingAudio ? 'Parar Áudio' : 'Ouvir Artigo'}</span>
          </button>

          {/* FONT SIZE CONTROLS */}
          <div className="flex items-center bg-white border border-gray-200 rounded-lg p-0.5 text-xs shadow-xs">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-1 rounded-md font-bold transition-all cursor-pointer ${
                fontSize === 'normal' ? 'bg-[#d9251d] text-white shadow-xs' : 'text-gray-600 hover:text-black'
              }`}
              title="Tamanho normal"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-1 rounded-md font-bold transition-all cursor-pointer ${
                fontSize === 'large' ? 'bg-[#d9251d] text-white shadow-xs' : 'text-gray-600 hover:text-black'
              }`}
              title="Tamanho maior"
            >
              A+
            </button>
            <button
              onClick={() => setFontSize('xlarge')}
              className={`px-2 py-1 rounded-md font-bold transition-all cursor-pointer ${
                fontSize === 'xlarge' ? 'bg-[#d9251d] text-white shadow-xs' : 'text-gray-600 hover:text-black'
              }`}
              title="Tamanho extra grande"
            >
              A++
            </button>
          </div>

          {/* SHARE BUTTON */}
          <button
            onClick={handleShare}
            className="p-1.5 sm:px-3 sm:py-1.5 bg-white border border-gray-200 text-gray-700 hover:text-[#d9251d] hover:bg-gray-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Copiar link do artigo"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedLink ? 'Copiado!' : 'Partilhar'}</span>
          </button>
        </div>
      </div>

      {/* ARTICLE HEADER & TITLE */}
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111] leading-tight sm:leading-tight">
          {article.title}
        </h1>

        {article.subtitle && (
          <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed border-l-4 border-[#d9251d] pl-4 italic">
            {article.subtitle}
          </p>
        )}

        {/* AUTHOR & PUBLICATION META */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100 text-xs text-gray-600">
          <div className="flex items-center gap-3">
            {article.author.avatar ? (
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-red-50 text-[#d9251d] flex items-center justify-center font-bold text-sm border border-red-100">
                <User className="w-5 h-5" />
              </div>
            )}
            <div>
              <div className="font-bold text-gray-900 text-sm sm:text-base">{article.author.name}</div>
              <div className="text-gray-500 text-xs">{article.author.role}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium bg-gray-50 px-3.5 py-2 rounded-xl border border-gray-200">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#d9251d]" />
              <span>{article.date}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>{article.readTime} de leitura</span>
            </div>
          </div>
        </div>
      </div>

      {/* FULL FEATURED IMAGE */}
      <div className="w-full rounded-2xl overflow-hidden shadow-md bg-gray-900 border border-gray-200">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full max-h-[520px] object-cover"
        />
      </div>

      {/* ARTICLE CONTENT CARD */}
      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-gray-200/80 shadow-xs space-y-6">
        {/* PARAGRAPHS */}
        <div className={`space-y-6 text-[#222] ${getFontSizeClass()}`}>
          {article.fullContent && article.fullContent.length > 0 ? (
            article.fullContent.map((paragraph, idx) => (
              <p key={idx} className="text-justify leading-relaxed">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="text-justify leading-relaxed">{article.description}</p>
          )}
        </div>

        {/* KEYWORDS / TAGS */}
        {article.tags && article.tags.length > 0 && (
          <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-500 flex items-center gap-1 mr-1">
              <Tag className="w-3.5 h-3.5 text-[#d9251d]" />
              <span>Palavras-chave:</span>
            </span>
            {article.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-gray-100 hover:bg-[#d9251d] hover:text-white transition-colors text-gray-700 text-xs px-3 py-1 rounded-full font-medium cursor-default"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* INTERACTION BAR (LIKE, BOOKMARK, SHARE) */}
        <div className="bg-gray-50 p-4 sm:p-5 rounded-xl flex flex-wrap items-center justify-between gap-3 border border-gray-200 mt-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onToggleLike(article.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer shadow-xs ${
                isLiked
                  ? 'bg-[#d9251d] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{article.likes + (isLiked ? 1 : 0)} {article.likes + (isLiked ? 1 : 0) === 1 ? 'Gosto' : 'Gostos'}</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleBookmark(article.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer shadow-xs ${
                isBookmarked
                  ? 'bg-[#0056b3] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              <span>{isBookmarked ? 'Guardado nos Favoritos' : 'Guardar Artigo'}</span>
            </button>
          </div>

          <button
            onClick={handleShare}
            className="text-xs text-gray-600 hover:text-[#d9251d] font-semibold flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-gray-100 border border-gray-200 transition-colors cursor-pointer shadow-xs"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>Partilhar Notícia</span>
          </button>
        </div>

        {/* COMMENTS SECTION */}
        <div className="pt-8 border-t border-gray-200">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#d9251d]" />
            <span>Espaço de Diálogo & Comentários ({article.comments?.length || 0})</span>
          </h3>

          {/* NEW COMMENT FORM */}
          <form onSubmit={handleSubmitComment} className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200 mb-6 flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="O seu nome (ex: Maria Silva ou António Bento)"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="p-3 text-xs bg-white rounded-lg border border-gray-300 outline-none focus:border-[#d9251d] transition-colors"
              />
            </div>
            <textarea
              rows={3}
              placeholder="Escreva a sua reflexão ou opinião construtiva sobre este artigo..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
              className="p-3 text-xs bg-white rounded-lg border border-gray-300 outline-none focus:border-[#d9251d] resize-none transition-colors"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#d9251d] hover:bg-[#b01b14] text-white text-xs font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publicar Comentário</span>
              </button>
            </div>
          </form>

          {/* COMMENTS LIST */}
          <div className="space-y-3.5">
            {article.comments && article.comments.length > 0 ? (
              article.comments.map((comm) => (
                <div key={comm.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200/80 shadow-xs flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-red-100 text-[#d9251d] font-bold flex items-center justify-center text-xs">
                        {comm.author.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 text-sm">{comm.author}</span>
                        {comm.role && <span className="text-gray-500 text-[11px] ml-2">• {comm.role}</span>}
                      </div>
                    </div>
                    <span className="text-[11px] text-gray-400">{comm.date}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed pl-10">
                    {comm.content}
                  </p>
                  <div className="flex items-center justify-end gap-2 pl-10 pt-1 text-xs">
                    <button
                      onClick={() => onLikeComment(article.id, comm.id)}
                      className={`flex items-center gap-1 cursor-pointer transition-colors ${
                        comm.likedByUser ? 'text-[#d9251d] font-bold' : 'text-gray-500 hover:text-[#d9251d]'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${comm.likedByUser ? 'fill-current text-[#d9251d]' : ''}`} />
                      <span>{comm.likes} {comm.likes === 1 ? 'gosto' : 'gostos'}</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                Ainda não existem comentários. Seja o primeiro a partilhar uma reflexão sobre esta publicação!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RELATED ARTICLES SECTION */}
      {relatedArticles.length > 0 && (
        <div className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-[#111]">
              Artigos Relacionados
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedArticles.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onOpenArticle(rel)}
                className="bg-white p-4 rounded-xl border border-gray-200 hover:border-[#d9251d] cursor-pointer transition-all hover:shadow-md group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="h-32 w-full rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={rel.imageUrl}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#d9251d] transition-colors line-clamp-2 pt-1">
                    {rel.title}
                  </h4>
                </div>
                <div className="text-[11px] text-gray-400 mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span>{rel.date}</span>
                  <span className="font-semibold text-gray-600 group-hover:text-[#d9251d] flex items-center gap-0.5">
                    Ler <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BOTTOM RETURN BAR */}
      <div className="pt-4 flex items-center justify-between border-t border-gray-200">
        <button
          onClick={onBack}
          className="bg-white hover:bg-gray-100 text-gray-800 text-xs font-bold px-4 py-2.5 rounded-xl border border-gray-200 flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#d9251d]" />
          <span>Voltar à Página Anterior</span>
        </button>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-xs text-gray-500 hover:text-black font-semibold flex items-center gap-1.5 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <span>Voltar ao Topo</span>
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
};
