import React from 'react';
import { useParams } from 'react-router-dom';
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
    <div className="min-h-screen pb-6 font-sans antialiased font-medium bg-background text-on-surface selection:bg-primary/30">
      {/* Hero は即座に表示 */}
      <DetailHeroSection detail={detail} videoKey={videoUrl || null} />

      <div className="flex flex-col gap-0">
        <DetailActionSection
          movieId={detail.id}
          videoKey={videoUrl || null}
          watchProviders={watchProviders}
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

        <RecommendationSection recommendations={recommendations} />
      </div>
    </div>
  );
};

export default MovieDetailPage;
