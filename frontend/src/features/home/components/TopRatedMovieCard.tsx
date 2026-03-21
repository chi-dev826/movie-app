import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/solid';
import type { Movie } from '@/types/domain';
import { getTmdbImage } from '@/utils/imageUtils';
import { TMDB_CONFIG } from '@/constants/config';
import { APP_PATHS } from '@shared/constants/routes';

type Props = {
  movie: Movie;
  className?: string;
};

/**
 * @summary 高評価映画用カード。左ポスター、右側にあらすじや評価情報を配置。
 * @param movie 映画エンティティ
 */
export default function TopRatedMovieCard({ movie, className = '' }: Props) {
  const posterUrl = getTmdbImage(movie.poster_path, TMDB_CONFIG.IMAGE_SIZES.POSTER.MEDIUM);

  return (
    <Link 
      to={APP_PATHS.MOVIE_DETAIL.replace(':id', movie.id.toString())}
      className={`flex items-start bg-[#1c1c1c] rounded-2xl p-4 gap-4 hover:bg-[#252525] transition-colors w-[85vw] sm:w-[400px] shrink-0 border border-gray-800/60 shadow-lg group ${className}`}
    >
      {/* ポスター */}
      {posterUrl && (
        <div className="w-20 md:w-24 shrink-0 aspect-poster rounded-lg overflow-hidden shadow-md border border-gray-700/50 relative">
          <img 
            src={posterUrl} 
            alt={movie.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
            loading="lazy"
          />
        </div>
      )}
      
      {/* 詳細 */}
      <div className="flex-1 min-w-0 py-1 flex flex-col justify-center h-full">
        <div className="flex items-center gap-3 mb-2">
          {movie.vote_average !== null && (
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-yellow-300 md:text-sm">
              <StarIcon className="w-3.5 h-3.5 text-yellow-400" />
              {(movie.vote_average ?? 0).toFixed(1)}
            </span>
          )}
        </div>
        <h3 className="text-white font-bold text-base md:text-lg mb-1.5 truncate">{movie.title}</h3>
        <p className="text-gray-400 text-xs md:text-sm line-clamp-2 md:line-clamp-3 leading-relaxed">
          {movie.overview}
        </p>
      </div>
    </Link>
  );
}
