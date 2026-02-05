import { ITmdbRepository } from "@/domain/repositories/tmdb.repository.interface";
import { MovieEnricher } from "@/domain/services/movie.enricher";
import { Movie as MovieDTO } from "@shared/types/domain";
import { DiscoverMovieParams } from "@shared/types/external/tmdb";
import { TMDB_CONFIG } from "@/domain/constants/tmdbConfig";
import { MOVIE_RULES } from "@/domain/constants/movieRules";

import { ArrayUtils } from "@/utils/array";

export class GetUpcomingMovieListUseCase {
  constructor(
    private readonly tmdbRepo: ITmdbRepository,
    private readonly enricher: MovieEnricher,
  ) {}

  async execute(): Promise<MovieDTO[]> {
    // データ取得期間の計算
    const today = new Date();
    const twoMonthsLater = new Date(today);
    twoMonthsLater.setMonth(
      today.getMonth() + TMDB_CONFIG.DATE.UPCOMING_MONTHS,
    );

    const formatDate = (d: Date) => d.toISOString().split("T")[0];

    const params: DiscoverMovieParams = {
      ...MOVIE_RULES.UPCOMING,
      "primary_release_date.gte": formatDate(today),
      "primary_release_date.lte": formatDate(twoMonthsLater),
    };

    const pagesToFetch = ArrayUtils.range(TMDB_CONFIG.FETCH_PAGES.UPCOMING);
    const promises = pagesToFetch.map((page) =>
      this.tmdbRepo.getDiscoverMovies({ ...params, page }),
    );

    const responses = await Promise.all(promises);
    const allMovies = responses.flatMap((res) => res);

    // 日本語コンテンツのフィルタリングを適用
    const filteredMovies = allMovies.filter((movie) =>
      movie.isMostlyJapanese(),
    );

    // エンリッチメント（ロゴと予告編）を一括適用
    await Promise.all([
      this.enricher.enrichWithLogos(filteredMovies),
      this.enricher.enrichWithTrailers(filteredMovies),
    ]);

    return filteredMovies.map((movie) => movie.toDto());
  }
}
