import { MovieEntity } from "./movie";

export class CollectionEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly parts: MovieEntity[],
  ) {}

  public filterOutMovie(movieId: number): CollectionEntity {
    return new CollectionEntity(
      this.id,
      this.name,
      this.parts.filter((p) => p.id !== movieId),
    );
  }
}
