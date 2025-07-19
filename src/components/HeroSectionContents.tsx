import '../styles/App.css';
import { Link } from 'react-router-dom';
import { TMDB_IMAGE_BASE_URL } from '../../config';
import type { Movie } from '../types';

type Props = {
  movie: Movie;
};

const HeroSection = ({ movie }: Props) => {
  const backgorundImageUrl = `${TMDB_IMAGE_BASE_URL}original${movie.backdrop_path}`;
  const movieCardUrl = `${TMDB_IMAGE_BASE_URL}w300_and_h450_bestv2${movie.poster_path}`;

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="heroMovie-img-wrap"
      style={{
        backgroundImage: `url(${backgorundImageUrl})`,
      }}
    >
      <div className="heroMovie-gradient"></div>
      <div className="heroMovie-overlay-content">
        <div className="heroMovie-card">
          <img src={`${movieCardUrl}`} />
        </div>
        <h2 className="heroMovie-title">{movie.original_title}</h2>
        <p className="heroMovie-overview">{movie.overview}</p>
      </div>
    </Link>
  );
};

export default HeroSection;
