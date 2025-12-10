import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';

import { ResponsiveMovieTile } from '@/components/movie-card';
import HeroMetadata from './components/DetailHeroMetadata';
import HorizontalScrollContainer from '@/components/HorizontalScrollContainer';
import NewsAndAnalysisSection from './components/NewsAndAnalysisSection';
import { useFullMovieData } from '@/hooks/useMovies';
import { getTmdbImage } from '@/utils/imageUtils';
import { TMDB_CONFIG, EXTERNAL_URLS } from '@/constants/config';

function MovieDetailPage() {
  const { id: movieId } = useParams<{ id: string }>();

  const { data, isLoading, error } = useFullMovieData(Number(movieId));

  const [isBackdropVisible, setIsBackdropVisible] = useState(true);

  console.log(isBackdropVisible);

  useEffect(() => {
    // 背景が表示状態でビデオが存在するときだけタイマーをセットする
    if (!isBackdropVisible || !data?.video) return;

    const timeoutId = window.setTimeout(() => {
      setIsBackdropVisible(false);
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [isBackdropVisible, data?.video]);

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
        <p>エラーが発生しました</p>
      </div>
    );
  }

  // 関連作品の選定：collections（シリーズ作品）が2件以下ならsimilarを使う
  const collections = data?.collections ?? [];
  const similar = data?.similar ?? [];
  const relatedMovies = collections.length > 1 ? collections : similar;

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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col min-h-screen overflow-hidden bg-black"
    >
      <motion.section
        variants={itemVariants}
        className="relative w-full overflow-hidden aspect-video 2xl:aspect-cinema"
      >
        <div className="absolute inset-0 z-gradient bg-gradient-to-b from-black/20 to-black/100" />

        {/* フェードアウトする背景画像 */}
        <AnimatePresence>
          {isBackdropVisible && data?.detail?.backdrop_path && data?.video && (
            <div className="absolute inset-0">
              <motion.img
                key={data.detail.backdrop_path}
                initial={{ opacity: 0, transition: { duration: 1, ease: 'easeInOut' } }}
                animate={{ opacity: 1 }}
                exit={{
                  opacity: 0,
                  scale: 1.1,
                  transition: { duration: 1.5, ease: 'easeInOut' },
                }}
                transition={{ duration: 1 }}
                src={
                  getTmdbImage(data.detail.backdrop_path, TMDB_CONFIG.IMAGE_SIZES.BACKDROP.LARGE) ??
                  ''
                }
                alt={data.detail.title}
                className="absolute inset-0 object-cover w-full h-full z-backdrop"
              />
            </div>
          )}
        </AnimatePresence>

        {/* 動画プレイヤー */}
        {data?.video ? (
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div
              className="absolute w-full h-full top-1/2 left-1/2"
              style={{ transform: 'translate(-50%, -50%) scale(1.35)' }}
            >
              <ReactPlayer
                src={`${EXTERNAL_URLS.YOUTUBE_WATCH}${data.video}`}
                playing
                muted
                onEnded={() => setIsBackdropVisible(true)}
                onReady={() => setIsBackdropVisible(true)}
                controls={false}
                loop
                width="100%"
                height="100%"
              />
            </div>
          </div>
        ) : (
          data?.detail?.backdrop_path && (
            <img
              src={
                getTmdbImage(data.detail.backdrop_path, TMDB_CONFIG.IMAGE_SIZES.BACKDROP.LARGE) ??
                ''
              }
              alt={data.detail.title}
              className="absolute inset-0 object-cover w-full h-full"
            />
          )
        )}
      </motion.section>
      {/* メタデータ */}
      {data && (
        <>
          <motion.div
            className="w-full px-4 mt-10 text-white z-overlay xl:absolute xl:bottom-0 xl:left-0 xl:mt-0 xl:p-12 2xl:p-16 3xl:p-20"
            variants={itemVariants}
          >
            <HeroMetadata
              movieDetail={data.detail}
              watchProviders={data.watchProviders}
              youtubeKey={data.video ?? null}
            />
          </motion.div>
          {data.detail.company_logo && (
            <motion.img
              src={getTmdbImage(data.detail.company_logo, TMDB_CONFIG.IMAGE_SIZES.LOGO.LARGE) ?? ''}
              alt={data.detail.title}
              className="absolute right-0 flex z-overlay max-w-16 md:max-w-20 lg:max-w-24 xl:max-w-28 2xl:max-w-32 3xl:max-w-36 4xl:max-w-40 top-16"
              variants={itemVariants}
            />
          )}
        </>
      )}
      {data && (
        <motion.div variants={itemVariants}>
          <NewsAndAnalysisSection movieId={data.detail.id} movieTitle={data.detail.title} />
        </motion.div>
      )}
      <motion.section variants={itemVariants} className="mt-20 xl:m-12 3xl:mx-20 3xl:mt-0">
        {' '}
        <h2 className="mb-2 ml-2 text-base font-bold tracking-tight text-white xl:text-xl 3xl:text-2xl">
          関連作品
        </h2>
        <HorizontalScrollContainer>
          {relatedMovies.map((movie) => (
            <ResponsiveMovieTile key={movie.id} movie={movie} />
          ))}
        </HorizontalScrollContainer>
      </motion.section>
    </motion.div>
  );
}

export default MovieDetailPage;
