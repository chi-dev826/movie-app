export const IMAGE_CONFIG = {
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

export const GENRE_NAMES: Record<number, string> = {
  28: "アクション",
  12: "アドベンチャー",
  16: "アニメーション",
  35: "コメディ",
  80: "犯罪",
  99: "ドキュメンタリー",
  18: "ドラマ",
  10751: "ファミリー",
  14: "ファンタジー",
  36: "歴史",
  27: "ホラー",
  10402: "音楽",
  9648: "ミステリー",
  10749: "ロマンス",
  878: "SF",
  10770: "テレビ映画",
  53: "スリラー",
  10752: "戦争",
  37: "西部劇",
} as const;

/** React Query のキャッシュ設定 */
export const QUERY_CONFIG = {
  /** デフォルトのキャッシュ生存時間: 1時間 */
  STALE_TIME_DEFAULT: 1000 * 60 * 60,
} as const;
