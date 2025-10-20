import ReactPlayer from 'react-player';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useCallback, useEffect } from 'react';

interface HeroVideoProps {
  youtubeKey: string | null;
  onClose: () => void;
}

const HeroVideo = ({ youtubeKey, onClose }: HeroVideoProps) => {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [handleEscape]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full h-full lg:w-4/5 lg:h-4/5 lg:max-h-4xl group/video"
      >
        <button
          onClick={onClose}
          className="hidden -translate-x-1/2 lg:block lg:absolute lg:z-10 lg:text-white lg:transition-transform lg:duration-200 lg:bg-gray-800 lg:rounded-full lg:opacity-0 group-hover/video:opacity-100 left-1/2 hover:scale-125"
          aria-label="閉じる"
        >
          <XMarkIcon className="md:w-12 md:h-12 lg:w-16 lg:h-16 2xl:w-20 2xl:h-20" />
        </button>
        {youtubeKey ? (
          <ReactPlayer
            src={`https://www.youtube.com/watch?v=${youtubeKey}`}
            playing={true}
            controls={true}
            muted={true}
            width="100%"
            height="100%"
            onEnded={onClose}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <p className="text-white">予告編が利用できません</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default HeroVideo;
