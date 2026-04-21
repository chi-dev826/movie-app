import { MovieDetailEntity } from "../../../../domain/models/movieDetail";
import { ITmdbRepository } from "../../../../domain/repositories/tmdb.repository.interface";

export class GetDetailBaseInfoUseCase {
  constructor(private readonly tmdbRepo: ITmdbRepository) {}

  async execute(movieId: number): Promise<MovieDetailEntity> {
    const detail = await this.tmdbRepo.getMovieDetails(movieId);
    return detail;
  }
}
