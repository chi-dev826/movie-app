import { ITmdbRepository } from "../../../domain/repositories/tmdb.repository.interface";
import { MovieListResponse } from "../../../../../shared/types/api";
import { HOME_CATEGORIES } from "../../../domain/constants/homeCategories";
import { MovieEntity } from "../../../domain/models/movie";
import { MovieFilterOutService } from "../../../domain/services/movie.filterOut.service";
import { TMDB_CONFIG } from "../../../domain/constants/tmdbConfig";

import { ArrayUtils } from "../../../utils/array";

/**
 * ホーム画面に表示する各種カテゴリの映画リストを一括取得・加工するユースケース。
 * * @description
 * 人気、最近追加、高評価、話題の各カテゴリについて、複数ページ分のデータを取得し、
 * フィルタリング（画像必須）と重複排除を適用して返却する。
 */
export class GetHomePageMovieListUseCase {
  constructor(
    private readonly tmdbRepo: ITmdbRepository,
    private readonly movieFilterService: MovieFilterOutService,
  ) {}

  /**
   * @returns カテゴリ別に分類された映画リスト
   */
  async execute(): Promise<MovieListResponse> {
    const pagesToFetch = ArrayUtils.range(TMDB_CONFIG.FETCH_PAGES.HOME);

    // 1. カテゴリごとに並行処理でデータを取得
    const categoryKeys = Object.keys(HOME_CATEGORIES) as (keyof MovieListResponse)[];
    const categoryPromises = categoryKeys.map(
      async (key) => {
        const params = HOME_CATEGORIES[key];
        // 各ページ並行処理
        const pagePromises = pagesToFetch.map((page) =>
          this.tmdbRepo.getDiscoverMovies({ ...params, page }),
        );
        const results: MovieEntity[][] = await Promise.all(pagePromises);

        // 2. 全ページのリストを結合し、ビジネスルールに基づくフィルタリングを適用
        const flatList: MovieEntity[] = results.flat();

        // 画像のない映画のフィルタリングと重複排除
        const filteredList = this.movieFilterService.filterMovieWithoutImages(
          this.movieFilterService.deduplicate(flatList),
        );

        // 3. ドメインモデルからDTOへの変換
        return {
          key,
          movies: filteredList.map((m) => m.toDto()),
        };
      },
    );

    const categoryResults = await Promise.all(categoryPromises);

    // 4. レスポンスオブジェクトの構築
    // HOME_CATEGORIES のキーは keyof MovieListResponse と型同期されているため、
    // ランタイムの hasOwnProperty チェックや as keyof キャストは不要
    const response = {} as MovieListResponse;
    categoryResults.forEach((res) => {
      response[res.key] = res.movies;
    });

    return response;
  }
}
