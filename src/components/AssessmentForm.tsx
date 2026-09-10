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
  const [templateNotification, setTemplateNotification] = useState<string | null>(null);
  const [showBmiGuide, setShowBmiGuide] = useState<boolean>(false);

  const bmiInfo = calculateBMI(formData.weight_kg, formData.height_cm);

  const handleChange = (field: keyof UserProfile, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const adjustNumeric = (field: keyof UserProfile, delta: number, min: number, max: number) => {
    setFormData((prev) => {
      const current = typeof prev[field] === 'number' ? (prev[field] as number) : 0;
      const nextVal = Math.min(max, Math.max(min, Math.round((current + delta) * 10) / 10));
      return {
        ...prev,
        [field]: nextVal,
      };
    });
  };

  const toggleAvoidedFood = (tag: string) => {
    const currentList = formData.avoided_foods
      ? formData.avoided_foods.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
      : [];
    const normalizedTag = tag.toLowerCase();

    let updatedList: string[];
    if (currentList.includes(normalizedTag)) {
      updatedList = currentList.filter((item) => item !== normalizedTag);
    } else {
      updatedList = [...currentList, normalizedTag];
    }
    handleChange('avoided_foods', updatedList.join(', '));
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
        avoided_foods: 'makanan pedas',
        daily_food_budget: 50000,
      });
      setTemplateNotification('Template Profil Shift Malam berhasil dimuat');
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
      setTemplateNotification('Template Profil Staf Kantor berhasil dimuat');
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
      setTemplateNotification('Template Profil Pekerja Fisik / Lapangan dimuat');
    }

    // Auto-dismiss feedback notification
    setTimeout(() => {
      setTemplateNotification(null);
    }, 2800);
  };

  const resetForm = () => {
    setFormData(initialProfile);
    setActiveTemplate(null);
    setTemplateNotification('Formulir direset ke pengaturan awal');
    setTimeout(() => setTemplateNotification(null), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Predefined job chips for interactive selection
  const occupationPresets = [
    { label: 'Industri & Manufaktur', val: 'Industrial Worker' },
    { label: 'Kantor, IT & Admin', val: 'Office / Desk Worker' },
    { label: 'Tenaga Medis & Nakes', val: 'Healthcare & Hospital Staff' },
    { label: 'Konstruksi & Lapangan', val: 'Construction & Heavy Labor' },
    { label: 'Sopir & Logistik', val: 'Driver & Logistics' },
    { label: 'Pelayanan & F&B', val: 'Service & Hospitality' },
    { label: 'Pertanian & Kebun', val: 'Agricultural / Field Worker' },
  ];

  // Predefined intensity options
  const intensityLevels = [
    { key: 'Sedentary', label: 'Sedentary', desc: 'Duduk >75% waktu, minim gerak otot' },
    { key: 'Light', label: 'Ringan (Light)', desc: 'Banyak berdiri, angkat beban <5 kg' },
    { key: 'Moderate', label: 'Sedang (Moderate)', desc: 'Bergerak aktif, angkat 5–20 kg, operasional' },
    { key: 'Heavy', label: 'Berat (Heavy)', desc: 'Kerja fisik intensif, angkat beban berat >20 kg' },
    { key: 'Very Heavy', label: 'Sangat Berat', desc: 'Kerja fisik ekstrem berkelanjutan' },
  ];

  // Predefined shift options
  const shiftOptions = [
    {
      key: 'Regular Daytime',
      label: 'Regular Daytime',
      hours: '08:00 – 17:00',
      badge: 'Jadwal Standar',
      desc: 'Ritme metabolik normal, waktu makan konvensional siang hari.',
    },
    {
      key: 'Morning Shift',
      label: 'Morning Shift',
      hours: '06:00 – 14:00',
      badge: 'Pagi Hari',
      desc: 'Fokus sarapan padat energi & hidrasi awal kerja.',
    },
    {
      key: 'Afternoon Shift',
      label: 'Afternoon Shift',
      hours: '14:00 – 22:00',
      badge: 'Sore / Malam Awal',
      desc: 'Makan siang sebelum shift & makan malam rendah beban glikemik.',
    },
    {
      key: 'Night Shift',
      label: 'Night Shift (Nokturnal)',
      hours: '22:00 – 06:00',
      badge: 'Nokturnal Sirkadian',
      desc: 'Penyesuaian chrono-nutrition: camilan protein tinggi & anti-fatigue.',
    },
    {
      key: 'Rotating Shift',
      label: 'Rotating Shift (Bergilir)',
      hours: 'Sistem 3-Shift Berganti',
      badge: 'Pola Rotasi',
      desc: 'Penjadwalan dinamis penyeimbang fluktuasi hormon kortisol & melatonin.',
    },
  ];

  // Predefined working hours
  const workingHoursOptions = [
    { key: '< 8 hours/day', label: '< 8 Jam' },
    { key: '8 hours/day', label: '8 Jam (Standar)' },
    { key: '8–10 hours/day', label: '8–10 Jam (Lembur Moderat)' },
    { key: '10–12 hours/day', label: '10–12 Jam (Shift Panjang)' },
    { key: '> 12 hours/day', label: '> 12 Jam (Double Shift)' },
  ];

  // Predefined physical activity levels
  const physicalActivityOptions = [
    { key: 'Low', label: 'Rendah (Sedikit gerak)' },
    { key: 'Light', label: 'Ringan (Jalan 1-2x/minggu)' },
    { key: 'Moderate', label: 'Sedang (Olahraga 2-3x/minggu)' },
    { key: 'High', label: 'Tinggi (Latihan teratur 4-5x)' },
    { key: 'Very High', label: 'Sangat Tinggi (Latihan intensif)' },
  ];

  // Predefined food preferences
  const foodPreferenceOptions = [
    { key: 'Balanced', label: 'Gizi Seimbang (Standar Kemenkes)' },
    { key: 'High protein', label: 'Tinggi Protein (Massa Otot & Stamina)' },
    { key: 'Low fat', label: 'Rendah Lemak (Kardiovaskular)' },
    { key: 'Vegetarian', label: 'Vegetarian (100% Nabati)' },
    { key: 'No restriction', label: 'Tanpa Pantangan Tertentu' },
  ];

  // Quick budget presets
  const budgetPresets = [30000, 45000, 60000, 80000, 100000];

  // Quick allergen tags
  const commonAllergenTags = ['Pedas', 'Udang', 'Seafood', 'Susu', 'Kacang', 'Telur', 'Gluten'];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Notification for Template Load */}
      {templateNotification && (
        <div className="bg-emerald-600 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-700/20 flex items-center justify-between animate-fadeIn transition-all">
          <span>✓ {templateNotification}</span>
          <button
            type="button"
            onClick={() => setTemplateNotification(null)}
            className="text-white/80 hover:text-white text-xs ml-4 cursor-pointer font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header & Archetype Quick-Select */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-2 border border-emerald-200 dark:border-emerald-800">
            <span>Kalkulator Kebutuhan Gizi & Menu Presisi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Formulir Assessment Gizi Tenaga Kerja
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Klik tombol preset atau sesuaikan parameter di bawah secara interaktif untuk memformulasikan kebutuhan gizi presisi.
          </p>
        </div>

        {/* Template Buttons with Snappy Click Feedback */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => applyTemplate('nightshift')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-90 cursor-pointer select-none shadow-xs ${
              activeTemplate === 'nightshift'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-700/30 ring-2 ring-emerald-500/40'
                : 'bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-emerald-400'
            }`}
          >
            {activeTemplate === 'nightshift' && <span className="mr-1.5 font-bold">✓</span>}
            Preset: Shift Malam
          </button>
          <button
            type="button"
            onClick={() => applyTemplate('office')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-90 cursor-pointer select-none shadow-xs ${
              activeTemplate === 'office'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-700/30 ring-2 ring-emerald-500/40'
                : 'bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-emerald-400'
            }`}
          >
            {activeTemplate === 'office' && <span className="mr-1.5 font-bold">✓</span>}
            Preset: Staf Kantor
          </button>
          <button
            type="button"
            onClick={() => applyTemplate('field')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-90 cursor-pointer select-none shadow-xs ${
              activeTemplate === 'field'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-700/30 ring-2 ring-emerald-500/40'
                : 'bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-emerald-400'
            }`}
          >
            {activeTemplate === 'field' && <span className="mr-1.5 font-bold">✓</span>}
            Preset: Fisik / Lapangan
          </button>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Karakteristik Individu */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 transition-colors">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-base flex items-center justify-between">
            <span>1. Karakteristik Individu & Biometrik</span>
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              Gunakan tombol (+ / −) atau isi langsung
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Gender Toggle Cards */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Jenis Kelamin
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleChange('gender', 'Male')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer text-center border select-none ${
                    formData.gender === 'Male'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs ring-2 ring-emerald-500/30'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                  }`}
                >
                  {formData.gender === 'Male' && <span className="mr-1">✓</span>}
                  Pria (Male)
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('gender', 'Female')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer text-center border select-none ${
                    formData.gender === 'Female'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs ring-2 ring-emerald-500/30'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                  }`}
                >
                  {formData.gender === 'Female' && <span className="mr-1">✓</span>}
                  Wanita (Female)
                </button>
              </div>
            </div>

            {/* Age with Click Steppers */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Usia (Tahun)
              </label>
              <div className="flex items-center rounded-xl border border-slate-300 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800 focus-within:ring-2 focus-within:ring-emerald-500">
                <button
                  type="button"
                  onClick={() => adjustNumeric('age', -1, 17, 75)}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-90 font-bold transition-all cursor-pointer select-none"
                  title="Kurangi 1 tahun"
                >
                  −
                </button>
                <input
                  type="number"
                  min="17"
                  max="75"
                  required
                  value={formData.age}
                  onChange={(e) => handleChange('age', parseInt(e.target.value) || 20)}
                  className="w-full text-center py-2 text-sm bg-transparent text-slate-900 dark:text-white font-semibold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => adjustNumeric('age', 1, 17, 75)}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-90 font-bold transition-all cursor-pointer select-none"
                  title="Tambah 1 tahun"
                >
                  +
                </button>
              </div>
            </div>

            {/* Weight with Click Steppers */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Berat Badan (kg)
              </label>
              <div className="flex items-center rounded-xl border border-slate-300 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800 focus-within:ring-2 focus-within:ring-emerald-500">
                <button
                  type="button"
                  onClick={() => adjustNumeric('weight_kg', -1, 35, 160)}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-90 font-bold transition-all cursor-pointer select-none"
                  title="Kurangi 1 kg"
                >
                  −
                </button>
                <input
                  type="number"
                  step="0.5"
                  min="35"
                  max="160"
                  required
                  value={formData.weight_kg}
                  onChange={(e) => handleChange('weight_kg', parseFloat(e.target.value) || 50)}
                  className="w-full text-center py-2 text-sm bg-transparent text-slate-900 dark:text-white font-semibold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => adjustNumeric('weight_kg', 1, 35, 160)}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-90 font-bold transition-all cursor-pointer select-none"
                  title="Tambah 1 kg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Height with Click Steppers */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Tinggi Badan (cm)
              </label>
              <div className="flex items-center rounded-xl border border-slate-300 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800 focus-within:ring-2 focus-within:ring-emerald-500">
                <button
                  type="button"
                  onClick={() => adjustNumeric('height_cm', -1, 130, 210)}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-90 font-bold transition-all cursor-pointer select-none"
                  title="Kurangi 1 cm"
                >
                  −
                </button>
                <input
                  type="number"
                  step="0.5"
                  min="130"
                  max="210"
                  required
                  value={formData.height_cm}
                  onChange={(e) => handleChange('height_cm', parseFloat(e.target.value) || 150)}
                  className="w-full text-center py-2 text-sm bg-transparent text-slate-900 dark:text-white font-semibold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => adjustNumeric('height_cm', 1, 130, 210)}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-90 font-bold transition-all cursor-pointer select-none"
                  title="Tambah 1 cm"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Real-time BMI Indicator & Collapsible Info */}
          <div
            onClick={() => setShowBmiGuide((prev) => !prev)}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-all duration-150 active:scale-[0.99] hover:border-emerald-400 select-none group"
            title="Klik untuk melihat / menyembunyikan tabel klasifikasi IMT Asia-Pasifik"
          >
            <div className="flex items-center gap-3">
              <div className="text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                IMT: {bmiInfo.bmi} kg/m²
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  bmiInfo.status === 'success'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : bmiInfo.status === 'warning'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                }`}
              >
                {bmiInfo.category}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>Standar WHO Asia-Pasifik (Klik untuk rincian)</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                {showBmiGuide ? '▲' : '▼'}
              </span>
            </div>
          </div>

          {/* Expanded BMI Reference Guide */}
          {showBmiGuide && (
            <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/60 text-xs text-slate-700 dark:text-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-2 animate-fadeIn">
              <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-amber-600 block">&lt; 18.5</span>
                <span>Kekurangan Berat</span>
              </div>
              <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 ring-1 ring-emerald-400">
                <span className="font-bold text-emerald-600 block">18.5 – 22.9</span>
                <span>Normal / Optimal</span>
              </div>
              <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-amber-600 block">23.0 – 24.9</span>
                <span>Overweight (Berisiko)</span>
              </div>
              <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-rose-600 block">&ge; 25.0</span>
                <span>Obesitas (Tingkat I / II)</span>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Workforce Profile (NO CORE NOVELTY LABEL) */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-7 transition-colors">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="text-slate-900 dark:text-white font-extrabold text-lg">
              <span>2. Workforce Profile (Karakteristik Tenaga Kerja)</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Parameter algoritma <em>Workforce-Aware Nutrition</em> untuk mengkalkulasi kebutuhan metabolik okupasi, ritme sirkadian, dan pemulihan stamina kerja.
            </p>
          </div>

          {/* 1. Jenis Pekerjaan (Occupation) Interactive Chips */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>Jenis Pekerjaan (Occupation)</span>
              <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                Klik salah satu kategori di bawah
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {occupationPresets.map((item) => {
                const isSelected = formData.occupation_type === item.val;
                return (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => handleChange('occupation_type', item.val)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-95 cursor-pointer border select-none ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs ring-2 ring-emerald-500/30'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    {isSelected && <span className="mr-1 font-bold">✓</span>}
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Intensitas Pekerjaan (Work Intensity) Interactive Level Cards */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Intensitas Beban Kerja Fisik (Work Intensity)
              </label>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                Terpilih: {formData.work_intensity || 'Moderate'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              {intensityLevels.map((lvl) => {
                const isSelected = (formData.work_intensity || 'Moderate') === lvl.key;
                return (
                  <button
                    key={lvl.key}
                    type="button"
                    onClick={() => handleChange('work_intensity', lvl.key)}
                    className={`p-3 rounded-xl text-left transition-all duration-150 active:scale-95 cursor-pointer border select-none flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 dark:border-emerald-600 ring-2 ring-emerald-500/30 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-extrabold ${isSelected ? 'text-emerald-800 dark:text-emerald-300' : 'text-slate-800 dark:text-slate-200'}`}>
                        {lvl.label}
                      </span>
                      {isSelected && (
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">✓</span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                      {lvl.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Pola Shift Kerja (Circadian Shift Pattern Cards) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Pola Shift Kerja & Ritme Sirkadian
              </label>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                Chrono-Nutrition
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {shiftOptions.map((sh) => {
                const isSelected = formData.shift === sh.key;
                return (
                  <button
                    key={sh.key}
                    type="button"
                    onClick={() => handleChange('shift', sh.key)}
                    className={`p-3.5 rounded-xl text-left transition-all duration-150 active:scale-95 cursor-pointer border select-none flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 dark:border-emerald-600 ring-2 ring-emerald-500/30 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                          {sh.label}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {sh.badge}
                        </span>
                      </div>
                      <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mb-1.5">
                        {sh.hours}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
                        {sh.desc}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="mt-2 pt-2 border-t border-emerald-200 dark:border-emerald-800 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
                        <span>Pola Terpilih</span>
                        <span>✓</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Jam Kerja Harian & Aktivitas Luar Kerja & Durasi Tidur */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            {/* Jam Kerja Harian */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Jam Kerja Harian
              </label>
              <div className="flex flex-col gap-1.5">
                {workingHoursOptions.map((opt) => {
                  const isSelected = formData.working_hours === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => handleChange('working_hours', opt.key)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium text-left transition-all duration-150 active:scale-95 cursor-pointer border select-none flex items-center justify-between ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <span>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Aktivitas Fisik Luar Kerja */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Aktivitas Fisik Luar Jam Kerja
              </label>
              <div className="flex flex-col gap-1.5">
                {physicalActivityOptions.map((opt) => {
                  const isSelected = formData.physical_activity === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => handleChange('physical_activity', opt.key)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium text-left transition-all duration-150 active:scale-95 cursor-pointer border select-none flex items-center justify-between ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <span>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Durasi Tidur Rata-rata */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Durasi Tidur Harian (Jam)
              </label>
              <div className="flex items-center rounded-xl border border-slate-300 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800 focus-within:ring-2 focus-within:ring-emerald-500">
                <button
                  type="button"
                  onClick={() => adjustNumeric('average_sleep_hours', -0.5, 3, 12)}
                  className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-90 font-bold transition-all cursor-pointer select-none"
                  title="Kurangi 0.5 jam"
                >
                  −
                </button>
                <input
                  type="number"
                  step="0.5"
                  min="3"
                  max="12"
                  required
                  value={formData.average_sleep_hours}
                  onChange={(e) => handleChange('average_sleep_hours', parseFloat(e.target.value) || 6)}
                  className="w-full text-center py-2 text-sm bg-transparent text-slate-900 dark:text-white font-semibold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => adjustNumeric('average_sleep_hours', 0.5, 3, 12)}
                  className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-90 font-bold transition-all cursor-pointer select-none"
                  title="Tambah 0.5 jam"
                >
                  +
                </button>
              </div>
              <div className="flex gap-1.5 pt-1">
                {[5, 6, 7, 8].map((hours) => (
                  <button
                    key={hours}
                    type="button"
                    onClick={() => handleChange('average_sleep_hours', hours)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all active:scale-90 cursor-pointer select-none ${
                      formData.average_sleep_hours === hours
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-400'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {hours} Jam
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Kunci kalkulasi ketahanan glukosa darah & pencegahan *burnout*.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Preferensi Makanan & Anggaran */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 transition-colors">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-base">
            <span>3. Preferensi Pangan & Batas Anggaran (IDR)</span>
          </div>

          {/* Pola / Preferensi Pangan Interactive Chips */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Pola / Preferensi Pangan Harian
            </label>
            <div className="flex flex-wrap gap-2">
              {foodPreferenceOptions.map((opt) => {
                const isSelected =
                  formData.food_preference?.toLowerCase() === opt.key.toLowerCase();
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleChange('food_preference', opt.key)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-95 cursor-pointer border select-none ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs ring-2 ring-emerald-500/30'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    {isSelected && <span className="mr-1 font-bold">✓</span>}
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Makanan Dihindari / Alergi with Interactive Fast-Tags */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Makanan Dihindari / Alergi (Klik tag cepat atau ketik manual)
            </label>
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              <span className="text-[11px] text-slate-400 mr-1">Pilih Cepat:</span>
              {commonAllergenTags.map((tag) => {
                const isIncluded = formData.avoided_foods
                  ?.toLowerCase()
                  .includes(tag.toLowerCase());
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleAvoidedFood(tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all duration-150 active:scale-90 cursor-pointer select-none ${
                      isIncluded
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border-rose-300 dark:border-rose-800 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {isIncluded ? '✕ ' : '+ '}
                    {tag}
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              placeholder="Contoh: udang, susu, pedas, gluten"
              value={formData.avoided_foods}
              onChange={(e) => handleChange('avoided_foods', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
            />
          </div>

          {/* Daily Food Budget with Quick Click Chips */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Batas Anggaran Makanan Harian (IDR)
              </label>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Rp {formData.daily_food_budget?.toLocaleString('id-ID')} / hari
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-2">
              <span className="text-[11px] text-slate-400 self-center mr-1">Pilihan Cepat:</span>
              {budgetPresets.map((preset) => {
                const isSelected = formData.daily_food_budget === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleChange('daily_food_budget', preset)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-150 active:scale-90 cursor-pointer select-none ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs ring-2 ring-emerald-500/30'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Rp {preset.toLocaleString('id-ID')}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center rounded-xl border border-slate-300 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800 focus-within:ring-2 focus-within:ring-emerald-500 max-w-md">
              <button
                type="button"
                onClick={() => adjustNumeric('daily_food_budget', -5000, 15000, 250000)}
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-90 font-bold transition-all cursor-pointer select-none"
                title="Kurangi Rp 5.000"
              >
                − Rp 5k
              </button>
              <input
                type="number"
                step="5000"
                min="15000"
                max="250000"
                required
                value={formData.daily_food_budget}
                onChange={(e) => handleChange('daily_food_budget', parseFloat(e.target.value) || 30000)}
                className="w-full text-center py-2.5 text-sm bg-transparent text-slate-900 dark:text-white font-bold focus:outline-none"
              />
              <button
                type="button"
                onClick={() => adjustNumeric('daily_food_budget', 5000, 15000, 250000)}
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-90 font-bold transition-all cursor-pointer select-none"
                title="Tambah Rp 5.000"
              >
                + Rp 5k
              </button>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
              Total batas pengeluaran untuk 3–4 waktu makan sirkadian harian.
            </span>
          </div>
        </div>

        {/* Submit & Reset Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={resetForm}
            className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all cursor-pointer border border-slate-300 dark:border-slate-700 select-none"
          >
            Reset Pengaturan Awal
          </button>

          <button
            type="submit"
            id="btn-submit-assessment"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 active:ring-4 active:ring-emerald-500/30 shadow-md shadow-emerald-700/25 hover:shadow-lg hover:shadow-emerald-700/30 transition-all text-sm cursor-pointer select-none"
          >
            <span>Kalkulasi Kebutuhan & Rekomendasikan Menu AI</span>
            <span className="font-extrabold text-base">→</span>
          </button>
        </div>
      </form>
    </div>
  );
};
