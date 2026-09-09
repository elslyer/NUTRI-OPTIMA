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

      const systemInstruction = `Anda adalah "NUTRI-AI", asisten kecerdasan buatan spesialis gizi okupasi dan kesehatan tenaga kerja Indonesia dari aplikasi NUTRI-OPTIMA.
Tugas Anda:
1. Memberikan rekomendasi, edukasi, dan solusi praktis terkait nutrisi pekerja (shift malam, pekerja kantor sedentary, pekerja lapangan fisik berat).
2. Memprioritaskan bahan pangan lokal Indonesia yang bergizi, ramah kantong, dan berkelanjutan (seperti tempe, tahu, telur, ikan kembung, pisang, bayam, singkong, dll).
3. Memberikan panduan ritme sirkadian kerja (waktu makan sebelum shift, saat istirahat kerja, dan pasca-shift agar tidur tetap nyenyak).
4. Menjelaskan secara ramah, terstruktur, berbasis data ilmiah (mengacu AKG Permenkes No. 28/2019 dan riset gizi kerja), dengan format Markdown yang mudah dibaca (bullet point, bolding).
5. Selalu sertakan catatan etika medis singkat jika ada kondisi patologis khusus (diabetes, hipertensi akut).

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

      if (lower.includes("shift") || lower.includes("malam") || lower.includes("begah") || lower.includes("tidur")) {
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
        fallbackReply = `### 💡 Analisis Nutrisi Terintegrasi NUTRI-AI
Halo! Berdasarkan data biometrik Anda (${userProfile?.gender === "Male" ? "Pria" : "Wanita"}, ${userProfile?.age || 26} th, ${userProfile?.occupation_type || "Beban Okupasi Terukur"}):

- **Target Kalori Harian (TDEE)**: **${nutrition?.daily_calories || 2300} kkal**
- **Kebutuhan Protein**: **${nutrition?.target_protein_g || 85} gram**
- **Status IMT**: ${nutrition?.bmi || "Normal"} kg/m² (${nutrition?.bmi_category || "Normal"})
- **Pola Shift**: ${userProfile?.shift || "Regular"}

**Rekomendasi Spesifik untuk Pertanyaan Anda:**
- Untuk menjaga energi tetap prima sepanjang jam kerja, prioritaskan makanan dengan indeks glikemik rendah-sedang yang diperkaya serat pangan (minimal 25–30g/hari).
- Jangan melewatkan waktu sarapan sebelum berangkat kerja untuk mencegah hipoglikemia reaktif saat jam kritis.
- Selalu cukupi hidrasi dengan aturan praktis: 1 gelas air putih setiap 1–2 jam selama bekerja.

*Silakan tanyakan secara spesifik mengenai variasi menu, substitusi lauk, atau penyesuaian jadwal makan shift Anda!*`;
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
