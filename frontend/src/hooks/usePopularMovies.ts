import { useQuery } from '@tanstack/react-query';
import { fetchPopularMovies } from '../services/movieApi';

const movieKeys = {
  popular: ['popular-movies'] as const,
};

export const usePopularMovies = () => {
  return useQuery({
    queryKey: movieKeys.popular,
    queryFn: fetchPopularMovies,
    staleTime: 1000 * 60 * 10, // オプション：キャッシュ時間を設定(10分)
  });
};
