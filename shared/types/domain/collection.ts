import { Movie } from "./movie";

/**
 * コレクション（シリーズ作品）のDTO定義。
 */
export type Collection = {
  id: number;
  name: string;
  parts: Movie[];
};
