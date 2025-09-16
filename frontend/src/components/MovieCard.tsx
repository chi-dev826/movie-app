import '../styles/App.css';
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
    <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-img-wrap">
      <img 
        src={movieImageUrl} 
        alt={movie.original_title} 
        className="movie-card__image"
        onError={(e) => {
          // 画像の読み込みに失敗した場合のフォールバック
          e.currentTarget.src = '/placeholder-movie.jpg';
        }}
      />
      <div className="movie-card__overlay">
        <h3 className="movie-card__title">{movie.original_title}</h3>
      </div>
    </Link>
  );
};

export default MovieCard;
