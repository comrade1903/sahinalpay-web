/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Bookmark,
  Share2,
  BookOpen,
  Clock,
  Tag,
  Calendar,
  CheckCircle,
  Mail,
  ChevronRight,
} from "lucide-react";
import { ARTICLES } from "../data";

interface ArticleDetailViewProps {
  articleId: string;
  onNavigate: (view: string, params?: any) => void;
}

export default function ArticleDetailView({ articleId, onNavigate }: ArticleDetailViewProps) {
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg" | "xl">("lg");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareFeedback, setShowShareFeedback] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Find active article
  const article = ARTICLES.find((a) => a.id === articleId) || ARTICLES[0];

  // Map other articles for similar list
  const similarArticles = ARTICLES.filter((a) => (article.similarIds ?? []).includes(a.id));

  // Simulating reading scroll progress bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShare = () => {
    // Simulated copy link
    const dummyUrl = `${window.location.origin}/makale/${article.id}`;
    navigator.clipboard.writeText(dummyUrl).then(() => {
      setShowShareFeedback(true);
      setTimeout(() => setShowShareFeedback(false), 3000);
    });
  };

  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleSidebarSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  // Convert size keyword to Tailwind font classes
  const getBodyFontClass = () => {
    switch (fontSize) {
      case "sm": return "text-sm sm:text-base leading-relaxed";
      case "base": return "text-base sm:text-lg leading-relaxed";
      case "lg": return "text-lg sm:text-xl leading-relaxed";
      case "xl": return "text-xl sm:text-2xl leading-relaxed";
    }
  };

  return (
    <div className="bg-[#ffffff] min-h-screen pb-16 font-body text-[#0f172a]" id="reader-view">
      
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-[#dbeafe] z-50 pointer-events-none" id="progress-bar-container">
        <div 
          className="h-full bg-[#1d4ed8] transition-all duration-100" 
          style={{ width: `${scrollProgress}%` }}
          id="progress-bar-fill"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Back Button */}
        <button
          onClick={() => onNavigate("kose-yazilari")}
          className="inline-flex items-center space-x-2 text-sm font-semibold text-[#475569] hover:text-[#1d4ed8] transition-colors mb-8 cursor-pointer group"
          id="back-to-archive-btn"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Arşive Geri Dön</span>
        </button>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Floating Action Column (Left desktop only) */}
          <div className="hidden lg:block lg:col-span-1 sticky top-32 space-y-6" id="floating-sidebar">
            <div className="flex flex-col items-center space-y-4 bg-white border border-[#dbeafe] rounded-full py-6 shadow-sm">
              {/* Bookmark */}
              <button
                onClick={handleBookmarkToggle}
                className={`p-3 rounded-full border transition-all ${
                  isBookmarked 
                    ? "bg-[#1d4ed8] text-white border-[#1d4ed8]" 
                    : "border-[#dbeafe] text-[#475569] hover:text-[#1d4ed8] hover:bg-[#ffffff]"
                }`}
                title="Yazıyı Kaydet"
              >
                <Bookmark className="w-5 h-5 fill-current" />
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className="p-3 rounded-full border border-[#dbeafe] text-[#475569] hover:text-[#1d4ed8] hover:bg-[#ffffff] transition-all"
                title="Bağlantıyı Kopyala"
              >
                <Share2 className="w-5 h-5" />
              </button>

              <div className="w-8 h-px bg-[#eff6ff]" />

              {/* Text Size adjust toggle */}
              <div className="flex flex-col items-center space-y-2">
                <span className="text-[10px] font-mono tracking-wider text-[#94a3b8] uppercase">Boyut</span>
                <button
                  onClick={() => setFontSize("sm")}
                  className={`w-8 h-8 rounded-full text-xs font-mono font-bold flex items-center justify-center transition-all ${
                    fontSize === "sm" ? "bg-[#1d4ed8] text-white" : "text-[#475569] hover:bg-[#ffffff]"
                  }`}
                >
                  S
                </button>
                <button
                  onClick={() => setFontSize("base")}
                  className={`w-8 h-8 rounded-full text-xs font-mono font-bold flex items-center justify-center transition-all ${
                    fontSize === "base" ? "bg-[#1d4ed8] text-white" : "text-[#475569] hover:bg-[#ffffff]"
                  }`}
                >
                  M
                </button>
                <button
                  onClick={() => setFontSize("lg")}
                  className={`w-8 h-8 rounded-full text-xs font-mono font-bold flex items-center justify-center transition-all ${
                    fontSize === "lg" ? "bg-[#1d4ed8] text-white" : "text-[#475569] hover:bg-[#ffffff]"
                  }`}
                >
                  L
                </button>
                <button
                  onClick={() => setFontSize("xl")}
                  className={`w-8 h-8 rounded-full text-xs font-mono font-bold flex items-center justify-center transition-all ${
                    fontSize === "xl" ? "bg-[#1d4ed8] text-white" : "text-[#475569] hover:bg-[#ffffff]"
                  }`}
                >
                  XL
                </button>
              </div>

            </div>

            {/* Sharing Feedback banner */}
            {showShareFeedback && (
              <div className="bg-[#1d4ed8] text-white text-xs p-3 rounded-xl text-center shadow border border-[#1e40af] animate-fade-in">
                Arşiv bağlantısı panoya kopyalandı!
              </div>
            )}
          </div>

          {/* Core Reader Paper (Center Column) */}
          <article className="lg:col-span-8 bg-white border border-[#dbeafe] rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm space-y-8" id="article-paper">
            
            {/* Header info */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1e3a5f] bg-[#f8fafc] border border-[#dbeafe] px-3 py-1 rounded-full">
                  {article.category}
                </span>
                <span className="text-[#94a3b8] font-mono text-xs">•</span>
                <span className="text-xs font-mono font-semibold uppercase text-[#1d4ed8]">
                  {article.source}
                </span>
              </div>

              <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-[#0f172a] tracking-tight leading-[1.15]" id="article-detail-title">
                {article.title}
              </h1>

              {/* Author & Meta Row */}
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#475569] pt-2 border-b border-[#eff6ff] pb-6">
                <div className="flex items-center space-x-2">
                  <span className="w-8 h-8 rounded-full border border-[#dbeafe] bg-[#eff6ff] flex items-center justify-center text-[#1d4ed8] font-headline font-bold text-xs">
                    ŞA
                  </span>
                  <div>
                    <span className="font-semibold text-[#0f172a] block">Dr. Şahin Alpay</span>
                    <span className="text-[10px] text-[#94a3b8] block">Yazar / Akademisyen</span>
                  </div>
                </div>

                <div className="h-4 w-px bg-[#dbeafe]" />

                <div className="flex items-center space-x-1.5 font-mono text-xs">
                  <Calendar className="w-4 h-4 text-[#94a3b8]" />
                  <span>{article.date}</span>
                </div>

                <div className="h-4 w-px bg-[#dbeafe]" />

                <div className="flex items-center space-x-1.5 font-mono text-xs">
                  <Clock className="w-4 h-4 text-[#94a3b8]" />
                  <span>{article.readTime} okuma</span>
                </div>
              </div>
            </div>

            {/* Mobile Actions Toolbar */}
            <div className="flex lg:hidden items-center justify-between bg-[#ffffff] border border-[#dbeafe] p-3 rounded-xl text-xs" id="mobile-toolbar">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleBookmarkToggle}
                  className={`flex items-center gap-1 font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                    isBookmarked ? "bg-[#1d4ed8] text-white border-[#1d4ed8]" : "border-[#dbeafe] text-[#475569]"
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  {isBookmarked ? "Kaydedildi" : "Kaydet"}
                </button>
                <button 
                  onClick={handleShare}
                  className="flex items-center gap-1 font-semibold px-3 py-1.5 rounded-lg border border-[#dbeafe] text-[#475569]"
                >
                  <Share2 className="w-4 h-4" />
                  Paylaş
                </button>
              </div>

              {/* Mobile text size */}
              <div className="flex items-center space-x-1">
                <span className="text-[#94a3b8] font-mono mr-1">Metin:</span>
                <button 
                  onClick={() => setFontSize("base")}
                  className={`w-7 h-7 rounded-md text-xs font-bold font-mono ${fontSize === "base" ? "bg-[#1d4ed8] text-white" : "bg-white border border-[#dbeafe]"}`}
                >
                  M
                </button>
                <button 
                  onClick={() => setFontSize("lg")}
                  className={`w-7 h-7 rounded-md text-xs font-bold font-mono ${fontSize === "lg" ? "bg-[#1d4ed8] text-white" : "bg-white border border-[#dbeafe]"}`}
                >
                  L
                </button>
              </div>
            </div>

            {/* Featured Image (only rendered when a real photo exists) */}
            {article.featuredImage && (
              <div className="relative overflow-hidden rounded-2xl border border-[#dbeafe] max-h-[400px]">
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-full h-auto object-cover filter contrast-[1.03]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>
            )}

            {/* Article Text Content */}
            <div
              className={`font-headline text-[#0f172a] space-y-6 md:space-y-8 select-text ${getBodyFontClass()}`}
              id="article-body-text"
            >
              {article.content.map((paragraph, index) => (
                <p
                  key={index}
                  className={`text-justify leading-relaxed ${
                    index === 0
                      ? "indent-4 first-letter:text-5xl first-letter:font-bold first-letter:text-[#1d4ed8] first-letter:float-left first-letter:mr-3 first-letter:font-headline"
                      : ""
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Original source link */}
            {article.url && (
              <p className="text-xs font-mono text-[#94a3b8]">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#1d4ed8] font-semibold hover:underline"
                >
                  P24 — orijinal kaynak ↗
                </a>
              </p>
            )}

            {/* Tags section */}
            {article.tags && article.tags.length > 0 && (
              <div className="pt-6 border-t border-[#eff6ff] flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-[#94a3b8] flex items-center gap-1 mr-2">
                  <Tag className="w-3.5 h-3.5" /> Etiketler:
                </span>
                {article.tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => onNavigate("kose-yazilari", { search: tag })}
                    className="bg-[#ffffff] hover:bg-[#eff6ff] border border-[#dbeafe] hover:border-[#1d4ed8] px-3 py-1 rounded-full text-xs text-[#475569] transition-colors cursor-pointer"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}

            {/* Footnotes & References */}
            {article.footnotes && article.footnotes.length > 0 && (
              <div className="mt-12 pt-8 border-t border-dashed border-[#dbeafe] space-y-4" id="footnotes-section">
                <h4 className="text-xs font-mono tracking-widest uppercase text-[#94a3b8] font-bold">
                  Dipnotlar ve Kaynakça
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-xs text-[#475569] font-mono leading-relaxed">
                  {article.footnotes.map((fn) => (
                    <li key={fn.index} className="pl-2">
                      <span className="text-[#1e3a5f] font-bold mr-1">[{fn.index}]</span>
                      {fn.text}
                    </li>
                  ))}
                </ol>
              </div>
            )}

          </article>

          {/* Right Sidebar (Similar Articles & Fast Subscription) */}
          <aside className="lg:col-span-3 space-y-8" id="article-sidebar">
            
            {/* Similar articles widget */}
            {similarArticles.length > 0 && (
              <div className="bg-white border border-[#dbeafe] rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-headline font-bold text-lg border-b border-[#eff6ff] pb-2 flex items-center gap-2">
                  <BookOpen className="w-4.5 h-4.5 text-[#1d4ed8]" />
                  Benzer Makaleler
                </h3>
                
                <div className="space-y-4">
                  {similarArticles.map((similar) => (
                    <div 
                      key={similar.id}
                      onClick={() => onNavigate("article-detail", { id: similar.id })}
                      className="group cursor-pointer space-y-1 block"
                    >
                      <span className="text-[10px] font-mono font-bold text-[#1e3a5f] block">
                        {similar.source} • {similar.date}
                      </span>
                      <h4 className="text-sm font-headline font-semibold text-[#0f172a] group-hover:text-[#1d4ed8] transition-colors line-clamp-2 leading-snug">
                        {similar.title}
                      </h4>
                      <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed">
                        {similar.excerpt}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sidebar quick subscription panel */}
            <div className="bg-[#1d4ed8] text-white rounded-2xl p-6 shadow-sm space-y-4 relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 text-white/5 pointer-events-none">
                <Mail className="w-36 h-36" />
              </div>

              <div className="relative z-10 space-y-3">
                <div className="p-2 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-headline text-lg font-bold">Fikir Atlası Bülteni</h3>
                <p className="text-xs text-[#dbeafe] leading-relaxed">
                  Şahin Alpay'ın yeni derlenen köşe yazıları ve arşiv güncellemeleri yayınlandığı an mail kutunuza gelsin.
                </p>

                {subscribed ? (
                  <div className="bg-white/10 p-3 rounded-lg flex items-center gap-2 text-xs border border-white/20 animate-fade-in">
                    <CheckCircle className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                    <span>Başarıyla kaydoldunuz. Teşekkürler!</span>
                  </div>
                ) : (
                  <form onSubmit={handleSidebarSubscribe} className="space-y-2">
                    <input
                      type="email"
                      required
                      placeholder="E-posta adresiniz"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-xs text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white"
                    />
                    <button
                      type="submit"
                      className="w-full bg-white text-[#1d4ed8] font-semibold text-xs py-2 rounded-lg hover:bg-[#ffffff] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      Abone Ol
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>
            </div>

          </aside>

        </div>

      </div>
    </div>
  );
}
