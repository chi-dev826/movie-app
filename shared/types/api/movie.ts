import { Movie, MovieDetail } from "../domain";

export type FullMovieData = {
  detail: MovieDetail;
  video: string | null;
  otherVideos: string[];
  image: string | null;
  watchProviders: { logo_path: string | null; name: string }[];
  recommendations: {
    title: string;
    movies: Movie[];
  };
};

export type MovieListResponse = Record<
  "recently_added",
  Movie[]
>;
