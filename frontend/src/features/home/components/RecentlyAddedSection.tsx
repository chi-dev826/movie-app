import { useEffect } from 'react';
import { Movie } from '@/types/api/dto';
import { PaginatedResponse } from '@/types/api/response';
import { useInfiniteMovieList } from '@/hooks/useMovies';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import SectionHeader from './SectionHeader';
import NewReleaseMovieCard from './NewReleaseMovieCard';

type Props = {
  initialData?: PaginatedResponse<Movie>;
};

export default function RecentlyAddedSection({ initialData }: Props) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteMovieList('recently_added', initialData);

  const observerRef = useInfiniteScroll(
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    { rootMargin: '0px 800px 0px 0px' }
  );

  // initialDataがある場合、マウント時に次ページをバックグラウンドでプリフェッチ
  useEffect(() => {
    if (initialData && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items = data ? data.pages.flatMap((page) => page.movies) : [];

  if (items.length === 0) return null;

  return (
    <div className="p-2 mt-6 lg:mt-12 relative">
      <SectionHeader title="新着作品" type="recently_added" />
      <div className="grid grid-rows-2 grid-flow-col gap-x-4 md:gap-x-6 gap-y-8 overflow-x-auto snap-x pt-2 pb-6 hide-scrollbar">
        {items.map((movie) => (
          <div className="w-48 sm:w-56 md:w-64 shrink-0 snap-start" key={movie.id}>
            <NewReleaseMovieCard movie={movie} />
          </div>
        ))}
        {/* 番兵 */}
        <div ref={observerRef} className="row-span-2 w-10 flex-shrink-0" />
      </div>
    </div>
  );
}
