import { ITmdbRepository } from "@/domain/repositories/tmdb.repository.interface";
import { MovieEnricher } from "@/domain/services/movie.enricher";
import { MovieRecommendationService } from "@/domain/services/movie.recommendation.service";
import { FullMovieData } from "@shared/types/api";

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
    await Promise.all([
      this.enricher.enrichWithLogos(recommendation.movies), // おすすめ映画のロゴ付与
      this.enricher.enrichWithTrailers([detailEntity]), // メイン映画の予告編付与
    ]);

    // 5. レスポンス構築
    return {
      detail: detailEntity.toDetailDto(),
      image: imagePath,
      video: detailEntity.videoKey, // Enricherによってセットされているはず
      recommendations: {
        title: recommendation.title,
        movies: recommendation.movies.map((movie) => movie.toDto()),
      },
      watchProviders,
    };
  }
}
