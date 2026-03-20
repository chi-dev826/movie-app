import { ITmdbRepository } from "../../../domain/repositories/tmdb.repository.interface";
import { MovieEnrichService } from "../../services/movie.enrich.service";
import { MovieRecommendationService } from "../../../domain/services/movie.recommendation.service";
import { MovieMapper } from "../../../presentation/mappers/movie.mapper";
import { MoviePresenter } from "../../../presentation/presenters/movie.presenter";
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
    private readonly enrichService: MovieEnrichService,
    private readonly recommendationService: MovieRecommendationService,
  ) {}

  /**
   * @param movieId - 対象の映画ID
   * @returns プレゼンテーション層に最適化された一括データ
   * @throws {Error} 必須データ（詳細情報）が取得できない場合
   */
  async execute(movieId: number): Promise<FullMovieData> {
    // 1. 並行実行によるレイテンシの最小化
    const [detailEntity, imagePath, watchProviders] = await Promise.all([
      this.tmdbRepo.getMovieDetails(movieId),
      this.tmdbRepo.getMovieImages(movieId),
      this.tmdbRepo.getMovieWatchProviders(movieId),
    ]);

    // 2. おすすめ選定
    const recommendation = await this.recommendationService.getRecommendations(
      movieId,
      detailEntity.belongsToCollectionId,
    );

    // 3. エンリッチメント（App Service で動画キー等の補助データだけを取得）
    // 一覧系はバルクAPIを利用し、詳細1件は単体APIを利用する。
    const [recLogosMap, detailTrailerKey] = await Promise.all([
      this.enrichService.getLogos(recommendation.movies.map((m) => m.id)),
      this.enrichService.getTrailer(movieId),
    ]);

    // 4. レスポンス構築（マッパー生成後、プレゼンターでUI装飾）
    const rawDetailDto = MovieMapper.toDetailBffDto(detailEntity, {
      videoKey: detailTrailerKey,
    });
    const decoratedDetail = MoviePresenter.toMovieDetail(rawDetailDto, new Date());

    return {
      detail: decoratedDetail,
      image: imagePath,
      video: detailTrailerKey ?? null,
      recommendations: {
        title: recommendation.title,
        movies: recommendation.movies.map((m) =>
          MovieMapper.toBffDto(m, { logoPath: recLogosMap.get(m.id) }),
        ),
      },
      watchProviders,
    };
  }
}
