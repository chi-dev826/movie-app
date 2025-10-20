import { Swiper, SwiperSlide } from 'swiper/react';
import HeroSection from './HeroSection';
import { EffectCoverflow, Autoplay } from 'swiper/modules';
import type { Movie } from '@/types/movie';

import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import 'swiper/css';

type Props = {
  movies: Movie[];
};

const HeroSwiper = ({ movies }: Props) => {
  const SwiperSettings = {
    modules: [EffectCoverflow, Autoplay],
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    loop: true,
    autoplay: { delay: 10000, disableOnInteraction: false },
    coverflowEffect: {
      rotate: 0,
      stretch: 30,
      depth: 100,
      modifier: 1.5,
      slideShadows: false,
    },
    // デフォルト (モバイル) は1枚表示
    slidesPerView: 1,
    breakpoints: {
      // 画面幅が1024px以上の場合
      1024: {
        slidesPerView: 2, // 2枚表示にする
      },
    },
  };

  return (
    <Swiper {...SwiperSettings} className="w-full h-[70vh] lg:h-[70vh]">
      {movies.map((movie) => (
        <SwiperSlide key={movie.id} className="flex w-full h-full">
          <HeroSection movie={movie} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroSwiper;
