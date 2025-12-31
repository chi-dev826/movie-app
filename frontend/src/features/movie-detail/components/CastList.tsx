import { TMDB_CONFIG } from '@/constants/config';
import { Cast } from '@/types/domain';
import HorizontalScrollContainer from '@/components/HorizontalScrollContainer';
import { UserCircleIcon } from '@heroicons/react/24/solid';

type Props = {
  cast: Cast[];
};

const CastList = ({ cast }: Props) => {
  if (!cast || cast.length === 0) {
    return null;
  }

  return (
    <section className="mt-10 xl:mx-12 3xl:mx-20">
      <h2 className="mb-4 ml-2 text-base font-bold tracking-tight text-white xl:text-xl 3xl:text-2xl">
        キャスト
      </h2>
      <HorizontalScrollContainer>
        {cast.map((actor) => (
          <div key={actor.id} className="flex-shrink-0 w-32 xl:w-40 group">
            <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-gray-800">
              {actor.profile_path ? (
                <img
                  src={`${TMDB_CONFIG.IMAGE_BASE_URL}w185${actor.profile_path}`}
                  alt={actor.name}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-500">
                  <UserCircleIcon className="w-16 h-16" />
                </div>
              )}
            </div>
            <div className="mt-2 text-center">
              <p className="text-sm font-bold text-white truncate">{actor.name}</p>
              <p className="text-xs text-gray-400 truncate">{actor.character}</p>
            </div>
          </div>
        ))}
      </HorizontalScrollContainer>
    </section>
  );
};

export default CastList;
