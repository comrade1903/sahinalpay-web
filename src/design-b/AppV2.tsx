/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeView from "./components/HomeView";
import ArchiveView from "./components/ArchiveView";
import ArticleDetailView from "./components/ArticleDetailView";
import AboutView from "./components/AboutView";
import AcademicView from "./components/AcademicView";
import "./tailwind.css";

export default function AppV2() {
  const [currentView, setCurrentView] = useState<string>("home");
  const [viewParams, setViewParams] = useState<any>({});

  // Central Router Handler
  const handleNavigate = (view: string, params: any = {}) => {
    // Scroll to top on every view switch
    window.scrollTo({ top: 0, behavior: "instant" });

    if (view === "kose-yazilari") {
      setCurrentView("archive");
      setViewParams({ category: "Köşe Yazısı", ...params });
    } else if (view === "analizler") {
      setCurrentView("archive");
      setViewParams({ category: "Analiz", ...params });
    } else if (view === "soylesiler") {
      setCurrentView("archive");
      setViewParams({ category: "Söyleşi", ...params });
    } else if (view === "kitaplar") {
      setCurrentView("akademik-makaleler");
      setViewParams({ defaultTab: "kitaplar", ...params });
    } else {
      setCurrentView(view);
      setViewParams(params);
    }
  };

  // Central Search Handler from Header or Hero
  const handleSearch = (query: string) => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setCurrentView("archive");
    setViewParams({ search: query });
  };

  // Render View component based on state
  const renderView = () => {
    switch (currentView) {
      case "home":
        return (
          <div className="animate-fade-in" key="home">
            <HomeView onNavigate={handleNavigate} onSearch={handleSearch} />
          </div>
        );
      case "archive":
        return (
          <div className="animate-fade-in" key="archive">
            <ArchiveView 
              onNavigate={handleNavigate} 
              selectedCategoryName={viewParams.category}
              searchQuery={viewParams.search}
            />
          </div>
        );
      case "article-detail":
        return (
          <div className="animate-fade-in" key={`detail-${viewParams.id}`}>
            <ArticleDetailView 
              articleId={viewParams.id} 
              onNavigate={handleNavigate} 
            />
          </div>
        );
      case "kimdir":
        return (
          <div className="animate-fade-in" key="kimdir">
            <AboutView />
          </div>
        );
      case "akademik-makaleler":
        return (
          <div className="animate-fade-in" key="akademik">
            <AcademicView 
              onNavigate={handleNavigate} 
              defaultTab={viewParams.defaultTab || "akademik"}
            />
          </div>
        );
      default:
        return (
          <div className="animate-fade-in text-center py-20" key="notfound">
            <h2 className="font-headline text-2xl font-bold">Görünüm Bulunamadı</h2>
            <button 
              onClick={() => handleNavigate("home")}
              className="mt-4 bg-[#1d4ed8] text-white px-6 py-2 rounded-xl"
            >
              Anasayfaya Dön
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#ffffff] antialiased selection:bg-[#bfdbfe] selection:text-[#1e3a8a]" id="app-root">
      {/* Header */}
      <Header 
        currentView={currentView} 
        onNavigate={handleNavigate} 
        onSearch={handleSearch} 
      />

      {/* Main Content Area */}
      <main className="flex-grow" id="app-main-content">
        {renderView()}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
