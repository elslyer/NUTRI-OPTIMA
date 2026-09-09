import React, { useState } from 'react';
import { INITIAL_FOOD_DATABASE } from '../data/foodDatabase';
import { FoodItem, FoodCategory } from '../types';
import { Search, Filter, Database, Leaf, ArrowUpDown, Check, Sparkles } from 'lucide-react';

const CATEGORIES: { id: string; label: string; count?: number }[] = [
  { id: 'all', label: 'Semua Kategori' },
  { id: 'staple', label: 'Makanan Pokok' },
  { id: 'protein', label: 'Lauk Protein' },
  { id: 'vegetable', label: 'Sayuran' },
  { id: 'fruit', label: 'Buah-buahan' },
  { id: 'snack', label: 'Camilan Sehat' },
  { id: 'drink', label: 'Minuman Sehat' },
];

export const FoodDatabaseViewer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'calories' | 'protein' | 'price' | 'sustainability'>('calories');
  const [selectedFoodId, setSelectedFoodId] = useState<number | null>(null);

  const filteredFoods = INITIAL_FOOD_DATABASE.filter((food) => {
    const matchSearch = food.food_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === 'all' || food.category === selectedCategory;
    return matchSearch && matchCat;
  }).sort((a, b) => {
    if (sortBy === 'calories') return b.calories - a.calories;
    if (sortBy === 'protein') return b.protein_g - a.protein_g;
    if (sortBy === 'price') return a.price_idr - b.price_idr;
    if (sortBy === 'sustainability') return b.sustainability_score - a.sustainability_score;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-2 border border-emerald-200 dark:border-emerald-800">
            <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Katalog Pangan Lokal Indonesia</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Database Gizi Tenaga Kerja Indonesia (50 Item)
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Data makronutrien, estimasi harga riil per porsi (IDR), dan skor keberlanjutan untuk optimasi AI.
          </p>
        </div>

        {/* Search & Sort Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari makanan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-48 sm:w-60 transition-all"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all cursor-pointer"
          >
            <option value="calories">Urut: Kalori Tertinggi</option>
            <option value="protein">Urut: Protein Tertinggi</option>
            <option value="price">Urut: Harga Termurah</option>
            <option value="sustainability">Urut: Sustainability Tertinggi</option>
          </select>
        </div>
      </div>

      {/* Category Pills Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const count =
            cat.id === 'all'
              ? INITIAL_FOOD_DATABASE.length
              : INITIAL_FOOD_DATABASE.filter((f) => f.category === cat.id).length;
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-700/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700/60 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? 'bg-emerald-700 text-emerald-100'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid of Food Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredFoods.map((food) => {
          const isSelected = selectedFoodId === food.food_id;
          return (
            <div
              key={food.food_id}
              onClick={() => setSelectedFoodId(isSelected ? null : food.food_id)}
              className={`bg-white dark:bg-slate-900 p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between cursor-pointer select-none ${
                isSelected
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md scale-[1.01]'
                  : 'border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700/60 hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {food.category}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Rp {food.price_idr.toLocaleString('id-ID')}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2 group-hover:text-emerald-600 transition-colors">
                  {food.food_name}
                </h4>

                <div className="grid grid-cols-4 gap-1 text-[11px] text-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 mb-3">
                  <div>
                    <span className="text-slate-400 block text-[9px]">Kalori</span>
                    <strong className="text-emerald-700 dark:text-emerald-400">{food.calories}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">Prot</span>
                    <strong className="text-blue-700 dark:text-blue-400">{food.protein_g}g</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">Karb</span>
                    <strong className="text-amber-700 dark:text-amber-400">{food.carbohydrate_g}g</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">Lemak</span>
                    <strong className="text-red-600 dark:text-red-400">{food.fat_g}g</strong>
                  </div>
                </div>

                {isSelected && (
                  <div className="mb-3 p-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-[11px] text-emerald-900 dark:text-emerald-200 space-y-1">
                    <span className="font-bold block">Detail Nutrisi Tambahan:</span>
                    <div className="flex justify-between text-[10px] text-emerald-800 dark:text-emerald-300">
                      <span>Serat Pangan: {food.fiber_g}g</span>
                      <span className="capitalize">Saran Waktu: {food.meal_type}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1 text-teal-700 dark:text-teal-400 font-semibold">
                  <Leaf className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                  <span>Skor Eko: {food.sustainability_score}</span>
                </span>
                {food.vegetarian && (
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded">
                    Nabati
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
