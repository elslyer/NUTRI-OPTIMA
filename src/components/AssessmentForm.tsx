import React, { useState } from 'react';
import { UserProfile } from '../types';
import { calculateBMI } from '../utils/nutritionEngine';

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
        occupation_type: 'Industrial Worker',
        work_intensity: 'Moderate',
        working_hours: '8 hours/day',
        shift: 'Night Shift',
        physical_activity: 'Moderate',
        average_sleep_hours: 6.5,
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
        occupation_type: 'Office / Desk Worker',
        work_intensity: 'Sedentary',
        working_hours: '8 hours/day',
        shift: 'Regular Daytime',
        physical_activity: 'Light',
        average_sleep_hours: 7,
        food_preference: 'High protein',
        avoided_foods: 'udang',
        daily_food_budget: 65000,
      });
    } else if (type === 'field') {
      setFormData({
        age: 33,
        gender: 'Male',
        weight_kg: 74,
        height_cm: 174,
        occupation_type: 'Construction & Heavy Labor',
        work_intensity: 'Heavy',
        working_hours: '10–12 hours/day',
        shift: 'Morning Shift',
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
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-2 border border-emerald-200 dark:border-emerald-800">
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
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-95 cursor-pointer ${
              activeTemplate === 'nightshift'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-700/30'
                : 'bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-emerald-400'
            }`}
          >
            Shift Malam
          </button>
          <button
            type="button"
            onClick={() => applyTemplate('office')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-95 cursor-pointer ${
              activeTemplate === 'office'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-700/30'
                : 'bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-emerald-400'
            }`}
          >
            Kantor (Sedentary)
          </button>
          <button
            type="button"
            onClick={() => applyTemplate('field')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-95 cursor-pointer ${
              activeTemplate === 'field'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-700/30'
                : 'bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-emerald-400'
            }`}
          >
            Lapangan (Fisik Berat)
          </button>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Karakteristik Individu */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 transition-colors">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-base">
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

        {/* Section 2: Workforce Profile — Core Novelty */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border-2 border-emerald-500/30 dark:border-emerald-500/30 shadow-xs space-y-6 transition-colors relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider">
            <span>Core Novelty</span>
          </div>

          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="text-slate-900 dark:text-white font-extrabold text-lg">
              <span>2. Workforce Profile (Karakteristik Tenaga Kerja)</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Parameter inti algoritma <em>Workforce-Aware Nutrition</em> untuk mengkalkulasi kebutuhan metabolik okupasi, ritme sirkadian, dan pemulihan stamina kerja.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. Jenis Pekerjaan (Occupation) */}
            <div className="lg:col-span-1">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center justify-between">
                <span>Jenis Pekerjaan (Occupation)</span>
                <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">Parameter 1</span>
              </label>
              <select
                value={formData.occupation_type}
                onChange={(e) => handleChange('occupation_type', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
              >
                <option value="Industrial Worker">Industrial Worker (Pabrik & Manufaktur)</option>
                <option value="Office / Desk Worker">Office / Desk Worker (Kantoran, IT, Administrasi)</option>
                <option value="Healthcare & Hospital Staff">Healthcare & Hospital Staff (Dokter, Perawat, Nakes)</option>
                <option value="Construction & Heavy Labor">Construction & Heavy Labor (Konstruksi & Buruh Lapangan)</option>
                <option value="Driver & Logistics">Driver & Logistics (Sopir, Kurir, & Pergudangan)</option>
                <option value="Service & Hospitality">Service & Hospitality (Pelayanan, F&B, Ritel)</option>
                <option value="Agricultural / Field Worker">Agricultural / Field Worker (Pertanian & Perkebunan)</option>
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                Mengidentifikasi profil tuntutan kerja ergonomis dan stresor lingkungan.
              </p>
            </div>

            {/* 2. Intensitas Pekerjaan (Work Intensity) */}
            <div className="lg:col-span-1">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center justify-between">
                <span>Intensitas Pekerjaan (Work Intensity)</span>
                <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">Parameter 2</span>
              </label>
              <select
                value={formData.work_intensity || 'Moderate'}
                onChange={(e) => handleChange('work_intensity', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
              >
                <option value="Sedentary">Sedentary (Duduk &gt;75% waktu, minim gerak)</option>
                <option value="Light">Light (Berdiri / jalan santai, angkat beban &lt;5kg)</option>
                <option value="Moderate">Moderate (Banyak gerak, angkat 5-20kg, operasional mesin)</option>
                <option value="Heavy">Heavy (Aktivitas fisik intensif, angkut beban berat &gt;20kg)</option>
                <option value="Very Heavy">Very Heavy (Kerja fisik ekstrem berkelanjutan)</option>
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                Menyesuaikan multiplier metabolik okupasi dan sintesis protein per kg berat.
              </p>
            </div>

            {/* 3. Jam Kerja Harian (Working Hours) */}
            <div className="lg:col-span-1">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center justify-between">
                <span>Jam Kerja Harian (Working Hours)</span>
                <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">Parameter 3</span>
              </label>
              <select
                value={formData.working_hours}
                onChange={(e) => handleChange('working_hours', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
              >
                <option value="< 8 hours/day">&lt; 8 hours/day (Paruh Waktu / Shift Singkat)</option>
                <option value="8 hours/day">8 hours/day (Standar Kerja Harian)</option>
                <option value="8–10 hours/day">8–10 hours/day (Lembur Moderat)</option>
                <option value="10–12 hours/day">10–12 hours/day (Shift Panjang / Extended Shift)</option>
                <option value="> 12 hours/day">&gt; 12 hours/day (Double Shift / Lembur Berat)</option>
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                Mempengaruhi faktor kelelahan kumulatif dan kompensasi kalori lembur.
              </p>
            </div>

            {/* 4. Shift Kerja (Shift) */}
            <div className="lg:col-span-1">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center justify-between">
                <span>Pola Shift Kerja (Shift)</span>
                <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">Parameter 4</span>
              </label>
              <select
                value={formData.shift}
                onChange={(e) => handleChange('shift', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
              >
                <option value="Regular Daytime">Regular Daytime (08:00 – 17:00)</option>
                <option value="Morning Shift">Morning Shift (06:00 – 14:00)</option>
                <option value="Afternoon Shift">Afternoon Shift (14:00 – 22:00)</option>
                <option value="Night Shift">Night Shift (22:00 – 06:00 / Nocturnal)</option>
                <option value="Rotating Shift">Rotating Shift (Sistem 3-Shift Bergilir)</option>
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                Menentukan alokasi waktu makan sirkadian (chrono-nutrition).
              </p>
            </div>

            {/* 5. Aktivitas Fisik (Physical Activity) */}
            <div className="lg:col-span-1">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center justify-between">
                <span>Aktivitas Fisik Luar Kerja (Physical Activity)</span>
                <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">Parameter 5</span>
              </label>
              <select
                value={formData.physical_activity}
                onChange={(e) => handleChange('physical_activity', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
              >
                <option value="Low">Low (Jarang bergerak / santai di luar kerja)</option>
                <option value="Light">Light (Jalan santai / peregangan 1-2x per minggu)</option>
                <option value="Moderate">Moderate (Olahraga rekreasi 2-3x per minggu)</option>
                <option value="High">High (Latihan fisik teratur 4-5x per minggu)</option>
                <option value="Very High">Very High (Latihan intensif harian / atlet)</option>
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                Faktor aktivitas dasar tubuh di luar beban kerja okupasi.
              </p>
            </div>

            {/* Sleep Duration */}
            <div className="lg:col-span-1">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
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
              <p className="text-[10px] text-slate-400 mt-1">
                Digunakan untuk mendeteksi potensi stres oksidatif & resistensi insulin.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Preferensi Makanan & Anggaran */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 transition-colors">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-base">
            <span>3. Preferensi Pangan & Batas Anggaran (IDR)</span>
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
            <span>Kalkulasi Kebutuhan & Rekomendasikan Menu AI</span>
          </button>
        </div>
      </form>
    </div>
  );
};
