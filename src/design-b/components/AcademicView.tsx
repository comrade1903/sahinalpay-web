/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import {
  Award,
  ChevronRight,
  Clock,
  ArrowRight,
  BookMarked,
  Info,
  X
} from "lucide-react";
import { ARTICLES, BOOKS } from "../data";
import { ArticleCategory } from "../types";
import type { Book } from "../types";

interface AcademicViewProps {
  onNavigate: (view: string, params?: any) => void;
  defaultTab?: "akademik" | "kitaplar";
}

export default function AcademicView({ onNavigate, defaultTab = "akademik" }: AcademicViewProps) {
  const [activeTab, setActiveTab] = useState<"akademik" | "kitaplar">(defaultTab);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Sync tab if prop changes
  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  // Filter out academic articles
  const academicArticles = ARTICLES.filter(
    (a) => a.category === ArticleCategory.AkademikMakale || a.category === ArticleCategory.Analiz
  );

  return (
    <div className="bg-[#ffffff] min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-body text-[#0f172a]" id="academic-view-container">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Page Header */}
        <div className="border-b border-[#dbeafe] pb-6">
          <div className="inline-flex items-center space-x-1.5 text-xs font-mono text-[#1e3a5f] uppercase mb-1">
            <Award className="w-4 h-4" />
            <span>KÜRSÜ VE KÜLLİYAT</span>
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight">
            Akademik Çalışmalar & Eserler
          </h1>
          <p className="text-sm text-[#475569] mt-1 max-w-2xl">
            Dr. Şahin Alpay'ın karşılaştırmalı siyaset, Türk siyasal hayatı ve anayasal çalışmalar üzerine kaleme aldığı hakemli akademik makaleleri ve monografik kitapları.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[#dbeafe]" id="academic-tabs">
          <button
            onClick={() => setActiveTab("akademik")}
            className={`py-3 px-6 font-headline text-base sm:text-lg font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "akademik" 
                ? "border-[#1d4ed8] text-[#1d4ed8]" 
                : "border-transparent text-[#475569] hover:text-[#1d4ed8]"
            }`}
          >
            Hakemli Makaleler & İncelemeler
          </button>
          <button
            onClick={() => setActiveTab("kitaplar")}
            className={`py-3 px-6 font-headline text-base sm:text-lg font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "kitaplar" 
                ? "border-[#1d4ed8] text-[#1d4ed8]" 
                : "border-transparent text-[#475569] hover:text-[#1d4ed8]"
            }`}
          >
            Yayınlanmış Kitaplar
          </button>
        </div>

        {/* Tab 1: Academic Articles list */}
        {activeTab === "akademik" && (
          <div className="space-y-6 animate-fade-in" id="academic-articles-list">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left explanation column */}
              <div className="lg:col-span-1 bg-[#eff6ff]/40 border border-[#dbeafe] rounded-2xl p-6 h-fit space-y-4">
                <div className="flex items-center gap-2 text-[#1e3a5f] font-headline font-bold">
                  <Info className="w-5 h-5" />
                  <h4>Kürsü Faaliyeti Hakkında</h4>
                </div>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                  Şahin Alpay, Stockholm Üniversitesi'nde tamamladığı siyaset bilimi doktora derecesi sonrasında Türkiye'deki birçok üniversitede dersler vermiştir. 
                </p>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                  Onun makaleleri özellikle çoğulcu demokrasi, seçim sistemleri, parti içi demokrasi, anayasal vatandaşlık ve İskandinav refah devlet modellerinin karşılaştırmalı analizi üzerinedir.
                </p>
                <div className="p-4 bg-white border border-[#dbeafe] rounded-xl text-xs space-y-1">
                  <span className="text-[#94a3b8] font-mono block">Aktif Araştırma Alanları:</span>
                  <strong className="text-[#0f172a] block">• Karşılaştırmalı Siyaset</strong>
                  <strong className="text-[#0f172a] block">• Refah Devleti Kuramları</strong>
                  <strong className="text-[#0f172a] block">• Anayasal Reform & Sivil Toplum</strong>
                </div>
              </div>

              {/* Right list column */}
              <div className="lg:col-span-2 space-y-4">
                {academicArticles.length === 0 && (
                  <div className="bg-white border border-[#dbeafe] rounded-2xl p-8 text-center text-sm text-[#475569]">
                    Bu bölümde henüz içerik yok. Bağlantılar eklenecek.
                  </div>
                )}
                {academicArticles.map((article) => (
                  <div
                    key={article.id}
                    onClick={() => onNavigate("article-detail", { id: article.id })}
                    className="bg-white rounded-2xl border border-[#dbeafe] p-6 hover:border-[#1d4ed8] hover:shadow-md cursor-pointer transition-all space-y-3 group"
                  >
                    <div className="flex items-center space-x-2 text-xs font-mono text-[#94a3b8]">
                      <span className="text-[#1e3a5f] bg-[#f8fafc] px-2 py-0.5 rounded border border-[#dbeafe]">
                        {article.category}
                      </span>
                      <span>•</span>
                      <span>{article.source}</span>
                      <span>•</span>
                      <span>{article.date}</span>
                    </div>

                    <h3 className="font-headline text-lg sm:text-xl font-bold text-[#0f172a] group-hover:text-[#1d4ed8] transition-colors leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#475569] leading-relaxed line-clamp-2">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-[#eff6ff] text-xs font-mono text-[#475569]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {article.readTime} okuma süresi
                      </span>
                      <span className="text-[#1d4ed8] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Metni Oku <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* Tab 2: Published Books layout */}
        {activeTab === "kitaplar" && (
          <div className="space-y-6 animate-fade-in" id="academic-books-list">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {BOOKS.map((book) => (
                <div
                  key={book.id}
                  onClick={() => setSelectedBook(book)}
                  className="bg-white rounded-2xl border border-[#dbeafe] p-5 hover:border-[#1d4ed8] hover:shadow-md cursor-pointer transition-all space-y-4 group flex flex-col justify-between"
                >
                  <div className="relative aspect-[3/4.2] overflow-hidden rounded-xl border border-[#dbeafe] bg-stone-100 shadow-sm flex items-center justify-center">
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <BookMarked className="w-10 h-10 text-[#94a3b8]" />
                    )}
                    <div className="absolute top-0 bottom-0 left-0 w-3.5 bg-gradient-to-r from-black/25 to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 right-3 bg-[#ffffff] border border-[#dbeafe] text-[10px] font-mono text-[#1e3a5f] px-2 py-0.5 rounded shadow-sm">
                      {book.year}
                    </div>
                  </div>

                  <div className="space-y-1.5 flex-grow">
                    {book.publisher && (
                      <span className="text-[10px] font-mono tracking-wider text-[#94a3b8] uppercase block">
                        {book.publisher}
                      </span>
                    )}
                    <h3 className="font-headline font-bold text-base sm:text-lg text-[#0f172a] group-hover:text-[#1d4ed8] transition-colors leading-tight line-clamp-1">
                      {book.title}
                    </h3>
                    <p className="text-xs text-[#475569] leading-relaxed line-clamp-2">
                      {book.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#eff6ff] flex items-center justify-between text-[11px] font-mono text-[#475569]">
                    <span>{book.pageCount ? `${book.pageCount} sayfa` : book.year}</span>
                    <span className="text-[#1d4ed8] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Detaylar <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Book Details Modal */}
        {selectedBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" id="academic-book-modal">
            <div className="bg-[#ffffff] border border-[#dbeafe] rounded-3xl p-6 sm:p-8 md:p-10 max-w-2xl w-full relative shadow-2xl overflow-y-auto max-h-[90vh] space-y-6">
              
              <button
                onClick={() => setSelectedBook(null)}
                className="absolute top-4 right-4 p-2 text-[#475569] hover:text-[#1d4ed8] hover:bg-[#eff6ff] rounded-full transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                <div className="md:col-span-5 flex justify-center">
                  <div className="relative aspect-[3/4.2] overflow-hidden rounded-2xl border border-[#dbeafe] bg-stone-100 shadow-lg w-full max-w-[200px] md:max-w-none flex items-center justify-center">
                    {selectedBook.coverImage ? (
                      <img
                        src={selectedBook.coverImage}
                        alt={selectedBook.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <BookMarked className="w-12 h-12 text-[#94a3b8]" />
                    )}
                    <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />
                  </div>
                </div>

                <div className="md:col-span-7 space-y-4">
                  <div className="flex items-center space-x-2 text-xs font-mono text-[#94a3b8]">
                    {selectedBook.publisher && <span>{selectedBook.publisher}</span>}
                    {selectedBook.publisher && <span>•</span>}
                    <span>{selectedBook.year}</span>
                  </div>

                  <h3 className="font-headline text-2xl font-bold text-[#0f172a]">
                    {selectedBook.title}
                  </h3>

                  {selectedBook.pageCount && (
                    <div className="flex gap-4 text-xs font-mono text-[#475569] border-b border-[#dbeafe] pb-4">
                      <div>
                        <span className="text-[#94a3b8] block">Basım Yılı</span>
                        <strong className="text-[#0f172a]">{selectedBook.year}</strong>
                      </div>
                      <div className="h-6 w-px bg-[#dbeafe]" />
                      <div>
                        <span className="text-[#94a3b8] block">Sayfa Sayısı</span>
                        <strong className="text-[#0f172a]">{selectedBook.pageCount} Sayfa</strong>
                      </div>
                    </div>
                  )}

                  <p className="text-sm text-[#0f172a] font-medium leading-relaxed italic">
                    "{selectedBook.description}"
                  </p>

                  {selectedBook.purchaseUrl && (
                    <a
                      href={selectedBook.purchaseUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1d4ed8] hover:underline"
                    >
                      Kitapyurdu'ndan satın al <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

              </div>

              {selectedBook.synopsis && (
                <div className="space-y-3 pt-4 border-t border-[#dbeafe]">
                  <span className="text-xs font-mono text-[#94a3b8] uppercase tracking-wider block font-bold flex items-center gap-1.5">
                    <BookMarked className="w-4 h-4 text-[#1d4ed8]" />
                    Eser Özeti ve Akademik Önemi
                  </span>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {selectedBook.synopsis}
                  </p>
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setSelectedBook(null)}
                  className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow cursor-pointer"
                >
                  Kapat
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
