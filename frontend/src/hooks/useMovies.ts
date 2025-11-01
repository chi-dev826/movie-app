import { useQuery } from '@tanstack/react-query';
import {
  fetchFullMovieData,
  fetchMovieList,
  fetchUpcomingMovies,
  searchMovies,
} from '../services/movieApi';

const movieKeys = {
  all: ['movies'] as const,
  lists: () => [...movieKeys.all, 'list'] as const,
  list: (type: string) => [...movieKeys.lists(), type] as const,
  details: () => [...movieKeys.all, 'detail'] as const,
  detail: (id: string | undefined) => [...movieKeys.details(), id] as const,
};

export const useFullMovieData = (movieId: string | undefined) => {
  return useQuery({
    queryKey: movieKeys.detail(movieId),
    queryFn: () => fetchFullMovieData(movieId!),
    enabled: !!movieId,
    staleTime: 1000 * 60 * 10, // オプション：キャッシュ時間を設定(10分)
  });
};

export const useSearchMovies = (query: string) => {
  return useQuery({
    queryKey: movieKeys.list(query),
    queryFn: () => searchMovies(query),
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 10, // オプション：キャッシュ時間を設定(10分)
  });
};

export const useMovieList = () => {
  return useQuery({
    queryKey: movieKeys.list('home'),
    queryFn: () => fetchMovieList(),
    staleTime: 1000 * 60 * 60, // オプション：キャッシュ時間を設定(1時間)
  });
};

export const useUpcomingMovies = () => {
  return useQuery({
    queryKey: movieKeys.list('upcoming'),
    queryFn: () => fetchUpcomingMovies(),
    staleTime: 1000 * 60 * 60, // オプション：キャッシュ時間を設定(1時間)
  });
};
