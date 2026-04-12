import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchFullMovieData,
  fetchMovieList,
  fetchUpcomingMovies,
  fetchNowPlayingMovies,
  fetchTrendingMovies,
  searchMovies,
  searchMoviesByPerson,
  fetchMovieWatchList,
  fetchHomePage,
} from '@/services/movieApi';
import { MovieListResponse, HomePageResponse, PaginatedResponse } from '@/types/api/response';
import { Movie, UpcomingMovie } from '@/types/api/dto';
import { QUERY_CONFIG } from '@/constants/config';

const movieKeys = {
  all: ['movies'] as const,
  home: () => [...movieKeys.all, 'home'] as const,
  lists: () => [...movieKeys.all, 'list'] as const,
  list: (type: string) => [...movieKeys.lists(), type] as const,
  infiniteList: (type: string) => [...movieKeys.lists(), 'infinite', type] as const,
  details: () => [...movieKeys.all, 'detail'] as const,
  detail: (id: number) => [...movieKeys.details(), id] as const,
  search: (query: string) => [...movieKeys.all, 'search', query] as const,
  searchByPerson: (name: string) => [...movieKeys.all, 'searchByPerson', name] as const,
  ids: (ids: number[]) => [...movieKeys.all, 'ids', ids.join(',')] as const,
};

export const useFullMovieData = (movieId: number) => {
  return useQuery({
    queryKey: movieKeys.detail(movieId),
    queryFn: () => fetchFullMovieData(movieId),
    enabled: !!movieId,
    staleTime: QUERY_CONFIG.STALE_TIME_DEFAULT, // オプション：キャッシュ時間を設定(1時間)
  });
};

export const useSearchMovies = (query: string) => {
  return useQuery({
    queryKey: movieKeys.search(query),
    queryFn: () => searchMovies(query),
    enabled: query.length > 0,
    staleTime: QUERY_CONFIG.STALE_TIME_DEFAULT, // オプション：キャッシュ時間を設定(1時間)
  });
};

export const useSearchMoviesByPerson = (name: string) => {
  return useQuery({
    queryKey: movieKeys.searchByPerson(name),
    queryFn: () => searchMoviesByPerson(name),
    enabled: name.length > 0,
    staleTime: QUERY_CONFIG.STALE_TIME_DEFAULT, // オプション：キャッシュ時間を設定(1時間)
  });
};

export const useMoviesByIds = (ids: number[]) => {
  return useQuery({
    queryKey: movieKeys.ids(ids),
    queryFn: () => fetchMovieWatchList(ids),
    enabled: ids.length > 0,
    staleTime: QUERY_CONFIG.STALE_TIME_DEFAULT, // オプション：キャッシュ時間を設定(1時間)
  });
};

export const useMovieList = () => {
  return useQuery<MovieListResponse>({
    queryKey: movieKeys.list('movies'),
    queryFn: () => fetchMovieList(),
    staleTime: QUERY_CONFIG.STALE_TIME_DEFAULT, // オプション：キャッシュ時間を設定(1時間)
  });
};

export const useNowPlayingMovies = () => {
  return useQuery<Movie[]>({
    queryKey: movieKeys.list('now_playing'),
    queryFn: async () => {
      const res = await fetchNowPlayingMovies();
      return res.movies;
    },
    staleTime: QUERY_CONFIG.STALE_TIME_DEFAULT, // オプション：キャッシュ時間を設定(1時間)
  });
};

export const useUpcomingMovies = () => {
  return useQuery<UpcomingMovie[]>({
    queryKey: movieKeys.list('upcoming'),
    queryFn: async () => {
      const res = await fetchUpcomingMovies();
      return res.movies;
    },
    staleTime: QUERY_CONFIG.STALE_TIME_DEFAULT, // オプション：キャッシュ時間を設定(1時間)
  });
};

export const useTrendingMovies = () => {
  return useInfiniteQuery({
    queryKey: movieKeys.list('trending'),
    queryFn: ({ pageParam = 1 }) => fetchTrendingMovies(pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined;
    },
    initialPageParam: 1,
    staleTime: QUERY_CONFIG.STALE_TIME_DEFAULT,
  });
};

/**
 * 【汎用ファサード】リストのカテゴリ(type)を受け取り、無限スクロール用に正規化されたページネーションデータを返す
 * @param type カテゴリ名 ('upcoming', 'now_playing', etc.)
 * @param initialData 初期レンダリング用のページネーションデータ（キャッシュのHydration用）
 */
export const useInfiniteMovieList = (
  type: string | undefined,
  initialData?: PaginatedResponse<Movie | UpcomingMovie>
) => {
  return useInfiniteQuery({
    queryKey: movieKeys.infiniteList(type || 'unknown'),
    queryFn: async ({ pageParam = 1 }) => {
      if (type === 'trending') return fetchTrendingMovies(pageParam);
      if (type === 'now_playing') return fetchNowPlayingMovies(pageParam);
      if (type === 'upcoming') return fetchUpcomingMovies(pageParam);
      if (type === 'recently_added') {
        const res = await fetchMovieList(pageParam);
        return res.recently_added;
      }
      return { movies: [], currentPage: 1, totalPages: 1 };
    },
    getNextPageParam: (lastPage) => {
      return lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined;
    },
    initialPageParam: 1,
    initialData: initialData
      ? {
          pages: [initialData],
          pageParams: [1],
        }
      : undefined,
    staleTime: QUERY_CONFIG.STALE_TIME_DEFAULT,
    enabled: !!type,
  });
};

export const useHomePage = () => {
  return useQuery<HomePageResponse>({
    queryKey: movieKeys.home(),
    queryFn: fetchHomePage,
    staleTime: QUERY_CONFIG.STALE_TIME_DEFAULT, // ホーム画面全体のキャッシュ時間（1時間）
  });
};

/**
 * @summary 映画詳細データのプリフェッチを発火する関数を返すフック。
 * @returns movieIdを受け取り、QueryClientのキャッシュに詳細データを先行取得する関数
 * @example
 * const prefetch = usePrefetchMovieDetail();
 * <Link onMouseDown={() => prefetch(movieId)} ... />
 */
export const usePrefetchMovieDetail = () => {
  const queryClient = useQueryClient();

  return (movieId: number) => {
    queryClient.prefetchQuery({
      queryKey: movieKeys.detail(movieId),
      queryFn: () => fetchFullMovieData(movieId),
      staleTime: QUERY_CONFIG.STALE_TIME_DEFAULT,
    });
  };
};
