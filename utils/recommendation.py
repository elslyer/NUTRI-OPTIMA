"""
NUTRI-OPTIMA — Recommendation Engine Module
Hybrid Recommendation System:
1. Content-Based Filtering menggunakan Cosine Similarity antara Target Nutrisi & Profil Makanan.
2. Multi-Objective Scoring:
   Final Score = (0.40 * Nutrition Fit) + (0.20 * Protein Fit) + (0.15 * Budget Fit) + (0.10 * Activity Fit) + (0.15 * Sustainability Score)
3. Combinatorial Meal Allocation: Memadukan Makanan Pokok (Staple) + Lauk Protein + Sayur / Serat + Camilan Sehat.
"""

import os
import csv
import math

def load_food_database_rows(csv_path: str = None) -> list:
    """Memuat database makanan dari CSV ke list of dicts."""
    if csv_path is None:
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        csv_path = os.path.join(base_dir, "data", "food_database.csv")
    
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Database makanan tidak ditemukan di {csv_path}")
    
    rows = []
    with open(csv_path, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append({
                "food_id": int(row["food_id"]),
                "food_name": row["food_name"],
                "category": row.get("category", "protein"),
                "meal_type": row["meal_type"],
                "calories": float(row["calories"]),
                "protein_g": float(row["protein_g"]),
                "carbohydrate_g": float(row["carbohydrate_g"]),
                "fat_g": float(row["fat_g"]),
                "fiber_g": float(row["fiber_g"]),
                "price_idr": float(row["price_idr"]),
                "sustainability_score": float(row["sustainability_score"]),
                "vegetarian": str(row["vegetarian"]).lower() in ["true", "1", "yes"],
                "high_protein": str(row["high_protein"]).lower() in ["true", "1", "yes"]
            })
    return rows


def pure_cosine_similarity(vec_a: list, vec_b: list) -> float:
    """Menghitung Cosine Similarity secara matematis."""
    dot_product = sum(a * b for a, b in zip(vec_a, vec_b))
    norm_a = math.sqrt(sum(a * a for a in vec_a))
    norm_b = math.sqrt(sum(b * b for b in vec_b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot_product / (norm_a * norm_b)


def recommend_meals(user_profile: dict, nutrition_target: dict, csv_path: str = None) -> dict:
    """
    Menghasilkan rekomendasi menu makanan harian lengkap dengan AI scoring.
    """
    foods = load_food_database_rows(csv_path)
    
    # 1. Filter preferensi dan pantangan
    pref = str(user_profile.get("food_preference", "Balanced")).lower()
    avoided_raw = str(user_profile.get("avoided_foods", ""))
    avoided_items = [x.strip().lower() for x in avoided_raw.split(",") if x.strip()]
    
    filtered_foods = []
    for f in foods:
        if "vegetarian" in pref and not f["vegetarian"]:
            continue
        name_lower = f["food_name"].lower()
        if any(av in name_lower for av in avoided_items):
            continue
        filtered_foods.append(f)
        
    if not filtered_foods:
        filtered_foods = foods

    # 2. Min-Max normalisasi vektor nutrisi
    features = ["calories", "protein_g", "carbohydrate_g", "fat_g", "fiber_g"]
    min_vals = {feat: min(f[feat] for f in filtered_foods) for feat in features}
    max_vals = {feat: max(f[feat] for f in filtered_foods) for feat in features}

    def normalize(val, feat):
        spread = max_vals[feat] - min_vals[feat]
        if spread == 0:
            return 0.5
        return (val - min_vals[feat]) / spread

    target_slot_raw = {
        "calories": nutrition_target["daily_calories"] / 3.2,
        "protein_g": nutrition_target["target_protein_g"] / 3.2,
        "carbohydrate_g": nutrition_target["target_carb_g"] / 3.2,
        "fat_g": nutrition_target["target_fat_g"] / 3.2,
        "fiber_g": nutrition_target["target_fiber_g"] / 3.2
    }
    target_vec = [min(1.0, max(0.0, normalize(target_slot_raw[feat], feat))) for feat in features]

    # 3. Hitung Multi-Objective Score untuk tiap makanan
    daily_budget = float(user_profile.get("daily_food_budget", 50000))
    budget_per_item = daily_budget / 8.0
    occ = str(user_profile.get("occupation_type", "")).lower()

    scored_foods = []
    for f in filtered_foods:
        food_vec = [normalize(f[feat], feat) for feat in features]
        cos_sim = pure_cosine_similarity(target_vec, food_vec)
        nutrition_fit = max(0.0, min(100.0, cos_sim * 100.0))

        prot_density = f["protein_g"] / max(1.0, (f["calories"] / 20.0))
        protein_fit = min(100.0, prot_density * 40.0)

        if f["price_idr"] <= budget_per_item:
            budget_fit = 100.0
        else:
            budget_fit = max(10.0, 100.0 - ((f["price_idr"] - budget_per_item) / budget_per_item) * 60.0)

        if "heavy" in occ or "berat" in occ:
            activity_fit = min(100.0, (f["calories"] / 200.0) * 70.0 + (f["carbohydrate_g"] / 30.0) * 30.0)
        elif "moderate" in occ or "sedang" in occ:
            activity_fit = min(100.0, (f["calories"] / 160.0) * 60.0 + (f["protein_g"] / 15.0) * 40.0)
        else:
            activity_fit = min(100.0, (f["fiber_g"] / 4.0) * 60.0 + max(0.0, 100.0 - (f["fat_g"] / 12.0) * 40.0))

        sustainability_fit = f["sustainability_score"]

        final_score = (
            0.40 * nutrition_fit +
            0.20 * protein_fit +
            0.15 * budget_fit +
            0.10 * activity_fit +
            0.15 * sustainability_fit
        )
        
        f_scored = dict(f)
        f_scored["cosine_sim"] = round(cos_sim, 3)
        f_scored["final_score"] = round(final_score, 1)
        scored_foods.append(f_scored)

    # 4. Susun Menu Harian: Komposisi Seimbang
    # Memadukan Staple + Protein + Sayur untuk slot utama, dan Buah/Snack untuk slot camilan
    meal_slots = nutrition_target["meal_slots"]
    meal_plan = []

    total_rec_calories = 0
    total_rec_protein = 0
    total_rec_carb = 0
    total_rec_fat = 0
    total_rec_cost = 0
    total_sustainability = []
    used_ids = set()

    for idx, slot in enumerate(meal_slots):
        slot_id = slot["id"]
        slot_name = slot["name"]
        slot_target_cals = nutrition_target["daily_calories"] * slot["target_pct"]
        slot_items = []

        if slot_id == "snack":
            snack_candidates = [x for x in scored_foods if x["category"] in ["fruit", "snack", "drink"] and x["food_id"] not in used_ids]
            if not snack_candidates:
                snack_candidates = [x for x in scored_foods if x["category"] in ["fruit", "snack", "drink"]]
            snack_sorted = sorted(snack_candidates, key=lambda x: x["final_score"], reverse=True)
            for itm in snack_sorted[:2]:
                slot_items.append(itm)
                used_ids.add(itm["food_id"])
        else:
            # Main meal: Pilih 1 Staple, 1 Protein Lauk, 1 Sayur
            staple_cands = [x for x in scored_foods if x["category"] == "staple"]
            protein_cands = [x for x in scored_foods if x["category"] == "protein" and x["food_id"] not in used_ids]
            if not protein_cands:
                protein_cands = [x for x in scored_foods if x["category"] == "protein"]
            veg_cands = [x for x in scored_foods if x["category"] == "vegetable" and x["food_id"] not in used_ids]
            if not veg_cands:
                veg_cands = [x for x in scored_foods if x["category"] == "vegetable"]

            staple_sorted = sorted(staple_cands, key=lambda x: x["final_score"], reverse=True)
            protein_sorted = sorted(protein_cands, key=lambda x: x["final_score"], reverse=True)
            veg_sorted = sorted(veg_cands, key=lambda x: x["final_score"], reverse=True)

            # Pilih staple sesuai variasi per slot
            staple_idx = idx % len(staple_sorted)
            chosen_staple = staple_sorted[staple_idx] if staple_sorted else None
            chosen_protein = protein_sorted[0] if protein_sorted else None
            chosen_veg = veg_sorted[0] if veg_sorted else None

            if chosen_staple:
                slot_items.append(chosen_staple)
            if chosen_protein:
                slot_items.append(chosen_protein)
                used_ids.add(chosen_protein["food_id"])
            if chosen_veg:
                slot_items.append(chosen_veg)
                used_ids.add(chosen_veg["food_id"])

        slot_cals = sum(x["calories"] for x in slot_items)
        slot_protein = sum(x["protein_g"] for x in slot_items)
        slot_carb = sum(x["carbohydrate_g"] for x in slot_items)
        slot_fat = sum(x["fat_g"] for x in slot_items)
        slot_cost = sum(x["price_idr"] for x in slot_items)
        slot_sust = [x["sustainability_score"] for x in slot_items]

        total_rec_calories += slot_cals
        total_rec_protein += slot_protein
        total_rec_carb += slot_carb
        total_rec_fat += slot_fat
        total_rec_cost += slot_cost
        total_sustainability.extend(slot_sust)

        meal_plan.append({
            "slot_id": slot_id,
            "slot_name": slot_name,
            "description": slot["desc"],
            "target_calories": round(slot_target_cals, 0),
            "total_calories": round(slot_cals, 0),
            "total_protein": round(slot_protein, 1),
            "total_carbs": round(slot_carb, 1),
            "total_fat": round(slot_fat, 1),
            "total_cost": int(slot_cost),
            "items": slot_items
        })

    avg_sust = round(sum(total_sustainability) / max(1, len(total_sustainability)), 1)
    cal_fulfillment = min(100.0, max(0.0, 100.0 - abs(total_rec_calories - nutrition_target["daily_calories"]) / nutrition_target["daily_calories"] * 100.0))
    prot_fulfillment = min(100.0, max(0.0, 100.0 - abs(total_rec_protein - nutrition_target["target_protein_g"]) / nutrition_target["target_protein_g"] * 100.0))

    if total_rec_cost <= daily_budget:
        budget_score = 95.0
    else:
        budget_score = max(35.0, 100.0 - ((total_rec_cost - daily_budget) / daily_budget) * 100.0)

    overall_score = round(
        0.40 * cal_fulfillment +
        0.25 * prot_fulfillment +
        0.15 * budget_score +
        0.20 * avg_sust,
        1
    )

    return {
        "meal_plan": meal_plan,
        "summary": {
            "total_calories": round(total_rec_calories, 0),
            "total_protein": round(total_rec_protein, 1),
            "total_carbs": round(total_rec_carb, 1),
            "total_fat": round(total_rec_fat, 1),
            "total_cost": int(total_rec_cost),
            "budget_diff": int(daily_budget - total_rec_cost),
            "avg_sustainability": avg_sust,
            "scores": {
                "nutrition_fit": round(cal_fulfillment, 1),
                "protein_fit": round(prot_fulfillment, 1),
                "budget_fit": round(budget_score, 1),
                "sustainability_fit": avg_sust,
                "overall_score": overall_score
            }
        }
    }


# Alias for compatibility
generate_recommendations = recommend_meals

