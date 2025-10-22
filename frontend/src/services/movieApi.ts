import { MovieJson, MovieDetail } from '@/types/movie';
import { CollectionPart } from '@/types/collection';

const API_BASE_URL = 'http://192.168.0.10:3000/api';

export interface FullMovieData {
  detail: MovieDetail;
  video: string | null;
  similar: MovieJson[];
  image: string | null;
  watchProviders: string[];
  collections: CollectionPart[] | null;
}
export interface MovieListResponse {
  popular: MovieJson[];
  now_playing: MovieJson[];
  top_rated: MovieJson[];
  high_rated: MovieJson[];
}

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

export const fetchFullMovieData = async (movieId: string): Promise<FullMovieData> => {
  return fetchFromApi<FullMovieData>(`/movie/${movieId}/full`);
};

export const searchMovies = async (query: string): Promise<MovieJson[]> => {
  return fetchFromApi<MovieJson[]>(
    `/search/movie?query=${encodeURIComponent(query)}&language=ja&page=1&include_adult=false`,
  );
};

export const fetchMovieList = async (): Promise<MovieListResponse> => {
  return fetchFromApi<MovieListResponse>('/movies/home');
};
