import { ITmdbRepository } from "../../../domain/repositories/tmdb.repository.interface";
import { Movie as MovieDTO } from "../../../../../shared/types/domain";
import { MovieFilterOutService } from "../../../domain/services/movie.filterOut.service";

/**
 * 映画タイトルキーワードによる検索を実行するユースケース。
 * * @description
 * ユーザーの入力したクエリに基づき映画を検索し、UI表示に適さない
 * 画像欠損データを除外して返却する。
 */
export class SearchMoviesUseCase {
  constructor(
    private readonly tmdbRepo: ITmdbRepository,
    private readonly movieFilterService: MovieFilterOutService,
  ) {}

  /**
   * @param query - 検索キーワード
   * @returns 検索結果の映画リスト
   */
  async execute(query: string): Promise<MovieDTO[]> {
    // 1. TMDB APIを使用してキーワード検索を実行
    const movies = await this.tmdbRepo.searchMovies(query);

    // 2. ビジネスルールに基づくフィルタリング（画像必須）
    const filteredMovies =
      this.movieFilterService.filterMovieWithoutImages(movies);

    // 3. ドメインモデルからDTOへの変換
    return filteredMovies.map((movie) => movie.toDto());
  }
}
