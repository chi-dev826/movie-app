import { Movie, MovieDetail } from "../domain";

export type FullMovieData = {
  detail: MovieDetail;
  video: string | null;
  image: string | null;
  watchProviders: { logo_path: string | null; name: string }[];
  similar: Movie[];
  collections: Movie[];
};

export type MovieListResponse = Record<
  "popular" | "now_playing" | "top_rated" | "high_rated",
  Movie[]
>;
