export const TMDB_CONFIG = {
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/',
  IMAGE_SIZES: {
    POSTER: {
      SMALL: 'w185',
      MEDIUM: 'w342',
      LARGE: 'w500',
      ORIGINAL: 'original',
    },
    BACKDROP: {
      SMALL: 'w300',
      MEDIUM: 'w780',
      LARGE: 'w1280',
      ORIGINAL: 'original',
    },
    LOGO: {
      SMALL: 'w45',
      MEDIUM: 'w154',
      LARGE: 'w300',
    },
    PROFILE: {
      SMALL: 'w45',
      MEDIUM: 'w185',
    },
  },
} as const;