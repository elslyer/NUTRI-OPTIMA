/**
 * NUTRI-OPTIMA — AI & Recommendation Engine (TypeScript)
 * 1. Content-Based Filtering with Cosine Similarity
 * 2. Multi-Objective Scoring:
 *    Final Score = 0.40 * Nutrition Fit + 0.20 * Protein Fit + 0.15 * Budget Fit + 0.10 * Activity Fit + 0.15 * Sustainability Score
 * 3. Combinatorial Balanced Meal Allocation (Staple + Protein + Vegetable + Snack)
 */

import { UserProfile, NutritionRequirements, FoodItem, RecommendationResult, MealSlotResult } from '../types';
import { INITIAL_FOOD_DATABASE } from '../data/foodDatabase';

function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function generateRecommendation(
  profile: UserProfile,
  nutrition: NutritionRequirements,
  customDatabase?: FoodItem[]
): RecommendationResult {
  const database = customDatabase || INITIAL_FOOD_DATABASE;

  // 1. Filter preferensi & pantangan
  const pref = profile.food_preference.toLowerCase();
  const avoidedTerms = profile.avoided_foods
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  let filtered = database.filter((f) => {
    if (pref.includes('vegetarian') && !f.vegetarian) return false;
    const nameLower = f.food_name.toLowerCase();
    for (const term of avoidedTerms) {
      if (nameLower.includes(term)) return false;
    }
    return true;
  });

  if (filtered.length < 10) {
    filtered = database; // Fallback jika terlalu restriktif
  }

  // 2. Normalisasi Min-Max
  const features: (keyof Pick<FoodItem, 'calories' | 'protein_g' | 'carbohydrate_g' | 'fat_g' | 'fiber_g'>)[] = [
    'calories',
    'protein_g',
    'carbohydrate_g',
    'fat_g',
    'fiber_g',
  ];

  const minVals: Record<string, number> = {};
  const maxVals: Record<string, number> = {};

  features.forEach((feat) => {
    const vals = filtered.map((f) => f[feat]);
    minVals[feat] = Math.min(...vals);
    maxVals[feat] = Math.max(...vals);
  });

  const normalize = (val: number, feat: string) => {
    const spread = maxVals[feat] - minVals[feat];
    if (spread === 0) return 0.5;
    return Math.max(0, Math.min(1, (val - minVals[feat]) / spread));
  };

  // Target Vector per waktu makan (dibagi 3.2 slot)
  const targetPerSlot = {
    calories: nutrition.daily_calories / 3.2,
    protein_g: nutrition.target_protein_g / 3.2,
    carbohydrate_g: nutrition.target_carb_g / 3.2,
    fat_g: nutrition.target_fat_g / 3.2,
    fiber_g: nutrition.target_fiber_g / 3.2,
  };

  const targetVec = features.map((feat) => normalize(targetPerSlot[feat], feat));

  // 3. Multi-Component Scoring
  const budgetPerItem = profile.daily_food_budget / 8.0;
  const occ = profile.occupation_type.toLowerCase();

  const scoredFoods: FoodItem[] = filtered.map((food) => {
    const foodVec = features.map((feat) => normalize(food[feat], feat));
    const cosSim = cosineSimilarity(targetVec, foodVec);
    const nutritionFit = Math.max(0, Math.min(100, cosSim * 100));

    // Protein Density Fit
    const protDensity = food.protein_g / Math.max(1.0, food.calories / 20.0);
    const proteinFit = Math.min(100, protDensity * 40.0);

    // Budget Fit
    let budgetFit = 100;
    if (food.price_idr > budgetPerItem) {
      budgetFit = Math.max(10, 100 - ((food.price_idr - budgetPerItem) / budgetPerItem) * 60.0);
    }

    // Activity Fit
    let activityFit = 75;
    if (occ.includes('heavy') || occ.includes('berat')) {
      activityFit = Math.min(100, (food.calories / 200.0) * 70.0 + (food.carbohydrate_g / 30.0) * 30.0);
    } else if (occ.includes('moderate') || occ.includes('sedang')) {
      activityFit = Math.min(100, (food.calories / 160.0) * 60.0 + (food.protein_g / 15.0) * 40.0);
    } else {
      activityFit = Math.min(100, (food.fiber_g / 4.0) * 60.0 + Math.max(0, 100 - (food.fat_g / 12.0) * 40.0));
    }

    // Sustainability Fit
    const sustainabilityFit = food.sustainability_score;

    // Weighted Prototype Score
    const finalScore =
      0.40 * nutritionFit +
      0.20 * proteinFit +
      0.15 * budgetFit +
      0.10 * activityFit +
      0.15 * sustainabilityFit;

    return {
      ...food,
      cosine_sim: Math.round(cosSim * 1000) / 1000,
      final_score: Math.round(finalScore * 10) / 10,
    };
  });

  // 4. Susun Menu Lengkap (Staple + Protein + Sayur / Snack)
  const mealPlan: MealSlotResult[] = [];
  let totalRecCalories = 0;
  let totalRecProtein = 0;
  let totalRecCarbs = 0;
  let totalRecFat = 0;
  let totalRecCost = 0;
  const totalSustainability: number[] = [];
  const usedIds = new Set<number>();

  nutrition.meal_slots.forEach((slot, idx) => {
    const slotTargetCals = Math.round(nutrition.daily_calories * slot.target_pct);
    const slotItems: FoodItem[] = [];

    if (slot.id === 'snack') {
      const snackCands = scoredFoods
        .filter((x) => (x.category === 'fruit' || x.category === 'snack' || x.category === 'drink') && !usedIds.has(x.food_id))
        .sort((a, b) => (b.final_score || 0) - (a.final_score || 0));

      const fallbackSnacks = scoredFoods.filter((x) => x.category === 'fruit' || x.category === 'snack');
      const pool = snackCands.length >= 2 ? snackCands : fallbackSnacks;

      pool.slice(0, 2).forEach((itm) => {
        slotItems.push(itm);
        usedIds.add(itm.food_id);
      });
    } else {
      // Main Meal: 1 Staple, 1 Protein Lauk, 1 Sayur
      const stapleCands = scoredFoods
        .filter((x) => x.category === 'staple')
        .sort((a, b) => (b.final_score || 0) - (a.final_score || 0));

      const proteinCands = scoredFoods
        .filter((x) => x.category === 'protein' && !usedIds.has(x.food_id))
        .sort((a, b) => (b.final_score || 0) - (a.final_score || 0));

      const vegCands = scoredFoods
        .filter((x) => x.category === 'vegetable' && !usedIds.has(x.food_id))
        .sort((a, b) => (b.final_score || 0) - (a.final_score || 0));

      // Fallbacks if set empty
      const proteinPool = proteinCands.length ? proteinCands : scoredFoods.filter((x) => x.category === 'protein');
      const vegPool = vegCands.length ? vegCands : scoredFoods.filter((x) => x.category === 'vegetable');

      const stapleIdx = idx % Math.max(1, stapleCands.length);
      const chosenStaple = stapleCands[stapleIdx];
      const chosenProtein = proteinPool[0];
      const chosenVeg = vegPool[0];

      if (chosenStaple) slotItems.push(chosenStaple);
      if (chosenProtein) {
        slotItems.push(chosenProtein);
        usedIds.add(chosenProtein.food_id);
      }
      if (chosenVeg) {
        slotItems.push(chosenVeg);
        usedIds.add(chosenVeg.food_id);
      }
    }

    const slotCals = slotItems.reduce((sum, item) => sum + item.calories, 0);
    const slotProtein = slotItems.reduce((sum, item) => sum + item.protein_g, 0);
    const slotCarbs = slotItems.reduce((sum, item) => sum + item.carbohydrate_g, 0);
    const slotFat = slotItems.reduce((sum, item) => sum + item.fat_g, 0);
    const slotCost = slotItems.reduce((sum, item) => sum + item.price_idr, 0);
    const slotSust = slotItems.map((item) => item.sustainability_score);

    totalRecCalories += slotCals;
    totalRecProtein += slotProtein;
    totalRecCarbs += slotCarbs;
    totalRecFat += slotFat;
    totalRecCost += slotCost;
    totalSustainability.push(...slotSust);

    mealPlan.push({
      slot_id: slot.id,
      slot_name: slot.name,
      description: slot.desc,
      target_calories: slotTargetCals,
      total_calories: slotCals,
      total_protein: Math.round(slotProtein * 10) / 10,
      total_carbs: Math.round(slotCarbs * 10) / 10,
      total_fat: Math.round(slotFat * 10) / 10,
      total_cost: slotCost,
      items: slotItems,
    });
  });

  const avgSust =
    totalSustainability.length > 0
      ? Math.round((totalSustainability.reduce((a, b) => a + b, 0) / totalSustainability.length) * 10) / 10
      : 85;

  const calFulfillment = Math.min(
    100,
    Math.max(0, 100 - (Math.abs(totalRecCalories - nutrition.daily_calories) / nutrition.daily_calories) * 100)
  );

  const protFulfillment = Math.min(
    100,
    Math.max(0, 100 - (Math.abs(totalRecProtein - nutrition.target_protein_g) / nutrition.target_protein_g) * 100)
  );

  let budgetScore = 95;
  if (totalRecCost > profile.daily_food_budget) {
    budgetScore = Math.max(35, 100 - ((totalRecCost - profile.daily_food_budget) / profile.daily_food_budget) * 100);
  }

  const overallScore = Math.round(
    (0.40 * calFulfillment + 0.25 * protFulfillment + 0.15 * budgetScore + 0.20 * avgSust) * 10
  ) / 10;

  return {
    meal_plan: mealPlan,
    summary: {
      total_calories: totalRecCalories,
      total_protein: Math.round(totalRecProtein * 10) / 10,
      total_carbs: Math.round(totalRecCarbs * 10) / 10,
      total_fat: Math.round(totalRecFat * 10) / 10,
      total_cost: totalRecCost,
      budget_diff: profile.daily_food_budget - totalRecCost,
      avg_sustainability: avgSust,
      scores: {
        nutrition_fit: Math.round(calFulfillment * 10) / 10,
        protein_fit: Math.round(protFulfillment * 10) / 10,
        budget_fit: Math.round(budgetScore * 10) / 10,
        sustainability_fit: avgSust,
        overall_score: overallScore,
      },
    },
  };
}
