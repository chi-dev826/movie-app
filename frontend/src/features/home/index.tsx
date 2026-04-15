import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import { useHomePage } from '@/hooks/useMovies';
import HeroSwiper from './components/HeroSwiper';
import SpotlightSection from './components/SpotlightSection';
import SpotlightCard from './components/SpotlightCard';
import UpcomingMovieCard from './components/UpcomingMovieCard';
import NowPlayingCard from './components/NowPlayingCard';
import TrendingSection from './components/TrendingSection';
import RecentlyAddedSection from './components/RecentlyAddedSection';

/** スタガー制御用の親バリアント（詳細ページと統一） */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

/** 各セクションのフェードイン + 上方向スライド（詳細ページと統一） */
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

/**
 * HomePage
 *
 * 映画アプリのホーム画面を構成するトップレベルのページコンポーネント。
 * バックエンドの `GET /api/home` BFFエンドポイントを利用して一括でデータを取得。
 *
 * レイアウト構成:
 * 1. HeroSwiper — 公開中・新着・公開予定がミックスされたバッジ付き大型スワイパー
 * 2. スポットライトセクション — 公開予定・公開中を大型フィーチャー＋横スクロールで強調
 * 3. 通常セクション — 人気映画・高評価等を従来の横スクロールで表示
 *
 * @returns JSX.Element
 */
function HomePage() {
  const { data, isLoading, error } = useHomePage();
  const controls = useAnimation();

  // HeroSwiperが表示されない場合は、すぐにアニメーションを開始する
  useEffect(() => {
    if (!data?.hero || data.hero.length < 3) {
      setTimeout(() => controls.start('visible'), 0);
    }
  }, [data?.hero, controls]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error || !data) {
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
      {/* ヒーロースワイパー（公開中 / 新着 / 公開予定ミックス） */}
      {data.hero.length >= 3 && (
        <motion.div variants={sectionVariants}>
          <HeroSwiper
            movies={data.hero}
            onSwiperReady={() => {
              setTimeout(() => controls.start('visible'), 0);
            }}
          />
        </motion.div>
      )}

      <div className="lg:p-6 xl:p-12 2xl:p-20 2xl:pb-0">
        {/* ✦ スポットライト: 公開予定 */}
        <motion.div variants={sectionVariants}>
          <SpotlightSection
            title="公開予定"
            subtitle="まもなく公開される注目作品"
            type="upcoming"
            initialData={data.upcoming}
            renderSpotlightItem={(movie) => <SpotlightCard movie={movie} variant="upcoming" />}
            renderRemainingItem={(movie) => (
              <UpcomingMovieCard
                movie={movie}
                className="basis-[32%] xl:basis-[22%] 2xl:basis-[12%]"
              /> // この２つのカード群は強調する
            )}
          />
        </motion.div>

        {/* ✦ スポットライト: 公開中 */}
        <motion.div variants={sectionVariants}>
          <SpotlightSection
            title="公開中の映画"
            subtitle="今、劇場で観られる映画"
            type="now_playing"
            initialData={data.nowPlaying}
            renderSpotlightItem={(movie) => <SpotlightCard movie={movie} variant="now_playing" />}
            renderRemainingItem={(movie) => (
              <NowPlayingCard
                movie={movie}
                className="basis-[32%] xl:basis-[22%] 2xl:basis-[12%]"
              /> // この２つのカード群は強調する
            )}
          />
        </motion.div>

        {/* 人気ランキング */}
        {data.trending && data.trending.movies.length > 0 && (
          <motion.div variants={sectionVariants}>
            <TrendingSection initialData={data.trending} />
          </motion.div>
        )}

        {/* 新着作品 (2行グリッド横スクロール) */}
        {data.recentlyAdded && data.recentlyAdded.movies.length > 0 && (
          <motion.div variants={sectionVariants}>
            <RecentlyAddedSection initialData={data.recentlyAdded} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default HomePage;
