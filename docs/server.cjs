var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);

// src/data/foodDatabase.ts
var INITIAL_FOOD_DATABASE = [
  {
    food_id: 1,
    food_name: "Nasi Putih Pulen (150g)",
    category: "staple",
    meal_type: "all_day",
    calories: 195,
    protein_g: 4,
    carbohydrate_g: 43,
    fat_g: 0.4,
    fiber_g: 0.6,
    price_idr: 3e3,
    sustainability_score: 75,
    vegetarian: true,
    high_protein: false
  },
  {
    food_id: 2,
    food_name: "Nasi Merah Organik (150g)",
    category: "staple",
    meal_type: "all_day",
    calories: 165,
    protein_g: 3.8,
    carbohydrate_g: 35,
    fat_g: 1.2,
    fiber_g: 3.2,
    price_idr: 5e3,
    sustainability_score: 85,
    vegetarian: true,
    high_protein: false
  },
  {
    food_id: 3,
    food_name: "Oatmeal & Biji Chia (60g)",
    category: "staple",
    meal_type: "breakfast",
    calories: 220,
    protein_g: 7.5,
    carbohydrate_g: 38,
    fat_g: 4,
    fiber_g: 6.5,
    price_idr: 6e3,
    sustainability_score: 90,
    vegetarian: true,
    high_protein: false
  },
  {
    food_id: 4,
    food_name: "Ubi Cilembu Panggang (150g)",
    category: "staple",
    meal_type: "all_day",
    calories: 130,
    protein_g: 2,
    carbohydrate_g: 30,
    fat_g: 0.2,
    fiber_g: 4,
    price_idr: 4e3,
    sustainability_score: 95,
    vegetarian: true,
    high_protein: false
  },
  {
    food_id: 5,
    food_name: "Kentang Rebus Herbal (150g)",
    category: "staple",
    meal_type: "all_day",
    calories: 125,
    protein_g: 2.8,
    carbohydrate_g: 28,
    fat_g: 0.2,
    fiber_g: 3,
    price_idr: 4500,
    sustainability_score: 88,
    vegetarian: true,
    high_protein: false
  },
  {
    food_id: 6,
    food_name: "Lontong Alami (150g)",
    category: "staple",
    meal_type: "all_day",
    calories: 180,
    protein_g: 3.5,
    carbohydrate_g: 40,
    fat_g: 0.3,
    fiber_g: 0.8,
    price_idr: 3500,
    sustainability_score: 75,
    vegetarian: true,
    high_protein: false
  },
  {
    food_id: 7,
    food_name: "Roti Gandum Utuh (2 lembar)",
    category: "staple",
    meal_type: "breakfast",
    calories: 160,
    protein_g: 6,
    carbohydrate_g: 28,
    fat_g: 2.5,
    fiber_g: 4,
    price_idr: 5e3,
    sustainability_score: 82,
    vegetarian: true,
    high_protein: false
  },
  {
    food_id: 8,
    food_name: "Dada Ayam Panggang Herbal (100g)",
    category: "protein",
    meal_type: "lunch",
    calories: 165,
    protein_g: 31,
    carbohydrate_g: 0,
    fat_g: 3.6,
    fiber_g: 0,
    price_idr: 14e3,
    sustainability_score: 65,
    vegetarian: false,
    high_protein: true
  },
  {
    food_id: 9,
    food_name: "Ayam Ungkep Bumbu Kuning (1 potong)",
    category: "protein",
    meal_type: "lunch",
    calories: 210,
    protein_g: 24,
    carbohydrate_g: 2,
    fat_g: 12,
    fiber_g: 0.2,
    price_idr: 12e3,
    sustainability_score: 62,
    vegetarian: false,
    high_protein: true
  },
  {
    food_id: 10,
    food_name: "Ikan Kembung Bakar Rica (1 ekor)",
    category: "protein",
    meal_type: "lunch",
    calories: 180,
    protein_g: 22,
    carbohydrate_g: 1,
    fat_g: 9,
    fiber_g: 0,
    price_idr: 12e3,
    sustainability_score: 80,
    vegetarian: false,
    high_protein: true
  },
  {
    food_id: 11,
    food_name: "Ikan Tongkol Balado (1 potong)",
    category: "protein",
    meal_type: "dinner",
    calories: 170,
    protein_g: 25,
    carbohydrate_g: 2.5,
    fat_g: 6.5,
    fiber_g: 0.3,
    price_idr: 1e4,
    sustainability_score: 78,
    vegetarian: false,
    high_protein: true
  },
  {
    food_id: 12,
    food_name: "Ikan Nila Kukus Jahe (1 ekor)",
    category: "protein",
    meal_type: "dinner",
    calories: 145,
    protein_g: 26,
    carbohydrate_g: 0,
    fat_g: 3.5,
    fiber_g: 0,
    price_idr: 13e3,
    sustainability_score: 76,
    vegetarian: false,
    high_protein: true
  },
  {
    food_id: 13,
    food_name: "Telur Rebus Omega-3 (2 butir)",
    category: "protein",
    meal_type: "breakfast",
    calories: 140,
    protein_g: 12.6,
    carbohydrate_g: 1,
    fat_g: 9.5,
    fiber_g: 0,
    price_idr: 6e3,
    sustainability_score: 72,
    vegetarian: false,
    high_protein: true
  },
  {
    food_id: 14,
    food_name: "Telur Dadar Sayur Wortel (1 butir)",
    category: "protein",
    meal_type: "breakfast",
    calories: 120,
    protein_g: 7.5,
    carbohydrate_g: 2,
    fat_g: 9,
    fiber_g: 0.5,
    price_idr: 4500,
    sustainability_score: 70,
    vegetarian: false,
    high_protein: false
  },
  {
    food_id: 15,
    food_name: "Tempe Orek Manis Gurih (80g)",
    category: "protein",
    meal_type: "lunch",
    calories: 160,
    protein_g: 12,
    carbohydrate_g: 14,
    fat_g: 7,
    fiber_g: 4.5,
    price_idr: 4e3,
    sustainability_score: 95,
    vegetarian: true,
    high_protein: true
  },
  {
    food_id: 16,
    food_name: "Tempe Bacem Panggang (2 potong)",
    category: "protein",
    meal_type: "dinner",
    calories: 150,
    protein_g: 11.5,
    carbohydrate_g: 13,
    fat_g: 6.5,
    fiber_g: 4.2,
    price_idr: 4e3,
    sustainability_score: 94,
    vegetarian: true,
    high_protein: true
  },
  {
    food_id: 17,
    food_name: "Tahu Kukus Bumbu Kuning (2 potong)",
    category: "protein",
    meal_type: "dinner",
    calories: 110,
    protein_g: 10,
    carbohydrate_g: 4,
    fat_g: 6,
    fiber_g: 2.5,
    price_idr: 3500,
    sustainability_score: 92,
    vegetarian: true,
    high_protein: true
  },
  {
    food_id: 18,
    food_name: "Tahu Bacem Gurih (2 potong)",
    category: "protein",
    meal_type: "lunch",
    calories: 135,
    protein_g: 9.5,
    carbohydrate_g: 12,
    fat_g: 5.5,
    fiber_g: 2.8,
    price_idr: 3500,
    sustainability_score: 90,
    vegetarian: true,
    high_protein: false
  },
  {
    food_id: 19,
    food_name: "Tumis Tempe & Kacang Panjang",
    category: "protein",
    meal_type: "dinner",
    calories: 145,
    protein_g: 9,
    carbohydrate_g: 11,
    fat_g: 7.5,
    fiber_g: 4,
    price_idr: 5e3,
    sustainability_score: 92,
    vegetarian: true,
    high_protein: false
  },
  {
    food_id: 20,
    food_name: "Sayur Bayam Bening Jagung Manis",
    category: "vegetable",
    meal_type: "lunch",
    calories: 65,
    protein_g: 3,
    carbohydrate_g: 13,
    fat_g: 0.5,
    fiber_g: 3.5,
    price_idr: 4e3,
    sustainability_score: 95,
    vegetarian: true,
    high_protein: false
  },
  {
    food_id: 21,
    food_name: "Tumis Kangkung Terasi Bawang",
    category: "vegetable",
    meal_type: "lunch",
    calories: 70,
    protein_g: 2.5,
    carbohydrate_g: 7,
    fat_g: 4,
    fiber_g: 2.8,
    price_idr: 4e3,
    sustainability_score: 92,
    vegetarian: true,
    high_protein: false
  },
  {
    food_id: 22,
    food_name: "Sayur Asem Segar Khas Sunda",
    category: "vegetable",
    meal_type: "dinner",
    calories: 80,
    protein_g: 2.8,
    carbohydrate_g: 16,
    fat_g: 1,
    fiber_g: 4,
    price_idr: 4500,
    sustainability_score: 93,
    vegetarian: true,
    high_protein: false
  },
  {
    food_id: 23,
    food_name: "Sayur Sop Bening Buncis Wortel",
    category: "vegetable",
    meal_type: "dinner",
    calories: 75,
    protein_g: 2.5,
    carbohydrate_g: 14,
    fat_g: 1.2,
    fiber_g: 3.5,
    price_idr: 5e3,
    sustainability_score: 90,
    vegetarian: true,
    high_protein: false
  },
  {
    food_id: 24,
    food_name: "Tumis Brokoli Wortel Jamur Tiram",
    category: "vegetable",
    meal_type: "lunch",
    calories: 85,
    protein_g: 4,
    carbohydrate_g: 12,
    fat_g: 2.5,
    fiber_g: 4.5,
    price_idr: 6500,
    sustainability_score: 91,
    vegetarian: true,
    high_protein: false
  },
  {
    food_id: 25,
    food_name: "Capcay Sayur Kuah Kental Bening",
    category: "vegetable",
    meal_type: "dinner",
    calories: 95,
    protein_g: 4.5,
    carbohydrate_g: 14,
    fat_g: 3,
    fiber_g: 4.2,
    price_idr: 7e3,
    sustainability_score: 88,
    vegetarian: true,
    high_protein: false
  },
  {
    food_id: 26,
    food_name: "Gado-Gado Siram Sayur Komplet",
    category: "vegetable",
    meal_type: "lunch",
    calories: 280,
    protein_g: 11,
    carbohydrate_g: 26,
    fat_g: 15,
    fiber_g: 6,
    price_idr: 12e3,
    sustainability_score: 86,
    vegetarian: true,
    high_protein: false
  },
  {
    food_id: 27,
    food_name: "Pecel Sayur Madiun Tradisional",
    category: "vegetable",
    meal_type: "lunch",
    calories: 190,
    protein_g: 8,
    carbohydrate_g: 22,
    fat_g: 8.5,
    fiber_g: 5.5,
    price_idr: 8e3,
    sustainability_score: 89,
    vegetarian: true,
    high_protein: false
  },
  {
    food_id: 28,
    food_name: "Pepes Tahu Jamur Kemangi",
    category: "protein",
    meal_type: "dinner",
    calories: 95,
    protein_g: 8,
    carbohydrate_g: 5,
    fat_g: 5,
    fiber_g: 3,
    price_idr: 4e3,
    sustainability_score: 93,
    vegetarian: true,
    high_protein: false
  },
  {
    food_id: 29,
    food_name: "Pepes Ikan Mas Daun Kemangi",
    category: "protein",
    meal_type: "dinner",
    calories: 160,
    protein_g: 20,
    carbohydrate_g: 1,
    fat_g: 8,
    fiber_g: 0.5,
    price_idr: 12e3,
    sustainability_score: 82,
    vegetarian: false,
    high_protein: true
  },
  {
    food_id: 30,
    food_name: "Pisang Ambon Matang (1 buah)",
    category: "fruit",
    meal_type: "snack",
    calories: 105,
    protein_g: 1.3,
    carbohydrate_g: 27,
    fat_g: 0.3,
    fiber_g: 3.1,
    price_idr: 3e3,
    sustainability_score: 96,
    vegetarian: true,
    high_protein: false
  },
  {
    food_id: 31,
    food_name: "Pepaya Potong Segar (150g)",
    category: "fruit",
    meal_type: "snack",
    calories: 60,
    protein_g: 0.9,
    carbohydrate_g: 15,
    fat_g: 0.2,
    fiber_g: 2.7,
    price_idr: 3e3,
    sustainability_score: 95,
    vegetarian: true,
    high_protein: false
  },
  {
    food_id: 32,
    food_name: "Apel Malang Segar (1 buah)",
    category: "fruit",
    meal_type: "snack",
    calories: 80,
    protein_g: 0.4,
    carbohydrate_g: 21,
    fat_g: 0.3,
    fiber_g: 3.6,
    price_idr: 5e3,
    sustainability_score: 92,
    vegetarian: true,
    high_protein: false
  },
  {
    food_id: 33,
    food_name: "Jeruk Manis Pontianak (1 buah)",
    category: "fruit",
    meal_type: "snack",
    calories: 62,
    protein_g: 1.2,
    carbohydrate_g: 15.4,
    fat_g: 0.2,
    fiber_g: 3.1,
    price_idr: 3500,
    sustainability_score: 94,
    vegetarian: true,
    high_protein: false
  },
  {
    food_id: 34,
    food_name: "Kacang Almond Panggang (30g)",
    category: "snack",
    meal_type: "snack",
    calories: 175,
    protein_g: 6.5,
    carbohydrate_g: 6,
    fat_g: 15,
    fiber_g: 3.5,
    price_idr: 8500,
    sustainability_score: 82,
    vegetarian: true,
    high_protein: true
  },
  {
    food_id: 35,
    food_name: "Kacang Tanah Sangrai (30g)",
    category: "snack",
    meal_type: "snack",
    calories: 165,
    protein_g: 7,
    carbohydrate_g: 5,
    fat_g: 14,
    fiber_g: 2.5,
    price_idr: 3500,
    sustainability_score: 88,
    vegetarian: true,
    high_protein: true
  },
  {
    food_id: 36,
    food_name: "Edamame Rebus Gurih (100g)",
    category: "snack",
    meal_type: "snack",
    calories: 120,
    protein_g: 11,
    carbohydrate_g: 9,
    fat_g: 5,
    fiber_g: 5,
    price_idr: 5e3,
    sustainability_score: 94,
    vegetarian: true,
    high_protein: true
  },
  {
    food_id: 37,
    food_name: "Susu UHT Low Fat (200ml)",
    category: "drink",
    meal_type: "breakfast",
    calories: 110,
    protein_g: 7,
    carbohydrate_g: 11,
    fat_g: 3,
    fiber_g: 0,
    price_idr: 6e3,
    sustainability_score: 70,
    vegetarian: true,
    high_protein: false
  },
  {
    food_id: 38,
    food_name: "Susu Kedelai Murni (250ml)",
    category: "drink",
    meal_type: "snack",
    calories: 90,
    protein_g: 7.5,
    carbohydrate_g: 6,
    fat_g: 4,
    fiber_g: 1.5,
    price_idr: 4500,
    sustainability_score: 93,
    vegetarian: true,
    high_protein: false
  },
  {
    food_id: 39,
    food_name: "Yogurt Greek Plain (120g)",
    category: "snack",
    meal_type: "breakfast",
    calories: 100,
    protein_g: 12,
    carbohydrate_g: 4.5,
    fat_g: 3,
    fiber_g: 0,
    price_idr: 9500,
    sustainability_score: 72,
    vegetarian: true,
    high_protein: true
  },
  {
    food_id: 40,
    food_name: "Telur Puyuh Rebus (5 butir)",
    category: "protein",
    meal_type: "snack",
    calories: 70,
    protein_g: 6,
    carbohydrate_g: 0.5,
    fat_g: 5,
    fiber_g: 0,
    price_idr: 5e3,
    sustainability_score: 68,
    vegetarian: false,
    high_protein: false
  },
  {
    food_id: 41,
    food_name: "Jus Alpukat Murni (250ml)",
    category: "drink",
    meal_type: "snack",
    calories: 160,
    protein_g: 2,
    carbohydrate_g: 12,
    fat_g: 13,
    fiber_g: 5.5,
    price_idr: 9e3,
    sustainability_score: 85,
    vegetarian: true,
    high_protein: false
  },
  {
    food_id: 42,
    food_name: "Bubur Ayam Bening Rendah Lemak",
    category: "staple",
    meal_type: "breakfast",
    calories: 210,
    protein_g: 12,
    carbohydrate_g: 32,
    fat_g: 3.5,
    fiber_g: 1.5,
    price_idr: 1e4,
    sustainability_score: 74,
    vegetarian: false,
    high_protein: false
  },
  {
    food_id: 43,
    food_name: "Soto Ayam Bening Kudus (1 mangkok)",
    category: "protein",
    meal_type: "lunch",
    calories: 150,
    protein_g: 16,
    carbohydrate_g: 6,
    fat_g: 7,
    fiber_g: 1.5,
    price_idr: 11e3,
    sustainability_score: 72,
    vegetarian: false,
    high_protein: true
  },
  {
    food_id: 44,
    food_name: "Daging Sapi Panggang Lada Hitam",
    category: "protein",
    meal_type: "lunch",
    calories: 210,
    protein_g: 22,
    carbohydrate_g: 3,
    fat_g: 12,
    fiber_g: 0.3,
    price_idr: 22e3,
    sustainability_score: 45,
    vegetarian: false,
    high_protein: true
  },
  {
    food_id: 45,
    food_name: "Tumis Tauge Tahu Kuning",
    category: "vegetable",
    meal_type: "dinner",
    calories: 85,
    protein_g: 6,
    carbohydrate_g: 7,
    fat_g: 4,
    fiber_g: 2.5,
    price_idr: 4e3,
    sustainability_score: 94,
    vegetarian: true,
    high_protein: false
  },
  {
    food_id: 46,
    food_name: "Semangka Merah Segar (200g)",
    category: "fruit",
    meal_type: "snack",
    calories: 60,
    protein_g: 1.2,
    carbohydrate_g: 15,
    fat_g: 0.3,
    fiber_g: 1,
    price_idr: 3500,
    sustainability_score: 95,
    vegetarian: true,
    high_protein: false
  },
  {
    food_id: 47,
    food_name: "Roti Bakar Selai Kacang Alami",
    category: "staple",
    meal_type: "breakfast",
    calories: 230,
    protein_g: 8,
    carbohydrate_g: 26,
    fat_g: 11,
    fiber_g: 3.8,
    price_idr: 7500,
    sustainability_score: 84,
    vegetarian: true,
    high_protein: false
  },
  {
    food_id: 48,
    food_name: "Omelet Bayam Keju Rendah Lemak",
    category: "protein",
    meal_type: "breakfast",
    calories: 170,
    protein_g: 14,
    carbohydrate_g: 2.5,
    fat_g: 11.5,
    fiber_g: 1.2,
    price_idr: 9e3,
    sustainability_score: 71,
    vegetarian: true,
    high_protein: true
  },
  {
    food_id: 49,
    food_name: "Rawon Daging Sapi Kuah Tipis",
    category: "protein",
    meal_type: "dinner",
    calories: 220,
    protein_g: 19,
    carbohydrate_g: 5,
    fat_g: 13,
    fiber_g: 1,
    price_idr: 2e4,
    sustainability_score: 48,
    vegetarian: false,
    high_protein: true
  },
  {
    food_id: 50,
    food_name: "Tumis Buncis Jagung Pipil",
    category: "vegetable",
    meal_type: "dinner",
    calories: 75,
    protein_g: 2.5,
    carbohydrate_g: 12,
    fat_g: 2,
    fiber_g: 3.2,
    price_idr: 4500,
    sustainability_score: 91,
    vegetarian: true,
    high_protein: false
  }
];

