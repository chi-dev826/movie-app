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
  WatchProvider[] | string
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
export const countryCodes = [
  "AE",
  "AL",
  "AR",
  "AT",
  "AU",
  "BA",
  "BB",
  "BE",
  "BG",
  "BH",
  "BO",
  "BR",
  "BS",
  "CA",
  "CH",
  "CL",
  "CO",
  "CR",
  "CV",
  "CZ",
  "DE",
  "DK",
  "DO",
  "EC",
  "EE",
  "EG",
  "ES",
  "FI",
  "FJ",
  "FR",
  "GB",
  "GF",
  "GI",
  "GR",
  "GT",
  "HK",
  "HN",
  "HR",
  "HU",
  "ID",
  "IE",
  "IL",
  "IN",
  "IQ",
  "IS",
  "IT",
  "JM",
  "JO",
  "JP",
  "KR",
  "KW",
  "LB",
  "LI",
  "LT",
  "LV",
  "MD",
  "MK",
  "MT",
  "MU",
  "MX",
  "MY",
  "MZ",
  "NL",
  "NO",
  "NZ",
  "OM",
  "PA",
  "PE",
  "PH",
  "PK",
  "PL",
  "PS",
  "PT",
  "PY",
  "QA",
  "RO",
  "RS",
  "RU",
  "SA",
  "SE",
  "SG",
  "SI",
  "SK",
  "SM",
  "SV",
  "TH",
  "TR",
  "TT",
  "TW",
  "UG",
  "US",
  "UY",
  "VE",
  "YE",
  "ZA",
] as const;

export type CountryCode = (typeof countryCodes)[number];

export type CollectionResponse = {
  id: number;
  name: string;
  original_language: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  parts: MovieResponse;
};
