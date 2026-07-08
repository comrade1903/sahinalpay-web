/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { BookOpen, Mail, ChevronRight, CheckCircle2 } from "lucide-react";

interface FooterProps {
  onNavigate: (view: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => {
        setSubscribed(false);
      }, 5000);
    }
  };

  return (
    <footer className="bg-[#0f172a] text-[#dbeafe] py-16 px-4 sm:px-6 lg:px-8 border-t border-[#0f172a] font-body" id="app-footer">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Branding & Logo */}
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => onNavigate("home")}>
            <div className="w-10 h-10 rounded-lg bg-[#1d4ed8] flex items-center justify-center text-white">
              <BookOpen className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="font-headline text-lg font-bold text-[#ffffff] tracking-tight block">
                Şahin Alpay Arşivi
              </span>
              <span className="text-[10px] font-mono tracking-wider text-[#94a3b8] uppercase block">
                Fikir Mirası Atlası
              </span>
            </div>
          </div>
          <p className="text-sm text-[#cbd5e1] leading-relaxed max-w-sm">
            Türkiye'nin demokratikleşme sancılarını, sivil toplumun rolünü ve dünyadaki sosyo-politik değişimleri otuz yılı aşkın süredir kaleme alan gazeteci ve akademisyen Şahin Alpay'ın dijital külliyatıdır.
          </p>
        </div>

        {/* Links */}
        <div className="md:col-span-4 grid grid-cols-2 gap-8">
          <div>
            <h4 className="text-xs font-mono tracking-wider text-[#94a3b8] uppercase mb-4">Arşiv</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate("kose-yazilari")} className="text-[#cbd5e1] hover:text-[#1d4ed8] transition-colors text-left">
                  Tüm Köşe Yazıları
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("analizler")} className="text-[#cbd5e1] hover:text-[#1d4ed8] transition-colors text-left">
                  Analizler & Raporlar
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("soylesiler")} className="text-[#cbd5e1] hover:text-[#1d4ed8] transition-colors text-left">
                  Söyleşiler
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("akademik-makaleler")} className="text-[#cbd5e1] hover:text-[#1d4ed8] transition-colors text-left">
                  Akademik Makaleler
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-mono tracking-wider text-[#94a3b8] uppercase mb-4">Kurumsal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate("kimdir")} className="text-[#cbd5e1] hover:text-[#1d4ed8] transition-colors text-left">
                  Biyografi (Kimdir?)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("kitaplar")} className="text-[#cbd5e1] hover:text-[#1d4ed8] transition-colors text-left">
                  Eserler & Kitaplar
                </button>
              </li>
              <li>
                <span className="text-[#94a3b8] block">Kullanım Şartları</span>
              </li>
              <li>
                <span className="text-[#94a3b8] block">İletişim & Arşiv Katkı</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter subscription inside footer */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-xs font-mono tracking-wider text-[#94a3b8] uppercase">Bültene Abone Olun</h4>
          <p className="text-xs text-[#cbd5e1] leading-relaxed">
            Yeni arşiv girdileri, eklenen kitap tahlilleri ve akademik yayınlar eklendikçe haberdar olmak için bülten listemize kaydolun.
          </p>
          
          {subscribed ? (
            <div className="flex items-center space-x-2 text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 p-3 rounded-lg text-sm animate-fade-in">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>Bültene başarıyla kaydoldunuz. Teşekkürler!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex">
              <div className="relative flex-grow">
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#0f172a] border border-[#334155] text-sm text-[#ffffff] placeholder-[#94a3b8] rounded-l-lg py-2 pl-3 pr-10 focus:outline-none focus:ring-1 focus:ring-[#1d4ed8] focus:border-[#1d4ed8]"
                />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
              </div>
              <button
                type="submit"
                className="bg-[#1d4ed8] text-white px-4 rounded-r-lg hover:bg-[#1e40af] transition-all flex items-center justify-center font-medium text-sm cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[#0f172a] flex flex-col sm:flex-row justify-between items-center text-xs text-[#94a3b8] gap-4">
        <div>
          © {new Date().getFullYear()} Şahin Alpay Arşivi. Tüm Hakları Saklıdır.
        </div>
        <div className="flex space-x-6">
          <span>Akademik ve Gazetecilik Çalışmaları Dijital Külliyatı</span>
          <span className="font-mono text-[10px]">v1.0.0</span>
        </div>
      </div>
    </footer>
  );
}
