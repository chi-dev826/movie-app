import { ITmdbRepository } from "../../../domain/repositories/tmdb.repository.interface";
import { MovieListResponse } from "../../../../../shared/types/api";
import { HOME_CATEGORIES } from "../../../domain/constants/homeCategories";
import { MovieEntity } from "../../../domain/models/movie";
import { MovieFilterOutService } from "../../../domain/services/movie.filterOut.service";
import { TMDB_CONFIG } from "../../../domain/constants/tmdbConfig";

import { ArrayUtils } from "../../../utils/array";

/**
 * ホーム画面用映画リストを取得するユースケース
 *
 * @description
 * ホーム画面に表示する4つのカテゴリ（人気、最近追加、高評価、話題）について、
 * それぞれ 10 ページ分の映画を取得する。
 * カテゴリごとの投票数フィルタを適用し、画像のない映画を除外、重複排除を行ったうえで返却する。
 *
 * @returns {Promise<MovieListResponse>} ホーム画面用の映画リスト（カテゴリごとに映画の配列）
 *
 * @example
 * const useCase = new GetHomePageMovieListUseCase(tmdbRepo, movieFilterService);
 * const homePageData = await useCase.execute();
 * console.log(homePageData);
 * // 出力例: { popular: [{ id: 1, title: "Popular Movie A", ... }, ...], recently_added: [...], top_rated: [...], high_rated: [...] }
 *
 * @process
 * 1. HOME_CATEGORIESで定義された各カテゴリのパラメータを使用して、TMDBのDiscover APIを複数ページ（デフォルト10ページ）にわたって並行実行
 * 2. 各カテゴリのAPIレスポンスを結合してフラット化
 * 3. MovieFilterOutServiceで画像のない映画を除外し、重複排除を行う
 * 4. 各映画をtoDto()でDTOに変換してカテゴリごとにまとめる
 * 5. カテゴリごとの映画リストをMovieListResponse形式で返却
 *
 * @dependencies
 * - ITmdbRepository: TMDB APIとの通信を担当
 * - MovieFilterOutService: 画像のない映画の除外と重複排除を担当
 *
 * @error
 * - TMDB APIからのデータ取得に失敗した場合は、エラーをキャッチしてログ出力し、可能な限り処理を継続する（例: 一部のページの取得に失敗しても、他のページやカテゴリは返却する）
 * - 取得した映画のデータがビジネスルールに合わない場合は、該当映画を除外して処理を継続する（例: 画像のない映画は除外する）
 */
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

        // 画像のない映画のフィルタリングと重複排除
        const filteredList = this.movieFilterService.filterMovieWithoutImages(
          this.movieFilterService.deduplicate(flatList),
        );

        // DTO化
        return {
          key,
          movies: filteredList.map((m) => m.toDto()),
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
