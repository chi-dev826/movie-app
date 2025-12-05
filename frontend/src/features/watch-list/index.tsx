import { useWatchList } from '@/hooks/useWatchList';
import { useMoviesByIds } from '@/hooks/useMovies';
import { ResponsiveMovieTile } from '@/components/movie-card';

const WatchListPage = () => {
  const { watchList } = useWatchList();
  const { data: movies, isLoading, isError } = useMoviesByIds(watchList);

  if (watchList.length === 0) {
    return (
      <div className="container px-4 py-8 mx-auto text-center">
        <h2 className="mb-4 text-2xl font-bold text-white">Your Watchlist</h2>
        <p className="text-gray-400">Your watchlist is empty. Add some movies!</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="container px-4 py-8 mx-auto text-center">Loading watchlist...</div>;
  }

  if (isError) {
    return (
      <div className="container px-4 py-8 mx-auto text-center text-red-500">
        Failed to load watchlist movies.
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h2 className="mb-8 text-2xl font-bold tracking-tight text-white">
        Your Watchlist
        <span className="ml-2 text-lg font-normal text-gray-400">
          ({movies?.length || 0} movies)
        </span>
      </h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8">
        {movies?.map((movie) => (
          <ResponsiveMovieTile key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default WatchListPage;
