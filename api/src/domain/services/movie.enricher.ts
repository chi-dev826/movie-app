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
   *
   * getMovieImages はリポジトリ契約により取得失敗時も null を返すため、
   * Promise.all で安全に並行取得できる
   */
  async enrichWithLogos(
    movies: readonly MovieEntity[],
  ): Promise<MovieEntity[]> {
    const results = await Promise.all(
      movies.map((movie) => this.tmdbRepo.getMovieImages(movie.id)),
    );

    return movies.map((movie, index) => {
      const logoPath = results[index];
      return logoPath ? movie.withLogo(logoPath) : movie;
    });
  }

  /**
   * リスト内の映画に対して並行して予告編を取得・設定し、新しいリストを返す
   *
   * 依存する全メソッドがリポジトリ契約により例外を投げないため、
   * Promise.all で安全に並行取得できる:
   * - getMovieVideos: 取得失敗時は空配列を返す
   * - getVideoStatus: 通信失敗時は false（非公開扱い）を返す
   */
  async enrichWithTrailers(
    movies: readonly MovieEntity[],
  ): Promise<MovieEntity[]> {
    const results = await Promise.all(
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

    return results;
  }
}
