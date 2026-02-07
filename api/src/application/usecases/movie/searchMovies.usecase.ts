import { ITmdbRepository } from "../../../domain/repositories/tmdb.repository.interface";
import { Movie as MovieDTO } from "../../../../../shared/types/domain";

export class SearchMoviesUseCase {
  constructor(private readonly tmdbRepo: ITmdbRepository) {}

  async execute(query: string): Promise<MovieDTO[]> {
    const entities = await this.tmdbRepo.searchMovies(query);
    return entities.map((entity) => entity.toDto());
  }
}