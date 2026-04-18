import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

interface TrailerCarouselSectionProps {
  otherVideoUrls?: string[];
}

/**
 * 各動画カードの可視性を管理し、ビューポートに近づくまでiframeのマウントを遅延させるラッパー。
 */
const LazyTrailerCard: React.FC<{
  url: string;
  activeUrl: string | null;
  onSelect: (url: string) => void;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
}> = ({ url, activeUrl, onSelect, isPlaying, onPlay, onPause }) => {
  const [isVisible, setIsVisible] = useState(false);
  const isSelected = activeUrl === url;
  const videoKey = url.split('v=')[1];

  return (
    <motion.div
      key={url}
      whileHover={!isSelected ? { scale: 1.02 } : undefined}
      className={`relative flex-shrink-0 w-[320px] h-[180px] rounded-xl overflow-hidden bg-surface-container-high border transition-colors group ${
        isSelected
          ? 'border-red-500/50 shadow-lg shadow-red-500/20'
          : 'border-white/10 hover:border-primary/50'
      }`}
    >
      {!isSelected ? (
        <div
          className="relative w-full h-full cursor-pointer"
          onClick={() => {
            onSelect(url);
            setIsVisible(true);
          }}
        >
          <img
            src={`https://img.youtube.com/vi/${videoKey}/hqdefault.jpg`}
            alt="Trailer Thumbnail"
            fetchPriority="high"
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
              <Play className="w-6 h-6 text-white fill-white" />
            </div>
          </div>
        </div>
      ) : isVisible ? (
        <div className="absolute inset-0 w-full h-full overflow-hidden rounded-xl cursor-pointer">
          <ReactPlayer
            src={url}
            width="100%"
            height="100%"
            playing={isPlaying}
            controls={true}
            onPlay={onPlay}
            onPause={onPause}
          />
        </div>
      ) : null}
    </motion.div>
  );
};

/**
 * @summary その他の予告編や関連動画リストを水平スクロールで表示し、インライン再生を行うコンポーネント。
 * @param {TrailerCarouselSectionProps} props - YouTubeの動画キーリスト
 * @returns {React.ReactElement | null} 動画が存在しない場合はnullを返す
 */
export const TrailerCarouselSection: React.FC<TrailerCarouselSectionProps> = ({
  otherVideoUrls,
}) => {
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!otherVideoUrls || otherVideoUrls.length === 0) return null;

  return (
    <section className="py-6 border-t border-white/5">
      <div className="px-4 max-w-7xl mx-auto mb-4">
        <h3 className="font-headline text-2xl md:text-3xl font-bold tracking-tight text-on-surface flex items-center gap-3">
          <span className="inline-block w-1 h-6 rounded-full bg-red-500 xl:h-7" />
          Trailers & Extras
        </h3>
      </div>
      <div className="flex flex-col overflow-x-auto hide-scrollbar gap-4 px-4 pb-4 max-w-7xl mx-auto md:flex-row">
        {otherVideoUrls.map((url) => (
          <LazyTrailerCard
            key={url}
            url={url}
            activeUrl={activeUrl}
            onSelect={(u) => {
              setActiveUrl(u);
              setIsPlaying(true);
            }}
            isPlaying={isPlaying && activeUrl === url}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        ))}
      </div>
    </section>
  );
};
