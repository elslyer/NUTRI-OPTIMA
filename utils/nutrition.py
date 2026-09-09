"""
NUTRI-OPTIMA — Nutrition Engine Module
Perhitungan kebutuhan energi dan makronutrien berbasis sains:
1. Indeks Massa Tubuh (BMI) — Standar WHO & Kemenkes RI
2. Basal Metabolic Rate (BMR) — Formula Mifflin-St Jeor
3. Total Daily Energy Expenditure (TDEE) dengan Multiplier Aktivitas & Beban Kerja (Workforce Adjustment)
4. Distribusi Makronutrien (Protein, Karbohidrat, Lemak, Serat) yang Dipersonalisasi
"""

def calculate_bmi(weight_kg: float, height_cm: float) -> dict:
    """Menghitung Body Mass Index (BMI) dan klasifikasinya."""
    height_m = height_cm / 100.0
    bmi = weight_kg / (height_m ** 2)
    bmi = round(bmi, 1)

    if bmi < 18.5:
        category = "Underweight (Kekurangan berat badan)"
        status = "warning"
    elif 18.5 <= bmi <= 22.9:
        category = "Normal (Asia-Pasifik)"
        status = "success"
    elif 23.0 <= bmi <= 24.9:
        category = "Overweight / Berisiko"
        status = "warning"
    elif 25.0 <= bmi <= 29.9:
        category = "Obesitas Tingkat I"
        status = "danger"
    else:
        category = "Obesitas Tingkat II"
        status = "danger"

    return {
        "bmi": bmi,
        "category": category,
        "status": status
    }


def calculate_bmr(weight_kg: float, height_cm: float, age: int, gender: str) -> float:
    """
    Menghitung Basal Metabolic Rate (BMR) menggunakan formula Mifflin-St Jeor.
    Pria: 10W + 6.25H - 5A + 5
    Wanita: 10W + 6.25H - 5A - 161
    """
    gender_lower = gender.lower().strip()
    if gender_lower in ["male", "pria", "laki-laki", "l"]:
        bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5
    else:
        bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161
    return round(bmr, 0)


def get_activity_multiplier(activity_level: str) -> float:
    """Multiplier faktor aktivitas fisik umum."""
    act = activity_level.lower().strip()
    mapping = {
        "low": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "high": 1.725,
        "very high": 1.9,
        "sangat rendah": 1.2,
        "ringan": 1.375,
        "sedang": 1.55,
        "tinggi": 1.725,
        "sangat tinggi": 1.9
    }
    return mapping.get(act, 1.375)


def get_occupation_adjustment(occupation_type: str) -> float:
    """
    Penyesuaian spesifik karakteristik pekerjaan tenaga kerja (Workforce Specific Multiplier).
    """
    occ = occupation_type.lower()
    if "heavy" in occ or "berat" in occ:
        return 0.30
    elif "moderate" in occ or "sedang" in occ:
        return 0.15
    elif "light" in occ or "ringan" in occ:
        return 0.05
    else:  # Sedentary / kantor
        return 0.00


def get_working_hours_factor(working_hours: str) -> float:
    """Penyesuaian durasi kerja terhadap pengeluaran energi harian."""
    wh = str(working_hours).strip()
    if "> 10" in wh or "lebih dari 10" in wh:
        return 1.10  # +10% beban metabolik
    elif "8" in wh and "10" in wh:
        return 1.05  # +5% beban metabolik
    else:
        return 1.00


