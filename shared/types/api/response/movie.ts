import { Movie } from "../dto";

export type PaginatedResponse<T> = {
  movies: T[];
  currentPage: number;
  totalPages: number;
};

export type RecommendationsResponse = {
    title: string;
    movies: Movie[];
};

export type ResourcesResponse = {
  watchProviders: { logoPath: string | null; name: string }[];
  videoInfo: { video: string | null; otherVideos: string[] };
};

export type MovieListResponse = Record<
  "recently_added", 
  PaginatedResponse<Movie>
>;
