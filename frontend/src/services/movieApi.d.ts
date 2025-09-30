import type { Movie, MovieDetail } from '../types';
/**
 * 人気映画リスト、映画の詳細、関連映画リスト、映画のyoutubeKeyを取得する
 * @returns 映画のリスト
 * @throws 通信やAPIのエラーが発生した場合
 */
export declare const fetchFromApi: <T>(endpoint: string) => Promise<T>;
export declare const fetchPopularMovies: () => Promise<Movie[]>;
export declare const fetchMovieDetail: (movieId: string) => Promise<MovieDetail>;
export declare const fetchYoutubeKey: (movieId: string) => Promise<string | null>;
export declare const fetchSimilarMovies: (movieId: string) => Promise<Movie[]>;
export declare const fetchTitleImagePath: (movieId: string) => Promise<string>;
