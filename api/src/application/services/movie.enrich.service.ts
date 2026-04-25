import { ITmdbRepository } from "../../domain/repositories/tmdb.repository.interface";
import { IYoutubeRepository } from "../../domain/repositories/youtube.repository.interface";
import { VIDEO_TYPE } from "../../domain/constants/video";
import { Video } from "../../domain/models/video";

/**
 * UI表示等に必要な補助データ（動画、ロゴなど）を独立して取得するアプリケーションサービス
 */
export class MovieEnrichService {
  constructor(
    private readonly tmdbRepo: ITmdbRepository,
    private readonly youtubeRepo: IYoutubeRepository,
  ) {}

  /**
   * 対象の映画IDリストに対して並行して予告編動画を取得し、IDをキーとしたMapを返す
   */
  async getTrailers(
    movieIds: readonly number[],
  ): Promise<Map<number, string | null>> {
    const moviesVideosMap = new Map<number, Video[]>();
    await Promise.all(
      movieIds.map(async (id) => {
        const videos = await this.tmdbRepo.getMovieVideos(id);
        moviesVideosMap.set(id, videos);
      }),
    );

    const allkeys = [...moviesVideosMap.values()]
      .flat()
      .map((video) => video.getKey());
    const publicKeys = new Set(
      await this.youtubeRepo.getPublicVideoKeys(allkeys),
    );

    const results = new Map<number, string | null>();
    moviesVideosMap.forEach((videos, movieId) => {
      const publicVideos = videos.filter((video) =>
        publicKeys.has(video.getKey()),
      );
      const trailer = publicVideos.find(
        (v) => v.getType() === VIDEO_TYPE.TRAILER,
      );
      const teaser = publicVideos.find(
        (v) => v.getType() === VIDEO_TYPE.TEASER,
      );
      const mainVideoKey = (trailer || teaser)?.getKey() ?? null;
      results.set(movieId, mainVideoKey);
    });

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
   * ヒーローセクション用に Trailer を最優先し、
   * その他を最大3件取得する。
   */
  async getDetailedVideos(
    movieId: number,
  ): Promise<{ video: string | null; otherVideos: string[] }> {
    const allVideos = await this.tmdbRepo.getMovieVideos(movieId);

    // 1.Youtubeでの公開ステータスチェック
    const keys = allVideos.map((video) => video.getKey());
    const publicKeys = new Set(await this.youtubeRepo.getPublicVideoKeys(keys));
    const publicVideos = allVideos.filter((video) =>
      publicKeys.has(video.getKey()),
    );

    // 2. Trailerを最優先し、なければTeaserを探す
    const trailer = publicVideos.find(
      (v) => v.getType() === VIDEO_TYPE.TRAILER,
    );
    const teaser = publicVideos.find((v) => v.getType() === VIDEO_TYPE.TEASER);
    const mainVideoKey = (trailer || teaser)?.getKey() ?? null;

    // 3. その他を最大3件取得
    const otherVideos = publicVideos
      .filter((v) => v.getKey() !== mainVideoKey)
      .slice(0, 3)
      .map((v) => v.getKey());

    return { video: mainVideoKey, otherVideos };
  }
}
