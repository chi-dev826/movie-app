import { MovieEntity } from "./movie";
import { Collection as CollectionDTO } from "../../../../shared/types/domain";

/**
 * コレクション（シリーズ作品）を表すドメインモデル。
 */
export class CollectionEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly parts: MovieEntity[],
  ) {
    // ランタイムでの不変性を確保
    Object.freeze(this);
    Object.freeze(this.parts);
  }

  /**
   * 指定した映画IDを除外した新しいコレクションを返す。
   */
  public filterOutMovie(movieId: number): CollectionEntity {
    return new CollectionEntity(
      this.id,
      this.name,
      this.parts.filter((p) => p.id !== movieId),
    );
  }

  /**
   * プレゼンテーション層向けのDTOに変換する。
   */
  public toDto(): CollectionDTO {
    return {
      id: this.id,
      name: this.name,
      parts: this.parts.map((movie) => movie.toDto()),
    };
  }
}
