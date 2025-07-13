import '../styles/App.css';
import { Link } from 'react-router-dom';
import type { Movie } from '../types';

type Props = {
  movie: Movie;
};

const HeroSection = ({ movie }: Props) => {
  return (
    <Link
      to={`/movie/${movie.id}`}
      className="heroMovie-img-wrap"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
      }}
    >
      <div className="heroMovie-gradient"></div>
      <div className="heroMovie-overlay-content">
        <div className="heroMovie-card">
          <img src={`https://image.tmdb.org/t/p/w300_and_h450_bestv2${movie.poster_path}`} />
        </div>
        <h2 className="heroMovie-title">{movie.original_title}</h2>
        <p className="heroMovie-overview">{movie.overview}</p>
      </div>
    </Link>
  );
};

export default HeroSection;
