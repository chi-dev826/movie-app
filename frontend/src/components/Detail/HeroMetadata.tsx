import { TMDB_IMAGE_BASE_URL } from '../../../config';
import { MovieDetail } from '@/types/movie';

type Props = {
  movieDetail: MovieDetail;
  titleImagePath: string | null;
  watchProviders: string[];
  homePageUrl?: string | null;
};

const HeroMetadata = ({ movieDetail, titleImagePath, watchProviders, homePageUrl }: Props) => {
  const titleLogoUrl = `${TMDB_IMAGE_BASE_URL}w300${titleImagePath}`;
  const companyLogoUrl = `${TMDB_IMAGE_BASE_URL}w185${movieDetail.company_logo}`;
  const watchProviderUrls = watchProviders.map(
    (logo_path) => `${TMDB_IMAGE_BASE_URL}w185${logo_path}`,
  );

  return (
    <div className="justify-center text-center md:text-left">
      <div key={movieDetail.id}>
        {titleImagePath ? (
          <div className="">
            <img src={titleLogoUrl} alt={movieDetail.original_title} className="" />
          </div>
        ) : movieDetail.company_logo ? (
          <div>
            <img src={`${companyLogoUrl}`} alt={movieDetail.original_title} className="" />
            <h1 className="pt-4 text-4xl">{movieDetail.original_title}</h1>
          </div>
        ) : (
          <h1 className="pt-4 text-4xl">{movieDetail.original_title}</h1>
        )}
        <div className="max-w-full pt-5 text-gray-300">
          <span className="inline-block mb-2 font-mono text-sm font-bold">
            {movieDetail.year} {movieDetail.runtime}分 {movieDetail.genres}
          </span>
          <p className="font-extrabold text-white">{movieDetail.overview}</p>
        </div>
        {watchProviderUrls.length > 0 && (
          <div className="mt-12 flex-column md:justify-start">
            <p className="font-mono text-sm text-gray-400">配信中のサービス</p>
            <div className="flex mt-4 space-x-3">
              {watchProviderUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Watch Provider ${index + 1}`}
                  className="w-12 h-12 rounded-full"
                />
              ))}
            </div>
          </div>
        )}
        <div className="mt-7">
          {homePageUrl && (
            <a
              href={homePageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-semibold text-white transition-colors bg-gray-600 rounded hover:bg-white hover:text-black"
            >
              公式サイトへ
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
export default HeroMetadata;
