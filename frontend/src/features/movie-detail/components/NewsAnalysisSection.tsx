import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper';
import 'swiper/css';

import { useMovieNews, useMovieAnalysis } from '@/features/movie-detail/hooks/useMovieArticles';
import { IMAGE_CONFIG } from '@/constants/config';
import { getTmdbImage } from '@/utils/image';
import type { Article } from '@/types/api/dto';

interface NewsAnalysisSectionProps {
  movieId: number;
  movieTitle: string;
  posterPath: string;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface ArticleThumbnailProps {
  imageUrl: string | null | undefined;
  fallbackPosterUrl: string | null;
  alt: string;
}

/** 記事サムネイル。imageUrl → posterFallback → 空背景の3段フォールバック */
const ArticleThumbnail: React.FC<ArticleThumbnailProps> = ({
  imageUrl,
  fallbackPosterUrl,
  alt,
}) => {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        loading="lazy"
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    );
  }
  if (fallbackPosterUrl) {
    return (
      <div className="w-full h-full bg-surface-container-high">
        <img src={fallbackPosterUrl} alt="Movie poster" className="w-full h-full object-cover" />
      </div>
    );
  }
  return <div className="w-full h-full bg-surface-container-high" />;
};

interface ArticleCardProps {
  article: Article;
  category: string;
  fallbackPosterUrl: string | null;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, category, fallbackPosterUrl }) => (
  <a
    href={article.link}
    target="_blank"
    rel="noreferrer"
    className="flex flex-col gap-3 bg-surface-container-low p-4 rounded-2xl w-full border border-white/5 hover:bg-surface-container-highest transition-colors group cursor-pointer"
  >
    <div className="flex gap-4 items-center">
      <div className="w-28 h-28 md:w-32 md:h-32 rounded-xl overflow-hidden flex-shrink-0 relative">
        <ArticleThumbnail
          imageUrl={article.imageUrl}
          fallbackPosterUrl={fallbackPosterUrl}
          alt={`${category} thumbnail`}
        />
      </div>
      <div className="flex flex-col gap-1.5 justify-center">
        <span className="text-primary font-label text-[10px] uppercase font-bold tracking-widest">
          {category}
        </span>
        <h4 className="font-body font-bold text-sm md:text-lg leading-tight line-clamp-3 text-on-surface group-hover:text-primary transition-colors">
          {article.title}
        </h4>
        <span className="text-on-surface-variant font-label text-[10px] md:text-xs mt-1 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">public</span>
          {article.source}
        </span>
      </div>
    </div>
  </a>
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const getTabClassName = (isActive: boolean): string =>
  `font-label text-xs md:text-sm uppercase tracking-widest font-bold pb-2 -mb-[1px] transition-colors ${
    isActive
      ? 'text-primary border-b-2 border-primary'
      : 'text-on-surface-variant hover:text-on-surface'
  }`;

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

/**
 * @summary ニュース記事と分析記事をタブで切り替えて表示するコンポーネント。このコンポーネント内でデータ取得フックを呼ぶことで関心事をカプセル化する。
 * @param {NewsAnalysisSectionProps} props - データ取得に必要な映画IDとタイトル
 * @returns {React.ReactElement | null} データがない場合はnullを返す
 */
export const NewsAnalysisSection: React.FC<NewsAnalysisSectionProps> = ({
  movieId,
  movieTitle,
  posterPath,
}) => {
  const { data: newsItems } = useMovieNews(movieId, movieTitle);
  const { data: analysisItems } = useMovieAnalysis(movieId, movieTitle);

  const [activeTab, setActiveTab] = useState<'news' | 'analysis'>('news');
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  const hasNews = newsItems && newsItems.length > 0;
  const hasAnalysis = analysisItems && analysisItems.length > 0;

  if (!hasNews && !hasAnalysis) return null;

  const fallbackPosterUrl = getTmdbImage(posterPath, IMAGE_CONFIG.IMAGE_SIZES.POSTER.SMALL);

  return (
    <section className="py-6 border-t border-white/5 bg-surface-container-lowest">
      <div className="px-4 max-w-7xl mx-auto mb-6">
        <h3 className="font-headline text-2xl md:text-3xl font-bold tracking-tight text-on-surface mb-4 flex items-center gap-3">
          <span className="inline-block w-1 h-6 rounded-full bg-red-500 xl:h-7" />
          News & Analysis
        </h3>
        <div className="flex gap-6 border-b border-white/10 pb-0 mt-4">
          {hasNews && (
            <button
              onClick={() => {
                setActiveTab('news');
                if (swiper) swiper.slideTo(0);
              }}
              className={getTabClassName(activeTab === 'news')}
            >
              Related News
            </button>
          )}
          {hasAnalysis && (
            <button
              onClick={() => {
                setActiveTab('analysis');
                if (swiper) swiper.slideTo(hasNews ? 1 : 0);
              }}
              className={getTabClassName(activeTab === 'analysis')}
            >
              Analysis
            </button>
          )}
        </div>
      </div>
      <Swiper
        onSwiper={setSwiper}
        onSlideChange={(s) => {
          const isNewsFirst = hasNews;
          if (isNewsFirst) {
            setActiveTab(s.activeIndex === 0 ? 'news' : 'analysis');
          } else {
            setActiveTab('analysis');
          }
        }}
        className="w-full"
        autoHeight={false}
      >
        {hasNews && (
          <SwiperSlide>
            <div className="flex flex-col gap-4 px-4 pb-4 max-w-7xl mx-auto">
              {newsItems.map((item) => (
                <ArticleCard
                  key={item.id}
                  article={item}
                  category="News"
                  fallbackPosterUrl={fallbackPosterUrl}
                />
              ))}
            </div>
          </SwiperSlide>
        )}
        {hasAnalysis && (
          <SwiperSlide>
            <div className="flex flex-col gap-4 px-4 pb-4 max-w-7xl mx-auto">
              {analysisItems.map((item) => (
                <ArticleCard
                  key={item.id}
                  article={item}
                  category="Analysis"
                  fallbackPosterUrl={fallbackPosterUrl}
                />
              ))}
            </div>
          </SwiperSlide>
        )}
      </Swiper>
    </section>
  );
};
