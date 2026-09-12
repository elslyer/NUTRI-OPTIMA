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

  // Download standalone app package endpoint (triggers Chrome download prompt)
  app.get("/api/download-app", (req, res) => {
    const proto = req.headers["x-forwarded-proto"] || "https";
    const rawHost = req.headers["x-forwarded-host"] || req.get("host") || "ais-pre-v2bbpxccxtgenlpgochfyf-893119588729.asia-east1.run.app";
    const host = (String(rawHost).includes("localhost") || String(rawHost).includes("ais-dev-"))
      ? "ais-pre-v2bbpxccxtgenlpgochfyf-893119588729.asia-east1.run.app"
      : rawHost;
    const appUrl = `${proto}://${host}`;

    const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NUTRI-OPTIMA — Workforce Nutrition System</title>
  <meta name="description" content="Aplikasi Gizi Presisi & Kebugaran Tenaga Kerja Indonesia">
  <link rel="icon" type="image/svg+xml" href="${appUrl}/favicon.svg">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #064e3b;
      color: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
      padding: 24px;
      box-sizing: border-box;
    }
    .card {
      background: #ffffff;
      color: #0f172a;
      max-width: 520px;
      width: 100%;
      border-radius: 20px;
      padding: 32px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
    }
    .badge {
      display: inline-block;
      background: #ecfdf5;
      color: #059669;
      font-weight: 700;
      font-size: 12px;
      padding: 6px 14px;
      border-radius: 9999px;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    h1 {
      margin: 0 0 12px 0;
      font-size: 26px;
      color: #064e3b;
    }
    p {
      color: #475569;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 14px 20px;
      border-radius: 12px;
      background: #059669;
      color: #ffffff;
      font-weight: 700;
      text-decoration: none;
      font-size: 15px;
      transition: background 0.2s, transform 0.1s;
      box-sizing: border-box;
    }
    .btn:hover {
      background: #047857;
      transform: translateY(-1px);
    }
    .footer-note {
      font-size: 11px;
      color: #64748b;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">Aplikasi Terpasang Mandiri</div>
    <h1>NUTRI-OPTIMA</h1>
    <p>Sistem Rekomendasi Gizi Presisi untuk Tenaga Kerja Indonesia berbasis beban okupasi kerja, ritme sirkadian shift, dan 100 pangan lokal.</p>
    <a href="${appUrl}" class="btn" id="launch-app">Buka NUTRI-OPTIMA Sekarang &rarr;</a>
    <div class="footer-note">
      Berkas ini dapat Anda simpan di Desktop atau folder Dokumen Anda untuk membuka aplikasi secara instan kapan saja.
    </div>
  </div>
  <script>
    // Auto redirect or open in dedicated window
    setTimeout(() => {
      window.location.href = "${appUrl}";
    }, 800);
  </script>
</body>
</html>`;

    res.setHeader("Content-Disposition", 'attachment; filename="NUTRI-OPTIMA-App.html"');
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(htmlContent);
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
        // Multi-model resilience: start with lightning-fast gemini-3.1-flash-lite, then flash-latest & 3.8-flash
        const candidateModels = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.8-flash"];
        
        // Prepare multi-turn conversation context with full conversational memory
        const rawHistory = Array.isArray(history) ? history.slice(-10) : [];
        const contentsPayload: any[] = [];
        
        for (const item of rawHistory) {
          if (!item || typeof item.text !== "string" || !item.text.trim()) continue;
          const role = item.sender === "user" ? "user" : "model";
          
          if (contentsPayload.length === 0) {
            contentsPayload.push({
              role: role,
              parts: [{ text: item.text.trim() }],
            });
          } else {
            const lastIndex = contentsPayload.length - 1;
            if (contentsPayload[lastIndex].role === role) {
              contentsPayload[lastIndex].parts[0].text += `\n\n${item.text.trim()}`;
            } else {
              contentsPayload.push({
                role: role,
                parts: [{ text: item.text.trim() }],
              });
            }
          }
        }

        // Now append current user message safely ensuring alternating roles
        if (contentsPayload.length > 0 && contentsPayload[contentsPayload.length - 1].role === "user") {
          contentsPayload[contentsPayload.length - 1].parts[0].text += `\n\n${message.trim()}`;
        } else {
          contentsPayload.push({
            role: "user",
            parts: [{ text: message.trim() }],
          });
        }

        const comprehensiveSystemInstruction = `Anda adalah "NUTRI-AI", asisten kecerdasan buatan cerdas, interaktif, dan berpengetahuan luas dari platform NUTRI-OPTIMA ("Nourishing the Workforce"). Anda bertindak sebagai konsultan gizi okupasi, pakar kesehatan tenaga kerja, pendamping manajemen stres/burnout, dan partner diskusi cerdas bagi seluruh pekerja Indonesia.

KEMAMPUAN UTAMA & INSTRUKSI PENGERJAAN:

1. KEMAMPUAN MENJAWAB PERTANYAAN LANJUTAN (MULTI-TURN CONTINUITY):
   - Anda memiliki daya ingat percakapan yang kuat. Selalu perhatikan riwayat obrolan sebelumnya!
   - Ketika pengguna mengajukan pertanyaan lanjutan (misalnya: "kalau begitu...", "lalu bagaimana jika...", "kalau telurnya direbus atau digoreng?", "bisa beri alternatif lauk lain?", "berapa gram porsinya?", "bagaimana resep memasaknya?", "bagaimana jadwal makan shiftnya?", "ada opsi yang lebih murah?"):
     * JAWAB LANGSUNG secara spesifik, koheren, dan relevan dengan apa yang sudah dibahas sebelumnya.
     * JANGAN mengulang salam pembuka, perkenalan diri, atau ucapan formal berulang-ulang jika sedang berada di tengah-tengah obrolan lanjutan. Langsung ke inti jawaban dengan gaya bahasa luwes dan solutif.

2. KEMAMPUAN MENJAWAB PERTANYAAN BEBAS & RANDOM (BROAD GENERAL KNOWLEDGE):
   - Pengguna bebas bertanya pertanyaan apa saja (pengetahuan umum, sains, teknologi, matematika, trivia, sejarah, resep masakan, tips produktivitas kerja, hobi, humor sehat, perbandingan hal, atau obrolan santai sehari-hari).
   - JAWAB LANGSUNG DAN TUNTAS pertanyaan tersebut secara cerdas, akurat, informatif, dan ramah.
   - JANGAN PERNAH menolak atau berkata kaku seperti "Maaf saya hanya asisten gizi"!
   - JANGAN memaksakan menuduh pengguna lelah/stres di setiap pertanyaan secara berlebihan. Bersikaplah seperti AI cerdas serba bisa yang menyenangkan diajak ngobrol.
   - Jika topiknya memungkinkan, Anda boleh menyisipkan sentuhan tips kesehatan, hidrasi, atau fokus kerja secara natural di bagian akhir tanpa terkesan memaksakan.

3. SPESIALISASI GIZI OKUPASI & KESEHATAN PEKERJA INDONESIA:
   - Gizi Kerja & Pangan Lokal: Rekomendasi nutrisi presisi berbasis pangan lokal Indonesia terjangkau (tempe, tahu, telur, ikan kembung, sayur bayam, kacang hijau, pisang, dll.) untuk stamina stabil tanpa "food coma" di jam kerja.
   - Pola Shift & Sirkadian: Jadwal makan teratur bagi pekerja shift malam (pre-shift, mid-shift, post-shift) dan pekerja lembur.
   - Manajemen Stres & Pemulihan Kelelahan: Menurunkan hormon stres kortisol dengan nutrisi penenang (magnesium, vitamin B kompleks), hidrasi teratur, serta teknik jeda mikro (*micro-breaks* dan pernapasan 4-7-8).

4. GAYA KOMUNIKASI & FORMAT:
   - Bahasa Indonesia yang santun, ramah, interaktif, empatik, dan solutif.
   - Format Markdown yang rapi: gunakan subjudul (###), poin-poin (* / -), dan penekanan kata kunci (**bold**).
   - Di akhir respons, sertakan SATU pertanyaan interaktif lanjutan atau ajakan ringan yang relevan untuk menjaga percakapan tetap mengalir dua arah.

Informasi Biometrik & Okupasi Pekerja Terpantau:
${profileSummary}
${nutritionSummary}`;

        for (const modelName of candidateModels) {
          try {
            const response = await client.models.generateContent({
              model: modelName,
              contents: contentsPayload,
              config: {
                systemInstruction: comprehensiveSystemInstruction,
                temperature: 0.7,
              },
            });

            const replyText = response.text || "Mohon maaf, tidak ada respon yang dapat dihasilkan.";
            return res.json({ reply: replyText, source: "gemini" });
          } catch (modelError: any) {
            const statusCode = modelError?.status || modelError?.statusCode || modelError?.error?.code;
            console.log(`Model ${modelName} unavailable (status ${statusCode}), trying next model...`);
          }
        }
        console.log("Remote models busy, engaging intelligent domain nutrition engine.");
      }

      // Contextual Fallback response when GEMINI_API_KEY is offline or rate-limited
      const lower = message.toLowerCase();
      let fallbackReply = "";

      // 1. Follow-up: Cooking method, recipe, preparation (rebus, goreng, kukus, resep)
      if (lower.includes("resep") || lower.includes("masak") || lower.includes("rebus") || lower.includes("goreng") || lower.includes("kukus") || lower.includes("bakar") || lower.includes("olah")) {
        fallbackReply = `### 🍳 Panduan Pengolahan & Resep Sehat untuk Pekerja
Pilihan metode pengolahan sangat menentukan retensi zat gizi dan pencegahan *food coma* di jam kerja:

1. **Prioritas Metode (Kukus, Rebus, & Tumis Ringan)**:
   - **Telur**: Telur rebus (*hard-boiled*) mempertahankan nilai protein murni 100% tanpa tambahan asam lemak jenuh dari minyak jelantah. Cocok dibawa praktis sebagai bekal kerja.
   - **Tempe & Tahu**: Tumis tempe bacem panggang atau tahu kukus dengan bumbu kuning jahe dan kunyit mempertahankan antioksidan isoflavon tanpa lemak trans berlebih.
   - **Sayur (Bayam, Labu, Buncis)**: Rebus sayur hijau cukup 2–3 menit saja untuk mencegah kerusakan vitamin B kompleks dan vitamin C yang larut air.

2. **Pengurangan Minyak Berlebih**:
   - Kurangi makanan digoreng *deep-fry* saat jam kerja siang. Minyak goreng jenuh memerlukan waktu cerna lambung 4–5 jam, mengalirkan darah ke sistem pencernaan dan memicu kantuk hebat (*reactive fatigue*).

*Apakah Anda biasanya sempat menyiapkan bekal dari rumah, atau lebih sering membeli makanan matang di sekitar tempat kerja?*`;
      } 
      // 2. Follow-up: Substitutions / alternatives (ganti, pengganti, substitusi, alternatif, tidak suka, alergi)
      else if (lower.includes("ganti") || lower.includes("substitusi") || lower.includes("alternatif") || lower.includes("tidak suka") || lower.includes("alergi") || lower.includes("selain")) {
        fallbackReply = `### 🔄 Alternatif Bahan Pangan Lokal Pengganti
Jika Anda ingin mengganti salah satu bahan makanan atau memiliki preferensi khusus:

1. **Pengganti Protein Hewani**:
   - Bila tidak mengonsumsi telur atau ayam: Gunakan **ikan kembung**, **ikan tongkol**, **ati ayam**, atau **udang sungai**.
   - Bila vegetarian: Kombinasikan **tempe** (100g = 19g protein) + **tahu putih** (100g = 10g protein) + **edamame / kacang hijau** untuk spektrum asam amino lengkap.
2. **Pengganti Karbohidrat Pokok**:
   - Jika ingin membatasi nasi putih: Pilihan lokal terbaik meliputi **ubi jalar rebus** (indeks glikemik rendah, kaya beta-karoten), **jagung manis**, **kentang rebus**, atau **singkong kukus**.
3. **Pengganti Sayuran**:
   - Jika kurang menyukai bayam: Gunakan **kangkung**, **daun katuk**, **daun kelor** (sangat kaya kalsium & antioksidan), atau **buncis**.

*Bahan makanan mana yang ingin Anda ganti atau cari alternatif terbaiknya? Saya siap buatkan penyesuaian porsinya.*`;
      }
      // 3. Follow-up: Portions, grams, measurements (porsi, gram, takaran, sendok, mangkok)
      else if (lower.includes("porsi") || lower.includes("gram") || lower.includes("takaran") || lower.includes("sendok") || lower.includes("berapa banyak") || lower.includes("mangkok")) {
        fallbackReply = `### ⚖️ Takaran Porsi Gizi Harian Pekerja (Metode Praktis Tangan)
Untuk memenuhi target kalori harian Anda (**${nutrition?.daily_calories || 2300} kkal**) dan protein (**${nutrition?.target_protein_g || 85} gram**):

1. **Karbohidrat Pokok (Nasi/Ubi)**:
   - Sekitar 1 kepalan tangan (100–150 gram per waktu makan utama) = ~175 kkal.
2. **Lauk Protein (Hewani & Nabati)**:
   - Seukuran telapak tangan tanpa jari: 1 potong tempe sedang (50g) + 1 butir telur rebus (55g) atau 1 ekor ikan kembung ukuran sedang (80g).
   - Menyumbang 18–24 gram protein per waktu makan.
3. **Sayuran Hijau & Serat**:
   - Sebanyak 2 tangkup tangan terbuka (minimal 1 mangkok sedang / 100–150 gram sayuran berkuah) untuk menjaga glikemik stabil dan mencegah sembelit kerja.
4. **Buah Segar**:
   - 1 buah ukuran genggaman tangan (misal: 1 buah pisang ambon atau 1 potong semangka/pepaya sedang).

*Apakah Anda memiliki timbangan makanan di rumah, atau ingin panduan praktis porsi berdasarkan centong nasi dan sendok makan?*`;
      }
      // 4. Follow-up: Weight management & calorie targets (kurus, gemuk, berat badan, diet, turun, naik)
      else if (lower.includes("berat badan") || lower.includes("diet") || lower.includes("turun") || lower.includes("naik") || lower.includes("gemuk") || lower.includes("kurus") || lower.includes("ideal")) {
        fallbackReply = `### 🎯 Strategi Pengelolaan Berat Badan Berdasarkan IMT Pekerja
Berdasarkan data biometrik Anda:
- **Status IMT Saat Ini**: ${nutrition?.bmi || 22.5} kg/m² (${nutrition?.bmi_category || 'Normal'})
- **Kebutuhan Kalori Pemeliharaan (TDEE)**: ${nutrition?.daily_calories || 2300} kkal/hari

1. **Jika Ingin Menurunkan Lemak Tubuh (Fat Loss)**:
   - Terapkan defisit kalori moderat 300–500 kkal (konsumsi sekitar ${nutrition ? nutrition.daily_calories - 400 : 1900} kkal).
   - Jangan kurangi protein! Pertahankan target protein **${nutrition?.target_protein_g || 85}g** agar massa otot tidak menyusut dan metabolisme tetap tinggi.
2. **Jika Ingin Menjaga Stamina & Berat Ideal**:
   - Pertahankan pola makan seimbang sesuai rekomendasi jadwal gizi 4 waktu makan NUTRI-OPTIMA.
   - Perhatikan hidrasi kerja minimal 2.5–3 liter per hari agar cairan intraseluler stabil.

*Apa sasaran utama fisik Anda dalam 1–3 bulan ke depan? Apakah fokus menurunkan lingkar perut, menjaga kebugaran, atau menambah massa otot?*`;
      }
      else if (lower.includes("jenuh") || lower.includes("bosan") || lower.includes("gabut") || lower.includes("penat") || lower.includes("monoton") || lower.includes("males")) {
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
        fallbackReply = `### 💡 Jawaban & Analisis NUTRI-AI
Terima kasih atas pertanyaannya! Terkait hal yang Anda tanyakan:

1. **Inti Jawaban & Konteks**:
   - Topik yang Anda angkat sangat menarik untuk dibahas. Baik dalam konteks rutinitas kerja sehari-hari, produktivitas, maupun wawasan umum, menjaga rasa ingin tahu dan pikiran yang aktif adalah salah satu indikator vitalitas mental yang sehat.
   
2. **Kaitan dengan Produktivitas & Kebugaran Kerja**:
   - Menjaga energi fisik tetap stabil melalui asupan gizi seimbang (seperti target Anda: **${nutrition?.daily_calories || 2300} kkal** dan protein **${nutrition?.target_protein_g || 85}g**) serta hidrasi teratur (minimal 2–3 liter air/hari) akan membuat daya konsentrasi otak tetap tajam saat berpikir maupun bekerja.

3. **Diskusi Lanjutan**:
   - Jika ada hal spesifik lain yang ingin Anda ketahui lebih mendalam—baik seputar menu makanan lokal, trik mencegah kantuk siang, alternatif bahan pangan, strategi shift kerja, atau topik lainnya—silakan tanyakan langsung!

*Ada topik atau pertanyaan lanjutan lain yang ingin kita diskusikan bersama?*`;
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
