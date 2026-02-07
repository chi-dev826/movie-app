import { MovieEntity } from "../models/movie";
import { ITmdbRepository } from "../repositories/tmdb.repository.interface";
import { YoutubeRepository } from "../../infrastructure/repositories/youtube.repository";

export class MovieEnricher {
  constructor(
    private readonly tmdbRepo: ITmdbRepository,
    private readonly youtubeRepo: YoutubeRepository,
  ) {}

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

  /**
   * リスト内の映画に対して並行して予告編（公開中のもの）を取得・設定する
   */
  async enrichWithTrailers(movies: MovieEntity[]): Promise<void> {
    await Promise.all(
      movies.map(async (movie) => {
        try {
          const videos = await this.tmdbRepo.getMovieVideos(movie.id);
          const trailer = videos.find((v) => v.isTrailer());

          if (trailer) {
            const isPublic = await this.youtubeRepo.getVideoStatus(trailer.key);
            if (isPublic) {
              movie.setVideo(trailer.key);
            }
          }
        } catch (error) {
          console.error(
            `予告編の取得に失敗しました (movieId: ${movie.id}):`,
            error,
          );
        }
      }),
    );
  }
}