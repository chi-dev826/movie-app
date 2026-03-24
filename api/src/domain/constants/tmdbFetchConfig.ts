export const TMDB_FETCH_CONFIG = {
  REGION: "JP",
  LANGUAGE: "ja",
  FETCH_PAGES: {
    HOME: 10,
    UPCOMING: 10,
    NOW_PLAYING: 3,
    TRENDING: 5,
  },
  FILTERS: {
    MIN_VOTE_COUNT: 10,
    HOME: {
      RECENT_VOTE_COUNT: 1000,
    },
  },
  DATE: {
    UPCOMING_MONTHS: 2,
  },
} as const;
