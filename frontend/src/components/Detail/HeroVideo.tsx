import ReactPlayer from 'react-player';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface HeroVideoProps {
  youtubeKey: string | null;
  onClose: () => void;
}

const HeroVideo = ({ youtubeKey, onClose }: HeroVideoProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      <div className="relative w-3/5 h-4/5 max-h-4xl group/video">
        <button
          onClick={onClose}
          className="absolute z-10 p-0 text-white transition-transform duration-200 bg-gray-800 rounded-full opacity-0 group-hover/video:opacity-100 left-1/2 hover:scale-125"
          aria-label="閉じる"
        >
          <XMarkIcon className="w-20 h-20 opacity-0 group-hover/video:opacity-100" />
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
      </div>
    </div>
  );
};

export default HeroVideo;
