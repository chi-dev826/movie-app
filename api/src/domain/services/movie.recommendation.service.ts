import { MovieEntity } from "../models/movie";
import { CollectionEntity } from "../models/collection";

export class MovieRecommendationService {
  /**
   * 指定された映画に対する最適な「おすすめリスト」を決定する
   * ポリシー: Collection(シリーズ) > Similar(類似)
   */
  getRecommendations(
    movieId: number,
    collection: CollectionEntity | null,
    recommendedMovies: readonly MovieEntity[],
  ): { title: string; movies: readonly MovieEntity[] } {
    // 1. シリーズ作品の確認
    if (collection) {
      const parts = collection.parts.filter((p) => p.id !== movieId);
      if (parts.length > 0) {
        return {
          title: `シリーズ作品: ${collection.name}`,
          movies: parts,
        };
      }
    }

    // 2. 類似作品にフォールバック
    return {
      title: "関連作品",
      movies: recommendedMovies,
    };
  }
}
