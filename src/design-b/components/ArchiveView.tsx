/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from "react";
import {
  Calendar,
  Search,
  ArrowUpDown,
  SlidersHorizontal,
  Archive,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Info
} from "lucide-react";
import { ARTICLES } from "../data";

interface ArchiveViewProps {
  onNavigate: (view: string, params?: any) => void;
  selectedCategoryName?: string; // Optional pre-filtered category name from Home
  searchQuery?: string; // Optional search query passed from header or search bar
}

const PUBLICATIONS = ["Tümü", "Cumhuriyet", "Sabah", "Milliyet", "Zaman", "P24"];
const CATEGORIES = ["Tümü", "Köşe Yazısı", "Analiz", "Söyleşi", "Akademik Makale"];

export default function ArchiveView({ onNavigate, selectedCategoryName, searchQuery }: ArchiveViewProps) {
  // Filters state
  const [activePublication, setActivePublication] = useState("Tümü");
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [startYear, setStartYear] = useState<number>(1980);
  const [endYear, setEndYear] = useState<number>(new Date().getFullYear());
  const [localSearch, setLocalSearch] = useState("");
  const [sortBy, setSortBy] = useState("En Yeni");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Sync category if passed from home navigation
  useEffect(() => {
    if (selectedCategoryName) {
      // Normalize name
      if (selectedCategoryName.includes("Köşe")) {
        setActiveCategory("Köşe Yazısı");
      } else if (selectedCategoryName.includes("Analiz")) {
        setActiveCategory("Analiz");
      } else if (selectedCategoryName.includes("Söyleşi")) {
        setActiveCategory("Söyleşi");
      } else if (selectedCategoryName.includes("Akademik")) {
        setActiveCategory("Akademik Makale");
      }
      setCurrentPage(1);
    }
  }, [selectedCategoryName]);

  // Sync search query if passed from parent
  useEffect(() => {
    if (searchQuery) {
      setLocalSearch(searchQuery);
      setCurrentPage(1);
    }
  }, [searchQuery]);

  // Handle clearing all filters
  const handleResetFilters = () => {
    setActivePublication("Tümü");
    setActiveCategory("Tümü");
    setStartYear(1980);
    setEndYear(new Date().getFullYear());
    setLocalSearch("");
    setSortBy("En Yeni");
    setCurrentPage(1);
  };

  // Filter and sort items dynamically
  const filteredAndSortedArticles = useMemo(() => {
    let result = [...ARTICLES];

    // Filter by Publication
    if (activePublication !== "Tümü") {
      result = result.filter(item => item.source === activePublication);
    }

    // Filter by Category
    if (activeCategory !== "Tümü") {
      result = result.filter(item => item.category === activeCategory);
    }

    // Filter by Date range (items without a parseable date are always kept)
    result = result.filter(item => item.year === null || (item.year >= startYear && item.year <= endYear));

    // Filter by search keyword
    if (localSearch.trim()) {
      const query = localSearch.toLowerCase().trim();
      result = result.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.excerpt.toLowerCase().includes(query) ||
        (item.tags ?? []).some(t => t.toLowerCase().includes(query)) ||
        item.content.some(p => p.toLowerCase().includes(query))
      );
    }

    // Sorting (items without a parseable year sort last)
    if (sortBy === "En Yeni") {
      result.sort((a, b) => (b.year ?? -Infinity) - (a.year ?? -Infinity));
    } else if (sortBy === "En Eski") {
      result.sort((a, b) => (a.year ?? Infinity) - (b.year ?? Infinity));
    } else {
      // "Alaka" or other logic: just keep initial seed order or random
    }

    return result;
  }, [activePublication, activeCategory, startYear, endYear, localSearch, sortBy]);

  // Paginated articles
  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedArticles.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedArticles, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedArticles.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // scroll to top of list smoothly
      const element = document.getElementById("archive-list-top");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="bg-[#ffffff] min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-body text-[#0f172a]" id="archive-view-container">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Title / Intro Header */}
        <div className="border-b border-[#dbeafe] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-mono text-[#1e3a5f] uppercase mb-1">
              <Archive className="w-3.5 h-3.5" />
              <span>DİJİTAL BELGE MERKEZİ</span>
            </div>
            <h1 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight">
              Arşiv Küpü & Makaleler
            </h1>
            <p className="text-sm text-[#475569] mt-1 max-w-2xl">
              Tüm yazılı külliyatı filtreleyin, dönemlere göre tasnif edin ve arayın. Makalelere tıkladığınızda okuma moduna geçebilirsiniz.
            </p>
          </div>
          
          <div className="text-right">
            <span className="text-xs text-[#94a3b8] font-mono block">Arşiv Toplamı:</span>
            <span className="text-2xl font-bold text-[#1d4ed8] font-headline">{ARTICLES.length.toLocaleString("tr-TR")} Yazı</span>
          </div>
        </div>

        {/* Search Bar for Listing */}
        <div className="relative max-w-2xl" id="archive-search-container">
          <input
            type="text"
            placeholder="Arşivde kelime, kavram veya tarihsel olay arayın..."
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-white border border-[#dbeafe] rounded-xl py-3 pl-12 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-[#1d4ed8] focus:border-[#1d4ed8] shadow-sm transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94a3b8]" />
          {localSearch && (
            <button 
              onClick={() => { setLocalSearch(""); setCurrentPage(1); }} 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-[#94a3b8] hover:text-[#1d4ed8] underline"
            >
              Temizle
            </button>
          )}
        </div>

        {/* Main Grid: Sidebar + List */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start" id="archive-grid">
          
          {/* Side Filter Panel */}
          <aside className="bg-white border border-[#dbeafe] rounded-2xl p-6 space-y-6 shadow-sm" id="archive-filter-sidebar">
            <div className="flex items-center justify-between border-b border-[#eff6ff] pb-4">
              <span className="font-headline font-bold text-lg flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#1d4ed8]" />
                Filtreler
              </span>
              <button 
                onClick={handleResetFilters}
                className="text-xs text-[#94a3b8] hover:text-[#1d4ed8] flex items-center gap-1 font-medium transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Sıfırla
              </button>
            </div>

            {/* Publication Filter */}
            <div className="space-y-3">
              <label className="text-xs font-mono text-[#94a3b8] uppercase tracking-wider block">Yayın Kuruluşu</label>
              <div className="flex flex-col gap-1.5">
                {PUBLICATIONS.map((pub) => (
                  <button
                    key={pub}
                    onClick={() => {
                      setActivePublication(pub);
                      setCurrentPage(1);
                    }}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${
                      activePublication === pub 
                        ? "bg-[#eff6ff] text-[#1d4ed8] font-semibold border-l-4 border-[#1d4ed8]" 
                        : "text-[#475569] hover:bg-[#ffffff] hover:text-[#0f172a]"
                    }`}
                  >
                    <span>{pub}</span>
                    {activePublication === pub && <span className="w-1.5 h-1.5 rounded-full bg-[#1d4ed8]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-mono text-[#94a3b8] uppercase tracking-wider block">Yazı Türü</label>
              <div className="flex flex-col gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setCurrentPage(1);
                    }}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${
                      activeCategory === cat 
                        ? "bg-[#eff6ff] text-[#1d4ed8] font-semibold border-l-4 border-[#1d4ed8]" 
                        : "text-[#475569] hover:bg-[#ffffff] hover:text-[#0f172a]"
                    }`}
                  >
                    <span>{cat}</span>
                    {activeCategory === cat && <span className="w-1.5 h-1.5 rounded-full bg-[#1d4ed8]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-mono text-[#94a3b8] uppercase tracking-wider block flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Tarih Aralığı (Yıl)
              </label>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-[#94a3b8] block">Başlangıç</span>
                  <input
                    type="number"
                    min="1980"
                    max={new Date().getFullYear()}
                    value={startYear}
                    onChange={(e) => {
                      setStartYear(parseInt(e.target.value) || 1980);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-[#ffffff] border border-[#dbeafe] rounded-lg py-1.5 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#1d4ed8]"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-[#94a3b8] block">Bitiş</span>
                  <input
                    type="number"
                    min="1980"
                    max={new Date().getFullYear()}
                    value={endYear}
                    onChange={(e) => {
                      setEndYear(parseInt(e.target.value) || new Date().getFullYear());
                      setCurrentPage(1);
                    }}
                    className="w-full bg-[#ffffff] border border-[#dbeafe] rounded-lg py-1.5 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#1d4ed8]"
                  />
                </div>
              </div>
            </div>

            {/* Arşiv Notu Widget */}
            <div className="bg-[#f8fafc] border border-[#dbeafe] rounded-xl p-4 text-xs space-y-2 mt-4">
              <div className="flex items-center gap-1.5 font-bold text-[#1e3a5f]">
                <Info className="w-4 h-4 flex-shrink-0" />
                <span>Arşiv Notu</span>
              </div>
              <p className="text-[#475569] leading-relaxed">
                Şu anda filtrelerinize uyan <span className="font-semibold text-[#0f172a]">{filteredAndSortedArticles.length}</span> kayıt listeleniyor. Sol sütundaki filtreleri kullanarak tahlilleri dilediğiniz gibi daraltabilirsiniz.
              </p>
            </div>
          </aside>

          {/* List Section */}
          <section className="lg:col-span-3 space-y-6" id="archive-list-section">
            <span id="archive-list-top" className="block h-1 -mt-1" />
            
            {/* Sorting & Result Counts Bar */}
            <div className="flex items-center justify-between bg-white border border-[#dbeafe] rounded-xl px-4 py-3 text-sm shadow-sm">
              <span className="text-[#475569]">
                Bulunan Kayıt: <strong className="text-[#0f172a]">{filteredAndSortedArticles.length}</strong>
              </span>
              
              <div className="flex items-center space-x-2 text-xs sm:text-sm">
                <span className="text-[#94a3b8] flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  Sırala:
                </span>
                <select 
                  value={sortBy} 
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent border-none text-[#0f172a] font-semibold focus:outline-none focus:ring-0 cursor-pointer text-xs sm:text-sm"
                >
                  <option value="En Yeni">En Yeni</option>
                  <option value="En Eski">En Eski</option>
                </select>
              </div>
            </div>

            {/* List of articles */}
            {paginatedArticles.length > 0 ? (
              <div className="space-y-4" id="archive-items-list">
                {paginatedArticles.map((article) => (
                  <article
                    key={article.id}
                    onClick={() => onNavigate("article-detail", { id: article.id })}
                    className="bg-white rounded-2xl border border-[#dbeafe] p-6 hover:border-[#1d4ed8] hover:shadow-md cursor-pointer transition-all space-y-4 group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#94a3b8]">
                          <span className="text-[#1e3a5f] bg-[#f8fafc] px-2 py-0.5 rounded-md font-semibold border border-[#dbeafe]">
                            {article.category}
                          </span>
                          <span>•</span>
                          <span className="font-bold text-[#1d4ed8]">{article.source}</span>
                          <span>•</span>
                          <span>{article.date}</span>
                        </div>
                        
                        <h3 className="font-headline text-xl font-bold text-[#0f172a] group-hover:text-[#1d4ed8] transition-colors leading-snug pt-1">
                          {article.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-sm text-[#475569] leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>

                    <div className="flex flex-wrap items-center justify-between pt-4 border-t border-[#eff6ff] gap-4">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {(article.tags ?? []).map((tag) => (
                          <span 
                            key={tag}
                            onClick={(e) => {
                              e.stopPropagation(); // prevent opening article
                              setLocalSearch(tag);
                              setCurrentPage(1);
                            }}
                            className="bg-[#ffffff] border border-[#dbeafe] hover:border-[#1d4ed8] hover:text-[#1d4ed8] px-2.5 py-0.5 rounded-full text-xs text-[#475569] transition-colors"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Read Info */}
                      <div className="flex items-center space-x-4 text-xs font-mono text-[#475569]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {article.readTime}
                        </span>
                        <span className="text-[#1d4ed8] font-bold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Oku <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#dbeafe] p-12 text-center space-y-4" id="no-results-box">
                <Search className="w-12 h-12 text-[#94a3b8] mx-auto opacity-40" />
                <h3 className="font-headline text-lg font-bold">Arama Sonucu Bulunamadı</h3>
                <p className="text-sm text-[#475569] max-w-md mx-auto">
                  Arama kelimeniz veya uyguladığınız filtre kombinasyonları hiçbir arşiv dökümanıyla eşleşmiyor. Farklı filtreler deneyebilir veya kelimeyi kısaltabilirsiniz.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all shadow cursor-pointer"
                >
                  Tüm Filtreleri Sıfırla
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-white border border-[#dbeafe] rounded-xl px-4 py-3 shadow-sm" id="pagination-controls">
                <span className="text-xs text-[#475569] font-mono">
                  Sayfa {currentPage} / {totalPages}
                </span>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-[#dbeafe] text-[#475569] hover:bg-[#ffffff] disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                          currentPage === pageNum
                            ? "bg-[#1d4ed8] text-white"
                            : "border border-[#dbeafe] text-[#475569] hover:bg-[#ffffff]"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-[#dbeafe] text-[#475569] hover:bg-[#ffffff] disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </section>

        </div>

      </div>
    </div>
  );
}
