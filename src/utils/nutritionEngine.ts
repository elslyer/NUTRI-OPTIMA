/**
 * NUTRI-OPTIMA — Nutrition Engine (TypeScript)
 * Formula Standar Ilmiah:
 * - Mifflin-St Jeor BMR
 * - BMI WHO Asia-Pasifik
 * - Workforce Metabolic Multiplier
 * - Circadian Rhythm Shift Allocation
 */

import { UserProfile, NutritionRequirements, MealSlotConfig } from '../types';

export function calculateBMI(weight_kg: number, height_cm: number) {
  const height_m = height_cm / 100;
  const bmi = Math.round((weight_kg / (height_m * height_m)) * 10) / 10;

  let category = 'Normal (Asia-Pasifik)';
  let status: 'success' | 'warning' | 'danger' = 'success';

  if (bmi < 18.5) {
    category = 'Underweight (Kekurangan Berat)';
    status = 'warning';
  } else if (bmi <= 22.9) {
    category = 'Normal (Sehat Optimal)';
    status = 'success';
  } else if (bmi <= 24.9) {
    category = 'Overweight / Berisiko';
    status = 'warning';
  } else if (bmi <= 29.9) {
    category = 'Obesitas Tingkat I';
    status = 'danger';
  } else {
    category = 'Obesitas Tingkat II';
    status = 'danger';
  }

  return { bmi, category, status };
}

export function calculateBMR(weight_kg: number, height_cm: number, age: number, gender: string): number {
  const isMale = gender.toLowerCase() === 'male' || gender.toLowerCase() === 'pria';
  if (isMale) {
    return Math.round(10 * weight_kg + 6.25 * height_cm - 5 * age + 5);
  } else {
    return Math.round(10 * weight_kg + 6.25 * height_cm - 5 * age - 161);
  }
}

export function getActivityMultiplier(level: string): number {
  switch (level.toLowerCase()) {
    case 'low':
      return 1.2;
    case 'light':
      return 1.375;
    case 'moderate':
      return 1.55;
    case 'high':
      return 1.725;
    case 'very high':
      return 1.9;
    default:
      return 1.375;
  }
}

export function getWorkIntensityAdjustment(intensity?: string, fallbackOcc?: string): number {
  const target = (intensity || fallbackOcc || '').toLowerCase();
  if (target.includes('very heavy') || target.includes('sangat berat')) {
    return 0.65;
  } else if (target.includes('heavy') || target.includes('berat')) {
    return 0.45;
  } else if (target.includes('moderate') || target.includes('sedang')) {
    return 0.25;
  } else if (target.includes('light') || target.includes('ringan')) {
    return 0.10;
  }
  return 0.00; // Sedentary
}

export function getWorkingHoursFactor(hours: string): number {
  if (hours.includes('> 12') || hours.includes('>12')) return 1.18;
  if (hours.includes('10–12') || hours.includes('10-12') || hours.includes('> 10')) return 1.12;
  if (hours.includes('8–10') || hours.includes('8-10')) return 1.06;
  return 1.00; // Standard 8 hours or less
}

