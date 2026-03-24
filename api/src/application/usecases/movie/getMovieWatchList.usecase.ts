import { ITmdbRepository } from "../../../domain/repositories/tmdb.repository.interface";
import { MovieDetailEntity } from "../../../domain/models/movieDetail";

/**
 * 複数映画IDのウォッチリストデータを一括取得するドメイン関心事のオーケストレーション。
 */
export class GetMovieWatchListUseCase {
  constructor(private readonly tmdbRepo: ITmdbRepository) {}

  /**
   * @param movieIds - 取得対象の映画ID配列
   * @returns 映画の詳細データと画像のペアの配列
   */
  async execute(
    movieIds: number[],
  ): Promise<{ detailEntity: MovieDetailEntity; image: string | null }[]> {
    if (!movieIds || movieIds.length === 0) {
      return [];
    }

    // 1. 各映画IDに対して並行してデータを取得
    const results = await Promise.all(
      movieIds.map(async (id) => {
        try {
          const [detailEntity, image] = await Promise.all([
            this.tmdbRepo.getMovieDetails(id),
            this.tmdbRepo.getMovieImages(id),
          ]);
          return { detailEntity, image };
        } catch (error) {
          console.error(`映画ID ${id} の取得に失敗しました:`, error);
          return null;
        }
      }),
    );

    // 2. 有効なデータのみを抽出して返却
    return results.filter(
      (
        item,
      ): item is { detailEntity: MovieDetailEntity; image: string | null } =>
        item !== null,
    );
  }
}
