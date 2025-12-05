export const API_PATHS = {
  MOVIE: {
    FULL: "/movie/:movieId/full",
    EIGA_COM_NEWS: "/movie/:movieId/eiga-com-news",
    ANALYSIS: "/movie/:movieId/movie-analysis",
  },
  SEARCH: {
    MOVIE: "/search/movie",
  },
  MOVIES: {
    HOME: "/movies/home",
    UPCOMING: "/movies/upcoming",
    NOW_PLAYING: "/movies/now-playing",
    LIST: "/movies/list",
  }
} as const;
