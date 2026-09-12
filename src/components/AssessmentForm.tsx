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

  // String state for numeric inputs so user can backspace, clear completely, and type numbers (e.g. 12, 13, 9) without fighting defaults
  const [ageInput, setAgeInput] = useState<string>(String(initialProfile.age));
  const [weightInput, setWeightInput] = useState<string>(String(initialProfile.weight_kg));
  const [heightInput, setHeightInput] = useState<string>(String(initialProfile.height_cm));
  const [sleepInput, setSleepInput] = useState<string>(String(initialProfile.average_sleep_hours));
  const [budgetInput, setBudgetInput] = useState<string>(String(initialProfile.daily_food_budget));

  const [activeTemplate, setActiveTemplate] = useState<'nightshift' | 'office' | 'field' | null>(null);
  const [templateNotification, setTemplateNotification] = useState<string | null>(null);
  const [showBmiGuide, setShowBmiGuide] = useState<boolean>(false);

  // Validation errors map: fieldId -> message
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formAlert, setFormAlert] = useState<string | null>(null);

  // Safely calculate BMI from current weight and height inputs
  const currentWeightNum = parseFloat(weightInput);
  const currentHeightNum = parseFloat(heightInput);
  const isWeightValid = !isNaN(currentWeightNum) && currentWeightNum > 0;
  const isHeightValid = !isNaN(currentHeightNum) && currentHeightNum > 0;
  const bmiInfo = isWeightValid && isHeightValid ? calculateBMI(currentWeightNum, currentHeightNum) : null;

  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (formAlert) {
      setFormAlert(null);
    }
  };

  const handleChange = (field: keyof UserProfile, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const adjustNumeric = (
    field: 'age' | 'weight_kg' | 'height_cm' | 'average_sleep_hours' | 'daily_food_budget',
    delta: number,
    min: number,
    max: number
  ) => {
    clearFieldError(field);
    let currentVal = 0;
    if (field === 'age') currentVal = parseFloat(ageInput) || 25;
    else if (field === 'weight_kg') currentVal = parseFloat(weightInput) || 60;
    else if (field === 'height_cm') currentVal = parseFloat(heightInput) || 165;
    else if (field === 'average_sleep_hours') currentVal = parseFloat(sleepInput) || 7;
    else if (field === 'daily_food_budget') currentVal = parseFloat(budgetInput) || 50000;

    const nextVal = Math.min(max, Math.max(min, Math.round((currentVal + delta) * 10) / 10));

    if (field === 'age') setAgeInput(String(Math.round(nextVal)));
    else if (field === 'weight_kg') setWeightInput(String(nextVal));
    else if (field === 'height_cm') setHeightInput(String(nextVal));
    else if (field === 'average_sleep_hours') setSleepInput(String(nextVal));
    else if (field === 'daily_food_budget') setBudgetInput(String(Math.round(nextVal)));
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
    setErrors({});
    setFormAlert(null);

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
      setAgeInput('26');
      setWeightInput('68');
      setHeightInput('172');
      setSleepInput('6.5');
      setBudgetInput('50000');
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
      setAgeInput('29');
      setWeightInput('56');
      setHeightInput('160');
      setSleepInput('7');
      setBudgetInput('65000');
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
      setAgeInput('33');
      setWeightInput('74');
      setHeightInput('174');
      setSleepInput('6.5');
      setBudgetInput('70000');
      setTemplateNotification('Template Profil Pekerja Fisik / Lapangan dimuat');
    }

    setTimeout(() => {
      setTemplateNotification(null);
    }, 2800);
  };

  const resetForm = () => {
    setFormData(initialProfile);
    setAgeInput(String(initialProfile.age));
    setWeightInput(String(initialProfile.weight_kg));
    setHeightInput(String(initialProfile.height_cm));
    setSleepInput(String(initialProfile.average_sleep_hours));
    setBudgetInput(String(initialProfile.daily_food_budget));
    setActiveTemplate(null);
    setErrors({});
    setFormAlert(null);
    setTemplateNotification('Formulir direset ke pengaturan awal');
    setTimeout(() => setTemplateNotification(null), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    // Validate Age
    const parsedAge = parseInt(ageInput.trim(), 10);
    if (ageInput.trim() === '' || isNaN(parsedAge)) {
      newErrors.age = 'Usia wajib diisi angka';
    } else if (parsedAge < 15 || parsedAge > 100) {
      newErrors.age = 'Usia harus antara 15 – 100 tahun';
    }

    // Validate Weight
    const parsedWeight = parseFloat(weightInput.trim());
    if (weightInput.trim() === '' || isNaN(parsedWeight)) {
      newErrors.weight_kg = 'Berat badan wajib diisi angka';
    } else if (parsedWeight < 30 || parsedWeight > 250) {
      newErrors.weight_kg = 'Berat badan harus antara 30 – 250 kg';
    }

    // Validate Height
    const parsedHeight = parseFloat(heightInput.trim());
    if (heightInput.trim() === '' || isNaN(parsedHeight)) {
      newErrors.height_cm = 'Tinggi badan wajib diisi angka';
    } else if (parsedHeight < 100 || parsedHeight > 250) {
      newErrors.height_cm = 'Tinggi badan harus antara 100 – 250 cm';
    }

    // Validate Sleep
    const parsedSleep = parseFloat(sleepInput.trim());
    if (sleepInput.trim() === '' || isNaN(parsedSleep)) {
      newErrors.average_sleep_hours = 'Durasi tidur wajib diisi angka';
    } else if (parsedSleep < 2 || parsedSleep > 16) {
      newErrors.average_sleep_hours = 'Durasi tidur harus antara 2 – 16 jam';
    }

    // Validate Budget
    const parsedBudget = parseFloat(budgetInput.trim());
    if (budgetInput.trim() === '' || isNaN(parsedBudget)) {
      newErrors.daily_food_budget = 'Anggaran makan wajib diisi angka';
    } else if (parsedBudget < 10000) {
      newErrors.daily_food_budget = 'Anggaran minimal Rp 10.000 / hari';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setFormAlert('Mohon lengkapi formulir: Terdapat kolom yang belum diisi atau tidak valid (ditandai dengan warna merah).');

      // Scroll smoothly to the first invalid field
      const firstKey = Object.keys(newErrors)[0];
      const targetElement = document.getElementById(`field-${firstKey}`);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const inputElem = targetElement.querySelector('input');
        if (inputElem) {
          inputElem.focus();
        }
      }
      return;
    }

    // Success: prepare cleaned submission data
    setErrors({});
    setFormAlert(null);
    const cleanedProfile: UserProfile = {
      ...formData,
      age: parsedAge,
      weight_kg: parsedWeight,
      height_cm: parsedHeight,
      average_sleep_hours: parsedSleep,
      daily_food_budget: parsedBudget,
    };

    onSubmit(cleanedProfile);
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
        <div className="bg-emerald-600 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-700/20 flex items-center justify-between animate-in fade-in transition-all">
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

      {/* Red Alert Banner if Form Has Validation Errors */}
      {formAlert && (
        <div
          id="form-error-banner"
          className="bg-rose-50 dark:bg-rose-950/80 border-2 border-rose-400 dark:border-rose-700 text-rose-800 dark:text-rose-200 text-xs sm:text-sm font-semibold p-4 rounded-2xl shadow-md shadow-rose-600/10 flex items-start justify-between gap-3 animate-in fade-in transition-all"
        >
          <div className="flex items-start gap-2.5">
            <span className="text-rose-600 dark:text-rose-400 font-extrabold text-base leading-none mt-0.5">⚠️</span>
            <div>
              <p className="font-bold">{formAlert}</p>
              <ul className="mt-1 list-disc list-inside text-xs font-normal text-rose-700 dark:text-rose-300 space-y-0.5">
                {Object.values(errors).map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFormAlert(null)}
            className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-100 font-bold text-sm cursor-pointer"
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
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-95 cursor-pointer select-none shadow-xs ${
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
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-95 cursor-pointer select-none shadow-xs ${
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
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-95 cursor-pointer select-none shadow-xs ${
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
      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        {/* Section 1: Karakteristik Individu */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 transition-colors">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-base flex items-center justify-between">
            <span>1. Karakteristik Individu & Biometrik</span>
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              Ketik angka langsung atau gunakan tombol (+ / −)
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
                  {formData.gender === 'Male' && <span className="mr-1 font-bold">✓</span>}
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
                  {formData.gender === 'Female' && <span className="mr-1 font-bold">✓</span>}
                  Wanita (Female)
                </button>
              </div>
            </div>

            {/* Age with Click Steppers & Free Editable Input */}
            <div id="field-age">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex justify-between">
                <span>Usia (Tahun)</span>
                {errors.age && (
                  <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                    {errors.age}
                  </span>
                )}
              </label>
              <div
                className={`flex items-center rounded-xl border overflow-hidden bg-white dark:bg-slate-800 transition-all ${
                  errors.age
                    ? 'border-rose-500 ring-2 ring-rose-500/30 bg-rose-50/20 dark:bg-rose-950/20'
                    : 'border-slate-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-emerald-500'
                }`}
              >
                <button
                  type="button"
                  onClick={() => adjustNumeric('age', -1, 15, 100)}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 font-bold transition-all cursor-pointer select-none"
                  title="Kurangi 1 tahun"
                >
                  −
                </button>
                <input
                  id="input-age"
                  type="text"
                  inputMode="numeric"
                  value={ageInput}
                  onChange={(e) => {
                    setAgeInput(e.target.value);
                    clearFieldError('age');
                  }}
                  placeholder="25"
                  className="w-full text-center py-2 text-sm bg-transparent text-slate-900 dark:text-white font-semibold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => adjustNumeric('age', 1, 15, 100)}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 font-bold transition-all cursor-pointer select-none"
                  title="Tambah 1 tahun"
                >
                  +
                </button>
              </div>
            </div>

            {/* Weight with Click Steppers & Free Editable Input */}
            <div id="field-weight_kg">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex justify-between">
                <span>Berat Badan (kg)</span>
                {errors.weight_kg && (
                  <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                    {errors.weight_kg}
                  </span>
                )}
              </label>
              <div
                className={`flex items-center rounded-xl border overflow-hidden bg-white dark:bg-slate-800 transition-all ${
                  errors.weight_kg
                    ? 'border-rose-500 ring-2 ring-rose-500/30 bg-rose-50/20 dark:bg-rose-950/20'
                    : 'border-slate-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-emerald-500'
                }`}
              >
                <button
                  type="button"
                  onClick={() => adjustNumeric('weight_kg', -0.5, 30, 250)}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 font-bold transition-all cursor-pointer select-none"
                  title="Kurangi 0.5 kg"
                >
                  −
                </button>
                <input
                  id="input-weight_kg"
                  type="text"
                  inputMode="decimal"
                  value={weightInput}
                  onChange={(e) => {
                    setWeightInput(e.target.value);
                    clearFieldError('weight_kg');
                  }}
                  placeholder="65"
                  className="w-full text-center py-2 text-sm bg-transparent text-slate-900 dark:text-white font-semibold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => adjustNumeric('weight_kg', 0.5, 30, 250)}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 font-bold transition-all cursor-pointer select-none"
                  title="Tambah 0.5 kg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Height with Click Steppers & Free Editable Input */}
            <div id="field-height_cm">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex justify-between">
                <span>Tinggi Badan (cm)</span>
                {errors.height_cm && (
                  <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                    {errors.height_cm}
                  </span>
                )}
              </label>
              <div
                className={`flex items-center rounded-xl border overflow-hidden bg-white dark:bg-slate-800 transition-all ${
                  errors.height_cm
                    ? 'border-rose-500 ring-2 ring-rose-500/30 bg-rose-50/20 dark:bg-rose-950/20'
                    : 'border-slate-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-emerald-500'
                }`}
              >
                <button
                  type="button"
                  onClick={() => adjustNumeric('height_cm', -1, 100, 250)}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 font-bold transition-all cursor-pointer select-none"
                  title="Kurangi 1 cm"
                >
                  −
                </button>
                <input
                  id="input-height_cm"
                  type="text"
                  inputMode="decimal"
                  value={heightInput}
                  onChange={(e) => {
                    setHeightInput(e.target.value);
                    clearFieldError('height_cm');
                  }}
                  placeholder="170"
                  className="w-full text-center py-2 text-sm bg-transparent text-slate-900 dark:text-white font-semibold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => adjustNumeric('height_cm', 1, 100, 250)}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 font-bold transition-all cursor-pointer select-none"
                  title="Tambah 1 cm"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Real-time BMI Indicator & Collapsible Info */}
          {bmiInfo ? (
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
          ) : (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
              Masukkan berat dan tinggi badan untuk menghitung Indeks Massa Tubuh (IMT) secara real-time.
            </div>
          )}

          {/* Expanded BMI Reference Guide */}
          {showBmiGuide && (
            <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/60 text-xs text-slate-700 dark:text-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-2 animate-in fade-in">
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

        {/* Section 2: Workforce Profile */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-7 transition-colors">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="text-slate-900 dark:text-white font-extrabold text-lg">
              <span>2. Workforce Profile (Karakteristik Tenaga Kerja)</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Parameter algoritma untuk mengkalkulasi kebutuhan metabolik okupasi, ritme sirkadian, dan pemulihan stamina kerja.
            </p>
          </div>

          {/* 1. Jenis Pekerjaan (Occupation) Interactive Chips */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>Jenis Pekerjaan (Occupation)</span>
              <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                Pilih kategori yang paling mewakili
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
                Terpilih: {formData.shift}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {shiftOptions.map((shf) => {
                const isSelected = formData.shift === shf.key;
                return (
                  <button
                    key={shf.key}
                    type="button"
                    onClick={() => handleChange('shift', shf.key)}
                    className={`p-3.5 rounded-xl text-left border transition-all duration-150 active:scale-95 cursor-pointer select-none flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/70 border-emerald-500 dark:border-emerald-600 ring-2 ring-emerald-500/30 shadow-xs'
                        : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {shf.label}
                        </span>
                        {isSelected && (
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">✓</span>
                        )}
                      </div>
                      <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300 mb-1.5">
                        {shf.hours}
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                        {shf.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Durasi Jam Kerja, Aktivitas Fisik & Jam Tidur */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2 border-t border-slate-100 dark:border-slate-800">
            {/* Jam Kerja Harian */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Jam Kerja Harian (Durasi)
              </label>
              <div className="space-y-1.5">
                {workingHoursOptions.map((opt) => {
                  const isSelected = formData.working_hours === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => handleChange('working_hours', opt.key)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-semibold text-left border transition-all duration-150 active:scale-95 cursor-pointer flex items-center justify-between select-none ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <span className="font-bold">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Aktivitas Fisik Luar Kerja */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Aktivitas Fisik / Olahraga Luar Kerja
              </label>
              <div className="space-y-1.5">
                {physicalActivityOptions.map((opt) => {
                  const isSelected = formData.physical_activity === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => handleChange('physical_activity', opt.key)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-semibold text-left border transition-all duration-150 active:scale-95 cursor-pointer flex items-center justify-between select-none ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <span className="font-bold">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Durasi Tidur Rata-rata */}
            <div id="field-average_sleep_hours" className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex justify-between">
                <span>Durasi Tidur Harian (Jam)</span>
                {errors.average_sleep_hours && (
                  <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                    {errors.average_sleep_hours}
                  </span>
                )}
              </label>
              <div
                className={`flex items-center rounded-xl border overflow-hidden bg-white dark:bg-slate-800 transition-all ${
                  errors.average_sleep_hours
                    ? 'border-rose-500 ring-2 ring-rose-500/30 bg-rose-50/20 dark:bg-rose-950/20'
                    : 'border-slate-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-emerald-500'
                }`}
              >
                <button
                  type="button"
                  onClick={() => adjustNumeric('average_sleep_hours', -0.5, 2, 16)}
                  className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 font-bold transition-all cursor-pointer select-none"
                  title="Kurangi 0.5 jam"
                >
                  −
                </button>
                <input
                  id="input-average_sleep_hours"
                  type="text"
                  inputMode="decimal"
                  value={sleepInput}
                  onChange={(e) => {
                    setSleepInput(e.target.value);
                    clearFieldError('average_sleep_hours');
                  }}
                  placeholder="7"
                  className="w-full text-center py-2 text-sm bg-transparent text-slate-900 dark:text-white font-semibold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => adjustNumeric('average_sleep_hours', 0.5, 2, 16)}
                  className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 font-bold transition-all cursor-pointer select-none"
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
                    onClick={() => {
                      setSleepInput(String(hours));
                      clearFieldError('average_sleep_hours');
                    }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all active:scale-95 cursor-pointer select-none ${
                      parseFloat(sleepInput) === hours
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-400 ring-1 ring-emerald-400'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
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
                    {isSelected && <span className="mr-1.5 font-bold">✓</span>}
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Allergen & Pantangan Makanan Chips */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Pantangan Makanan / Alergen (Opsional)
            </label>
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              <span className="text-[11px] text-slate-400 mr-1">Klik untuk tambah/hapus:</span>
              {commonAllergenTags.map((tag) => {
                const isSelected = (formData.avoided_foods || '')
                  .toLowerCase()
                  .includes(tag.toLowerCase());
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleAvoidedFood(tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-150 active:scale-95 cursor-pointer border select-none ${
                      isSelected
                        ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-800 ring-1 ring-rose-400'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected ? `✕ ${tag}` : `+ ${tag}`}
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

          {/* Daily Food Budget with Quick Click Chips & Editable Input */}
          <div id="field-daily_food_budget" className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Batas Anggaran Makanan Harian (IDR)
              </label>
              {errors.daily_food_budget ? (
                <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                  {errors.daily_food_budget}
                </span>
              ) : (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {budgetInput ? `Rp ${parseInt(budgetInput, 10).toLocaleString('id-ID')} / hari` : 'Belum diisi'}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-2">
              <span className="text-[11px] text-slate-400 self-center mr-1">Pilihan Cepat:</span>
              {budgetPresets.map((preset) => {
                const isSelected = parseInt(budgetInput, 10) === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setBudgetInput(String(preset));
                      clearFieldError('daily_food_budget');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-150 active:scale-95 cursor-pointer select-none ${
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

            <div
              className={`flex items-center rounded-xl border overflow-hidden bg-white dark:bg-slate-800 max-w-md transition-all ${
                errors.daily_food_budget
                  ? 'border-rose-500 ring-2 ring-rose-500/30 bg-rose-50/20 dark:bg-rose-950/20'
                  : 'border-slate-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-emerald-500'
              }`}
            >
              <button
                type="button"
                onClick={() => adjustNumeric('daily_food_budget', -5000, 10000, 300000)}
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 font-bold transition-all cursor-pointer select-none"
                title="Kurangi Rp 5.000"
              >
                − Rp 5k
              </button>
              <input
                id="input-daily_food_budget"
                type="text"
                inputMode="numeric"
                value={budgetInput}
                onChange={(e) => {
                  setBudgetInput(e.target.value);
                  clearFieldError('daily_food_budget');
                }}
                placeholder="50000"
                className="w-full text-center py-2.5 text-sm bg-transparent text-slate-900 dark:text-white font-bold focus:outline-none"
              />
              <button
                type="button"
                onClick={() => adjustNumeric('daily_food_budget', 5000, 10000, 300000)}
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 font-bold transition-all cursor-pointer select-none"
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
