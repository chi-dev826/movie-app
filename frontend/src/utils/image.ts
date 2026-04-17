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

/**
 * @summary バックドロップ画像のsrcSet文字列を生成する。ブラウザが画面幅に応じて最適サイズを自動選択する。
 * @param path TMDB画像パス
 * @returns srcSet文字列。pathがnullの場合はundefinedを返す
 */
export const getBackdropSrcSet = (path: string | null | undefined): string | undefined => {
  if (!path) return undefined;
  const { BACKDROP } = IMAGE_CONFIG.IMAGE_SIZES;
  const base = IMAGE_CONFIG.IMAGE_BASE_URL;
  return `${base}${BACKDROP.SMALL}${path} 340w, ${base}${BACKDROP.MEDIUM}${path}780w, ${base}${BACKDROP.LARGE}${path}1280w`;
};

/**
 * @summary ポスター画像のsrcSet文字列を生成する。ブラウザが画面幅に応じて最適サイズを自動選択する。
 * @param path TMDB画像パス
 * @returns srcSet文字列。pathがnullの場合はundefinedを返す
 */
export const getPosterSrcSet = (path: string | null | undefined): string | undefined => {
  if (!path) return undefined;
  const { POSTER } = IMAGE_CONFIG.IMAGE_SIZES;
  const base = IMAGE_CONFIG.IMAGE_BASE_URL;
  return `${base}${POSTER.SMALL}${path} 200w, ${base}${POSTER.MEDIUM}${path} 342w, ${base}${POSTER.LARGE}${path} 500w`;
};
