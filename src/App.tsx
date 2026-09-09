/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, NutritionRequirements, RecommendationResult } from './types';
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

const INITIAL_USER_PROFILE: UserProfile = {
  age: 26,
  gender: 'Male',
  weight_kg: 68,
  height_cm: 172,
  occupation_type: 'Moderate physical work',
  working_hours: '8–10 jam',
  shift: 'Night',
  physical_activity: 'Moderate',
  average_sleep_hours: 6.5,
  food_preference: 'Balanced',
  avoided_foods: '',
  daily_food_budget: 55000,
};

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

      {/* Main Content View */}
      <main className="flex-1 pb-16">
        {currentTab === 'home' && (
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
        )}

        {currentTab === 'assessment' && (
          <AssessmentForm
            initialProfile={userProfile}
            onSubmit={handleProfileSubmit}
          />
        )}

        {currentTab === 'result' && nutrition && recommendation && (
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
        )}

        {currentTab === 'database' && <FoodDatabaseViewer />}

        {currentTab === 'methodology' && <MethodologyView />}

        {currentTab === 'ai-assistant' && (
          <AiNutritionAssistant
            userProfile={userProfile}
            nutrition={nutrition}
            recommendation={recommendation}
            onGoToAssessment={() => {
              setCurrentTab('assessment');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
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
              Katalog Pangan (50)
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
