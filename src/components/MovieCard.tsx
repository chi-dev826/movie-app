import '../styles/App.css';
import { Link } from 'react-router-dom';
import type { Props } from '../types';

const MovieCard = (props: Props) => {
  const { movie } = props;

  return (
    <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-img-wrap">
      <img
        src={`https://image.tmdb.org/t/p/w300_and_h450_bestv2${movie.poster_path}`}
        alt={movie.original_title}
        className="movie-card__image"
      />
      <div className="movie-card__overlay">
        <h3 className="movie-card__title">{movie.original_title}</h3>
      </div>
    </Link>
  );
};

export default MovieCard;
