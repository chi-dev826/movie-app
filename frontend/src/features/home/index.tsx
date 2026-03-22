import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import { useHomePage } from '@/hooks/useMovies';
import HeroSwiper from './components/HeroSwiper';
import SpotlightSection from './components/SpotlightSection';
import SpotlightCard from './components/SpotlightCard';
import UpcomingMovieCard from './components/UpcomingMovieCard';
import NowPlayingCard from './components/NowPlayingCard';
import SectionHeader from './components/SectionHeader';
import HorizontalScrollContainer from '@/components/HorizontalScrollContainer';
import RankingMovieCard from './components/RankingMovieCard';
import TopRatedMovieCard from './components/TopRatedMovieCard';
import NewReleaseMovieCard from './components/NewReleaseMovieCard';
import MoviePoster from '@/components/movie-card/MoviePoster';

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
        <motion.div variants={itemVariants}>
          <HeroSwiper
            movies={data.hero}
            onSwiperReady={() => {
              setTimeout(() => controls.start('visible'), 0);
            }}
          />
        </motion.div>
      )}

      <motion.div className="lg:p-6 xl:p-12 2xl:p-20 2xl:pb-0" variants={itemVariants}>
        {/* ✦ スポットライト: 公開予定 */}
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

        {/* ✦ スポットライト: 公開中 */}
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

        {/* 人気ランキング */}
        {data.popular && data.popular.length > 0 && (
          <div className="p-2 mt-6 lg:mt-12">
            <SectionHeader title="人気ランキング" type="popular" />
            <HorizontalScrollContainer>
              {data.popular.map((movie, index) => (
                <RankingMovieCard key={movie.id} movie={movie} rank={index + 1} />
              ))}
            </HorizontalScrollContainer>
          </div>
        )}

        {/* 高評価映画 (縦2列の横スクロール) */}
        {data.topRated && data.topRated.length > 0 && (
          <div className="p-2 mt-6 lg:mt-12 relative">
            <SectionHeader title="高評価映画" type="top_rated" />
            <div 
              className="grid grid-rows-2 grid-flow-col gap-x-4 md:gap-x-6 gap-y-4 md:gap-y-6 overflow-x-auto snap-x pt-2 pb-6"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {data.topRated.map((movie) => (
                <div className="w-[85vw] sm:w-[400px] shrink-0 snap-start" key={movie.id}>
                  <TopRatedMovieCard movie={movie} className="w-full h-full m-0" />
                </div>
              ))}
            </div>
            {/* CSSで::-webkit-scrollbar { display: none; } が効かせるためのインラインスタイル補完 */}
            <style dangerouslySetInnerHTML={{__html: `
              .grid.grid-rows-2::-webkit-scrollbar { display: none; }
            `}} />
          </div>
        )}

        {/* 新着作品 (2行グリッド横スクロール) */}
        {data.recentlyAdded && data.recentlyAdded.length > 0 && (
          <div className="p-2 mt-6 lg:mt-12 relative">
            <SectionHeader title="新着作品" type="recently_added" />
            {/* WebKit scrollbar を隠すためのクラスとスナップ用のスタイル */}
            <div 
              className="grid grid-rows-2 grid-flow-col gap-x-4 md:gap-x-6 gap-y-8 overflow-x-auto snap-x pt-2 pb-6"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {data.recentlyAdded.map((movie) => (
                <div className="w-48 sm:w-56 md:w-64 shrink-0 snap-start" key={movie.id}>
                  <NewReleaseMovieCard movie={movie} />
                </div>
              ))}
            </div>
            {/* CSSで::-webkit-scrollbar { display: none; } が効かせるためのインラインスタイル補完 */}
            <style dangerouslySetInnerHTML={{__html: `
              .grid.grid-rows-2::-webkit-scrollbar { display: none; }
            `}} />
          </div>
        )}

        {/* 話題の映画 (小さめの純粋なポスター) */}
        {data.highRated && data.highRated.length > 0 && (
          <div className="p-2 mt-6 lg:mt-12">
            <SectionHeader title="話題の映画" type="high_rated" />
            <HorizontalScrollContainer>
              {data.highRated.map((movie) => (
                <div 
                  key={movie.id} 
                  className="w-24 md:w-32 lg:w-40 xl:w-44 shrink-0"
                >
                  <MoviePoster movie={movie} />
                </div>
              ))}
            </HorizontalScrollContainer>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default HomePage;
