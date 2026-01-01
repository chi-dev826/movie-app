import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import { useMovieList, useUpcomingMovies, useNowPlayingMovies } from '@/hooks/useMovies';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import HeroSwiper from './components/HeroSwiper';
import { ResponsiveMovieTile } from '@/components/movie-card';
import HorizontalScrollContainer from '@/components/HorizontalScrollContainer';
import { APP_PATHS } from '@shared/constants/routes';

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
 * - `ResponsiveMovieTile` と `HeroSwiper` が適切なフォーカス管理やコントロールを公開していることを確認すること。
 *
 * @returns JSX.Element - 読み込み中、エラー、またはメインコンテンツのいずれかをレンダリングする。
 *
 * @example
 * <HomePage />
 */
function HomePage() {
  const { data, isLoading, error } = useMovieList();
  const { data: upcomingData } = useUpcomingMovies();
  const { data: nowPlayingData } = useNowPlayingMovies();
  const controls = useAnimation();

  const sections = [
    { title: '公開予定', type: 'upcoming', movies: upcomingData },
    { title: '公開中の映画', type: 'now_playing', movies: nowPlayingData },
    { title: '人気映画', type: 'popular', movies: data?.popular },
    { title: '最近追加された映画', type: 'recently_added', movies: data?.recently_added },
    { title: '高評価映画', type: 'top_rated', movies: data?.top_rated },
    { title: '話題の映画', type: 'high_rated', movies: data?.high_rated },
  ];

  // 上位五件のデータをヒーロースワイパー用に抽出
  const heroMovieList = upcomingData?.slice(0, 5) ?? [];

  // HeroSwiperが表示されない場合は、すぐにアニメーションを開始する
  useEffect(() => {
    if (heroMovieList.length < 3) {
      setTimeout(() => controls.start('visible'), 0);
    }
  }, [heroMovieList.length, controls]);

  // アニメーション設定
  const containerVariants = {
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.3,
      },
    },
    hidden: {
      opacity: 0,
    },
  };

  const itemVariants = {
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hidden: { opacity: 0, y: 20 },
  };

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
    <motion.div
      className="bg-black"
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      {heroMovieList.length >= 3 && (
        <motion.div variants={itemVariants}>
          <HeroSwiper
            movies={heroMovieList}
            onSwiperReady={() => {
              setTimeout(() => controls.start('visible'), 0);
            }}
          />
        </motion.div>
      )}

      <motion.div className="lg:p-6 2xl:p-20 2xl:pb-0" variants={itemVariants}>
        {sections.map((section) => (
          <div key={section.type} className="p-2">
            <Link to={APP_PATHS.MOVIES.BY_TYPE.replace(':type', section.type)}>
              <span className="flex items-center gap-1 mb-1 ml-2 text-xs font-semibold text-gray-500 md:text-sm 2xl:text-md 3xl:text-lg hover:text-gray-300">
                {section.title}
                <ChevronRightIcon className="relative w-4 h-4 md:w-5 md:h-5 xl:w-6 xl:h-6 -bottom-px" />
              </span>
            </Link>
            <HorizontalScrollContainer>
              {section.movies?.map((movie) => (
                <ResponsiveMovieTile key={movie.id} movie={movie} />
              ))}
            </HorizontalScrollContainer>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default HomePage;
