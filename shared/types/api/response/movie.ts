import { Movie, MovieDetail } from "../dto";

export type PaginatedResponse<T> = {
  movies: T[];
  currentPage: number;
  totalPages: number;
};

export type FullMovieData = {
  detail: MovieDetail;
  videoUrl: string | null;
  otherVideoUrls: string[];
  image: string | null;
  watchProviders: { logoPath: string | null; name: string }[];
  recommendations: {
    title: string;
    movies: Movie[];
  };
};

export type MovieListResponse = Record<
  "recently_added", 
  PaginatedResponse<Movie>
>;
