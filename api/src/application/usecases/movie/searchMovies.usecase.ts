import { ITmdbRepository } from "../../../domain/repositories/tmdb.repository.interface";
import { Movie as MovieDTO } from "../../../../../shared/types/domain";
import { MovieFilterOutService } from "../../../domain/services/movie.filterOut.service";

/**
 * 映画タイトルでキーワード検索するユースケース
 *
 * @description
 * ユーザーが入力したキーワードをTMDBの検索APIに送信し、
 * マッチした映画を画像がない映画を除いて返却する。
 * 日本語と英語の両方で検索できるようにする。
 *
 * @param {string} query - ユーザーが入力した検索キーワード（例："Inception"、"インセプション"）
 * @returns {Promise<MovieDTO[]>} 検索結果の映画リスト（画像あり）
 *
 * @example
 * const useCase = new SearchMoviesUseCase(tmdbRepo, movieFilterService);
 * const results = await useCase.execute("Inception");
 * console.log(results);
 * // 出力例: [{ id: 1, title: "Inception", posterPath: "/path.jpg", ... }, ...]
 *
 * @process
 * 1. TMDBの検索APIにクエリを送信して映画を取得
 * 2. MovieFilterOutServiceで画像のない映画を除外
 * 3. 各映画をtoDto()でDTOに変換して返却
 */
export class SearchMoviesUseCase {
  constructor(
    private readonly tmdbRepo: ITmdbRepository,
    private readonly movieFilterService: MovieFilterOutService,
  ) {}

  async execute(query: string): Promise<MovieDTO[]> {
    const movies = await this.tmdbRepo.searchMovies(query);

    // 画像を持たない映画はフィルタリング
    const filteredMovies =
      this.movieFilterService.filterMovieWithoutImages(movies);
    return filteredMovies.map((movie) => movie.toDto());
  }
}
