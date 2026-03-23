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
import { TmdbGenreId } from '@shared/types/external/tmdb';

export const GENRE_MAP: { id: TmdbGenreId; name: string }[] = [
  { id: 28,    name: "アクション" },
  { id: 12,    name: "アドベンチャー" },
  { id: 16,    name: "アニメーション" },
  { id: 35,    name: "コメディ" },
  { id: 80,    name: "犯罪" },
  { id: 99,    name: "ドキュメンタリー" },
  { id: 18,    name: "ドラマ" },
  { id: 10751, name: "ファミリー" },
  { id: 14,    name: "ファンタジー" },
  { id: 36,    name: "履歴" },
  { id: 27,    name: "ホラー" },
  { id: 10402, name: "音楽" },
  { id: 9648,  name: "謎" },
  { id: 10749, name: "ロマンス" },
  { id: 878,   name: "サイエンスフィクション" },
  { id: 10770, name: "テレビ映画" },
  { id: 53,    name: "スリラー" },
  { id: 10752, name: "戦争" },
  { id: 37,    name: "西洋" },
] as const;
