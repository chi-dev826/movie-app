import { MovieEntity } from "../../../domain/models/movie";
import { ITmdbRepository } from "../../../domain/repositories/tmdb.repository.interface";
import { MovieEnrichService } from "../../services/movie.enrich.service";
import { UpcomingMovieService } from "../../../domain/services/upcomingMovie.service";
import { TMDB_FETCH_CONFIG } from "../../../domain/constants/tmdbFetchConfig";
import { ArrayUtils } from "../../../utils/array";

/**
 * 日本で近日公開予定の映画リストを取得・加工するユースケース。
 */
export class GetUpcomingMovieListUseCase {
  constructor(
    private readonly tmdbRepo: ITmdbRepository,
    private readonly enrichService: MovieEnrichService,
    private readonly upcomingService: UpcomingMovieService,
  ) {}

  /**
   * @returns 公開予定映画リスト（ドメインエンティティとエンリッチデータの結合体）
   */
  async execute(): Promise<
    (MovieEntity & { logoPath?: string; videoKey?: string })[]
  > {
    // 1. 複数ページにわたるデータの並行取得
    const pagesToFetch = ArrayUtils.range(
      TMDB_FETCH_CONFIG.FETCH_PAGES.UPCOMING,
    );
    const promises = pagesToFetch.map((page) =>
      this.tmdbRepo.findUpcomingMovies(page),
    );

    const responses = await Promise.all(promises);
    const allMovies = responses.flatMap((res) => res);

    // 2. ビジネスルールに基づくフィルタリングとソート
    const processedMovies = this.upcomingService.sort(
      ArrayUtils.deduplicate(
        allMovies.filter((m) => m.isMostlyJapanese() && m.hasValidImages()),
      ),
    );

    // 3. エンリッチメント（AppServiceによる並行取得）
    const movieIds = processedMovies.map((m) => m.id);
    const [logosMap, trailersMap] = await Promise.all([
      this.enrichService.getLogos(movieIds),
      this.enrichService.getTrailers(movieIds),
    ]);

    // 4. ドメインオブジェクトの構築 (Entity + EnrichData)
    return processedMovies.map((movie) =>
      Object.assign(movie, {
        logoPath: logosMap.get(movie.id),
        videoKey: trailersMap.get(movie.id),
      }),
    );
  }
}