export function calculateNutritionRequirements(profile: UserProfile): NutritionRequirements {
  const { bmi, category: bmi_category, status: bmi_status } = calculateBMI(profile.weight_kg, profile.height_cm);
  const bmr = calculateBMR(profile.weight_kg, profile.height_cm, profile.age, profile.gender);

  const baseActivity = getActivityMultiplier(profile.physical_activity);
  const intensityAdjustment = getWorkIntensityAdjustment(profile.work_intensity, profile.occupation_type);
  const totalActivityMultiplier = Math.round((baseActivity + intensityAdjustment) * 1000) / 1000;
  const hoursFactor = getWorkingHoursFactor(profile.working_hours);

  let tdee = bmr * totalActivityMultiplier * hoursFactor;

  // Penyesuaian jika kurang tidur (<6 jam) yang memicu resistensi insulin & ghrelin
  if (profile.average_sleep_hours < 6) {
    tdee *= 1.03;
  }

  const daily_calories = Math.round(tdee);

  // Protein g/kg ditentukan oleh intensitas okupasi & beban fisik
  const intensityStr = (profile.work_intensity || profile.occupation_type || '').toLowerCase();
  let proteinPerKg = 1.1;
  if (intensityStr.includes('very heavy') || intensityStr.includes('sangat berat')) proteinPerKg = 2.0;
  else if (intensityStr.includes('heavy') || intensityStr.includes('berat')) proteinPerKg = 1.8;
  else if (intensityStr.includes('moderate') || intensityStr.includes('sedang')) proteinPerKg = 1.5;
  else if (intensityStr.includes('light') || intensityStr.includes('ringan')) proteinPerKg = 1.3;

  if (profile.food_preference === 'High protein') {
    proteinPerKg = Math.max(proteinPerKg, 1.8);
  }

  const target_protein_g = Math.round(profile.weight_kg * proteinPerKg * 10) / 10;
  const protein_cals = target_protein_g * 4;

  // Lemak
  let fatPct = 0.25;
  if (profile.food_preference === 'Low fat') fatPct = 0.20;
  else if (intensityStr.includes('heavy')) fatPct = 0.28;

  const target_fat_cals = daily_calories * fatPct;
  const target_fat_g = Math.round((target_fat_cals / 9) * 10) / 10;

  // Karbohidrat
  let carb_cals = daily_calories - protein_cals - target_fat_cals;
  if (carb_cals < 0) carb_cals = daily_calories * 0.45;
  const target_carb_g = Math.round((carb_cals / 4) * 10) / 10;

  const target_fiber_g = daily_calories >= 2200 ? 30 : 25;

  // Shift & Circadian Meal Slots
  const shiftLower = profile.shift.toLowerCase();
  const is_night_shift = shiftLower.includes('night') || shiftLower.includes('malam');
  const is_afternoon_shift = shiftLower.includes('afternoon') || shiftLower.includes('sore');
  const is_morning_shift = shiftLower.includes('morning') || shiftLower.includes('pagi');
  const is_rotating_shift = shiftLower.includes('rotating') || shiftLower.includes('gilir');

  let meal_slots: MealSlotConfig[];
  let circadianTitle = 'Reguler Ergonomis (Daytime)';
  let circadianDesc = 'Alokasi seimbang 3 waktu makan utama dan 1 snack untuk mendukung konsentrasi dan stabilitas gula darah.';

  if (is_night_shift) {
    circadianTitle = 'Protokol Sirkadian Shift Malam (Nocturnal Chrono-Nutrition)';
    circadianDesc = 'Pemberian karbohidrat kompleks sebelum shift dan menu rendah beban glikemik tengah malam guna mencegah kantuk serta resistensi insulin nokturnal.';
    meal_slots = [
      {
        id: 'pre_shift',
        name: 'Pre-Shift Fuel (17:00–19:00)',
        target_pct: 0.35,
        desc: 'Karbohidrat kompleks & protein pembangun untuk pelepasan energi stabil',
      },
      {
        id: 'mid_shift',
        name: 'Mid-Shift Refuel (23:00–01:00)',
        target_pct: 0.30,
        desc: 'Menu mudah cerna, rendah lemak jenuh agar tidak memicu kantuk',
      },
      {
        id: 'post_shift',
        name: 'Post-Shift Recovery (06:00–07:30)',
        target_pct: 0.20,
        desc: 'Kaya triptofan & protein ringan untuk mendukung kualitas tidur pagi',
      },
      {
        id: 'snack',
        name: 'Nocturnal Shift Snack',
        target_pct: 0.15,
        desc: 'Camilan buah & kacang bernutrisi tinggi serta hidrasi',
      },
    ];
  } else if (is_afternoon_shift) {
    circadianTitle = 'Protokol Sirkadian Shift Sore (Late-Day Shift)';
    circadianDesc = 'Fokus energi siang hari yang berkelanjutan dengan santap malam mudah cerna sebelum kepulangan shift.';
    meal_slots = [
      {
        id: 'lunch',
        name: 'Makan Siang Awal (11:30–12:30)',
        target_pct: 0.30,
        desc: 'Energi utama pembuka sebelum memulai shift kerja sore',
      },
      {
        id: 'mid_shift',
        name: 'Makan Utama Saat Shift (18:00–19:30)',
        target_pct: 0.35,
        desc: 'Kombinasi protein & serat padat penopang stamina kerja puncak',
      },
      {
        id: 'snack',
        name: 'Pre-Shift Booster Snack (15:00)',
        target_pct: 0.15,
        desc: 'Peredam rasa lapar dan penstabil glukosa darah awal shift',
      },
      {
        id: 'post_shift',
        name: 'Pemulihan Pasca-Shift (22:30–23:30)',
        target_pct: 0.20,
        desc: 'Camilan ringan pemulihan otot sebelum tidur malam',
      },
    ];
  } else if (is_rotating_shift) {
    circadianTitle = 'Protokol Stabilisasi Sirkadian Shift Bergilir (Rotating Shift)';
    circadianDesc = 'Pola stabil 4 porsi gizi setara dengan antioksidan tinggi untuk meredam stres metabolik pergantian jam biologis.';
    meal_slots = [
      {
        id: 'slot_1',
        name: 'Sesi Makan 1 (Awal Shift)',
        target_pct: 0.28,
        desc: 'Fondasi kalori dan mikronutrien padat untuk kesiapan metabolik',
      },
      {
        id: 'slot_2',
        name: 'Sesi Makan 2 (Inti Jam Kerja)',
        target_pct: 0.32,
        desc: 'Penyuplai glukosa berkelanjutan tanpa memicu lethargy',
      },
      {
        id: 'slot_3',
        name: 'Sesi Makan 3 (Akhir Shift)',
        target_pct: 0.25,
        desc: 'Pemulihan glikogen otot dan sintesis protein jaringan',
      },
      {
        id: 'snack',
        name: 'Adaptasi Snack Ringan',
        target_pct: 0.15,
        desc: 'Buah segar lokal dan kacang-kacangan kaya magnesium',
      },
    ];
  } else {
    meal_slots = [
      {
        id: 'breakfast',
        name: 'Sarapan Sehat (Breakfast 07:00–08:00)',
        target_pct: 0.25,
        desc: 'Awali hari dengan protein dan serat untuk ketajaman fokus',
      },
      {
        id: 'lunch',
        name: 'Makan Siang (Lunch 12:00–13:00)',
        target_pct: 0.35,
        desc: 'Menu utama penyuplai energi kerja di tengah aktivitas',
      },
      {
        id: 'dinner',
        name: 'Makan Malam (Dinner 18:30–19:30)',
        target_pct: 0.25,
        desc: 'Nutrisi seimbang untuk pemulihan fisik tanpa membebani pencernaan',
      },
      {
        id: 'snack',
        name: 'Snack Sore / Camilan Kerja (15:30)',
        target_pct: 0.15,
        desc: 'Camilan sehat pencegah penurunan glukosa darah sore hari',
      },
    ];
  }

  // Hitung kuota hidrasi harian spesifik tenaga kerja (Liter/hari)
  let waterLiters = (profile.weight_kg * 0.035);
  if (intensityStr.includes('very heavy')) waterLiters += 1.5;
  else if (intensityStr.includes('heavy')) waterLiters += 1.0;
  else if (intensityStr.includes('moderate')) waterLiters += 0.5;

  if (hoursFactor > 1.05) waterLiters += 0.4; // lembur
  if (is_night_shift) waterLiters += 0.3; // udara AC nokturnal
  const hydration_quota_liters = Math.round(waterLiters * 10) / 10;

  return {
    bmi,
    bmi_category,
    bmi_status,
    bmr,
    activity_multiplier: totalActivityMultiplier,
    daily_calories,
    target_protein_g,
    target_carb_g,
    target_fat_g,
    target_fiber_g,
    is_night_shift,
    meal_slots,
    daily_budget: profile.daily_food_budget,
    workforce_impact: {
      occupation: profile.occupation_type,
      work_intensity: profile.work_intensity || 'Moderate',
      working_hours: profile.working_hours,
      shift: profile.shift,
      physical_activity: profile.physical_activity,
      occupational_multiplier_pct: Math.round(intensityAdjustment * 100),
      overtime_multiplier_pct: Math.round((hoursFactor - 1.0) * 100),
      protein_target_per_kg: proteinPerKg,
      hydration_quota_liters,
      circadian_protocol_title: circadianTitle,
      circadian_protocol_desc: circadianDesc,
      statement: 'Your nutrition recommendation is adjusted according to your work characteristics.',
    },
  };
}
