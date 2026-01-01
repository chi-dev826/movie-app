import { Movie, Article } from '@/types/domain';
import { FullMovieData, MovieListResponse } from '@/types/api/movie';
import { API_PATHS } from '@shared/constants/routes';

const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * 人気映画リスト、映画の詳細、関連映画リスト、映画のyoutubeKeyを取得する
 * @returns 映画のリスト
 * @throws 通信やAPIのエラーが発生した場合
 */
export const fetchFromApi = async <T>(endpoint: string): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  // バックエンドが認証を処理するため、ヘッダーは不要
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const fetchFullMovieData = async (movieId: number): Promise<FullMovieData> => {
  return fetchFromApi<FullMovieData>(API_PATHS.MOVIE.FULL.replace(':movieId', movieId.toString()));
};

export const fetchEigaComNews = async (movieId: number, movieTitle: string) => {
  const path = API_PATHS.MOVIE.EIGA_COM_NEWS.replace(':movieId', movieId.toString());
  return fetchFromApi<Article[]>(`${path}?title=${movieTitle}`);
};

export const fetchMovieAnalysis = async (movieId: number, movieTitle: string) => {
  const path = API_PATHS.MOVIE.ANALYSIS.replace(':movieId', movieId.toString());
  return fetchFromApi<Article[]>(`${path}?title=${movieTitle}`);
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  return fetchFromApi<Movie[]>(`${API_PATHS.SEARCH.MOVIE}?q=${encodeURIComponent(query)}`);
};

export const searchMoviesByPerson = async (name: string): Promise<Movie[]> => {
  return fetchFromApi<Movie[]>(
    `${API_PATHS.SEARCH.PERSON}?name=${encodeURIComponent(name)}`
  );
};

export const fetchMovieList = async (): Promise<MovieListResponse> => {
  return fetchFromApi<MovieListResponse>(API_PATHS.MOVIES.HOME);
};

export const fetchUpcomingMovies = async (): Promise<Movie[]> => {
  return fetchFromApi<Movie[]>(API_PATHS.MOVIES.UPCOMING);
};

export const fetchNowPlayingMovies = async (): Promise<Movie[]> => {
  return fetchFromApi<Movie[]>(API_PATHS.MOVIES.NOW_PLAYING);
};

export const fetchMovieListByIds = async (ids: number[]): Promise<Movie[]> => {
  if (!ids || ids.length === 0) {
    return [];
  }
  const idsParam = ids.join(',');
  return fetchFromApi<Movie[]>(`${API_PATHS.MOVIES.LIST}?ids=${idsParam}`);
};
