# NUTRI-OPTIMA (Nutrition Optimization for Workforce)

> **AI-Powered Personalized Nutrition for a Healthier Workforce**  
> *Prototype Sistem Rekomendasi Gizi Presisi Berbasis Kecerdasan Buatan untuk Tenaga Kerja Indonesia — Dikembangkan sebagai Pendukung Lomba Esai Ilmiah.*

---

## 1. Project Overview

**NUTRI-OPTIMA** adalah prototype web application decision-support system berbasis Artificial Intelligence (AI) yang dirancang secara khusus untuk menjawab tantangan gizi tenaga kerja di Indonesia. Sistem ini mengintegrasikan:

1. **Biometrik Individu:** Usia, jenis kelamin, tinggi badan, berat badan, indeks massa tubuh (BMI), dan basal metabolic rate (BMR).
2. **Karakteristik Pekerjaan (Workforce):** Beban kerja fisik (sedentary, light, moderate, heavy physical), jam kerja harian, dan shift kerja (pagi, siang, malam / circadian rhythm).
3. **Pola Hidup & Istirahat:** Aktivitas fisik luar jam kerja dan durasi tidur rata-rata.
4. **Preferensi & Batasan Pangan:** Gizi seimbang, tinggi protein, rendah lemak, vegetarian, serta saringan alergi/pantangan.
5. **Keterjangkauan Nyata (Economic Budget Fit):** Pagu anggaran makan harian dalam Rupiah (IDR).
6. **Prototype Sustainability Score:** Indikator dampak lingkungan berbasis jejak karbon dan efisiensi sumber daya pangan lokal.

---

## 2. Research Concept & Problem Statement

Pekerja di sektor formal maupun informal di Indonesia sering mengalami ketidaksesuaian antara asupan kalori dan beban metabolisme kerja. Kurangnya asupan energi pada pekerja fisik dapat memicu *fatigue* dini dan kecelakaan kerja, sementara kelebihan energi dengan rendah serat pada pekerja kantor memicu obesitas dan sindrom metabolik. Selain itu, pekerja shift malam menghadapi disrupsi ritme sirkadian yang mempengaruhi sekresi insulin dan pencernaan.

**NUTRI-OPTIMA** membuktikan bahwa teknologi AI dan digitalisasi dapat menjembatani ilmu gizi okupasi dengan ketersediaan pangan lokal yang terjangkau bagi tenaga kerja.

---

## 3. Fitur Utama

- **Live Biometric & Energy Calculator:** Menggunakan formula internasional Mifflin-St Jeor dan klasifikasi BMI populasi Asia-Pasifik.
- **Workforce Multiplier Adjustment:** Penyesuaian metabolik terhadap intensitas pekerjaan dan durasi lembur.
- **Circadian Meal Slotting:** Rekomendasi 4 slot waktu makan khusus shift malam (*Pre-Shift*, *Mid-Shift*, *Post-Shift*, *Snack*) dan shift reguler (*Breakfast*, *Lunch*, *Dinner*, *Snack*).
- **AI Content-Based Cosine Similarity:** Pencocokan matematis antara vektor kebutuhan nutrisi pengguna dan profil nutrisi pangan.
- **Multi-Objective Hybrid Ranking:** Algoritma scoring pembobotan gizi, protein, budget, aktivitas, dan sustainability.
- **Indonesian Food Database:** Katalog 50 bahan pangan lokal Indonesia dengan kandungan makronutrien dan estimasi harga pasar riil.
- **Target vs Recommended Comparison Chart:** Visualisasi interaktif pemenuhan kalori, protein, karbohidrat, dan lemak.
- **Try Demo Profile (1-Click):** Tombol siap pakai untuk demonstrasi langsung di hadapan juri lomba esai.

---

## 4. Arsitektur Sistem

```text
User Profile (Biometrik + Pekerjaan + Shift + Budget)
                      ↓
          Nutrition Engine (Mifflin-St Jeor)
                      ↓
            Target Nutrition Vector
                      ↓
       Food Database (Indonesian Local Foods)
                      ↓
     AI Recommendation Engine (Cosine Similarity)
                      ↓
    Multi-Objective Ranking & Meal Slot Optimization
                      ↓
         Personalized Meal Plan & Score Dashboard
```

---

## 5. Metodologi AI & Perhitungan

