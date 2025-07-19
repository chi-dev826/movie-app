import { Swiper, SwiperSlide } from 'swiper/react';
import { HeroSectionContents } from './HeroSectionContents';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import type { Movie } from '../types';

// 必要なCSSをインポート
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/effect-coverflow'; // coverflowエフェクトを使う場合

import '../styles/App.css';

type Props = {
  movies: Movie[];
};

export const HeroSwiper = ({ movies }: Props) => {
  const SwiperSettings = {
    // modulesにNavigationとPaginationを追加
    modules: [Navigation, Pagination, Autoplay, EffectCoverflow],
    effect: 'coverflow', // coverflowエフェクトを再度有効にする
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 2,
    loop: true,
    autoplay: { delay: 10000, disableOnInteraction: false },
    coverflowEffect: {
      rotate: 0,
      stretch: 30,
      depth: 100,
      modifier: 1.5,
      slideShadows: false,
    },
    // ナビゲーションオプションを追加
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    // ページネーションオプションを追加
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    initialSlide: 1, // 必要であれば
  };

  return (
    // SwiperコンポーネントのJSXの直後にボタンとページネーションの要素を追加
    <div className="hero-swiper-container">
      <Swiper {...SwiperSettings}>
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <HeroSectionContents movie={movie} />
          </SwiperSlide>
        ))}
      </Swiper>
      {/* ナビゲーションボタン */}
      <div className="swiper-button-prev"></div>
      <div className="swiper-button-next"></div>
      {/* ページネーション */}
      <div className="swiper-pagination"></div>
    </div>
  );
};
