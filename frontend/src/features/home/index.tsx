import { useMovieList } from '../../hooks/useMovieList';
import HeroSwiper from './components/HeroSwiper';
import MovieCard from '../../components/MovieCard';

function HomePage() {
  const { data, isLoading, error } = useMovieList();

  const movieList = [data?.popular, data?.now_playing, data?.top_rated, data?.high_rated];
  const movieListTitles = ['人気映画', '現在上映中', '高評価映画', '話題の映画'];
  const popularMovies = data?.now_playing ?? [];
  //ヒーローセクション用データフィルタリング
  const heroMovieList =
    popularMovies?.filter((movie) => movie.overview && movie.overview.trim() !== '').slice(0, 5) ??
    [];

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
        {movieList.map((movies, index) => (
          <div key={index} className="mb-12">
            <h4 className="mb-4 text-xl font-semibold text-white">{movieListTitles[index]}</h4>
            <div className="flex pb-4 space-x-8 overflow-x-auto scrollbar-hide">
              {movies?.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
