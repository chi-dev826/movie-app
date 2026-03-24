import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

import type { Movie, UpcomingMovie } from '@/types/api/dto';
import { getTmdbImage } from '@/utils/imageUtils';
import { TMDB_IMAGE_CONFIG } from '@/constants/config';
import { APP_PATHS } from '@shared/constants/routes';

type Props = 
  | { variant: 'upcoming'; movie: UpcomingMovie }
  | { variant: 'now_playing'; movie: Movie };

/**
 * スポットライト用の大型フィーチャーカード
 *
 * バックドロップ画像を背景にフルワイドで表示し、
 * 左下にポスター＋メタ情報を配置する映画館風のレイアウト。
 *
 * @param props - 表示する映画データと表示バリアント
 */
const SpotlightCard = (props: Props) => {
  const { movie } = props;
  const backdropUrl = getTmdbImage(movie.backdropPath, TMDB_IMAGE_CONFIG.IMAGE_SIZES.BACKDROP.ORIGINAL);
  const posterUrl = getTmdbImage(movie.posterPath, TMDB_IMAGE_CONFIG.IMAGE_SIZES.POSTER.LARGE);
  const logoUrl = getTmdbImage(movie.logoPath, TMDB_IMAGE_CONFIG.IMAGE_SIZES.LOGO.LARGE);

  if (!backdropUrl) return null;

  return (
    <Link
      to={APP_PATHS.MOVIE_DETAIL.replace(':id', movie.id.toString())}
      className="group/spotlight relative block w-full overflow-hidden rounded-xl bg-gray-900"
    >
      {/* バックドロップ画像 */}
      <div className="relative w-full aspect-[21/9] md:aspect-[2.8/1] overflow-hidden">
        <motion.img
          src={backdropUrl}
          alt={movie.title}
          className="absolute inset-0 object-cover w-full h-full transition-transform duration-700 group-hover/spotlight:scale-105"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* 多段グラデーションオーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 via-gray-950/30 to-transparent" />

        {/* コンテンツ領域 */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end gap-4 p-4 md:gap-6 md:p-6 xl:gap-8 xl:p-10 2xl:p-12">
          {/* ポスター */}
          {posterUrl && (
            <motion.div
              className="relative flex-shrink-0 hidden overflow-hidden border rounded-lg shadow-2xl md:block w-28 xl:w-36 2xl:w-44 3xl:w-52 aspect-poster border-white/10 shadow-black/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img
                src={posterUrl}
                alt={movie.title}
                className="object-cover w-full h-full"
              />
            </motion.div>
          )}

          {/* メタ情報 */}
          <motion.div
            className="flex flex-col gap-2 pb-1 md:gap-3 md:pb-2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* ロゴ or タイトル */}
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${movie.title} logo`}
                className="object-contain max-w-32 md:max-w-48 xl:max-w-64 2xl:max-w-72 3xl:max-w-sm drop-shadow-lg"
              />
            ) : (
              <h3 className="text-lg font-bold text-white md:text-2xl xl:text-3xl 2xl:text-4xl drop-shadow-lg">
                {movie.title}
              </h3>
            )}

            {/* あらすじ */}
            {movie.overview && (
              <p className="hidden text-sm leading-relaxed text-gray-300 xl:block line-clamp-2 2xl:line-clamp-3 max-w-2xl 2xl:text-base drop-shadow-md">
                {movie.overview}
              </p>
            )}

            {/* メタバッジ群 */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              {props.variant === 'upcoming' && (
                <>
                  {/* 公開日 */}
                  {props.movie.releaseDateDisplay && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm px-3 py-1 text-xs font-medium text-gray-200 md:text-sm border border-white/5">
                      <CalendarDaysIcon className="w-3.5 h-3.5 text-red-400" />
                      {props.movie.releaseDateDisplay}
                    </span>
                  )}
                  {/* カウントダウン */}
                  {props.movie.upcomingBadgeLabel && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600/80 backdrop-blur-sm px-3 py-1 text-xs font-bold text-white md:text-sm shadow-lg shadow-red-900/30">
                      <ClockIcon className="w-3.5 h-3.5" />
                      {props.movie.upcomingBadgeLabel}
                    </span>
                  )}
                </>
              )}

              {props.variant === 'now_playing' && (
                <>
                  {/* 評価 */}
                  {movie.voteAverage !== null && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/20 backdrop-blur-sm px-3 py-1 text-xs font-bold text-yellow-300 md:text-sm border border-yellow-500/20">
                      <StarIcon className="w-3.5 h-3.5 text-yellow-400" />
                      {movie.voteAverage.toFixed(1)}
                    </span>
                  )}
                  {/* 公開中バッジ */}
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600/80 backdrop-blur-sm px-3 py-1 text-xs font-bold text-white md:text-sm shadow-lg shadow-red-900/30">
                    公開中
                  </span>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </Link>
  );
};

export default SpotlightCard;
