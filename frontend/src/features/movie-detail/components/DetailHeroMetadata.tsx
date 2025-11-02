import { TMDB_IMAGE_BASE_URL } from '../../../../config';
import { MovieDetail } from '@/types/app';
import { WindowIcon } from '@heroicons/react/20/solid';
import { PlayCircleIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import { motion } from 'framer-motion';
import HeroVideo from './HeroVideo';

type Props = {
  movieDetail: MovieDetail;
  watchProviders: { logo_path: string | null; name: string }[];
  youtubeKey?: string | null;
};

const HeroMetadata = ({ movieDetail, watchProviders, youtubeKey }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const providers = {
    'Disney Plus': (title: string) =>
      `https://www.disneyplus.com/search/${encodeURIComponent(title)}`,
    Netflix: (title: string) => `https://www.netflix.com/search?q=${encodeURIComponent(title)}`,
    'Apple TV': (title: string) =>
      `https://tv.apple.com/jp/search?term=${encodeURIComponent(title)}`,
    'Amazon Prime Video': (title: string) =>
      `https://www.amazon.co.jp/s/ref=nb_sb_noss_1?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&url=search-alias%3Dinstant-video&field-keywords=${encodeURIComponent(title)}`,
    Hulu: (title: string) => `https://www.hulu.jp/search?q=${encodeURIComponent(title)}`,
    'U-NEXT': (title: string) =>
      `https://video.unext.jp/freeword?query=${encodeURIComponent(title)}`,
  };

  const providerList = watchProviders.map((provider) => {
    const logo_path = `${TMDB_IMAGE_BASE_URL}w185${provider.logo_path}`;
    const link = providers[provider.name as keyof typeof providers]
      ? providers[provider.name as keyof typeof providers](movieDetail.title)
      : null;
    return { logo_path, link };
  });

  return (
    <motion.div
      key={movieDetail.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="justify-center text-center xl:text-left"
    >
      <div className="max-w-full xl:flex xl:w-2/5 xl:flex-col xl:mt-5">
        <h1 className="mb-5 font-sans text-xl font-extrabold md:text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-6xl">
          {movieDetail?.title}
        </h1>

        {watchProviders.length > 0 && (
          <div className="p-4 flex-column xl:justify-start">
            <p className="font-mono text-sm text-gray-400">配信中のサービス</p>
            <div className="flex items-center justify-center flex-shrink-0 mt-4 -mx-2 xl:overflow-x-auto scrollbar-hide scroll-smooth xl:justify-start">
              {providerList?.map((provider, index) => (
                <div key={index} className="p-2">
                  <motion.a
                    href={provider.link ?? ''}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <img
                      src={provider.logo_path ?? ''}
                      alt={`Watch Provider ${index + 1}`}
                      className="object-contain w-12 h-12 rounded-full xl:w-16 xl:h-16"
                    />
                  </motion.a>
                </div>
              ))}
            </div>
          </div>
        )}
        <p className="text-sm font-extrabold text-white lg:text-base xl:text-sm 3xl:text-base 4xl:text-lg line-clamp-6 group-hover:line-clamp-none">
          {movieDetail.overview}
        </p>
        <span className="flex flex-col gap-1 my-5 font-mono text-sm font-bold text-gray-300 xl:flex-row xl:space-x-2">
          <span>
            {movieDetail?.year} {movieDetail?.runtime}分
          </span>
          <span>{movieDetail.genres ? movieDetail.genres.join('・') : ''}</span>
        </span>
      </div>
      <div className="flex justify-center gap-5 transition-all xl:justify-start">
        {movieDetail.homePageUrl && (
          <a
            href={movieDetail.homePageUrl}
            className="flex flex-col items-center gap-3 text-sm font-bold text-white duration-300 ease-in-out hover:scale-110 hover:text-blue-500"
          >
            <WindowIcon className="w-8 h-8" />
            公式サイト
          </a>
        )}
        {youtubeKey && (
          <button
            onClick={handleOpenModal}
            className="flex flex-col items-center gap-3 text-sm font-bold text-white duration-300 ease-in-out hover:scale-110 hover:text-blue-500"
          >
            <PlayCircleIcon className="w-8 h-8" />
            予告編を見る
          </button>
        )}
      </div>
      {isModalOpen && youtubeKey !== undefined && (
        <HeroVideo youtubeKey={youtubeKey} onClose={handleCloseModal} />
      )}
    </motion.div>
  );
};
export default HeroMetadata;
