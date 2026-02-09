import { Link } from 'react-router-dom';
import type { Movie } from '@/types/domain';
import { getTmdbImage } from '@/utils/imageUtils';
import { TMDB_CONFIG } from '@/constants/config';
import { APP_PATHS } from '@shared/constants/routes';

type Props = {
  movie: Movie;
  className?: string;
};

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

        {/* 下部の日付帯 */}
        <div className="absolute bottom-0 left-0 right-0 py-2 text-center border-t bg-black/60 backdrop-blur-md border-white/10">
          <span className="text-sm font-bold tracking-wider text-white md:text-base">
            {movie.release_date_display}
          </span>
        </div>

        {/* カウントダウンバッジ (バックエンド提供のラベルを表示) */}
        {movie.upcoming_badge_label && (
          <div className="absolute top-2 right-2 px-2 py-1 text-[10px] font-bold text-white bg-red-600 rounded shadow-lg">
            {movie.upcoming_badge_label}
          </div>
        )}

        {/* ホバー時のオーバーレイアクセント */}
        <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover/card:opacity-100" />
      </Link>
    )
  );
};

export default UpcomingMovieCard;
