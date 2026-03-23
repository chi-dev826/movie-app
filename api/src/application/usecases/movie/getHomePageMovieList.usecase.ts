import { ITmdbRepository } from "../../../domain/repositories/tmdb.repository.interface";
import { MovieListResponse } from "../../../../../shared/types/api";
import { HOME_CATEGORIES } from "../../../domain/constants/homeCategories";
import { MovieEntity } from "../../../domain/models/movie";
import { MovieMapper } from "../../../presentation/mappers/movie.mapper";
import { TMDB_CONFIG } from "../../../domain/constants/tmdbConfig";

import { ArrayUtils } from "../../../utils/array";

/**
 * ホーム画面に表示する各種カテゴリの映画リストを一括取得・加工するユースケース。
 */
export class GetHomePageMovieListUseCase {
  constructor(private readonly tmdbRepo: ITmdbRepository) {}

  /**
   * @returns カテゴリ別に分類された映画リスト
   */
  async execute(): Promise<MovieListResponse> {
    const pagesToFetch = ArrayUtils.range(TMDB_CONFIG.FETCH_PAGES.HOME);

    // 1. カテゴリごとに並行処理でデータを取得
    const categoryKeys = Object.keys(
      HOME_CATEGORIES,
    ) as (keyof MovieListResponse)[];
    const categoryPromises = categoryKeys.map(async (key) => {
      const params = HOME_CATEGORIES[key];
      const pagePromises = pagesToFetch.map((page) =>
        this.tmdbRepo.getDiscoverMovies({ ...params, page }),
      );
      const results: MovieEntity[][] = await Promise.all(pagePromises);

      // 2. ビジネスルールに基づくフィルタリングと重複排除
      const flatList: MovieEntity[] = results.flat();

      // 重複排除と画像バリデーション（Entityメソッドを使用）
      const processedList = ArrayUtils.deduplicate(flatList).filter((m) =>
        m.hasValidImages(),
      );

      // 3. マッパーでDTOへの変換（ホームリストは日付派生を持たない汎用 DTO）
      return {
        key,
        movies: processedList.map((m) => MovieMapper.toBffDto(m)),
      };
    });

    const categoryResults = await Promise.all(categoryPromises);

    const response = {} as MovieListResponse;
    categoryResults.forEach((res) => {
      response[res.key] = res.movies;
    });

    return response;
  }
}
