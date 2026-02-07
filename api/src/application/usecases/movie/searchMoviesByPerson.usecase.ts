import { ITmdbRepository } from "../../../domain/repositories/tmdb.repository.interface";
import { Movie as MovieDTO } from "../../../../../shared/types/domain";
import { DiscoverMovieParams } from "../../../../../shared/types/external/tmdb";
import { MOVIE_RULES } from "../../../domain/constants/movieRules";

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
