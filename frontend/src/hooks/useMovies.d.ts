import type { Movie, MovieDetail } from '../types';
export declare const useMovies: () => {
  movieDetail: MovieDetail | null;
  youtubeKey: string | null;
  similarMovies: Movie[];
  titleImagePath: string;
  isLoading: boolean;
  error: string | null;
};
