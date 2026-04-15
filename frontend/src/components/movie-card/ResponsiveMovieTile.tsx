import type { Movie } from '@/types/api/dto';
import MoviePoster from './MoviePoster';
import MovieBackdrop from './MovieBackdrop';

type Props = {
  movie: Movie;
};

const ResponsiveMovieTile = ({ movie }: Props) => {
  return (
    <>
      {/* モバイル用: ポスター表示 */}
      <MoviePoster movie={movie} className="xl:hidden basis-[28%] md:basis-[18%]" />{' '}
      {/* 少し小さめに表示して、公開予定作品・公開中作品を目立たせる}

      {/* デスクトップ用: 横長詳細表示 */}
      <MovieBackdrop
        movie={movie}
        className="hidden xl:block xl:basis-[24%] 2xl:basis-[18%] 4xl:basis-[14%]"
      />
    </>
  );
};

export default ResponsiveMovieTile;
