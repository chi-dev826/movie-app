import { ITmdbRepository } from "../../../domain/repositories/tmdb.repository.interface";
import { Movie as MovieDTO } from "../../../../../shared/types/domain";
import { DiscoverMovieParams } from "../../../../../shared/types/external/tmdb";
import { MOVIE_RULES } from "../../../domain/constants/movieRules";

/**
 * 俳優・監督の名前を元に映画を検索するユースケース
 *
 * @description
 * ユーザーが入力した名前でTMDBの人物検索APIを呼び出し、最も関連性の高い人物のIDを取得。
 * そのIDを使用してDiscover APIで映画を検索し、結果をDTOに変換して返却する。
 * 例: "Leonardo DiCaprio" → 俳優ID → その俳優が出演している映画リスト
 *
 * @param {string} name - 検索する人物の名前（例: "Leonardo DiCaprio"）
 * @returns {Promise<MovieDTO[]>} 検索結果の映画リスト
 *
 * @example
 * const useCase = new SearchMoviesByPersonUseCase(tmdbRepo);
 * const movies = await useCase.execute("Leonardo DiCaprio");
 * console.log(movies);
 * // 出力例: [{ id: 1, title: "Inception", ... }, { id: 2, title: "The Revenant", ... }, ...]
 *
 * @process
 * 1. TMDBの人物検索APIに名前を送信して人物を検索
 * 2. 最も関連性の高い人物のIDを取得
 * 3. Discover APIにwith_castパラメータを使用して、その人物が出演している映画を検索
 * 4. 映画リストをDTOに変換して返却
 *
 * @dependencies
 * - ITmdbRepository: TMDB APIとの通信を担当
 *
 * @error
 * - 人物が見つからない場合は空の配列を返却する
 * - TMDB APIからのデータ取得に失敗した場合は、エラーをキャッチしてログ出力し、空の配列を返却する
 */
export class SearchMoviesByPersonUseCase {
  constructor(private readonly tmdbRepo: ITmdbRepository) {}

  async execute(name: string): Promise<MovieDTO[]> {
    // 1. 名前で人物を検索
    const personResponse = await this.tmdbRepo.searchPerson(name);

    // ヒットしなかった場合
    if (!personResponse.results || personResponse.results.length === 0) {
      return [];
    }

    // 2. 最も関連性が高い（先頭の）人物IDを取得
    const personId = personResponse.results[0].id;

    // 3. その人物が出演している映画を取得 (Discover APIを使用)
    const params: DiscoverMovieParams = {
      ...MOVIE_RULES.SEARCH_BY_PERSON,
      with_cast: String(personId),
    };

    const movies = await this.tmdbRepo.getDiscoverMovies(params);
    return movies.map((m) => m.toDto());
  }
}
