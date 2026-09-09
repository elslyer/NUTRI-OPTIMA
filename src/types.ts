/**
 * NUTRI-OPTIMA — Shared Type Definitions
 */

export type Gender = 'Male' | 'Female';

export type WorkIntensity =
  | 'Sedentary'
  | 'Light'
  | 'Moderate'
  | 'Heavy'
  | 'Very Heavy';

export type WorkingHours =
  | '< 8 hours/day'
  | '8 hours/day'
  | '8–10 hours/day'
  | '10–12 hours/day'
  | '> 12 hours/day';

export type ShiftType =
  | 'Regular Daytime'
  | 'Morning Shift'
  | 'Afternoon Shift'
  | 'Night Shift'
  | 'Rotating Shift';

export type PhysicalActivityLevel =
  | 'Low'
  | 'Light'
  | 'Moderate'
  | 'High'
  | 'Very High';

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
  // Core Workforce Novelty Inputs
  occupation_type: string; // e.g. "Industrial Worker", "Office / Desk Worker"
  work_intensity: WorkIntensity; // "Sedentary" | "Light" | "Moderate" | "Heavy" | "Very Heavy"
  working_hours: WorkingHours; // "8 hours/day", etc.
  shift: ShiftType; // "Night Shift", "Regular Daytime", etc.
  physical_activity: PhysicalActivityLevel; // "Low" | "Moderate", etc.
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

export interface WorkforceImpact {
  occupation: string;
  work_intensity: WorkIntensity;
  working_hours: WorkingHours;
  shift: ShiftType;
  physical_activity: PhysicalActivityLevel;
  occupational_multiplier_pct: number;
  overtime_multiplier_pct: number;
  protein_target_per_kg: number;
  hydration_quota_liters: number;
  circadian_protocol_title: string;
  circadian_protocol_desc: string;
  statement: string;
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
  workforce_impact: WorkforceImpact;
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

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: 'gemini' | 'domain-engine';
}
