import { ITmdbRepository } from "../../../domain/repositories/tmdb.repository.interface";
import { MovieEnrichService } from "../../services/movie.enrich.service";
import { UpcomingMovieService } from "../../../domain/services/upcomingMovie.service";
import { MoviePresenter } from "../../../presentation/presenters/movie.presenter";
import { MovieMapper } from "../../../presentation/mappers/movie.mapper";
import { UpcomingMovie as UpcomingMovieDTO } from "../../../../../shared/types/domain";
import { DiscoverMovieParams } from "../../../../../shared/types/external/tmdb";
import { TMDB_CONFIG } from "../../../domain/constants/tmdbConfig";
import { ArrayUtils } from "../../../utils/array";
import { IClock } from "../../../domain/repositories/clock.service.interface";

/**
 * 日本で近日公開予定の映画リストを取得・加工するユースケース。
 */
export class GetUpcomingMovieListUseCase {
  constructor(
    private readonly tmdbRepo: ITmdbRepository,
    private readonly enrichService: MovieEnrichService,
    private readonly upcomingService: UpcomingMovieService,
    private readonly clock: IClock,
  ) {}

  /**
   * @returns 公開日が近い順にソート・加工された公開予定映画リスト
   */
  async execute(): Promise<UpcomingMovieDTO[]> {
    const today = this.clock.now();

    // 1. データ取得期間の計算とパラメータ構築
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
    // 日本向けの判定（MostlyJapanese）と画像バリデーション、重複排除、ドメインソート
    const processedMovies = this.upcomingService.sort(
      ArrayUtils.deduplicate(
        allMovies.filter((m) => m.isMostlyJapanese() && m.hasValidImages()),
      ),
    );

    // 4. エンリッチメント（AppServiceによる並行取得）
    const movieIds = processedMovies.map((m) => m.id);
    const [logosMap, trailersMap] = await Promise.all([
      this.enrichService.getLogos(movieIds),
      this.enrichService.getTrailers(movieIds),
    ]);

    // 5. レスポンス構築（1. MapperでDTO化 -> 2. PresenterでUI装飾）
    return processedMovies.map((movie) => {
      const dto = MovieMapper.toBffDto(movie, {
        logoPath: logosMap.get(movie.id),
        videoKey: trailersMap.get(movie.id),
      });
      return MoviePresenter.toUpcomingMovie(dto, today);
    });
  }
}
