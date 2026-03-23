import React from 'react';

interface MovieStatsSectionProps {
  detail: {
    revenue_jpy_display?: string;
    budget_jpy_display?: string;
    production_companies?: string[];
    production_countries?: string[];
  };
}

/**
 * @summary 興行収入、製作費、製作会社、撮影地などの映画の統計情報を表示するコンポーネント。
 * @param {MovieStatsSectionProps} props - 統計に必要な映画詳細データ
 * @returns {React.ReactElement}
 */
export const MovieStatsSection: React.FC<MovieStatsSectionProps> = ({ detail }) => {
  return (
    <section className="py-8 bg-gray-950">
      <div className="px-4 max-w-7xl mx-auto mb-6">
         <h3 className="font-headline text-3xl md:text-4xl font-black tracking-tight text-white mb-6 flex items-center gap-3">
           <span className="inline-block w-1 h-6 rounded-full bg-red-500 xl:h-7" />
           Movie Stats
         </h3>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 rounded-3xl overflow-hidden border border-white/10 bg-surface-container-lowest shadow-2xl">
            {/* Box Office & Budget */}
            <div className="flex flex-col md:flex-row col-span-1 md:col-span-2 lg:col-span-1 border-b lg:border-b-0 lg:border-r border-white/10">
               <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-white/10">
                  <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest mb-2 font-bold">Box Office</p>
                  <p className="text-3xl font-headline font-black text-red-400 drop-shadow-sm">
                    {detail.revenue_jpy_display || 'N/A'}
                  </p>
               </div>
               <div className="flex-1 p-6">
                  <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest mb-2 font-bold">Budget</p>
                  <p className="text-3xl font-headline font-black text-white drop-shadow-sm">
                    {detail.budget_jpy_display || 'N/A'}
                  </p>
               </div>
            </div>

            {/* Production Company */}
            <div className="p-6 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-center">
               <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest mb-2 font-bold">Production Company</p>
               <p className="text-xl font-headline font-bold text-white leading-tight">
                  {detail.production_companies?.join(' & ') || 'N/A'}
               </p>
            </div>

            {/* Filming Locations */}
            <div className="p-6 flex flex-col justify-center">
               <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest mb-2 font-bold">Filming Locations</p>
               <p className="text-lg font-headline font-bold text-white leading-tight">
                  {detail.production_countries?.join(', ') || 'N/A'}
               </p>
            </div>
         </div>
      </div>
    </section>
  );
};
