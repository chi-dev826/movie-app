import React from 'react';
import { Link } from 'react-router-dom';
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
export const DetailActionSection: React.FC<DetailActionSectionProps> = ({ movieId, videoKey, watchProviders }) => {
  const { isInWatchList, toggleWatchList } = useWatchList();

  const isInList = isInWatchList(movieId);

  return (
    <section className="px-4 pb-6 max-w-7xl mx-auto relative z-overlay">
      <div className="flex gap-3 pointer-events-auto">
        {videoKey ? (
          <Link
            to={APP_PATHS.TRAILER.replace(':id', movieId.toString())}
            className="flex-1 bg-red-500 from-primary to-primary-container text-on-primary py-5 rounded-xl font-label font-bold text-sm flex justify-center items-center gap-2 shadow-[0_4px_14px_0_rgba(255,142,130,0.39)] transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
            予告編を再生
          </Link>
        ) : watchProviders && watchProviders.length > 0 ? (
          <a
            href={watchProviders[0].link || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gradient-to-br from-primary to-primary-container text-on-primary py-5 rounded-xl font-label font-bold text-sm tracking-widest uppercase shadow-[0_4px_14px_0_rgba(255,142,130,0.39)] transition-transform active:scale-95 flex justify-center items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
            Watch Now
          </a>
        ) : (
          <button
            disabled
            className="flex-1 bg-gray-700 text-gray-400 py-5 rounded-xl font-label font-bold text-sm flex justify-center items-center gap-2 opacity-50 cursor-not-allowed"
          >
             <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
             予告編なし
          </button>
        )}

        <button 
          onClick={() => toggleWatchList(movieId)}
          className={`flex-1 ${isInList ? 'bg-surface-container-highest text-primary border border-primary/30' : 'bg-surface-container-high bg-gray-800 text-on-surface hover:bg-surface-container-highest'} py-3.5 rounded-xl font-label font-bold text-sm tracking-widest uppercase transition-colors active:scale-95 flex justify-center items-center gap-2`}
        >
          <span className="material-symbols-outlined text-[20px]">{isInList ? 'check' : 'add'}</span>
          {isInList ? 'リストから削除' : 'リストへ追加'}
        </button>
      </div>
    </section>
  );
};
