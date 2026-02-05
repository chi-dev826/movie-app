import { MovieEntity } from "@/domain/models/movie";
import { ITmdbRepository } from "@/domain/repositories/tmdb.repository.interface";

export class MovieEnricher {
  constructor(private readonly tmdbRepo: ITmdbRepository) {}

  /**
   * リスト内の映画に対して並行してロゴ画像を取得・設定する
   */
  async enrichWithLogos(movies: MovieEntity[]): Promise<void> {
    const results = await Promise.allSettled(
      movies.map((movie) => this.tmdbRepo.getMovieImages(movie.id)),
    );

    movies.forEach((movie, index) => {
      const result = results[index];
      if (result.status === "fulfilled") {
        movie.setLogo(result.value);
      }
    });
  }
}
