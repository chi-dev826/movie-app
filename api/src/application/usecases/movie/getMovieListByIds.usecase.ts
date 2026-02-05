import { ITmdbRepository } from "@/domain/repositories/tmdb.repository.interface";
import { Movie as MovieDTO } from "@shared/types/domain";
import { MovieDetailEntity } from "@/domain/models/movieDetail";

export class GetMovieListByIdsUseCase {
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

        detailEntity.setLogo(image);
        return detailEntity;
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