def calculate_nutrition_requirements(
    age: int = 25,
    gender: str = "Male",
    weight_kg: float = 65.0,
    height_cm: float = 170.0,
    occupation_type: str = "Moderate physical work",
    working_hours: str = "8–10 jam",
    shift: str = "Night",
    physical_activity: str = "Moderate",
    average_sleep_hours: float = 6.0,
    food_preference: str = "Balanced",
    daily_food_budget: float = 50000.0,
    **kwargs
) -> dict:
    """
    Menghitung profil nutrisi lengkap yang dipersonalisasi untuk tenaga kerja.
    Mendukung pemanggilan langsung dengan argumen atau dictionary profil tunggal.
    """
    if isinstance(age, dict):
        p = age
        age = p.get("age", 25)
        gender = p.get("gender", "Male")
        weight_kg = float(p.get("weight_kg", 65.0))
        height_cm = float(p.get("height_cm", 170.0))
        occupation_type = p.get("occupation_type", "Moderate physical work")
        working_hours = p.get("working_hours", "8–10 jam")
        shift = p.get("shift", "Night")
        physical_activity = p.get("physical_activity", "Moderate")
        average_sleep_hours = float(p.get("average_sleep_hours", 6.0))
        food_preference = p.get("food_preference", "Balanced")
        daily_food_budget = float(p.get("daily_food_budget", 50000.0))
    bmi_info = calculate_bmi(weight_kg, height_cm)
    bmr = calculate_bmr(weight_kg, height_cm, age, gender)

    base_activity = get_activity_multiplier(physical_activity)
    occ_adj = get_occupation_adjustment(occupation_type)
    total_activity_multiplier = round(base_activity + occ_adj, 3)

    work_hours_factor = get_working_hours_factor(working_hours)

    # Total Daily Energy Requirement (TDEE)
    tdee = bmr * total_activity_multiplier * work_hours_factor

    # Penyesuaian sedikit jika kurang tidur kronis (<6 jam) untuk regulasi glukosa & satiety
    if average_sleep_hours < 6:
        # Kurang tidur meningkatkan ghrelin dan pengeluaran energi basal defensif
        tdee_adjusted = tdee * 1.03
    else:
        tdee_adjusted = tdee

    daily_calories = round(tdee_adjusted, 0)

    # Perhitungan target Protein (g/kg BB disesuaikan dengan jenis pekerjaan)
    occ_lower = occupation_type.lower()
    if "heavy" in occ_lower:
        protein_per_kg = 1.8  # Pembentukan & perbaikan jaringan otot berat
    elif "moderate" in occ_lower:
        protein_per_kg = 1.5
    elif "light" in occ_lower:
        protein_per_kg = 1.3
    else:
        protein_per_kg = 1.2  # Sedentary

    # Jika preferensi high protein
    pref_lower = food_preference.lower()
    if "high protein" in pref_lower or "tinggi protein" in pref_lower:
        protein_per_kg = max(protein_per_kg, 1.8)

    target_protein_g = round(weight_kg * protein_per_kg, 1)
    protein_calories = target_protein_g * 4

    # Perhitungan target Lemak (20% - 30% dari total kalori harian)
    if "low fat" in pref_lower or "rendah lemak" in pref_lower:
        fat_pct = 0.20
    elif "heavy" in occ_lower:
        fat_pct = 0.28
    else:
        fat_pct = 0.25

    target_fat_calories = daily_calories * fat_pct
    target_fat_g = round(target_fat_calories / 9, 1)

    # Perhitungan target Karbohidrat (Sisa kalori setelah protein dan lemak)
    carb_calories = daily_calories - protein_calories - target_fat_calories
    if carb_calories < 0:
        carb_calories = daily_calories * 0.45
    target_carb_g = round(carb_calories / 4, 1)

    # Target Serat (Fiber)
    fiber_target_g = 30.0 if daily_calories >= 2200 else 25.0

    # Jadwal Pola Makan (Shift Work Circadian Adjustment)
    is_night_shift = "night" in shift.lower() or "malam" in shift.lower()

    if is_night_shift:
        meal_slots = [
            {"id": "pre_shift", "name": "Pre-Shift Meal (17:00–19:00)", "target_pct": 0.35, "desc": "Karbohidrat kompleks & protein untuk pelepasan energi stabil"},
            {"id": "mid_shift", "name": "Mid-Shift Meal (23:00–01:00)", "target_pct": 0.30, "desc": "Nutrisi mudah dicerna, rendah lemak jenuh agar tidak memicu kantuk"},
            {"id": "post_shift", "name": "Post-Shift Meal (06:00–07:30)", "target_pct": 0.20, "desc": "Pemulihan otot ringan dan mendukung kualitas tidur pagi"},
            {"id": "snack", "name": "Shift Snack / Pengganjal", "target_pct": 0.15, "desc": "Camilan bernutrisi tinggi & hidrasi elektrolit"}
        ]
    else:
        meal_slots = [
            {"id": "breakfast", "name": "Sarapan Sehat (Breakfast)", "target_pct": 0.25, "desc": "Awali hari dengan protein dan serat untuk fokus kerja"},
            {"id": "lunch", "name": "Makan Siang (Lunch)", "target_pct": 0.35, "desc": "Menu utama penyuplai energi kerja di tengah aktivitas"},
            {"id": "dinner", "name": "Makan Malam (Dinner)", "target_pct": 0.25, "desc": "Nutrisi seimbang untuk pemulihan fisik tanpa membebani pencernaan"},
            {"id": "snack", "name": "Snack Sore / Camilan", "target_pct": 0.15, "desc": "Camilan buah/kacang sehat pencegah penurunan energi sore"}
        ]

    return {
        "bmi": bmi_info["bmi"],
        "bmi_category": bmi_info["category"],
        "bmi_status": bmi_info["status"],
        "bmr": bmr,
        "activity_multiplier": total_activity_multiplier,
        "daily_calories": daily_calories,
        "target_protein_g": target_protein_g,
        "target_carb_g": target_carb_g,
        "target_fat_g": target_fat_g,
        "target_fiber_g": fiber_target_g,
        "is_night_shift": is_night_shift,
        "meal_slots": meal_slots,
        "daily_budget": daily_food_budget
    }
