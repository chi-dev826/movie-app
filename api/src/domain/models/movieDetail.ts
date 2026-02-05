import { MovieEntity } from "./movie";
import {
  MovieDetail as MovieDetailDTO,
  Cast,
  Crew,
} from "@shared/types/domain";

export class MovieDetailEntity extends MovieEntity {
  constructor(
    // Base properties
    id: number,
    title: string,
    originalTitle: string,
    originalLanguage: string,
    overview: string,
    posterPath: string | null,
    backdropPath: string | null,
    releaseDate: string | null,
    voteAverage: number | null,
    // Extended properties
    public readonly belongsToCollectionId: number | null,
    public readonly runtime: number | null,
    public readonly genres: string[] | null,
    public readonly homePageUrl: string | null,
    public readonly cast: Cast[],
    public readonly crew: Crew[],
    public readonly revenue: number,
    public readonly budget: number,
    public readonly productionCountries: string[],
    public readonly companyLogo: string | null,
  ) {
    super(
      id,
      title,
      originalTitle,
      originalLanguage,
      overview,
      posterPath,
      backdropPath,
      releaseDate,
      voteAverage,
    );
  }

  public toDetailDto(): MovieDetailDTO {
    return {
      ...this.toDto(),
      belongs_to_collection_id: this.belongsToCollectionId,
      year: this.releaseDate ? parseInt(this.releaseDate.slice(0, 4)) : null,
      runtime: this.runtime,
      genres: this.genres,
      company_logo: this.companyLogo,
      homePageUrl: this.homePageUrl,
      cast: this.cast,
      crew: this.crew,
      revenue: this.revenue,
      budget: this.budget,
      production_countries: this.productionCountries,
    };
  }
}
