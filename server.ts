import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { INITIAL_FOOD_DATABASE } from "./src/data/foodDatabase";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Food database endpoint
  app.get("/api/food-database", (req, res) => {
    res.json({
      total: INITIAL_FOOD_DATABASE.length,
      foods: INITIAL_FOOD_DATABASE,
    });
  });

  // Demo profile endpoint
  app.get("/api/demo-profile", (req, res) => {
    res.json({
      age: 26,
      gender: "Male",
      weight_kg: 68,
      height_cm: 172,
      occupation_type: "Light physical work",
      working_hours: "8-10 jam (Lembur moderat)",
      shift: "Regular daytime",
      physical_activity: "Aktivitas Sedang",
      average_sleep_hours: 7,
      food_preference: "Balanced",
      avoided_foods: "",
      daily_food_budget: 45000,
    });
  });

  // AI Workforce Nutrition Consultant endpoint
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, userProfile, nutrition, recommendation } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Pesan tidak boleh kosong." });
      }

      const client = getGeminiClient();

      const profileSummary = userProfile
        ? `Profil Tenaga Kerja:
- Usia: ${userProfile.age} tahun, Jenis Kelamin: ${userProfile.gender}
- Berat: ${userProfile.weight_kg} kg, Tinggi: ${userProfile.height_cm} cm
- Beban Okupasi: ${userProfile.occupation_type}
- Durasi Jam Kerja: ${userProfile.working_hours}
- Pola Shift: ${userProfile.shift}
- Tingkat Aktivitas Luar Kerja: ${userProfile.physical_activity}
- Durasi Tidur Rata-rata: ${userProfile.average_sleep_hours} jam
- Preferensi Makanan: ${userProfile.food_preference}
- Makanan Dihindari / Alergi: ${userProfile.avoided_foods || "Tidak ada"}
- Budget Makanan Harian: Rp ${userProfile.daily_food_budget?.toLocaleString("id-ID")}`
        : "Profil Pengguna: Belum diisi (gunakan parameter umum pekerja Indonesia)";

      const nutritionSummary = nutrition
        ? `Target Gizi Presisi:
- BMR: ${nutrition.bmr} kkal
- TDEE / Target Kalori Harian: ${nutrition.daily_calories} kkal
- Target Protein: ${nutrition.target_protein_g} gram
- Target Karbohidrat: ${nutrition.target_carb_g} gram
- Target Lemak Sehat: ${nutrition.target_fat_g} gram
- Target Serat: ${nutrition.target_fiber_g} gram
- Status IMT: ${nutrition.bmi} kg/m² (${nutrition.bmi_category})`
        : "";

      const systemInstruction = `Anda adalah "NUTRI-AI", asisten kecerdasan buatan spesialis gizi okupasi dan kesehatan tenaga kerja Indonesia dari platform NUTRI-OPTIMA ("Nourishing the Workforce").

PRINSIP RESPONSIBILITAS & KELUWESAN ADAPTIF:
1. Responsible & Helpful AI:
   - Jika pengguna menanyakan hal-hal yang berada di luar konteks gizi kerja murni (seperti stres kerja, burnout mental, ergonomi meja kantor, sakit kepala/pegal, manajemen waktu kerja, tips tidur, kebiasaan kopi, olahraga kardio, suplemen, atau topik umum lainnya):
   - JANGAN PERNAH menolak, menepis, atau berkata kaku seperti "saya hanya asisten gizi".
   - JAWABLAH DENGAN LENGKAP, EMPATIK, DAN SOLUTIF sesuai pertanyaan pengguna.
   - Setelah memberikan jawaban yang solutif, hubungkan secara bijak dan elegan dengan aspek stamina fisik, hidrasi, ritme sirkadian kerja, dan pemulihan nutrisi harian pengguna.
2. Pilar Workforce-Aware Nutrition:
   - Selalu pertimbangkan karakteristik kerja pengguna: Jenis Pekerjaan (${userProfile?.occupation_type || 'Industrial Worker'}), Intensitas (${userProfile?.work_intensity || 'Moderate'}), Jam Kerja (${userProfile?.working_hours || '8 hours/day'}), dan Shift (${userProfile?.shift || 'Night Shift'}).
   - Prioritaskan bahan pangan lokal Indonesia yang terjangkau, bergizi, dan mudah didapat (tempe, tahu, telur, ikan kembung, bayam, pisang, dll).
3. Gaya Penulisan:
   - Bersahabat, profesional, terstruktur rapi dengan Markdown (bullet points, bolding).
   - Selalu sertakan catatan etika medis profesional jika ada keluhan klinis berat.

Informasi Biometrik & Okupasi Pekerja Saat Ini:
${profileSummary}
${nutritionSummary}`;

      if (client) {
        // Multi-model resilience: try primary model, then lite/latest if temporary 503 high-demand occurs
        const candidateModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
        for (const modelName of candidateModels) {
          try {
            const response = await client.models.generateContent({
              model: modelName,
              contents: message,
              config: {
                systemInstruction,
                temperature: 0.7,
              },
            });

            const replyText = response.text || "Mohon maaf, tidak ada respon yang dapat dihasilkan.";
            return res.json({ reply: replyText, source: "gemini" });
          } catch (modelError: any) {
            // If temporary 503 (high demand) or 429/timeout, gracefully try the next model candidate
            const statusCode = modelError?.status || modelError?.statusCode || modelError?.error?.code;
            console.log(`Model ${modelName} unavailable (status ${statusCode}), trying fallback...`);
          }
        }
        console.log("Remote models busy, engaging intelligent domain nutrition engine.");
      }

      // Contextual Fallback response when GEMINI_API_KEY is not configured
      const lower = message.toLowerCase();
      let fallbackReply = "";

      if (lower.includes("stres") || lower.includes("stress") || lower.includes("burnout") || lower.includes("mental") || lower.includes("lelah batin") || lower.includes("capek pikiran")) {
        fallbackReply = `### 🧠 Manajemen Stres & Pencegahan Burnout Tenaga Kerja
Menjaga kesehatan mental dan fisik di tempat kerja adalah bagian tak terpisahkan dari produktivitas yang berkelanjutan:

1. **Teknik 'Micro-Breaks' & Latihan Pernapasan**:
   - Terapkan teknik pernapasan 4-7-8 (tarik napas 4 detik, tahan 7 detik, hembuskan 8 detik) saat merasakan lonjakan stres atau tekanan kerja tinggi.
   - Ambil jeda 2–3 menit setiap 90 menit bekerja untuk mengalihkan pandangan dari layar atau mesin produksi.

2. **Dukungan Nutrisi Penstabil Neurotransmiter**:
   - **Magnesium & Vitamin B Kompleks**: Membantu menurunkan produksi kortisol berlebih. Sumber lokal terbaik: pisang, kacang hijau, tempe, dan bayam.
   - **Hindari 'Emotional Eating' Makanan Manis**: Lonjakan gula darah dari camilan manis sesaat akan memicu *crash* energi yang memperparah kecemasan.

3. **Korelasinya dengan Profil Anda**:
   - Dengan beban kerja **${userProfile?.occupation_type || 'Industrial Worker'}** (${userProfile?.working_hours || '8 jam/hari'}), pastikan waktu istirahat tidur Anda tidak terkompromi (minimal 6–7 jam berkualitas).`;
      } else if (lower.includes("sakit kepala") || lower.includes("pusing") || lower.includes("migrain") || lower.includes("pegal") || lower.includes("leher") || lower.includes("punggung")) {
        fallbackReply = `### 🩺 Penanganan Sakit Kepala & Pegal Otot Saat Bekerja
Keluhan fisik seperti sakit kepala tegang (*tension headache*) atau pegal leher sering dialami pekerja akibat beban postur atau dehidrasi:

1. **Evaluasi Dehidrasi Dini**:
   - Lebih dari 60% sakit kepala ringan di tempat kerja dipicu oleh dehidrasi terselubung. Minum 1–2 gelas air putih bersuhu ruang segera.
2. **Peregangan Ergonomis Sederhana**:
   - Lakukan peregangan leher (*chin tuck*), putar bahu ke belakang 10 kali, dan regangkan pergelangan tangan untuk meredakan ketegangan vaskular.
3. **Pemberian Asupan Elektrolit Ringan**:
   - Konsumsi buah segar seperti pisang atau air kelapa yang kaya kalium untuk menyeimbangkan tonus otot.
4. **Catatan Keselamatan**:
   - Jika sakit kepala terasa sangat hebat mendadak, disertai pandangan kabur atau kebas separuh badan, segera istirahat dan periksakan diri ke poliklinik perusahaan atau fasilitas kesehatan terdekat.`;
      } else if (lower.includes("olahraga") || lower.includes("workout") || lower.includes("gym") || lower.includes("kardio") || lower.includes("lari")) {
        fallbackReply = `### 🏃 Strategi Olahraga Efektif di Tengah Kesibukan Kerja
Untuk pekerja dengan aktivitas **${userProfile?.occupation_type || 'Tenaga Kerja'}** (${userProfile?.working_hours || '8 jam/hari'}):

1. **Waktu Latihan yang Tepat**:
   - Jika shift Anda adalah **${userProfile?.shift || 'Regular Daytime'}**, sesi olahraga 20–30 menit sebelum shift (pagi) atau setelah shift sore adalah pilihan terbaik.
   - Hindari latihan intensitas tinggi kurang dari 2 jam sebelum waktu tidur karena meningkatkan suhu inti tubuh dan mengganggu pelepasan melatonin.
2. **Kombinasi Latihan Fungsional**:
   - **Pekerja Kantor (Sedentary)**: Fokus pada kardio aerobik (jalan cepat, lari, bersepeda) untuk menjaga kebugaran kardiovaskular.
   - **Pekerja Fisik/Industri**: Fokus pada mobilitas sendi, peregangan otot fleksor pinggul, dan penguatan *core* punggung bawah guna mencegah cedera kerja.
3. **Dukungan Asupan Nutrisi**:
   - Pastikan target protein harian Anda (${nutrition?.target_protein_g || 85}g) tercukupi untuk mempercepat pemulihan serabut otot pasca-latihan.`;
      } else if (lower.includes("shift") || lower.includes("malam") || lower.includes("begah") || lower.includes("tidur")) {
        fallbackReply = `### 🌙 Panduan Gizi & Ritme Sirkadian Shift Malam
Berdasarkan profil Anda dengan shift **${userProfile?.shift || "Malam"}**:

1. **Sebelum Masuk Shift (Pre-Shift: 18:00 - 19:30 WIB)**:
   - Konsumsi makanan utama dengan porsi 30–35% dari target kalori (${nutrition ? Math.round(nutrition.daily_calories * 0.3) : "600"} kkal).
   - Pilih karbohidrat kompleks (nasi merah, kentang, atau oatmeal) + protein tinggi (telur/tempe) agar pelepasan energi stabil.

2. **Tengah Malam (Mid-Shift: 00:00 - 02:00 WIB)**:
   - Konsumsi porsi ringan (20–25% kalori). Hindari gorengan berlemak jenuh tinggi karena pada jam biologis ini enzim lipase dan motilitas usus menurun.
   - Pilihan ideal: Sup sayur hangat, tahu kukus, atau pisang ambon.

3. **Menjelang Istirahat Tidur (Post-Shift: 06:30 - 07:30 WIB)**:
   - Hindari karbohidrat sederhana berindeks glikemik tinggi agar tidak terjadi lonjakan gula darah yang mengganggu fase tidur REM.
   - Pilihan ideal: Susu kedelai hangat tanpa gula atau sepotong pepaya/apel.

*Tips Kafein*: Hentikan konsumsi kopi minimal **5 jam** sebelum waktu tidur yang direncanakan.`;
      } else if (lower.includes("kopi") || lower.includes("kafein") || lower.includes("ngantuk") || lower.includes("coma")) {
        fallbackReply = `### ☕ Panduan Manajemen Kafein & Menghindari Food Coma
Untuk mendukung produktivitas kerja tanpa merusak kualitas tidur:

1. **Jendela Konsumsi Kopi Terbaik**:
   - Pukul **09:30 – 11:30** pagi (setelah puncak kortisol alami pagi hari mulai turun).
   - Hindari minum kopi segera setelah bangun tidur karena hormon kortisol tubuh sudah berada di titik tertinggi.

2. **Batas Waktu (*Cut-Off Time*)**:
   - Waktu paruh kafein dalam tubuh adalah 5–7 jam. Untuk pekerja reguler yang tidur pukul 22:30, hentikan kopi setelah **pukul 15:00**.

3. **Mencegah "Food Coma" Jam 14:00**:
   - Batasi konsumsi nasi putih berlebih saat makan siang; perbanyak porsi sayur berserat dan protein (ikan/tempe).
   - Minum 1 gelas air mineral dingin dan lakukan *stretching* 3 menit di meja kerja.`;
      } else if (lower.includes("budget") || lower.includes("murah") || lower.includes("hemat") || lower.includes("uang")) {
        fallbackReply = `### 💰 Strategi Pemenuhan Gizi Optimal dengan Budget Terjangkau
Dengan batas budget harian Anda (Rp ${userProfile?.daily_food_budget?.toLocaleString("id-ID") || "50.000"}):

1. **Raja Protein Murah Berkualitas**:
   - **Tempe & Tahu**: Biaya Rp 3.000 – Rp 5.000/porsi memberikan 14–20g protein nabati berkualitas tinggi dan isoflavon antioksidan.
   - **Telur Ayam**: Rp 2.500/butir memberikan 6g protein hewani lengkap dengan skor asam amino sempurna (PDCAAS 1.0).
   - **Ikan Kembung / Tongkol**: Lebih terjangkau daripada salmon, namun mengandung asam lemak Omega-3 yang setara untuk fungsi kognitif otak.

2. **Sayuran Lokal Padat Mikronutrien**:
   - Bayam, kangkung, dan daun singkong (Rp 3.000/ikat) kaya akan zat besi untuk mencegah anemia kerja.

3. **Distribusi Anggaran 3 Kali Makan**:
   - Sarapan: Rp 10.000 (Telur rebus + Oatmeal/Ubi + Pisang)
   - Makan Siang: Rp 20.000 (Nasi + Sayur Asem + 2 Tempe Bacem + Ikan Kembung)
   - Makan Malam: Rp 15.000 (Nasi + Tumis Buncis Tahu + Telur Dadar)`;
      } else if (lower.includes("protein") || lower.includes("otot") || lower.includes("berat") || lower.includes("konstruksi")) {
        fallbackReply = `### 🏗️ Optimasi Nutrisi untuk Pekerja Fisik & Beban Berat
Berdasarkan beban okupasi Anda (${userProfile?.occupation_type || "Kerja Fisik"}):

1. **Kebutuhan Protein Harian**:
   - Target protein presisi Anda: **${nutrition?.target_protein_g || 90} gram/hari** (1.4 – 1.6 g/kgBB) untuk memperbaiki mikro-trauma serat otot akibat angkat beban.
   - Distribusikan protein secara merata di 4 waktu makan (20–25g protein per sesi) agar sintesis protein otot maksimal.

2. **Cairan & Elektrolit (Pencegah Dehidrasi)**:
   - Pekerja lapangan di iklim tropis membutuhkan 3.5 – 4.5 liter air per hari.
   - Tambahkan sedikit garam atau air kelapa muda alami untuk menggantikan elektrolit natrium dan kalium yang hilang lewat keringat.

3. **Kombinasi Lauk Berenergi Tinggi**:
   - Nasi + Dada Ayam / Telur Rebus + Tempe Goreng + Pisang sebagai sumber kalium pencegah kram otot.`;
      } else {
        fallbackReply = `### 💬 Konsultasi Adaptif & Bertanggung Jawab NUTRI-AI
Terima kasih atas pertanyaannya! Meskipun pertanyaan ini cukup luas atau di luar ranah gizi kerja murni, sebagai asisten kesehatan pekerja NUTRI-AI saya senang memberikan panduan yang konstruktif:

1. **Tinjauan Praktis**:
   - Menghadapi tantangan harian di tempat kerja membutuhkan perpaduan antara manajemen energi fisik, fokus mental, dan kebiasaan hidup teratur.
   - Bila Anda sedang mengupayakan peningkatan produktivitas atau memecahkan masalah rutinitas harian, mulailah dari perbaikan siklus pemulihan (tidur berkualitas) dan hidrasi teratur.

2. **Korelasinya dengan Profil Okupasi Anda**:
   - Anda tercatat memiliki profil pekerjaan **${userProfile?.occupation_type || 'Industrial Worker'}** dengan jam kerja **${userProfile?.working_hours || '8 jam/hari'}** dan shift **${userProfile?.shift || 'Night Shift'}**.
   - Untuk menopang rutinitas tersebut, target energi harian Anda adalah **${nutrition?.daily_calories || 2300} kkal** dan protein **${nutrition?.target_protein_g || 85} gram**.

3. **Saran Implementasi Lanjutan**:
   - Tetap perhatikan sinyal kelelahan tubuh dan luangkan waktu relaksasi di luar jam kerja.
   - Anda juga dapat menanyakan menu makanan pengganti, tips mengatasi lemas kerja, atau cara menyiasati anggaran belanja mingguan.`;
      }

      return res.json({ reply: fallbackReply, source: "domain-engine" });
    } catch (err: any) {
      console.error("Error in /api/ai/chat:", err);
      res.status(500).json({ error: "Terjadi kesalahan internal pada asisten AI." });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
