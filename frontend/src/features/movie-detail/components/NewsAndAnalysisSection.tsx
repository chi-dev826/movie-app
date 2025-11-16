import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper';
import 'swiper/css';

import { useMovieNews, useMovieAnalysis } from '../hooks/useMovieArticles';
import type { Article } from '@/types/domain';

export default function NewsAndAnalysisSection({
  movieId,
  movieTitle,
}: {
  movieId: number;
  movieTitle: string;
}) {
  const {
    data: newsItems,
    isLoading: isLoadingNews,
    error: errorNews,
  } = useMovieNews(movieId, movieTitle);
  const {
    data: analysisItems,
    isLoading: isLoadingAnalysis,
    error: errorAnalysis,
  } = useMovieAnalysis(movieId, movieTitle);

  const [isActiveTab, setIsActiveTab] = useState<'news' | 'analysis'>('news');
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  const handleTabChange = (index: number) => {
    if (swiper) {
      swiper.slideTo(index);
    }
  };

  const handleSlideChange = () => {
    if (swiper) {
      const activeIndex = swiper.activeIndex;
      setIsActiveTab(activeIndex === 0 ? 'news' : 'analysis');
    }
  };

  if (isLoadingNews || isLoadingAnalysis) {
    return <div>ニュースを読み込み中...</div>;
  }

  if (errorNews || errorAnalysis) {
    return (
      <div>
        ニュースの取得中にエラーが発生しました: {errorNews?.message || errorAnalysis?.message}
      </div>
    );
  }

  return (
    <section className="z-20 mt-20 xl:m-12 2xl:m-16 3xl:m-20">
      <span className="flex gap-5 text-2xl font-bold 3xl:gap-10 xl:mt-0">
        <span
          className={`text-base ml-2 xl:text-lg 3xl:text-2xl text-gray-400 transition-all hover:text-white font-bold xl:mt-0 ${
            isActiveTab === 'news'
              ? 'border-b-2 border-blue-500 text-white'
              : 'hover:border-b-2 hover:border-gray-500'
          }`}
          onClick={() => {
            setIsActiveTab('news');
            handleTabChange(0);
          }}
        >
          関連ニュース
        </span>
        <span
          className={`text-base xl:text-lg 3xl:text-2xl text-gray-400 transition-all hover:text-white font-bold xl:mt-0 ${
            isActiveTab === 'analysis'
              ? 'border-b-2 border-blue-500 text-white'
              : 'hover:border-b-2 hover:border-gray-500'
          }`}
          onClick={() => {
            setIsActiveTab('analysis');
            handleTabChange(1);
          }}
        >
          考察
        </span>
      </span>
      <Swiper onSwiper={setSwiper} onSlideChange={handleSlideChange}>
        <SwiperSlide>
          <ArticleList articles={newsItems} />
        </SwiperSlide>
        <SwiperSlide>
          <ArticleList articles={analysisItems} />
        </SwiperSlide>
      </Swiper>
    </section>
  );
}

export const ArticleList = ({ articles }: { articles: Article[] | undefined }) => {
  const itemLinkPrefix =
    articles && articles.length > 0 && articles[0].source === '映画.com' ? 'https://eiga.com' : '';
  return (
    <div className="flex flex-col gap-3 mt-6 xl:p-4 xl:gap-8 xl:grid xl:grid-cols-2 xl:hover">
      {articles?.map((article) => (
        <a
          key={article.title}
          href={`${itemLinkPrefix}${article.link}`}
          className="flex p-2 bg-gray-800 border rounded-lg xl:p-4 xl:hover:transition xl:duration-300 border-gray-950 xl:hover:shadow-lg xl:hover:scale-105 xl:hover:bg-gray-700"
        >
          <div className="flex-shrink-0 h-24 w-36 xl:h-48 xl:w-64">
            {article.imageUrl && (
              <img
                src={article.imageUrl}
                alt={article.title}
                className="object-cover w-full h-full"
              />
            )}
          </div>
          <div className="flex flex-col ml-2 xl:p-2 xl:mx-2">
            <h3 className="overflow-hidden font-semibold text-md line-clamp-2 md:text-lg xl:text-xl">
              {article.title}
            </h3>
            <p className="text-xs text-gray-300 line-clamp-4 xl:text-sm xl:line-clamp-5">
              {article.snippet}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
};
