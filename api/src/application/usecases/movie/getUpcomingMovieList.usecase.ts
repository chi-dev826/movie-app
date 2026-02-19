import { ITmdbRepository } from "../../../domain/repositories/tmdb.repository.interface";
import { MovieEnricher } from "../../../domain/services/movie.enricher";
import { UpcomingMovieService } from "../../../domain/services/upcomingMovie.service";
import { MovieFilterOutService } from "../../../domain/services/movie.filterOut.service";
import { Movie as MovieDTO } from "../../../../../shared/types/domain";
import { DiscoverMovieParams } from "../../../../../shared/types/external/tmdb";
import { TMDB_CONFIG } from "../../../domain/constants/tmdbConfig";
import { MOVIE_RULES } from "../../../domain/constants/movieRules";
import { ArrayUtils } from "../../../utils/array";
import { DateUtils } from "../../../utils/date";

/**
 * TMDBから近日公開予定の映画を取得するユースケース
 *
 * @description
 * 日本で公開予定の映画を取得し、ロゴ画像・予告編を付与し、公開日が近い順にソートして返却する。
 * デフォルトで10ページ取得し、ビジネスルールに従ってフィルタ・エンリッチする。
 *
 * @return {Promise<MovieDTO[]>} 公開予定映画の配列（公開日が近い順）
 *
 * @example
 * const useCase = new GetUpcomingMovieListUseCase(tmdbRepo, enricher, upcomingService, movieFilterService);
 * const upcomingMovies = await useCase.execute();
 * console.log(upcomingMovies);
 * // 出力例: [{ id: 1, title: "Upcoming Movie A", release_date_display: "2024-07-01", days_until_release: 10, upcoming_badge_label: "New!", ... }, ...]
 *
 * @process
 * 1. TMDB_CONFIG.DATE.UPCOMING_MONTHS（2ヶ月）先までの公開予定映画をDiscover APIで複数ページ取得
 * 2. 日本で公開予定の映画のみをフィルタリング
 * 3. 画像のない映画をMovieFilterOutServiceで除外し、重複も排除
 * 4. UpcomingMovieServiceで公開日が近い順にソート
 * 5. MovieEnricherでロゴと予告編を一括エンリッチ
 * 6. 公開日表示用のデータをUpcomingMovieServiceで付与してDTOに変換して返却
 *
 * @dependencies
 * - ITmdbRepository: TMDB APIとの通信を担当
 * - MovieEnricher: 映画へのロゴと予告編のエンリッチを担当
 * - UpcomingMovieService: 公開予定映画のビジネスロジック（ソート、表示用データ付与）を担当
 * - MovieFilterOutService: 画像のない映画の除外と重複排除を担当
 *
 * @error
 * - TMDB APIからのデータ取得に失敗した場合は、エラーをキャッチしてログ出力し、可能な限り処理を継続する（例: 一部の映画のロゴ取得に失敗しても、他の映画は返却する）
 * - 取得した映画のデータがビジネスルールに合わない場合は、該当映画を除外して処理を継続する（例: 日本で公開予定でない映画は除外する）
 */
export class GetUpcomingMovieListUseCase {
  constructor(
    private readonly tmdbRepo: ITmdbRepository,
    private readonly enricher: MovieEnricher,
    private readonly upcomingService: UpcomingMovieService,
    private readonly movieFilterService: MovieFilterOutService,
  ) {}

  async execute(): Promise<MovieDTO[]> {
    // データ取得期間の計算
    const today = new Date();
    const twoMonthsLater = new Date(today);
    twoMonthsLater.setMonth(
      today.getMonth() + TMDB_CONFIG.DATE.UPCOMING_MONTHS,
    );

    const formatDate = (d: Date) => d.toISOString().split("T")[0];

    const params: DiscoverMovieParams = {
      ...MOVIE_RULES.UPCOMING,
      "primary_release_date.gte": formatDate(today),
      "primary_release_date.lte": formatDate(twoMonthsLater),
    };

    const pagesToFetch = ArrayUtils.range(TMDB_CONFIG.FETCH_PAGES.UPCOMING);
    const promises = pagesToFetch.map((page) =>
      this.tmdbRepo.getDiscoverMovies({ ...params, page }),
    );

    const responses = await Promise.all(promises);
    const allMovies = responses.flatMap((res) => res);

    // 日本語コンテンツのフィルタリング
    const filteredMovies = allMovies.filter((movie) =>
      movie.isMostlyJapanese(),
    );

    // 画像のない映画をフィルタリング
    // さらに重複排除も適用
    const filteredAndUniqueMovies = this.movieFilterService.deduplicate(
      this.movieFilterService.filterMovieWithoutImages(filteredMovies),
    );

    // 公開日順にソート
    const sortedMovies = this.upcomingService.sort(filteredAndUniqueMovies);

    // エンリッチメント（ロゴと予告編）を一括適用
    let enrichedMovies = await this.enricher.enrichWithLogos(sortedMovies);
    enrichedMovies = await this.enricher.enrichWithTrailers(enrichedMovies);

    // Upcoming専用の表示用データを付与
    const jstToday = DateUtils.getJstToday();

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
