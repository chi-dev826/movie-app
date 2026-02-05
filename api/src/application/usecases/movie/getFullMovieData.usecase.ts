import { ITmdbRepository } from "@/domain/repositories/tmdb.repository.interface";
import { YoutubeRepository } from "@/infrastructure/repositories/youtube.repository";
import { MovieEnricher } from "@/domain/services/movie.enricher";
import { FullMovieData } from "@shared/types/api";
import { MovieEntity } from "@/domain/models/movie";

export class GetFullMovieDataUseCase {
  constructor(
    private readonly tmdbRepo: ITmdbRepository,
    private readonly youtubeRepo: YoutubeRepository,
    private readonly enricher: MovieEnricher,
  ) {}

  async execute(movieId: number): Promise<FullMovieData> {
    // 1. 主要データの取得
    const [detailEntity, videos, similarEntities, imagePath, watchProviders] =
      await Promise.all([
        this.tmdbRepo.getMovieDetails(movieId),
        this.tmdbRepo.getMovieVideos(movieId),
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

    // 3. 関連映画とシリーズ映画にロゴ情報を付与
    await Promise.all([
      this.enricher.enrichWithLogos(similarEntities),
      this.enricher.enrichWithLogos(collectionEntities),
    ]);

    // 4. 動画（予告編）のキー特定と公開状態の確認
    const trailer = videos.find((v) => v.isTrailer());
    let videoKey: string | null = null;
    if (trailer) {
      const isPublic = await this.youtubeRepo.getVideoStatus(trailer.key);
      if (isPublic) {
        videoKey = trailer.key;
      }
    }

    // 5. レスポンス構築
    return {
      detail: detailEntity.toDetailDto(),
      image: imagePath,
      video: videoKey,
      similar: similarEntities.map((e) => e.toDto()),
      collections: collectionEntities.map((e) => e.toDto()),
      watchProviders,
    };
  }
}
