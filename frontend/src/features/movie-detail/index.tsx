import React from 'react';
import { useParams } from 'react-router-dom';
import { useFullMovieData } from '@/hooks/useMovies';

import { DetailHeroSection } from './components/v2/DetailHeroSection';
import { DetailActionSection } from './components/v2/DetailActionSection';
import { WatchProviderSection } from './components/v2/WatchProviderSection';
import { StorySection } from './components/v2/StorySection';
import { CastCarouselSection } from './components/v2/CastCarouselSection';
import { MovieStatsSection } from './components/v2/MovieStatsSection';
import { NewsAnalysisSection } from './components/v2/NewsAnalysisSection';
import { TrailerCarouselSection } from './components/v2/TrailerCarouselSection';
import { RecommendationSection } from './components/v2/RecommendationSection';

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
      <DetailHeroSection detail={detail} videoKey={videoUrl || null} />
      
      <DetailActionSection 
        movieId={detail.id}
        videoKey={videoUrl || null}
        watchProviders={watchProviders} 
      />
      
      <WatchProviderSection watchProviders={watchProviders} />
      
      <StorySection overview={detail.overview} />
      
      <CastCarouselSection cast={detail.cast} />
      
      <MovieStatsSection detail={detail} />
      
      <NewsAnalysisSection movieId={detail.id} movieTitle={detail.title} posterPath={detail.posterPath || ''} />
      
      <TrailerCarouselSection otherVideoUrls={otherVideoUrls} />
      
      <RecommendationSection recommendations={recommendations} />
    </div>
  );
};

export default MovieDetailPage;
