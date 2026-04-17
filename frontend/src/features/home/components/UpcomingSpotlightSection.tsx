import SpotlightSection from './SpotlightSection';
import SpotlightCard from './SpotlightCard';
import UpcomingMovieCard from './UpcomingMovieCard';
import { useUpcomingMovies } from '@/hooks/useMovies';
import { UpcomingMovie } from '@/types/api/dto';

type Props = {
  title: string;
  subtitle?: string;
};

const UpcomingSpotlightSection = ({ title, subtitle }: Props) => {
  const { data } = useUpcomingMovies();
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
