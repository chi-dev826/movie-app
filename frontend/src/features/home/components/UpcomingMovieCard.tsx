import { Link } from 'react-router-dom';
import type { UpcomingMovie } from '@/types/domain';
import { getTmdbImage } from '@/utils/imageUtils';
import { TMDB_CONFIG } from '@/constants/config';
import { APP_PATHS } from '@shared/constants/routes';

type Props = {
  movie: UpcomingMovie;
  className?: string;
};

/**
 * 公開予定映画カード
 *
 * ポスター画像をフルに見せつつ、公開日とカウントダウンをバッジ形式で表示する。
 * 画像を遮るオーバーレイ帯は使用せず、角のバッジで情報を補完する。
 *
 * @param movie - 表示する映画データ
 * @param className - 外部からの幅制御用クラス
 */
const UpcomingMovieCard = ({ movie, className = '' }: Props) => {
  const posterUrl = getTmdbImage(movie.poster_path, TMDB_CONFIG.IMAGE_SIZES.POSTER.MEDIUM);

  return (
    posterUrl && (
      <Link
        to={APP_PATHS.MOVIE_DETAIL.replace(':id', movie.id.toString())}
        className={`group/card relative block flex-shrink-0 rounded-lg overflow-hidden bg-gray-800 shadow-2xl cursor-pointer transition-all duration-500 ease-out hover:scale-105 hover:shadow-red-900/20 border border-gray-800 w-full aspect-poster ${className}`}
      >
        {/* ポスター画像 */}
        <img
          src={posterUrl}
          alt={movie.title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover/card:scale-110"
          loading="lazy"
        />

        {/* カウントダウンバッジ — 左上 */}
        {movie.upcoming_badge_label && !movie.release_date_short && (
          <div className="absolute top-2 left-2 px-2 py-1 text-[10px] font-bold text-white bg-red-600/90 backdrop-blur-sm rounded-full shadow-lg border border-red-500/30">
            {movie.upcoming_badge_label}
          </div>
        )}

        {/* ✦ 公開日バッジ ✦ */}
        {movie.release_date_short && (
          <div className="absolute top-0 left-0 z-20 flex flex-col items-center justify-center bg-red-600/80 backdrop-blur-md text-white px-1 py-1 rounded border border-white/10 shadow-lg">
            <span className="text-xs font-bold leading-none tracking-wider text-white">
              {movie.release_date_short}
            </span>
            <span className="text-[6px] font-bold leading-none mt-1">
              公開
            </span>
          </div>
        )}

        {/* ホバー時のオーバーレイアクセント */}
        <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover/card:opacity-100" />
      </Link>
    )
  );
};

export default UpcomingMovieCard;

