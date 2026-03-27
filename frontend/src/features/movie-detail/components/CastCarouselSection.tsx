import React from 'react';
import { Link } from 'react-router-dom';
import { IMAGE_CONFIG } from '@/constants/config';
import { APP_PATHS } from '@shared/constants/routes';

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
}

interface CastCarouselSectionProps {
  cast?: CastMember[];
}

/**
 * @summary キャストを水平スクロールできるカルーセル形式で表示するコンポーネント。
 * @param {CastCarouselSectionProps} props - キャスト情報のリスト
 * @returns {React.ReactElement | null} キャスト情報がない場合はnull
 */
export const CastCarouselSection: React.FC<CastCarouselSectionProps> = ({ cast }) => {
  if (!cast || cast.length === 0) return null;

  return (
    <section className="py-6 border-t border-white/5">
      <div className="px-4 max-w-7xl mx-auto mb-4 flex justify-between items-end">
         <h3 className="font-headline text-2xl md:text-3xl font-bold tracking-tight text-on-surface flex items-center gap-3">
            <span className="inline-block w-1 h-6 rounded-full bg-red-500 xl:h-7" />
            Cast & Staff
         </h3>
      </div>
      <div className="flex overflow-x-auto hide-scrollbar gap-4 px-4 pb-4 max-w-7xl mx-auto">
        {cast.map((actor, idx) => (
          <Link 
            key={actor.id || idx} 
            to={`${APP_PATHS.SEARCH}?q=${encodeURIComponent(actor.name)}&type=person`}
            className="flex flex-col items-center gap-3 min-w-[80px] md:min-w-[100px] group cursor-pointer"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-red-900 p-1 group-hover:border-primary transition-colors duration-300">
              <div className="w-full h-full rounded-full overflow-hidden bg-surface-container-high relative">
                 {actor.profilePath ? (
                   <img src={`${IMAGE_CONFIG.IMAGE_BASE_URL}w185${actor.profilePath}`} alt={actor.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                 ) : (
                   <div className="flex items-center justify-center w-full h-full text-outline">
                     <span className="material-symbols-outlined text-[32px]">person</span>
                   </div>
                 )}
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="material-symbols-outlined text-white text-[24px]">search</span>
                 </div>
              </div>
            </div>
            <div className="text-center">
              <p className="font-body text-xs md:text-sm font-bold text-on-surface truncate w-20 md:w-24 group-hover:text-primary transition-colors">{actor.name}</p>
              <p className="font-label text-[10px] md:text-xs text-on-surface-variant uppercase tracking-tighter truncate w-20 md:w-24 mt-0.5">{actor.character}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
