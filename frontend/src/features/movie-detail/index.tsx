import React from 'react';
import { useParams } from 'react-router-dom';
import { useFullMovieData } from '@/hooks/useMovies';
import { EXTERNAL_URLS } from '@/constants/config';

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

  const { detail, watchProviders, video, otherVideos, recommendations } = data;

  const providerLinks = {
    'Disney Plus': () => null,
    Netflix: (title: string) => `${EXTERNAL_URLS.NETFLIX_SEARCH}${encodeURIComponent(title)}`,
    'Apple TV': (title: string) => `${EXTERNAL_URLS.APPLE_TV_SEARCH}${encodeURIComponent(title)}`,
    'Amazon Prime Video': (title: string) =>
      `${EXTERNAL_URLS.AMAZON_SEARCH}${encodeURIComponent(title)}${EXTERNAL_URLS.AMAZON_SEARCH_PARAMS}`,
    Hulu: (title: string) => `${EXTERNAL_URLS.HULU_SEARCH}${encodeURIComponent(title)}`,
    'U-NEXT': (title: string) => `${EXTERNAL_URLS.UNEXT_SEARCH}${encodeURIComponent(title)}`,
  };

  const providerListWithLinks = watchProviders?.map((provider) => {
    const link = providerLinks[provider.name as keyof typeof providerLinks]
      ? providerLinks[provider.name as keyof typeof providerLinks](detail.title)
      : null;
    return { ...provider, link };
  });

  return (
    <div className="bg-background text-on-surface min-h-screen pb-12 font-sans font-medium selection:bg-primary/30 antialiased">
      <DetailHeroSection detail={detail} videoKey={video || null} />
      
      <DetailActionSection 
        movieId={detail.id}
        videoKey={video || null}
        watchProviders={providerListWithLinks} 
      />
      
      <WatchProviderSection watchProviders={providerListWithLinks} />
      
      <StorySection overview={detail.overview} />
      
      <CastCarouselSection cast={detail.cast} />
      
      <MovieStatsSection detail={detail} />
      
      <NewsAnalysisSection movieId={detail.id} movieTitle={detail.title} posterPath={detail.poster_path || ''} />
      
      <TrailerCarouselSection otherVideos={otherVideos} />
      
      <RecommendationSection recommendations={recommendations} />
    </div>
  );
};

export default MovieDetailPage;
