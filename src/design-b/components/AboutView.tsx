/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import {
  GraduationCap,
  Newspaper,
  School,
  CalendarRange,
  BookOpen,
  ChevronRight,
  BookMarked,
  X,
} from "lucide-react";
import { TIMELINE_EVENTS, BOOKS, ABOUT_QUOTE, ABOUT_LEAD, ABOUT_FACTS } from "../data";
import type { Book } from "../types";

export default function AboutView() {
  const [selectedTimelineIndex, setSelectedTimelineIndex] = useState<number>(2); // Default to "1980-2016 Gazetecilik"
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  return (
    <div className="bg-[#ffffff] min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-body text-[#0f172a]" id="about-view-container">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Core Hero block (About Portrait + High-level Quote) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" id="about-hero">
          
          {/* Left Column: Portrait */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative">
              {/* Retro decorative accents */}
              <div className="absolute -inset-4 rounded-3xl border border-[#dbeafe] pointer-events-none"></div>
              <div className="absolute -inset-2 rounded-3xl bg-[#eff6ff] -z-10 rotate-1"></div>
              
              <div className="relative rounded-2xl overflow-hidden border-4 border-white shadow-xl max-w-sm sm:max-w-md aspect-[4/5] flex items-center justify-center bg-[#eff6ff]">
                <span className="font-headline text-8xl font-bold text-[#1d4ed8]">ŞA</span>

                {/* Archival seal stamp overlay */}
                <div className="absolute top-4 right-4 bg-[#1e3a5f] text-[#ffffff] font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-md border border-[#ffffff]/40 shadow rotate-6">
                  Arşiv Kaydı
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Key Editorial Quote & Bio Summary */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 text-[#1e3a5f] text-xs font-mono tracking-widest uppercase">
              <CalendarRange className="w-4 h-4" />
              <span>SİYASAL BİLİMCİ & GAZETECİ</span>
            </div>

            <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Dr. Şahin Alpay kimdir?
            </h1>

            <p className="text-base sm:text-lg text-[#475569] leading-relaxed">
              {ABOUT_LEAD}
            </p>

            <blockquote className="border-l-4 border-[#1d4ed8] pl-4 italic text-[#1d4ed8] text-lg font-headline font-semibold leading-relaxed my-6 bg-[#eff6ff]/40 py-4 pr-4 rounded-r-xl">
              "{ABOUT_QUOTE}"
            </blockquote>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {ABOUT_FACTS.map((f) => (
                <div key={f.label} className="text-center sm:text-left">
                  <div className="font-headline text-2xl font-bold text-[#1d4ed8]">{f.num}</div>
                  <div className="text-xs text-[#475569]">{f.label}</div>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* Interactive Timeline of Personal History */}
        <section className="bg-white border border-[#dbeafe] rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm space-y-8" id="timeline-section">
          <div className="text-center md:text-left max-w-2xl border-b border-[#eff6ff] pb-6">
            <span className="text-xs font-mono tracking-widest uppercase text-[#1e3a5f] block mb-1">KİŞİSEL TARİH</span>
            <h2 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight">
              Hayat Kronolojisi ve Dönemeçler
            </h2>
            <p className="text-sm text-[#475569] mt-1">
              Aşağıdaki tarih şeritlerine tıklayarak Şahin Alpay'ın farklı dönemlerdeki akademik, editoryal ve düşünsel faaliyetlerini detaylıca inceleyebilirsiniz.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Timeline Left Rail: Tabs */}
            <div className="lg:col-span-4 flex flex-col gap-2.5" id="timeline-tabs">
              {TIMELINE_EVENTS.map((evt, index) => {
                const isActive = selectedTimelineIndex === index;

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedTimelineIndex(index)}
                    className={`text-left p-4 rounded-xl transition-all border flex items-center justify-between cursor-pointer ${
                      isActive 
                        ? "bg-[#ffffff] border-[#1d4ed8] shadow-sm" 
                        : "bg-white border-[#dbeafe] hover:bg-[#ffffff]/50"
                    }`}
                  >
                    <div>
                      {evt.yearRange && (
                        <span className={`text-xs font-mono font-bold block ${isActive ? "text-[#1d4ed8]" : "text-[#94a3b8]"}`}>
                          {evt.yearRange}
                        </span>
                      )}
                      <span className="font-headline font-semibold text-sm sm:text-base text-[#0f172a] block mt-1 line-clamp-1">
                        {evt.title}
                      </span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? "text-[#1d4ed8] translate-x-1" : "text-[#94a3b8]"}`} />
                  </button>
                );
              })}
            </div>

            {/* Timeline Right Panel: Active Details content */}
            <div className="lg:col-span-8 bg-[#ffffff] border border-[#dbeafe] rounded-2xl p-6 md:p-8 space-y-6" id="timeline-details-panel">
              {(() => {
                const activeEvt = TIMELINE_EVENTS[selectedTimelineIndex];
                
                return (
                  <div className="space-y-6 animate-fade-in">
                    
                    {/* Period Title */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#dbeafe] pb-4">
                      <div>
                        {activeEvt.yearRange && (
                          <span className="text-xs font-mono font-bold text-[#1e3a5f] bg-[#eff6ff] px-2.5 py-1 rounded-md">
                            Dönem: {activeEvt.yearRange}
                          </span>
                        )}
                        <h3 className="font-headline text-xl sm:text-2xl font-bold text-[#0f172a] mt-2">
                          {activeEvt.title}
                        </h3>
                      </div>
                      
                      {/* Interactive icon based on index */}
                      <div className="p-3 bg-white border border-[#dbeafe] rounded-xl text-[#1d4ed8] self-start sm:self-auto">
                        {selectedTimelineIndex === 0 && <GraduationCap className="w-6 h-6" />}
                        {selectedTimelineIndex === 1 && <BookOpen className="w-6 h-6" />}
                        {selectedTimelineIndex === 2 && <Newspaper className="w-6 h-6" />}
                        {selectedTimelineIndex === 3 && <School className="w-6 h-6" />}
                      </div>
                    </div>

                    <p className="text-sm sm:text-base text-[#0f172a] font-medium leading-relaxed">
                      {activeEvt.description}
                    </p>

                    {/* Timeline bullet points */}
                    <div className="space-y-3">
                      <span className="text-xs font-mono text-[#94a3b8] uppercase tracking-wider block font-bold">Döneme Ait Kronolojik Gelişmeler</span>
                      <ul className="space-y-2 text-sm text-[#475569] leading-relaxed">
                        {activeEvt.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#1d4ed8] flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Accompanying image */}
                    {activeEvt.image && (
                      <div className="relative rounded-xl overflow-hidden max-h-[220px] border border-[#dbeafe]">
                        <img 
                          src={activeEvt.image} 
                          alt={activeEvt.title} 
                          className="w-full h-48 object-cover filter contrast-[1.03]"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                      </div>
                    )}

                  </div>
                );
              })()}
            </div>

          </div>
        </section>

        {/* Selected Bibliography with Cover Details */}
        <section className="space-y-8" id="bibliography-section">
          <div className="text-center md:text-left max-w-2xl border-b border-[#dbeafe] pb-6">
            <span className="text-xs font-mono tracking-widest uppercase text-[#1e3a5f] block mb-1">BIBLIYOGRAFYA</span>
            <h2 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight">
              Yayınlanmış Seçili Eserleri
            </h2>
            <p className="text-sm text-[#475569] mt-1">
              Şahin Alpay'ın telif, derleme ve araştırma kitapları. Kitap kapaklarına tıklayarak detaylı monografileri ve özetleri okuyabilirsiniz.
            </p>
          </div>

          {/* Grid of Books */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" id="books-grid">
            {BOOKS.map((book) => (
              <div
                key={book.id}
                onClick={() => setSelectedBook(book)}
                className="bg-white rounded-2xl border border-[#dbeafe] p-5 hover:border-[#1d4ed8] hover:shadow-md cursor-pointer transition-all space-y-4 group flex flex-col justify-between"
                id={`book-card-${book.id}`}
              >
                {/* Book Cover (falls back to a plain tile when no real cover exists) */}
                <div className="relative aspect-[3/4.2] overflow-hidden rounded-xl border border-[#dbeafe] bg-stone-100 shadow-sm group-hover:shadow transition-shadow flex items-center justify-center">
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

                  {/* Subtle spine shadow represent real book */}
                  <div className="absolute top-0 bottom-0 left-0 w-3.5 bg-gradient-to-r from-black/25 to-transparent pointer-events-none" />

                  {/* Floating book release year */}
                  <div className="absolute bottom-3 right-3 bg-[#ffffff] border border-[#dbeafe] text-[10px] font-mono text-[#1e3a5f] px-2 py-0.5 rounded shadow-sm">
                    {book.year}
                  </div>
                </div>

                {/* Book details */}
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
                    İncele <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Book Details Modal */}
        {selectedBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" id="book-modal">
            <div className="bg-[#ffffff] border border-[#dbeafe] rounded-3xl p-6 sm:p-8 md:p-10 max-w-2xl w-full relative shadow-2xl overflow-y-auto max-h-[90vh] space-y-6">
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedBook(null)}
                className="absolute top-4 right-4 p-2 text-[#475569] hover:text-[#1d4ed8] hover:bg-[#eff6ff] rounded-full transition-colors cursor-pointer"
                id="close-book-modal"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                {/* Book Cover (Modal) */}
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

                {/* Book Meta (Modal) */}
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

              {/* Book Synopsis (only shown when we actually have one) */}
              {selectedBook.synopsis && (
                <div className="space-y-3 pt-4 border-t border-[#dbeafe]" id="book-synopsis">
                  <span className="text-xs font-mono text-[#94a3b8] uppercase tracking-wider block font-bold flex items-center gap-1.5">
                    <BookMarked className="w-4 h-4 text-[#1d4ed8]" />
                    Eser Özeti ve Akademik Önemi
                  </span>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {selectedBook.synopsis}
                  </p>
                </div>
              )}

              {/* Action */}
              <div className="pt-4 flex justify-end gap-3">
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
