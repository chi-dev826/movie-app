import type { Movie, MovieJson } from '../types';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

interface TmdbResponse {
  results: MovieJson[];
}

/**
 * 人気映画のリストを取得する
 * @returns 映画のリスト
 * @throws 通信やAPIのエラーが発生した場合
 */
export const fetchPopularMovies = async (): Promise<Movie[]> => {
  const url = `${API_BASE_URL}/movie/popular?language=ja&page=1`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const data: TmdbResponse = await response.json();

  const movieList = data.results.map((movie) => ({
    id: movie.id,
    backdrop_path: movie.backdrop_path,
    original_title: movie.title,
    poster_path: movie.poster_path,
    overview: movie.overview,
  }));
  return movieList;
};
