import ReactPlayer from 'react-player';
import { motion } from 'framer-motion';
import { useState, memo } from 'react';
import { EXTERNAL_URLS } from '@/constants/config';
import { SectionContainer } from './SectionContainer';

interface TrailerSectionProps {
  videoKeys: string[];
}

/**
 * 映画の予告編一覧を表示するセクション
 * 
 * @summary 予告編のグリッド表示とインライン再生を提供します。
 * 親の再レンダリングによる意図しない再生再開を防ぐため、再生状態を詳細に管理しメモ化しています。
 * 
 * @param {TrailerSectionProps} props - コンポーネントのプロパティ
 * @returns {JSX.Element | null} 予告編セクション、または動画がない場合はnull
 */
const TrailerSection = memo(({ videoKeys }: TrailerSectionProps) => {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!videoKeys || videoKeys.length === 0) return null;

  return (
    <SectionContainer>
      <div className="mb-6">
        <div className="flex items-center ml-2">
          <span className="inline-block w-1 h-6 rounded-full bg-red-500 xl:h-7" />
          <span className="ml-2 text-base font-bold tracking-tight text-white xl:text-xl 3xl:text-2xl">
            その他の予告編
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {videoKeys.map((key) => {
          const isSelected = activeKey === key;
          
          return (
            <motion.div
              key={key}
              whileHover={!isSelected ? { scale: 1.02 } : undefined}
              className={`relative overflow-hidden transition-all duration-300 rounded-xl bg-gray-900/50 border ${
                isSelected
                  ? 'border-red-500/50 shadow-2xl shadow-red-500/10'
                  : 'border-white/5 hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/10 cursor-pointer'
              } aspect-video group`}
              // ✅ 再生中（アクティブ時）はコンテナのクリックを無効化し、Player側の操作に任せる
              {...(!isSelected && {
                onClick: () => {
                  setActiveKey(key);
                  setIsPlaying(true);
                },
              })}
            >
              {!isSelected && (
                <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-black/20 pointer-events-none">
                  <div className="flex items-center justify-center w-12 h-12 text-white bg-red-600 rounded-full shadow-lg pointer-events-auto hover:scale-110 hover:bg-red-500 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-0.5">
                      <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}

              <ReactPlayer
                src={`${EXTERNAL_URLS.YOUTUBE_WATCH}${key}`}
                width="100%"
                height="100%"
                playing={isSelected && isPlaying}
                controls={true}
                light={!isSelected}
                playIcon={<div />}
                onPlay={() => {
                  setActiveKey(key);
                  setIsPlaying(true);
                }}
                onPause={() => setIsPlaying(false)}
                onClickPreview={() => {
                  setActiveKey(key);
                  setIsPlaying(true);
                }}
              />
            </motion.div>
          );
        })}
      </div>
    </SectionContainer>
  );
});

TrailerSection.displayName = 'TrailerSection';

export default TrailerSection;
