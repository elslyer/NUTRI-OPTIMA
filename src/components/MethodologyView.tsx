import React from 'react';
import { BookOpen, Calculator, Cpu, ShieldCheck, ExternalLink, GraduationCap, Award, FileText } from 'lucide-react';

export const MethodologyView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-2 border border-emerald-200 dark:border-emerald-800">
          <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Scientific Documentation & Methodology</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Metodologi Ilmiah & Formula Matematika NUTRI-OPTIMA
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
          Landasan teoritis kedokteran okupasi, rumus metabolisme energi, formulasi matematis AI Cosine Similarity, dan daftar pustaka ilmiah rujukan.
        </p>
      </div>

      {/* Section 1: Latar Belakang Riset */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>1. Latar Belakang & Urgensi Gizi Tenaga Kerja</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Studi epidemiologi okupasi membuktikan bahwa intervensi gizi di tempat kerja berkorelasi positif dengan peningkatan produktivitas, penurunan absensi, dan profitabilitas perusahaan (Jensen, 2011). Sebaliknya, beban kerja fisik yang tidak terkompensasi oleh asupan energi dan zat gizi mikro yang seimbang meningkatkan risiko kelelahan kronis (<strong className="font-bold text-slate-900 dark:text-white">fatigue</strong>), kecelakaan kerja, dan penurunan daya konsentrasi.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Pekerja dengan sistem <strong className="font-bold text-slate-900 dark:text-white">shift</strong> (khususnya <strong className="font-bold text-slate-900 dark:text-white">night shift</strong> dan <strong className="font-bold text-slate-900 dark:text-white">rotating shift</strong>) mengalami gangguan ritme sirkadian yang memicu ketidakteraturan pola makan, disregulasi leptin/ghrelin, serta peningkatan risiko gangguan metabolik jangka panjang (Souza et al., 2019). NUTRI-OPTIMA merumuskan solusi presisi dengan mengacu pada Angka Kecukupan Gizi (AKG) nasional (Kementerian Kesehatan RI, 2019) dan memanfaatkan basis data pangan lokal (Kementerian Kesehatan RI, 2017).
        </p>
      </div>

      {/* Section 2: Formula Biometrik */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>2. Formula Perhitungan Kebutuhan Energi & Makronutrien</span>
        </h3>

        <div className="space-y-3">
          <h4 className="font-bold text-sm text-emerald-800 dark:text-emerald-400">
            A. Basal Metabolic Rate (Mifflin-St Jeor Equation)
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Formula Mifflin-St Jeor (Mifflin et al., 1990) telah diverifikasi secara sistematis oleh <strong className="font-bold text-slate-900 dark:text-white">American Dietetic Association</strong> sebagai prediktor BMR paling handal dan memiliki persentase kesalahan terkecil baik pada individu non-obesitas maupun obesitas (Frankenfield et al., 2005):
          </p>
          <div className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs space-y-1.5 border border-slate-800">
            <p>Pria   : BMR (kkal/hari) = (10 × Berat[kg]) + (6.25 × Tinggi[cm]) - (5 × Usia[th]) + 5</p>
            <p>Wanita : BMR (kkal/hari) = (10 × Berat[kg]) + (6.25 × Tinggi[cm]) - (5 × Usia[th]) - 161</p>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h4 className="font-bold text-sm text-emerald-800 dark:text-emerald-400">
            B. Total Daily Energy Expenditure (TDEE) & Multiplier Okupasi
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            TDEE tenaga kerja dihitung dengan memadukan faktor aktivitas dasar (<strong className="font-bold text-slate-900 dark:text-white">Physical Activity Level / PAL</strong>) dan faktor koreksi beban okupasi serta durasi lembur:
          </p>
          <div className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs border border-slate-800">
            <p>TDEE = BMR × (PAL_Base + Occupation_Adjustment) × Overtime_Multiplier</p>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc pl-5">
            <li><strong>Sedentary / Pekerja Kantor:</strong> Penyesuaian beban okupasi = +0.00 (aktivitas mayoritas duduk)</li>
            <li><strong>Light Physical Work:</strong> Penyesuaian beban okupasi = +0.05 (pekerja ritel, guru, tenaga kasir)</li>
            <li><strong>Moderate Physical Work:</strong> Penyesuaian beban okupasi = +0.15 (staf logistik, perawat klinis, teknisi)</li>
            <li><strong>Heavy Physical Work:</strong> Penyesuaian beban okupasi = +0.30 (pekerja tambang, konstruksi, perkebunan)</li>
            <li><strong>Jam Lembur (&gt; 8–10 jam/hari):</strong> Dikalikan faktor durasi kerja 1.05× s.d. 1.10×</li>
          </ul>
        </div>
      </div>

      {/* Section 3: Algoritma AI */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>3. Algoritma AI & Sistem Rekomendasi Makanan</span>
        </h3>

        <div className="space-y-3">
          <h4 className="font-bold text-sm text-emerald-800 dark:text-emerald-400">
            A. Content-Based Filtering & Cosine Similarity
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Berdasarkan taksonomi sistem rekomendasi pangan terkini (<strong className="font-bold text-slate-900 dark:text-white">Food Recommender Systems</strong>) (Bondevik et al., 2024; Ricci et al., 2022), pendekatan <strong className="font-bold text-slate-900 dark:text-white">Content-Based Filtering</strong> efektif mencocokkan vektor kebutuhan nutrisi target pengguna dengan vektor atribut 5 dimensi bahan pangan <code>[Kalori, Protein, Karbohidrat, Lemak, Serat]</code>:
          </p>
          <div className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs border border-slate-800">
            <p>Cosine Similarity(u, i) = (u · i) / (||u|| × ||i||) = ∑(u_k × i_k) / (√∑u_k² × √∑i_k²)</p>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h4 className="font-bold text-sm text-emerald-800 dark:text-emerald-400">
            B. Multi-Objective Optimization Function
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Untuk memastikan menu tidak hanya presisi secara gizi namun juga realistis terhadap daya beli tenaga kerja dan mendukung keberlanjutan lingkungan, dilakukan pembobotan multi-kriteria:
          </p>
          <div className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs leading-relaxed border border-slate-800">
            <p>Skor Akhir = 0.40 × NutritionFit(Cosine)</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 0.20 × ProteinRequirementFit</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 0.15 × DailyBudgetFit</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 0.10 × WorkloadActivityFit</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 0.15 × SustainabilityIndex</p>
          </div>
        </div>
      </div>

      {/* Section 4: Daftar Pustaka & Referensi Ilmiah */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>4. Daftar Pustaka & Referensi Ilmiah (Academic References)</span>
          </h3>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            Standar APA 7th Edition
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Berikut adalah publikasi ilmiah bereputasi, pedoman kementerian kesehatan, dan rujukan algoritma yang mendasari perancangan sistem NUTRI-OPTIMA:
        </p>

        <div className="space-y-4 pt-1">
          {/* Ref 1: Bondevik et al. (2024) */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 text-xs sm:text-sm space-y-1.5 hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-colors">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                AI & Food Recommender Systems
              </span>
            </div>
            <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
              Bondevik, J. N., et al. (2024). A systematic review on food recommender systems. <em>Expert Systems with Applications</em>, 238, 121954.
            </p>
            <a
              href="https://doi.org/10.1016/j.eswa.2023.121954"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline text-xs font-semibold"
            >
              <span>https://doi.org/10.1016/j.eswa.2023.121954</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Ref 2: Frankenfield et al. (2005) */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 text-xs sm:text-sm space-y-1.5 hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-colors">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Metabolic Rate & Validation
              </span>
            </div>
            <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
              Frankenfield, D., Roth-Yousey, L., & Compher, C. (2005). Comparison of predictive equations for resting metabolic rate in healthy nonobese and obese adults: A systematic review. <em>Journal of the American Dietetic Association</em>, 105(5), 775–789.
            </p>
            <a
              href="https://doi.org/10.1016/j.jada.2005.02.005"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline text-xs font-semibold"
            >
              <span>https://doi.org/10.1016/j.jada.2005.02.005</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Ref 3: Jensen (2011) */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 text-xs sm:text-sm space-y-1.5 hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-colors">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                Workforce Health & Productivity
              </span>
            </div>
            <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
              Jensen, J. D. (2011). Can worksite nutritional interventions improve productivity and firm profitability? A literature review. <em>Perspectives in Public Health</em>, 131(4), 184–192.
            </p>
            <a
              href="https://doi.org/10.1177/1757913911408263"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline text-xs font-semibold"
            >
              <span>https://doi.org/10.1177/1757913911408263</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Ref 4: Kemenkes RI (2017) */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 text-xs sm:text-sm space-y-1.5 hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-colors">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                Database Pangan Indonesia (TKPI)
              </span>
            </div>
            <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
              Kementerian Kesehatan Republik Indonesia. (2017). <em>Tabel komposisi pangan Indonesia</em>. Kementerian Kesehatan Republik Indonesia.
            </p>
          </div>

          {/* Ref 5: Kemenkes RI (2019) */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 text-xs sm:text-sm space-y-1.5 hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-colors">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                Regulasi & Standar AKG Nasional
              </span>
            </div>
            <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
              Kementerian Kesehatan Republik Indonesia. (2019). <em>Peraturan Menteri Kesehatan Republik Indonesia Nomor 28 Tahun 2019 tentang angka kecukupan gizi yang dianjurkan untuk masyarakat Indonesia</em>. Kementerian Kesehatan Republik Indonesia.
            </p>
          </div>

          {/* Ref 6: Mifflin et al. (1990) */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 text-xs sm:text-sm space-y-1.5 hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-colors">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Formula Energi BMR
              </span>
            </div>
            <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
              Mifflin, M. D., St Jeor, S. T., Hill, L. A., Scott, B. J., Daugherty, S. A., & Koh, Y. O. (1990). A new predictive equation for resting energy expenditure in healthy individuals. <em>The American Journal of Clinical Nutrition</em>, 51(2), 241–247.
            </p>
            <a
              href="https://doi.org/10.1093/ajcn/51.2.241"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline text-xs font-semibold"
            >
              <span>https://doi.org/10.1093/ajcn/51.2.241</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Ref 7: Ricci et al. (2022) */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 text-xs sm:text-sm space-y-1.5 hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-colors">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                Sistem Rekomendasi & Algoritma
              </span>
            </div>
            <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
              Ricci, F., Rokach, L., & Shapira, B. (Eds.). (2022). <em>Recommender systems handbook</em> (3rd ed.). Springer.
            </p>
            <a
              href="https://doi.org/10.1007/978-1-0716-2197-4"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline text-xs font-semibold"
            >
              <span>https://doi.org/10.1007/978-1-0716-2197-4</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Ref 8: Souza et al. (2019) */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 text-xs sm:text-sm space-y-1.5 hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-colors">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                Shift Work & Eating Habits
              </span>
            </div>
            <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
              Souza, R. V., Sarmento, R. A., de Almeida, J. C., & Canuto, R. (2019). The effect of shift work on eating habits: A systematic review. <em>Scandinavian Journal of Work, Environment & Health</em>, 45(1), 7–21.
            </p>
            <a
              href="https://doi.org/10.5271/sjweh.3759"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline text-xs font-semibold"
            >
              <span>https://doi.org/10.5271/sjweh.3759</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Section 5: Keterbatasan & Keamanan */}
      <div className="bg-emerald-50 dark:bg-slate-900 p-6 rounded-2xl border border-emerald-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 space-y-2">
        <h4 className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Etika Medis, Standar K3, & Keamanan Okupasi</span>
        </h4>
        <p className="leading-relaxed">
          NUTRI-OPTIMA dirancang sebagai sistem pendukung keputusan (*decision support system*) terstandarisasi untuk pengambil kebijakan kesehatan kerja, manajer HSE/HR, dan tenaga kerja mandiri. Seluruh kalkulasi berakar pada bukti empiris kedokteran okupasi dan Peraturan Menteri Kesehatan RI Nomor 28 Tahun 2019.
        </p>
      </div>
    </div>
  );
};
