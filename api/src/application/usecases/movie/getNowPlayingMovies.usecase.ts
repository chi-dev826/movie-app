import { ITmdbRepository } from "@/domain/repositories/tmdb.repository.interface";
import { Movie as MovieDTO } from "@shared/types/domain";
import { MovieList } from "@/domain/models/movieList";

import { ArrayUtils } from "@/utils/array";

export class GetNowPlayingMoviesUseCase {
  constructor(private readonly tmdbRepo: ITmdbRepository) {}

  async execute(): Promise<MovieDTO[]> {
    const pagesToFetch = ArrayUtils.range(3);
    const promises = pagesToFetch.map((page) =>
      this.tmdbRepo.getNowPlayingMovies({
        page,
        language: "ja",
        region: "JP",
      }),
    );

    const responses = await Promise.all(promises);
    const allMovies = responses.flatMap((res) => res);

    // ドメインモデル(MovieList)に重複排除を委譲
    const movieList = new MovieList(allMovies);
    return movieList.deduplicate().toDtoArray();
  }
}
