import { TMDB_CONFIG, EXTERNAL_URLS } from '@/constants/config';
import { MovieDetail } from '@/types/domain';
import { useWatchList } from '@/hooks/useWatchList';
import { WindowIcon, PlayCircleIcon, PlusIcon } from '@heroicons/react/20/solid';
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
  const { isInWatchList, toggleWatchList } = useWatchList();

  const isInList = isInWatchList(movieDetail.id);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const providers = {
    'Disney Plus': () => null, // Disney Plus link disabled as it does not work reliably
    Netflix: (title: string) => `${EXTERNAL_URLS.NETFLIX_SEARCH}${encodeURIComponent(title)}`,
    'Apple TV': (title: string) => `${EXTERNAL_URLS.APPLE_TV_SEARCH}${encodeURIComponent(title)}`,
    'Amazon Prime Video': (title: string) =>
      `${EXTERNAL_URLS.AMAZON_SEARCH}${encodeURIComponent(title)}${EXTERNAL_URLS.AMAZON_SEARCH_PARAMS}`,
    Hulu: (title: string) => `${EXTERNAL_URLS.HULU_SEARCH}${encodeURIComponent(title)}`,
    'U-NEXT': (title: string) => `${EXTERNAL_URLS.UNEXT_SEARCH}${encodeURIComponent(title)}`,
  };

  const providerList = watchProviders.map((provider) => {
    const logo_path = `${TMDB_CONFIG.IMAGE_BASE_URL}w185${provider.logo_path}`;
    const link = providers[provider.name as keyof typeof providers]
      ? providers[provider.name as keyof typeof providers](movieDetail.title)
      : null;
    return { logo_path, link };
  });

  return (
    <div className="w-full text-center xl:text-left">
      <div className="xl:flex xl:max-w-[40%] xl:flex-col xl:mt-5">
        <h1 className="mb-5 text-xl font-extrabold md:text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-6xl">
          {movieDetail?.title}
        </h1>

        {watchProviders.length > 0 && (
          <div className="p-4 xl:justify-start">
            <p className="text-sm text-gray-400">配信中のサービス</p>
            <div className="flex items-center justify-center flex-shrink-0 mt-4 -mx-2 xl:overflow-x-auto scrollbar-hide scroll-smooth xl:justify-start">
              {providerList?.map((provider, index) => (
                <div key={index} className="p-2 group">
                  <motion.a
                    href={provider.link !== null ? provider.link : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                    whileHover={provider.link ? { scale: 1.1 } : undefined}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <img
                      src={provider.logo_path ?? ''}
                      alt={`Watch Provider ${index + 1}`}
                      className="object-contain w-12 h-12 rounded-full xl:w-16 xl:h-16"
                    />
                    <p
                      className={
                        provider.link
                          ? 'mt-2 text-xs text-white opacity-0 group-hover:opacity-100'
                          : 'mt-2 text-xs text-white opacity-0'
                      }
                    >
                      配信サイトへ
                    </p>
                  </motion.a>
                </div>
              ))}
            </div>
          </div>
        )}
        <p className="text-sm font-extrabold text-white lg:text-base xl:text-sm 3xl:text-base 4xl:text-lg line-clamp-6 group-hover:line-clamp-none">
          {movieDetail.overview}
        </p>
        <span className="flex justify-center gap-1 my-5 text-sm font-bold text-gray-300 xl:justify-start xl:space-x-2">
          <span className="flex gap-3">
            <span>{movieDetail?.year}</span> <span>{movieDetail?.runtime}分</span>
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
        <button
          onClick={() => toggleWatchList(movieDetail.id)}
          className={
            `flex flex-col items-center gap-3 text-sm font-bold ` +
            (isInList
              ? `text-gray-500 duration-300 ease-in-out hover:scale-110 hover:text-gray-300`
              : `text-white duration-300 ease-in-out hover:scale-110 hover:text-blue-500`)
          }
        >
          <PlusIcon className="w-8 h-8" />
          {isInList ? 'リストから削除' : 'リストへ追加'}
        </button>
      </div>
      {isModalOpen && youtubeKey !== undefined && (
        <HeroVideo youtubeKey={youtubeKey} onClose={handleCloseModal} />
      )}
    </div>
  );
};
export default HeroMetadata;
