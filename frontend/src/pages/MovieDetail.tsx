import { useParams } from 'react-router-dom';
import { useState } from 'react';

import MovieCard from '../components/MovieCard';
import HeroVideo from '../components/Detail/HeroVideo';
import HeroMetadata from '../components/Detail/HeroMetadata';
import { useFullMovieData } from '../hooks/useMovies';
import { TMDB_IMAGE_BASE_URL } from '../../config';
import { PlayCircleIcon } from '@heroicons/react/20/solid';

function MovieDetailPage() {
  const { id: movieId } = useParams<{ id: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading, error } = useFullMovieData(movieId);
  const backdropUrl = `${TMDB_IMAGE_BASE_URL}original${data?.detail?.backdrop_path}`;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
        <p>エラーが発生しました</p>
      </div>
    );
  }

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <section className="relative flex items-center justify-center h-[70vh] sm:h-[80vh]">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 to-black/90" />
        <img src={backdropUrl} alt="" className="absolute inset-0 object-cover w-full h-full" />
        <div className="relative z-30 flex flex-col items-center cursor-pointer group/detail">
          <button onClick={handleOpenModal}>
            <PlayCircleIcon className="w-20 h-20 transition-opacity duration-300 ease-in-out opacity-80 group-hover/detail:scale-110 group-hover/detail:opacity-100" />
            <p className="mt-2 text-sm text-gray-300 transition-opacity duration-300 opacity-0 group-hover/detail:text-white group-hover/detail:opacity-100">
              予告編を見る
            </p>
          </button>
          {isModalOpen && <HeroVideo youtubeKey={data?.video ?? null} onClose={handleCloseModal} />}
        </div>

        {/* メタデータ */}
        {data && (
          <div className="absolute z-20 w-full p-6 text-white top-10 sm:p-12 md:p-16">
            <div className="w-full md:w-3/5 lg:w-2/5">
              <HeroMetadata
                movieDetail={data.detail}
                titleImagePath={data.image}
                watchProviders={data.watchProviders}
                homePageUrl={data.detail.homePageUrl}
              />
            </div>
          </div>
        )}
      </section>

      {/* === 関連作品 === */}
      {data?.similar && data.similar.length > 0 && (
        <section className="z-20 mx-auto mt-auto max-w-20xl sm:px-6 lg:px-8">
          <h2 className="mb-6 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            関連作品
          </h2>
          <div className="flex pb-4 space-x-4 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            {data.similar.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default MovieDetailPage;
