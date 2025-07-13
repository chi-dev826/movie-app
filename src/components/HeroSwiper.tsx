import { Swiper, SwiperSlide } from 'swiper/react';
import HeroSectionComponents from './HeroSection';
import { EffectCoverflow, Autoplay } from 'swiper/modules';
import type { Movie } from '../types';

import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../styles/App.css';
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
  };

  return (
    <Swiper {...SwiperSettings} className="hero-swiper">
      {movies.map((movie) => (
        <SwiperSlide className="hero-slide">
          <HeroSectionComponents key={movie.id} movie={movie} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroSwiper;
