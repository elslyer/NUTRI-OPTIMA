/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, NutritionRequirements, RecommendationResult, ChatMessage } from './types';
import { calculateNutritionRequirements } from './utils/nutritionEngine';
import { generateRecommendation } from './utils/aiEngine';
import { Navbar } from './components/Navbar';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { LandingPage } from './components/LandingPage';
import { AssessmentForm } from './components/AssessmentForm';
import { ResultDashboard } from './components/ResultDashboard';
import { FoodDatabaseViewer } from './components/FoodDatabaseViewer';
import { MethodologyView } from './components/MethodologyView';
import { AiNutritionAssistant } from './components/AiNutritionAssistant';
import { OfflineIndicator } from './components/OfflineIndicator';

const INITIAL_USER_PROFILE: UserProfile = {
  age: 26,
  gender: 'Male',
  weight_kg: 68,
  height_cm: 172,
  occupation_type: 'Industrial Worker',
  work_intensity: 'Moderate',
  working_hours: '8 hours/day',
  shift: 'Night Shift',
  physical_activity: 'Moderate',
  average_sleep_hours: 6.5,
  food_preference: 'Balanced',
  avoided_foods: '',
  daily_food_budget: 55000,
};

export const createInitialAiMessages = (profile: UserProfile, nut: NutritionRequirements | null): ChatMessage[] => [
  {
    id: 'welcome-1',
    sender: 'assistant',
    text: `Halo! Saya **NUTRI-AI**, konsultan interaktif kesehatan tenaga kerja dari platform NUTRI-OPTIMA. 🌿

Saya dirancang khusus untuk mendampingi Anda dalam 3 fokus utama:
1. **Kesehatan & Gizi Fisik**: Pilihan menu lokal hemat, energi stabil tanpa *food coma*, dan pemenuhan target protein harian.
2. **Pengelolaan Stres Kerja**: Meredakan ketegangan mental, menurunkan hormon stres kortisol dengan asupan nutrisi penenang, dan teknik *micro-breaks*.
3. **Mengatasi Rasa Jenuh & Burnout**: Mengembalikan kesegaran dan motivasi saat rutinitas kerja terasa monoton atau lelah fisik/mental.

**Profil Kerja Terpantau:**
- **Okupasi**: ${profile.occupation_type} (${profile.working_hours})
- **Pola Shift**: ${profile.shift}
- **Target Energi (TDEE)**: **${nut ? `${nut.daily_calories} kkal/hari` : '2.300 kkal/hari'}** • Protein: **${nut ? `${nut.target_protein_g} gram` : '85 gram'}**
- **Batas Anggaran**: Rp ${profile.daily_food_budget.toLocaleString('id-ID')}/hari

Bagaimana kondisi fisik dan perasaanmu hari ini? Apakah sedang merasa lelah, stres dengan tumpukan tugas, atau ingin curhat seputar rasa jenuh di tempat kerja?`,
    timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    source: 'domain-engine',
  },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<
    'home' | 'assessment' | 'result' | 'database' | 'methodology' | 'ai-assistant'
  >('home');

  // Theme state: dark / light mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('nutri-optima-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('nutri-optima-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('nutri-optima-theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [nutrition, setNutrition] = useState<NutritionRequirements | null>(() =>
    calculateNutritionRequirements(INITIAL_USER_PROFILE)
  );
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(() => {
    const initNut = calculateNutritionRequirements(INITIAL_USER_PROFILE);
    return generateRecommendation(INITIAL_USER_PROFILE, initNut);
  });

  // Persistent AI Assistant chat history: never resets when switching tabs/icons
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('nutri_ai_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    const initNut = calculateNutritionRequirements(INITIAL_USER_PROFILE);
    return createInitialAiMessages(INITIAL_USER_PROFILE, initNut);
  });

  useEffect(() => {
    try {
      localStorage.setItem('nutri_ai_chat_history', JSON.stringify(aiMessages));
    } catch {
      // ignore
    }
  }, [aiMessages]);

  const handleProfileSubmit = (profile: UserProfile) => {
    setUserProfile(profile);
    const nutTarget = calculateNutritionRequirements(profile);
    setNutrition(nutTarget);
    const recResult = generateRecommendation(profile, nutTarget);
    setRecommendation(recResult);
    setCurrentTab('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'} transition-colors duration-200 font-sans antialiased selection:bg-emerald-500 selection:text-white`}>
      {/* Navigation Bar with Dark / Light toggle */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        hasResult={recommendation !== null}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Medical & Occupational Disclaimer */}
      <DisclaimerBanner />

      {/* Connectivity & Offline Status Indicator */}
      <OfflineIndicator />

      {/* Main Content View with Smooth Tab Transitions */}
      <main className="flex-1 pb-16">
        <AnimatePresence mode="wait">
          {currentTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <LandingPage
                onStartAssessment={() => {
                  setCurrentTab('assessment');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onViewDatabase={() => {
                  setCurrentTab('database');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onViewMethodology={() => {
                  setCurrentTab('methodology');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onViewAiAssistant={() => {
                  setCurrentTab('ai-assistant');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </motion.div>
          )}

          {currentTab === 'assessment' && (
            <motion.div
              key="assessment"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <AssessmentForm
                initialProfile={userProfile}
                onSubmit={handleProfileSubmit}
              />
            </motion.div>
          )}

          {currentTab === 'result' && nutrition && recommendation && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <ResultDashboard
                userProfile={userProfile}
                nutrition={nutrition}
                recommendation={recommendation}
                onRecalculate={() => {
                  setCurrentTab('assessment');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onViewDatabase={() => {
                  setCurrentTab('database');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onViewAiAssistant={() => {
                  setCurrentTab('ai-assistant');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onViewMethodology={() => {
                  setCurrentTab('methodology');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </motion.div>
          )}

          {currentTab === 'database' && (
            <motion.div
              key="database"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <FoodDatabaseViewer />
            </motion.div>
          )}

          {currentTab === 'methodology' && (
            <motion.div
              key="methodology"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <MethodologyView />
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Assistant view kept mounted so tab/icon switches never reset the conversation */}
        <div className={currentTab === 'ai-assistant' ? 'block' : 'hidden'}>
          <AiNutritionAssistant
            userProfile={userProfile}
            nutrition={nutrition}
            recommendation={recommendation}
            messages={aiMessages}
            setMessages={setAiMessages}
            onGoToAssessment={() => {
              setCurrentTab('assessment');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-8 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-extrabold text-white text-sm">NUTRI-OPTIMA</span>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Nutrition Optimization for Workforce &bull; Platform Rekomendasi Gizi Presisi Tenaga Kerja
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <button
              onClick={() => setCurrentTab('methodology')}
              className="hover:text-emerald-400 transition-colors"
            >
              Metodologi & Formula
            </button>
            <button
              onClick={() => setCurrentTab('database')}
              className="hover:text-emerald-400 transition-colors"
            >
              Katalog Pangan (100)
            </button>
            <button
              onClick={() => setCurrentTab('ai-assistant')}
              className="hover:text-emerald-400 transition-colors"
            >
              Asisten AI Gizi
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
