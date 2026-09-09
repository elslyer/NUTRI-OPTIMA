"""
NUTRI-OPTIMA (Nutrition Optimization for Workforce)
Main Flask Application
Prototype pendukung lomba esai: Sistem Rekomendasi Gizi Berbasis AI untuk Tenaga Kerja.
"""

import os
from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from utils.nutrition import calculate_nutrition_requirements
from utils.recommendation import recommend_meals, load_food_database_rows
from utils.sustainability import get_sustainability_rating

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "nutri-optima-prototype-secret-key-2026")

DEMO_PROFILE = {
    "age": 25,
    "gender": "Male",
    "weight_kg": 65.0,
    "height_cm": 170.0,
    "occupation_type": "Moderate physical work",
    "working_hours": "8–10 jam",
    "shift": "Night",
    "physical_activity": "Moderate",
    "average_sleep_hours": 6.0,
    "daily_food_budget": 50000.0,
    "food_preference": "Balanced",
    "avoided_foods": ""
}

@app.route("/")
def index():
    """Halaman Utama / Landing Page."""
    return render_template("index.html")

@app.route("/assessment")
def assessment():
    """Formulir Pengisian Profil Tenaga Kerja."""
    is_demo = request.args.get("demo", "0") == "1"
    initial_data = DEMO_PROFILE if is_demo else {}
    return render_template("assessment.html", initial_data=initial_data, is_demo=is_demo)

@app.route("/analyze", methods=["POST"])
def analyze():
    """Memproses input pengguna, menghitung kebutuhan gizi, dan menjalankan rekomendasi AI."""
    try:
        user_profile = {
            "age": int(request.form.get("age", 25)),
            "gender": request.form.get("gender", "Male"),
            "weight_kg": float(request.form.get("weight_kg", 65.0)),
            "height_cm": float(request.form.get("height_cm", 170.0)),
            "occupation_type": request.form.get("occupation_type", "Moderate physical work"),
            "working_hours": request.form.get("working_hours", "8–10 jam"),
            "shift": request.form.get("shift", "Regular daytime"),
            "physical_activity": request.form.get("physical_activity", "Moderate"),
            "average_sleep_hours": float(request.form.get("average_sleep_hours", 7.0)),
            "food_preference": request.form.get("food_preference", "Balanced"),
            "avoided_foods": request.form.get("avoided_foods", "").strip(),
            "daily_food_budget": float(request.form.get("daily_food_budget", 50000.0))
        }

        # 1. Hitung kebutuhan nutrisi
        nutrition_target = calculate_nutrition_requirements(
            age=user_profile["age"],
            gender=user_profile["gender"],
            weight_kg=user_profile["weight_kg"],
            height_cm=user_profile["height_cm"],
            occupation_type=user_profile["occupation_type"],
            working_hours=user_profile["working_hours"],
            shift=user_profile["shift"],
            physical_activity=user_profile["physical_activity"],
            average_sleep_hours=user_profile["average_sleep_hours"],
            food_preference=user_profile["food_preference"],
            daily_food_budget=user_profile["daily_food_budget"]
        )

        # 2. Rekomendasi Menu dengan AI Engine
        recommendation_result = recommend_meals(user_profile, nutrition_target)

        # 3. Simpan di sesi
        session["user_profile"] = user_profile
        session["nutrition_target"] = nutrition_target
        session["recommendation_result"] = recommendation_result

        return redirect(url_for("result"))
    except Exception as e:
        return f"Terjadi kesalahan dalam pemrosesan data: {str(e)}", 400

@app.route("/result")
def result():
    """Halaman Hasil Analisis Gizi & Menu Rekomendasi."""
    user_profile = session.get("user_profile")
    nutrition_target = session.get("nutrition_target")
    recommendation_result = session.get("recommendation_result")

    if not user_profile or not nutrition_target or not recommendation_result:
        # Fallback ke demo profile jika diakses langsung
        nutrition_target = calculate_nutrition_requirements(
            age=DEMO_PROFILE["age"],
            gender=DEMO_PROFILE["gender"],
            weight_kg=DEMO_PROFILE["weight_kg"],
            height_cm=DEMO_PROFILE["height_cm"],
            occupation_type=DEMO_PROFILE["occupation_type"],
            working_hours=DEMO_PROFILE["working_hours"],
            shift=DEMO_PROFILE["shift"],
            physical_activity=DEMO_PROFILE["physical_activity"],
            average_sleep_hours=DEMO_PROFILE["average_sleep_hours"],
            food_preference=DEMO_PROFILE["food_preference"],
            daily_food_budget=DEMO_PROFILE["daily_food_budget"]
        )
        recommendation_result = recommend_meals(DEMO_PROFILE, nutrition_target)
        user_profile = DEMO_PROFILE

    sust_rating = get_sustainability_rating(recommendation_result["summary"]["avg_sustainability"])

    return render_template(
        "result.html",
        user_profile=user_profile,
        nutrition_target=nutrition_target,
        recommendation=recommendation_result,
        sust_rating=sust_rating
    )

@app.route("/about")
def about():
    """Halaman Konsep Penelitian, Metodologi Ilmiah & Disclaimer."""
    return render_template("about.html")

@app.route("/api/demo-profile")
def api_demo():
    """API endpoint untuk mengambil demo profile."""
    return jsonify(DEMO_PROFILE)

@app.route("/api/food-database")
def api_food_database():
    """API endpoint untuk melihat dataset pangan prototype."""
    foods = load_food_database_rows()
    return jsonify({"total": len(foods), "foods": foods})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
