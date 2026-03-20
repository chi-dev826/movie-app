import { ITmdbRepository } from "../../../domain/repositories/tmdb.repository.interface";
import { MovieMapper } from "../../../presentation/mappers/movie.mapper";
import { Movie as MovieDTO } from "../../../../../shared/types/domain";

/**
 * 映画タイトルキーワードによる検索を実行するユースケース。
 */
export class SearchMoviesUseCase {
  constructor(private readonly tmdbRepo: ITmdbRepository) {}

  /**
   * @param query - 検索キーワード
   * @returns 検索結果の映画リスト
   */
  async execute(query: string): Promise<MovieDTO[]> {
    // 1. TMDB APIを使用してキーワード検索を実行
    const movies = await this.tmdbRepo.searchMovies(query);

    // 2. ビジネスルールに基づくフィルタリング（画像必須）
    const filteredMovies = movies.filter((m) => m.hasValidImages());

    // 3. マッパーでDTOへの変換
    return filteredMovies.map((movie) => MovieMapper.toBffDto(movie));
  }
}
