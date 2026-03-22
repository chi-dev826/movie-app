import { ITmdbRepository } from "../../domain/repositories/tmdb.repository.interface";
import { IYoutubeRepository } from "../../domain/repositories/youtube.repository.interface";
import { VIDEO_TYPE } from "../../domain/constants/video";

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

      // Trailerを優先し、なければTeaserを探す
      const trailer = videos.find((v) => v.getType() === VIDEO_TYPE.TRAILER);
      const teaser = videos.find((v) => v.getType() === VIDEO_TYPE.TEASER);
      const videoKey = (trailer || teaser)?.getKey();

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

  /**
   * 単一映画の詳細な動画情報を取得する。
   * ヒーローセクション用に Teaser を最優先し、
   * その他の Trailer を最大3件取得する。
   */
  async getDetailedVideos(
    movieId: number,
  ): Promise<{ video: string | null; otherVideos: string[] }> {
    const allVideos = await this.tmdbRepo.getMovieVideos(movieId);

    // 候補：Teaserを最優先、次にTrailers
    const teaser = allVideos.find((v) => v.getType() === VIDEO_TYPE.TEASER);
    const trailers = allVideos.filter(
      (v) => v.getType() === VIDEO_TYPE.TRAILER,
    );

    const candidates = [...(teaser ? [teaser] : []), ...trailers];

    let mainVideoKey: string | null = null;
    let selectedIndex = -1;

    // 公開済みのメイン動画を決定
    for (let i = 0; i < candidates.length; i++) {
      const key = candidates[i].getKey();
      if (await this.youtubeRepo.getVideoStatus(key)) {
        mainVideoKey = key;
        selectedIndex = i;
        break;
      }
    }

    // その他の動画（メイン以外から最大3件）
    const otherVideos: string[] = [];
    const otherCandidates = allVideos.filter(
      (v) => v.getType() === VIDEO_TYPE.TRAILER && v.getKey() !== mainVideoKey,
    );

    for (const v of otherCandidates) {
      if (otherVideos.length >= 3) break;
      const key = v.getKey();
      if (await this.youtubeRepo.getVideoStatus(key)) {
        otherVideos.push(key);
      }
    }

    return { video: mainVideoKey, otherVideos };
  }
}
