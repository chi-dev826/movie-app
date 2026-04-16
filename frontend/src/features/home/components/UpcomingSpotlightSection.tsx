import SpotlightSection from './SpotlightSection';
import SpotlightCard from './SpotlightCard';
import UpcomingMovieCard from './UpcomingMovieCard';
import { useUpcomingSpotlightMovies } from '@/hooks/useMovies';
import { PaginatedResponse } from '@/types/api/response';
import { UpcomingMovie } from '@/types/api/dto';

type Props = {
  title: string;
  subtitle?: string;
  initialData?: PaginatedResponse<UpcomingMovie>;
};

const UpcomingSpotlightSection = ({ title, subtitle, initialData }: Props) => {
  const { data } = useUpcomingSpotlightMovies(initialData);
  const items = data ?? [];

  return (
    <SpotlightSection<UpcomingMovie>
      title={title}
      subtitle={subtitle}
      type="upcoming"
      items={items}
      renderSpotlightItem={(movie) => <SpotlightCard movie={movie} variant="upcoming" />}
      renderRemainingItem={(movie) => (
        <UpcomingMovieCard movie={movie} className="basis-[32%] xl:basis-[22%] 2xl:basis-[12%]" />
      )}
    />
  );
};

export default UpcomingSpotlightSection;
