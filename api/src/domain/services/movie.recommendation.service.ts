import { MovieEntity } from "../models/movie";
import { ITmdbRepository } from "../repositories/tmdb.repository.interface";
import { MovieFilterOutService } from "./movie.filterOut.service";

export class MovieRecommendationService {
  constructor(
    private readonly tmdbRepo: ITmdbRepository,
    private readonly movieFilterService: MovieFilterOutService,
  ) {}

  /**
   * 指定された映画に対する最適な「おすすめリスト」を決定して取得する
   * ポリシー: Collection(シリーズ) > Similar(類似)
   */
  async getRecommendations(
    movieId: number,
    collectionId: number | null,
  ): Promise<{ title: string; movies: readonly MovieEntity[] }> {
    // 1. シリーズ作品の確認
    if (collectionId) {
      try {
        const collection = await this.tmdbRepo.getCollection(collectionId);
        // 現在表示中の映画を除外し、残りを取得
        const parts = this.movieFilterService.filter(collection.parts, movieId);

        if (parts.length > 0) {
          return {
            title: `シリーズ作品: ${collection.name}`,
            movies: parts,
          };
        }
      } catch (error) {
        console.error(
          `コレクション情報の取得に失敗しました (movieId: ${movieId}):`,
          error,
        );
        // エラー時は類似映画へフォールバックするため何もしない
      }
    }

    // 2. 類似作品の取得（シリーズがない、または取得失敗、またはフィルタ後の残りが0件の場合）
    const similar = await this.tmdbRepo.getSimilarMovies(movieId);
    return {
      title: "関連作品",
      movies: similar,
    };
  }
}