### A. Perhitungan Kebutuhan Gizi (Mifflin-St Jeor)
- **Laki-laki:** $BMR = 10 \times W + 6.25 \times H - 5 \times A + 5$
- **Perempuan:** $BMR = 10 \times W + 6.25 \times H - 5 \times A - 161$
- **Total Energy (TDEE):** $TDEE = BMR \times (ActivityMultiplier + OccupationAdjustment) \times WorkingHoursFactor$

### B. Vektor Nutrisi & Cosine Similarity
Setiap item makanan direpresentasikan dalam vektor 5 dimensi yang dinormalisasi Min-Max:
$$\vec{v} = [\text{Kalori}, \text{Protein}, \text{Karbohidrat}, \text{Lemak}, \text{Serat}]$$

Kemiripan dihitung menggunakan Cosine Similarity:
$$\text{Cosine Similarity}(\vec{A}, \vec{B}) = \frac{\vec{A} \cdot \vec{B}}{\|\vec{A}\| \|\vec{B}\|}$$

### C. Multi-Objective Scoring Formula
Skor akhir (0–100) dihitung secara tertimbang:
$$\text{Final Score} = 0.40 \times \text{NutritionFit} + 0.20 \times \text{ProteinFit} + 0.15 \times \text{BudgetFit} + 0.10 \times \text{ActivityFit} + 0.15 \times \text{SustainabilityScore}$$

---

## 6. Struktur Direktori Proyek

```text
NUTRI-OPTIMA/
│
├── app.py                          # Flask application backend
├── requirements.txt                # Python dependencies
├── README.md                       # Dokumentasi lengkap
│
├── data/
│   └── food_database.csv           # Katalog pangan lokal Indonesia & harga
│
├── models/
│   └── recommendation_model.pkl    # Serialized pickled model prototype
│
├── utils/
│   ├── nutrition.py                # Formula Mifflin-St Jeor & TDEE
│   ├── recommendation.py           # Cosine similarity & meal slot optimizer
│   └── sustainability.py           # Modul evaluasi sustainability score
│
├── templates/
│   ├── base.html                   # Master layout Bootstrap 5
│   ├── index.html                  # Landing page & pengenalan solusi
│   ├── assessment.html             # Form assessment profil pekerja & demo mode
│   ├── result.html                 # Dashboard hasil analisis & visualisasi
│   └── about.html                  # Konsep ilmiah, metodologi & rumus
│
└── static/
    ├── css/
    │   └── style.css               # Styling custom modern health-tech
    └── js/
        └── script.js               # Interaksi client-side
```

---

## 7. Cara Menjalankan Aplikasi Secara Lokal

### Prasyarat
- Python 3.9+ terpasang di komputer Anda.

### Langkah Instalasi
```bash
# 1. Clone repository
git clone https://github.com/username/NUTRI-OPTIMA.git
cd NUTRI-OPTIMA

# 2. Buat virtual environment (opsional namun direkomendasikan)
python -m venv venv
# Linux/macOS:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# 3. Pasang dependensi
pip install -r requirements.txt

# 4. Jalankan aplikasi Flask
python app.py
```

Buka peramban web dan akses:
```text
http://127.0.0.1:5000
```

---

## 8. Profil Demonstrasi (Demo Profile)

Untuk keperluan penjurian lomba esai, aplikasi dilengkapi preset data instan:
- **Usia:** 25 tahun
- **Jenis Kelamin:** Laki-laki (Male)
- **Berat & Tinggi:** 65 kg / 170 cm (BMI 22.5 - Normal)
- **Jenis Pekerjaan:** Moderate physical work
- **Durasi Kerja:** 8–10 jam
- **Pola Shift:** Night shift (Shift malam)
- **Aktivitas Fisik:** Moderate
- **Pola Tidur:** 6 jam/hari
- **Pola Pangan:** Balanced (Gizi seimbang)
- **Anggaran:** Rp 50.000 / hari

---

## 9. Keterbatasan & Safety Disclaimer

> **PERINGATAN KESELAMATAN & LEGAL:**  
> NUTRI-OPTIMA merupakan prototype edukatif dan decision-support system berbasis data untuk lomba esai ilmiah. Hasil estimasi dan rekomendasi **BUKAN** merupakan diagnosis medis atau terapi klinis. Aplikasi ini tidak menggantikan konsultasi langsung dengan dokter spesialis gizi klinik atau tenaga kesehatan profesional.
