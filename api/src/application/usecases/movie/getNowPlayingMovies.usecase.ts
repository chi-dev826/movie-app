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
   * @param page 取得するページ番号
   * @returns 現在上映中の映画リストとページネーション情報
   */
  async execute(page: number = 1): Promise<{
    movies: MovieEntity[];
    currentPage: number;
    totalPages: number;
  }> {
    // 1. 指定されたページのデータを取得
    const result = await this.tmdbRepo.findNowPlayingMovies(page);

    // 2. ビジネスルールに基づくフィルタリングと重複排除
    const filteredMovies = ArrayUtils.deduplicate(result.movies).filter(
      (m) => m.hasValidImages() && m.isMostlyJapanese(),
    );

    return {
      movies: filteredMovies,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
    };
  }
}
