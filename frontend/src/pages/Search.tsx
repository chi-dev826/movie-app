import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { useSearchMovies } from '../hooks/useMovies';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { data: searchResults, isLoading, error } = useSearchMovies(query);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>エラーが発生しました</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            ホームに戻る
          </Link>
          <h1 className="text-3xl font-bold mb-2">{query ? `"${query}" の検索結果` : '検索'}</h1>
          {query && (
            <p className="text-gray-400">
              {isLoading ? '検索中...' : `${searchResults?.length}件の結果が見つかりました`}
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-400">読み込み中...</div>
          </div>
        ) : query && searchResults?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">「{query}」に一致する映画が見つかりませんでした</p>
            <p className="text-gray-500 mt-2">別のキーワードで検索してみてください</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {searchResults?.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {/* 検索クエリがない場合 */}
        {!query && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">検索したい映画のタイトルを入力してください</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
