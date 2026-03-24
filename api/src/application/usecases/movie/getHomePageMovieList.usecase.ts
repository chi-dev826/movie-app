import { MovieEntity } from "../../../domain/models/movie";
import { ITmdbRepository } from "../../../domain/repositories/tmdb.repository.interface";
import { TMDB_FETCH_CONFIG } from "../../../domain/constants/tmdbFetchConfig";

import { ArrayUtils } from "../../../utils/array";

/**
 * ホーム画面に表示する各種カテゴリの映画リストを一括取得・加工するユースケース。
 */
export class GetHomePageMovieListUseCase {
  constructor(private readonly tmdbRepo: ITmdbRepository) {}

  /**
   * @returns 最近追加された映画リスト（ドメインエンティティ）
   */
  async execute(): Promise<MovieEntity[]> {
    const pagesToFetch = ArrayUtils.range(TMDB_FETCH_CONFIG.FETCH_PAGES.HOME);

    // 1. 全ページを並行で取得
    const pagePromises = pagesToFetch.map((page) =>
      this.tmdbRepo.findRecentlyAddedMovies(page),
    );
    const results: MovieEntity[][] = await Promise.all(pagePromises);

    // 2. ビジネスルールに基づくフィルタリングと重複排除
    const flatList: MovieEntity[] = results.flat();
    return ArrayUtils.deduplicate(flatList).filter((m) => m.hasValidImages());
  }
}
