import { Link } from 'react-router-dom';
import { TMDB_IMAGE_BASE_URL } from '../../../config';
import type { Movie } from '@/types/movie';

type Props = {
  movie: Movie;
};

const HeroSection = ({ movie }: Props) => {
  const backgorundImageUrl = `${TMDB_IMAGE_BASE_URL}original${movie.backdrop_path}`;
  const movieCardUrl = `${TMDB_IMAGE_BASE_URL}w300_and_h450_bestv2${movie.poster_path}`;

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="relative w-full h-full bg-cover bg-center flex items-end justify-start overflow-hidden text-white"
      style={{
        backgroundImage: `url(${backgorundImageUrl})`,
      }}
    >
      {/* グラデーションオーバーレイ */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />

      {/* コンテンツ */}
      <div className="relative z-10 flex items-end gap-8 p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
        {/* ポスター画像（モバイルでは非表示） */}
        <div className="hidden md:block flex-shrink-0">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl w-[200px] h-[300px] lg:w-[250px] lg:h-[375px]">
            <img
              src={movieCardUrl}
              alt={movie.original_title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* テキストコンテンツ */}
        <div className="py-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
            {movie.original_title}
          </h2>
          <p className="text-gray-200 leading-relaxed drop-shadow-md line-clamp-3 md:line-clamp-4 max-w-2xl">
            {movie.overview}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default HeroSection;
