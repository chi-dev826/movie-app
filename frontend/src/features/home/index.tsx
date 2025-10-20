import { usePopularMovies } from '../../hooks/usePopularMovies';
import HeroSwiper from './components/HeroSwiper';
import MovieCard from '../../components/MovieCard';

function HomePage() {
  const { data: popularMovies, isLoading, error } = usePopularMovies();

  //ヒーローセクション用データフィルタリング
  const heroMovieList =
    popularMovies?.filter((movie) => movie.overview && movie.overview.trim() !== '').slice(0, 5) ??
    [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-white rounded-full animate-spin"></div>
          <p className="text-gray-400">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">エラーが発生しました</h2>
          <p className="mb-4 text-gray-400">
            {error instanceof Error ? error.message : String(error)}
          </p>
          <p className="text-sm text-gray-500">
            バックエンドサーバーが起動していることを確認してください
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950">
      {heroMovieList.length >= 3 && <HeroSwiper movies={heroMovieList} />}

      <div className="px-4 py-8 mx-auto max-w-20xl sm:px-6 lg:px-8">
        <h3 className="mb-6 text-2xl font-bold tracking-tight text-white sm:text-3xl">人気映画</h3>
        <div className="flex pb-4 space-x-8 overflow-x-auto scrollbar-hide">
          {popularMovies?.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
