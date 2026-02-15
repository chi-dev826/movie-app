import { ITmdbRepository } from "../../../domain/repositories/tmdb.repository.interface";
import { Movie as MovieDTO } from "../../../../../shared/types/domain";
import { MovieFilterOutService } from "../../../domain/services/movie.filterOut.service";

export class SearchMoviesUseCase {
  constructor(
    private readonly tmdbRepo: ITmdbRepository,
    private readonly movieFilterService: MovieFilterOutService,
  ) {}

  async execute(query: string): Promise<MovieDTO[]> {
    const movies = await this.tmdbRepo.searchMovies(query);

    // 画像を持たない映画はフィルタリング
    const filteredMovies =
      this.movieFilterService.filterMovieWithoutImages(movies);
    return filteredMovies.map((movie) => movie.toDto());
  }
}
