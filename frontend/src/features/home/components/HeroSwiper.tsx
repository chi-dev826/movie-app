import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper';
import { EffectCoverflow, Autoplay, Pagination, Navigation } from 'swiper/modules';
import { AnimatePresence, motion } from 'framer-motion';
import ReactPlayer from 'react-player';

import type { Movie } from '@/types/movie';
import { useHoverVisibility } from '../hooks/useHoverVisibility';
import HomeHeroMetadata from './HomeHeroMetadata';

import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import 'swiper/css';

type Props = {
  movies: Movie[];
};

const HeroSwiper = ({ movies }: Props) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const SwiperSettings = {
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
    slidesPerView: 1,
    pagination: { clickable: true },
    navigation: true,
    modules: [EffectCoverflow, Autoplay, Pagination, Navigation],
  };

  return (
    <Swiper
      {...SwiperSettings}
      onSwiper={(swiper) => (swiperRef.current = swiper)}
      className="hero-swiper w-full aspect-video lg:aspect-[21/9] 3xl:aspect-[27/9] 4xl:aspect-[27/9]"
    >
      {movies.map((movie) => (
        <SwiperSlide
          key={movie.id}
          onMouseEnter={() => {
            setHoveredId(movie.id);
            swiperRef.current?.autoplay.stop();
          }}
          onMouseLeave={() => {
            setHoveredId(null);
            swiperRef.current?.autoplay.start();
          }}
          className="flex w-full h-full"
        >
          <HeroSlide movie={movie} isHovered={hoveredId === movie.id} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroSwiper;

// HeroSlide component
type HeroSlideProps = {
  movie: Movie;
  isHovered: boolean;
};

const HeroSlide = ({ movie, isHovered }: HeroSlideProps) => {
  const { isBackdropVisible, isVideoVisible } = useHoverVisibility(isHovered);

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="relative flex items-end justify-start w-full h-full overflow-hidden text-white"
    >
      {/* フェードアウトする背景画像 */}
      <AnimatePresence>
        {isBackdropVisible && movie.youtube_key && (
          <div className="absolute inset-0 z-10">
            <motion.img
              key={`https://image.tmdb.org/t/p/original${movie.youtube_key}`}
              initial={{ opacity: 0, transition: { duration: 1, ease: 'easeInOut' } }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                scale: 1.1,
                transition: { duration: 1.5, ease: 'easeInOut' },
              }}
              transition={{ duration: 1 }}
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              className="absolute inset-0 object-cover w-full h-full"
              style={{ zIndex: 10 }}
            />
          </div>
        )}
      </AnimatePresence>

      {/* 動画プレイヤー */}
      {movie.youtube_key && isVideoVisible ? (
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
          <div
            className="absolute w-full h-full top-1/2 left-1/2"
            style={{ transform: 'translate(-50%, -50%) scale(1.35)' }}
          >
            <ReactPlayer
              src={`https://www.youtube.com/watch?v=${movie.youtube_key}`}
              playing
              muted
              controls={false}
              loop
              width="100%"
              height="100%"
            />
          </div>
        </div>
      ) : (
        movie?.backdrop_path && (
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            className="absolute inset-0 object-cover w-full h-full"
            style={{ zIndex: 5 }}
          />
        )
      )}
      {/* グラデーションオーバーレイ */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/20 via-black/60 to-black/95" />
      {/* コンテンツ */}
      <HomeHeroMetadata movie={movie} />
    </Link>
  );
};
