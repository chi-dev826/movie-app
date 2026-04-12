import { MovieEntity } from "../../../domain/models/movie";
import { ITmdbRepository } from "../../../domain/repositories/tmdb.repository.interface";
import { TMDB_FETCH_CONFIG } from "../../../domain/constants/tmdbFetchConfig";

import { ArrayUtils } from "../../../utils/array";

/**
 * トレンド映画リストを取得・加工するユースケース。
 */
export class GetTrendingListUseCase {
  constructor(private readonly tmdbRepo: ITmdbRepository) {}

  /**
   * @param page 取得するページ番号
   * @returns トレンド映画リスト（ドメインエンティティ）とページネーション情報
   */
  async execute(page: number = 1): Promise<{
    movies: MovieEntity[];
    currentPage: number;
    totalPages: number;
  }> {
    // 1. 指定されたページのデータを取得
    const result = await this.tmdbRepo.findTrendingMovies(page);

    // 2. ビジネスルールに基づくフィルタリングと重複排除
    const filteredMovies = ArrayUtils.deduplicate(result.movies).filter(
      (m) => m.hasValidImages() && m.hasOverview() && m.isMostlyJapanese(),
    );

    return {
      movies: filteredMovies,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
    };
  }
}
