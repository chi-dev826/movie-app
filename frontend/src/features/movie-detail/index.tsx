import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';

import MovieCard from '@/components/MovieCard';
import HeroMetadata from './components/DetailHeroMetadata';
import { useFullMovieData } from '@/hooks/useMovies';

function MovieDetailPage() {
  const { id: movieId } = useParams<{ id: string }>();

  const { data, isLoading, error } = useFullMovieData(movieId);
  const [isBackdropVisible, setIsBackdropVisible] = useState(true);

  useEffect(() => {
    // 背景が表示状態のときだけタイマーをセットする
    if (!isBackdropVisible) return;

    const timeoutId = window.setTimeout(() => {
      setIsBackdropVisible(false);
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [isBackdropVisible]);

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

  const collections = data?.collections ?? [];
  const similar = data?.similar ?? [];
  const relatedMovies = collections.length > 2 ? collections : similar;

  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-black">
      <section className="relative w-full overflow-hidden aspect-[16/9] 3xl:aspect-[21/9]">
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/20 to-black/100" />

        {/* フェードアウトする背景画像 */}
        <AnimatePresence>
          {isBackdropVisible && data?.detail?.backdrop_path && (
            <div className="absolute inset-0">
              <motion.img
                key={data.detail.backdrop_path}
                initial={{ opacity: 0, transition: { duration: 1, ease: 'easeInOut' } }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.1, transition: { duration: 1.5, ease: 'easeInOut' } }}
                transition={{ duration: 1 }}
                src={`https://image.tmdb.org/t/p/original${data.detail.backdrop_path}`}
                alt={data.detail.title}
                className="absolute inset-0 object-cover w-full h-full"
                style={{ zIndex: 10 }}
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
                src={`https://www.youtube.com/watch?v=${data.video}`}
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
              src={`https://image.tmdb.org/t/p/original${data.detail.backdrop_path}`}
              alt={data.detail.title}
              className="absolute inset-0 object-cover w-full h-full"
              style={{ zIndex: 5 }}
            />
          )
        )}
      </section>
      {/* メタデータ */}
      {data && (
        <>
          <div className="z-30 px-4 mt-10 text-white xl:absolute xl:bottom-0 xl:left-0 xl:mt-0 xl:p-12 2xl:p-16 3xl:p-20">
            <HeroMetadata
              movieDetail={data.detail}
              watchProviders={data.watchProviders}
              youtubeKey={data.video ?? null}
            />
          </div>
          <img
            src={`https://image.tmdb.org/t/p/original${data.detail.company_logo}`}
            alt={data.detail.title}
            style={{ zIndex: 5 }}
            className="absolute right-0 z-30 flex max-w-16 md:max-w-20 lg:max-w-24 xl:max-w-28 2xl:max-w-32 3xl:max-w-36 4xl:max-w-40 top-16"
          />
        </>
      )}
      <section className="z-20 m-4 lg:m-12 2xl:m-16 3xl:m-20">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-white sm:text-3xl">関連作品</h2>
        <div className="flex flex-shrink-0 p-4 space-x-6 overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-hide">
          {relatedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default MovieDetailPage;
