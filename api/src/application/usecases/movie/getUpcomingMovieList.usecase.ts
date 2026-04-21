import { ITmdbRepository } from "../../../domain/repositories/tmdb.repository.interface";
import { MovieEnrichService } from "../../services/movie.enrich.service";
import { UpcomingMovieService } from "../../../domain/services/upcomingMovie.service";
import { ArrayUtils } from "../../../utils/array";
import { EnrichedMovie } from "../../types/movie.types";

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
   * @param page 取得するページ番号
   * @param months 取得対象期間（月数）
   * @returns 公開予定映画リスト（エンリッチデータ結合済）とページネーション情報
   */
  async execute(
    page: number,
    months?: number,
  ): Promise<{
    movies: EnrichedMovie[];
    currentPage: number;
    totalPages: number;
  }> {
    // 1. 指定されたページのデータを取得
    const result = await this.tmdbRepo.findUpcomingMovies(page, months);

    // 2. ビジネスルールに基づくフィルタリングとソート
    const processedMovies = this.upcomingService.sort(
      ArrayUtils.deduplicate(
        result.movies.filter((m) => m.isMostlyJapanese() && m.hasValidImages()),
      ),
    );

    // 3. エンリッチメント（AppServiceによる並行取得）
    const movieIds = processedMovies.map((m) => m.id);
    const [logosMap, trailersMap] = await Promise.all([
      this.enrichService.getLogos(movieIds),
      this.enrichService.getTrailers(movieIds),
    ]);

    // 4. ドメインエンティティと補助データの合成
    const enrichedMovies: EnrichedMovie[] = processedMovies.map((movie) => ({
      entity: movie,
      logoPath: logosMap.get(movie.id) ?? null,
      videoKey: trailersMap.get(movie.id) ?? null,
    }));

    return {
      movies: enrichedMovies,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
    };
  }
}
