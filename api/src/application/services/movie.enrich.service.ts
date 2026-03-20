import { ITmdbRepository } from "../../domain/repositories/tmdb.repository.interface";
import { IYoutubeRepository } from "../../domain/repositories/youtube.repository.interface";

/**
 * UI表示等に必要な補助データ（動画、ロゴなど）を独立して取得するアプリケーションサービス
 */
export class MovieEnrichService {
  constructor(
    private readonly tmdbRepo: ITmdbRepository,
    private readonly youtubeRepo: IYoutubeRepository,
  ) {}

  /**
   * 対象の映画IDリストに対して並行してロゴ画像を取得し、IDをキーとしたMapを返す
   */
  async getLogos(movieIds: readonly number[]): Promise<Map<number, string>> {
    const results = new Map<number, string>();
    const promises = movieIds.map(async (id) => {
      const logoPath = await this.tmdbRepo.getMovieImages(id);
      if (logoPath) {
        results.set(id, logoPath);
      }
    });
    await Promise.all(promises);
    return results;
  }

  /**
   * 単一映画IDのロゴ画像を取得する。
   * 実装上はバルクAPI（getLogos）をラップすることで、
   * 外部APIへのアクセス戦略（レート制限対応・並列数制御など）を
   * getLogos に集約できるようにしている。
   */
  async getLogo(movieId: number): Promise<string | null> {
    const results = await this.getLogos([movieId]);
    return results.get(movieId) ?? null;
  }

  /**
   * 対象の映画IDリストに対して並行して予告編を取得し、IDをキーとしたMapを返す
   */
  async getTrailers(movieIds: readonly number[]): Promise<Map<number, string>> {
    const results = new Map<number, string>();
    const promises = movieIds.map(async (id) => {
      const videos = await this.tmdbRepo.getMovieVideos(id);
      const videoKey = videos.find((v) => v.isTrailer())?.getKey();

      if (videoKey) {
        const isPublic = await this.youtubeRepo.getVideoStatus(videoKey);
        if (isPublic) {
          results.set(id, videoKey);
        }
      }
    });

    await Promise.all(promises);
    return results;
  }

  /**
   * 単一映画IDの予告編動画キーを取得する。
   * 実装上はバルクAPI（getTrailers）をラップすることで、
   * 外部APIへのアクセス戦略（レート制限対応・並列数制御など）を
   * getTrailers に集約できるようにしている。
   */
  async getTrailer(movieId: number): Promise<string | null> {
    const results = await this.getTrailers([movieId]);
    return results.get(movieId) ?? null;
  }
}
