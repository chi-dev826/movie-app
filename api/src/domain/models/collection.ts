import { MovieEntity } from "./movie";

/**
 * コレクション（シリーズ作品）を表すドメインモデル。
 */
export class CollectionEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly parts: readonly MovieEntity[],
  ) {
    // ランタイムでの不変性を確保
    Object.freeze(this);
    Object.freeze(this.parts);
  }
}
