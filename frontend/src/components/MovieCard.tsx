import { TMDB_IMAGE_BASE_URL } from '../../config';
import { Link } from 'react-router-dom';
import type { Movie } from '@/types/movie';

type Props = {
  movie: Movie;
};

const MovieCard = ({ movie }: Props) => {
  const movieImageUrl = `${TMDB_IMAGE_BASE_URL}w300_and_h450_bestv2${movie.poster_path}`;

  return (
    movie.poster_path && (
      <Link
        to={`/movie/${movie.id}`}
        key={movie.id}
        className="group relative min-w-[200px] h-[300px] rounded-2xl overflow-hidden bg-gray-800 shadow-lg cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-red-900/50"
      >
        <img
          src={movieImageUrl}
          alt={movie.original_title}
          className="absolute block object-cover w-full h-full transition-all duration-200 ease-in-out rounded-2xl"
        />
        <div className="absolute inset-0 flex items-end transition-opacity duration-200 ease-in-out opacity-0 pointer-events-none bg-gradient-to-t from-black/80 to-transparent rounded-2xl group-hover:opacity-100">
          <h3 className="w-full p-4 text-base font-bold text-white">{movie.original_title}</h3>
        </div>
      </Link>
    )
  );
};

export default MovieCard;
