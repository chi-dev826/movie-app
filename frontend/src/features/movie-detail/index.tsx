import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFullMovieData } from '@/hooks/useMovies';

import { DetailHeroSection } from './components/DetailHeroSection';
import { DetailActionSection } from './components/DetailActionSection';
import { WatchProviderSection } from './components/WatchProviderSection';
import { StorySection } from './components/StorySection';
import { CastCarouselSection } from './components/CastCarouselSection';
import { MovieStatsSection } from './components/MovieStatsSection';
import { NewsAnalysisSection } from './components/NewsAnalysisSection';
import { TrailerCarouselSection } from './components/TrailerCarouselSection';
import { RecommendationSection } from './components/RecommendationSection';

/** スタガー制御用の親バリアント */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

/** 各セクションのフェードイン + 上方向スライド */
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export const MovieDetailPage: React.FC = () => {
  const { id: movieId } = useParams<{ id: string }>();
  const { data, isLoading, error } = useFullMovieData(Number(movieId));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-on-surface bg-background">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen text-on-surface bg-background">
        <p>エラーが発生しました: {error?.message}</p>
      </div>
    );
  }

  const { detail, watchProviders, videoUrl, otherVideoUrls, recommendations } = data;

  return (
    <div className="bg-background text-on-surface min-h-screen pb-6 font-sans font-medium selection:bg-primary/30 antialiased">
      {/* Hero は即座に表示（スタガー対象外） */}
      <DetailHeroSection detail={detail} videoKey={videoUrl || null} />

      {/* 以降のセクションを段階的にフェードイン */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={sectionVariants}>
          <DetailActionSection
            movieId={detail.id}
            videoKey={videoUrl || null}
            watchProviders={watchProviders}
          />
        </motion.div>

        <motion.div variants={sectionVariants}>
          <WatchProviderSection watchProviders={watchProviders} />
        </motion.div>

        <motion.div variants={sectionVariants}>
          <StorySection overview={detail.overview} />
        </motion.div>

        <motion.div variants={sectionVariants}>
          <CastCarouselSection cast={detail.cast} />
        </motion.div>

        <motion.div variants={sectionVariants}>
          <MovieStatsSection detail={detail} />
        </motion.div>

        <motion.div variants={sectionVariants}>
          <NewsAnalysisSection
            movieId={detail.id}
            movieTitle={detail.title}
            posterPath={detail.posterPath || ''}
          />
        </motion.div>

        <motion.div variants={sectionVariants}>
          <TrailerCarouselSection otherVideoUrls={otherVideoUrls} />
        </motion.div>

        <motion.div variants={sectionVariants}>
          <RecommendationSection recommendations={recommendations} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MovieDetailPage;
