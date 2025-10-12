import { TMDB_IMAGE_BASE_URL } from '../../config';
import { Link } from 'react-router-dom';
import type { Movie } from '../types';

type Props = {
  movie: Movie;
};

const MovieCard = ({ movie }: Props) => {
  const movieImageUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}w300_and_h450_bestv2${movie.poster_path}`
    : '/placeholder-movie.jpg'; // プレースホルダー画像のパス

  return (
    <Link
      to={`/movie/${movie.id}`}
      key={movie.id}
      className="group relative min-w-[200px] h-[300px] rounded-2xl overflow-hidden bg-gray-800 shadow-lg cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-red-900/50"
    >
      <img
        src={movieImageUrl}
        alt={movie.original_title}
        className="absolute w-full h-full object-cover block rounded-2xl transition-all duration-200 ease-in-out"
        onError={(e) => {
          // 画像の読み込みに失敗した場合のフォールバック
          e.currentTarget.src = '/placeholder-movie.jpg';
        }}
      />
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity duration-200 ease-in-out pointer-events-none rounded-2xl group-hover:opacity-100">
        <h3 className="text-white text-base font-bold p-4 w-full">{movie.original_title}</h3>
      </div>
    </Link>
  );
};

export default MovieCard;
