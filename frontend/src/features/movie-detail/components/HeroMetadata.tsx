import { TMDB_IMAGE_BASE_URL } from '../../../../config';
import { MovieDetail } from '@/types/movie';

type Props = {
  movieDetail: MovieDetail;
  titleImagePath: string | null;
  watchProviders: string[];
};

const HeroMetadata = ({ movieDetail, titleImagePath, watchProviders }: Props) => {
  const watchProviderUrls = watchProviders.map(
    (logo_path) => `${TMDB_IMAGE_BASE_URL}w185${logo_path}`,
  );

  const TitleAndLogo = (
    <>
      {/* Mobile title/logo */}
      <div className="2xl:hidden">
        {titleImagePath ? (
          <img
            src={`${TMDB_IMAGE_BASE_URL}w92${titleImagePath}`}
            srcSet={`${TMDB_IMAGE_BASE_URL}w92${titleImagePath} 480w, ${TMDB_IMAGE_BASE_URL}w185${titleImagePath} 768w`}
            sizes="(min-width: 680px) 480px, (min-width: 1024px) 768px"
            alt={movieDetail.original_title}
            className="absolute right-2 top-16" //ヘッダー分下げる
          />
        ) : movieDetail.company_logo ? (
          <div>
            <img
              src={`${TMDB_IMAGE_BASE_URL}w92${movieDetail.company_logo}`}
              alt={movieDetail.original_title}
              className="absolute right-2 top-16"
            />
          </div>
        ) : (
          <h1 className="pt-4 text-4xl">{movieDetail.original_title}</h1>
        )}
      </div>
      {/* Desktop title/logo */}
      <div className="hidden 2xl:flex 2xl:h-2/5 2xl:items-center 2xl:justify-center">
        {titleImagePath ? (
          <img
            src={`${TMDB_IMAGE_BASE_URL}w342${titleImagePath}`}
            alt={movieDetail.original_title}
            className="mb-16"
          />
        ) : movieDetail.company_logo ? (
          <div>
            <img
              src={`${TMDB_IMAGE_BASE_URL}w185${movieDetail.company_logo}`}
              alt={movieDetail.original_title}
              className="absolute right-2 top-16"
            />
          </div>
        ) : (
          <h1 className="pt-4 text-4xl">{movieDetail.original_title}</h1>
        )}
      </div>
    </>
  );

  return (
    <div key={movieDetail.id} className="justify-center text-center lg:text-left">
      {TitleAndLogo}
      <div className="max-w-full lg:flex lg:flex-col lg:mt-5">
        <h1 className="block font-sans text-3xl font-extrabold lg:tex-2xl 2xl:text-5xl lg:mb-5">
          {movieDetail?.title}
        </h1>
        <span className="flex flex-col mt-2 mb-2 font-mono text-sm font-bold text-gray-300 lg:flex-row lg:space-x-2">
          <span>
            {movieDetail?.year} {movieDetail?.runtime}分
          </span>
          <span>{movieDetail.genres ? movieDetail.genres.join('・') : ''}</span>
        </span>
        <p className="font-extrabold text-white">{movieDetail.overview}</p>
      </div>
      {watchProviderUrls.length > 0 && (
        <div className="mt-12 flex-column lg:justify-start">
          <p className="font-mono text-sm text-gray-400">配信中のサービス</p>
          <div className="flex items-center justify-center mt-4 space-x-3 lg:flex lg:justify-start">
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
        {movieDetail.homePageUrl && (
          <a
            href={movieDetail.homePageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm font-semibold text-white transition-all bg-gray-600 rounded hover:bg-white hover:text-black"
          >
            公式サイトへ
          </a>
        )}
      </div>
    </div>
  );
};
export default HeroMetadata;
