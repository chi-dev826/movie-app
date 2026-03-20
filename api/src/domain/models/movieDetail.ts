import { MovieEntity } from "./movie";
import { Crew, Cast } from "../../../../shared/types/domain";

export class MovieDetailEntity {
  constructor(
    public readonly baseInfo: MovieEntity,
    public readonly belongsToCollectionId: number | null,
    public readonly runtime: number | null,
    public readonly genres: readonly string[] | null,
    public readonly homePageUrl: string | null,
    public readonly cast: readonly Cast[],
    public readonly crew: readonly Crew[],
    public readonly revenue: number,
    public readonly budget: number,
    public readonly productionCountries: readonly string[],
    public readonly companyLogo: string | null,
  ) {
    Object.freeze(this);
    if (this.genres) Object.freeze(this.genres);
    Object.freeze(this.cast);
    Object.freeze(this.crew);
    Object.freeze(this.productionCountries);
  }
}
