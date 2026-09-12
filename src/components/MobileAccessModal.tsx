import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  X,
  Share2,
  Sparkles,
  AlertCircle,
  Apple,
  Chrome
} from 'lucide-react';
import QRCode from 'qrcode';
import { PUBLIC_APP_URL, getAppUrl } from '../utils/appDownloader';

interface MobileAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileAccessModal: React.FC<MobileAccessModalProps> = ({ isOpen, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const targetUrl = PUBLIC_APP_URL;

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(targetUrl, {
        width: 240,
        margin: 1,
        color: {
          dark: '#064e3b',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Failed to generate QR code', err));
    }
  }, [isOpen, targetUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Buka Aplikasi NUTRI-OPTIMA (Gizi Tenaga Kerja) di HP Anda: ${targetUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                Buka & Pasang di HP (Smartphone)
              </h3>
              <p className="text-[11px] text-emerald-100">
                Akses instan di Android & iPhone tanpa instal server
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Important Notice why HP previously failed */}
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-amber-900 dark:text-amber-200">
                Penyebab Kenapa Sebelumnya Tidak Muncul di HP:
              </p>
              <p className="text-amber-800 dark:text-amber-300 leading-relaxed text-[11px]">
                Jika membuka alamat <code className="font-mono bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded">localhost:3000</code> di HP, browser HP akan menolak karena server aplikasi berada di cloud/komputer, bukan di dalam mesin HP. Gunakan <strong>Tautan Cloud Resmi</strong> di bawah ini:
              </p>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="bg-white p-2 rounded-xl shadow-xs border border-slate-200 shrink-0">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR Code Akses HP NUTRI-OPTIMA"
                  className="w-36 h-36 rounded-lg"
                />
              ) : (
                <div className="w-36 h-36 flex items-center justify-center text-slate-400">
                  <QrCode className="w-8 h-8 animate-pulse" />
                </div>
              )}
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                <Sparkles className="w-3 h-3" />
                <span>Pindai Kamera HP</span>
              </div>
              <p className="text-slate-700 dark:text-slate-200 font-semibold text-xs leading-snug">
                Buka aplikasi Kamera di HP Anda, lalu arahkan ke QR Code ini untuk langsung membuka aplikasi.
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                Aplikasi langsung termuat dengan seluruh fitur gizi, kalkulator, dan asisten AI.
              </p>
            </div>
          </div>

          {/* Copy Link Section */}
          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-slate-300 font-bold text-[11px] block">
              Atau Bagikan / Salin Tautan Cloud Langsung ke HP:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={targetUrl}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-[11px] select-all focus:outline-none"
              />
              <button
                id="btn-copy-mobile-url"
                onClick={handleCopy}
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin'}</span>
              </button>
            </div>

            <div className="pt-1 flex gap-2">
              <button
                id="btn-share-wa"
                onClick={handleShareWhatsApp}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer text-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Kirim Link ke WhatsApp</span>
              </button>
              <a
                href={targetUrl}
                target="_blank"
                rel="noreferrer"
                className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold flex items-center justify-center gap-1.5 transition text-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka di Tab Baru</span>
              </a>
            </div>
          </div>

          {/* Quick How to Install on Android / iOS */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">
              Cara Pasang Menjadi Aplikasi di Layar Utama HP:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              {/* Android */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-300">
                  <Chrome className="w-3.5 h-3.5" />
                  <span>Google Chrome (Android)</span>
                </div>
                <ol className="list-decimal list-inside text-slate-600 dark:text-slate-400 space-y-0.5">
                  <li>Buka link di Chrome HP</li>
                  <li>Ketuk menu <strong>titik 3</strong> di kanan atas</li>
                  <li>Pilih <strong>"Tambahkan ke Layar Utama"</strong> / <strong>"Instal Aplikasi"</strong></li>
                </ol>
              </div>

              {/* iPhone */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                  <Apple className="w-3.5 h-3.5" />
                  <span>Safari (iPhone / iOS)</span>
                </div>
                <ol className="list-decimal list-inside text-slate-600 dark:text-slate-400 space-y-0.5">
                  <li>Buka link di Safari iPhone</li>
                  <li>Ketuk tombol <strong>Bagikan</strong> (ikon kotak tanda panah atas)</li>
                  <li>Pilih <strong>"Add to Home Screen"</strong></li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-slate-800/50 px-5 py-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
