import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import type { Movie } from '@/types/api/dto';
import { getTmdbImage } from '@/utils/image';
import { IMAGE_CONFIG } from '@/constants/config';
import { APP_PATHS } from '@shared/constants/routes';
import { usePrefetchMovieDetail } from '@/hooks/useMovies';

type Props = {
  movie: Movie;
  className?: string;
};

/**
 * @summary 新着作品用カード。バックドロップ（またはポスター）を利用した小型の横長サムネイル。
 * @param movie 映画エンティティ
 */
export default function NewReleaseMovieCard({ movie, className = '' }: Props) {
  // バックドロップがない場合はポスターをフォールバックとして利用
  const imageUrl = getTmdbImage(
    movie.backdropPath || movie.posterPath,
    IMAGE_CONFIG.IMAGE_SIZES.BACKDROP.SMALL,
  );
  const prefetchMovieDetail = usePrefetchMovieDetail();

  return (
    <Link
      to={APP_PATHS.MOVIE_DETAIL.replace(':id', movie.id.toString())}
      onMouseEnter={() => prefetchMovieDetail(movie.id)}
      className={`group block shrink-0 cursor-pointer ${className}`}
    >
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-900 mb-2.5 border border-gray-800 group/card hover/card:border-gray-600 transition-colors shadow-lg">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={movie.title}
            className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        )}

        {/* オーバーレイバッジ（新着 ＋ 評価） */}
        <div className="absolute bottom-2 left-2 flex flex-wrap items-center gap-1.5 pointer-events-none z-10">
          {/* 新着バッジ */}
          <span className="px-2 py-0.5 md:py-1 text-[9px] md:text-[10px] font-bold text-white rounded-full bg-blue-600/80 backdrop-blur-sm border border-blue-500/30 shadow-sm">
            新着
          </span>

          {/* 評価バッジ */}
          {movie.voteAverage !== null && movie.voteAverage > 0 && (
            <span className="inline-flex items-center gap-1 px-1.5 md:px-2 py-0.5 md:py-1 text-[9px] md:text-[10px] font-bold text-yellow-300 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 shadow-sm">
              <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400 md:w-3 md:h-3" />
              {(movie.voteAverage ?? 0).toFixed(1)}
            </span>
          )}
        </div>
      </div>
      <h3 className="text-gray-100 font-bold text-sm md:text-base truncate px-1 transition-colors group-hover:text-white">
        {movie.title}
      </h3>
    </Link>
  );
}
