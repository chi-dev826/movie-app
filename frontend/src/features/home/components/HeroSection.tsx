import { Link } from 'react-router-dom';
import { TMDB_IMAGE_BASE_URL } from '../../../../config';
import type { Movie } from '@/types/movie';

type Props = {
  movie: Movie;
};

const HeroSection = ({ movie }: Props) => {
  const backgroundImageUrl = `${TMDB_IMAGE_BASE_URL}original${movie.backdrop_path}`;
  const movieCardUrl = `${TMDB_IMAGE_BASE_URL}w300_and_h450_bestv2${movie.poster_path}`;

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="relative flex items-end justify-start w-full h-full overflow-hidden text-white bg-center bg-cover"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
      }}
    >
      {/* グラデーションオーバーレイ */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black to-black/30 md:bg-gradient-to-t md:from-black md:via-black/80 md:to-black/60" />

      {/* コンテンツ */}
      <div className="relative z-10 flex items-end gap-8 p-4 mx-auto md:p-8 lg:p-12 max-w-7xl">
        {/* ポスター画像（モバイルでは非表示） */}
        <div className="flex-shrink-0 hidden md:block">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl w-[200px] h-[300px] lg:w-[250px] lg:h-[375px]">
            <img
              src={movieCardUrl}
              alt={movie.original_title}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* テキストコンテンツ */}
        <div className="py-4">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl drop-shadow-lg">
            {movie.original_title}
          </h2>
          <p className="max-w-2xl leading-relaxed text-gray-200 drop-shadow-md line-clamp-3 md:line-clamp-4">
            {movie.overview}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default HeroSection;
