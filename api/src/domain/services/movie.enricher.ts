import { MovieEntity } from "../models/movie";
import { MovieList } from "../models/movieList";
import { ITmdbRepository } from "../repositories/tmdb.repository.interface";
import { YoutubeRepository } from "../../infrastructure/repositories/youtube.repository";

export class MovieEnricher {
  constructor(
    private readonly tmdbRepo: ITmdbRepository,
    private readonly youtubeRepo: YoutubeRepository,
  ) {}

  /**
   * リスト内の映画に対して並行してロゴ画像を取得・設定し、新しいリストを返す
   */
  async enrichWithLogos(movieList: MovieList): Promise<MovieList> {
    const movies = movieList.items;
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

    return new MovieList(enrichedMovies);
  }

  /**
   * リスト内の映画に対して並行して予告編を取得・設定し、新しいリストを返す
   */
  async enrichWithTrailers(movieList: MovieList): Promise<MovieList> {
    const movies = movieList.items;
    const enrichedMovies = await Promise.all(
      movies.map(async (movie) => {
        try {
          const videos = await this.tmdbRepo.getMovieVideos(movie.id);
          const trailer = videos.find((v) => v.isTrailer());

          if (trailer) {
            const isPublic = await this.youtubeRepo.getVideoStatus(trailer.key);
            if (isPublic) {
              return movie.withVideo(trailer.key);
            }
          }
          return movie;
        } catch (error) {
          console.error(
            `予告編の取得に失敗しました (movieId: ${movie.id}):`,
            error,
          );
          return movie;
        }
      }),
    );

    return new MovieList(enrichedMovies);
  }
}
