import type { Movie } from '@/types/domain';
import MoviePoster from '@/components/movie-card/MoviePoster';

type Props = {
  movie: Movie;
  rank: number;
  className?: string;
};

/**
 * @summary 人気ランキング用カード。大きな順位番号とポスターを組み合わせる。
 * @param movie 映画エンティティ
 * @param rank 順位（1〜）
 */
export default function RankingMovieCard({ movie, rank, className = '' }: Props) {
  return (
    <div className={`relative flex items-center pr-4 shrink-0 transition-transform hover:scale-105 cursor-pointer ${className}`}>
      {/* 巨大な順位番号 (アウトライン) */}
      <div 
        className="text-[140px] md:text-[180px] font-black leading-none text-transparent tracking-tighter select-none drop-shadow-lg"
        style={{ 
          WebkitTextStroke: '2px #4b5563', 
          zIndex: 0, 
          marginRight: '-30px', 
          translate: '0 10%' 
        }}
      >
        {rank}
      </div>
      {/* ポスター画像 */}
      <div className="relative z-10 w-28 md:w-36 lg:w-44 flex-shrink-0">
         <MoviePoster movie={movie} className="shadow-2xl shadow-black/50" />
      </div>
    </div>
  );
}
