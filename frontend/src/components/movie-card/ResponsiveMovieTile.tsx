import type { Movie } from '@/types/domain';
import MoviePoster from './MoviePoster';
import MovieBackdrop from './MovieBackdrop';

type Props = {
  movie: Movie;
};

const ResponsiveMovieTile = ({ movie }: Props) => {
  return (
    <>
      {/* モバイル用: ポスター表示 */}
      <MoviePoster movie={movie} className="xl:hidden basis-[30%] md:basis-[18%]" />

      {/* デスクトップ用: 横長詳細表示 */}
      <MovieBackdrop
        movie={movie}
        className="hidden xl:block xl:basis-[24%] 2xl:basis-[18%] 4xl:basis-[14%]"
      />
    </>
  );
};

export default ResponsiveMovieTile;
