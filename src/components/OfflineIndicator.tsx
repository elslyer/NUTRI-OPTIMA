import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="offline-indicator-banner"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-amber-600/95 dark:bg-amber-700/95 backdrop-blur-md px-4 py-2 text-xs font-semibold text-white shadow-lg border border-amber-400/40 animate-bounce transition-all duration-300"
      role="status"
      aria-live="polite"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-200 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
      </span>
      <WifiOff className="w-4 h-4 text-amber-100" />
      <span>Mode Offline — Aplikasi tetap aktif dengan data ter-cache.</span>
    </div>
  );
};
