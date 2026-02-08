import { CollectionEntity } from "../models/collection";
import { MovieFactory } from "./movie.factory";
import { CollectionResponse } from "../../../../shared/types/external/tmdb";

/**
 * 外部APIレスポンスからCollectionEntityを生成するためのファクトリクラス。
 */
export class CollectionFactory {
  /**
   * TMDBのCollectionResponseからCollectionEntityを生成する。
   */
  public static createFromApiResponse(
    data: CollectionResponse,
  ): CollectionEntity {
    const parts = data.parts.map((part) =>
      MovieFactory.createFromApiResponse(part),
    );

    return new CollectionEntity(data.id, data.name, parts);
  }
}
