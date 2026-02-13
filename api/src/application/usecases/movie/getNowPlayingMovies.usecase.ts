import { ITmdbRepository } from "../../../domain/repositories/tmdb.repository.interface";
import { MovieFilterOutService } from "../../../domain/services/movie.filterOut.service";
import { Movie as MovieDTO } from "../../../../../shared/types/domain";
import { TMDB_CONFIG } from "../../../domain/constants/tmdbConfig";

import { ArrayUtils } from "../../../utils/array";

export class GetNowPlayingMoviesUseCase {
  constructor(
    private readonly tmdbRepo: ITmdbRepository,
    private readonly movieFilterService: MovieFilterOutService,
  ) {}

  async execute(): Promise<MovieDTO[]> {
    const pagesToFetch = ArrayUtils.range(TMDB_CONFIG.FETCH_PAGES.NOW_PLAYING);
    const promises = pagesToFetch.map((page) =>
      this.tmdbRepo.getNowPlayingMovies({
        page,
        language: TMDB_CONFIG.LANGUAGE,
        region: TMDB_CONFIG.REGION,
      }),
    );

    const responses = await Promise.all(promises);
    const allMovies = responses.flatMap((res) => res);

    // サービスを使用して重複排除
    const uniqueMovies = this.movieFilterService.deduplicate(allMovies);

    return uniqueMovies.map((m) => m.toDto());
  }
}
