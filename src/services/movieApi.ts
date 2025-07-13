import type { Movie, MovieJson, MovieDetail, MovieDetailJson, ImagesJson } from '../types';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

interface TmdbResponse<T> {
  results: T;
}

/**
 * 人気映画リスト、映画の詳細、関連映画リスト、映画のyoutubeKeyを取得する
 * @returns 映画のリスト
 * @throws 通信やAPIのエラーが発生した場合
 */
export const fetchFromApi = async <T>(endpoint: string): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const fetchPopularMovies = async (): Promise<Movie[]> => {
  const data = await fetchFromApi<TmdbResponse<MovieJson[]>>('/movie/popular?language=ja&page=1');
  return data.results.map((movie: MovieJson) => ({
    id: movie.id,
    backdrop_path: movie.backdrop_path,
    original_title: movie.original_title,
    poster_path: movie.poster_path,
    overview: movie.overview,
  }));
};

export const fetchMovieDetail = async (movieId: string): Promise<MovieDetail> => {
  const data = await fetchFromApi<MovieDetailJson>(`/movie/${movieId}?language=ja`);
  return {
    id: data.id,
    backdrop_path: data.backdrop_path,
    original_title: data.original_title,
    poster_path: data.poster_path,
    overview: data.overview,
    year: new Date(data.release_date).getFullYear(),
    rating: data.vote_average,
    runtime: data.runtime,
    score: data.vote_average * 10, // Assuming score is a percentage
    genres: data.genres.map((genre) => genre.name),
    company_logo: data.production_companies[0]?.logo_path ?? null,
  };
};

export const fetchYoutubeKey = async (movieId: string): Promise<string | null> => {
  const data = await fetchFromApi<TmdbResponse<{ key: string }[]>>(
    `/movie/${movieId}/videos?language=ja`,
  );
  return data.results[0]?.key ?? null;
};

export const fetchSimilarMovies = async (movieId: string): Promise<Movie[]> => {
  const data = await fetchFromApi<TmdbResponse<MovieJson[]>>(
    `/movie/${movieId}/similar?language=ja&page=1`,
  );
  return data.results.map((movie: MovieJson) => ({
    id: movie.id,
    backdrop_path: movie.backdrop_path,
    original_title: movie.original_title,
    poster_path: movie.poster_path,
    overview: movie.overview,
  }));
};

export const fetchTitleImagePath = async (movieId: string): Promise<string> => {
  const data = await fetchFromApi<ImagesJson>(`/movie/${movieId}/images?language=ja`);
  return data.logos[0]?.file_path ?? '';
};
