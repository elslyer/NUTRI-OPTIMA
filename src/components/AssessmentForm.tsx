import React, { useState } from 'react';
import { UserProfile } from '../types';
import { calculateBMI } from '../utils/nutritionEngine';
import {
  User,
  Briefcase,
  Activity,
  Utensils,
  Coins,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Info,
  Clock,
  Moon,
  Sun,
  Flame,
  Zap,
} from 'lucide-react';

interface AssessmentFormProps {
  initialProfile: UserProfile;
  onSubmit: (profile: UserProfile) => void;
}

export const AssessmentForm: React.FC<AssessmentFormProps> = ({
  initialProfile,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<UserProfile>(initialProfile);
  const [activeTemplate, setActiveTemplate] = useState<'nightshift' | 'office' | 'field' | null>(null);

  const bmiInfo = calculateBMI(formData.weight_kg, formData.height_cm);

  const handleChange = (field: keyof UserProfile, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const applyTemplate = (type: 'nightshift' | 'office' | 'field') => {
    setActiveTemplate(type);
    if (type === 'nightshift') {
      setFormData({
        age: 26,
        gender: 'Male',
        weight_kg: 68,
        height_cm: 172,
        occupation_type: 'Moderate physical work',
        working_hours: '8–10 jam',
        shift: 'Night',
        physical_activity: 'Moderate',
        average_sleep_hours: 6,
        food_preference: 'Balanced',
        avoided_foods: 'makanan terlalu pedas',
        daily_food_budget: 50000,
      });
    } else if (type === 'office') {
      setFormData({
        age: 29,
        gender: 'Female',
        weight_kg: 56,
        height_cm: 160,
        occupation_type: 'Sedentary (Kantor/Desk)',
        working_hours: '< 8 jam',
        shift: 'Regular',
        physical_activity: 'Light',
        average_sleep_hours: 7,
        food_preference: 'High Protein',
        avoided_foods: 'udang',
        daily_food_budget: 65000,
      });
    } else if (type === 'field') {
      setFormData({
        age: 33,
        gender: 'Male',
        weight_kg: 74,
        height_cm: 174,
        occupation_type: 'Heavy physical work',
        working_hours: '> 10 jam',
        shift: 'Morning',
        physical_activity: 'High',
        average_sleep_hours: 6.5,
        food_preference: 'Balanced',
        avoided_foods: '',
        daily_food_budget: 70000,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Archetype Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-2 border border-emerald-200 dark:border-emerald-800">
            <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Kalkulator Kebutuhan Gizi & Menu Presisi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Formulir Assessment Gizi Tenaga Kerja
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Lengkapi data biometrik, karakteristik pekerjaan, dan batasan anggaran untuk memformulasikan kebutuhan gizi presisi.
          </p>
        </div>

        {/* Template buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => applyTemplate('nightshift')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-95 cursor-pointer flex items-center gap-1.5 ${
              activeTemplate === 'nightshift'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-700/30'
                : 'bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-emerald-400'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Shift Malam</span>
          </button>
          <button
            type="button"
            onClick={() => applyTemplate('office')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-95 cursor-pointer flex items-center gap-1.5 ${
              activeTemplate === 'office'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-700/30'
                : 'bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-emerald-400'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Kantor (Sedentary)</span>
          </button>
          <button
            type="button"
            onClick={() => applyTemplate('field')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-95 cursor-pointer flex items-center gap-1.5 ${
              activeTemplate === 'field'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-700/30'
                : 'bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-emerald-400'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Lapangan (Fisik Berat)</span>
          </button>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Karakteristik Individu */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 transition-colors">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-base">
            <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>1. Karakteristik Individu & Biometrik</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Age */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Usia (Tahun)
              </label>
              <input
                type="number"
                min="17"
                max="70"
                required
                value={formData.age}
                onChange={(e) => handleChange('age', parseInt(e.target.value) || 20)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Jenis Kelamin
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              >
                <option value="Male">Pria (Male)</option>
                <option value="Female">Wanita (Female)</option>
              </select>
            </div>

            {/* Weight */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Berat Badan (kg)
              </label>
              <input
                type="number"
                step="0.5"
                min="35"
                max="160"
                required
                value={formData.weight_kg}
                onChange={(e) => handleChange('weight_kg', parseFloat(e.target.value) || 50)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Height */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tinggi Badan (cm)
              </label>
              <input
                type="number"
                step="0.5"
                min="130"
                max="210"
                required
                value={formData.height_cm}
                onChange={(e) => handleChange('height_cm', parseFloat(e.target.value) || 150)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Real-time BMI Indicator */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                IMT: {bmiInfo.bmi} kg/m²
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  bmiInfo.status === 'success'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : bmiInfo.status === 'warning'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                }`}
              >
                {bmiInfo.category} (Standar WHO Asia-Pasifik)
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Klasifikasi status gizi menurut standar cut-off epidemiologi Asia-Pasifik.
            </p>
          </div>
        </div>

        {/* Section 2: Beban Kerja Okupasi */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 transition-colors">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-base">
            <Briefcase className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>2. Karakteristik Beban Kerja Okupasi</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Occupation Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kategori Beban Kerja
              </label>
              <select
                value={formData.occupation_type}
                onChange={(e) => handleChange('occupation_type', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              >
                <option value="Sedentary (Kantor/Desk)">Sedentary (Kantor / Duduk &gt;75% waktu)</option>
                <option value="Light physical work">Ringan (Guru, Tenaga Penjualan Toko)</option>
                <option value="Moderate physical work">Sedang (Perawat, Gudang, Manufaktur)</option>
                <option value="Heavy physical work">Berat (Buruh Konstruksi, Tambang, Pertanian)</option>
              </select>
            </div>

            {/* Working Hours */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Durasi Jam Kerja Harian
              </label>
              <select
                value={formData.working_hours}
                onChange={(e) => handleChange('working_hours', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              >
                <option value="< 8 jam">&lt; 8 Jam / Hari (Standar)</option>
                <option value="8–10 jam">8–10 Jam / Hari (Lembur Ringan)</option>
                <option value="> 10 jam">&gt; 10 Jam / Hari (Lembur Tinggi / Extended Shift)</option>
              </select>
            </div>

            {/* Shift Work */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Jadwal Shift Kerja (Sirkadian)
              </label>
              <select
                value={formData.shift}
                onChange={(e) => handleChange('shift', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              >
                <option value="Morning">Pagi / Siang (Regular 08:00 - 17:00)</option>
                <option value="Night">Shift Malam (Nocturnal / Melintasi Tengah Malam)</option>
                <option value="Rotating">Shift Bergilir (Rotating / 3-Shift System)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Gaya Hidup & Aktivitas */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 transition-colors">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-base">
            <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>3. Gaya Hidup & Kebiasaan Istirahat</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tingkat Aktivitas Fisik Di Luar Pekerjaan
              </label>
              <select
                value={formData.physical_activity}
                onChange={(e) => handleChange('physical_activity', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              >
                <option value="Low">Rendah (Jarang olahraga / mayoritas rebahan)</option>
                <option value="Moderate">Sedang (Jalan santai / olahraga 1-3x per minggu)</option>
                <option value="High">Tinggi (Olahraga intensif / aktif bergerak 4-6x seminggu)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Rata-rata Durasi Tidur (Jam / Hari)
              </label>
              <input
                type="number"
                step="0.5"
                min="3"
                max="12"
                required
                value={formData.average_sleep_hours}
                onChange={(e) => handleChange('average_sleep_hours', parseFloat(e.target.value) || 6)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Preferensi Makanan & Anggaran */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 transition-colors">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-base">
            <Coins className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>4. Preferensi Pangan & Batas Anggaran (IDR)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Pola / Preferensi Makanan
              </label>
              <select
                value={formData.food_preference}
                onChange={(e) => handleChange('food_preference', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              >
                <option value="Balanced">Seimbang (Pedoman Gizi Seimbang)</option>
                <option value="High Protein">Tinggi Protein (Pekerja Fisik / Massa Otot)</option>
                <option value="Low Fat">Rendah Lemak</option>
                <option value="Vegetarian">Vegetarian (Pangan Nabati)</option>
                <option value="No Restriction">Bebas / Tanpa Preferensi Khusus</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Makanan Dihindari / Alergi
              </label>
              <input
                type="text"
                placeholder="Contoh: udang, susu, pedas"
                value={formData.avoided_foods}
                onChange={(e) => handleChange('avoided_foods', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Budget Makanan Harian (Rp)
              </label>
              <input
                type="number"
                step="5000"
                min="15000"
                max="250000"
                required
                value={formData.daily_food_budget}
                onChange={(e) => handleChange('daily_food_budget', parseFloat(e.target.value) || 30000)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                Total batas pengeluaran untuk 3–4 waktu makan harian.
              </span>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            id="btn-submit-assessment"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 shadow-md shadow-emerald-700/20 hover:shadow-lg hover:shadow-emerald-700/30 transition-all text-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Kalkulasi Kebutuhan & Rekomendasikan Menu AI</span>
          </button>
        </div>
      </form>
    </div>
  );
};
