import { ITmdbRepository } from "../../../domain/repositories/tmdb.repository.interface";
import { MovieMapper } from "../../../presentation/mappers/movie.mapper";
import { Movie as MovieDTO } from "../../../../../shared/types/domain";
import { DiscoverMovieParams } from "../../../../../shared/types/external/tmdb";
import { MOVIE_RULES } from "../../../domain/constants/movieRules";

/**
 * 俳優・監督などの人物名を軸に映画を検索するユースケース。
 * * @description
 * 人物名から最も関連性の高い人物IDを特定し、その人物が関わった映画
 * をDiscover APIを用いて抽出・変換して返却する。
 */
export class SearchMoviesByPersonUseCase {
  constructor(private readonly tmdbRepo: ITmdbRepository) {}

  /**
   * @param name - 検索対象の人物名
   * @returns 該当人物に関連する映画リスト
   */
  async execute(name: string): Promise<MovieDTO[]> {
    // 1. 名前から対象人物を特定
    const personResponse = await this.tmdbRepo.searchPerson(name);

    if (!personResponse.results || personResponse.results.length === 0) {
      return [];
    }

    // 2. TMDB の searchPerson は関連度順で返却されるため、先頭を最適な候補として採用
    const personId = personResponse.results[0].id;

    // 3. 特定した人物IDを用いて映画リストを取得
    const params: DiscoverMovieParams = {
      ...MOVIE_RULES.SEARCH_BY_PERSON,
      with_cast: String(personId),
    };

    const movies = await this.tmdbRepo.getDiscoverMovies(params);

    // 4. マッパーでDTOへの変換
    return movies.map((m) => MovieMapper.toBffDto(m));
  }
}
