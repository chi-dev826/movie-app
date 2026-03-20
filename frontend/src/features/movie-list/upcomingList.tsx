import { useSearchParams, Link } from 'react-router-dom';
import { useUpcomingMovies } from '@/hooks/useMovies';
import { PlayCircleIcon } from '@heroicons/react/24/solid';
import { ArrowLeft } from 'lucide-react';
import HeroVideo from '@/features/movie-detail/components/HeroVideo';
import { getTmdbImage } from '@/utils/imageUtils';
import { TMDB_CONFIG } from '@/constants/config';
import { APP_PATHS } from '@shared/constants/routes';

const UpcomingList = () => {
  const { data, isLoading, error } = useUpcomingMovies();
  const [searchParams, setSearchParams] = useSearchParams();

  const trailerKey = searchParams.get('trailer');
  const isModalOpen = !!trailerKey;

  const handleOpenModal = (key: string) => {
    setSearchParams({ trailer: key });
  };

  const handleCloseModal = () => {
    setSearchParams({});
  };

  const upcomingMovies = data
    ? data
        .filter((movie) => movie.release_date)
        .slice()
        .sort(
          (a, b) =>
            new Date(a.release_date ?? '').getTime() - new Date(b.release_date ?? '').getTime(),
        )
    : [];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="min-h-screen text-white bg-gray-900 pb-12">
      <div className="container px-4 py-8 mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center mb-4 text-gray-400 transition-colors hover:text-white"
          >
            <ArrowLeft size={20} className="mr-2" />
            ホームに戻る
          </Link>
          <h1 className="mb-2 text-3xl font-bold">公開予定の映画</h1>
          <p className="text-gray-400">
            {upcomingMovies.length}件の映画
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 xl:grid xl:grid-cols-3">
          {upcomingMovies &&
            upcomingMovies.map((movie) => (
              <div key={movie.id} className="w-full bg-gray-800 rounded-lg shadow-lg">
                <div className="flex">
                  <Link
                    to={APP_PATHS.MOVIE_DETAIL.replace(':id', movie.id.toString())}
                    className="p-4"
                  >
                    <img
                      src={
                        getTmdbImage(movie.poster_path, TMDB_CONFIG.IMAGE_SIZES.POSTER.LARGE) ?? ''
                      }
                      alt={movie.title}
                      className="w-32 h-48 rounded-md xl:w-48 xl:h-72 "
                    />
                  </Link>
                  <div className="flex-1 m-2">
                    <h2 className="mb-2 text-base font-bold line-clamp-2">{movie.title}</h2>
                    <p className="mb-2 text-sm text-gray-300 line-clamp-4">{movie.overview}</p>
                    <p className="text-sm">公開日: {movie.release_date}</p>
                    {movie.video && (
                      <button
                        onClick={() => handleOpenModal(movie.video || '')}
                        className="flex flex-col items-center"
                      >
                        <PlayCircleIcon className="w-8 h-8 mt-4 text-white hover:content-none xl:hover:text-blue-500" />
                        <span className="mt-1 mb-2 text-sm text-white hover:text-blue-500">
                          予告編を見る
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      {isModalOpen && <HeroVideo youtubeKey={trailerKey} onClose={handleCloseModal} />}
    </div>
  );
};

export default UpcomingList;
