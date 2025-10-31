import { TMDB_IMAGE_BASE_URL } from '../../config';
import { Link } from 'react-router-dom';
import type { Movie } from '@/types/movie';
import { Star } from 'lucide-react';

type Props = {
  movie: Movie;
  layout?: 'responsive' | 'poster';
};

const MovieCard = ({ movie, layout = 'responsive' }: Props) => {
  const posterUrl = `${TMDB_IMAGE_BASE_URL}w500${movie.poster_path}`;
  const backdropUrl = `${TMDB_IMAGE_BASE_URL}w780${movie.backdrop_path}`;

  const isPosterLayout = layout === 'poster';

  return (
    movie.poster_path &&
    movie.backdrop_path && (
      <Link
        to={`/movie/${movie.id}`}
        key={movie.id}
        className={`group relative flex-shrink-0 rounded-md overflow-hidden bg-gray-800 shadow-2xl cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-red-900/50 border-2 border-gray-700 ${
          isPosterLayout
            ? 'w-full aspect-[2/3]'
            : 'basis-[30%] md:basis-[18%] xl:basis-[24%] 2xl:basis-[18%] 4xl:basis-[14%] aspect-[2/3] xl:[aspect-ratio:auto]'
        }`}
      >
        {/* ポスター画像 or レスポンシブ時のモバイル用画像 */}
        <img
          src={posterUrl}
          alt={movie.original_title}
          className={`absolute block object-cover w-full h-full transition-all duration-300 ease-in-out ${
            !isPosterLayout && 'xl:hidden'
          }`}
        />
        {/* レスポンシブ時のデスクトップ用背景画像 */}
        {!isPosterLayout && (
          <img
            src={backdropUrl}
            alt={movie.original_title}
            className="hidden xl:object-cover xl:w-full xl:h-full xl:transition-all xl:duration-300 xl:ease-in-out xl:block"
          />
        )}

        {/* オーバーレイ */}
        <div
          className={`absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/80 to-transparent ${
            isPosterLayout
              ? 'opacity-0 group-hover:opacity-100'
              : 'opacity-0 group-hover:opacity-100 xl:opacity-100'
          }`}
        >
          <h3 className="text-xs font-bold text-white 3xl:text-sm 4xl:text-base">{movie.title}</h3>
        </div>

        {/* ロゴ画像 */}
        <div className="hidden xl:block xl:absolute xl:top-0 xl:max-w-24 2xl:max-w-28 3xl:max-w-32 4xl:max-w-48">
          {movie.logo_path && (
            <img
              src={TMDB_IMAGE_BASE_URL + 'w185' + movie.logo_path}
              alt={movie.original_title}
              className="object-contain w-full h-full opacity-80"
            />
          )}
        </div>

        {/* 評価スコア */}
        <div className="absolute flex items-center gap-1 px-2 py-1 text-xs font-bold text-white rounded-full bottom-2 right-2 bg-black/50 backdrop-blur-sm">
          <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
          <span>{movie.vote_average.toFixed(1)}</span>
        </div>
      </Link>
    )
  );
};

export default MovieCard;
