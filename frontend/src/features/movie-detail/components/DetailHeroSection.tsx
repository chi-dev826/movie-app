import React, { useEffect, useState, useMemo } from 'react';
import ReactPlayer from 'react-player';
import { AnimatePresence, motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { getBackdropSrcSet } from '@/utils/image';
import { MovieDetailBase } from '@/types/api/dto';

export interface DetailHeroSectionProps {
  detail: MovieDetailBase;
  videoKey: string | null;
}

/**
 * @summary ヒーローセクション。
 * 1. 最初の3秒間は動画コンポーネントを生成せず、フォントと画像の読み込みを最優先する。
 * 2. 3秒後に動画を生成するが、YouTubeの準備(onReady)が整うまで透明度0で隠し続ける。
 * 3. 準備が整った瞬間に、画像から動画へシームレスにフェードインする。
 */
export const DetailHeroSection: React.FC<DetailHeroSectionProps> = ({ detail, videoKey }) => {
  const [timerFinished, setTimerFinished] = useState(false); // ネットワーク解放用の3秒タイマー
  const [isReady, setIsReady] = useState(false); // YouTube側のバッファ完了フラグ
  const [videoEnded, setVideoEnded] = useState(false); // 動画再生終了フラグ

  useEffect(() => {
    // ページロード直後の「最重要リクエスト群」のために帯域を3秒間空ける
    const timeoutId = window.setTimeout(() => setTimerFinished(true), 3000);
    return () => clearTimeout(timeoutId);
  }, []);

  // 1. 3秒経過 2. YouTubeの準備完了 3. 再生が終了していない 4. 動画キーが存在する
  // これら全てを満たした時だけ「動画を見せる」
  const shouldShowVideo = useMemo(() => {
    return timerFinished && isReady && !videoEnded && !!videoKey;
  }, [timerFinished, isReady, videoEnded, videoKey]);

  const backdropSrcSet = getBackdropSrcSet(detail.backdropPath);

  return (
    <>
      <section className="relative w-full overflow-hidden aspect-video 2xl:aspect-cinema bg-surface-container-high group">
        {/* --- レイヤー1: 動画 (3秒後に生成、準備完了まで透明) --- */}
        {timerFinished && videoKey && (
          <div
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              shouldShowVideo ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/*
             * ----------------------------------------------------------------------
             * 背景としてYouTube(iframe)を再生する際、以下の3つの理由から「物理的な拡大と切り抜き」が必要不可欠。
             *
             * 1. [Box Model Control]: YouTube iframeは .mp4 と異なり object-fit: cover が効かない。
             *    w-full 指定では、ブラウザの端数ピクセル計算（0.25px等）の誤差により、左右に微細な黒い隙間が生じる。
             * 2. [UI Noise Removal]: APIで制御しきれないYouTubeのUI（タイトル、ロゴ、上下グラデーション、透かしノイズ）
             *    を、1.35倍に拡大することで物理的に画面外へ排出し、純粋な映像データのみを抽出している。
             * 3. [Cinematic Immersion]: 画像で妥協せず、あえて動画を背景に採用するこだわりを、全デバイス
             *    （特にモバイル）で等しく担保するための、最も合理的かつ堅実なハックである。
             */}
            <div
              className="absolute w-full h-full top-1/2 left-1/2"
              style={{ transform: 'translate(-50%, -50%) scale(1.2)' }}
            >
              <ReactPlayer
                src={videoKey}
                playing={!videoEnded} // 生成されたら即再生開始（裏側で準備させる）
                muted
                controls={false}
                width="100%"
                height="100%"
                onReady={() => setIsReady(true)} // YouTubeの準備完了を検知
                onEnded={() => setVideoEnded(true)} // 終了したら画像に戻す
              />
            </div>
          </div>
        )}

        {/* --- レイヤー2: 静止画 (動画の準備が整うまで居座る) --- */}
        <AnimatePresence mode="wait">
          {(!shouldShowVideo || videoEnded) && (
            <motion.div
              key="backdrop"
              className="absolute inset-0 z-backdrop"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            >
              <img
                srcSet={backdropSrcSet}
                alt={detail.title}
                fetchPriority="high" // ブラウザに「最優先リソース」と伝える
                className="object-cover w-full h-full"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- レイヤー3: UI/オーバーレイ (常に最前面) --- */}
        <div className="absolute inset-0 pointer-events-none z-gradient bg-gradient-to-t from-background via-background/20 to-transparent" />

        <div className="absolute items-center hidden gap-1 px-2 py-1 border rounded-md shadow-lg top-4 right-4 bg-surface-container-highest/80 backdrop-blur-md border-white/10 md:flex z-overlay">
          <Star className="w-3.5 h-3.5 text-primary fill-primary" />
          <span className="text-xs font-bold tracking-wider font-label">
            {detail.voteAverage ? detail.voteAverage : '-'}
          </span>
        </div>
      </section>

      {/* 🧾 メタデータ表示エリア */}
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
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                {detail.voteAverage ? detail.voteAverage : '-'}
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
        </div>
      </section>
    </>
  );
};
