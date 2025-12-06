import { TMDB_CONFIG } from '@/constants/config';

/**
 * TMDBの画像URLを生成する
 * @param path 画像パス (例: "/image.jpg")
 * @param size 画像サイズ (TMDB_CONFIG.IMAGE_SIZESから選択)
 * @returns 完全なURL または null
 */
export const getTmdbImage = (path: string | null | undefined, size: string): string | null => {
  if (!path) return null;
  return `${TMDB_CONFIG.IMAGE_BASE_URL}${size}${path}`;
};
