import React, { useState, useRef, useEffect } from 'react';
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
import { UserProfile, NutritionRequirements, RecommendationResult } from '../types';

interface AiNutritionAssistantProps {
  userProfile: UserProfile;
  nutrition: NutritionRequirements | null;
  recommendation: RecommendationResult | null;
  onGoToAssessment: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: 'gemini' | 'domain-engine';
}

const PRESET_PROMPTS = [
  {
    icon: Moon,
    title: 'Strategi Shift Malam',
    prompt: 'Bagaimana strategi dan pembagian waktu makan untuk pekerja shift malam agar tidak mudah lemas di tempat kerja dan tidak begah saat tidur siang?',
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
    icon: Briefcase,
    title: 'Menu Pekerja Fisik Berat',
    prompt: 'Apa saja rekomendasi lauk padat nutrisi dan elektrolit alami untuk mencegah kram otot bagi pekerja fisik berat atau proyek lapangan?',
  },
  {
    icon: Clock,
    title: 'Panduan Waktu Kafein',
    prompt: 'Kapan waktu paling efektif minum kopi selama jam kerja agar fokus tetap terjaga tanpa mengganggu kualitas tidur di malam hari?',
  },
];

export const AiNutritionAssistant: React.FC<AiNutritionAssistantProps> = ({
  userProfile,
  nutrition,
  recommendation,
  onGoToAssessment,
}) => {
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `Halo! Saya **NUTRI-AI**, konsultan kecerdasan buatan spesialis gizi okupasi dan kesehatan tenaga kerja dari platform NUTRI-OPTIMA.

Saya telah memuat data profil kerja Anda:
- **Okupasi**: ${userProfile.occupation_type} (${userProfile.working_hours})
- **Pola Shift**: ${userProfile.shift}
- **Target Energi (TDEE)**: ${nutrition ? `${nutrition.daily_calories} kkal/hari` : 'Terhitung otomatis'}
- **Target Protein**: ${nutrition ? `${nutrition.target_protein_g} gram` : 'Optimal'}
- **Anggaran Pangan Harian**: Rp ${userProfile.daily_food_budget.toLocaleString('id-ID')}

Silakan pilih topik cepat di bawah atau ajukan pertanyaan spesifik terkait penyesuaian jadwal makan, pilihan lauk lokal hemat, mengatasi kelelahan lembur, atau substitusi menu!`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      source: 'domain-engine',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
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
          userProfile,
          nutrition,
          recommendation,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiReply: Message = {
        id: `msg-${Date.now()}-ai`,
        sender: 'assistant',
        text: data.reply || 'Mohon maaf, terjadi kendala saat memproses jawaban.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        source: data.source || 'gemini',
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (error) {
      console.error('Error contacting AI assistant API:', error);
      // Client-side fallback if server fails
      const fallbackReply: Message = {
        id: `msg-${Date.now()}-ai`,
        sender: 'assistant',
        text: `### 💡 Panduan Gizi Presisi NUTRI-AI
Berdasarkan profil Anda (${userProfile.occupation_type}, Shift ${userProfile.shift}):

1. **Keseimbangan Energi**: Target kalori harian Anda adalah **${nutrition?.daily_calories || 2400} kkal** dengan **${nutrition?.target_protein_g || 80}g protein**.
2. **Prioritas Pangan Lokal**: Penuhi kebutuhan ini dengan kombinasi telur rebus (sarapan), tempe/tahu bacem dan sayur asem (siang), serta ikan kembung (malam).
3. **Tips Hidrasi**: Pastikan asupan minimal 2.5–3 Liter air mineral per hari, terutama bagi pekerja fisik untuk mencegah dehidrasi dan penurunan performa kerja.`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        source: 'domain-engine',
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: `Percakapan telah direset. Saya siap membantu konsultasi gizi kerja, perencanaan menu berbasis budget Rp ${userProfile.daily_food_budget.toLocaleString('id-ID')}, atau panduan ritme sirkadian shift ${userProfile.shift} Anda. Ada yang ingin Anda diskusikan?`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        source: 'domain-engine',
      },
    ]);
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
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col h-[520px] overflow-hidden">
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
                  <div className="whitespace-pre-line space-y-2">
                    {msg.text.split('\n\n').map((paragraph, pIdx) => {
                      if (paragraph.startsWith('### ')) {
                        return (
                          <h4 key={pIdx} className="font-bold text-sm text-emerald-800 dark:text-emerald-400 pt-1">
                            {paragraph.replace('### ', '')}
                          </h4>
                        );
                      }
                      return (
                        <p key={pIdx} className="leading-relaxed">
                          {paragraph}
                        </p>
                      );
                    })}
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
        <div className="p-3 sm:p-4 bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800">
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
              placeholder="Tanyakan rekomendasi makanan, tips shift malam, atau variasi menu lokal..."
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
          <div className="text-[10px] text-slate-400 mt-1.5 text-center">
            NUTRI-AI dirancang khusus sebagai panduan pendukung gizi tenaga kerja berbasis biometrik dan bukti kedokteran okupasi.
          </div>
        </div>
      </div>
    </div>
  );
};
