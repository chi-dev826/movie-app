import Skeleton from './Skeleton';

interface Props {
  layout?: 'responsive' | 'poster';
}

const MovieCardSkeleton = ({ layout = 'responsive' }: Props) => {
  const isPosterLayout = layout === 'poster';

  return (
    <div className="flex-shrink-0">
      {isPosterLayout ? (
        <Skeleton className="w-full aspect-[2/3]" />
      ) : (
        <Skeleton className="w-36 md:w-48 lg:w-72 aspect-[2/3] lg:aspect-video" />
      )}
    </div>
  );
};

export default MovieCardSkeleton;
