export const TMDB_CONFIG = {
  REGION: "JP",
  LANGUAGE: "ja",
  FETCH_PAGES: {
    HOME: 10,
    UPCOMING: 10,
    NOW_PLAYING: 3,
  },
  FILTERS: {
    MIN_VOTE_COUNT: 10,
    HOME: {
      POPULAR_VOTE_COUNT: 10000,
      RECENT_VOTE_COUNT: 1000,
      TOP_RATED_VOTE_COUNT: 1000,
      HIGH_RATED_VOTE_COUNT: 5000,
    },
  },
  DATE: {
    UPCOMING_MONTHS: 2,
  },
} as const;
