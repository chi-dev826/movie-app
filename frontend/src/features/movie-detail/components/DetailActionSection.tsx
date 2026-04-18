import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Check, Plus } from 'lucide-react';
import { useWatchList } from '@/hooks/useWatchList';
import { APP_PATHS } from '@shared/constants/routes';

export interface WatchProvider {
  link?: string | null;
  logoPath: string | null;
  name: string;
}

export interface DetailActionSectionProps {
  movieId: number;
  videoKey: string | null;
  watchProviders?: WatchProvider[];
}

/**
 * @summary 詳細画面のアクション領域コンポーネント。「予告編を再生」「リストへ追加」のボタンを配置し、ロジックをカプセル化する。
 * @param {DetailActionSectionProps} props - 映画ID、動画キー、VOD情報
 * @returns {React.ReactElement}
 */
export const DetailActionSection: React.FC<DetailActionSectionProps> = ({
  movieId,
  videoKey,
  watchProviders,
}) => {
  const { isInWatchList, toggleWatchList } = useWatchList();

  const isInList = isInWatchList(movieId);

  return (
    <section className="relative w-full px-4 pb-6 mx-auto xl:max-w-7xl z-overlay">
      <div className="flex gap-3 pointer-events-auto">
        {videoKey ? (
          <motion.div
            layoutId="trailer-player"
            className="flex-1"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <Link
              to={APP_PATHS.TRAILER.replace(':id', movieId.toString())}
              className="w-full h-full bg-red-500 from-primary to-primary-container text-on-primary py-5 rounded-xl font-label font-bold text-sm flex justify-center items-center gap-2 shadow-[0_4px_14px_0_rgba(255,142,130,0.39)] transition-transform active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              予告編を再生
            </Link>
          </motion.div>
        ) : watchProviders && watchProviders.length > 0 ? (
          <a
            href={watchProviders[0].link || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gradient-to-br from-primary to-primary-container text-on-primary py-5 rounded-xl font-label font-bold text-sm tracking-widest uppercase shadow-[0_4px_14px_0_rgba(255,142,130,0.39)] transition-transform active:scale-95 flex justify-center items-center gap-2"
          >
            <Play className="w-5 h-5 fill-current" />
            Watch Now
          </a>
        ) : (
          <button
            disabled
            className="flex items-center justify-center flex-1 gap-2 py-5 text-sm font-bold text-gray-400 bg-gray-700 opacity-50 cursor-not-allowed rounded-xl font-label"
          >
            <Play className="w-5 h-5" />
            予告編なし
          </button>
        )}

        <button
          onClick={() => toggleWatchList(movieId)}
          className={`flex-1 ${isInList ? 'bg-surface-container-highest text-primary border border-primary/30' : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'} py-3.5 rounded-xl font-label font-bold text-sm tracking-widest uppercase transition-colors active:scale-95 flex justify-center items-center gap-2`}
        >
          {isInList ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {isInList ? 'リストから削除' : 'リストへ追加'}
        </button>
      </div>
    </section>
  );
};
