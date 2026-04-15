/**
 * キャッシュの有効期限（秒単位）
 * - SHORT: リスト系データに使用（discover, now_playing, trending）
 * - UPCOMING: 公開予定リストに使用（更新頻度が低いため長め）
 * - STANDARD: 詳細・静的データに使用（details, videos, images, scraping, YouTube）
 */
export const CACHE_TTL = {
  SHORT: 3600,
  STANDARD: 86400,
  UPCOMING: 43200,
} as const;
