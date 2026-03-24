import { MovieEntity } from "../models/movie";
import { MovieDetailEntity } from "../models/movieDetail";
import { CollectionEntity } from "../models/collection";
import { Video } from "../models/video";

export interface ITmdbRepository {
  /** 映画の詳細情報を取得する */
  getMovieDetails(movieId: number): Promise<MovieDetailEntity>;

  /** 映画のコレクション（シリーズ）情報を取得する */
  getCollection(collectionId: number): Promise<CollectionEntity>;

  /** キーワードで映画を検索する */
  searchMovies(query: string): Promise<MovieEntity[]>;

  /**
   * 人物名から最も関連性の高い人物IDを特定する
   * @returns 該当人物のID。見つからない場合は null
   */
  findPersonIdByName(query: string): Promise<number | null>;

  /** 近日公開予定の映画を取得する（地域・期間はリポジトリ内部で決定） */
  findUpcomingMovies(page: number): Promise<MovieEntity[]>;

  /** 現在上映中の映画を取得する（地域・言語はリポジトリ内部で決定） */
  findNowPlayingMovies(page: number): Promise<MovieEntity[]>;

  /** トレンド映画を取得する（地域・言語はリポジトリ内部で決定） */
  findTrendingMovies(page: number): Promise<MovieEntity[]>;

  /** 特定の出演者が関わった映画を取得する */
  findMoviesByCastId(personId: number): Promise<MovieEntity[]>;

  /** 最近追加された人気映画を取得する */
  findRecentlyAddedMovies(page: number): Promise<MovieEntity[]>;

  /** 補助データ: 映画の動画情報を取得する */
  getMovieVideos(movieId: number): Promise<Video[]>;

  /** 補助データ: 映画のロゴ画像パスを取得する */
  getMovieImages(movieId: number): Promise<string | null>;

  /** 補助データ: 映画の配信情報を取得する */
  getMovieWatchProviders(
    movieId: number,
  ): Promise<{ logoPath: string | null; name: string }[]>;

  /** 補助データ: 類似映画を取得する */
  getSimilarMovies(movieId: number, page?: number): Promise<MovieEntity[]>;
}
