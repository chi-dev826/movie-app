import { useQuery } from '@tanstack/react-query';
import { fetchFullMovieData, searchMovies } from '../../src/services/movieApi';

const fullMovieDataKeys = {
  detail: 'full-movie-data' as const,
};

const searchMoviesKeys = {
  search: 'search-movie' as const,
};

export const useFullMovieData = (movieId: string | undefined) => {
  return useQuery({
    queryKey: [fullMovieDataKeys.detail, movieId],
    queryFn: () => fetchFullMovieData(movieId!),
    enabled: !!movieId,
    staleTime: 1000 * 60 * 10, // オプション：キャッシュ時間を設定(10分)
  });
};

export const useSearchMovies = (query: string) => {
  return useQuery({
    queryKey: [searchMoviesKeys.search, query],
    queryFn: () => searchMovies(query),
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 10, // オプション：キャッシュ時間を設定(10分)
  });
};
