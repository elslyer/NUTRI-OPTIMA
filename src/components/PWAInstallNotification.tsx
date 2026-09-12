import React, { useState, useEffect } from 'react';
import {
  Download,
  ExternalLink,
  CheckCircle2,
  X,
  Smartphone,
  Laptop,
  Monitor,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import {
  downloadStandaloneApp,
  downloadDesktopShortcut,
  openInNewTabForNativeInstall,
  isRunningInIframe,
} from '../utils/appDownloader';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallNotificationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallNotification: React.FC<PWAInstallNotificationProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, install } = usePWAInstall();
  const [inIframe, setInIframe] = useState(false);
  const [downloadStep, setDownloadStep] = useState<'downloading' | 'completed'>('downloading');

  useEffect(() => {
    setInIframe(isRunningInIframe());
  }, []);

  useEffect(() => {
    if (isOpen) {
      setDownloadStep('downloading');
      const timer = setTimeout(() => {
        setDownloadStep('completed');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOpenInNewTab = () => {
    openInNewTabForNativeInstall();
    onClose();
  };

  const handleDownloadAgain = () => {
    downloadStandaloneApp();
    setDownloadStep('downloading');
    setTimeout(() => setDownloadStep('completed'), 1000);
  };

  const handleDownloadShortcut = () => {
    downloadDesktopShortcut();
  };

  return (
    <div
      id="pwa-install-notification-toast"
      className="fixed bottom-5 right-5 left-5 sm:left-auto z-50 max-w-md w-auto sm:w-[420px] rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-500/80 dark:border-emerald-500/60 shadow-2xl shadow-emerald-950/20 overflow-hidden transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
      role="alert"
      aria-live="assertive"
    >
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-4 py-3 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
            <Download className="w-4 h-4 text-white animate-bounce" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider">
              {downloadStep === 'downloading' ? 'Meminta Unduhan Chrome...' : 'Unduhan Berkas Aplikasi Siap'}
            </h4>
            <p className="text-[11px] text-emerald-100">NUTRI-OPTIMA Standalone App</p>
          </div>
        </div>

        <button
          id="btn-close-pwa-toast"
          onClick={onClose}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-white transition cursor-pointer"
          title="Tutup notifikasi"
          aria-label="Tutup notifikasi"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body Content */}
      <div className="p-4 space-y-3.5 text-xs">
        {/* Status Indicator */}
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-slate-800 dark:text-slate-200">
              Izin Unduh Dikirim ke Browser Chrome
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              Chrome mengunduh berkas aplikasi mandiri <code className="bg-emerald-100 dark:bg-emerald-900/60 px-1 py-0.5 rounded text-emerald-800 dark:text-emerald-200 font-mono text-[10px]">NUTRI-OPTIMA-App.html</code>. Berkas ini dapat langsung dibuka dari folder <strong>Downloads</strong> atau disematkan di Desktop Anda untuk akses cepat tanpa membuka browser.
            </p>
          </div>
        </div>

        {/* Chrome Native Application Explanation */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold text-[11px]">
            <Laptop className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Ingin Pasang Langsung ke Menu Aplikasi / Desktop?</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
            {inIframe ? (
              <>
                Karena aplikasi saat ini berjalan di dalam <em>preview container</em>, Chrome menonaktifkan dialog izin install otomatis. Klik tombol di bawah untuk membuka di <strong>Tab Baru</strong> agar Chrome memunculkan menu <strong>"Install NUTRI-OPTIMA"</strong> resmi di bilah alamat atas.
              </>
            ) : (
              <>
                Klik tombol pasang di bilah alamat atas Chrome (ikon layar/unduh) untuk memasang NUTRI-OPTIMA sebagai aplikasi sistem resmi di Windows, Mac, atau Android Anda.
              </>
            )}
          </p>

          {/* Action Buttons */}
          <div className="pt-1 flex flex-col sm:flex-row gap-2">
            <button
              id="btn-open-new-tab-install"
              onClick={handleOpenInNewTab}
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <span>Buka di Tab Baru & Install</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              id="btn-download-shortcut"
              onClick={handleDownloadShortcut}
              className="py-2 px-3 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              title="Unduh file shortcut langsung ke Desktop"
            >
              <Monitor className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Shortcut Desktop</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px]">
          <button
            onClick={handleDownloadAgain}
            className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3 h-3" />
            <span>Unduh Ulang Berkas</span>
          </button>

          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium cursor-pointer"
          >
            Tutup Notifikasi
          </button>
        </div>
      </div>
    </div>
  );
};
