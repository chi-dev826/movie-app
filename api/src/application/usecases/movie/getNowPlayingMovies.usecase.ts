import { ITmdbRepository } from "../../../domain/repositories/tmdb.repository.interface";
import { MovieFilterOutService } from "../../../domain/services/movie.filterOut.service";
import { Movie as MovieDTO } from "../../../../../shared/types/domain";
import { TMDB_CONFIG } from "../../../domain/constants/tmdbConfig";

import { ArrayUtils } from "../../../utils/array";

/**
 * 現在上映中の映画リストを取得・加工するユースケース。
 * * @description
 * TMDBから複数ページ分の「現在上映中」映画を取得し、画像必須フィルタと
 * 重複排除を適用して返却する。
 */
export class GetNowPlayingMoviesUseCase {
  constructor(
    private readonly tmdbRepo: ITmdbRepository,
    private readonly movieFilterService: MovieFilterOutService,
  ) {}

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

    // 2. ビジネスルールに基づくフィルタリング（画像必須）と重複排除
    const filteredMovies =
      this.movieFilterService.filterMovieWithoutImages(allMovies);

    const uniqueMovies = this.movieFilterService.deduplicate(filteredMovies);

    // 3. ドメインモデルからDTOへの変換
    return uniqueMovies.map((m) => m.toDto());
  }
}
