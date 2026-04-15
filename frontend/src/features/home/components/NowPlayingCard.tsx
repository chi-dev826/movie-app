import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/solid';

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
 * 公開中映画専用カード
 *
 * バックドロップ画像を使った横長カードで、
 * 評価スコアと「NOW SHOWING」バッジで「今すぐ観れる」感を演出する。
 * 従来の `ResponsiveMovieTile` よりも情報密度が高い。
 *
 * @param movie - 表示する映画データ
 * @param className - 外部からの幅制御用クラス
 */
const NowPlayingCard = ({ movie, className = '' }: Props) => {
  const posterUrl = getTmdbImage(movie.posterPath, IMAGE_CONFIG.IMAGE_SIZES.POSTER.MEDIUM);
  const prefetchMovieDetail = usePrefetchMovieDetail();

  if (!posterUrl) return null;

  return (
    <Link
      to={APP_PATHS.MOVIE_DETAIL.replace(':id', movie.id.toString())}
      onMouseEnter={() => prefetchMovieDetail(movie.id)}
      className={`group/now-playing relative block flex-shrink-0 rounded-lg overflow-hidden bg-gray-900 cursor-pointer transition-all duration-500 ease-out hover:scale-[1.03] hover:shadow-xl hover:shadow-red-900/10 border border-gray-800/50 hover:border-red-700/30 aspect-poster ${className}`}
    >
      {/* ポスター画像 */}
      <div className="relative w-full h-full">
        <img
          src={posterUrl}
          alt={movie.title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover/now-playing:scale-110"
          loading="lazy"
        />

        {/* グラデーション */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />

        {/* 下部情報 */}
        <div className="absolute bottom-0 left-0 right-0 p-2 xl:p-3">
          <h3 className="text-[10px] font-bold text-white xl:text-xs 2xl:text-sm line-clamp-2 drop-shadow-md leading-tight mb-1">
            {movie.title}
          </h3>

          <div className="flex items-center justify-between">
            {/* 評価スコア */}
            {movie.voteAverage !== null && (
              <span className="inline-flex items-center gap-0.5 text-[10px] text-yellow-300">
                <StarIcon className="w-2.5 h-2.5 text-yellow-400" />
                <span className="font-bold">{movie.voteAverage.toFixed(1)}</span>
              </span>
            )}

            {/* 公開中バッジ */}
            <span className="px-1 py-0.5 text-[8px] font-bold tracking-wider text-white rounded bg-red-600/80 border border-red-500/20 xl:text-[9px]">
              公開中
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NowPlayingCard;
