import { ITmdbRepository } from "@/domain/repositories/tmdb.repository.interface";
import { Movie as MovieDTO } from "@shared/types/domain";
import { MovieEntity } from "@/domain/models/movie";

export class GetNowPlayingMoviesUseCase {
  constructor(private readonly tmdbRepo: ITmdbRepository) {}

  private createPageArray(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  async execute(): Promise<MovieDTO[]> {
    const pagesToFetch = this.createPageArray(3);
    const promises = pagesToFetch.map((page) =>
      this.tmdbRepo.getNowPlayingMovies({
        page,
        language: "ja",
        region: "JP",
      }),
    );

    const responses = await Promise.all(promises);
    const allMovies = responses.flatMap((res) => res);

    // 重複排除
    const uniqueMovies = new Map<number, MovieEntity>();
    allMovies.forEach((m) => uniqueMovies.set(m.id, m));
    const result = Array.from(uniqueMovies.values());

    return result.map((m) => m.toDto());
  }
}
