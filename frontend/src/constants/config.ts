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

export const EXTERNAL_URLS = {
  YOUTUBE_WATCH: 'https://www.youtube.com/watch?v=',
  EIGA_COM: 'https://eiga.com',
  NETFLIX_SEARCH: 'https://www.netflix.com/search?q=',
  APPLE_TV_SEARCH: 'https://tv.apple.com/jp/search?term=',
  AMAZON_SEARCH: 'https://www.amazon.co.jp/s?k=',
  AMAZON_SEARCH_PARAMS: '&i=instant-video',
  HULU_SEARCH: 'https://www.hulu.jp/search?q=',
  UNEXT_SEARCH: 'https://video.unext.jp/freeword?query=',
} as const;
