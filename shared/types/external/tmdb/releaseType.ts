/**
 * TMDB API Release Types
 * https://developer.themoviedb.org/reference/discover-movie
 */
export const RELEASE_TYPE = {
  PREMIERE: 1,
  THEATRICAL_LIMITED: 2,
  THEATRICAL: 3,
  DIGITAL: 4,
  PHYSICAL: 5,
  TV: 6,
} as const;

export type ReleaseTypeValue = (typeof RELEASE_TYPE)[keyof typeof RELEASE_TYPE];