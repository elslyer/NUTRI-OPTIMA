import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import {
  Sparkles,
  Send,
  Bot,
  User,
  RefreshCw,
  Zap,
  HelpCircle,
  Briefcase,
  Clock,
  Coins,
  HeartPulse,
  Flame,
  Moon,
  ChevronRight,
} from 'lucide-react';
import { UserProfile, NutritionRequirements, RecommendationResult, ChatMessage } from '../types';

interface AiNutritionAssistantProps {
  userProfile: UserProfile;
  nutrition: NutritionRequirements | null;
  recommendation: RecommendationResult | null;
  onGoToAssessment: () => void;
  messages?: ChatMessage[];
  setMessages?: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export const createWelcomeAiMessage = (profile: UserProfile, nut: NutritionRequirements | null): ChatMessage => ({
  id: `welcome-${Date.now()}`,
  sender: 'assistant',
  text: `Halo! Saya **NUTRI-AI**, konsultan interaktif kesehatan tenaga kerja dari platform NUTRI-OPTIMA. 🌿

Saya dirancang khusus untuk mendampingi Anda dalam 3 fokus utama:
1. **Kesehatan & Gizi Fisik**: Pilihan menu lokal hemat, energi stabil tanpa *food coma*, dan target protein harian.
2. **Pengelolaan Stres Kerja**: Meredakan ketegangan mental, menurunkan hormon stres kortisol dengan nutrisi penenang, dan teknik *micro-breaks*.
3. **Mengatasi Rasa Jenuh & Burnout**: Mengembalikan kesegaran dan motivasi saat rutinitas kerja terasa monoton atau lelah fisik/mental.

**Profil Kerja Terpantau:**
- **Okupasi**: ${profile.occupation_type} (${profile.working_hours})
- **Pola Shift**: ${profile.shift}
- **Target Energi (TDEE)**: **${nut ? `${nut.daily_calories} kkal/hari` : '2.300 kkal/hari'}** • Protein: **${nut ? `${nut.target_protein_g} gram` : '85 gram'}**
- **Batas Anggaran**: Rp ${profile.daily_food_budget.toLocaleString('id-ID')}/hari

Bagaimana kondisi fisik dan perasaanmu hari ini? Apakah sedang merasa lelah, stres dengan tumpukan tugas, atau ingin curhat seputar rasa jenuh di tempat kerja?`,
  timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
  source: 'domain-engine',
});

const PRESET_PROMPTS = [
  {
    icon: Flame,
    title: 'Lagi Jenuh & Bosan',
    prompt: 'Pikiran saya lagi terasa jenuh dan penat sekali dengan rutinitas kerja yang monoton hari ini. Bagaimana cara mengembalikan kesegaran mental dan dopamin sehat?',
  },
  {
    icon: HeartPulse,
    title: 'Atasi Stres & Beban Mental',
    prompt: 'Saya merasa sangat stres dan cemas dengan target pekerjaan akhir-akhir ini. Nutrisi dan kebiasaan apa yang efektif menurunkan hormon stres kortisol?',
  },
  {
    icon: Zap,
    title: 'Cegah "Food Coma" Siang',
    prompt: 'Bagaimana cara mencegah rasa kantuk luar biasa (food coma) pada jam 14:00 saat bekerja di kantor setelah makan siang?',
  },
  {
    icon: Coins,
    title: 'Menu Hemat Bergizi',
    prompt: 'Berikan kombinasi menu pangan lokal dengan biaya di bawah Rp 40.000 per hari tapi sudah mencukupi target kalori dan protein pekerja.',
  },
  {
    icon: Moon,
    title: 'Strategi Shift Malam',
    prompt: 'Bagaimana strategi dan pembagian waktu makan untuk pekerja shift malam agar tidak mudah lemas di tempat kerja dan tidak begah saat tidur siang?',
  },
  {
    icon: Clock,
    title: 'Pegal Leher & Pusing',
    prompt: 'Leher kaku dan kepala terasa berat setelah berjam-jam di depan komputer. Apa pertolongan pertama dan peregangan yang tepat?',
  },
];

export const AiNutritionAssistant: React.FC<AiNutritionAssistantProps> = ({
  userProfile,
  nutrition,
  recommendation,
  onGoToAssessment,
  messages: externalMessages,
  setMessages: setExternalMessages,
}) => {
  const [internalMessages, setInternalMessages] = useState<ChatMessage[]>(() => [
    createWelcomeAiMessage(userProfile, nutrition),
  ]);

  const messages = externalMessages || internalMessages;
  const setMessages = setExternalMessages || setInternalMessages;

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetFeedback, setResetFeedback] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleResetChat = () => {
    try {
      localStorage.removeItem('nutri_ai_chat_history');
    } catch {
      // ignore
    }
    const freshWelcome = createWelcomeAiMessage(userProfile, nutrition);
    setMessages([freshWelcome]);
    setResetFeedback(true);
    setTimeout(() => setResetFeedback(false), 3000);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    // Support text-based reset commands
    const lowerCmd = query.toLowerCase().trim();
    if (['reset', 'reset chat', 'reset obrolan', 'clear', 'hapus chat', 'hapus obrolan', 'mulai ulang', '/reset', 'restart'].includes(lowerCmd)) {
      setInputText('');
      handleResetChat();
      return;
    }

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-6).map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
          userProfile,
          nutrition,
          recommendation,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiReply: ChatMessage = {
          id: `msg-${Date.now()}-ai`,
          sender: 'assistant',
          text: data.reply || 'Mohon maaf, terjadi kendala saat memproses jawaban.',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          source: data.source || 'gemini',
        };
        setMessages((prev) => [...prev, aiReply]);
        setIsLoading(false);
        return;
      }
    } catch {
      // Backend not running (e.g. GitHub Pages static hosting or network offline)
      // Gracefully fall through to smart client-side domain engine below
    }

    // Client-side intelligent domain engine (Zero-downtime on GitHub Pages / Static Hosting)
    let fallbackText = '';
    const qLower = query.toLowerCase();

    if (qLower.includes('jenuh') || qLower.includes('bosan') || qLower.includes('gabut') || qLower.includes('penat') || qLower.includes('monoton') || qLower.includes('males')) {
      fallbackText = `### 🌿 Mengatasi Rasa Jenuh & Kelelahan Mental (*Work Burnout*)
Rasa jenuh dan kehilangan gairah di tengah rutinitas kerja adalah sinyal biologis bahwa otak Anda sedang mengalami *mental fatigue* dan membutuhkan jeda penyegaran:

1. **Aturan Jeda 5 Menit (*Active Micro-Break*)**:
   - Berdirilah dari meja kerja, berjalan santai mengambil segelas air dingin, atau basuh wajah dengan air dingin. Perubahan stimulus fisik langsung memicu pelepasan dopamin alami dan meredakan rasa penat.
2. **Kendalikan Beban Stimulus (Metode Pomodoro)**:
   - Jika tugas terasa membosankan dan monoton, pecah tugas menjadi blok-blok kecil 25 menit diselingi istirahat 3 menit.
3. **Penyegaran Neurotransmiter Lewat Camilan Cerdas**:
   - Konsumsi sepotong pisang atau buah berair dingin (jeruk/semangka). Buah segar kaya vitamin C dan elektrolit yang membantu mengembalikan fokus tanpa memicu kantuk.
4. **Relevansi dengan Pekerjaan Anda**:
   - Dengan rutinitas kerja sebagai **${userProfile.occupation_type}** (${userProfile.working_hours}), pastikan ada batasan tegas antara jam kerja dan waktu istirahat pribadi.

*Gimana perasaan dan tingkat energimu sekarang? Apakah rasa jenuhnya lebih karena rutinitas yang monoton atau beban tugas yang terlalu menumpuk?*`;
    } else if (qLower.includes('stres') || qLower.includes('stress') || qLower.includes('burnout') || qLower.includes('mental') || qLower.includes('lelah batin') || qLower.includes('capek') || qLower.includes('cemas')) {
      fallbackText = `### 🧠 Manajemen Stres & Pemulihan Kelelahan Mental Kerja
Menjaga ketahanan mental dan stabilitas emosi di lingkungan kerja adalah kunci produktivitas berkelanjutan:

1. **Jeda Singkat (*Micro-Breaks*) & Teknik Pernapasan 4-7-8**:
   - Tarik napas 4 detik, tahan 7 detik, lalu hembuskan perlahan 8 detik saat merasa kewalahan dengan beban tugas untuk menenangkan sistem saraf simpatik.
   - Luangkan waktu 3 menit setiap 90 menit bekerja untuk mengalihkan pandangan dari layar ke objek jauh.
2. **Dukungan Biokimia Otak Lewat Nutrisi**:
   - **Magnesium & Vitamin B Kompleks**: Membantu meregulasi hormon stres (kortisol). Konsumsi pisang, kacang hijau, tempe, bayam, atau biji-bijian lokal.
   - **Hindari *Sugar Crash***: Kurangi camilan atau minuman manis tinggi gula saat stres, karena lonjakan dan anjloknya insulin justru memicu kecemasan dan rasa lelah berlipat.
3. **Relevansi dengan Profil Okupasi Anda**:
   - Untuk peran **${userProfile.occupation_type}** (${userProfile.working_hours}), pastikan durasi tidur tidak kurang dari 6.5 jam dan jaga asupan air teratur minimal 2.5–3 Liter per hari.

*Apakah saat ini kamu sedang merasakan ketegangan di leher/pundak, atau pikiran terasa penuh? Mau coba panduan relaksasi 2 menit bersama saya?*`;
    } else if (qLower.includes('sakit kepala') || qLower.includes('pusing') || qLower.includes('migrain') || qLower.includes('pegal') || qLower.includes('leher') || qLower.includes('punggung')) {
      fallbackText = `### 🩺 Penanganan Keluhan Sakit Kepala & Pegal Kerja
Sakit kepala tegang (*tension headache*) atau pegal leher saat jam kerja seringkali merupakan sinyal dari kelelahan postural dan kekurangan cairan:

1. **Atasi Dehidrasi Tersembunyi**:
   - Lebih dari 50% pusing ringan di tempat kerja terjadi akibat dehidrasi ringan. Minum 1–2 gelas air mineral segera.
2. **Peregangan Postur Kerja**:
   - Gerakkan leher perlahan ke kiri dan kanan, putar bahu ke belakang 10 kali, dan tarik dagu ke belakang (*chin tuck*) untuk meredakan kompresi servikal.
3. **Asupan Elektrolit Ringan**:
   - Konsumsi sepotong pisang atau buah berair yang mengandung kalium untuk menyeimbangkan tonus neuromuskular.
4. **Catatan Keselamatan**:
   - Jika sakit kepala sangat tajam, mendadak, atau disertai mual hebat/gangguan pandangan, segera beristirahat di ruang kesehatan atau konsultasikan ke dokter.

*Sudah berapa gelas air putih yang kamu minum hari ini? Dan apakah posisi duduk/layar kerjamu sudah sejajar dengan mata?*`;
    } else if (qLower.includes('halo') || qLower.includes('hai') || qLower.includes('pagi') || qLower.includes('siang') || qLower.includes('malam') || qLower.includes('lagi apa') || qLower.includes('kamu siapa')) {
      fallbackText = `### 👋 Halo! Senang Berinteraksi dengan Anda
Saya **NUTRI-AI**, konsultan interaktif kesehatan tenaga kerja dari platform NUTRI-OPTIMA! 🌿

Saya selalu siap mendampingi Anda menjaga **kesehatan fisik, mengelola stres kerja, dan memulihkan rasa jenuh (*burnout*)**. 

- **Profil Kerja Terpantau**: ${userProfile.occupation_type} (${userProfile.working_hours}, shift ${userProfile.shift})
- **Target Energi Harian**: ${nutrition?.daily_calories || 2300} kkal • Protein: ${nutrition?.target_protein_g || 85} gram

Bagaimana kondisi fisik dan perasaan Anda hari ini? Apakah sedang bersemangat, merasa lelah karena tugas menumpuk, atau butuh ide menu makan siang/malam yang sehat dan hemat?`;
    } else if (qLower.includes('game') || qLower.includes('film') || qLower.includes('lelucon') || qLower.includes('joke') || qLower.includes('lucu') || qLower.includes('cerita') || qLower.includes('curhat')) {
      fallbackText = `### 🎮 Santai Sejenak & Jeda dari Rutinitas Kerja
Haha, seru juga topiknya! Obrolan santai dan hiburan memang selingan terbaik untuk menyegarkan pikiran. 

Tapi ngomong-ngomong, saat kamu mencari distraksi santai seperti ini di sela-sela kerja, **apakah ini pertanda pikiranmu lagi merasa jenuh atau penat dengan rutinitas tugas hari ini?**
- Otak pekerja memang secara alami mencari *micro-dopamine* saat rasa jenuh atau stres mulai menumpuk.
- Supaya tidak berlanjut menjadi *burnout* atau badan lemas, jangan lupa imbangi dengan:
  1. **Minum 1 gelas air mineral dingin** untuk mengembalikan hidrasi otak.
  2. **Regangkan bahu dan leher** ke kiri dan kanan selama 30 detik.
  3. **Pilih camilan segar** seperti buah potong atau kacang rebus daripada gorengan berminyak.

*Gimana kondisi badanmu saat ini? Apakah terasa pegal-pegal atau matamu mulai lelah menatap layar?*`;
    } else if (qLower.includes('olahraga') || qLower.includes('workout') || qLower.includes('gym') || qLower.includes('kardio') || qLower.includes('jalan')) {
      fallbackText = `### 🏃 Panduan Olahraga Praktis Bagi Pekerja
Bagi pekerja aktif dengan jadwal harian padat:

1. **Pilihan Waktu Olahraga Sesuai Shift**:
   - Untuk shift **${userProfile.shift}**, waktu ideal adalah 30 menit sebelum memulai jam kerja atau seusai jam kerja sore.
   - Hindari olahraga berat dalam rentang 2 jam sebelum jadwal tidur utama agar suhu tubuh tidak mengganggu melatonin.
2. **Kesesuaian Tuntutan Fisik Kerja**:
   - **Pekerja Duduk / Kantoran**: Utamakan latihan kardio (jalan cepat, joging, skipping) untuk melancarkan sirkulasi pembuluh darah.
   - **Pekerja Industri / Fisik**: Utamakan latihan peregangan fleksibilitas (*stretching*) dan mobilitas punggung bawah guna mencegah cedera muskuloskeletal.
3. **Dukungan Gizi Pemulihan**:
   - Penuhi target protein harian Anda (**${nutrition?.target_protein_g || 85} gram**) untuk menjaga massa otot tetap prima.

*Berapa kali dalam seminggu kamu biasanya sempat berolahraga? Dan jenis olahraga apa yang paling kamu sukai?*`;
    } else if (qLower.includes('shift') || qLower.includes('malam') || qLower.includes('begadang')) {
      fallbackText = `### 🌙 Strategi Nutrisi Ritme Sirkadian (Shift Malam)
Berdasarkan profil shift **${userProfile.shift}** Anda:

1. **Pre-Shift Meal (19.00 - 20.00)**:
   - Konsumsi makanan utama kaya karbohidrat kompleks & protein (contoh: nasi merah/nasi putih 150g + dada ayam/ikan bakar + tumis buncis). Karbohidrat kompleks melepas glukosa bertahap untuk mencegah lemas awal shift.
2. **Mid-Shift Refuel (00.30 - 02.00)**:
   - Hindari makanan berat berlemak tinggi karena motilitas lambung melambat di malam hari. Pilih camilan berprotein tinggi seperti telur rebus, tahu kukus, atau edamame.
3. **Post-Shift Winding Down (06.30 - 07.30)**:
   - Santap sarapan ringan yang kaya triptofan (contoh: pisang + oatmeal atau susu kedelai hangat) untuk memicu sintesis melatonin alami dan tidur nyenyak.

*Kapan biasanya jam tidur utamamu setelah selesai shift malam? Apakah kualitas tidur siangmu selama ini terasa pulas?*`;
    } else if (qLower.includes('kantuk') || qLower.includes('lemas') || qLower.includes('14.00') || qLower.includes('coma')) {
      fallbackText = `### ⚡ Mencegah "Food Coma" & Mengatasi Kantuk Siang
Pekerja sering mengalami penurunan fokus drastis antara jam 13.00 – 15.00:

1. **Kendalikan Beban Glikemik Makan Siang**:
   - Kurangi porsi nasi putih berlebih dan hindari gorengan bertepung tebal yang memicu lonjakan insulin (*reactive hypoglycemia*).
2. **Kombinasi Serat & Asam Lemak Sehat**:
   - Tingkatkan porsi sayuran hijau (bayam, sawi, brokoli) minimal separuh piring (Metode Piring T Kemenkes RI).
3. **Hidrasi & Power Walk**:
   - Minum 1 gelas air mineral dingin dan lakukan peregangan fisik ringan 3–5 menit untuk meningkatkan suplai oksigen serebral.

*Berapa cangkir kopi yang biasa kamu habiskan dalam sehari saat bekerja?*`;
    } else if (qLower.includes('budget') || qLower.includes('hemat') || qLower.includes('murah') || qLower.includes('lauk')) {
      fallbackText = `### 💰 Panduan Lauk Lokal Berprotein Tinggi & Hemat
Dengan pagu anggaran **Rp ${userProfile.daily_food_budget.toLocaleString('id-ID')} / hari**:

1. **Sumber Protein 'Superfood' Indonesia**:
   - **Tempe & Tahu**: Biaya ~Rp 3.000 - Rp 5.000/porsi menyediakan 12–15g protein nabati berkualitas tinggi serta serat prebiotik.
   - **Telur Ayam**: ~Rp 2.500/butir, mengandung 6–7g protein bernilai biologis sempurna (*Biological Value 100*).
   - **Ikan Kembung**: Alternatif terjangkau pengganti salmon dengan kadar asam lemak Omega-3 dan protein yang sebanding (~Rp 8.000 - Rp 10.000/ekor).
2. **Sayur Segar Murah & Padat Gizi**:
   - Sayur bayam jagung bening, tumis kangkung, atau lalapan timun-kemangi (~Rp 3.000/porsi).

*Apakah kamu lebih sering memasak sendiri atau membeli makanan di warung makan/kantin sekitar kantor?*`;
    } else if (qLower.includes('kopi') || qLower.includes('kafein') || qLower.includes('jam')) {
      fallbackText = `### ☕ Panduan Aman Konsumsi Kafein & Waktu Cut-Off
Untuk menjaga performa kerja tanpa merusak kualitas tidur sirkadian:

1. **Waktu Paruh Kafein (*Half-Life*)**:
   - Kafein memiliki waktu paruh 5–7 jam dalam tubuh. 
   - **Batas Terakhir (Cut-Off)**: Hentikan konsumsi kopi minimal **6 jam sebelum jadwal tidur utama Anda**.
2. **Dosis Optimal Pekerja**:
   - Batasi maksimal 2–3 cangkir kopi per hari (~200–300 mg kafein).
   - Hindari kopi instan saset tinggi gula tambahan (*sugar crash*) yang justru memperparah rasa lelah setelah 1 jam.

*Berapa cangkir kopi yang biasa kamu minum dalam sehari?*`;
    } else if (qLower.includes('fisik') || qLower.includes('otot') || qLower.includes('berat') || qLower.includes('stamina')) {
      fallbackText = `### 💪 Nutrisi Pemulihan & Tenaga Pekerja Fisik
Untuk intensitas pekerjaan **${userProfile.occupation_type}**:

1. **Kecukupan Protein Harian**:
   - Kebutuhan protein Anda adalah **${nutrition?.target_protein_g || 90} gram/hari** (1.2–1.6g per kg berat badan) guna mencegah katabolisme otot.
2. **Penggantian Elektrolit & Hidrasi**:
   - Pekerja aktif di iklim tropis membutuhkan 3.5 – 4.5 liter cairan harian. Minum secara teratur setiap 20–30 menit saat bekerja fisik.
3. **Kombinasi Pemulihan**:
   - Konsumsi campuran karbohidrat dan protein dalam rasio 3:1 dalam rentang 1 jam seusai jam kerja fisik (contoh: pisang + susu atau nasi tim telur).

*Apakah pekerjaan fisikmu hari ini banyak terpapar panas matahari langsung atau di dalam ruangan pabrik?*`;
    } else {
      fallbackText = `### 💬 Tanggapan Interaktif NUTRI-AI
Terima kasih atas pertanyaannya! Meskipun topiknya terdengar santai atau sedikit di luar konteks gizi teknis, saya senang bisa berdiskusi dengan Anda.

1. **Menghubungkan dengan Kesejahteraan Pekerja**:
   - Saat kita mengajukan pertanyaan acak atau mencari distraksi di sela rutinitas kerja, sering kali itu sinyal alamiah bahwa **pikiran sedang penat, jenuh, atau butuh penyegaran (*mental break*)**.
   - Menjaga keseimbangan antara fokus kerja, penurunan tingkat stres, dan asupan nutrisi adalah kunci agar kita tidak mudah tumbang (*burnout*).

2. **Dukungan untuk Profil Okupasi Anda**:
   - Sebagai **${userProfile.occupation_type}** dengan jam kerja **${userProfile.working_hours}**, tubuh Anda memerlukan energi harian sekitar **${nutrition?.daily_calories || 2300} kkal** dan protein **${nutrition?.target_protein_g || 85} gram**.
   - Langkah kilat penyegar pikiran: Minum 1 gelas air mineral, tarik napas dalam 3 kali, dan luruskan punggung sejenak.

*Bagaimana kondisi fisik dan perasaanmu hari ini? Apakah pekerjaan sedang terasa cukup menguras energi atau pikiran terasa jenuh?*`;
    }

    const fallbackReply: ChatMessage = {
      id: `msg-${Date.now()}-ai`,
      sender: 'assistant',
      text: fallbackText,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      source: 'domain-engine',
    };
    setMessages((prev) => [...prev, fallbackReply]);
    setIsLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 text-xs font-semibold mb-2 border border-blue-200 dark:border-blue-800">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Interactive AI Workforce Consultant</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Asisten AI Gizi Interaktif NUTRI-OPTIMA
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Konsultasi interaktif seputar gizi okupasi, strategi ritme shift kerja, tips food coma, dan optimasi menu pangan lokal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetChat}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-all cursor-pointer shadow-2xs"
            title="Mulai sesi tanya jawab baru"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Percakapan</span>
          </button>
        </div>
      </div>

      {/* Active Profile Context Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md border border-slate-700/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold flex items-center gap-2 text-white">
              <span>{userProfile.occupation_type}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 font-mono">
                Shift: {userProfile.shift}
              </span>
            </div>
            <div className="text-slate-300 text-[11px] flex items-center gap-2 mt-0.5">
              <span>TDEE Target: <strong className="text-emerald-400">{nutrition?.daily_calories || 2400} kkal</strong></span>
              <span>•</span>
              <span>Protein: <strong className="text-emerald-400">{nutrition?.target_protein_g || 80}g</strong></span>
              <span>•</span>
              <span>Budget: <strong className="text-emerald-400">Rp {userProfile.daily_food_budget.toLocaleString('id-ID')}</strong></span>
            </div>
          </div>
        </div>

        <button
          onClick={onGoToAssessment}
          className="text-xs text-emerald-300 hover:text-white font-medium underline flex items-center gap-1"
        >
          <span>Ubah Profil &rarr;</span>
        </button>
      </div>

      {/* Quick Prompt Selector Chips */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Pertanyaan Cepat Seputar Gizi Tenaga Kerja</span>
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {PRESET_PROMPTS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSendMessage(item.prompt)}
                disabled={isLoading}
                className="p-3 text-left rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-xs transition-all flex items-start gap-2.5 group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {item.prompt}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Window */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col h-[560px] overflow-hidden">
        {/* Chat Window Top Bar with Consultant Status & Reset Button */}
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>NUTRI-AI Workforce Consultant</span>
                <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                  Kesehatan • Stres • Jenuh
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Konsultasi interaktif & solutif untuk pekerja Indonesia
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {resetFeedback && (
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                ✓ Obrolan direset!
              </span>
            )}
            <button
              onClick={handleResetChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-800 transition-all cursor-pointer shadow-2xs"
              title="Hapus riwayat obrolan dan mulai sesi baru"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Obrolan</span>
            </button>
          </div>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-br-xs shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80 rounded-bl-xs'
                  }`}
                >
                  {/* Message Header */}
                  <div
                    className={`flex items-center justify-between gap-3 text-[10px] pb-1.5 mb-1.5 border-b ${
                      isUser
                        ? 'border-emerald-500 text-emerald-100'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <span className="font-bold">
                      {isUser ? 'Anda (Pekerja)' : 'NUTRI-AI Consultant'}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Body Text */}
                  <div className={`markdown-body text-xs sm:text-sm leading-relaxed ${isUser ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>
                    <Markdown
                      components={{
                        h3: ({ node, ...props }) => (
                          <h3 className={`font-extrabold text-sm sm:text-base mt-2 mb-1.5 pb-1 border-b ${isUser ? 'border-white/20 text-white' : 'border-slate-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-400'}`} {...props} />
                        ),
                        h4: ({ node, ...props }) => (
                          <h4 className={`font-bold text-xs sm:text-sm mt-2 mb-1 ${isUser ? 'text-white' : 'text-emerald-700 dark:text-emerald-400'}`} {...props} />
                        ),
                        strong: ({ node, ...props }) => (
                          <strong className={`font-black ${isUser ? 'text-white underline decoration-white/50' : 'text-slate-900 dark:text-white'}`} {...props} />
                        ),
                        p: ({ node, ...props }) => (
                          <p className="leading-relaxed mb-2.5 last:mb-0" {...props} />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul className="list-disc pl-5 space-y-1 mb-2.5" {...props} />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol className="list-decimal pl-5 space-y-1 mb-2.5" {...props} />
                        ),
                        li: ({ node, ...props }) => (
                          <li className="leading-relaxed" {...props} />
                        ),
                        blockquote: ({ node, ...props }) => (
                          <blockquote className={`border-l-2 pl-3 py-1 italic text-xs my-2 ${isUser ? 'border-white/60 text-white/90' : 'border-emerald-500 text-slate-600 dark:text-slate-300'}`} {...props} />
                        ),
                      }}
                    >
                      {msg.text}
                    </Markdown>
                  </div>

                  {/* Source indicator for assistant */}
                  {!isUser && msg.source && (
                    <div className="pt-2 mt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1.5 text-[10px] text-slate-400">
                      <Sparkles className="w-3 h-3 text-emerald-500" />
                      <span>
                        {msg.source === 'gemini'
                          ? 'Diberdayakan oleh Gemini 3.8 Flash'
                          : 'Mesin Pengetahuan Gizi Okupasi NUTRI-OPTIMA'}
                      </span>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl rounded-bl-xs p-4 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                </div>
                <span>NUTRI-AI sedang merumuskan analisis gizi presisi Anda...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
          {/* Quick Interactive Shortcuts */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap flex items-center gap-1 pr-1">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              <span>Pilihan Cepat:</span>
            </span>
            <button
              type="button"
              onClick={() => handleSendMessage('Pikiran saya lagi jenuh banget dengan rutinitas kerja hari ini, bagaimana cara mengatasinya?')}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs whitespace-nowrap cursor-pointer transition-all active:scale-95"
            >
              🌿 Lagi Jenuh Kerja
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage('Saya merasa stres dan cemas dengan deadline tugas. Minta tips relaksasi dan asupan pereda stres.')}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs whitespace-nowrap cursor-pointer transition-all active:scale-95"
            >
              🧘 Cara Atasi Stres
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage('Bagaimana cara mengatasi kantuk berat dan lemas setelah jam 13:00 siang?')}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs whitespace-nowrap cursor-pointer transition-all active:scale-95"
            >
              ⚡ Cegah Food Coma
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage('Rekomendasi menu pangan lokal murah kaya protein untuk pekerja')}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs whitespace-nowrap cursor-pointer transition-all active:scale-95"
            >
              💰 Menu Sehat Hemat
            </button>
            <button
              type="button"
              onClick={handleResetChat}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-xs whitespace-nowrap cursor-pointer transition-all flex items-center gap-1 font-medium active:scale-95"
              title="Hapus riwayat obrolan dan mulai sesi baru"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Obrolan</span>
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              id="ai-chat-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tanyakan hal apa pun: stres kerja, rasa jenuh, tips energi, atau ketik 'reset'..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
            <button
              id="ai-chat-send-btn"
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            >
              <span>Kirim</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="text-[10px] text-slate-400 mt-1 text-center">
            NUTRI-AI: Konsultan interaktif tenaga kerja untuk kesehatan, manajemen stres, dan pemulihan kejenuhan (<strong className="font-semibold text-slate-600 dark:text-slate-300">burnout</strong>).
          </div>
        </div>
      </div>
    </div>
  );
};
