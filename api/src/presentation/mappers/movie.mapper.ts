import { MovieEntity } from "../../domain/models/movie";
import { MovieDetailEntity } from "../../domain/models/movieDetail";
import {
  Movie as MovieDTO,
  MovieDetailBase as MovieDetailBaseDTO,
} from "../../../../shared/types/api/dto";
import { MoviePresenter } from "../presenters/movie.presenter";

export class MovieMapper {
  /**
   * ドメインモデルと補助データから汎用の MovieDTO を生成する
   */
  static toBffDto(
    entity: MovieEntity,
    options?: { videoKey?: string | null },
  ): MovieDTO {
    return {
      id: entity.id,
      title: entity.title,
      originalTitle: entity.originalTitle,
      originalLanguage: entity.originalLanguage,
      overview: entity.overview,
      posterPath: entity.posterPath,
      backdropPath: entity.backdropPath,
      releaseDate: entity.releaseDate ?? undefined,
      // TMDB の 10 段階評価を星 5 段階に変換
      voteAverage: entity.voteAverage
        ? Number((entity.voteAverage / 2).toFixed(1))
        : null,
      genreIds: [...entity.genreIds],

      // オプションのエンリッチデータ
      video: MoviePresenter.enrichVideoUrl(options?.videoKey ?? null),
    };
  }

  /**
   * 詳細ドメインモデルから BFF 用の詳細 MovieDetailDTO を生成する
   */
  static toDetailBffDto(
    detailEntity: MovieDetailEntity,
    options?: { videoKey?: string | null },
  ): MovieDetailBaseDTO {
    const baseDto = this.toBffDto(detailEntity.baseInfo, options);

    return {
      id: baseDto.id,
      title: baseDto.title,
      originalTitle: baseDto.originalTitle,
      overview: baseDto.overview,
      posterPath: baseDto.posterPath,
      backdropPath: baseDto.backdropPath,
      // TMDB の 10 段階評価を星 5 段階に変換
      voteAverage: baseDto.voteAverage,

      belongsToCollectionId: detailEntity.belongsToCollectionId,
      year: detailEntity.baseInfo.releaseDate
        ? parseInt(detailEntity.baseInfo.releaseDate.slice(0, 4))
        : null,
      runtime: detailEntity.runtime,
      genres: detailEntity.genres ? [...detailEntity.genres] : null,
      companyLogo: detailEntity.companyLogo,
      homePageUrl: detailEntity.homePageUrl,
      cast: [...detailEntity.cast],
      keyStaff: {
        directors: detailEntity.crew
          .filter((member) => member.job === "Director")
          .map((d) => ({ id: d.id, name: d.name })),
        writers: detailEntity.crew
          .filter((member) => member.job === "Screenplay")
          .map((w) => ({ id: w.id, name: w.name })),
        composers: detailEntity.crew
          .filter((member) => member.job === "Original Music Composer")
          .map((c) => ({ id: c.id, name: c.name })),
      },
      revenue: detailEntity.revenue,
      budget: detailEntity.budget,
      productionCountries: [...detailEntity.productionCountries],
      productionCompanies: [...detailEntity.productionCompanies],
      releaseDate: detailEntity.baseInfo.releaseDate ?? null,
    };
  }
}
