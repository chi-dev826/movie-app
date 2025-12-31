// TMDB APIのMovieオブジェクトの生データ型
export type MovieResponse = {
  adult: boolean;
  backdrop_path: string | null; // null許容に変更
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null; // null許容に変更
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export type Cast = {
  adult: boolean;
  gender: number | null;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
};

export type Crew = {
  adult: boolean;
  gender: number | null;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  credit_id: string;
  department: string;
  job: string;
};

export type CreditsResponse = {
  cast: Cast[];
  crew: Crew[];
};

// TMDB APIのMovie Detailオブジェクトの生データ型
export type MovieDetailResponse = {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  } | null;
  budget: number;
  credits?: CreditsResponse;
  genres: { id: number; name: string }[];
  homepage: string | null; // null許容に変更
  id: number;
  imdb_id: string | null; // null許容に変更
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
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
  runtime: number | null; // null許容に変更
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string | null; // null許容に変更
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};
