import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import { useHomePage } from '@/hooks/useMovies';
import HeroSwiper from './components/HeroSwiper';
import SpotlightSection from './components/SpotlightSection';
import SpotlightCard from './components/SpotlightCard';
import UpcomingMovieCard from './components/UpcomingMovieCard';
import NowPlayingCard from './components/NowPlayingCard';
import SectionHeader from './components/SectionHeader';
import RankingMovieCard from './components/RankingMovieCard';
import NewReleaseMovieCard from './components/NewReleaseMovieCard';
import { Movie } from '@/types/api/dto';

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

  // 人気リストを3つのリストずつに分割
  const popularLists = data?.trending.reduce<Movie[][]>((acc, movie, index) => {
    if (index % 3 === 0) {
      acc.push([]);
    }
    acc[acc.length - 1].push(movie);
    return acc;
  }, []);

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
            items={data.upcoming}
            renderSpotlightItem={(movie) => <SpotlightCard movie={movie} variant="upcoming" />}
            renderRemainingItem={(movie) => (
              <UpcomingMovieCard movie={movie} className="basis-[32%] xl:basis-[22%] 2xl:basis-[12%]" /> // この２つのカード群は強調する
            )}
          />
        </motion.div>

        {/* ✦ スポットライト: 公開中 */}
        <motion.div variants={sectionVariants}>
          <SpotlightSection
            title="公開中の映画"
            subtitle="今、劇場で観られる映画"
            type="now_playing"
            items={data.nowPlaying}
            renderSpotlightItem={(movie) => <SpotlightCard movie={movie} variant="now_playing" />}
            renderRemainingItem={(movie) => (
              <NowPlayingCard movie={movie} className="basis-[32%] xl:basis-[22%] 2xl:basis-[12%]" /> // この２つのカード群は強調する
            )}
          />
        </motion.div>

        {/* 人気ランキング */}
        {data.trending && data.trending.length > 0 && (
          <motion.div variants={sectionVariants}>
            <div className="mt-12 px-4 py-8 rounded-3xl bg-[#131313]">
              <SectionHeader title="今週人気" type="trending" />
              <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide">
                {popularLists?.map((list, groupIndex) => (
                  <div key={groupIndex} className="flex-none flex flex-col gap-4 w-full snap-start">
                    {list.map((movie, itemIndex) => (
                      <RankingMovieCard 
                        key={movie.id} 
                        movie={movie} 
                        rank={groupIndex * 3 + itemIndex + 1} 
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* 新着作品 (2行グリッド横スクロール) */}
        {data.recentlyAdded && data.recentlyAdded.length > 0 && (
          <motion.div variants={sectionVariants}>
            <div className="p-2 mt-6 lg:mt-12 relative">
              <SectionHeader title="新着作品" type="recently_added" />
              {/* WebKit scrollbar を隠すためのクラスとスナップ用のスタイル */}
              <div 
                className="grid grid-rows-2 grid-flow-col gap-x-4 md:gap-x-6 gap-y-8 overflow-x-auto snap-x pt-2 pb-6 hide-scrollbar"
              >
                {data.recentlyAdded.map((movie) => (
                  <div className="w-48 sm:w-56 md:w-64 shrink-0 snap-start" key={movie.id}>
                    <NewReleaseMovieCard movie={movie} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default HomePage;

