import { MovieEntity } from "../../domain/models/movie";
import { MovieDetailEntity } from "../../domain/models/movieDetail";
import {
  Movie as MovieDTO,
  MovieDetailBase as MovieDetailBaseDTO,
} from "../../../../shared/types/domain";

export class MovieMapper {
  /**
   * ドメインモデルと補助データから汎用の MovieDTO を生成する
   */
  static toBffDto(
    entity: MovieEntity,
    options?: { videoKey?: string | null; logoPath?: string | null },
  ): MovieDTO {
    return {
      id: entity.id,
      title: entity.title,
      original_title: entity.originalTitle,
      original_language: entity.originalLanguage,
      overview: entity.overview,
      poster_path: entity.posterPath,
      backdrop_path: entity.backdropPath,
      release_date: entity.releaseDate ?? undefined,
      // TMDB の 10 段階評価を星 5 段階に変換
      vote_average: entity.voteAverage ? entity.voteAverage / 2 : null,
      genre_ids: [...entity.genreIds],

      // オプションのエンリッチデータ
      video: options?.videoKey ?? null,
      logo_path: options?.logoPath ?? null,
    };
  }

  /**
   * 詳細ドメインモデルから BFF 用の詳細 MovieDetailDTO を生成する
   */
  static toDetailBffDto(
    detailEntity: MovieDetailEntity,
    options?: { videoKey?: string | null; logoPath?: string | null },
  ): MovieDetailBaseDTO {
    const baseDto = this.toBffDto(detailEntity.baseInfo, options);

    return {
      id: baseDto.id,
      title: baseDto.title,
      original_title: baseDto.original_title,
      overview: baseDto.overview,
      poster_path: baseDto.poster_path,
      backdrop_path: baseDto.backdrop_path,
      // TMDB の 10 段階評価を星 5 段階に変換
      vote_average: baseDto.vote_average,

      belongs_to_collection_id: detailEntity.belongsToCollectionId,
      year: detailEntity.baseInfo.releaseDate
        ? parseInt(detailEntity.baseInfo.releaseDate.slice(0, 4))
        : null,
      runtime: detailEntity.runtime,
      genres: detailEntity.genres ? [...detailEntity.genres] : null,
      company_logo: detailEntity.companyLogo,
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
      production_countries: [...detailEntity.productionCountries],
      release_date: detailEntity.baseInfo.releaseDate ?? null,
    };
  }
}
