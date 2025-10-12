import { usePopularMovies } from '../hooks/usePopularMovies';
import HeroSwiper from '../components/Home/HeroSwiper';
import MovieCard from '../components/MovieCard';

function HomePage() {
  const { data: popularMovies, isLoading, error } = usePopularMovies();

  //ヒーローセクション用データフィルタリング
  const heroMovieList =
    popularMovies?.filter((movie) => movie.overview && movie.overview.trim() !== '').slice(0, 5) ??
    [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">エラーが発生しました</h2>
          <p className="text-gray-400 mb-4">
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
    <div className="bg-gray-900">
      {heroMovieList.length >= 3 && <HeroSwiper movies={heroMovieList} />}

      <div className="max-w-20xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl mb-6">人気映画</h3>
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {popularMovies?.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
