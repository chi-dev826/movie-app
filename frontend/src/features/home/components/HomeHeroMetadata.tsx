import { useState } from 'react';
import { motion } from 'framer-motion';

import { TMDB_CONFIG } from '@/constants/config';
import type { Movie } from '@/types/domain';

type Props = {
  movie: Movie;
};

export const HomeHeroMetadata = ({ movie }: Props) => {
  const [isHoveredLogo, setIsHoveredLogo] = useState(false);

  return (
    <div className="relative gap-8 px-5 z-overlay max-w-7xl">
      <div
        className="p-4 md:p-14 lg:p-32 3xl:p-36 4xl:p-48"
        onMouseEnter={() => setIsHoveredLogo(true)}
        onMouseLeave={() => setIsHoveredLogo(false)}
      >
        {/* ロゴ部分 */}
        <motion.h2
          layout // ← 高さ変化をFramer Motionが補間して吸収
          animate={
            isHoveredLogo ? { y: -10, scale: 1.03, opacity: 1 } : { y: 0, scale: 1, opacity: 1 }
          }
          transition={{ type: 'spring', stiffness: 220, damping: 24 }}
          className="inline-block mb-4"
        >
          {movie.logo_path ? (
            <img
              src={`${TMDB_CONFIG.IMAGE_BASE_URL}w1280${movie.logo_path}`}
              alt={`${movie.title} logo`}
              className="object-cover max-w-28 md:max-w-52 lg:max-w-64 2xl:max-w-72 3xl:max-w-sm 4xl:max-w-xl drop-shadow-lg"
            />
          ) : (
            <span className="text-lg font-bold md:text-2xl lg:text-4xl 2xl:text-6xl 4xl:text-8xl drop-shadow-lg">
              {movie.title}
            </span>
          )}
        </motion.h2>

        {/* 概要部分（アンマウントせず高さと不透明度をアニメーションしてレイアウトのジャンプを防ぐ） */}
        <motion.div
          // 初期レンダリングでジャンプしないよう初期アニメーションは無効
          initial={false}
          animate={
            isHoveredLogo
              ? { height: 'auto', opacity: 1, marginTop: 12 }
              : { height: 0, opacity: 0, marginTop: 0 }
          }
          transition={{
            height: { duration: 0.36, ease: [0.2, 0.1, 0.2, 1] },
            opacity: { duration: 0.22 },
            marginTop: { duration: 0.28 },
          }}
          style={{ overflow: 'hidden' }}
          className="max-w-[80%] 4xl:max-w-full leading-relaxed text-gray-200 drop-shadow-md"
        >
          {/* 内側に余白を持たせて高さ0時に内容が切れるようにする */}
          <div className="text-xs line-clamp-6 md:text-sm lg:text-md 2xl:text-lg 4xl:text-xl">
            {movie.overview}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomeHeroMetadata;
