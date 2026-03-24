/**
 * キャッシュの有効期限（秒単位）
 * - SHORT: リスト系データに使用（discover, now_playing）
 * - STANDARD: 詳細・静的データに使用（details, videos, images, scraping, YouTube）
 */
export const CACHE_TTL = {
  SHORT: 3600,
  STANDARD: 86400,
} as const;
