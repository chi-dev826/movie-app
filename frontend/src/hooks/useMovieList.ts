import { useQuery } from '@tanstack/react-query';
import { fetchMovieList, fetchUpcomingMovies } from '../services/movieApi';

const movieListKeys = {
  home: 'home-movie-list' as const,
  upcoming: 'upcoming-movie-list' as const,
};

export const useMovieList = () => {
  return useQuery({
    queryKey: [movieListKeys.home],
    queryFn: () => fetchMovieList(),
    staleTime: 1000 * 60 * 60, // オプション：キャッシュ時間を設定(1時間)
  });
};

export const useUpcomingMovies = () => {
  return useQuery({
    queryKey: [movieListKeys.upcoming],
    queryFn: () => fetchUpcomingMovies(),
    staleTime: 1000 * 60 * 60, // オプション：キャッシュ時間を設定(1時間)
  });
};
