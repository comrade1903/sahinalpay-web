/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  PenTool,
  FileText,
  MessageSquare,
  Award,
  BookOpen,
  User,
  Search,
  ArrowUpRight,
  Clock,
  ArrowRight,
} from "lucide-react";
import { CATEGORIES, ARTICLES, ABOUT_QUOTE } from "../data";

interface HomeViewProps {
  onNavigate: (view: string, params?: any) => void;
  onSearch: (query: string) => void;
}

export default function HomeView({ onNavigate, onSearch }: HomeViewProps) {
  const [localQuery, setLocalQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      onSearch(localQuery.trim());
    }
  };

  // Get a few featured articles for the grid
  const featuredArticles = ARTICLES.slice(0, 3);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "PenTool": return <PenTool className="w-6 h-6" />;
      case "FileText": return <FileText className="w-6 h-6" />;
      case "MessageSquare": return <MessageSquare className="w-6 h-6" />;
      case "Award": return <Award className="w-6 h-6" />;
      case "BookOpen": return <BookOpen className="w-6 h-6" />;
      case "User": return <User className="w-6 h-6" />;
      default: return <FileText className="w-6 h-6" />;
    }
  };

  return (
    <div className="bg-[#ffffff] min-h-screen font-body text-[#0f172a]" id="home-view-container">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#dbeafe]" id="hero-section">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            <div className="inline-flex items-center space-x-2 bg-[#eff6ff] border border-[#dbeafe] rounded-full py-1.5 px-4 text-xs font-mono tracking-wider uppercase text-[#1e3a5f]">
              <span className="w-2 h-2 rounded-full bg-[#1d4ed8] animate-pulse"></span>
              <span>Aktif Dijital Kütüphane</span>
            </div>
            
            <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0f172a] tracking-tight leading-[1.1]">
              Bir Gazetecinin <br />
              <span className="text-[#1d4ed8] italic relative inline-block">
                Fikir Atlası
                <svg className="absolute -bottom-2 left-0 w-full h-2 text-[#1e3a5f]" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0,7 C30,2 70,2 100,7" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-xl">
              Siyaset bilimci, araştırmacı-yazar ve akademisyen Şahin Alpay'ın yarım asrı aşan yazınsal, entelektüel ve akademik mirasından derlenen, interaktif arama motorlu dijital arşiv sistemi.
            </p>

            {/* Quick Search */}
            <form onSubmit={handleSearchSubmit} className="max-w-md relative flex items-center" id="hero-search-form">
              <input
                type="text"
                placeholder="Yazı, kitap, gazete veya konu başlığı ara..."
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                className="w-full bg-[#ffffff] border-2 border-[#dbeafe] rounded-xl py-3.5 pl-12 pr-28 text-sm font-body text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#1d4ed8] shadow-sm transition-all"
              />
              <Search className="absolute left-4 w-5 h-5 text-[#94a3b8]" />
              <button
                type="submit"
                className="absolute right-2 bg-[#1d4ed8] text-white px-5 py-2 rounded-lg text-xs font-medium hover:bg-[#1e40af] shadow transition-colors cursor-pointer"
              >
                Arşivde Bul
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-[#475569]">
              <span className="font-mono uppercase text-[10px] tracking-wider text-[#94a3b8]">Popüler Arama:</span>
              <button onClick={() => onSearch("Demokrasi")} className="bg-[#eff6ff] hover:bg-[#dbeafe] px-3 py-1 rounded-full transition-colors">Demokrasi</button>
              <button onClick={() => onSearch("Sivil Toplum")} className="bg-[#eff6ff] hover:bg-[#dbeafe] px-3 py-1 rounded-full transition-colors">Sivil Toplum</button>
              <button onClick={() => onSearch("İsveç")} className="bg-[#eff6ff] hover:bg-[#dbeafe] px-3 py-1 rounded-full transition-colors">İsveç Modeli</button>
              <button onClick={() => onSearch("Refah Devleti")} className="bg-[#eff6ff] hover:bg-[#dbeafe] px-3 py-1 rounded-full transition-colors">Refah Devleti</button>
            </div>
          </div>

          {/* Right Hero: Beautifully Framed Portrait */}
          <div className="lg:col-span-5 flex justify-center" id="hero-portrait-container">
            <div className="relative">
              {/* Outer decorative borders representing vintage archival folders */}
              <div className="absolute -inset-3 rounded-2xl border-2 border-dashed border-[#dbeafe] -rotate-2 pointer-events-none"></div>
              <div className="absolute -inset-1 rounded-2xl border border-[#dbeafe] rotate-1 pointer-events-none bg-white/40 -z-10"></div>
              
              <div className="relative overflow-hidden rounded-2xl border-4 border-white shadow-xl w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center bg-[#eff6ff]">
                <span className="font-headline text-8xl font-bold text-[#1d4ed8]">ŞA</span>

                {/* Archival label */}
                <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm px-5 py-3 text-[#0f172a] space-y-0.5">
                  <h3 className="font-headline text-base sm:text-lg font-bold">Dr. Şahin Alpay</h3>
                  <p className="text-[10px] sm:text-xs text-[#475569] font-mono tracking-wide uppercase">Ayvalık, 1944 — Gazeteci &amp; Siyaset Bilimci</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Bento Grid: Categories & Entrypoints */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10" id="categories-bento-section">
        <div className="text-center md:text-left max-w-2xl">
          <span className="text-xs font-mono tracking-widest uppercase text-[#1e3a5f] block mb-2">ARŞİV SİSTEMATİĞİ</span>
          <h2 className="font-headline text-3xl font-bold text-[#0f172a] tracking-tight">Kategoriler & Fikir Envanteri</h2>
          <p className="text-[#475569] text-sm mt-2 leading-relaxed">
            Arşivdeki tüm dökümanlar konu, yazım tarihi ve yayın organına göre sınıflandırılmıştır. İlgili bento kutusunu seçerek kategorize edilmiş listelere ulaşabilirsiniz.
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6" id="bento-grid">
          {CATEGORIES.map((cat, idx) => {
            // Distribute columns sizes for bento effect:
            // 0 (Köşe yazıları): col-span-7
            // 1 (Analizler): col-span-5
            // 2 (Söyleşiler): col-span-4
            // 3 (Akademik): col-span-4
            // 4 (Kitaplar): col-span-4
            // 5 (Kimdir): col-span-12
            let colSpan = "lg:col-span-4";
            if (idx === 0) colSpan = "lg:col-span-7 md:col-span-2";
            if (idx === 1) colSpan = "lg:col-span-5 md:col-span-2";
            if (idx === 5) colSpan = "lg:col-span-12 md:col-span-2";

            return (
              <div
                key={cat.id}
                onClick={() => {
                  if (cat.id === "kimdir") onNavigate("kimdir");
                  else if (cat.id === "kitaplar") onNavigate("akademik-makaleler", { defaultTab: "kitaplar" });
                  else if (cat.id === "akademik-makaleler") onNavigate("akademik-makaleler", { defaultTab: "akademik" });
                  else onNavigate("archive", { category: cat.name });
                }}
                className={`${colSpan} group relative rounded-2xl p-6 md:p-8 overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition-all border border-[#dbeafe] bg-white flex flex-col justify-between min-h-[220px]`}
                id={`bento-cat-${cat.id}`}
              >
                {/* Background ambient shape — tinted with this category's color */}
                <div className={`absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-gradient-to-br ${cat.bgGradient} opacity-10 group-hover:scale-110 transition-transform duration-500 -z-0`}></div>

                {/* Card Header & Icon */}
                <div className="z-10 flex justify-between items-start">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${cat.bgGradient} text-white shadow-sm transition-transform group-hover:scale-105`}>
                    {getCategoryIcon(cat.iconName)}
                  </div>
                  <span className="text-xs font-mono font-bold text-[#1e3a5f] bg-[#f8fafc] px-3 py-1 rounded-full border border-[#dbeafe]">
                    {cat.count.toLocaleString("tr-TR")} Girdi
                  </span>
                </div>

                {/* Card Content */}
                <div className="mt-8 z-10 space-y-2">
                  <h3 className="font-headline text-xl font-bold text-[#0f172a] flex items-center gap-1.5 group-hover:text-[#1d4ed8] transition-colors">
                    {cat.name}
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </h3>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                {/* Bottom line for hover touch */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1d4ed8] scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-b-2xl"></div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Selected/Featured Articles Section */}
      <section className="bg-[#eff6ff]/60 py-16 border-t border-b border-[#dbeafe]" id="selected-articles-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono tracking-widest uppercase text-[#1e3a5f] block mb-2">ÖNE ÇIKAN SEÇKİ</span>
              <h2 className="font-headline text-3xl font-bold text-[#0f172a] tracking-tight">Kütüphaneden Seçme Yazılar</h2>
              <p className="text-[#475569] text-sm mt-1">
                Entelektüel tartışmalara yön vermiş, bugün dahi güncelliğini koruyan referans yazılar.
              </p>
            </div>
            <button
              onClick={() => onNavigate("kose-yazilari")}
              className="inline-flex items-center space-x-2 text-sm font-semibold text-[#1d4ed8] hover:text-[#1e40af] transition-colors group cursor-pointer self-start sm:self-auto"
            >
              <span>Tüm Arşivi İncele</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Grid of articles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="featured-articles-grid">
            {featuredArticles.map((article) => (
              <article 
                key={article.id}
                onClick={() => onNavigate("article-detail", { id: article.id })}
                className="bg-white rounded-2xl overflow-hidden border border-[#dbeafe] shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col h-full group"
              >
                {/* Featured Image (falls back to a plain category tile when no real photo exists) */}
                <div className="relative h-48 overflow-hidden bg-[#eff6ff] flex items-center justify-center">
                  {article.featuredImage ? (
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="font-headline text-2xl font-bold text-[#1d4ed8]">ŞA</span>
                  )}
                  <div className="absolute top-4 left-4 bg-[#ffffff] border border-[#dbeafe] text-xs font-mono text-[#1e3a5f] px-3 py-1 rounded-full shadow-sm">
                    {article.category}
                  </div>
                </div>

                {/* Article Info */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs text-[#94a3b8] font-mono">
                      <span>{article.source}</span>
                      <span>•</span>
                      <span>{article.date}</span>
                    </div>
                    <h3 className="font-headline text-lg font-bold text-[#0f172a] group-hover:text-[#1d4ed8] transition-colors leading-snug line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-[#475569] leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>

                  {/* Read Meta */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#eff6ff] text-xs text-[#475569] font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {article.readTime} okuma
                    </span>
                    <span className="text-[#1d4ed8] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Oku <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* "Fikir Mirası ve Akademik Araştırmalar" split banner section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="heritage-section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          <div className="lg:col-span-8 lg:col-start-3 space-y-6 text-center">
            <span className="text-xs font-mono tracking-widest uppercase text-[#1e3a5f] block">KAMUSAL ENTELEKTÜEL</span>
            <h2 className="font-headline text-3xl sm:text-4xl font-bold text-[#0f172a] tracking-tight leading-tight">
              Fikir Mirası ve Akademik Araştırmalar
            </h2>
            <div className="h-1 w-20 bg-[#1d4ed8] rounded-full mx-auto"></div>

            <p className="text-[#475569] text-sm leading-relaxed">
              Şahin Alpay'ın fikir üretimi yalnızca basın makalelerinden ibaret değildir. Onun asıl entelektüel ağırlığı; demokratik temsil, sosyal demokrat refah devleti sistemleri, sivil anayasa tasarımı ve sivil toplum özerkliği üzerinedir.
            </p>

            <blockquote className="border-l-4 border-[#1e3a5f] pl-4 italic text-[#1e3a5f] text-base font-headline font-medium leading-relaxed my-4 text-left max-w-xl mx-auto">
              "{ABOUT_QUOTE}"
            </blockquote>

            <p className="text-[#475569] text-sm leading-relaxed">
              Bu arşiv, siyaset bilimi araştırmacıları, genç gazeteciler ve Türkiye'nin yakın tarihiyle ilgilenen her bir yurttaş için dijital bir referans kütüphanesi olarak tasarlanmıştır.
            </p>

            <div className="pt-4 flex gap-4 justify-center">
              <button
                onClick={() => onNavigate("kimdir")}
                className="bg-[#1d4ed8] text-white px-6 py-2.5 rounded-xl hover:bg-[#1e40af] text-sm font-semibold shadow transition-all cursor-pointer"
              >
                Hayat Hikayesi & Kitapları
              </button>
              <button
                onClick={() => onNavigate("kose-yazilari")}
                className="border-2 border-[#dbeafe] hover:border-[#1d4ed8] hover:text-[#1d4ed8] text-[#475569] px-6 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
              >
                Arşive Git
              </button>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