// server.ts
import_dotenv.default.config();
var aiClient = null;
function getGeminiClient() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  if (!aiClient) {
    aiClient = new import_genai.GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.get("/api/food-database", (req, res) => {
    res.json({
      total: INITIAL_FOOD_DATABASE.length,
      foods: INITIAL_FOOD_DATABASE
    });
  });
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
      daily_food_budget: 45e3
    });
  });
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, userProfile, nutrition, recommendation } = req.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Pesan tidak boleh kosong." });
      }
      const client = getGeminiClient();
      const profileSummary = userProfile ? `Profil Tenaga Kerja:
- Usia: ${userProfile.age} tahun, Jenis Kelamin: ${userProfile.gender}
- Berat: ${userProfile.weight_kg} kg, Tinggi: ${userProfile.height_cm} cm
- Beban Okupasi: ${userProfile.occupation_type}
- Durasi Jam Kerja: ${userProfile.working_hours}
- Pola Shift: ${userProfile.shift}
- Tingkat Aktivitas Luar Kerja: ${userProfile.physical_activity}
- Durasi Tidur Rata-rata: ${userProfile.average_sleep_hours} jam
- Preferensi Makanan: ${userProfile.food_preference}
- Makanan Dihindari / Alergi: ${userProfile.avoided_foods || "Tidak ada"}
- Budget Makanan Harian: Rp ${userProfile.daily_food_budget?.toLocaleString("id-ID")}` : "Profil Pengguna: Belum diisi (gunakan parameter umum pekerja Indonesia)";
      const nutritionSummary = nutrition ? `Target Gizi Presisi:
- BMR: ${nutrition.bmr} kkal
- TDEE / Target Kalori Harian: ${nutrition.daily_calories} kkal
- Target Protein: ${nutrition.target_protein_g} gram
- Target Karbohidrat: ${nutrition.target_carb_g} gram
- Target Lemak Sehat: ${nutrition.target_fat_g} gram
- Target Serat: ${nutrition.target_fiber_g} gram
- Status IMT: ${nutrition.bmi} kg/m\xB2 (${nutrition.bmi_category})` : "";
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
        const candidateModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
        for (const modelName of candidateModels) {
          try {
            const response = await client.models.generateContent({
              model: modelName,
              contents: message,
              config: {
                systemInstruction,
                temperature: 0.7
              }
            });
            const replyText = response.text || "Mohon maaf, tidak ada respon yang dapat dihasilkan.";
            return res.json({ reply: replyText, source: "gemini" });
          } catch (modelError) {
            const statusCode = modelError?.status || modelError?.statusCode || modelError?.error?.code;
            console.log(`Model ${modelName} unavailable (status ${statusCode}), trying fallback...`);
          }
        }
        console.log("Remote models busy, engaging intelligent domain nutrition engine.");
      }
      const lower = message.toLowerCase();
      let fallbackReply = "";
      if (lower.includes("shift") || lower.includes("malam") || lower.includes("begah") || lower.includes("tidur")) {
        fallbackReply = `### \u{1F319} Panduan Gizi & Ritme Sirkadian Shift Malam
Berdasarkan profil Anda dengan shift **${userProfile?.shift || "Malam"}**:

1. **Sebelum Masuk Shift (Pre-Shift: 18:00 - 19:30 WIB)**:
   - Konsumsi makanan utama dengan porsi 30\u201335% dari target kalori (${nutrition ? Math.round(nutrition.daily_calories * 0.3) : "600"} kkal).
   - Pilih karbohidrat kompleks (nasi merah, kentang, atau oatmeal) + protein tinggi (telur/tempe) agar pelepasan energi stabil.

2. **Tengah Malam (Mid-Shift: 00:00 - 02:00 WIB)**:
   - Konsumsi porsi ringan (20\u201325% kalori). Hindari gorengan berlemak jenuh tinggi karena pada jam biologis ini enzim lipase dan motilitas usus menurun.
   - Pilihan ideal: Sup sayur hangat, tahu kukus, atau pisang ambon.

3. **Menjelang Istirahat Tidur (Post-Shift: 06:30 - 07:30 WIB)**:
   - Hindari karbohidrat sederhana berindeks glikemik tinggi agar tidak terjadi lonjakan gula darah yang mengganggu fase tidur REM.
   - Pilihan ideal: Susu kedelai hangat tanpa gula atau sepotong pepaya/apel.

*Tips Kafein*: Hentikan konsumsi kopi minimal **5 jam** sebelum waktu tidur yang direncanakan.`;
      } else if (lower.includes("kopi") || lower.includes("kafein") || lower.includes("ngantuk") || lower.includes("coma")) {
        fallbackReply = `### \u2615 Panduan Manajemen Kafein & Menghindari Food Coma
Untuk mendukung produktivitas kerja tanpa merusak kualitas tidur:

1. **Jendela Konsumsi Kopi Terbaik**:
   - Pukul **09:30 \u2013 11:30** pagi (setelah puncak kortisol alami pagi hari mulai turun).
   - Hindari minum kopi segera setelah bangun tidur karena hormon kortisol tubuh sudah berada di titik tertinggi.

2. **Batas Waktu (*Cut-Off Time*)**:
   - Waktu paruh kafein dalam tubuh adalah 5\u20137 jam. Untuk pekerja reguler yang tidur pukul 22:30, hentikan kopi setelah **pukul 15:00**.

3. **Mencegah "Food Coma" Jam 14:00**:
   - Batasi konsumsi nasi putih berlebih saat makan siang; perbanyak porsi sayur berserat dan protein (ikan/tempe).
   - Minum 1 gelas air mineral dingin dan lakukan *stretching* 3 menit di meja kerja.`;
      } else if (lower.includes("budget") || lower.includes("murah") || lower.includes("hemat") || lower.includes("uang")) {
        fallbackReply = `### \u{1F4B0} Strategi Pemenuhan Gizi Optimal dengan Budget Terjangkau
Dengan batas budget harian Anda (Rp ${userProfile?.daily_food_budget?.toLocaleString("id-ID") || "50.000"}):

1. **Raja Protein Murah Berkualitas**:
   - **Tempe & Tahu**: Biaya Rp 3.000 \u2013 Rp 5.000/porsi memberikan 14\u201320g protein nabati berkualitas tinggi dan isoflavon antioksidan.
   - **Telur Ayam**: Rp 2.500/butir memberikan 6g protein hewani lengkap dengan skor asam amino sempurna (PDCAAS 1.0).
   - **Ikan Kembung / Tongkol**: Lebih terjangkau daripada salmon, namun mengandung asam lemak Omega-3 yang setara untuk fungsi kognitif otak.

2. **Sayuran Lokal Padat Mikronutrien**:
   - Bayam, kangkung, dan daun singkong (Rp 3.000/ikat) kaya akan zat besi untuk mencegah anemia kerja.

3. **Distribusi Anggaran 3 Kali Makan**:
   - Sarapan: Rp 10.000 (Telur rebus + Oatmeal/Ubi + Pisang)
   - Makan Siang: Rp 20.000 (Nasi + Sayur Asem + 2 Tempe Bacem + Ikan Kembung)
   - Makan Malam: Rp 15.000 (Nasi + Tumis Buncis Tahu + Telur Dadar)`;
      } else if (lower.includes("protein") || lower.includes("otot") || lower.includes("berat") || lower.includes("konstruksi")) {
        fallbackReply = `### \u{1F3D7}\uFE0F Optimasi Nutrisi untuk Pekerja Fisik & Beban Berat
Berdasarkan beban okupasi Anda (${userProfile?.occupation_type || "Kerja Fisik"}):

1. **Kebutuhan Protein Harian**:
   - Target protein presisi Anda: **${nutrition?.target_protein_g || 90} gram/hari** (1.4 \u2013 1.6 g/kgBB) untuk memperbaiki mikro-trauma serat otot akibat angkat beban.
   - Distribusikan protein secara merata di 4 waktu makan (20\u201325g protein per sesi) agar sintesis protein otot maksimal.

2. **Cairan & Elektrolit (Pencegah Dehidrasi)**:
   - Pekerja lapangan di iklim tropis membutuhkan 3.5 \u2013 4.5 liter air per hari.
   - Tambahkan sedikit garam atau air kelapa muda alami untuk menggantikan elektrolit natrium dan kalium yang hilang lewat keringat.

3. **Kombinasi Lauk Berenergi Tinggi**:
   - Nasi + Dada Ayam / Telur Rebus + Tempe Goreng + Pisang sebagai sumber kalium pencegah kram otot.`;
      } else {
        fallbackReply = `### \u{1F4A1} Analisis Nutrisi Terintegrasi NUTRI-AI
Halo! Berdasarkan data biometrik Anda (${userProfile?.gender === "Male" ? "Pria" : "Wanita"}, ${userProfile?.age || 26} th, ${userProfile?.occupation_type || "Beban Okupasi Terukur"}):

- **Target Kalori Harian (TDEE)**: **${nutrition?.daily_calories || 2300} kkal**
- **Kebutuhan Protein**: **${nutrition?.target_protein_g || 85} gram**
- **Status IMT**: ${nutrition?.bmi || "Normal"} kg/m\xB2 (${nutrition?.bmi_category || "Normal"})
- **Pola Shift**: ${userProfile?.shift || "Regular"}

**Rekomendasi Spesifik untuk Pertanyaan Anda:**
- Untuk menjaga energi tetap prima sepanjang jam kerja, prioritaskan makanan dengan indeks glikemik rendah-sedang yang diperkaya serat pangan (minimal 25\u201330g/hari).
- Jangan melewatkan waktu sarapan sebelum berangkat kerja untuk mencegah hipoglikemia reaktif saat jam kritis.
- Selalu cukupi hidrasi dengan aturan praktis: 1 gelas air putih setiap 1\u20132 jam selama bekerja.

*Silakan tanyakan secara spesifik mengenai variasi menu, substitusi lauk, atau penyesuaian jadwal makan shift Anda!*`;
      }
      return res.json({ reply: fallbackReply, source: "domain-engine" });
    } catch (err) {
      console.error("Error in /api/ai/chat:", err);
      res.status(500).json({ error: "Terjadi kesalahan internal pada asisten AI." });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
