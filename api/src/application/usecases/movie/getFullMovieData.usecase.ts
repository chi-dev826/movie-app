import { MovieEntity } from "../../../domain/models/movie";
import { MovieDetailEntity } from "../../../domain/models/movieDetail";
import { ITmdbRepository } from "../../../domain/repositories/tmdb.repository.interface";
import { MovieEnrichService } from "../../services/movie.enrich.service";
import { MovieRecommendationService } from "../../../domain/services/movie.recommendation.service";

/**
 * 映画の詳細表示に必要な関連リソースを一括取得するドメイン関心事のオーケストレーション。
 */
export type FullMovieDomainData = {
  detail: MovieDetailEntity;
  imagePath: string | null;
  watchProviders: { logoPath: string | null; name: string }[];
  recommendation: {
    title: string;
    movies: readonly MovieEntity[];
  };
  recLogosMap: Map<number, string>;
  videoInfo: { video: string | null; otherVideos: string[] };
};

export class GetFullMovieDataUseCase {
  constructor(
    private readonly tmdbRepo: ITmdbRepository,
    private readonly enrichService: MovieEnrichService,
    private readonly recommendationService: MovieRecommendationService,
  ) {}

  /**
   * @param movieId - 対象の映画ID
   * @returns ドメインデータの集合体
   * @throws {Error} 必須データ（詳細情報）が取得できない場合
   */
  async execute(movieId: number): Promise<FullMovieDomainData> {
    // 1. 並行実行によるレイテンシの最小化
    const [detailEntity, imagePath, watchProviders] = await Promise.all([
      this.tmdbRepo.getMovieDetails(movieId),
      this.tmdbRepo.getMovieImages(movieId),
      this.tmdbRepo.getMovieWatchProviders(movieId),
    ]);

    // 2. おすすめ選定
    let collection = null;
    if (detailEntity.belongsToCollectionId) {
      try {
        collection = await this.tmdbRepo.getCollection(
          detailEntity.belongsToCollectionId,
        );
      } catch (error) {
        console.error(
          `コレクション情報の取得に失敗しました (movieId: ${movieId}):`,
          error,
        );
        collection = null;
      }
    }

    const similarMovies = await this.tmdbRepo.getSimilarMovies(movieId);

    const recommendation = this.recommendationService.getRecommendations(
      movieId,
      collection,
      similarMovies,
    );

    // 3. エンリッチメント
    const [recLogosMap, videoInfo] = await Promise.all([
      this.enrichService.getLogos(recommendation.movies.map((m) => m.id)),
      this.enrichService.getDetailedVideos(movieId),
    ]);

    return {
      detail: detailEntity,
      imagePath,
      watchProviders,
      recommendation,
      recLogosMap,
      videoInfo,
    };
  }
}
