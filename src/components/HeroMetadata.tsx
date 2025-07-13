import { useMovies } from '../hooks/useMovies';
import { TMDB_IMAGE_BASE_URL } from '../../config';
import type { MovieDetail } from '../types';

type Props = {
  movieDetail: MovieDetail;
};

const HeroMetadata = ({ movieDetail }: Props) => {
  const { titleImagePath } = useMovies();
  const logoUrl = `${TMDB_IMAGE_BASE_URL}w500${titleImagePath}`;
  return (
    <div className="hero-metadata">
      <div key={movieDetail.id} className="MovieDetail-overlay-contents">
        <div className="MovieDetail-header">
          <img src={logoUrl} alt={movieDetail.original_title} className="MovieDetail-logo" />
        </div>
        <span className="MovieDetail-overlay">
          <span>
            {movieDetail.year}・{movieDetail.runtime}分・{movieDetail.genres.join(',')}
          </span>
        </span>
        <p className="MovieDetail-overview">{movieDetail.overview}</p>
      </div>
    </div>
  );
};

export default HeroMetadata;
