import { Link } from 'react-router-dom';
import type { Movie } from '@/types/domain';
import { getTmdbImage } from '@/utils/imageUtils';
import { TMDB_CONFIG } from '@/constants/config';

type Props = {
  movie: Movie;
  className?: string;
};

const MoviePoster = ({ movie, className = '' }: Props) => {
  const posterUrl = getTmdbImage(movie.poster_path, TMDB_CONFIG.IMAGE_SIZES.POSTER.MEDIUM);

  return (
    posterUrl && (
      <Link
        to={`/movie/${movie.id}`}
        className={`group/card relative block flex-shrink-0 rounded-md overflow-hidden bg-gray-800 shadow-2xl cursor-pointer transition-all duration-300 ease-in-out xl:hover:scale-105 xl:hover:shadow-slate-700 border border-gray-900 w-full aspect-[2/3] ${className}`}
      >
        <img
          src={posterUrl}
          alt={movie.original_title}
          className="block object-cover w-full h-full transition-all duration-300 ease-in-out"
          loading="lazy"
        />
      </Link>
    )
  );
};

export default MoviePoster;
