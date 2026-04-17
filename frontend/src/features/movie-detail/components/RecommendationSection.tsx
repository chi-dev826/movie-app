import React from 'react';
import { Link } from 'react-router-dom';
import { APP_PATHS } from '@shared/constants/routes';
import { getPosterSrcSet } from '@/utils/image';
import { Movie } from '@/types/api/dto';

interface RecommendationSectionProps {
  recommendations?: {
    title: string;
    movies: Movie[];
  };
}

/**
 * @summary おすすめ・類似映画のカードを水平スクロールで表示するコンポーネント。
 * @param {RecommendationSectionProps} props - おすすめ映画リストとタイトル
 * @returns {React.ReactElement | null} データが存在しない場合はnullを返す
 */
export const RecommendationSection: React.FC<RecommendationSectionProps> = ({
  recommendations,
}) => {
  if (!recommendations || !recommendations.movies || recommendations.movies.length === 0)
    return null;

  return (
    <section className="py-6 border-t border-white/5">
      <div className="px-4 mx-auto mb-4 max-w-7xl">
        <h3 className="flex items-center gap-3 text-2xl font-bold tracking-tight font-headline md:text-3xl text-on-surface">
          <span className="inline-block w-1 h-6 bg-red-500 rounded-full xl:h-7" />
          {recommendations.title || 'Similar Experiences'}
        </h3>
      </div>
      <div className="flex gap-4 px-4 mx-auto overflow-x-auto hide-scrollbar max-w-7xl">
        {recommendations.movies.map((movie) => {
          const posterSrcSet = getPosterSrcSet(movie.posterPath);
          return (
            <Link
              key={movie.id}
              to={APP_PATHS.MOVIE_DETAIL.replace(':id', movie.id.toString())}
              className="flex flex-col gap-2 w-[140px] md:w-[180px] shrink-0 group cursor-pointer"
            >
              <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden bg-surface-container-high shadow-2xl border border-white/5 group-hover:border-white/20 transition-all duration-300 md:group-hover:scale-105 md:group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                {posterSrcSet ? (
                  <img
                    srcSet={posterSrcSet}
                    sizes="100vw"
                    loading="lazy"
                    alt={movie.title}
                    className="object-cover w-full h-full transition-opacity opacity-90 group-hover:opacity-100"
                  />
                ) : (
                  <div className="w-full h-full bg-surface-container-lowest"></div>
                )}
                <div className="absolute inset-0 flex flex-col justify-end p-3 transition-opacity duration-300 delay-100 opacity-100 bg-gradient-to-t from-black/90 via-black/20 to-transparent xl:opacity-0 xl:group-hover:opacity-100">
                  <span className="text-xs font-bold leading-tight tracking-wider text-white uppercase font-headline md:text-sm line-clamp-2">
                    {movie.title}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
