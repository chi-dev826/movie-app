import { ITmdbRepository } from "../../../domain/repositories/tmdb.repository.interface";
import { MovieEnricher } from "../../../domain/services/movie.enricher";
import { MovieRecommendationService } from "../../../domain/services/movie.recommendation.service";
import { MovieDetailEntity } from "../../../domain/models/movieDetail";
import { FullMovieData } from "../../../../../shared/types/api";

/**
 * 映画の詳細ページ用データを一括取得するユースケース
 *
 * @description
 * 指定された映画 ID に対して、詳細情報・おすすめ映画・配信情報を一括で取得する。
 * おすすめ映画はシリーズがあれば優先、なければTMDBAPIから類似作品を取得する。
 * 処理は可能な限り並行して実行され、レスポンス時間を再消化する。
 *
 * @params {number} movieId - 詳細を取得する映画のID
 * @return {Promise<FullMovieData>} 映画の詳細データとおすすめ映画のセット
 *
 * @example
 * const useCase = new GetFullMovieDataUseCase(tmdbRepo, enricher, recommendationService);
 * const fullData = await useCase.execute(123);
 * console.log(fullData);
 * // 出力例: { detail: { id: 123, title: "Movie A", ... }, image: "/path/to/logo.jpg", video: "trailerKey", recommendations: { title: "Recommended Movies", movies: [{ id: 456, title: "Movie B", ... }, ...] }, watchProviders: [...] }
 *
 * @process
 * 1. TMDB APIから映画の詳細情報、ロゴ画像、配信情報を並行して取得
 * 2. MovieRecommendationServiceでおすすめ映画を選定（シリーズ優先、なければ類似作品）
 * 3. MovieEnricherでおすすめ映画にロゴを付与、メイン映画に予告編を付与
 * 4. 取得したデータをFullMovieData形式で構築して返却
 *
 * @dependencies
 * - ITmdbRepository: TMDB APIとの通信を担当
 * - MovieEnricher: 映画へのロゴと予告編のエンリッチを担当
 * - MovieRecommendationService: おすすめ映画の選定ロジックを担当
 *
 * @error
 * - TMDB APIからのデータ取得に失敗した場合は、エラーをキャッチしてログ出力し、可能な限り処理を継続する（例: おすすめ映画のロゴ取得に失敗しても、他のデータは返却する）
 * - 取得した映画のデータがビジネスルールに合わない場合は、該当映画を除外して処理を継続する（例: おすすめ映画がシリーズでない場合は類似作品を選定する）
 */
export class GetFullMovieDataUseCase {
  constructor(
    private readonly tmdbRepo: ITmdbRepository,
    private readonly enricher: MovieEnricher,
    private readonly recommendationService: MovieRecommendationService,
  ) {}

  async execute(movieId: number): Promise<FullMovieData> {
    // 1. 主要データの取得
    const [detailEntity, imagePath, watchProviders] = await Promise.all([
      this.tmdbRepo.getMovieDetails(movieId),
      this.tmdbRepo.getMovieImages(movieId),
      this.tmdbRepo.getMovieWatchProviders(movieId),
    ]);

    // 2. おすすめ選定（ロジックはサービスへ委譲）
    const recommendation = await this.recommendationService.getRecommendations(
      movieId,
      detailEntity.belongsToCollectionId,
    );

    // 3. エンリッチメント（ロゴ、予告編）
    // おすすめ映画のロゴ付与
    const enrichedRecMovies = await this.enricher.enrichWithLogos(
      recommendation.movies,
    );

    // メイン映画の予告編付与
    const enrichedDetailMovies = await this.enricher.enrichWithTrailers([
      detailEntity,
    ]);
    const enrichedDetail = enrichedDetailMovies[0] as MovieDetailEntity;

    // 5. レスポンス構築
    return {
      detail: enrichedDetail.toDetailDto(),
      image: imagePath,
      video: enrichedDetail.videoKey,
      recommendations: {
        title: recommendation.title,
        movies: enrichedRecMovies.map((m) => m.toDto()),
      },
      watchProviders,
    };
  }
}
