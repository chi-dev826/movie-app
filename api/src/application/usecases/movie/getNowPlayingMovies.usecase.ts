import { ITmdbRepository } from "../../../domain/repositories/tmdb.repository.interface";
import { MovieMapper } from "../../../presentation/mappers/movie.mapper";
import { Movie as MovieDTO } from "../../../../../shared/types/domain";
import { TMDB_CONFIG } from "../../../domain/constants/tmdbConfig";

import { ArrayUtils } from "../../../utils/array";

/**
 * 現在上映中の映画リストを取得・加工するユースケース。
 */
export class GetNowPlayingMoviesUseCase {
  constructor(private readonly tmdbRepo: ITmdbRepository) {}

  /**
   * @returns 現在上映中の映画リスト
   */
  async execute(): Promise<MovieDTO[]> {
    const pagesToFetch = ArrayUtils.range(TMDB_CONFIG.FETCH_PAGES.NOW_PLAYING);

    // 1. 指定されたページ数分のデータを並行取得
    const promises = pagesToFetch.map((page) =>
      this.tmdbRepo.getNowPlayingMovies({
        page,
        language: TMDB_CONFIG.LANGUAGE,
        region: TMDB_CONFIG.REGION,
      }),
    );

    const responses = await Promise.all(promises);
    const allMovies = responses.flatMap((res) => res);

    // 2. ビジネスルールに基づくフィルタリングと重複排除
    const processedMovies = ArrayUtils.deduplicate(allMovies).filter((m) =>
      m.hasValidImages(),
    );

    // 3. マッパーでDTOへの変換
    return processedMovies.map((m) => MovieMapper.toBffDto(m));
  }
}
