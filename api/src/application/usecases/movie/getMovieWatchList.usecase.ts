import { ITmdbRepository } from "../../../domain/repositories/tmdb.repository.interface";
import { MovieMapper } from "../../../presentation/mappers/movie.mapper";
import { Movie as MovieDTO } from "../../../../../shared/types/domain";
import { MovieDetailEntity } from "../../../domain/models/movieDetail";

/**
 * 複数映画IDのウォッチリストデータを一括取得・変換するユースケース。
 * * @description
 * ユーザーの保存したIDリストを基に、各映画の詳細情報とロゴ画像を並行取得し、
 * DTOのリストとして返却する。取得失敗時は該当映画を除外して処理を継続する。
 */
export class GetMovieWatchListUseCase {
  constructor(private readonly tmdbRepo: ITmdbRepository) {}

  /**
   * @param movieIds - 取得対象の映画ID配列
   * @returns 映画の詳細データを含むDTOの配列
   */
  async execute(movieIds: number[]): Promise<MovieDTO[]> {
    if (!movieIds || movieIds.length === 0) {
      return [];
    }

    // 1. 各映画IDに対して並行してデータを取得
    const promises = movieIds.map(async (id) => {
      try {
        const [detailEntity, image] = await Promise.all([
          this.tmdbRepo.getMovieDetails(id),
          this.tmdbRepo.getMovieImages(id),
        ]);

        return { detailEntity, image };
      } catch (error) {
        console.error(`映画ID ${id} の取得に失敗しました:`, error);
        return null;
      }
    });

    const results = await Promise.all(promises);

    // 3. 有効なデータのみを抽出し、DTOに変換して返却
    return results
      .filter(
        (
          item,
        ): item is { detailEntity: MovieDetailEntity; image: string | null } =>
          item !== null,
      )
      .map((item) =>
        MovieMapper.toBffDto(item.detailEntity.baseInfo, {
          logoPath: item.image,
        }),
      );
  }
}
