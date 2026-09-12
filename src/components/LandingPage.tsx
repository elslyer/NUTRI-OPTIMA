import React from 'react';
import { ArrowRight, Sparkles, BookOpen, Database, Users, Utensils, ShieldCheck, HeartPulse } from 'lucide-react';
import heroIllustration from '../assets/images/hero_workforce_food_1789205846172.jpg';
import cartoonFoodIllustration from '../assets/images/cartoon_healthy_food_1789205869154.jpg';

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
    <div className="space-y-16 py-6 sm:py-10">
      {/* Rich, Engaging Hero Section with Cartoon Illustrations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Sistem Rekomendasi Gizi Presisi untuk Tenaga Kerja Indonesia</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight sm:leading-none">
                <span className="text-slate-900 dark:text-white">NUTRI-</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-300">
                  OPTIMA
                </span>
              </h1>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs sm:text-sm font-bold bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-slate-700">
                  <Users className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Kesehatan & Stamina Kerja</span>
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  • Standar Kemenkes RI (AKG 2019) & TKPI
                </span>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
              NUTRI-OPTIMA menghitung kebutuhan kalori dan makronutrien riil tenaga kerja berdasarkan karakteristik individu, beban okupasi fisik (kantor, industri, medis, konstruksi), ritme sirkadian kerja (<strong className="font-bold text-slate-900 dark:text-white">shift</strong>), serta keterjangkauan anggaran makanan harian berbasis pangan lokal Indonesia.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                id="hero-btn-start"
                onClick={onStartAssessment}
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl font-bold text-sm sm:text-base text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all shadow-lg shadow-emerald-700/25 hover:shadow-emerald-700/35 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Mulai Assessment Gizi Pekerja</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {onViewAiAssistant && (
                <button
                  id="hero-btn-ai"
                  onClick={onViewAiAssistant}
                  className="inline-flex items-center gap-2 px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl font-semibold text-sm text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 active:scale-95 transition-all shadow-2xs cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Konsultasi Asisten AI</span>
                </button>
              )}

              <button
                id="hero-btn-database"
                onClick={onViewDatabase}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl font-semibold text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 active:scale-95 transition-all shadow-xs cursor-pointer"
              >
                <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>100 Pangan Lokal</span>
              </button>
            </div>

            {/* Highlights row */}
            <div className="pt-2 grid grid-cols-3 gap-3 max-w-xl mx-auto lg:mx-0">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-center lg:text-left">
                <span className="block text-lg font-black text-emerald-600 dark:text-emerald-400">100+</span>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight">Bahan Pangan Lokal</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-center lg:text-left">
                <span className="block text-lg font-black text-teal-600 dark:text-teal-400">4 Shift</span>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight">Ritme Sirkadian Kerja</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-center lg:text-left">
                <span className="block text-lg font-black text-blue-600 dark:text-blue-400">Hemat</span>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight">Optimasi Budget Harian</span>
              </div>
            </div>
          </div>

          {/* Right Column: Cartoon Illustration of Diverse Workers & Nutritious Indonesian Food */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-100/80 via-white to-teal-50 dark:from-slate-800 dark:via-slate-850 dark:to-emerald-950/40 p-3 sm:p-4 border border-emerald-200/70 dark:border-emerald-800/60 shadow-xl group">
              
              {/* Main cartoon illustration image */}
              <div className="rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm relative">
                <img
                  src={heroIllustration}
                  alt="Ilustrasi kartun pekerja Indonesia dan aneka pangan lokal bergizi"
                  className="w-full h-auto object-cover transform group-hover:scale-102 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Floating badge top-left: Occupational Health */}
                <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 shadow-md flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Tenaga Kerja Tangguh</span>
                </div>

                {/* Floating badge bottom-right: Nutritious Local Food */}
                <div className="absolute bottom-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 shadow-md flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <Utensils className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Pangan Lokal Bergizi</span>
                </div>
              </div>

              {/* Mini cartoon food card attached underneath */}
              <div className="mt-3 p-3.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 flex items-center gap-3.5">
                <img
                  src={cartoonFoodIllustration}
                  alt="Kartun bekal pangan sehat bergizi pekerja"
                  className="w-16 h-12 object-cover rounded-xl border border-emerald-200 dark:border-emerald-800 flex-shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <HeartPulse className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      Pilihan Pangan Harian Sehat & Terjangkau
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    Tempe, tahu, telur, sayur bening, dan buah segar untuk stamina tanpa lemas.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5 Core Pillars Section (Minimalist Typography, No Unwanted SVGs) */}
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
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-black text-sm flex items-center justify-center mb-4 border border-emerald-200 dark:border-emerald-800">
                01
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">1. Personalized Nutrition</h4>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                Kebutuhan energi harian dan makronutrien (protein, karbohidrat, lemak, serat) diestimasi secara matematis menggunakan formula Mifflin-St Jeor dan indeks massa tubuh (BMI) populasi Asia-Pasifik.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-black text-sm flex items-center justify-center mb-4 border border-blue-200 dark:border-blue-800">
                02
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">2. AI Recommendation Engine</h4>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                Algoritma Content-Based Cosine Similarity mencocokkan target nutrisi pengguna dengan matriks profil 100 pangan lokal Indonesia, lalu diurutkan melalui multi-objective ranking.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 font-black text-sm flex items-center justify-center mb-4 border border-purple-200 dark:border-purple-800">
                03
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">3. Workforce-Oriented</h4>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                Memperhitungkan beban okupasi (pekerja kantor vs lapangan berat), jam lembur, dan penjadwalan waktu makan sirkadian khusus bagi pekerja shift malam (Pre-Shift, Mid-Shift, Post-Shift).
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-black text-sm flex items-center justify-center mb-4 border border-amber-200 dark:border-amber-800">
                04
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">4. Affordable Food</h4>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                Menjamin rekomendasi tetap dalam batas anggaran harian tenaga kerja (IDR). Menu memaksimalkan lauk bergizi tinggi yang ramah kantong seperti tempe, tahu, telur, dan ikan lokal.
              </p>
            </div>

            {/* Pillar 5 */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow-md transition-shadow lg:col-span-2">
              <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 font-black text-sm flex items-center justify-center mb-4 border border-teal-200 dark:border-teal-800">
                05
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
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all shadow-md cursor-pointer"
              >
                <span>Buka Formulir Assessment Gizi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onViewDatabase}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 active:scale-95 transition-all cursor-pointer"
              >
                <span>Katalog 100 Bahan Pangan</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
