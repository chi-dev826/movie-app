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
