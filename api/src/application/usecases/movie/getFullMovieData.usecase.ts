import { ITmdbRepository } from "../../../domain/repositories/tmdb.repository.interface";
import { MovieEnricher } from "../../../domain/services/movie.enricher";
import { MovieRecommendationService } from "../../../domain/services/movie.recommendation.service";
import { MovieDetailEntity } from "../../../domain/models/movieDetail";
import { FullMovieData } from "../../../../../shared/types/api";

/**
 * 映画の詳細表示に必要な関連リソースを一括取得・加工するユースケース。
 * * @description
 * 基本情報に加え、配信状況、動的なおすすめ選定（シリーズ優先）、
 * およびロゴや予告編の補完を一括して行う。
 */
export class GetFullMovieDataUseCase {
  constructor(
    private readonly tmdbRepo: ITmdbRepository,
    private readonly enricher: MovieEnricher,
    private readonly recommendationService: MovieRecommendationService,
  ) {}

  /**
   * @param movieId - 対象の映画ID
   * @returns プレゼンテーション層に最適化された一括データ
   * @throws {Error} 必須データ（詳細情報）が取得できない場合
   */
  async execute(movieId: number): Promise<FullMovieData> {
    // 1. 並行実行によるレイテンシの最小化（I/O待ちをまとめる）
    const [detailEntity, imagePath, watchProviders] = await Promise.all([
      this.tmdbRepo.getMovieDetails(movieId),
      this.tmdbRepo.getMovieImages(movieId),
      this.tmdbRepo.getMovieWatchProviders(movieId),
    ]);

    // 2. おすすめ選定（戦略は MovieRecommendationService にカプセル化）
    const recommendation = await this.recommendationService.getRecommendations(
      movieId,
      detailEntity.belongsToCollectionId,
    );

    // 3. エンリッチメント（UIを豊かにするための視覚情報の追加）
    const [enrichedRecMovies, enrichedDetailMovies] = await Promise.all([
      this.enricher.enrichWithLogos(recommendation.movies),
      this.enricher.enrichWithTrailers([detailEntity]),
    ]);

    const enrichedDetail = enrichedDetailMovies[0] as MovieDetailEntity;

    // 4. レスポンス構築（ドメインモデルからDTOへの変換）
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
