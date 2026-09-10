import React, { useState, useMemo } from 'react';
import { INITIAL_FOOD_DATABASE } from '../data/foodDatabase';
import { FoodItem } from '../types';
import {
  Search,
  Database,
  Leaf,
  Sparkles,
  Grid,
  List,
  Flame,
  Wheat,
  Fish,
  Salad,
  Apple,
  Cookie,
  Coffee,
  X,
  CheckCircle2,
  TrendingUp,
  Tag,
  Clock,
  ShieldCheck,
  ChevronRight,
  Zap,
} from 'lucide-react';

interface CategoryConfig {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  bgLight: string;
  bgDark: string;
  borderColor: string;
}

const CATEGORIES: CategoryConfig[] = [
  {
    id: 'all',
    label: 'Semua Kategori',
    icon: Database,
    color: 'text-emerald-700 dark:text-emerald-300',
    bgLight: 'bg-emerald-50',
    bgDark: 'dark:bg-emerald-950/60',
    borderColor: 'border-emerald-300 dark:border-emerald-800',
  },
  {
    id: 'staple',
    label: 'Makanan Pokok',
    icon: Wheat,
    color: 'text-amber-700 dark:text-amber-300',
    bgLight: 'bg-amber-50',
    bgDark: 'dark:bg-amber-950/60',
    borderColor: 'border-amber-300 dark:border-amber-800',
  },
  {
    id: 'protein',
    label: 'Lauk Protein',
    icon: Fish,
    color: 'text-indigo-700 dark:text-indigo-300',
    bgLight: 'bg-indigo-50',
    bgDark: 'dark:bg-indigo-950/60',
    borderColor: 'border-indigo-300 dark:border-indigo-800',
  },
  {
    id: 'vegetable',
    label: 'Sayuran Hijau',
    icon: Salad,
    color: 'text-emerald-700 dark:text-emerald-300',
    bgLight: 'bg-emerald-50',
    bgDark: 'dark:bg-emerald-950/60',
    borderColor: 'border-emerald-300 dark:border-emerald-800',
  },
  {
    id: 'fruit',
    label: 'Buah Segar',
    icon: Apple,
    color: 'text-rose-700 dark:text-rose-300',
    bgLight: 'bg-rose-50',
    bgDark: 'dark:bg-rose-950/60',
    borderColor: 'border-rose-300 dark:border-rose-800',
  },
  {
    id: 'snack',
    label: 'Camilan Sehat',
    icon: Cookie,
    color: 'text-orange-700 dark:text-orange-300',
    bgLight: 'bg-orange-50',
    bgDark: 'dark:bg-orange-950/60',
    borderColor: 'border-orange-300 dark:border-orange-800',
  },
  {
    id: 'drink',
    label: 'Minuman Kerja',
    icon: Coffee,
    color: 'text-cyan-700 dark:text-cyan-300',
    bgLight: 'bg-cyan-50',
    bgDark: 'dark:bg-cyan-950/60',
    borderColor: 'border-cyan-300 dark:border-cyan-800',
  },
];

type QuickFilter = 'all' | 'high-protein' | 'budget' | 'vegetarian' | 'super-eco';

