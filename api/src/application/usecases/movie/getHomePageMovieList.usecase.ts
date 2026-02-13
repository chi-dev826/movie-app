import { ITmdbRepository } from "../../../domain/repositories/tmdb.repository.interface";
import { MovieListResponse } from "../../../../../shared/types/api";
import { HOME_CATEGORIES } from "../../../domain/constants/homeCategories";
import { MovieEntity } from "../../../domain/models/movie";
import { MovieFilterOutService } from "../../../domain/services/movie.filterOut.service";
import { TMDB_CONFIG } from "../../../domain/constants/tmdbConfig";

import { ArrayUtils } from "../../../utils/array";

export class GetHomePageMovieListUseCase {
  constructor(
    private readonly tmdbRepo: ITmdbRepository,
    private readonly movieFilterService: MovieFilterOutService,
  ) {}

  async execute(): Promise<MovieListResponse> {
    const pagesToFetch = ArrayUtils.range(TMDB_CONFIG.FETCH_PAGES.HOME);

    // カテゴリごとに並行処理
    const categoryPromises = Object.entries(HOME_CATEGORIES).map(
      async ([key, params]) => {
        // 各ページ並行処理
        const pagePromises = pagesToFetch.map((page) =>
          this.tmdbRepo.getDiscoverMovies({ ...params, page }),
        );
        const results: MovieEntity[][] = await Promise.all(pagePromises);

        // 全ページのリストを結合 (Entityの配列をフラット化)
        const flatList: MovieEntity[] = results.flat();

        // サービスを使用して重複排除
        const uniqueMovies = this.movieFilterService.deduplicate(flatList);

        // DTO化
        return {
          key,
          movies: uniqueMovies.map((m) => m.toDto()),
        };
      },
    );

    const categoryResults = await Promise.all(categoryPromises);

    const response: MovieListResponse = {
      popular: [],
      recently_added: [],
      top_rated: [],
      high_rated: [],
    };

    categoryResults.forEach((res) => {
      // 型安全に代入
      if (Object.prototype.hasOwnProperty.call(response, res.key)) {
        response[res.key as keyof MovieListResponse] = res.movies;
      }
    });

    return response;
  }
}
