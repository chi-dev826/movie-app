import { ITmdbRepository } from "@/domain/repositories/tmdb.repository.interface";
import { MovieListResponse } from "@shared/types/api";
import { HOME_CATEGORIES } from "@/domain/constants/homeCategories";
import { MovieList } from "@/domain/models/movieList";

import { ArrayUtils } from "@/utils/array";

export class GetHomePageMovieListUseCase {
  constructor(private readonly tmdbRepo: ITmdbRepository) {}

  async execute(): Promise<MovieListResponse> {
    const pagesToFetch = ArrayUtils.range(10); // ひとまず10ページ分取得

    // カテゴリごとに並行処理
    const categoryPromises = Object.entries(HOME_CATEGORIES).map(
      async ([key, params]) => {
        // 各ページ並行処理
        const pagePromises = pagesToFetch.map((page) =>
          this.tmdbRepo.getDiscoverMovies({ ...params, page }),
        );
        const results = await Promise.all(pagePromises);

        // 全ページのリストを結合してMovieList化 (Entityの配列をフラット化)
        const flatList = results.flat();
        const movieList = new MovieList(flatList);

        // 重複排除してDTO化
        return {
          key,
          movies: movieList.deduplicate().toDtoArray(),
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