export const FoodDatabaseViewer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');
  const [sortBy, setSortBy] = useState<'calories' | 'protein' | 'price' | 'sustainability' | 'protein-cost'>('protein');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [inspectFood, setInspectFood] = useState<FoodItem | null>(null);

  // Database aggregate stats
  const stats = useMemo(() => {
    const total = INITIAL_FOOD_DATABASE.length;
    const avgPrice = Math.round(
      INITIAL_FOOD_DATABASE.reduce((acc, curr) => acc + curr.price_idr, 0) / total
    );
    const avgEco = (
      INITIAL_FOOD_DATABASE.reduce((acc, curr) => acc + curr.sustainability_score, 0) / total
    ).toFixed(1);
    const highestProtein = [...INITIAL_FOOD_DATABASE].sort((a, b) => b.protein_g - a.protein_g)[0];

    return { total, avgPrice, avgEco, highestProtein };
  }, []);

  const filteredFoods = useMemo(() => {
    return INITIAL_FOOD_DATABASE.filter((food) => {
      const matchSearch =
        food.food_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        food.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCategory === 'all' || food.category === selectedCategory;

      let matchQuick = true;
      if (quickFilter === 'high-protein') matchQuick = food.protein_g >= 12;
      else if (quickFilter === 'budget') matchQuick = food.price_idr <= 6000;
      else if (quickFilter === 'vegetarian') matchQuick = food.vegetarian;
      else if (quickFilter === 'super-eco') matchQuick = food.sustainability_score >= 90;

      return matchSearch && matchCat && matchQuick;
    }).sort((a, b) => {
      if (sortBy === 'calories') return b.calories - a.calories;
      if (sortBy === 'protein') return b.protein_g - a.protein_g;
      if (sortBy === 'price') return a.price_idr - b.price_idr;
      if (sortBy === 'sustainability') return b.sustainability_score - a.sustainability_score;
      if (sortBy === 'protein-cost') {
        const costPerGA = a.protein_g > 0 ? a.price_idr / a.protein_g : 99999;
        const costPerGB = b.protein_g > 0 ? b.price_idr / b.protein_g : 99999;
        return costPerGA - costPerGB;
      }
      return 0;
    });
  }, [searchTerm, selectedCategory, quickFilter, sortBy]);

  // Helper for category badge visual
  const getCategoryTheme = (category: string) => {
    return (
      CATEGORIES.find((c) => c.id === category) || {
        color: 'text-slate-700 dark:text-slate-300',
        bgLight: 'bg-slate-100',
        bgDark: 'dark:bg-slate-800',
        borderColor: 'border-slate-200 dark:border-slate-700',
        label: category,
      }
    );
  };

  // Helper for macro percentage calculation
  const getMacroPercentages = (food: FoodItem) => {
    const proteinKcal = food.protein_g * 4;
    const carbKcal = food.carbohydrate_g * 4;
    const fatKcal = food.fat_g * 9;
    const totalKcal = Math.max(1, proteinKcal + carbKcal + fatKcal);

    return {
      proteinPct: Math.round((proteinKcal / totalKcal) * 100),
      carbPct: Math.round((carbKcal / totalKcal) * 100),
      fatPct: Math.round((fatKcal / totalKcal) * 100),
    };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header section with branding & stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-2 border border-emerald-200 dark:border-emerald-800">
            <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Katalog Gizi Nusantara • Standar Kemenkes RI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Katalog 50 Pangan Lokal Pekerja Indonesia
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Basis data pangan lokal yang dirancang khusus untuk optimasi gizi tenaga kerja: memadukan makronutrien, estimasi harga riil per porsi, dan indeks jejak karbon keberlanjutan lingkungan.
          </p>
        </div>

        {/* View Toggle (Grid vs Table) */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
            title="Tampilan Kartu Interaktif"
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Kartu Visual</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
            title="Tampilan Tabel Analitis Komparatif"
          >
            <List className="w-3.5 h-3.5" />
            <span>Tabel Data</span>
          </button>
        </div>
      </div>

      {/* Dynamic Mini-Metrics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex-shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Total Pangan Lokal</span>
            <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              {stats.total} <span className="text-xs font-normal text-slate-500">Pilihan</span>
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex-shrink-0">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Rata-Rata Harga / Porsi</span>
            <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              Rp {stats.avgPrice.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex-shrink-0">
            <Fish className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Protein Tertinggi</span>
            <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate block">
              {stats.highestProtein.protein_g}g <span className="text-xs font-normal text-slate-500">({stats.highestProtein.food_name.split(' ')[0]})</span>
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 flex items-center justify-center text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800 flex-shrink-0">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Rata-Rata Eco Score</span>
            <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              {stats.avgEco} <span className="text-xs font-normal text-teal-600 dark:text-teal-400">/ 100</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Cari bahan makanan (misal: Tempe, Telur, Pisang, Nasi)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
              Urutkan:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all cursor-pointer font-medium"
            >
              <option value="protein">🔥 Protein Tertinggi</option>
              <option value="calories">⚡ Kalori Tertinggi</option>
              <option value="price">💰 Harga Termurah</option>
              <option value="protein-cost">🏆 Efisiensi Protein / Rupiah</option>
              <option value="sustainability">🌿 Sustainability Score</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const count =
              cat.id === 'all'
                ? INITIAL_FOOD_DATABASE.length
                : INITIAL_FOOD_DATABASE.filter((f) => f.category === cat.id).length;
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-700/20'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 hover:bg-emerald-50/40 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive
                      ? 'bg-emerald-700 text-emerald-100'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Attribute Filter Badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mr-1 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500" />
            Filter Cepat:
          </span>
          <button
            onClick={() => setQuickFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
              quickFilter === 'all'
                ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setQuickFilter('high-protein')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1 ${
              quickFilter === 'high-protein'
                ? 'bg-indigo-600 text-white font-bold'
                : 'text-indigo-700 dark:text-indigo-400 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 hover:bg-indigo-100'
            }`}
          >
            <span>🔥 Protein Tinggi (&ge;12g)</span>
          </button>
          <button
            onClick={() => setQuickFilter('budget')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1 ${
              quickFilter === 'budget'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-emerald-700 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 hover:bg-emerald-100'
            }`}
          >
            <span>💰 Super Hemat (&le;Rp 6.000)</span>
          </button>
          <button
            onClick={() => setQuickFilter('vegetarian')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1 ${
              quickFilter === 'vegetarian'
                ? 'bg-teal-600 text-white font-bold'
                : 'text-teal-700 dark:text-teal-400 bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 hover:bg-teal-100'
            }`}
          >
            <span>🌱 100% Nabati</span>
          </button>
          <button
            onClick={() => setQuickFilter('super-eco')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1 ${
              quickFilter === 'super-eco'
                ? 'bg-green-600 text-white font-bold'
                : 'text-green-700 dark:text-green-400 bg-green-50/60 dark:bg-green-950/40 border border-green-200 dark:border-green-900 hover:bg-green-100'
            }`}
          >
            <span>🌿 Eco Champion (&ge;90)</span>
          </button>

          <span className="ml-auto text-[11px] font-semibold text-slate-500">
            Menampilkan <strong className="text-slate-800 dark:text-slate-200">{filteredFoods.length}</strong> dari {INITIAL_FOOD_DATABASE.length} item
          </span>
        </div>
      </div>

      {/* Display content: Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredFoods.map((food) => {
            const theme = getCategoryTheme(food.category);
            const macros = getMacroPercentages(food);
            const proteinCost =
              food.protein_g > 0 ? Math.round(food.price_idr / food.protein_g) : null;

            return (
              <div
                key={food.food_id}
                onClick={() => setInspectFood(food)}
                className="group bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600/70 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between cursor-pointer relative overflow-hidden"
              >
                {/* Top tag & Price */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${theme.bgLight} ${theme.bgDark} ${theme.color} ${theme.borderColor}`}
                    >
                      {food.category}
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                      Rp {food.price_idr.toLocaleString('id-ID')}
                    </span>
                  </div>

                  {/* Food Name */}
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-2">
                    {food.food_name}
                  </h4>

                  {/* Visual Macro Bar (Caloric Contribution) */}
                  <div className="mb-3 space-y-1">
                    <div className="flex justify-between text-[9px] font-semibold text-slate-400">
                      <span>Rasio Kalori:</span>
                      <span className="space-x-1.5 font-mono">
                        <span className="text-indigo-600 dark:text-indigo-400">P:{macros.proteinPct}%</span>
                        <span className="text-amber-600 dark:text-amber-400">K:{macros.carbPct}%</span>
                        <span className="text-rose-500">L:{macros.fatPct}%</span>
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full flex overflow-hidden">
                      <div
                        style={{ width: `${macros.proteinPct}%` }}
                        className="bg-indigo-500 h-full"
                        title={`Protein: ${macros.proteinPct}% kalori`}
                      />
                      <div
                        style={{ width: `${macros.carbPct}%` }}
                        className="bg-amber-400 h-full"
                        title={`Karbohidrat: ${macros.carbPct}% kalori`}
                      />
                      <div
                        style={{ width: `${macros.fatPct}%` }}
                        className="bg-rose-400 h-full"
                        title={`Lemak: ${macros.fatPct}% kalori`}
                      />
                    </div>
                  </div>

                  {/* Macro Numbers Grid */}
                  <div className="grid grid-cols-4 gap-1 text-center p-2 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 mb-3">
                    <div>
                      <span className="text-slate-400 block text-[9px]">Kalori</span>
                      <strong className="text-emerald-700 dark:text-emerald-400 text-xs">
                        {food.calories}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">Protein</span>
                      <strong className="text-indigo-700 dark:text-indigo-400 text-xs">
                        {food.protein_g}g
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">Karbo</span>
                      <strong className="text-amber-700 dark:text-amber-400 text-xs">
                        {food.carbohydrate_g}g
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">Lemak</span>
                      <strong className="text-rose-600 dark:text-rose-400 text-xs">
                        {food.fat_g}g
                      </strong>
                    </div>
                  </div>

                  {/* Extra micro-badges: Protein efficiency or Fiber */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 mb-2">
                    {proteinCost && proteinCost < 500 && (
                      <span className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-900">
                        ⚡ Rp {proteinCost}/g Prot
                      </span>
                    )}
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      Serat: {food.fiber_g}g
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">
                      {food.meal_type}
                    </span>
                  </div>
                </div>

                {/* Footer with Eco score & Click trigger */}
                <div className="flex items-center justify-between text-[11px] pt-2.5 border-t border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="flex items-center gap-1 text-teal-700 dark:text-teal-400 font-semibold">
                      <Leaf className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>Eco: {food.sustainability_score}</span>
                    </span>
                    {food.vegetarian && (
                      <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-1.5 py-0.2 rounded">
                        Nabati
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Detail &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Display content: Table View */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3">Nama Bahan Pangan</th>
                  <th className="px-3 py-3">Kategori</th>
                  <th className="px-3 py-3 text-right">Kalori</th>
                  <th className="px-3 py-3 text-right">Protein</th>
                  <th className="px-3 py-3 text-right">Karbo</th>
                  <th className="px-3 py-3 text-right">Lemak</th>
                  <th className="px-3 py-3 text-right">Serat</th>
                  <th className="px-4 py-3 text-right">Harga (IDR)</th>
                  <th className="px-3 py-3 text-center">Eco Score</th>
                  <th className="px-3 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredFoods.map((food) => {
                  const theme = getCategoryTheme(food.category);
                  return (
                    <tr
                      key={food.food_id}
                      onClick={() => setInspectFood(food)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span>{food.food_name}</span>
                          {food.vegetarian && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                              Nabati
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${theme.bgLight} ${theme.bgDark} ${theme.color}`}
                        >
                          {food.category}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right font-bold text-emerald-700 dark:text-emerald-400">
                        {food.calories} kkal
                      </td>
                      <td className="px-3 py-3 text-right font-bold text-indigo-700 dark:text-indigo-400">
                        {food.protein_g}g
                      </td>
                      <td className="px-3 py-3 text-right text-amber-700 dark:text-amber-400">
                        {food.carbohydrate_g}g
                      </td>
                      <td className="px-3 py-3 text-right text-rose-600 dark:text-rose-400">
                        {food.fat_g}g
                      </td>
                      <td className="px-3 py-3 text-right text-slate-600 dark:text-slate-300">
                        {food.fiber_g}g
                      </td>
                      <td className="px-4 py-3 text-right font-extrabold text-slate-900 dark:text-white">
                        Rp {food.price_idr.toLocaleString('id-ID')}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="inline-flex items-center gap-1 font-bold text-teal-700 dark:text-teal-400">
                          <Leaf className="w-3 h-3 text-teal-500" />
                          <span>{food.sustainability_score}</span>
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectFood(food);
                          }}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 cursor-pointer"
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Interactive Detail Modal */}
      {inspectFood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-5 relative">
            <button
              onClick={() => setInspectFood(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  {inspectFood.category}
                </span>
                {inspectFood.vegetarian && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                    100% Nabati
                  </span>
                )}
                <span className="text-xs text-slate-500">TKPI Kemenkes RI</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {inspectFood.food_name}
              </h3>
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                Estimasi Harga: Rp {inspectFood.price_idr.toLocaleString('id-ID')} / porsi
              </p>
            </div>

            {/* Macro Breakdown */}
            <div className="grid grid-cols-4 gap-2 text-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <div>
                <span className="text-slate-400 text-[10px] block">Energi</span>
                <strong className="text-base text-emerald-600 dark:text-emerald-400">
                  {inspectFood.calories}
                </strong>
                <span className="text-[9px] text-slate-400 block">kkal</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Protein</span>
                <strong className="text-base text-indigo-600 dark:text-indigo-400">
                  {inspectFood.protein_g}g
                </strong>
                <span className="text-[9px] text-slate-400 block">
                  {Math.round((inspectFood.protein_g * 4 / Math.max(1, inspectFood.calories)) * 100)}%
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Karbo</span>
                <strong className="text-base text-amber-600 dark:text-amber-400">
                  {inspectFood.carbohydrate_g}g
                </strong>
                <span className="text-[9px] text-slate-400 block">
                  {Math.round((inspectFood.carbohydrate_g * 4 / Math.max(1, inspectFood.calories)) * 100)}%
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Lemak</span>
                <strong className="text-base text-rose-500">
                  {inspectFood.fat_g}g
                </strong>
                <span className="text-[9px] text-slate-400 block">
                  {Math.round((inspectFood.fat_g * 9 / Math.max(1, inspectFood.calories)) * 100)}%
                </span>
              </div>
            </div>

            {/* Occupational health relevance */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-2">
              <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Relevansi Gizi untuk Tenaga Kerja:</span>
              </h4>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                Bahan pangan ini kaya akan zat gizi makro penting untuk mendukung daya tahan fisik, mencegah penurunan gula darah mendadak saat jam kerja kritis, dan menjaga fokus mental pekerja baik di lapangan maupun saat jadwal shift.
              </p>
              <div className="flex items-center justify-between text-[11px] text-emerald-900 dark:text-emerald-300 pt-2 border-t border-emerald-200 dark:border-emerald-800/60 font-medium">
                <span>Waktu Konsumsi Ideal:</span>
                <strong className="capitalize">{inspectFood.meal_type}</strong>
              </div>
              <div className="flex items-center justify-between text-[11px] text-emerald-900 dark:text-emerald-300 font-medium">
                <span>Skor Keberlanjutan Lingkungan:</span>
                <strong>{inspectFood.sustainability_score} / 100 (Eco-Friendly)</strong>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectFood(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 transition-all cursor-pointer"
              >
                Tutup Katalog
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
