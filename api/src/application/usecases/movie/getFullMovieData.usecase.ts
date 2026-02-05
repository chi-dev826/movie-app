import { ITmdbRepository } from "@/domain/repositories/tmdb.repository.interface";
import { MovieEnricher } from "@/domain/services/movie.enricher";
import { FullMovieData } from "@shared/types/api";
import { MovieEntity } from "@/domain/models/movie";

export class GetFullMovieDataUseCase {
  constructor(
    private readonly tmdbRepo: ITmdbRepository,
    private readonly enricher: MovieEnricher,
  ) {}

  async execute(movieId: number): Promise<FullMovieData> {
    // 1. 主要データの取得
    const [detailEntity, similarEntities, imagePath, watchProviders] =
      await Promise.all([
        this.tmdbRepo.getMovieDetails(movieId),
        this.tmdbRepo.getSimilarMovies(movieId),
        this.tmdbRepo.getMovieImages(movieId),
        this.tmdbRepo.getMovieWatchProviders(movieId),
      ]);

    // 2. シリーズ（Collection）情報の処理
    let collectionEntities: MovieEntity[] = [];
    if (detailEntity.belongsToCollectionId) {
      try {
        const collection = await this.tmdbRepo.getCollection(
          detailEntity.belongsToCollectionId,
        );
        // 現在表示中の映画を除外し、残りを取得
        collectionEntities = collection.filterOutMovie(movieId).parts;
      } catch (error) {
        console.error(
          `コレクション情報の取得に失敗しました (movieId: ${movieId}):`,
          error,
        );
      }
    }

    // 3. エンリッチメント（ロゴ、予告編）
    await Promise.all([
      this.enricher.enrichWithLogos(similarEntities),
      this.enricher.enrichWithLogos(collectionEntities),
      this.enricher.enrichWithTrailers([detailEntity]), // メイン映画の予告編付与
    ]);

    // 5. レスポンス構築
    return {
      detail: detailEntity.toDetailDto(),
      image: imagePath,
      video: detailEntity.videoKey, // Enricherによってセットされているはず
      similar: similarEntities.map((e) => e.toDto()),
      collections: collectionEntities.map((e) => e.toDto()),
      watchProviders,
    };
  }
}
