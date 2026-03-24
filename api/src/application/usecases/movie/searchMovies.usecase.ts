import { MovieEntity } from "../../../domain/models/movie";
import { ITmdbRepository } from "../../../domain/repositories/tmdb.repository.interface";

/**
 * 映画タイトルキーワードによる検索を実行するユースケース。
 */
export class SearchMoviesUseCase {
  constructor(private readonly tmdbRepo: ITmdbRepository) {}

  /**
   * @param query - 検索キーワード
   * @returns 検索結果の映画リスト（ドメインエンティティ）
   */
  async execute(query: string): Promise<MovieEntity[]> {
    // 1. TMDB APIを使用してキーワード検索を実行
    const movies = await this.tmdbRepo.searchMovies(query);

    // 2. ビジネスルールに基づくフィルタリング（画像必須）
    return movies.filter((m) => m.hasValidImages());
  }
}
