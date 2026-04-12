import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useInfiniteMovieList } from '@/hooks/useMovies';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { MoviePoster } from '@/components/movie-card';


const getTitle = (type?: string) => {
  switch (type) {
    case 'popular':
      return '人気映画';
    case 'trending':
      return '今週人気の映画';
    case 'recently_added':
      return '最近追加された映画';
    case 'now_playing':
      return '公開中の映画';
    default:
      return '映画一覧';
  }
};

const MovieList = () => {
  const { type } = useParams<{
    type: 'popular' | 'recently_added' | 'now_playing' | 'trending';
  }>();
  const { 
    data, 
    isLoading: isCurrentlyLoading, 
    isError, 
    error: currentErrorObj,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useInfiniteMovieList(type);

  const sentinelRef = useInfiniteScroll(hasNextPage, isFetchingNextPage, fetchNextPage);

  const movieList = data?.pages.flatMap(page => page.movies) ?? [];
  const currentError = isError;

  const title = getTitle(type);

  if (isCurrentlyLoading) {
    return <div className="container px-4 py-8 mx-auto text-center">Loading movies...</div>;
  }

  if (currentError) {
    return (
      <div className="container px-4 py-8 mx-auto text-center text-red-500">
        Error: {currentErrorObj?.message || 'エラーが発生しました'}
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
          <h1 className="mb-2 text-3xl font-bold">{title}</h1>
          <p className="text-gray-400">
            {movieList.length}件の映画
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8">
          {movieList.map((movie) => (
            <MoviePoster key={movie.id} movie={movie} />
          ))}
        </div>

        {/* 無限スクロール用の番兵（Sentinel） */}
        {hasNextPage && (
          <div ref={sentinelRef} className="w-full h-1 mt-8" />
        )}

        {/* 読み込み中インジケーター */}
        {isFetchingNextPage && (
          <div className="py-8 text-center text-gray-400">
            読み込み中...
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieList;
