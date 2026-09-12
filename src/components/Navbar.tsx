import React from 'react';
import { HeartPulse, Moon, Sun, ArrowRight } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  currentTab: 'home' | 'assessment' | 'result' | 'database' | 'methodology' | 'ai-assistant';
  setCurrentTab: (tab: 'home' | 'assessment' | 'result' | 'database' | 'methodology' | 'ai-assistant') => void;
  hasResult: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  hasResult,
  isDarkMode,
  toggleDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div
            id="brand-logo"
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none py-1"
            title="Ke Beranda NUTRI-OPTIMA"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-600/30 group-hover:scale-105 group-hover:shadow-emerald-600/40 group-active:scale-95 transition-all duration-300">
                <HeartPulse className="w-5 h-5 transition-transform group-hover:scale-110" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
            </div>
            
            <div className="flex flex-col justify-center">
              <span className="font-black text-xl sm:text-2xl tracking-tight leading-none text-slate-900 dark:text-white transition-colors">
                <span>NUTRI</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 font-extrabold ml-0.5">
                  -OPTIMA
                </span>
              </span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-tight tracking-tight hidden sm:block">
                Occupational Nutrition System
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              id="nav-home"
              onClick={() => setCurrentTab('home')}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ease-out active:scale-95 cursor-pointer select-none ${
                currentTab === 'home'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800/80 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/70'
              }`}
            >
              Beranda
            </button>

            <button
              id="nav-assessment"
              onClick={() => setCurrentTab('assessment')}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ease-out active:scale-95 cursor-pointer select-none ${
                currentTab === 'assessment'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800/80 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/70'
              }`}
            >
              Assessment Gizi
            </button>

            {hasResult && (
              <button
                id="nav-result"
                onClick={() => setCurrentTab('result')}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ease-out active:scale-95 cursor-pointer select-none ${
                  currentTab === 'result'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800/80 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/70'
                }`}
              >
                Dashboard Hasil
              </button>
            )}

            <button
              id="nav-database"
              onClick={() => setCurrentTab('database')}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ease-out active:scale-95 cursor-pointer select-none ${
                currentTab === 'database'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800/80 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/70'
              }`}
            >
              Katalog Pangan
            </button>

            <button
              id="nav-methodology"
              onClick={() => setCurrentTab('methodology')}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ease-out active:scale-95 cursor-pointer select-none ${
                currentTab === 'methodology'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800/80 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/70'
              }`}
            >
              Metodologi Ilmiah
            </button>

            <button
              id="nav-ai-assistant"
              onClick={() => setCurrentTab('ai-assistant')}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ease-out active:scale-95 cursor-pointer select-none ${
                currentTab === 'ai-assistant'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800/80 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/70'
              }`}
            >
              Asisten AI
            </button>
          </nav>

          {/* Action Buttons: PWA Install, Dark Mode Toggle & Assessment CTA */}
          <div className="flex items-center gap-2">
            {/* Direct PWA Install Button */}
            <PWAInstallButton variant="navbar" />

            {/* Dark / Light Mode Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500 active:scale-90 transition-all duration-200 flex items-center justify-center shadow-2xs cursor-pointer"
              title={isDarkMode ? 'Beralih ke Light Mode' : 'Beralih ke Dark Mode'}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            <button
              id="btn-nav-start"
              onClick={() => setCurrentTab('assessment')}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white transition-all shadow-sm shadow-emerald-700/20 hover:shadow-md hover:shadow-emerald-700/30 cursor-pointer"
            >
              <span>Mulai Analisis</span>
              <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 dark:border-slate-800 py-2 px-1 text-xs bg-slate-50 dark:bg-slate-950/80">
        <button
          onClick={() => setCurrentTab('home')}
          className={`px-2.5 py-1.5 rounded-lg active:scale-95 transition-all ${
            currentTab === 'home'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Beranda
        </button>
        <button
          onClick={() => setCurrentTab('assessment')}
          className={`px-2.5 py-1.5 rounded-lg active:scale-95 transition-all ${
            currentTab === 'assessment'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Assessment
        </button>
        {hasResult && (
          <button
            onClick={() => setCurrentTab('result')}
            className={`px-2.5 py-1.5 rounded-lg active:scale-95 transition-all ${
              currentTab === 'result'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Hasil
          </button>
        )}
        <button
          onClick={() => setCurrentTab('database')}
          className={`px-2.5 py-1.5 rounded-lg active:scale-95 transition-all ${
            currentTab === 'database'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Pangan
        </button>
        <button
          onClick={() => setCurrentTab('methodology')}
          className={`px-2.5 py-1.5 rounded-lg active:scale-95 transition-all ${
            currentTab === 'methodology'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Metodologi
        </button>
        <button
          onClick={() => setCurrentTab('ai-assistant')}
          className={`px-2.5 py-1.5 rounded-lg active:scale-95 transition-all ${
            currentTab === 'ai-assistant'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Asisten AI
        </button>
      </div>
    </header>
  );
};
