import { MovieEntity } from "../../../domain/models/movie";
import { ITmdbRepository } from "../../../domain/repositories/tmdb.repository.interface";

/**
 * 俳優・監督などの人物名を軸に映画を検索するユースケース。
 *
 * @description
 * 人物名から最も関連性の高い人物IDを特定し、その人物が関わった映画を返却する。
 * APIパラメータの構築はリポジトリに委譲し、ユースケースはビジネスフローに集中する。
 */
export class SearchMoviesByPersonUseCase {
  constructor(private readonly tmdbRepo: ITmdbRepository) {}

  /**
   * @param name - 検索対象の人物名
   * @returns 該当人物に関連する映画リスト（ドメインエンティティ）
   */
  async execute(name: string): Promise<MovieEntity[]> {
    // 1. 名前から対象人物IDを特定
    const personId = await this.tmdbRepo.findPersonIdByName(name);

    if (personId === null) {
      return [];
    }

    // 2. 特定した人物IDを用いて映画リストを取得
    return await this.tmdbRepo.findMoviesByCastId(personId);
  }
}
