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
    const today = new Date();

    // 1. 依存関係のないリソースをすべて並行取得開始
    // watchProviders は未公開なら後で捨てるが、ネットワーク待機時間を最小化するため並列に投げる
    const [
      detailEntity,
      imagePath,
      watchProvidersRaw,
      similarMovies,
      videoInfo,
    ] = await Promise.all([
      this.tmdbRepo.getMovieDetails(movieId),
      this.tmdbRepo.getMovieImages(movieId),
      this.tmdbRepo.getMovieWatchProviders(movieId),
      this.tmdbRepo.getSimilarMovies(movieId),
      this.enrichService.getDetailedVideos(movieId),
    ]);

    // 2. コレクション情報の取得 (detailEntity.belongsToCollectionId に依存)
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

    // 3. おすすめ選定とロゴの取得 (collection と similarMovies に依存)
    const recommendation = this.recommendationService.getRecommendations(
      movieId,
      collection,
      similarMovies,
    );

    const recLogosMap = await this.enrichService.getLogos(
      recommendation.movies.map((m) => m.id),
    );

    // 4. 配信情報の確定 (未公開作品はTMDBの配信情報の正確性が保証できないため空にする)
    const watchProviders = detailEntity.baseInfo.isReleased(today)
      ? watchProvidersRaw
      : [];

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
