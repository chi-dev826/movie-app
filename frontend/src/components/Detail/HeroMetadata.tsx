import { TMDB_IMAGE_BASE_URL } from '../../../config';
import { MovieDetail } from '@/types/movie';

type Props = {
  movieDetail: MovieDetail;
  titleImagePath: string | null;
};

const HeroMetadata = ({ movieDetail, titleImagePath }: Props) => {
  const logoUrl = `${TMDB_IMAGE_BASE_URL}w500${titleImagePath}`;
  const companyLogoUrl = `${TMDB_IMAGE_BASE_URL}w185${movieDetail.company_logo}`;

  return (
    <div className="hero-metadata">
      <div key={movieDetail.id} className="MovieDetail-overlay-contents">
        {titleImagePath ? (
          <div className="MovieDetail-header">
            <img src={logoUrl} alt={movieDetail.original_title} className="MovieDetail-logo" />
          </div>
        ) : (
          <div>
            <img
              src={`${companyLogoUrl}`}
              alt={movieDetail.original_title}
              className="MovieDetail-poster"
            />
            <h1 className="pt-4 text-4xl">{movieDetail.original_title}</h1>
          </div>
        )}
        <div className="pt-4 text-sm text-gray-300">
          <span>
            {movieDetail.year}・{movieDetail.runtime}分・{movieDetail.genres}
          </span>
        </div>
        <p className="MovieDetail-overview">{movieDetail.overview}</p>
      </div>
    </div>
  );
};

export default HeroMetadata;
