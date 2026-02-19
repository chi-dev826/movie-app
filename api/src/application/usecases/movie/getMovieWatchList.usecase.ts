import { ITmdbRepository } from "../../../domain/repositories/tmdb.repository.interface";
import { Movie as MovieDTO } from "../../../../../shared/types/domain";
import { MovieDetailEntity } from "../../../domain/models/movieDetail";

/**
 * 複数映画 ID のウォッチリストを取得するユースケース
 *
 * @description
 * ユーザーが保存した映画のIDリストを元に、TMDB APIから各映画の詳細情報とロゴ画像を並行して取得し、DTOに変換して返却する。
 * 例: [123, 456, 789] → 各映画の詳細情報とロゴ画像 → DTOリスト
 *
 * @param {number[]} movieIds - 映画IDの配列（例: [123, 456, 789]）
 * @returns {Promise<MovieDTO[]>} 映画の詳細データとロゴ画像を含むDTOの配列
 *
 * @example
 * const useCase = new GetMovieWatchListUseCase(tmdbRepo);
 * const watchList = await useCase.execute([123, 456, 789]);
 * console.log(watchList);
 * // 出力例: [{ id: 123, title: "Movie A", posterPath: "/path.jpg", ... }, { id: 456, title: "Movie B", posterPath: "/path.jpg", ... }, ...]
 *
 * @process
 * 1. 映画IDの配列を受け取る
 * 2. 各映画IDに対して、TMDB APIから詳細情報とロゴ画像を並行して取得
 * 3. 取得したデータをMovieDetailEntityに統合（ロゴ画像を含む）
 * 4. MovieDetailEntityをDTOに変換して返却
 *
 * @dependencies
 * - ITmdbRepository: TMDB APIとの通信を担当
 *
 * @error
 * - TMDB APIからのデータ取得に失敗した場合は、エラーをキャッチしてログ出力し、該当映画はnullとして処理を継続する（例: 映画ID 123の取得に失敗しても、他の映画IDの処理は継続する）
 */

export class GetMovieWatchListUseCase {
  constructor(private readonly tmdbRepo: ITmdbRepository) {}

  async execute(movieIds: number[]): Promise<MovieDTO[]> {
    if (!movieIds || movieIds.length === 0) {
      return [];
    }

    const promises = movieIds.map(async (id) => {
      try {
        const [detailEntity, image] = await Promise.all([
          this.tmdbRepo.getMovieDetails(id),
          this.tmdbRepo.getMovieImages(id),
        ]);

        return detailEntity.withLogo(image);
      } catch (error) {
        console.error(`映画ID ${id} の取得に失敗しました:`, error);
        return null;
      }
    });

    const results = await Promise.all(promises);
    // 取得に成功したものだけを返す
    return results
      .filter((movie): movie is MovieDetailEntity => movie !== null)
      .map((movie) => movie.toDto());
  }
}
