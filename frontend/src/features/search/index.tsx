import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { MoviePoster } from '@/components/movie-card';
import { useSearchMovies } from '@/hooks/useMovies';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { data: searchResults, isLoading, error } = useSearchMovies(query);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
        <p>エラーが発生しました</p>
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
          <h1 className="mb-2 text-3xl font-bold">{query ? `"${query}" の検索結果` : '検索'}</h1>
          {query && (
            <p className="text-gray-400">
              {isLoading ? '検索中...' : `${searchResults?.length}件の結果が見つかりました`}
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-400">読み込み中...</div>
          </div>
        ) : query && searchResults?.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-400">「{query}」に一致する映画が見つかりませんでした</p>
            <p className="mt-2 text-gray-500">別のキーワードで検索してみてください</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8">
            {searchResults?.map((movie) => (
              <MoviePoster key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {/* 検索クエリがない場合 */}
        {!query && (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-400">検索したい映画のタイトルを入力してください</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default SearchPage;
