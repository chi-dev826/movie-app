import { Link } from 'react-router-dom';
import type { Movie } from '@/types/domain';
import { Star } from 'lucide-react';
import { getTmdbImage } from '@/utils/imageUtils';
import { TMDB_CONFIG } from '@/constants/config';

type Props = {
  movie: Movie;
  className?: string;
};

const MovieBackdrop = ({ movie, className = '' }: Props) => {
  const backdropUrl = getTmdbImage(movie.backdrop_path, TMDB_CONFIG.IMAGE_SIZES.BACKDROP.MEDIUM);
  const logoUrl = getTmdbImage(movie.logo_path, TMDB_CONFIG.IMAGE_SIZES.LOGO.MEDIUM);

  return (
    backdropUrl && (
      <Link
        to={`/movie/${movie.id}`}
        className={`group/card relative block flex-shrink-0 rounded-md overflow-hidden bg-gray-800 shadow-2xl cursor-pointer transition-all duration-300 ease-in-out xl:hover:scale-105 xl:hover:shadow-slate-700 border border-gray-900 aspect-[2/3] xl:[aspect-ratio:auto] ${className}`}
      >
        <img
          src={backdropUrl}
          alt={movie.original_title}
          className="hidden xl:object-cover xl:w-full xl:h-full xl:transition-all xl:duration-300 xl:ease-in-out xl:block"
          loading="lazy"
        />

        {/* オーバーレイ */}
        <div
          className={
            'hidden xl:absolute inset-0 xl:flex items-end p-4 bg-gradient-to-t from-black/80 to-transparent'
          }
        >
          <h3 className="text-xs font-bold text-white 3xl:text-sm 4xl:text-base">{movie.title}</h3>
        </div>

        {/* ロゴ画像 */}
        <div className="hidden xl:block xl:absolute xl:top-0 xl:max-w-24 2xl:max-w-28 3xl:max-w-32 4xl:max-w-48">
          {logoUrl && (
            <img
              src={logoUrl}
              alt={movie.original_title}
              className="object-contain w-full h-full opacity-80"
              loading="lazy"
            />
          )}
        </div>

        {/* 評価スコア */}
        <div className="absolute flex items-center gap-1 px-2 py-1 text-xs font-bold text-white rounded-full bottom-2 right-2 bg-black/50 backdrop-blur-sm">
          {movie.vote_average !== null && (
            <>
              <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
              <span>{movie.vote_average.toFixed(1)}</span>
            </>
          )}
        </div>
      </Link>
    )
  );
};

export default MovieBackdrop;
