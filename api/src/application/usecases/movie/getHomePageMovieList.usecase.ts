import { ITmdbRepository } from "@/domain/repositories/tmdb.repository.interface";
import { MovieListResponse } from "@shared/types/api";
import { DiscoverMovieParams } from "@shared/types/external/tmdb";
import { MovieEntity } from "@/domain/models/movie";

export class GetHomePageMovieListUseCase {
  constructor(private readonly tmdbRepo: ITmdbRepository) {}

  private createPageArray(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  async execute(): Promise<MovieListResponse> {
    const categories: Record<string, DiscoverMovieParams> = {
      popular: {
        "vote_count.gte": 10000,
        sort_by: "popularity.desc",
        region: "JP",
      },
      recently_added: {
        "vote_count.gte": 1000,
        sort_by: "primary_release_date.desc",
        region: "JP",
      },
      top_rated: {
        "vote_count.gte": 1000,
        sort_by: "vote_average.desc",
        region: "JP",
      },
      high_rated: {
        "vote_count.gte": 5000,
        sort_by: "vote_count.desc",
        region: "JP",
      },
    };

    const pagesToFetch = this.createPageArray(10);

    // 全てのカテゴリとページを並行して取得
    const promises = Object.entries(categories).flatMap(
      ([categoryKey, params]) =>
        pagesToFetch.map(async (page) => {
          const results = await this.tmdbRepo.getDiscoverMovies({
            ...params,
            page,
          });
          return { categoryKey, results };
        }),
    );

    const results = await Promise.all(promises);

    // 結果をカテゴリごとに集約
    const aggregated: Record<string, MovieEntity[]> = {
      popular: [],
      recently_added: [],
      top_rated: [],
      high_rated: [],
    };

    results.forEach(({ categoryKey, results }) => {
      aggregated[categoryKey].push(...results);
    });

    // 重複排除
    const deduplicated: Record<string, MovieEntity[]> = {};
    for (const key of Object.keys(aggregated)) {
      const uniqueMovies = new Map<number, MovieEntity>();
      aggregated[key].forEach((movie) => uniqueMovies.set(movie.id, movie));
      deduplicated[key] = Array.from(uniqueMovies.values());
    }

    return {
      popular: deduplicated.popular.map((m) => m.toDto()),
      recently_added: deduplicated.recently_added.map((m) => m.toDto()),
      top_rated: deduplicated.top_rated.map((m) => m.toDto()),
      high_rated: deduplicated.high_rated.map((m) => m.toDto()),
    };
  }
}
