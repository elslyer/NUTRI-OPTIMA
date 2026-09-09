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
      const { message, history, userProfile, nutrition, recommendation } = req.body;

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

      const systemInstruction = `Anda adalah "NUTRI-AI", asisten kecerdasan buatan konsultan interaktif kesehatan tenaga kerja, gizi okupasi, dan manajemen stres/burnout Indonesia dari platform NUTRI-OPTIMA ("Nourishing the Workforce").

SPESIALISASI & TUJUAN UTAMA:
Anda dirancang secara khusus untuk berfokus pada 3 pilar fundamental bagi pekerja:
1. KESEHATAN FISIK & GIZI KERJA: Mempertahankan stamina prima, energi stabil tanpa "food coma", pemenuhan target protein dan kalori terjangkau berbasis pangan lokal (tempe, tahu, telur, ikan kembung, sayur lokal), serta kebiasaan hidrasi kerja teratur.
2. PENGELOLAAN STRES KERJA (WORKPLACE STRESS): Membantu pekerja meredakan ketegangan mental dan tekanan beban tugas, menurunkan hormon stres kortisol melalui asupan gizi penenang saraf (magnesium, vitamin B kompleks, triptofan), latihan pernapasan ritmis (*micro-breaks*), serta relaksasi fisik.
3. MENGATASI KEJENUHAN & BURNOUT (FATIGUE & BOREDOM): Mengatasi kebosanan mental akibat rutinitas yang monoton, sindrom kelelahan emosional (*burnout*), serta memulihkan antusiasme dan fokus saat merasa penat dengan jam kerja panjang atau shift malam.

PEDOMAN INTERAKSI (SANGAT PENTING):
1. GAYA BICARA SANGAT INTERAKTIF, HANGAT, & PENUH EMPATI:
   - Gunakan gaya bahasa percakapan santun, luwes, bersahabat, dan manusiawi (hindari gaya ensiklopedia kaku).
   - Validasi emosi pengguna terlebih dahulu. Jika pengguna mengeluh capek, pusing, stres, atau jenuh, berikan empati tulus sebelum masuk ke saran teknis.
   - WAJIB DI SETIAP AKHIR JAWABAN: Sertakan SATU pertanyaan interaktif lanjutan atau ajakan ringan (misalnya: menanyakan tingkat energi/stresnya saat ini, mengajak mencoba latihan pernapasan 1 menit, atau menanyakan apakah ada bagian tubuh yang terasa pegal hari ini) agar percakapan tetap hidup dua arah.

2. ATURAN PENANGANAN PERTANYAAN RANDOM (THE "GRACEFUL PIVOT" RULE):
   - Pengguna sering kali bertanya hal-hal acak, santai, atau di luar ranah kesehatan murni (contoh: "lagi apa?", "ceritakan lelucon", "lagi gabut nih", "main game apa yang seru?", "bisa coding?", tanya film, cuaca, filsafat santai, atau curhat umum).
   - JANGAN PERNAH menolak atau berkata kaku seperti "Maaf saya hanya asisten gizi"!
   - IKUTI POLA 3 LANGKAH INI:
     a. TANGGAPI DENGAN SANTAI & RAMAH: Jawab atau tanggapi topik random tersebut secara bersahabat, cerdas, dan sedikit humoris (1-2 kalimat).
     b. JEMBATANKAN KE KESEHATAN, STRES, ATAU RASA JENUH / BURNOUT:
        - Jelaskan dengan halus bahwa saat seseorang mencari obrolan santai atau distraksi acak di sela-sela waktu, sering kali itu merupakan sinyal bahwa pikiran sedang merasa **jenuh (burnout)**, **stres dengan rutinitas kerja**, atau otak sedang butuh jeda istirahat (*mental break*).
        - Contoh: "Haha pertanyaan yang unik! Tapi ngomong-ngomong, saat kamu mencari obrolan santai seperti ini, apakah ini pertanda pikiranmu lagi merasa jenuh atau penat dengan rutinitas kerja hari ini? Wajar banget kok, otak pekerja memang sering mencari distraksi saat rasa lelah (*mental fatigue*) atau stres mulai menumpuk..."
     c. BERIKAN SOLUSI PENYEGAR & AJUKAN PERTANYAAN INTERAKTIF:
        - Berikan tips praktis singkat (seperti minum segelas air dingin untuk me-reset fokus, lakukan peregangan bahu 30 detik, atau tarik napas dalam).
        - Ajak mereka berdialog: "Gimana kondisi fisik dan perasaanmu saat ini? Apakah lagi merasa lelah, tertekan tugas, atau ada bagian tubuh yang terasa kaku?"

3. FORMAT PENYAJIAN:
   - Gunakan format Markdown yang rapi: subjudul tingkat 3 (###), tebalkan kata-kata kunci (**teks tebal**), dan gunakan bullet points.
   - Jaga agar jawaban tetap ringkas, bernas, dan enak dibaca.

Informasi Biometrik & Okupasi Pekerja:
${profileSummary}
${nutritionSummary}`;

      if (client) {
        // Multi-model resilience: try primary model, then lite/latest if temporary 503 high-demand occurs
        const candidateModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
        
        // Prepare multi-turn conversation context
        const contentsPayload: any[] = [];
        if (Array.isArray(history) && history.length > 0) {
          // Take last 6 messages to preserve context without blowing token budget
          for (const item of history.slice(-6)) {
            if (item && item.text && typeof item.text === "string") {
              contentsPayload.push({
                role: item.sender === "user" ? "user" : "model",
                parts: [{ text: item.text }],
              });
            }
          }
        }
        contentsPayload.push({
          role: "user",
          parts: [{ text: message }],
        });

        for (const modelName of candidateModels) {
          try {
            const response = await client.models.generateContent({
              model: modelName,
              contents: contentsPayload,
              config: {
                systemInstruction,
                temperature: 0.75,
              },
            });

            const replyText = response.text || "Mohon maaf, tidak ada respon yang dapat dihasilkan.";
            return res.json({ reply: replyText, source: "gemini" });
          } catch (modelError: any) {
            const statusCode = modelError?.status || modelError?.statusCode || modelError?.error?.code;
            console.log(`Model ${modelName} unavailable (status ${statusCode}), trying fallback...`);
          }
        }
        console.log("Remote models busy, engaging intelligent domain nutrition engine.");
      }

      // Contextual Fallback response when GEMINI_API_KEY is not configured or offline
      const lower = message.toLowerCase();
      let fallbackReply = "";

      if (lower.includes("jenuh") || lower.includes("bosan") || lower.includes("gabut") || lower.includes("penat") || lower.includes("monoton") || lower.includes("males")) {
        fallbackReply = `### 🌿 Mengatasi Rasa Jenuh & Kelelahan Mental (*Work Burnout*)
Rasa jenuh dan kehilangan gairah di tengah rutinitas kerja adalah sinyal biologis bahwa otak Anda sedang mengalami *mental fatigue* dan membutuhkan jeda penyegaran:

1. **Aturan Jeda 5 Menit (*Active Micro-Break*)**:
   - Berdirilah dari meja kerja, berjalan santai mengambil segelas air dingin, atau cuci muka. Perubahan postur fisik membantu memicu pelepasan endorfin dan meredakan kejenuhan.
2. **Kendalikan Beban Stimulus**:
   - Jika tugas terasa membosankan dan monoton, pecah tugas menjadi blok-blok kecil 25 menit (Metode Pomodoro) diselingi istirahat 3 menit.
3. **Penyegaran Neurotransmiter Lewat Camilan Cerdas**:
   - Konsumsi sepotong pisang atau buah berair dingin (jeruk/semangka). Buah segar kaya vitamin C dan elektrolit yang membantu mengembalikan fokus tanpa memicu kantuk.
4. **Relevansi dengan Pekerjaan Anda**:
   - Dengan rutinitas kerja sebagai **${userProfile?.occupation_type || 'Tenaga Kerja'}** (${userProfile?.working_hours || '8 jam/hari'}), pastikan ada batasan tegas antara jam kerja dan waktu istirahat pribadi.

*Gimana perasaan dan tingkat energimu sekarang? Apakah rasa jenuhnya lebih karena rutinitas yang monoton atau beban tugas yang terlalu menumpuk?*`;
      } else if (lower.includes("stres") || lower.includes("stress") || lower.includes("burnout") || lower.includes("mental") || lower.includes("lelah batin") || lower.includes("capek pikiran")) {
        fallbackReply = `### 🧠 Manajemen Stres & Menurunkan Ketegangan Mental Kerja
Menghadapi tekanan tenggat waktu dan beban kerja harian memang sangat menguras energi. Mari kita lakukan langkah relaksasi praktis ini:

1. **Latihan Pernapasan Ritmis Penurun Kortisol (Teknik 4-7-8)**:
   - Tarik napas perlahan lewat hidung selama 4 detik, tahan napas selama 7 detik, lalu hembuskan lewat mulut perlahan selama 8 detik. Ulangi 3–4 siklus untuk langsung menenangkan saraf parasimpatik.
2. **Dukungan Gizi Penstabil Mood**:
   - **Magnesium & Vitamin B Kompleks**: Membantu menurunkan produksi kortisol berlebih. Pilihan pangan lokal terbaik: pisang, kacang hijau, tempe, dan bayam bening.
   - **Hindari 'Sugar Crash'**: Kurangi camilan manis atau minuman boba tinggi gula saat stres, karena anjloknya insulin justru memicu kecemasan berlebih.
3. **Penuhi Waktu Istirahat**:
   - Pastikan Anda menyisihkan waktu tidur berkualitas minimal 6.5–7 jam malam ini untuk regenerasi sel otak.

*Apakah saat ini kamu sedang merasakan ketegangan di leher/pundak, atau pikiran terasa penuh? Mau coba panduan relaksasi 2 menit bersama saya?*`;
      } else if (lower.includes("sakit kepala") || lower.includes("pusing") || lower.includes("migrain") || lower.includes("pegal") || lower.includes("leher") || lower.includes("punggung")) {
        fallbackReply = `### 🩺 Penanganan Sakit Kepala & Pegal Otot Saat Bekerja
Keluhan fisik seperti sakit kepala tegang (*tension headache*) atau pegal leher sering dialami pekerja akibat beban postur atau dehidrasi:

1. **Evaluasi Dehidrasi Dini**:
   - Lebih dari 60% sakit kepala ringan di tempat kerja dipicu oleh dehidrasi terselubung. Segera minum 1–2 gelas air putih bersuhu ruang.
2. **Peregangan Ergonomis Sederhana**:
   - Lakukan peregangan leher (*chin tuck*), putar bahu ke belakang 10 kali, dan regangkan pergelangan tangan untuk melancarkan aliran darah ke kepala.
3. **Asupan Elektrolit Ringan**:
   - Konsumsi buah segar seperti pisang atau air kelapa yang kaya kalium untuk meredakan ketegangan tonus otot.
4. **Catatan Keselamatan**:
   - Jika sakit kepala terasa sangat tajam mendadak, disertai pandangan kabur atau mual hebat, segera istirahat di ruang kesehatan atau konsultasikan ke dokter perusahaan.

*Sudah berapa gelas air putih yang kamu minum hari ini? Dan apakah posisi duduk/layar kerjamu sudah sejajar dengan mata?*`;
      } else if (lower.includes("halo") || lower.includes("hai") || lower.includes("pagi") || lower.includes("siang") || lower.includes("malam") || lower.includes("lagi apa") || lower.includes("kamu siapa")) {
        fallbackReply = `### 👋 Halo! Senang Berinteraksi dengan Anda
Saya **NUTRI-AI**, konsultan interaktif kesehatan tenaga kerja dari platform NUTRI-OPTIMA! 🌿

Saya selalu siap mendampingi Anda menjaga **kesehatan fisik, mengelola stres kerja, dan memulihkan rasa jenuh (*burnout*)**. 

- **Profil Kerja Terpantau**: ${userProfile?.occupation_type || 'Tenaga Kerja'} (${userProfile?.working_hours || '8 jam/hari'}, shift ${userProfile?.shift || 'Reguler'})
- **Target Energi Harian**: ${nutrition?.daily_calories || 2300} kkal • Protein: ${nutrition?.target_protein_g || 85} gram

Bagaimana kondisi fisik dan perasaan Anda hari ini? Apakah sedang bersemangat, merasa lelah karena tugas menumpuk, atau butuh ide menu makan siang/malam yang sehat dan hemat?`;
      } else if (lower.includes("game") || lower.includes("film") || lower.includes("lelucon") || lower.includes("joke") || lower.includes("lucu") || lower.includes("cerita") || lower.includes("curhat")) {
        fallbackReply = `### 🎮 Santai Sejenak & Jeda dari Rutinitas Kerja
Haha, seru juga topiknya! Obrolan santai dan hiburan memang selingan terbaik untuk menyegarkan pikiran. 

Tapi ngomong-ngomong, saat kamu mencari distraksi santai seperti ini di tengah jam kerja, **apakah ini pertanda pikiranmu lagi jenuh atau penat dengan rutinitas tugas hari ini?**
- Otak pekerja memang secara alami mencari *micro-dopamine* saat rasa jenuh atau stres mulai menumpuk.
- Supaya tidak berlanjut menjadi *burnout* atau badan lemas, jangan lupa imbangi dengan:
  1. **Minum 1 gelas air mineral dingin** untuk mengembalikan hidrasi otak.
  2. **Regangkan bahu dan leher** ke kiri dan kanan selama 30 detik.
  3. **Pilih camilan segar** seperti buah potong atau kacang rebus daripada gorengan berminyak.

*Gimana kondisi badanmu saat ini? Apakah terasa pegal-pegal atau matamu mulai lelah menatap layar?*`;
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
   - Pastikan target protein harian Anda (${nutrition?.target_protein_g || 85}g) tercukupi untuk mempercepat pemulihan serabut otot pasca-latihan.

*Berapa kali dalam seminggu kamu biasanya sempat berolahraga? Dan jenis olahraga apa yang paling kamu sukai?*`;
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

*Tips Kafein*: Hentikan konsumsi kopi minimal **5 jam** sebelum waktu tidur yang direncanakan.

*Kapan biasanya jam tidur utamamu setelah selesai shift malam? Apakah kualitas tidur siangmu selama ini terasa pulas?*`;
      } else if (lower.includes("kopi") || lower.includes("kafein") || lower.includes("ngantuk") || lower.includes("coma")) {
        fallbackReply = `### ☕ Panduan Manajemen Kafein & Menghindari Food Coma
Untuk mendukung produktivitas kerja tanpa merusak kualitas tidur:

1. **Jendela Konsumsi Kopi Terbaik**:
   - Pukul **09:30 – 11:30** pagi (setelah puncak hormon kortisol alami pagi hari mulai turun).
   - Hindari minum kopi segera setelah bangun tidur karena hormon kortisol tubuh sudah berada di titik tertinggi.
2. **Batas Waktu (*Cut-Off Time*)**:
   - Waktu paruh kafein dalam tubuh adalah 5–7 jam. Untuk pekerja reguler yang tidur pukul 22:30, hentikan kopi setelah **pukul 15:00**.
3. **Mencegah "Food Coma" Jam 14:00**:
   - Batasi konsumsi nasi putih berlebih saat makan siang; perbanyak porsi sayur berserat dan protein (ikan/tempe).
   - Minum 1 gelas air mineral dingin dan lakukan *stretching* 3 menit di meja kerja.

*Berapa cangkir kopi yang biasa kamu habiskan dalam sehari saat bekerja?*`;
      } else if (lower.includes("budget") || lower.includes("murah") || lower.includes("hemat") || lower.includes("uang")) {
        fallbackReply = `### 💰 Strategi Pemenuhan Gizi Optimal dengan Budget Terjangkau
Dengan batas budget harian Anda (Rp ${userProfile?.daily_food_budget?.toLocaleString("id-ID") || "55.000"}):

1. **Raja Protein Murah Berkualitas**:
   - **Tempe & Tahu**: Biaya Rp 3.000 – Rp 5.000/porsi memberikan 14–20g protein nabati berkualitas tinggi dan isoflavon antioksidan.
   - **Telur Ayam**: Rp 2.500/butir memberikan 6g protein hewani lengkap dengan skor asam amino sempurna (PDCAAS 1.0).
   - **Ikan Kembung / Tongkol**: Lebih terjangkau daripada salmon, namun mengandung asam lemak Omega-3 yang setara untuk fungsi kognitif otak.
2. **Sayuran Lokal Padat Mikronutrien**:
   - Bayam, kangkung, dan daun singkong (Rp 3.000/ikat) kaya akan zat besi untuk mencegah anemia kerja.
3. **Distribusi Anggaran 3 Kali Makan**:
   - Sarapan: Rp 10.000 (Telur rebus + Oatmeal/Ubi + Pisang)
   - Makan Siang: Rp 25.000 (Nasi + Sayur Asem + 2 Tempe Bacem + Ikan Kembung)
   - Makan Malam: Rp 20.000 (Nasi + Tumis Buncis Tahu + Telur Dadar)

*Apakah kamu lebih sering memasak sendiri atau membeli makanan di warung makan/kantin sekitar kantor?*`;
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
   - Nasi + Dada Ayam / Telur Rebus + Tempe Goreng + Pisang sebagai sumber kalium pencegah kram otot.

*Apakah pekerjaan fisikmu hari ini banyak terpapar panas matahari langsung atau di dalam ruangan pabrik?*`;
      } else {
        fallbackReply = `### 💬 Tanggapan Interaktif NUTRI-AI
Terima kasih atas pertanyaannya! Meskipun topiknya terdengar santai atau sedikit di luar konteks gizi teknis, saya senang bisa berdiskusi dengan Anda.

1. **Menghubungkan dengan Kesejahteraan Pekerja**:
   - Saat kita mengajukan pertanyaan acak atau mencari distraksi di sela rutinitas kerja, sering kali itu sinyal alamiah bahwa **pikiran sedang penat, jenuh, atau butuh penyegaran (*mental break*)**.
   - Menjaga keseimbangan antara fokus kerja, penurunan tingkat stres, dan asupan nutrisi adalah kunci agar kita tidak mudah tumbang (*burnout*).

2. **Dukungan untuk Profil Okupasi Anda**:
   - Sebagai **${userProfile?.occupation_type || 'Tenaga Kerja'}** dengan jam kerja **${userProfile?.working_hours || '8 jam/hari'}**, tubuh Anda memerlukan energi harian sekitar **${nutrition?.daily_calories || 2300} kkal** dan protein **${nutrition?.target_protein_g || 85} gram**.
   - Langkah kilat penyegar pikiran: Minum 1 gelas air mineral, tarik napas dalam 3 kali, dan luruskan punggung sejenak.

*Bagaimana kondisi fisik dan perasaanmu hari ini? Apakah pekerjaan sedang terasa cukup menguras energi atau pikiran terasa jenuh?*`;
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
