import { Movie, Article } from '@/types/domain';
import { FullMovieData, MovieListResponse } from '@/types/api/movie';
import { MovieResponse } from '@/types/external/tmdb';

const API_BASE_URL = 'http://192.168.0.10:3000/api';

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
  return fetchFromApi<FullMovieData>(`/movie/${movieId}/full`);
};

export const fetchEigaComNews = async (movieId: number, movieTitle: string) => {
  return fetchFromApi<Article[]>(`/movie/${movieId}/eiga-com-news?title=${movieTitle}`);
};

export const fetchMovieAnalysis = async (movieId: number, movieTitle: string) => {
  return fetchFromApi<Article[]>(`/movie/${movieId}/movie-analysis?title=${movieTitle}`);
};

export const searchMovies = async (query: string): Promise<MovieResponse[]> => {
  return fetchFromApi<MovieResponse[]>(`/search/movie?q=${encodeURIComponent(query)}`);
};

export const fetchMovieList = async (): Promise<MovieListResponse> => {
  return fetchFromApi<MovieListResponse>('/movies/home');
};

export const fetchUpcomingMovies = async (): Promise<Movie[]> => {
  return fetchFromApi<Movie[]>('/movies/upcoming');
};
