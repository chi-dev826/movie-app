import { Movie, MovieJson, MovieDetail, VideoItemJson } from '@/types/movie';

const API_BASE_URL = 'http://localhost:3000/api';

interface TmdbResponse<T> {
  results: T;
}

export interface FullMovieData {
  details: MovieDetail;
  videos: VideoItemJson;
  similar: MovieJson[];
  images: string | null;
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

export const fetchPopularMovies = async (): Promise<Movie[]> => {
  const data = await fetchFromApi<TmdbResponse<MovieJson[]>>('/movie/popular?language=ja&page=1');
  return data.results.map((movie: MovieJson) => ({
    id: movie.id,
    backdrop_path: movie.backdrop_path || null,
    original_title: movie.original_title,
    poster_path: movie.poster_path || null,
    overview: movie.overview,
  }));
};

export const fetchFullMovieData = async (movieId: string): Promise<FullMovieData> => {
  return fetchFromApi<FullMovieData>(`/movie/${movieId}/full`);
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  const data = await fetchFromApi<TmdbResponse<MovieJson[]>>(
    `/search/movie?query=${encodeURIComponent(query)}&language=ja&page=1&include_adult=false`,
  );
  return data.results.map((movie: MovieJson) => ({
    id: movie.id,
    backdrop_path: movie.backdrop_path || null,
    original_title: movie.original_title,
    poster_path: movie.poster_path || null,
    overview: movie.overview,
  }));
};
