import { useQuery } from '@tanstack/react-query';
import {
  fetchFullMovieData,
  fetchMovieList,
  fetchUpcomingMovies,
  fetchNowPlayingMovies,
  searchMovies,
  fetchMovieListByIds,
} from '@/services/movieApi';
import { MovieListResponse } from '@/types/api';
import { Movie } from '@/types/domain';

const movieKeys = {
  all: ['movies'] as const,
  lists: () => [...movieKeys.all, 'list'] as const,
  list: (type: string) => [...movieKeys.lists(), type] as const,
  details: () => [...movieKeys.all, 'detail'] as const,
  detail: (id: number) => [...movieKeys.details(), id] as const,
  search: (query: string) => [...movieKeys.all, 'search', query] as const,
  ids: (ids: number[]) => [...movieKeys.all, 'ids', ids.join(',')] as const,
};

export const useFullMovieData = (movieId: number) => {
  return useQuery({
    queryKey: movieKeys.detail(movieId),
    queryFn: () => fetchFullMovieData(movieId),
    enabled: !!movieId,
    staleTime: 1000 * 60 * 60, // オプション：キャッシュ時間を設定(1時間)
  });
};

export const useSearchMovies = (query: string) => {
  return useQuery({
    queryKey: movieKeys.search(query),
    queryFn: () => searchMovies(query),
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 60, // オプション：キャッシュ時間を設定(1時間)
  });
};

export const useMoviesByIds = (ids: number[]) => {
  return useQuery({
    queryKey: movieKeys.ids(ids),
    queryFn: () => fetchMovieListByIds(ids),
    enabled: ids.length > 0,
    staleTime: 1000 * 60 * 60, // オプション：キャッシュ時間を設定(1時間)
  });
};

export const useMovieList = () => {
  return useQuery<MovieListResponse>({
    queryKey: movieKeys.list('movies'),
    queryFn: fetchMovieList,
    staleTime: 1000 * 60 * 60, // オプション：キャッシュ時間を設定(1時間)
  });
};

export const useNowPlayingMovies = () => {
  return useQuery<Movie[]>({
    queryKey: movieKeys.list('now_playing'),
    queryFn: fetchNowPlayingMovies,
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
