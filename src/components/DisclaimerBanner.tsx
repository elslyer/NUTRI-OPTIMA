import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    return sessionStorage.getItem('nutri-optima-disclaimer-dismissed') !== 'true';
  });

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('nutri-optima-disclaimer-dismissed', 'true');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      className="bg-amber-100/95 dark:bg-amber-950/90 border-b border-amber-300 dark:border-amber-700/80 text-amber-950 dark:text-amber-100 py-3 px-4 sm:px-6 transition-all duration-300 shadow-xs select-none"
    >
      <div className="max-w-7xl mx-auto flex items-start sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3 flex-1">
          <div className="p-1 rounded-md bg-amber-200/70 dark:bg-amber-900/70 text-amber-800 dark:text-amber-300 flex-shrink-0 mt-0.5 sm:mt-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-xs sm:text-sm leading-relaxed text-amber-950 dark:text-amber-100">
            <strong className="font-bold text-amber-900 dark:text-amber-200">
              Catatan Klinis & Okupasi:{' '}
            </strong>
            NUTRI-OPTIMA dirancang sebagai sistem pendukung keputusan gizi presisi berbasis biometrik dan beban okupasi kerja. Untuk pekerja dengan kondisi medis khusus (seperti diabetes mellitus, hipertensi kronis, atau gangguan fungsi ginjal), konsultasikan rekomendasi ini dengan dokter spesialis gizi klinik atau dokter okupasi perusahaan.
          </div>
        </div>

        {/* Dismiss Button 'X' */}
        <button
          type="button"
          onClick={handleDismiss}
          id="btn-close-disclaimer"
          aria-label="Tutup pemberitahuan"
          title="Tutup pemberitahuan"
          className="p-1.5 rounded-lg text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-white hover:bg-amber-200 dark:hover:bg-amber-900/80 active:scale-90 transition-all flex-shrink-0 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
