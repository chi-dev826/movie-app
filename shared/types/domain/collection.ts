import { Movie } from "./movie";

/**
 * コレクション（シリーズ作品）のDTO定義。
 */
export type Collection = {
  readonly id: number;
  readonly name: string;
  readonly parts: Movie[];
};
