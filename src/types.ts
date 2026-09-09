/**
 * NUTRI-OPTIMA — Shared Type Definitions
 */

export type Gender = 'Male' | 'Female';

export type OccupationType =
  | 'Sedentary / pekerjaan kantor'
  | 'Light physical work'
  | 'Moderate physical work'
  | 'Heavy physical work';

export type WorkingHours = '< 6 jam' | '6–8 jam' | '8–10 jam' | '> 10 jam';

export type ShiftType = 'Morning' | 'Afternoon' | 'Night' | 'Regular daytime';

export type PhysicalActivityLevel = 'Low' | 'Light' | 'Moderate' | 'High' | 'Very High';

export type FoodPreference =
  | 'Balanced'
  | 'High protein'
  | 'Low fat'
  | 'Vegetarian'
  | 'No restriction';

export type FoodCategory = 'staple' | 'protein' | 'vegetable' | 'fruit' | 'snack' | 'drink';

export interface UserProfile {
  age: number;
  gender: Gender;
  weight_kg: number;
  height_cm: number;
  occupation_type: OccupationType;
  working_hours: WorkingHours;
  shift: ShiftType;
  physical_activity: PhysicalActivityLevel;
  average_sleep_hours: number;
  food_preference: FoodPreference;
  avoided_foods: string;
  daily_food_budget: number;
}

export interface MealSlotConfig {
  id: string;
  name: string;
  target_pct: number;
  desc: string;
}

export interface NutritionRequirements {
  bmi: number;
  bmi_category: string;
  bmi_status: 'success' | 'warning' | 'danger';
  bmr: number;
  activity_multiplier: number;
  daily_calories: number;
  target_protein_g: number;
  target_carb_g: number;
  target_fat_g: number;
  target_fiber_g: number;
  is_night_shift: boolean;
  meal_slots: MealSlotConfig[];
  daily_budget: number;
}

export interface FoodItem {
  food_id: number;
  food_name: string;
  category: FoodCategory;
  meal_type: string;
  calories: number;
  protein_g: number;
  carbohydrate_g: number;
  fat_g: number;
  fiber_g: number;
  price_idr: number;
  sustainability_score: number;
  vegetarian: boolean;
  high_protein: boolean;
  cosine_sim?: number;
  final_score?: number;
}

export interface MealSlotResult {
  slot_id: string;
  slot_name: string;
  description: string;
  target_calories: number;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  total_cost: number;
  items: FoodItem[];
}

export interface ScoringBreakdown {
  nutrition_fit: number;
  protein_fit: number;
  budget_fit: number;
  sustainability_fit: number;
  overall_score: number;
}

export interface RecommendationSummary {
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  total_cost: number;
  budget_diff: number;
  avg_sustainability: number;
  scores: ScoringBreakdown;
}

export interface RecommendationResult {
  meal_plan: MealSlotResult[];
  summary: RecommendationSummary;
}
