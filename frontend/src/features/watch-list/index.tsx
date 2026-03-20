import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useWatchList } from '@/hooks/useWatchList';
import { useMoviesByIds } from '@/hooks/useMovies';
import { ResponsiveMovieTile } from '@/components/movie-card';

const WatchListPage = () => {
  const { watchList } = useWatchList();
  const { data: movies, isLoading, isError } = useMoviesByIds(watchList);

  if (watchList.length === 0) {
    return (
      <div className="min-h-screen text-white bg-gray-900">
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
            <h1 className="mb-2 text-3xl font-bold">ウォッチリスト</h1>
            <p className="text-gray-400">0件の映画</p>
          </div>
          <div className="py-12 text-center">
            <p className="text-lg text-gray-400">ウォッチリストは空です。映画を追加してみましょう！</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
        <div className="text-gray-400">読み込み中...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
        <p className="text-red-500">ウォッチリストの読み込みに失敗しました。</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white bg-gray-900">
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
          <h1 className="mb-2 text-3xl font-bold">ウォッチリスト</h1>
          <p className="text-gray-400">
            {movies?.length || 0}件の映画
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8">
          {movies?.map((movie) => (
            <ResponsiveMovieTile key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WatchListPage;
