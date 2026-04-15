import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { useFullMovieData } from '@/hooks/useMovies';

/**
 * TrailerPage
 * @summary 予告編を全画面で再生するための独立したページコンポーネント。
 * ヘッダー等の干渉を受けず、純粋なプレイヤー体験を提供する。
 */
const TrailerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useFullMovieData(Number(id));

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* 閉じるボタン (フローティング) */}
      <button
        onClick={handleClose}
        className="hidden lg:block lg:absolute top-6 right-6 z-[110] p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all active:scale-90 group"
        aria-label="閉じる"
      >
        <XMarkIcon className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
      </button>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-white/60 font-bold tracking-widest text-sm uppercase">
              Loading Preview...
            </p>
          </motion.div>
        ) : error || !data?.videoUrl ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6 px-8 text-center"
          >
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/50">
              <ExclamationTriangleIcon className="w-10 h-10 text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {error ? 'エラーが発生しました' : '予告編が見つかりません'}
              </h2>
              <p className="text-white/60 text-sm">
                申し訳ありません。この作品の予告編は現在視聴できません。
                <br />
                自動的に前の画面に戻ります。
              </p>
            </div>
            <button
              onClick={handleClose}
              className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
            >
              今すぐ戻る
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="player"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative w-full h-full"
          >
            <ReactPlayer
              src={data.videoUrl!}
              playing={true}
              controls={true}
              width="100%"
              height="100%"
              onEnded={handleClose}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 背景の装飾的なグラデーション */}
      {!isLoading && data?.videoUrl && (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-black/20 z-[105]" />
      )}
    </div>
  );
};

export default TrailerPage;
