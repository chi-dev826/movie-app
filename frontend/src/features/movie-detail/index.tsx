import React from 'react';
import { useParams } from 'react-router-dom';
import { useMovieDetailFlow } from '@/hooks/useMovies';

import { DetailHeroSection } from './components/DetailHeroSection';
import { DetailActionSection } from './components/DetailActionSection';
import { WatchProviderSection } from './components/WatchProviderSection';
import { StorySection } from './components/StorySection';
import { CastCarouselSection } from './components/CastCarouselSection';
import { MovieStatsSection } from './components/MovieStatsSection';
import { NewsAnalysisSection } from './components/NewsAnalysisSection';
import { TrailerCarouselSection } from './components/TrailerCarouselSection';
import { RecommendationSection } from './components/RecommendationSection';
import { MovieDetailSkeleton } from './components/MovieDetailSkeleton';

export const MovieDetailPage: React.FC = () => {
  const { id: movieId } = useParams<{ id: string }>();
  const { baseInfo, resources, recommendations } = useMovieDetailFlow(Number(movieId));

  if (baseInfo.isLoading) {
    return <MovieDetailSkeleton />;
  }

  if (baseInfo.error) {
    return <div>Error: {baseInfo.error.message}</div>;
  }

  const detail = baseInfo?.data;
  const mainVideoUrl = resources?.data?.videoInfo.video || null;
  const watchProviders = resources?.data?.watchProviders;
  const otherVideoUrls = resources?.data?.videoInfo.otherVideos;

  return (
    <div className="min-h-screen pb-6 font-sans antialiased font-medium bg-background text-on-surface selection:bg-primary/30">
      {/* Hero は即座に表示 */}
      {detail && <DetailHeroSection detail={detail} videoKey={mainVideoUrl || null} />}

      {detail && (
        <div className="flex flex-col gap-0">
          <DetailActionSection
            movieId={detail.id}
            videoKey={mainVideoUrl}
            watchProviders={watchProviders}
            homePageUrl={detail.homePageUrl || null}
          />
          <WatchProviderSection watchProviders={watchProviders} />

          <StorySection overview={detail.overview} />

          <CastCarouselSection cast={detail.cast} />

          <MovieStatsSection detail={detail} />

          <NewsAnalysisSection
            movieId={detail.id}
            movieTitle={detail.title}
            posterPath={detail.posterPath || ''}
          />

          <TrailerCarouselSection otherVideoUrls={otherVideoUrls} />
        </div>
      )}
      {recommendations && <RecommendationSection recommendations={recommendations.data} />}
    </div>
  );
};

export default MovieDetailPage;
