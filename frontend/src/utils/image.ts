import { IMAGE_CONFIG } from '@/constants/config';

/**
 * 画像URLを生成する
 * @param path 画像パス (例: "/image.jpg")
 * @param size 画像サイズ (IMAGE_CONFIG.IMAGE_SIZESから選択)
 * @returns 完全なURL または null
 */
export const getTmdbImage = (path: string | null | undefined, size: string): string | null => {
  if (!path) return null;
  return `${IMAGE_CONFIG.IMAGE_BASE_URL}${size}${path}`;
};
