import { Movie, MovieDetail } from "../domain";

export type FullMovieData = {
  detail: MovieDetail;
  video: string | null;
  image: string | null;
  watchProviders: { logo_path: string | null; name: string }[];
  recommendations: {
    title: string;
    movies: Movie[];
  };
};

export type MovieListResponse = Record<
  "popular" | "recently_added" | "top_rated" | "high_rated",
  Movie[]
>;
