import { useSearchParams } from 'react-router-dom';
import { useUpcomingMovies } from '@/hooks/useMovies';
import { PlayCircleIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import HeroVideo from '../movie-detail/components/HeroVideo';

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
            new Date(a.release_date ?? '').getTime() -
            new Date(b.release_date ?? '').getTime()
        )
    : [];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <div className="mt-2">
        <div className="flex flex-col items-center min-h-screen gap-1 text-white bg-gray-900 xl:grid xl:grid-cols-3">
          {upcomingMovies &&
            upcomingMovies.map((movie) => (
              <div key={movie.id} className="w-full bg-gray-800 rounded-lg shadow-lg">
                <div className="flex">
                  <Link to={`/movie/${movie.id}`} className="p-4">
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                          : ''
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
    </>
  );
};

export default UpcomingList;
