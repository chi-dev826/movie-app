export type SearchMovieJson = {
  page: number;
  results: MovieJson[];
  total_pages: number;
  total_results: number;
};

//popular-movieに関する型定義
export type PopularMovieJson = {
  page: number;
  results: MovieJson[];
  total_pages: number;
  total_results: number;
};

//movie-cardに関する型定義
export type Movie = {
  id: string;
  backdrop_path: string | null;
  original_title: string;
  overview: string;
  poster_path: string | null;
};

export type MovieJson = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

//movie-detailに関する型定義
export type MovieDetail = {
  id: string;
  backdrop_path: string | null;
  original_title: string;
  overview: string;
  poster_path: string | null;
  year: number | null;
  runtime: number | null;
  score: number | null;
  genres: string[] | null;
  company_logo: string | null;
};

export type MovieDetailJson = {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: null;
  budget: number;
  genres: { id: number; name: string }[];
  homepage: string;
  id: string;
  imdb_id: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

//movie-detailのlogoパスに関する型定義
export type ImagesJson = {
  id: string;
  backdrops: {
    aspect_ratio: number;
    file_path: string;
    height: number;
    iso_639_1: string | null;
    vote_average: number;
    vote_count: number;
    width: number;
  }[];
  logos: {
    aspect_ratio: number;
    height: number;
    iso_639_1: string | null;
    file_path: string;
    vote_average: number;
    vote_count: number;
    width: number;
  }[];
  posters: {
    aspect_ratio: number;
    file_path: string;
    height: number;
    iso_639_1: string | null;
    vote_average: number;
    vote_count: number;
    width: number;
  }[];
};

// movie-detailのvideosに関する型定義
export type VideoItemJson = {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
};

export type VideosJson = {
  id: number;
  results: VideoItemJson[];
};

// movie-detailのsimilarに関する型定義
export type SimilarMoviesJson = {
  page: number;
  results: MovieJson[];
  total_pages: number;
  total_results: number;
};
