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
   * @returns トレンド映画リスト（ドメインエンティティ）
   */
  async execute(): Promise<MovieEntity[]> {
    const pagesToFetch = ArrayUtils.range(
      TMDB_FETCH_CONFIG.FETCH_PAGES.TRENDING,
    );

    // 1. 指定されたページ数分のデータを並行取得
    const promises = pagesToFetch.map((page) =>
      this.tmdbRepo.findTrendingMovies(page),
    );

    const responses = await Promise.all(promises);
    const allMovies = responses.flatMap((res) => res);

    // 2. ビジネスルールに基づくフィルタリングと重複排除
    return ArrayUtils.deduplicate(allMovies).filter(
      (m) => m.hasValidImages() && m.hasOverview() && m.isMostlyJapanese(),
    );
  }
}
