/**
 * TMDB API で使用される主要な国コードの定義
 * 参考: https://developer.themoviedb.org/reference/configuration-countries
 */

export const TMDB_COUNTRY_CODES = {
  JP: "JP",
  US: "US",
  GB: "GB",
  KR: "KR",
  FR: "FR",
  DE: "DE",
  ES: "ES",
  IT: "IT",
  CA: "CA",
  AU: "AU",
} as const;

/**
 * TMDB API で使用される国コードの型
 */
export type TmdbCountryCode =
  (typeof TMDB_COUNTRY_CODES)[keyof typeof TMDB_COUNTRY_CODES];
