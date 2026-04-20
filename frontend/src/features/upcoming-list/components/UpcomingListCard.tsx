import { Link } from 'react-router-dom';
import { CalendarDays, Play, Plus, Check, ChevronRight } from 'lucide-react';
import type { UpcomingMovie } from '@/types/api/dto';
import { getTmdbImage } from '@/utils/image';
import { IMAGE_CONFIG } from '@/constants/config';
import { APP_PATHS } from '@shared/constants/routes';
import { useWatchList } from '@/hooks/useWatchList';
import { usePrefetchMovieDetail } from '@/hooks/useMovies';

type Props = {
  movie: UpcomingMovie;
};

/**
 * 公開予定一覧ページ専用のリッチな映画カード
 */
const UpcomingListCard = ({ movie }: Props) => {
  const { isInWatchList, toggleWatchList } = useWatchList();
  const isInList = isInWatchList(movie.id);
  const prefetchMovieDetail = usePrefetchMovieDetail();

  const backdropUrl = getTmdbImage(movie.backdropPath, IMAGE_CONFIG.IMAGE_SIZES.BACKDROP.LARGE);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-[#0d0d0d] border border-white/5 shadow-2xl transition-all duration-300 hover:border-white/10">
      {/* 上部: バックドロップ画像 (リンク) */}
      <Link
        to={APP_PATHS.MOVIE_DETAIL.replace(':id', movie.id.toString())}
        onMouseEnter={() => prefetchMovieDetail(movie.id)}
        viewTransition
        className="relative block aspect-video overflow-hidden"
      >
        <img
          src={backdropUrl ?? ''}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* グラデーションオーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* 公開日バッジ (SpotlightCard互換) */}
        {movie.releaseDateDisplay && (
          <div className="absolute left-4 top-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-gray-200 border border-white/10">
              <CalendarDays className="w-3.5 h-3.5 text-red-500" />
              {movie.releaseDateDisplay}
            </span>
          </div>
        )}
      </Link>

      {/* 中部: コンテンツ */}
      <div className="flex flex-1 flex-col p-5">
        <h2 className="mb-2 text-xl font-black text-white line-clamp-1">{movie.title}</h2>
        <p className="mb-6 text-sm leading-relaxed text-gray-400 line-clamp-3">{movie.overview}</p>

        {/* 下部: アクションボタン */}
        <div className="mt-auto flex flex-col gap-3">
          <div className="flex gap-3">
            {/* 予告編再生 */}
            {movie.video ? (
              <Link
                to={APP_PATHS.TRAILER.replace(':id', movie.id.toString())}
                viewTransition
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 text-sm font-black text-black transition-all hover:from-red-600 hover:to-red-700 active:scale-95 disabled:opacity-50"
              >
                <Play className="h-4 w-4 fill-current" />
                予告編を観る
              </Link>
            ) : (
              <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gray-800 px-6 py-3 text-sm font-black text-gray-400 transition-all hover:from-gray-600 hover:to-gray-700 active:scale-95 disabled:opacity-50">
                <Play className="h-4 w-4 fill-current" />
                予告編は準備中
              </button>
            )}

            {/* ウォッチリスト追加 */}
            <button
              onClick={() => toggleWatchList(movie.id)}
              className={`flex h-12 w-12 items-center justify-center rounded-full border transition-all active:scale-90 ${
                isInList
                  ? 'border-blue-500/50 bg-blue-500/10 text-blue-500'
                  : 'border-white/10 bg-white/5 text-white hover:bg-white/10'
              }`}
              title={isInList ? 'ウォッチリストから削除' : 'ウォッチリストに追加'}
            >
              {isInList ? <Check className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
            </button>
          </div>

          {/* 詳細を見る */}
          <Link
            to={APP_PATHS.MOVIE_DETAIL.replace(':id', movie.id.toString())}
            viewTransition
            className="flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 py-3 text-sm font-bold text-gray-300 transition-all hover:bg-white/10 active:scale-[0.98]"
          >
            <ChevronRight className="h-4 w-4" />
            詳細を見る
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UpcomingListCard;
