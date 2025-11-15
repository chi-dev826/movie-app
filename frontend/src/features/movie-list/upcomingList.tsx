import { useUpcomingMovies } from '@/hooks/useMovies';
import { PlayCircleIcon } from '@heroicons/react/24/solid';

const UpcomingList = () => {
  const { data, isLoading, error } = useUpcomingMovies();

  const upcomingMovies = data
    ? data
        .filter((movie) => movie.release_date)
        .slice()
        .sort((a, b) => new Date(a.release_date!).getTime() - new Date(b.release_date!).getTime())
    : [];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="mt-2">
      <div className="flex flex-col items-center min-h-screen gap-1 text-white bg-gray-900 xl:grid xl:grid-cols-3">
        {upcomingMovies &&
          upcomingMovies.map((movie) => (
            <div className="w-full bg-gray-800 rounded-lg shadow-lg">
              <div key={movie.id} className="flex">
                <div className="p-4">
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                        : ''
                    }
                    alt={movie.title}
                    className="w-32 h-48 rounded-md xl:w-48 xl:h-72 "
                  />
                </div>
                <div className="flex-1 p-2">
                  <h2 className="mb-2 text-base font-bold line-clamp-2">{movie.title}</h2>
                  <p className="mb-2 text-sm text-gray-300 line-clamp-4">{movie.overview}</p>
                  <p className="text-sm">公開日: {movie.release_date}</p>
                  {movie.video && (
                    <button className="flex flex-col items-center">
                      <PlayCircleIcon className="w-8 h-8 m-4 text-white hover:text-blue-500" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default UpcomingList;
