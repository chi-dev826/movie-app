import { ITmdbRepository } from "../../../domain/repositories/tmdb.repository.interface";
import { MovieEnricher } from "../../../domain/services/movie.enricher";
import { MovieRecommendationService } from "../../../domain/services/movie.recommendation.service";
import { MovieList } from "../../../domain/models/movieList";
import { MovieDetailEntity } from "../../../domain/models/movieDetail";
import { FullMovieData } from "../../../../../shared/types/api";

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
    const enrichedRecList = await this.enricher.enrichWithLogos(
      new MovieList(recommendation.movies),
    );

    // メイン映画の予告編付与
    const enrichedDetailList = await this.enricher.enrichWithTrailers(
      new MovieList([detailEntity]),
    );
    const enrichedDetail = enrichedDetailList.items[0] as MovieDetailEntity;

    // 5. レスポンス構築
    return {
      detail: enrichedDetail.toDetailDto(),
      image: imagePath,
      video: enrichedDetail.videoKey,
      recommendations: {
        title: recommendation.title,
        movies: enrichedRecList.toDtoArray(),
      },
      watchProviders,
    };
  }
}
