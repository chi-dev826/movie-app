import React from 'react';
import { Link } from 'react-router-dom';
import { APP_PATHS } from '@shared/constants/routes';
import { TMDB_IMAGE_CONFIG } from '@/constants/config';
import { getTmdbImage } from '@/utils/imageUtils';

interface RecommendationSectionProps {
  recommendations?: {
    title: string;
    movies: any[];
  };
}

/**
 * @summary おすすめ・類似映画のカードを水平スクロールで表示するコンポーネント。
 * @param {RecommendationSectionProps} props - おすすめ映画リストとタイトル
 * @returns {React.ReactElement | null} データが存在しない場合はnullを返す
 */
export const RecommendationSection: React.FC<RecommendationSectionProps> = ({ recommendations }) => {
  if (!recommendations || !recommendations.movies || recommendations.movies.length === 0) return null;

  return (
    <section className="py-6 border-t border-white/5">
      <div className="px-4 max-w-7xl mx-auto mb-4">
         <h3 className="font-headline text-2xl md:text-3xl font-bold tracking-tight text-on-surface flex items-center gap-3">
            <span className="inline-block w-1 h-6 rounded-full bg-red-500 xl:h-7" />
            {recommendations.title || 'Similar Experiences'}
         </h3>
      </div>
      <div className="flex overflow-x-auto hide-scrollbar gap-4 px-4 max-w-7xl mx-auto">
        {recommendations.movies.map((movie) => {
           const poster = getTmdbImage(movie.posterPath, TMDB_IMAGE_CONFIG.IMAGE_SIZES.POSTER.MEDIUM);
           return (
             <Link key={movie.id} to={APP_PATHS.MOVIE_DETAIL.replace(':id', movie.id.toString())} className="flex flex-col gap-2 w-[140px] md:w-[180px] shrink-0 group cursor-pointer">
                <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden bg-surface-container-high shadow-2xl border border-white/5 group-hover:border-white/20 transition-all duration-300 md:group-hover:scale-105 md:group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                   {poster ? (
                     <img src={poster} alt={movie.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                   ) : (
                     <div className="w-full h-full bg-surface-container-lowest"></div>
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-3 opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      <span className="font-headline font-bold text-xs md:text-sm text-white line-clamp-2 leading-tight uppercase tracking-wider">{movie.title}</span>
                   </div>
                </div>
             </Link>
           );
        })}
      </div>
    </section>
  );
};
