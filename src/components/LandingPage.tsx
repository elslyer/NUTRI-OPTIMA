import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Target,
  Cpu,
  Briefcase,
  Coins,
  Leaf,
  Clock,
  CheckCircle2,
  Activity,
  HeartPulse,
  Database,
  BookOpen,
  Sparkles,
} from 'lucide-react';

interface LandingPageProps {
  onStartAssessment: () => void;
  onViewDatabase: () => void;
  onViewMethodology: () => void;
  onViewAiAssistant?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAssessment,
  onViewDatabase,
  onViewMethodology,
  onViewAiAssistant,
}) => {
  return (
    <div className="space-y-16 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Sistem Rekomendasi Gizi Presisi untuk Tenaga Kerja Indonesia</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none">
                  <span className="text-slate-900 dark:text-white">NUTRI-</span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-300">
                    OPTIMA
                  </span>
                </h1>
                <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
                  v2.4
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs sm:text-sm font-bold bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-slate-700">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  <span>AI-Powered Occupational Nutrition</span>
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  • Standar Kemenkes RI (AKG 2019) & TKPI
                </span>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl pt-1">
              NUTRI-OPTIMA menghitung kebutuhan kalori dan makronutrien riil tenaga kerja berdasarkan karakteristik individu, beban kerja okupasi, ritme sirkadian kerja (<strong className="font-bold text-slate-900 dark:text-white">shift</strong>), preferensi pangan, dan keterjangkauan anggaran makanan harian.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                id="hero-btn-start"
                onClick={onStartAssessment}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-700/20 hover:shadow-emerald-700/30 hover:-translate-y-0.5"
              >
                <span>Mulai Assessment Gizi Pekerja</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {onViewAiAssistant && (
                <button
                  id="hero-btn-ai"
                  onClick={onViewAiAssistant}
                  className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all shadow-2xs"
                >
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Konsultasi Asisten AI</span>
                </button>
              )}

              <button
                id="hero-btn-database"
                onClick={onViewDatabase}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-all shadow-xs"
              >
                <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Katalog 50 Pangan Lokal</span>
              </button>

              <button
                id="hero-btn-methodology"
                onClick={onViewMethodology}
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Landasan Ilmiah & Formula</span>
              </button>
            </div>

            {/* Micro Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>Formula Mifflin-St Jeor</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>Cosine Similarity AI</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>Pola Shift Sirkadian</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>100% Pangan Lokal RI</span>
              </div>
            </div>
          </div>

          {/* Architecture Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-2xl border border-slate-800 relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-300 tracking-wide uppercase">Alur Komputasi Engine</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                  Production Engine
                </span>
              </div>

              {/* Step flow */}
              <div className="space-y-3.5 my-5 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">1</div>
                    <div>
                      <p className="font-semibold text-white">Profil Pekerja & Beban Okupasi</p>
                      <p className="text-[11px] text-slate-400">Biometrik, intensitas fisik kerja, dan jam lembur</p>
                    </div>
                  </div>
                  <Activity className="w-4 h-4 text-blue-400" />
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">2</div>
                    <div>
                      <p className="font-semibold text-white">Circadian Shift Slotting</p>
                      <p className="text-[11px] text-slate-400">Penyesuaian Pre/Mid/Post-Shift untuk ritme sirkadian</p>
                    </div>
                  </div>
                  <Clock className="w-4 h-4 text-purple-400" />
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">3</div>
                    <div>
                      <p className="font-semibold text-white">Cosine Similarity & Ranking</p>
                      <p className="text-[11px] text-slate-400">Pencocokan vektor gizi multi-komponen & pagu budget</p>
                    </div>
                  </div>
                  <Cpu className="w-4 h-4 text-emerald-400" />
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">4</div>
                    <div>
                      <p className="font-semibold text-emerald-300">Menu Harian & Sustainability</p>
                      <p className="text-[11px] text-emerald-200/70">4 Waktu makan terstruktur dalam pagu Rupiah</p>
                    </div>
                  </div>
                  <HeartPulse className="w-4 h-4 text-emerald-400" />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Database: 50 Pangan Lokal Teranalisis</span>
                <button
                  onClick={onViewDatabase}
                  className="text-emerald-400 hover:text-emerald-300 font-medium underline"
                >
                  Buka Katalog Pangan &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Core Pillars Section */}
      <section className="bg-slate-100/70 dark:bg-slate-900/60 py-14 border-y border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Pilar Solusi Nutrisi
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              5 Karakteristik Utama NUTRI-OPTIMA
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
              Mengakomodasi kebutuhan gizi riil pekerja dari berbagai sektor industri dan pola kerja di Indonesia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">1. Personalized Nutrition</h4>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                Kebutuhan energi harian dan makronutrien (protein, karbohidrat, lemak, serat) diestimasi secara matematis menggunakan formula Mifflin-St Jeor dan indeks massa tubuh (BMI) populasi Asia-Pasifik.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">2. AI Recommendation Engine</h4>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                Algoritma Content-Based Cosine Similarity mencocokkan target nutrisi pengguna dengan matriks profil 50 pangan lokal Indonesia, lalu diurutkan melalui multi-objective ranking.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">3. Workforce-Oriented</h4>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                Memperhitungkan beban okupasi (pekerja kantor vs lapangan berat), jam lembur, dan penjadwalan waktu makan sirkadian khusus bagi pekerja shift malam (Pre-Shift, Mid-Shift, Post-Shift).
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                <Coins className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">4. Affordable Food</h4>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                Menjamin rekomendasi tetap dalam batas anggaran harian tenaga kerja (IDR). Menu memaksimalkan lauk bergizi tinggi yang ramah kantong seperti tempe, tahu, telur, dan ikan lokal.
              </p>
            </div>

            {/* Pillar 5 */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow-md transition-shadow lg:col-span-2">
              <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">5. Sustainable Choice</h4>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                Menyematkan skor keberlanjutan (0–100) berbasis atribut pangan nabati lokal vs hewani beremisi tinggi, mendorong pola konsumsi pekerja yang ramah lingkungan dan efisien sumber daya.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden border border-slate-800">
          <div className="relative z-10 space-y-4">
            <h3 className="text-2xl sm:text-3xl font-bold">Optimalkan Pola Gizi Tenaga Kerja Anda Sekarang</h3>
            <p className="text-slate-300 text-sm max-w-xl mx-auto">
              Lakukan kalkulasi kebutuhan nutrisi harian presisi berbasis biometrik dan beban jam kerja Anda.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <button
                onClick={onStartAssessment}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-md"
              >
                <span>Buka Formulir Assessment Gizi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onViewDatabase}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
              >
                <span>Katalog 50 Bahan Pangan</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
