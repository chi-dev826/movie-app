import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper';
import { EffectCoverflow, Autoplay, Pagination, Navigation } from 'swiper/modules';
import { AnimatePresence, motion } from 'framer-motion';
import ReactPlayer from 'react-player';

import type { Movie } from '@/types/domain';
import { useHoverVisibility } from '../hooks/useHoverVisibility';
import HomeHeroMetadata from './HomeHeroMetadata';
import { getTmdbImage } from '@/utils/imageUtils';
import { TMDB_CONFIG, EXTERNAL_URLS } from '@/constants/config';

import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import 'swiper/css';

type Props = {
  movies: Movie[];
  onSwiperReady?: () => void;
};

const HeroSwiper = ({ movies, onSwiperReady }: Props) => {
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
      onInit={onSwiperReady}
      onSwiper={(swiper) => (swiperRef.current = swiper)}
      className="w-full hero-swiper aspect-video lg:aspect-cinema 3xl:aspect-ultra-wide 4xl:aspect-super-wide"
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
        {isBackdropVisible && movie.video && (
          <div className="absolute inset-0 z-backdrop">
            <motion.img
              key={movie.id}
              initial={{ opacity: 0, transition: { duration: 1, ease: 'easeInOut' } }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                scale: 1.1,
                transition: { duration: 1.5, ease: 'easeInOut' },
              }}
              transition={{ duration: 1 }}
              src={
                getTmdbImage(movie.backdrop_path, TMDB_CONFIG.IMAGE_SIZES.BACKDROP.ORIGINAL) ?? ''
              }
              alt={movie.title}
              className="absolute inset-0 object-cover w-full h-full z-backdrop"
            />
          </div>
        )}
      </AnimatePresence>

      {/* 動画プレイヤー */}
      {movie.video && isVideoVisible ? (
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
          <div
            className="absolute w-full h-full top-1/2 left-1/2"
            style={{ transform: 'translate(-50%, -50%) scale(1.35)' }}
          >
            <ReactPlayer
              src={`${EXTERNAL_URLS.YOUTUBE_WATCH}${movie.video}`}
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
        <AnimatePresence>
          {movie?.backdrop_path && (
            <motion.img
              src={
                getTmdbImage(movie.backdrop_path, TMDB_CONFIG.IMAGE_SIZES.BACKDROP.ORIGINAL) ?? ''
              }
              alt={movie.title}
              className="absolute inset-0 object-cover w-full h-full z-backdrop"
              initial={{ opacity: 0, transition: { duration: 1, ease: 'easeInOut' } }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                scale: 1.1,
                transition: { duration: 1.5, ease: 'easeInOut' },
              }}
              transition={{ duration: 1 }}
            />
          )}
        </AnimatePresence>
      )}
      {/* グラデーションオーバーレイ */}
      <div className="absolute inset-0 z-gradient bg-gradient-to-b from-black/20 via-black/60 to-black/95" />
      {/* コンテンツ */}
      <HomeHeroMetadata movie={movie} />
    </Link>
  );
};
