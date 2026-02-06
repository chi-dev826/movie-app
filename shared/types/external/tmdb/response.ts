import { TMDB_COUNTRY_CODES, TmdbCountryCode } from "../../../constants/tmdb";
import { MovieResponse } from "./movie";

// 共通
export type PaginatedResponse<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

export type DefaultResponse<T> = {
  id: number;
  results: T[];
};

// Now Playing
export type NowPlayingMovieResponse = {
  dates: {
    maximum: string;
    minimum: string;
  };
} & PaginatedResponse<MovieResponse>;

// Images
export type ImageDetails = {
  aspect_ratio: number;
  file_path: string;
  height: number;
  iso_639_1: string | null;
  vote_average: number;
  vote_count: number;
  width: number;
};

export type ImageResponse = Record<
  "backdrops" | "posters" | "logos",
  ImageDetails[]
> & {
  id: number;
};

// Videos
export type VideoItem = {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
};

// Watch Providers
export type WatchProvider = {
  display_priority: number;
  logo_path: string;
  provider_id: number;
  provider_name: string;
};

export type RegionalWatchProviders = Record<
  "link" | "flatrate" | "rent" | "buy",
  WatchProvider[]
> & {
  link: string;
};

export type WatchProvidersByCountry = {
  [countryCode: string]: RegionalWatchProviders;
};

export type MovieWatchProvidersResponse = {
  id: number;
  results: WatchProvidersByCountry;
};

// Country
export const countryCodes = TMDB_COUNTRY_CODES;

export type CountryCode = TmdbCountryCode;

export type CollectionResponse = {
  id: number;
  name: string;
  original_language: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  parts: MovieResponse[];
};

export type PersonResponse = {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  known_for: MovieResponse[];
};