/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { BookOpen, Menu, X, Search } from "lucide-react";

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, params?: any) => void;
  onSearch: (query: string) => void;
}

export default function Header({ currentView, onNavigate, onSearch }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setSearchQuery("");
    }
  };

  const navItems = [
    { id: "home", label: "Fikir Atlası" },
    { id: "kose-yazilari", label: "Köşe Yazıları" },
    { id: "analizler", label: "Analiz & Söyleşi" },
    { id: "akademik-makaleler", label: "Akademik & Kitaplar" },
    { id: "kimdir", label: "Kimdir?" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#ffffff]/95 backdrop-blur-md border-b border-[#dbeafe] transition-colors" id="app-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => onNavigate("home")}
            id="header-logo"
          >
            <div className="w-10 h-10 rounded-lg bg-[#1d4ed8] flex items-center justify-center text-white shadow-sm group-hover:bg-[#1e40af] transition-colors">
              <BookOpen className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="font-headline text-lg sm:text-xl font-bold text-[#0f172a] tracking-tight group-hover:text-[#1d4ed8] transition-colors block leading-none">
                Şahin Alpay
              </span>
              <span className="text-[10px] sm:text-xs font-mono tracking-wider text-[#475569] uppercase block mt-1">
                Dijital Arşiv & Atlas
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center" id="desktop-nav">
            {navItems.map((item) => {
              // Highlight based on current view matching item.id or related views
              const isActive = 
                currentView === item.id || 
                (item.id === "kose-yazilari" && currentView === "archive" && !["Analiz", "Söyleşi", "Akademik Makale"].includes(item.label)) ||
                (item.id === "analizler" && currentView === "archive" && ["Analiz", "Söyleşi"].includes(item.label)); // simple routing simulation

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`font-body text-sm font-medium transition-all relative py-2 ${
                    isActive 
                      ? "text-[#1d4ed8] font-semibold" 
                      : "text-[#475569] hover:text-[#1d4ed8]"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1d4ed8] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Search */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="hidden lg:flex items-center relative max-w-xs w-full"
            id="desktop-search-form"
          >
            <input
              type="text"
              placeholder="Yazı, konu ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#eff6ff] border border-[#dbeafe] rounded-full py-1.5 pl-4 pr-10 text-xs font-body text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-1 focus:ring-[#1d4ed8] focus:border-[#1d4ed8] transition-all"
            />
            <button 
              type="submit" 
              className="absolute right-3 text-[#475569] hover:text-[#1d4ed8] transition-colors"
              aria-label="Arama yap"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-[#475569] hover:text-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/50"
              aria-expanded={isOpen}
              id="mobile-menu-btn"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#ffffff] border-b border-[#dbeafe] px-4 pt-2 pb-4 space-y-2 animate-fade-in" id="mobile-nav-panel">
          <form onSubmit={handleSearchSubmit} className="relative py-2">
            <input
              type="text"
              placeholder="Yazı, konu ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#eff6ff] border border-[#dbeafe] rounded-full py-2 pl-4 pr-10 text-xs font-body text-[#0f172a] focus:outline-none focus:ring-1 focus:ring-[#1d4ed8] focus:border-[#1d4ed8]"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#1d4ed8]">
              <Search className="w-4 h-4" />
            </button>
          </form>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setIsOpen(false);
              }}
              className="block w-full text-left px-3 py-2.5 rounded-md font-body text-base font-medium text-[#475569] hover:bg-[#eff6ff] hover:text-[#1d4ed8] transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
