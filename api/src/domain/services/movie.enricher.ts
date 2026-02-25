import { MovieEntity } from "../models/movie";
import { ITmdbRepository } from "../repositories/tmdb.repository.interface";
import { IYoutubeRepository } from "../repositories/youtube.repository.interface";

export class MovieEnricher {
  constructor(
    private readonly tmdbRepo: ITmdbRepository,
    private readonly youtubeRepo: IYoutubeRepository,
  ) {}

  /**
   * リスト内の映画に対して並行してロゴ画像を取得・設定し、新しいリストを返す
   */
  async enrichWithLogos(
    movies: readonly MovieEntity[],
  ): Promise<MovieEntity[]> {
    const results = await Promise.allSettled(
      movies.map((movie) => this.tmdbRepo.getMovieImages(movie.id)),
    );

    const enrichedMovies = movies.map((movie, index) => {
      const result = results[index];
      if (result.status === "fulfilled" && result.value) {
        return movie.withLogo(result.value);
      }
      return movie;
    });

    return enrichedMovies;
  }

  /**
   * リスト内の映画に対して並行して予告編を取得・設定し、新しいリストを返す
   */
  async enrichWithTrailers(
    movies: readonly MovieEntity[],
  ): Promise<MovieEntity[]> {
    const results = await Promise.allSettled(
      movies.map(async (movie) => {
        const videos = await this.tmdbRepo.getMovieVideos(movie.id);
        const videoKey = videos.find((v) => v.isTrailer())?.getKey();

        if (videoKey) {
          const isPublic = await this.youtubeRepo.getVideoStatus(videoKey);
          if (isPublic) {
            return movie.withVideo(videoKey);
          }
        }
        return movie;
      }),
    );

    const enrichedMovies = movies.map((movie, index) => {
      const result = results[index];
      if (result.status === "fulfilled") {
        return result.value;
      }
      console.error(
        `予告編の取得に失敗しました (movieId: ${movie.id}):`,
        result.reason,
      );
      return movie;
    });

    return enrichedMovies;
  }
}
