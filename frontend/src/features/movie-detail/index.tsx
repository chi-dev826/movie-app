import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import MovieCard from '@/components/MovieCard';
import HeroVideo from './components/HeroVideo';
import HeroMetadata from './components/HeroMetadata';
import { useFullMovieData } from '@/hooks/useMovies';
import MovieCardSkeleton from '@/components/MovieCardSkeleton';
import { TMDB_IMAGE_BASE_URL } from '../../../config';
import { PlayCircleIcon } from '@heroicons/react/20/solid';

function MovieDetailPage() {
  const { id: movieId } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const isModalOpen = new URLSearchParams(location.search).get('trailer') === 'open';

  const { data, isLoading, error } = useFullMovieData(movieId);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
        <p>エラーが発生しました</p>
      </div>
    );
  }

  const handleOpenModal = () => {
    navigate('?trailer=open');
  };

  const handleCloseModal = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <section className="relative flex items-center justify-center h-[40vh] sm:h-[50vh] md:h-[60vh] 2xl:h-[70vh]">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 to-black/100" />
        <img
          src={`${TMDB_IMAGE_BASE_URL}original${data?.detail.backdrop_path}`}
          alt={data?.detail.original_title}
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="relative z-30 flex flex-col cursor-pointer group/detail">
          <button onClick={handleOpenModal} className="flex flex-col items-center">
            <PlayCircleIcon className="w-12 h-12 transition-all duration-300 ease-in-out sm:w-20 sm:h-20 opacity-80 group-hover/detail:scale-110 group-hover/detail:opacity-100" />
            <p className="mt-2 text-sm text-gray-300 transition-opacity duration-300 opacity-0 group-hover/detail:text-white group-hover/detail:opacity-100">
              予告編を見る
            </p>
          </button>
          <AnimatePresence>
            {isModalOpen && (
              <HeroVideo
                key="hero-video"
                youtubeKey={data?.video ?? null}
                onClose={handleCloseModal}
              />
            )}
          </AnimatePresence>
        </div>
      </section>
      {/* メタデータ */}
      {data && (
        <div className="z-20 flex items-center justify-center w-full p-3 text-white top-10 sm:p-12 lg:absolute lg:flex lg:justify-start 2xl:p-14">
          <div className="w-full lg:w-2/5">
            <HeroMetadata
              movieDetail={data.detail}
              titleImagePath={data.image}
              watchProviders={data.watchProviders}
            />
          </div>
        </div>
      )}

      {/* === 関連作品 === */}
      <section className="z-20 px-4 mt-5 sm:px-6 lg:px-12 lg:py-2">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-white sm:text-3xl">関連作品</h2>
        <div className="flex pb-4 space-x-8 overflow-x-auto overflow-y-hidden scrollbar-hide">
          {isLoading &&
            Array.from({ length: 10 }).map((_, index) => <MovieCardSkeleton key={index} />)}
          {(data?.collections?.length ? data.collections : (data?.similar ?? [])).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default MovieDetailPage;
