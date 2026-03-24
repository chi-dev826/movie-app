import { MovieEntity } from "../../../domain/models/movie";
import { ITmdbRepository } from "../../../domain/repositories/tmdb.repository.interface";
import { TMDB_FETCH_CONFIG } from "../../../domain/constants/tmdbFetchConfig";

import { ArrayUtils } from "../../../utils/array";

/**
 * 現在上映中の映画リストを取得・加工するユースケース。
 */
export class GetNowPlayingMoviesUseCase {
  constructor(private readonly tmdbRepo: ITmdbRepository) {}

  /**
   * @returns 現在上映中の映画リスト（ドメインエンティティ）
   */
  async execute(): Promise<MovieEntity[]> {
    const pagesToFetch = ArrayUtils.range(
      TMDB_FETCH_CONFIG.FETCH_PAGES.NOW_PLAYING,
    );

    // 1. 指定されたページ数分のデータを並行取得
    const promises = pagesToFetch.map((page) =>
      this.tmdbRepo.findNowPlayingMovies(page),
    );

    const responses = await Promise.all(promises);
    const allMovies = responses.flatMap((res) => res);

    // 2. ビジネスルールに基づくフィルタリングと重複排除
    return ArrayUtils.deduplicate(allMovies).filter(
      (m) => m.hasValidImages() && m.isMostlyJapanese(),
    );
  }
}
