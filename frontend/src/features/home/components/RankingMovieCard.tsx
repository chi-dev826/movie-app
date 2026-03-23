import type { Movie } from '@/types/domain';
import { TMDB_CONFIG } from '@/constants/config';
import { StarIcon } from '@heroicons/react/24/solid';
import { GENRE_MAP } from '@/constants/config';

type Props = {
  movie: Movie;
  rank: number;
};

/**
 * @summary 人気ランキング用カード。大きな順位番号とポスターを組み合わせる。
 * @param movie 映画エンティティ
 * @param rank 順位（1〜）
 */
export default function RankingMovieCard({ movie, rank }: Props) {
  const displayGenres = movie.genre_ids?.slice(0, 2).map((id) => GENRE_MAP.find((g) => g.id === id)?.name);
  // 5段階評価を10段階に戻す（Mapperで半分にされているため）
  const displayScore = movie.vote_average ? (movie.vote_average * 2).toFixed(1) : '0.0';

  return (
    <div className="flex items-center gap-4 p-2 bg-[#131313] rounded-3xl group hover:bg-[#1a1a1a] transition-colors duration-300">
      {/* ポスター */}
      <div className="flex-none w-24 h-36 overflow-hidden rounded-lg shadow-lg md:w-20 md:h-28">
        <img
          src={`${TMDB_CONFIG.IMAGE_BASE_URL}w342${movie.poster_path}`}
          alt={movie.title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* 詳細情報 */}
      <div className="flex-grow min-w-0">
        <h3 className="text-base font-black text-white uppercase truncate md:text-lg">
          {movie.title}
        </h3>
        <div className="flex flex-col gap-1.5 mt-1">
          <p className="text-xs font-bold text-gray-500 md:text-sm">
            {movie.release_date?.slice(0, 4)}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap gap-2">
              {displayGenres?.map((genre) => genre && (
                <span key={genre} className="px-1.5 py-0.5 text-[8px] font-black border border-gray-800 rounded text-gray-400 md:text-[10px] uppercase tracking-wider bg-black/20">
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
        <div className="flex items-center gap-1 font-black text-yellow-400 text-sm md:text-base">
          <StarIcon className="w-4 h-4" />
          <span>{displayScore}</span>
        </div>
        <div className="text-xs font-black text-emerald-500 md:text-sm italic">
          #{rank}
        </div>
      </div>
    </div>
  );
}
