import { useParams } from 'react-router-dom';

import MovieCard from '../components/MovieCard';
import HeroMetadata from '../components/Detail/HeroMetadata';
import HeroMovie from '../components/Detail/HeroMovie';
import { useFullMovieData } from '../hooks/useMovies';
import { TMDB_IMAGE_BASE_URL } from '../../config';

function MovieDetailPage() {
  const { id: movieId } = useParams<{ id: string }>();
  const { data, isLoading, error } = useFullMovieData(movieId);
  const backdropUrl = `${TMDB_IMAGE_BASE_URL}original${data?.detail?.backdrop_path}`;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
        <p>エラーが発生しました</p>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen bg-center bg-cover"
      style={{
        backgroundImage: `url(${backdropUrl})`,
      }}
    >
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 to-black/90" />

      {data && (
        <div className="relative z-10 text-white">
          <section className="flex flex-col items-center gap-8 p-4 md:flex-row sm:p-8 md:p-12">
            <div className="w-full md:w-3/5 lg:w-2/5">
              <HeroMetadata movieDetail={data.detail} titleImagePath={data.image} />
            </div>
            <div className="w-full md:w-2/5 lg:w-3/5">
              <HeroMovie youtubeKey={data.video} />
            </div>
          </section>

          {data.similar.length > 0 && (
            <section className="px-4 py-8 mx-auto max-w-20xl sm:px-6 lg:px-8">
              <h2 className="mb-6 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                関連作品
              </h2>
              <div className="flex pb-4 space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                {data.similar.map((movie) => (
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
