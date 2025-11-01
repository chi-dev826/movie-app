import { useMovieList, useUpcomingMovies } from '../../hooks/useMovies';
import HeroSwiper from './components/HeroSwiper';
import MovieCard from '../../components/MovieCard';
import { ArrowTrendingUpIcon } from '@heroicons/react/20/solid';

/**
 * HomePage
 *
 * 映画アプリのホーム画面を構成するトップレベルのページコンポーネント。
 * 映画一覧（人気、現在上映中、高評価、話題）と公開予定映画を取得し、
 * ローディング・エラー状態を処理して、ヒーロー（スワイパー）表示用データを準備してレンダリングします。
 *
 * 動作概要
 * - `useMovieList()` でカテゴリ別の映画リストと読み込み／エラー状態を取得する。
 * - `useUpcomingMovies()` で公開予定映画を取得し、`overview` が空でないものをフィルタして最大5件を `heroMovieList` とする。
 * - 読み込み中はフルスクリーンの読み込み表示をレンダリングする。
 * - エラー時はエラーメッセージとバックエンド起動確認の注意文を表示する。
 * - `heroMovieList` が3件以上あれば `HeroSwiper` を表示する。
 * - 以下の日本語タイトルで4つのセクションを表示する：
 *   ['人気映画', '現在上映中', '高評価映画', '話題の映画']
 *   1つ目のセクション（index 0）には `ArrowTrendingUpIcon` を表示する。
 * - 各セクションは横スクロール可能な映画カード群を表示し、`movie.id` をキーにする。
 *
 * 実装上の注意
 * - `heroMovieList` は `filter` と `trim()` により説明文が意味を持つもののみを採用する。
 * - `data?.popular` のようにオプショナルチェーンを使い欠損を許容している。
 * - セクションのキーは現在 index を使っているため、並び替え等がある場合はカテゴリ名など安定したキーに変更を検討する。
 * - 横スクロール領域はアクセシビリティ改善（フォーカスインジケータ、キーボード操作の案内等）が必要な場合がある。
 * - デバッグ用の `console.log(heroMovieList)` が残っているため、本番では削除または条件付きにすることを推奨する。
 *
 * アクセシビリティ
 * - セクション見出しによりセマンティックな構造を提供している。
 * - `MovieCard` と `HeroSwiper` が適切なフォーカス管理やコントロールを公開していることを確認すること。
 *
 * @returns JSX.Element - 読み込み中、エラー、またはメインコンテンツのいずれかをレンダリングする。
 *
 * @example
 * <HomePage />
 */
function HomePage() {
  const { data, isLoading, error } = useMovieList();
  const { data: upcomingData } = useUpcomingMovies();

  const movieList = [data?.popular, data?.now_playing, data?.top_rated, data?.high_rated];
  const movieListTitles = ['人気映画', '現在上映中', '高評価映画', '話題の映画'];

  //ヒーローセクション用データフィルタリング
  const heroMovieList =
    upcomingData?.filter((movie) => movie.overview && movie.overview.trim() !== '').slice(0, 5) ??
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
    <div className="bg-black">
      {heroMovieList.length >= 3 && <HeroSwiper movies={heroMovieList} />}

      <div className="lg:p-6 2xl:p-20">
        {movieList.map((movies, index) => (
          <div key={index} className="pb-6 mb-4 border-b border-gray-800">
            <h4 className="flex gap-4 mb-2 text-xl font-semibold text-gray-300">
              {movieListTitles[index]}
              {index === 0 && <ArrowTrendingUpIcon className="text-white w-7 h-7" />}
            </h4>
            <div className="flex pt-2 space-x-8 overflow-x-auto lg:p-4 scrollbar-hide scroll-smooth">
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
