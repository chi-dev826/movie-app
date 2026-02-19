import { ITmdbRepository } from "../../../domain/repositories/tmdb.repository.interface";
import { MovieFilterOutService } from "../../../domain/services/movie.filterOut.service";
import { Movie as MovieDTO } from "../../../../../shared/types/domain";
import { TMDB_CONFIG } from "../../../domain/constants/tmdbConfig";

import { ArrayUtils } from "../../../utils/array";

/**
 * TMDBから現在上映中の映画を取得するユースケース
 *
 * @description
 * TMDBから複数ページ（デフォルト3ページ）にわたって現在上映中の映画を取得し、
 * 画像がない映画を除外、重複排除を行ったうえで返却する。
 *
 * @returns {Promise<MovieDTO[]>} 現在上映中の映画のリスト（重複なし、画像あり）
 *
 * @example
 * const useCase = new GetNowPlayingMoviesUseCase(tmdbRepo, movieFilterService);
 * const movies = await useCase.execute();
 * console.log(movies);
 * // 出力例: [{ id: 1, title: "Movie A", posterPath: "/path.jpg", ... }, ...]
 *
 * @process
 * 1.TMDB_CONFIG.FETCH_PAGES.NOW_PLAYING（3ページ）の範囲を生成
 * 2.各ページに対してtmdbRepo.getNowPlayingMovies()を並行実行
 * 3.APIレスポンスを配列に統合（flatMap）
 * 4.MovieFilterOutService.filterMovieWithoutImages()で画像のない映画を除外
 * 5.MovieFilterOutService.deduplicate()で重複排除
 * 6.各映画をtoDto()でDTOに変換して返却
 */
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

    // 画像のない映画をフィルタリング
    const filteredMovies =
      this.movieFilterService.filterMovieWithoutImages(allMovies);

    // サービスを使用して重複排除
    const uniqueMovies = this.movieFilterService.deduplicate(filteredMovies);

    return uniqueMovies.map((m) => m.toDto());
  }
}
