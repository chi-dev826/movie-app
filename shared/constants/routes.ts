export const APP_PATHS = {
  HOME: "/",
  SEARCH: "/search",
  WATCH_LIST: "/watch-list",
  MOVIE_DETAIL: "/movie/:id",
  TRAILER: "/trailer/:id",
  MOVIES: {
    UPCOMING: "/movies/upcoming",
    BY_TYPE: "/movies/:type",
  },
} as const;

export const API_PATHS = {
  HOME: "/home",
  MOVIE: {
    DETAIL_BASEINFO: "/movie/:movieId/detail-baseinfo",
    DETAIL_RESOURCES: "/movie/:movieId/detail-resources",
    RECOMMENDATIONS: "/movie/:movieId/recommendations",
    EIGA_COM_NEWS: "/movie/:movieId/eiga-com-news",
    ANALYSIS: "/movie/:movieId/analysis",
  },
  SEARCH: {
    MOVIE: "/search/movie",
    PERSON: "/movies/search-by-person",
  },
  MOVIES: {
    HOME: "/movies/home",
    UPCOMING: "/movies/upcoming",
    NOW_PLAYING: "/movies/now-playing",
    TRENDING: "/movies/trending",
    LIST: "/movies/list",
  }
} as const;
