import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { AnimatePresence, motion } from 'framer-motion';
import { getBackdropSrcSet } from '@/utils/image';
import { MovieDetail } from '@/types/api/dto';

export interface DetailHeroSectionProps {
  detail: MovieDetail;
  videoKey: string | null;
}

/**
 * @summary 映画詳細画面のヒーロー領域コンポーネント。バックドロップ画像のフェードアウト、動画自動再生、および基本メタデータ（タイトル等）を表示する。
 * @param {DetailHeroSectionProps} props - 表示に必要な映画の詳細情報と動画キー
 * @returns {React.ReactElement}
 */
export const DetailHeroSection: React.FC<DetailHeroSectionProps> = ({ detail, videoKey }) => {
  const [isBackdropVisible, setIsBackdropVisible] = useState(true);

  useEffect(() => {
    if (!isBackdropVisible || !videoKey) return;
    const timeoutId = window.setTimeout(() => {
      setIsBackdropVisible(false);
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [isBackdropVisible, videoKey]);

  const backdropSrcSet = getBackdropSrcSet(detail.backdropPath);

  return (
    <>
      {/* 🎬 Hero & Video Autoplay Section */}
      <section className="relative w-full overflow-hidden aspect-video 2xl:aspect-cinema bg-surface-container-high group">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-gradient bg-gradient-to-t from-background via-background/20 to-transparent" />

        <AnimatePresence>
          {isBackdropVisible && detail.backdropPath && videoKey && (
            <motion.div
              key={detail.backdropPath || videoKey}
              className="absolute inset-0 z-backdrop"
              initial={{ opacity: 0, transition: { duration: 1, ease: 'easeInOut' } }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            >
              <img
                srcSet={backdropSrcSet}
                alt={detail.title}
                className="object-cover w-full h-full"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {videoKey ? (
          <div className="absolute w-full h-full overflow-hidden pointer-events-none">
            <div
              className="absolute w-full h-full top-1/2 left-1/2"
              /*
               * 🎨 Implementation Note: Scale & Crop Strategy for Cinematic Background
               * ----------------------------------------------------------------------
               * 背景としてYouTube(iframe)を再生する際、以下の3つの理由から「物理的な拡大と切り抜き」が必要不可欠。
               *
               * 1. [Box Model Control]: YouTube iframeは .mp4 と異なり object-fit: cover が効かない。
               *    w-full 指定では、ブラウザの端数ピクセル計算（0.25px等）の誤差により、左右に微細な黒い隙間が生じる。
               * 2. [UI Noise Removal]: APIで制御しきれないYouTubeのUI（タイトル、ロゴ、上下グラデーション、透かしノイズ）
               *    を、1.35倍に拡大することで物理的に画面外へ排出し、純粋な映像データのみを抽出している。
               * 3. [Cinematic Immersion]: 画像で妥協せず、あえて動画を背景に採用するこだわりを、全デバイス
               *    （特にモバイル）で等しく担保するための、最も合理的かつ堅実なハックである。
               */
              style={{ transform: 'translate(-50%, -50%) scale(1.2)' }}
            >
              <ReactPlayer
                src={videoKey}
                playing
                muted
                onReady={() => setIsBackdropVisible(true)}
                controls={false}
                loop
                width="100%"
                height="100%"
              />
            </div>
          </div>
        ) : (
          <img
            srcSet={backdropSrcSet}
            alt={detail.title}
            className="absolute inset-0 object-cover w-full h-full"
          />
        )}

        <div className="absolute items-center hidden gap-1 px-2 py-1 border rounded-md shadow-lg top-4 right-4 bg-surface-container-highest/80 backdrop-blur-md border-white/10 md:flex z-overlay">
          <span
            className="material-symbols-outlined text-[14px] text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
          <span className="text-xs font-bold tracking-wider font-label">
            {detail.voteAverage ? detail.voteAverage.toFixed(1) : '-'}
          </span>
        </div>
      </section>

      {/* 🧾 Title & Immediate Actions */}
      <section className="relative px-4 pt-4 pb-6 mx-auto pointer-events-none max-w-7xl z-overlay">
        <div className="flex items-end justify-between mb-4 pointer-events-auto">
          <div>
            <h1 className="text-4xl font-black leading-tight tracking-tighter font-headline md:text-5xl text-on-surface drop-shadow-lg">
              {detail.title}
            </h1>
            <div className="flex flex-wrap items-center mt-3 text-sm font-bold tracking-wide gap-x-5 gap-y-2 md:text-base text-on-surface-variant">
              <span>{detail.year || '-'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
              <span>{detail.runtime ? `${detail.runtime}分` : '-'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
              <span className="flex items-center gap-1 font-bold text-yellow-400">
                <span
                  className="material-symbols-outlined text-[16px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                {detail.voteAverage ? detail.voteAverage.toFixed(1) : '-'}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {detail.genres?.map((genre, idx) => (
                <span
                  key={idx}
                  className="bg-surface-container-high text-on-surface-variant px-2.5 py-1 rounded-full text-xs font-bold tracking-wider"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
          <div className="flex-col items-center justify-center hidden p-3 border shadow-xl md:flex bg-surface-container-high rounded-xl border-white/5">
            <div className="flex items-center gap-1 text-primary">
              <span
                className="material-symbols-outlined text-[24px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span className="text-2xl font-black font-headline">
                {detail.voteAverage ? detail.voteAverage.toFixed(1) : '-'}
              </span>
            </div>
            <span className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest mt-1">
              TMDB
            </span>
          </div>
        </div>
      </section>
    </>
  );
};
