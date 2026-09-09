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

export function getOccupationAdjustment(occ: string): number {
  const lower = occ.toLowerCase();
  if (lower.includes('heavy') || lower.includes('berat')) {
    return 0.30;
  } else if (lower.includes('moderate') || lower.includes('sedang')) {
    return 0.15;
  } else if (lower.includes('light') || lower.includes('ringan')) {
    return 0.05;
  }
  return 0.00; // Sedentary
}

export function getWorkingHoursFactor(hours: string): number {
  if (hours.includes('> 10')) return 1.10;
  if (hours.includes('8–10') || hours.includes('8-10')) return 1.05;
  return 1.00;
}

export function calculateNutritionRequirements(profile: UserProfile): NutritionRequirements {
  const { bmi, category: bmi_category, status: bmi_status } = calculateBMI(profile.weight_kg, profile.height_cm);
  const bmr = calculateBMR(profile.weight_kg, profile.height_cm, profile.age, profile.gender);

  const baseActivity = getActivityMultiplier(profile.physical_activity);
  const occAdjustment = getOccupationAdjustment(profile.occupation_type);
  const totalActivityMultiplier = Math.round((baseActivity + occAdjustment) * 1000) / 1000;
  const hoursFactor = getWorkingHoursFactor(profile.working_hours);

  let tdee = bmr * totalActivityMultiplier * hoursFactor;

  // Sedikit penyesuaian jika kurang tidur (<6 jam)
  if (profile.average_sleep_hours < 6) {
    tdee *= 1.03;
  }

  const daily_calories = Math.round(tdee);

  // Protein g/kg
  const occLower = profile.occupation_type.toLowerCase();
  let proteinPerKg = 1.2;
  if (occLower.includes('heavy')) proteinPerKg = 1.8;
  else if (occLower.includes('moderate')) proteinPerKg = 1.5;
  else if (occLower.includes('light')) proteinPerKg = 1.3;

  if (profile.food_preference === 'High protein') {
    proteinPerKg = Math.max(proteinPerKg, 1.8);
  }

  const target_protein_g = Math.round(profile.weight_kg * proteinPerKg * 10) / 10;
  const protein_cals = target_protein_g * 4;

  // Lemak
  let fatPct = 0.25;
  if (profile.food_preference === 'Low fat') fatPct = 0.20;
  else if (occLower.includes('heavy')) fatPct = 0.28;

  const target_fat_cals = daily_calories * fatPct;
  const target_fat_g = Math.round((target_fat_cals / 9) * 10) / 10;

  // Karbohidrat
  let carb_cals = daily_calories - protein_cals - target_fat_cals;
  if (carb_cals < 0) carb_cals = daily_calories * 0.45;
  const target_carb_g = Math.round((carb_cals / 4) * 10) / 10;

  const target_fiber_g = daily_calories >= 2200 ? 30 : 25;

  // Shift & Circadian Meal Slots
  const is_night_shift = profile.shift === 'Night';

  let meal_slots: MealSlotConfig[];
  if (is_night_shift) {
    meal_slots = [
      {
        id: 'pre_shift',
        name: 'Pre-Shift Meal (17:00–19:00)',
        target_pct: 0.35,
        desc: 'Karbohidrat kompleks & protein pembangun untuk pelepasan energi stabil',
      },
      {
        id: 'mid_shift',
        name: 'Mid-Shift Meal (23:00–01:00)',
        target_pct: 0.30,
        desc: 'Menu mudah cerna, rendah lemak jenuh agar tidak memicu kantuk',
      },
      {
        id: 'post_shift',
        name: 'Post-Shift Meal (06:00–07:30)',
        target_pct: 0.20,
        desc: 'Pemulihan otot ringan dan mendukung kualitas tidur pagi',
      },
      {
        id: 'snack',
        name: 'Shift Snack / Pengganjal',
        target_pct: 0.15,
        desc: 'Camilan buah & kacang bernutrisi tinggi serta hidrasi',
      },
    ];
  } else {
    meal_slots = [
      {
        id: 'breakfast',
        name: 'Sarapan Sehat (Breakfast)',
        target_pct: 0.25,
        desc: 'Awali hari dengan protein dan serat untuk ketajaman fokus',
      },
      {
        id: 'lunch',
        name: 'Makan Siang (Lunch)',
        target_pct: 0.35,
        desc: 'Menu utama penyuplai energi kerja di tengah aktivitas',
      },
      {
        id: 'dinner',
        name: 'Makan Malam (Dinner)',
        target_pct: 0.25,
        desc: 'Nutrisi seimbang untuk pemulihan fisik tanpa membebani pencernaan',
      },
      {
        id: 'snack',
        name: 'Snack Sore / Camilan',
        target_pct: 0.15,
        desc: 'Camilan sehat pencegah penurunan glukosa darah sore hari',
      },
    ];
  }

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
  };
}
