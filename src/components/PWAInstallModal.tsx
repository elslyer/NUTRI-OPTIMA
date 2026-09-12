import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  CheckCircle2,
  X,
  Share2,
  PlusSquare,
  Sparkles,
  Laptop,
  Zap,
  WifiOff,
  ShieldCheck,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isStandalone, isIOS, install } = usePWAInstall();
  const [activeGuideTab, setActiveGuideTab] = useState<'android' | 'ios' | 'desktop'>(
    isIOS ? 'ios' : 'android'
  );
  const [isInstalling, setIsInstalling] = useState(false);

  if (!isOpen) return null;

  const handleDirectInstall = async () => {
    setIsInstalling(true);
    const success = await install();
    setIsInstalling(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div
      id="pwa-install-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="pwa-install-modal-content"
        className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with App Identity */}
        <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 p-6 text-white relative">
          <button
            id="btn-close-install-modal"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition cursor-pointer"
            aria-label="Tutup dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white p-2 shadow-lg flex items-center justify-center shrink-0">
              <img
                src="/pwa-192x192.png"
                alt="NUTRI-OPTIMA App Icon"
                className="w-full h-full object-contain rounded-xl"
                onError={(e) => {
                  // Fallback to svg if png is still warming up
                  (e.target as HTMLImageElement).src = '/icon.svg';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white/20 uppercase tracking-wider">
                  Progressive Web App
                </span>
                {isStandalone && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-300 text-emerald-950 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Terpasang
                  </span>
                )}
              </div>
              <h2 className="text-xl font-black mt-1">NUTRI-OPTIMA</h2>
              <p className="text-xs text-emerald-100 mt-0.5">
                Aplikasi Gizi Presisi & Kebugaran Tenaga Kerja
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Key PWA Features / Benefits */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/50 flex items-start gap-2.5">
              <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Akses Cepat</p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-snug">
                  Buka langsung dari layar utama tanpa buka browser.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-800/50 flex items-start gap-2.5">
              <WifiOff className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Dukungan Offline</p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-snug">
                  Data 100 pangan & kalkulator siap kapan pun.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800/50 flex items-start gap-2.5">
              <Smartphone className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Layar Penuh</p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-snug">
                  Bebas dari bilah URL untuk pengalaman app native.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-800/50 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Ringan & Hemat</p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-snug">
                  Ukuran di bawah 3 MB, hemat memori & kuota.
                </p>
              </div>
            </div>
          </div>

          {/* If the native browser install prompt is directly triggerable */}
          {isInstallable && !isStandalone && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
              <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300">
                Browser Anda mendukung instalasi otomatis satu-klik:
              </p>
              <button
                id="btn-trigger-pwa-install"
                onClick={handleDirectInstall}
                disabled={isInstalling}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold text-sm shadow-md shadow-emerald-700/25 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isInstalling ? 'Memproses Instalasi...' : 'Pasang Aplikasi Sekarang (Gratis)'}</span>
              </button>
            </div>
          )}

          {/* Platform Guides */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Panduan Instalasi Manual
              </span>
              <div className="flex gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs">
                <button
                  onClick={() => setActiveGuideTab('android')}
                  className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
                    activeGuideTab === 'android'
                      ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                  }`}
                >
                  Android
                </button>
                <button
                  onClick={() => setActiveGuideTab('ios')}
                  className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
                    activeGuideTab === 'ios'
                      ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                  }`}
                >
                  iPhone / iOS
                </button>
                <button
                  onClick={() => setActiveGuideTab('desktop')}
                  className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
                    activeGuideTab === 'desktop'
                      ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                  }`}
                >
                  Laptop / PC
                </button>
              </div>
            </div>

            {/* Android Guide */}
            {activeGuideTab === 'android' && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    1
                  </span>
                  <p>Buka aplikasi ini di <strong>Google Chrome</strong> atau browser bawaan smartphone Anda.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    2
                  </span>
                  <p>
                    Ketuk menu titik tiga (<strong>⋮</strong>) di sudut kanan atas browser.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    3
                  </span>
                  <p>
                    Pilih <strong>"Pasang aplikasi"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong>. Ikon NUTRI-OPTIMA akan langsung muncul di menu HP Anda!
                  </p>
                </div>
              </div>
            )}

            {/* iOS Guide */}
            {activeGuideTab === 'ios' && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    1
                  </span>
                  <p>Buka website ini menggunakan <strong>Safari</strong> di iPhone atau iPad Anda.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    2
                  </span>
                  <p className="flex items-center gap-1.5 flex-wrap">
                    Ketuk tombol <strong>Bagikan (Share)</strong>
                    <Share2 className="w-3.5 h-3.5 inline text-blue-500" />
                    di bilah navigasi bawah Safari.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    3
                  </span>
                  <p className="flex items-center gap-1.5 flex-wrap">
                    Gulir opsi ke bawah lalu pilih <strong>Tambah ke Layar Utama</strong> (
                    <PlusSquare className="w-3.5 h-3.5 inline text-slate-600 dark:text-slate-300" />
                    <em>Add to Home Screen</em>). Ketuk <strong>Tambah (Add)</strong> di pojok kanan atas.
                  </p>
                </div>
              </div>
            )}

            {/* Desktop Guide */}
            {activeGuideTab === 'desktop' && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    1
                  </span>
                  <p>Gunakan Google Chrome, Microsoft Edge, atau Brave di PC / laptop.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    2
                  </span>
                  <p>
                    Perhatikan sisi kanan <strong>kolom alamat URL (Address Bar)</strong>: klik ikon monitor/unduh <strong>"Install NUTRI-OPTIMA"</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    3
                  </span>
                  <p>Aplikasi akan terbuka dalam jendela tersendiri tanpa gangguan tab browser!</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            Siap untuk penggunaan di lapangan & pabrik
          </span>
          <button
            id="btn-close-pwa-bottom"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
