import React from 'react';
import {
  UserProfile,
  NutritionRequirements,
  RecommendationResult,
} from '../types';
import {
  Sparkles,
  RotateCcw,
  Printer,
  FileCode,
  Leaf,
  Coins,
  CheckCircle,
  Clock,
  Briefcase,
  User,
  Activity,
  HeartPulse,
  TrendingUp,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface ResultDashboardProps {
  userProfile: UserProfile;
  nutrition: NutritionRequirements;
  recommendation: RecommendationResult;
  onRecalculate: () => void;
  onViewDatabase: () => void;
  onViewAiAssistant: () => void;
  onViewMethodology: () => void;
}

export const ResultDashboard: React.FC<ResultDashboardProps> = ({
  userProfile,
  nutrition,
  recommendation,
  onRecalculate,
  onViewDatabase,
  onViewAiAssistant,
  onViewMethodology,
}) => {
  const { summary, meal_plan } = recommendation;
  const { scores } = summary;

  const handlePrint = () => {
    window.print();
  };

  const calFulfillment = Math.min(
    100,
    Math.round((summary.total_calories / nutrition.daily_calories) * 100)
  );
  const protFulfillment = Math.min(
    100,
    Math.round((summary.total_protein / nutrition.target_protein_g) * 100)
  );
  const carbFulfillment = Math.min(
    100,
    Math.round((summary.total_carbs / nutrition.target_carb_g) * 100)
  );
  const fatFulfillment = Math.min(
    100,
    Math.round((summary.total_fat / nutrition.target_fat_g) * 100)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:p-0">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-2 border border-emerald-200 dark:border-emerald-800">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Hasil Optimasi Gizi & Menu Presisi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Dashboard Rekomendasi Gizi NUTRI-OPTIMA
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Analisis terintegrasi untuk <strong className="font-semibold text-slate-800 dark:text-slate-200">{userProfile.gender === 'Male' ? 'Pria' : 'Wanita'}</strong>, {userProfile.age} tahun &bull; <strong className="font-semibold text-slate-800 dark:text-slate-200">{userProfile.occupation_type}</strong> &bull; Shift: <strong className="font-bold text-emerald-600 dark:text-emerald-400">{userProfile.shift}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <button
            id="btn-print"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak PDF</span>
          </button>

          <button
            id="btn-recalculate"
            onClick={onRecalculate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white transition-all shadow-sm shadow-emerald-700/20 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Ubah Data / Hitung Ulang</span>
          </button>
        </div>
      </div>

      {/* CORE NOVELTY: WORKFORCE PROFILE SIGNATURE CARD */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-500/20 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-extrabold uppercase tracking-wider mb-1.5">
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                <span>Core Novelty &bull; Occupational Nutrition Engine</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
                WORKFORCE PROFILE
              </h3>
            </div>
            <div className="text-right sm:text-right">
              <span className="text-xs text-emerald-300/80 font-medium block">Specialized Framework</span>
              <span className="text-xs font-bold text-white bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 inline-block mt-0.5">
                Nourishing the Workforce
              </span>
            </div>
          </div>

          {/* 5 Core Workforce Parameters Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* 1. Occupation */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs hover:bg-white/10 transition-colors">
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
                Occupation
              </span>
              <p className="text-base sm:text-lg font-extrabold text-white mt-1 leading-snug">
                {userProfile.occupation_type || 'Industrial Worker'}
              </p>
              <span className="text-[10px] text-slate-400 block mt-0.5">Peran Kerja Utama</span>
            </div>

            {/* 2. Work Intensity */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs hover:bg-white/10 transition-colors">
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
                Work Intensity
              </span>
              <p className="text-base sm:text-lg font-extrabold text-white mt-1 leading-snug">
                {userProfile.work_intensity || 'Moderate'}
              </p>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                +{nutrition.workforce_impact?.occupational_multiplier_pct || 25}% Beban Metabolik
              </span>
            </div>

            {/* 3. Working Hours */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs hover:bg-white/10 transition-colors">
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
                Working Hours
              </span>
              <p className="text-base sm:text-lg font-extrabold text-white mt-1 leading-snug">
                {userProfile.working_hours || '8 hours/day'}
              </p>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {nutrition.workforce_impact?.overtime_multiplier_pct ? `+${nutrition.workforce_impact.overtime_multiplier_pct}% Jam Lembur` : 'Durasi Harian Standar'}
              </span>
            </div>

            {/* 4. Shift */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs hover:bg-white/10 transition-colors">
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
                Shift
              </span>
              <p className="text-base sm:text-lg font-extrabold text-white mt-1 leading-snug flex items-center gap-1.5">
                {userProfile.shift || 'Night Shift'}
              </p>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Ritme Sirkadian
              </span>
            </div>

            {/* 5. Physical Activity */}
            <div className="col-span-2 sm:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs hover:bg-white/10 transition-colors">
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
                Physical Activity
              </span>
              <p className="text-base sm:text-lg font-extrabold text-white mt-1 leading-snug">
                {userProfile.physical_activity || 'Moderate'}
              </p>
              <span className="text-[10px] text-slate-400 block mt-0.5">Aktivitas Luar Kerja</span>
            </div>
          </div>

          {/* Statement & Algorithmic Impact Summary */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-extrabold text-emerald-200 tracking-tight">
                  Your nutrition recommendation is adjusted according to your work characteristics.
                </p>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {nutrition.workforce_impact?.circadian_protocol_desc || 'Sistem telah mengoptimasi jendela makan sirkadian, target asam amino pemulihan otot, dan kuota hidrasi harian.'}
                </p>
              </div>
            </div>

            {/* Precision Quotas derived from workforce */}
            <div className="flex flex-wrap items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
              <div className="px-3 py-1.5 rounded-xl bg-white/10 text-center border border-white/10">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Protein Target</span>
                <span className="text-xs font-black text-emerald-300">
                  {nutrition.workforce_impact?.protein_target_per_kg || 1.5} g/kg BB
                </span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white/10 text-center border border-white/10">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Hidrasi Kerja</span>
                <span className="text-xs font-black text-emerald-300">
                  {nutrition.workforce_impact?.hydration_quota_liters || 3.2} L / hari
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Overall Match Score */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Overall AI Match
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {scores.overall_score}
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">/ 100</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Multi-Objective Fit (Nutrisi, Budget, Keberlanjutan)
            </p>
          </div>
        </div>

        {/* Card 2: Caloric Need */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Kebutuhan Kalori (TDEE)
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <HeartPulse className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {nutrition.daily_calories}
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">kkal / hari</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              BMR {nutrition.bmr} kkal &bull; Multiplier: {nutrition.activity_multiplier}×
            </p>
          </div>
        </div>

        {/* Card 3: Daily Food Budget */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Alokasi Biaya Makanan
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Rp {summary.total_cost.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Pagu: Rp {userProfile.daily_food_budget.toLocaleString('id-ID')}
              </span>
              {summary.budget_diff >= 0 ? (
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-1.5 py-0.5 rounded">
                  Hemat Rp {summary.budget_diff.toLocaleString('id-ID')}
                </span>
              ) : (
                <span className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/80 px-1.5 py-0.5 rounded">
                  +Rp {Math.abs(summary.budget_diff).toLocaleString('id-ID')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card 4: Sustainability Rating */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Sustainability Index
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {summary.avg_sustainability}
              </span>
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400">/ 100</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Porsi Pangan Nabati Lokal Beremisi Rendah
            </p>
          </div>
        </div>
      </div>

      {/* Row 2: Target vs Actual Nutritional Breakdown */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Evaluasi Ketercapaian Gizi Makro & Energi
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Perbandingan kebutuhan presisi vs total asupan dari kombinasi rekomendasi menu harian.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span className="text-slate-600 dark:text-slate-400">Target Presisi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Tercapai Menu</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Calorie Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Energi (Kalori)</span>
              <span className="font-bold text-slate-900 dark:text-white">{calFulfillment}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, calFulfillment)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Rekomendasi: <strong>{summary.total_calories} kkal</strong></span>
              <span>Target: <strong>{nutrition.daily_calories} kkal</strong></span>
            </div>
          </div>

          {/* Protein Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Protein</span>
              <span className="font-bold text-slate-900 dark:text-white">{protFulfillment}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, protFulfillment)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Rekomendasi: <strong>{summary.total_protein} g</strong></span>
              <span>Target: <strong>{nutrition.target_protein_g} g</strong></span>
            </div>
          </div>

          {/* Carbohydrate Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Karbohidrat</span>
              <span className="font-bold text-slate-900 dark:text-white">{carbFulfillment}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, carbFulfillment)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Rekomendasi: <strong>{summary.total_carbs} g</strong></span>
              <span>Target: <strong>{nutrition.target_carb_g} g</strong></span>
            </div>
          </div>

          {/* Fat Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Lemak Sehat</span>
              <span className="font-bold text-slate-900 dark:text-white">{fatFulfillment}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, fatFulfillment)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Rekomendasi: <strong>{summary.total_fat} g</strong></span>
              <span>Target: <strong>{nutrition.target_fat_g} g</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Daily Structured Meal Plan */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Rencana Menu Harian Pekerja (Circadian Meal Slots)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Dioptimalkan berdasarkan ritme sirkadian shift <strong className="font-bold text-emerald-700 dark:text-emerald-400">{userProfile.shift}</strong> dan beban kerja <strong className="font-bold text-slate-800 dark:text-slate-200">{userProfile.occupation_type}</strong>.
            </p>
          </div>
          <button
            onClick={onViewDatabase}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center gap-1"
          >
            <span>Katalog 50 Pangan</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {meal_plan.map((slot, idx) => (
            <div
              key={slot.slot_id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col justify-between"
            >
              {/* Slot Header */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-tight">
                      {slot.slot_name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {slot.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {slot.total_calories} kkal
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    Target: ~{slot.target_calories} kkal
                  </span>
                </div>
              </div>

              {/* Slot Items */}
              <div className="p-4 space-y-3 flex-1">
                {slot.items.map((item) => (
                  <div
                    key={item.food_id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {item.food_name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 capitalize">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex gap-2">
                        <span>P: {item.protein_g}g</span>
                        <span>&bull;</span>
                        <span>K: {item.carbohydrate_g}g</span>
                        <span>&bull;</span>
                        <span>L: {item.fat_g}g</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-slate-900 dark:text-white block">
                        Rp {item.price_idr.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold flex items-center justify-end gap-0.5">
                        <Leaf className="w-2.5 h-2.5" />
                        <span>Eco: {item.sustainability_score}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Slot Footer Summary */}
              <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <div className="flex gap-3 text-[11px]">
                  <span>Prot: <strong className="text-slate-900 dark:text-white">{slot.total_protein}g</strong></span>
                  <span>Karb: <strong className="text-slate-900 dark:text-white">{slot.total_carbs}g</strong></span>
                  <span>Lemak: <strong className="text-slate-900 dark:text-white">{slot.total_fat}g</strong></span>
                </div>
                <div className="font-bold text-slate-900 dark:text-white">
                  Subtotal: Rp {slot.total_cost.toLocaleString('id-ID')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 4: Scientific & Engineering Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
        {/* Box 1: Okupasi & Sirkadian */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            <span>Ritme Sirkadian Okupasi</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Pekerja dengan sistem shift <strong className="font-bold text-emerald-600 dark:text-emerald-400">{userProfile.shift}</strong> (khususnya jika berada di pola <strong className="font-semibold text-slate-800 dark:text-slate-200">night shift</strong> atau <strong className="font-semibold text-slate-800 dark:text-slate-200">rotating shift</strong>) memerlukan pengaturan waktu makan biologis guna mencegah resistensi insulin nokturnal dan penurunan konsentrasi saat jam kerja kritis.
          </p>
        </div>

        {/* Box 2: Keberlanjutan Pangan */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold text-xs uppercase tracking-wider">
            <Leaf className="w-4 h-4" />
            <span>Indeks Keberlanjutan Pangan</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Skor rata-rata keberlanjutan <strong>{summary.avg_sustainability}/100</strong> mencerminkan optimalisasi sumber protein nabati lokal (seperti tempe, tahu, kacang-kacangan) yang rendah jejak karbon.
          </p>
        </div>

        {/* Box 3: Asisten AI Interaktif */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Asisten AI Gizi Interaktif</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Konsultasikan adaptasi menu kerja, substitusi lauk lokal hemat, atau strategi jam makan shift langsung dengan AI Nutri-Optima.
          </p>
          <button
            onClick={onViewAiAssistant}
            className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1 pt-1 cursor-pointer"
          >
            <span>Buka Konsultasi Asisten AI &rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
};
