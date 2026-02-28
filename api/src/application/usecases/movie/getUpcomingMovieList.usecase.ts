import { ITmdbRepository } from "../../../domain/repositories/tmdb.repository.interface";
import { MovieEnricher } from "../../../domain/services/movie.enricher";
import { UpcomingMovieService } from "../../../domain/services/upcomingMovie.service";
import { MovieFilterOutService } from "../../../domain/services/movie.filterOut.service";
import { Movie as MovieDTO } from "../../../../../shared/types/domain";
import { DiscoverMovieParams } from "../../../../../shared/types/external/tmdb";
import { TMDB_CONFIG } from "../../../domain/constants/tmdbConfig";
import { ArrayUtils } from "../../../utils/array";

/**
 * 日本で近日公開予定の映画リストを取得・加工するユースケース。
 * * @description
 * 日本の公開スケジュールに基づき映画を取得し、ロゴ、予告編、
 * および公開までのカウントダウン情報を付加して返却する。
 */
export class GetUpcomingMovieListUseCase {
  constructor(
    private readonly tmdbRepo: ITmdbRepository,
    private readonly enricher: MovieEnricher,
    private readonly upcomingService: UpcomingMovieService,
    private readonly movieFilterService: MovieFilterOutService,
  ) {}

  /**
   * @returns 公開日が近い順にソート・加工された映画リスト
   */
  async execute(): Promise<MovieDTO[]> {
    // 1. データ取得期間の計算とパラメータ構築 (Serviceに移譲)
    const params: DiscoverMovieParams =
      this.upcomingService.getSearchPeriodParams();

    // 2. 複数ページにわたるデータの並行取得
    const pagesToFetch = ArrayUtils.range(TMDB_CONFIG.FETCH_PAGES.UPCOMING);
    const promises = pagesToFetch.map((page) =>
      this.tmdbRepo.getDiscoverMovies({ ...params, page }),
    );

    const responses = await Promise.all(promises);
    const allMovies = responses.flatMap((res) => res);

    // 3. ビジネスルールに基づくフィルタリングとソート
    // 適用順序: 日本語フィルタ → 画像フィルタ → 重複排除 → 公開日ソート
    // 日本語フィルタを先に適用することで、後続処理の対象件数を削減する
    const filteredMovies = allMovies.filter((movie) =>
      movie.isMostlyJapanese(),
    );

    const filteredAndUniqueMovies = this.movieFilterService.deduplicate(
      this.movieFilterService.filterMovieWithoutImages(filteredMovies),
    );

    const sortedMovies = this.upcomingService.sort(filteredAndUniqueMovies);

    // 4. エンリッチメント（ロゴと予告編の一括付与）
    let enrichedMovies = await this.enricher.enrichWithLogos(sortedMovies);
    enrichedMovies = await this.enricher.enrichWithTrailers(enrichedMovies);

    // 5. レスポンス構築（DTO変換と公開情報の付加）
    const jstToday = this.upcomingService.getJstToday();

    return enrichedMovies.map((movie) => {
      const dto = movie.toDto();
      const daysUntil = this.upcomingService.calculateDaysUntilRelease(
        movie,
        jstToday,
      );

      return {
        ...dto,
        release_date_display: this.upcomingService.getDisplayDate(movie),
        days_until_release: daysUntil,
        upcoming_badge_label: this.upcomingService.getBadgeLabel(daysUntil),
      };
    });
  }
}
