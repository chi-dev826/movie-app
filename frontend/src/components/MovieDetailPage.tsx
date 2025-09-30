import MovieCard from './MovieCard';
import HeroMetadata from '../components/HeroMetadata';
import HeroMovie from '../components/HeroMovie';
import { useMovies } from '../hooks/useMovies';
import { TMDB_IMAGE_BASE_URL } from '../../config';

function MovieDetailPage() {
  const { movieDetail, youtubeKey, similarMovies, isLoading, error } = useMovies();
  const backdropUrl = `${TMDB_IMAGE_BASE_URL}original${movieDetail?.backdrop_path}`;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>エラーが発生しました</p>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${backdropUrl})`,
      }}
    >
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 to-black/90" />

      {movieDetail && (
        <div className="relative z-10 text-white">
          <section className="flex flex-col md:flex-row items-center gap-8 p-4 sm:p-8 md:p-12">
            <div className="w-full md:w-3/5 lg:w-2/5">
              <HeroMetadata movieDetail={movieDetail} />
            </div>
            <div className="w-full md:w-2/5 lg:w-3/5">
              <HeroMovie youtubeKey={youtubeKey} />
            </div>
          </section>

          {similarMovies.length > 0 && (
            <section className="mx-auto max-w-20xl px-4 py-8 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl mb-6">
                関連作品
              </h2>
              <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                {similarMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default MovieDetailPage;
