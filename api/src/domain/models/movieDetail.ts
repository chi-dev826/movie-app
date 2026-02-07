import { MovieEntity } from "./movie";
import {
  MovieDetail as MovieDetailDTO,
  Crew,
  Cast,
} from "../../../../shared/types/domain";

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
      keyStaff: {
        directors: this.crew
          .filter((member) => member.job === "Director")
          .map((d) => ({ id: d.id, name: d.name })),
        writers: this.crew
          .filter((member) => member.job === "Screenplay")
          .map((w) => ({ id: w.id, name: w.name })),
        composers: this.crew
          .filter((member) => member.job === "Original Music Composer")
          .map((c) => ({ id: c.id, name: c.name })),
      },
      revenue: this.revenue,
      budget: this.budget,
      production_countries: this.productionCountries,
    };
  }
}
