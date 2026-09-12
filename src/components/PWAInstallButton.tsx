import React, { useState } from 'react';
import { Download, Smartphone, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'hero' | 'compact';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'navbar' }) => {
  const { isInstallable, isStandalone, isInstalled, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  const handleClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (!outcome) {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  // If already running in standalone mode (installed), render a neat status or return null
  if (isStandalone) {
    if (variant === 'hero') {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300 shadow-2xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Aplikasi Terpasang (PWA)</span>
        </div>
      );
    }
    return null;
  }

  if (variant === 'hero') {
    return (
      <>
        <button
          id="btn-pwa-install-hero"
          onClick={handleClick}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/80 hover:bg-emerald-50 dark:hover:bg-slate-700 active:scale-95 shadow-xs transition-all duration-200 cursor-pointer group"
          title="Pasang aplikasi ke layar utama smartphone atau desktop"
        >
          <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
          <span>Install Aplikasi (PWA)</span>
        </button>

        <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  if (variant === 'compact') {
    return (
      <>
        <button
          id="btn-pwa-install-compact"
          onClick={handleClick}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-200 dark:hover:bg-emerald-800 transition cursor-pointer"
          title="Pasang aplikasi di perangkat"
        >
          <Download className="w-3 h-3" />
          <span>Install App</span>
        </button>

        <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  // Default: navbar
  return (
    <>
      <button
        id="btn-pwa-install-nav"
        onClick={handleClick}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 border border-emerald-200 dark:border-emerald-800 active:scale-95 transition-all duration-200 shadow-2xs cursor-pointer"
        title="Pasang NUTRI-OPTIMA ke smartphone atau desktop Anda"
      >
        <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span className="hidden sm:inline">Install App</span>
        <span className="sm:hidden">App</span>
      </button>

      <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
