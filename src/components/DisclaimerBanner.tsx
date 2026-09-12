import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const DisclaimerBanner: React.FC = () => {
  // Always present initially on page load as requested, can be smoothly dismissed
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence initial={false}>
      {isVisible && (
        <motion.div
          key="disclaimer-banner"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden bg-amber-100/95 dark:bg-amber-950/95 border-b border-amber-300 dark:border-amber-700/80 text-amber-950 dark:text-amber-100 shadow-xs select-none"
          role="alert"
          aria-live="polite"
        >
          <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 flex items-start sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3 flex-1">
              <div className="p-1 rounded-md bg-amber-200/80 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 flex-shrink-0 mt-0.5 sm:mt-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="text-xs sm:text-sm leading-relaxed text-amber-950 dark:text-amber-100">
                <strong className="font-bold text-amber-900 dark:text-amber-200">
                  Pemberitahuan Medis & Panduan Edukasi:{' '}
                </strong>
                Platform NUTRI-OPTIMA dirancang sebagai kalkulator pendukung gizi okupasi dan edukasi tenaga kerja, <strong className="font-bold text-amber-900 dark:text-amber-200 underline decoration-amber-500/50">bukan pengganti acuan medis utama</strong> dari dokter spesialis gizi klinik atau dokter okupasi. Untuk kondisi kesehatan khusus (seperti diabetes, hipertensi, atau gangguan ginjal), selalu konsultasikan kebutuhan Anda dengan tenaga medis profesional.
              </div>
            </div>

            {/* Dismiss Button 'X' with smooth closing */}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};
