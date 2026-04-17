import SpotlightSection from './SpotlightSection';
import SpotlightCard from './SpotlightCard';
import NowPlayingCard from './NowPlayingCard';
import { useInfiniteMovieList } from '@/hooks/useMovies';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { PaginatedResponse } from '@/types/api/response';
import { Movie } from '@/types/api/dto';

type Props = {
  title: string;
  subtitle?: string;
  initialData?: PaginatedResponse<Movie>;
};

const NowPlayingSpotlightSection = ({ title, subtitle, initialData }: Props) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteMovieList(
    'now_playing',
    initialData,
  );

  const observerRef = useInfiniteScroll(hasNextPage, isFetchingNextPage, fetchNextPage, {
    rootMargin: '0px 800px 0px 0px',
  });

  const items = data ? data.pages.flatMap((page) => page.movies) : [];

  return (
    <SpotlightSection<Movie>
      title={title}
      subtitle={subtitle}
      type="now_playing"
      items={items}
      observerRef={observerRef}
      renderSpotlightItem={(movie) => <SpotlightCard movie={movie} variant="now_playing" />}
      renderRemainingItem={(movie) => (
        <NowPlayingCard movie={movie} className="basis-[32%] xl:basis-[22%] 2xl:basis-[12%]" />
      )}
    />
  );
};

export default NowPlayingSpotlightSection;
