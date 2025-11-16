import { useParams } from 'react-router-dom';
import { useMovieList } from '../../hooks/useMovies';
import MovieCard from '../../components/MovieCard';

const MovieList = () => {
  const { type } = useParams<{ type: 'popular' | 'now_playing' | 'top_rated' | 'high_rated' }>();
  const { data, isLoading, isError, error } = useMovieList();

  const movieList = type ? data?.[type] : [];
  const title = type ? type.replaceAll('_', ' ').toUpperCase() : 'Movies';

  if (isLoading) {
    return <div className="container px-4 py-8 mx-auto text-center">Loading movies...</div>;
  }

  if (isError) {
    return (
      <div className="container px-4 py-8 mx-auto text-center text-red-500">
        Error: {error.message}
      </div>
    );
  }

  if (!movieList || movieList.length === 0) {
    return (
      <div className="container px-4 py-8 mx-auto text-center">
        No movies found for this category.
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h2 className="mb-8 text-2xl font-bold tracking-tight text-white">
        {title}{' '}
        <span className="text-lg font-normal text-gray-400">({movieList.length} movies)</span>
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8">
        {movieList.map((movie) => (
          <MovieCard key={movie.id} movie={movie} layout="poster" />
        ))}
      </div>
    </div>
  );
};

export default MovieList;
