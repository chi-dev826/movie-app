import { ITmdbRepository } from "../../domain/repositories/tmdb.repository.interface";
import { ICacheRepository } from "../../domain/repositories/cache.repository.interface";
import { MovieFactory } from "../../domain/factories/movie.factory";
import { CollectionFactory } from "../../domain/factories/collection.factory";
import { MovieEntity } from "../../domain/models/movie";
import { MovieDetailEntity } from "../../domain/models/movieDetail";
import { CollectionEntity } from "../../domain/models/collection";
import { Video } from "../../domain/models/video";
import { CACHE_TTL } from "../constants/cacheTtl";
import { tmdbApi } from "../lib/tmdb.client";
import {
  MovieDetailResponse,
  MovieResponse,
  ImageResponse,
  PaginatedResponse,
  CollectionResponse,
  MovieWatchProvidersResponse,
  DefaultResponse,
  VideoItem,
  DiscoverMovieParams,
  PersonResponse,
  TrendingMovieResponse,
  SORT_OPTIONS,
  RELEASE_TYPE,
} from "../external/tmdb";
import { IClock } from "../../domain/repositories/clock.service.interface";
import { ArrayUtils } from "../../utils/array";

/** リポジトリ内部で使用するTMDB固有の設定値 */
const TMDB_DEFAULTS = {
  REGION: "JP",
  LANGUAGE: "ja",
  UPCOMING_MONTHS: 2,
  FILTERS: {
    MIN_VOTE_COUNT: 10,
    RECENT_VOTE_COUNT: 1000,
  },
} as const;

export class TmdbRepository implements ITmdbRepository {
  constructor(
    private readonly cache: ICacheRepository,
    private readonly clock: IClock,
    private readonly api: typeof tmdbApi = tmdbApi,
  ) {}

  // ──────────────────────────────────────────
  // 基本取得
  // ──────────────────────────────────────────

  async getMovieDetails(movieId: number): Promise<MovieDetailEntity> {
    const rawData = await this.cache.getOrSet(
      `tmdb:movie:${movieId}:details:raw`,
      async () => {
        const response = await this.api.get<MovieDetailResponse>(
          `/movie/${movieId}`,
          { params: { append_to_response: "credits" } },
        );
        return response.data;
      },
      CACHE_TTL.STANDARD,
    );
    return MovieFactory.createFromDetailResponse(rawData);
  }

  async getCollection(collectionId: number): Promise<CollectionEntity> {
    const rawData = await this.cache.getOrSet(
      `tmdb:collection:${collectionId}:raw`,
      async () => {
        const response = await this.api.get<CollectionResponse>(
          `/collection/${collectionId}`,
        );
        return response.data;
      },
      CACHE_TTL.STANDARD,
    );
    return CollectionFactory.createFromApiResponse(rawData);
  }

  // ──────────────────────────────────────────
  // 検索
  // ──────────────────────────────────────────

  /**
   * キーワード検索はユーザー入力に依存し揮発性が高いため、キャッシュ対象外とする
   */
  async searchMovies(query: string): Promise<MovieEntity[]> {
    const response = await this.api.get<PaginatedResponse<MovieResponse>>(
      "/search/movie",
      { params: { query } },
    );
    return response.data.results.map((movie) =>
      MovieFactory.createFromApiResponse(movie),
    );
  }

  /**
   * 人物名から最も関連性の高い人物IDを特定する。
   * TMDB の searchPerson は関連度順で返却されるため、先頭を最適な候補として採用する。
   */
  async findPersonIdByName(query: string): Promise<number | null> {
    const response = await this.api.get<PaginatedResponse<PersonResponse>>(
      "/search/person",
      { params: { query } },
    );
    const results = response.data.results;
    return results.length > 0 ? results[0].id : null;
  }

  // ──────────────────────────────────────────
  // 特化型検索（旧 Discover/汎用メソッドの分割先）
  // ──────────────────────────────────────────

  /**
   * 近日公開予定の映画を取得する。
   * 検索期間・リリースタイプ等のAPIパラメータはすべてリポジトリ内部で構築する。
   * @param page 取得するページ数（1から指定ページまですべて取得）
   * @param months 検索対象の月数（デフォルト: 2）
   */
  async findUpcomingMovies(
    page: number,
    months: number = TMDB_DEFAULTS.UPCOMING_MONTHS,
  ): Promise<{
    movies: MovieEntity[];
    currentPage: number;
    totalPages: number;
  }> {
    const periodParams = this.buildUpcomingPeriodParams(months);
    const baseParams: DiscoverMovieParams = {
      region: TMDB_DEFAULTS.REGION,
      watch_region: TMDB_DEFAULTS.REGION,
      sort_by: SORT_OPTIONS.POPULARITY_DESC,
      include_adult: false,
      include_video: false,
      with_release_type: `${RELEASE_TYPE.THEATRICAL}|${RELEASE_TYPE.THEATRICAL_LIMITED}`,
      ...periodParams,
    };

    // 1ページ目から指定されたページまでを並列取得
    const pageNumbers = ArrayUtils.range(page);
    const rawDataArray = await Promise.all(
      pageNumbers.map((p) => {
        const params = { ...baseParams, page: p };
        return this.cache.getOrSet(
          `tmdb:upcoming:raw:${JSON.stringify(params)}`,
          async () => {
            const response = await this.api.get<
              PaginatedResponse<MovieResponse>
            >("/discover/movie", { params });
            return response.data;
          },
          CACHE_TTL.UPCOMING,
        );
      }),
    );

    // 全ページの映画をマージして重複排除
    const allMovies = rawDataArray.flatMap((data) => data.results);
    const movies = ArrayUtils.deduplicate(allMovies);
    return {
      movies: movies.map((movie) => MovieFactory.createFromApiResponse(movie)),
      currentPage: rawDataArray[0].page,
      totalPages: rawDataArray[0].total_pages,
    };
  }

  /** 現在上映中の映画を取得する */
  async findNowPlayingMovies(page: number): Promise<{
    movies: MovieEntity[];
    currentPage: number;
    totalPages: number;
  }> {
    const rawData = await this.cache.getOrSet(
      `tmdb:now_playing:raw:${page}`,
      async () => {
        const response = await this.api.get<PaginatedResponse<MovieResponse>>(
          "/movie/now_playing",
          {
            params: {
              page,
              language: TMDB_DEFAULTS.LANGUAGE,
              region: TMDB_DEFAULTS.REGION,
            },
          },
        );
        return response.data;
      },
      CACHE_TTL.SHORT,
    );
    return {
      movies: rawData.results.map((movie) =>
        MovieFactory.createFromApiResponse(movie),
      ),
      currentPage: rawData.page,
      totalPages: rawData.total_pages,
    };
  }

  /** トレンド映画をページ単位で取得する */
  async findTrendingMovies(page: number): Promise<{
    movies: MovieEntity[];
    currentPage: number;
    totalPages: number;
  }> {
    const rawData = await this.cache.getOrSet(
      `tmdb:trending:raw:${page}`,
      async () => {
        const response = await this.api.get<
          PaginatedResponse<TrendingMovieResponse>
        >("/trending/movie/week", {
          params: {
            page,
            language: TMDB_DEFAULTS.LANGUAGE,
            region: TMDB_DEFAULTS.REGION,
          },
        });
        return response.data;
      },
      CACHE_TTL.SHORT,
    );

    return {
      movies: rawData.results.map((movie) =>
        MovieFactory.createFromTrendingResponse(movie),
      ),
      currentPage: rawData.page,
      totalPages: rawData.total_pages,
    };
  }

  /** 特定の出演者が関わった映画を取得する */
  async findMoviesByCastId(personId: number): Promise<MovieEntity[]> {
    const params: DiscoverMovieParams = {
      sort_by: SORT_OPTIONS.POPULARITY_DESC,
      region: TMDB_DEFAULTS.REGION,
      "vote_count.gte": TMDB_DEFAULTS.FILTERS.MIN_VOTE_COUNT,
      with_cast: String(personId),
    };

    const res = await this.discoverMovies(params);
    return res.movies;
  }

  /** 最近追加された人気映画を取得する */
  async findRecentlyAddedMovies(page: number): Promise<{
    movies: MovieEntity[];
    currentPage: number;
    totalPages: number;
  }> {
    const params: DiscoverMovieParams = {
      page,
      "vote_count.gte": TMDB_DEFAULTS.FILTERS.RECENT_VOTE_COUNT,
      sort_by: SORT_OPTIONS.PRIMARY_RELEASE_DATE_DESC,
      region: TMDB_DEFAULTS.REGION,
    };

    return this.discoverMovies(params);
  }

  // ──────────────────────────────────────────
  // 補助データ
  // ──────────────────────────────────────────

  /**
   * 補助データ: 取得失敗時は空配列を返し、上位層の処理を中断させない
   */
  async getMovieVideos(movieId: number): Promise<Video[]> {
    try {
      const rawData = await this.cache.getOrSet(
        `tmdb:movie:${movieId}:videos:raw`,
        async () => {
          const response = await this.api.get<DefaultResponse<VideoItem>>(
            `/movie/${movieId}/videos`,
          );
          return response.data.results;
        },
        CACHE_TTL.STANDARD,
      );
      return rawData.map((item) => MovieFactory.createVideo(item));
    } catch (error) {
      console.error(
        `動画情報の取得に失敗しました (movieId: ${movieId}):`,
        error,
      );
      return [];
    }
  }

  /**
   * 補助データ: 取得失敗時は空配列を返し、上位層の処理を中断させない
   */
  async getMovieWatchProviders(
    movieId: number,
  ): Promise<{ logoPath: string | null; name: string }[]> {
    try {
      const rawData = await this.cache.getOrSet(
        `tmdb:movie:${movieId}:watch_providers:raw`,
        async () => {
          const response = await this.api.get<MovieWatchProvidersResponse>(
            `/movie/${movieId}/watch/providers`,
          );
          return response.data;
        },
        CACHE_TTL.STANDARD,
      );
      return MovieFactory.createWatchProviders(rawData);
    } catch (error) {
      console.error(
        `配信情報の取得に失敗しました (movieId: ${movieId}):`,
        error,
      );
      return [];
    }
  }

  /**
   * 補助データ: 取得失敗時は空配列を返し、上位層の処理を中断させない
   */
  async getRecommendedMovies(
    movieId: number,
    page = 1,
  ): Promise<MovieEntity[]> {
    try {
      const rawData = await this.cache.getOrSet(
        `tmdb:movie:${movieId}:recommendations:raw:${page}`,
        async () => {
          const response = await this.api.get<PaginatedResponse<MovieResponse>>(
            `/movie/${movieId}/recommendations`,
            { params: { page } },
          );
          return response.data.results;
        },
        CACHE_TTL.STANDARD,
      );
      return rawData.map((movie) => MovieFactory.createFromApiResponse(movie));
    } catch (error) {
      console.error(
        `類似映画の取得に失敗しました (movieId: ${movieId}):`,
        error,
      );
      return [];
    }
  }

  // ──────────────────────────────────────────
  // 内部ヘルパー（外部APIの詳細をカプセル化）
  // ──────────────────────────────────────────

  /**
   * Discover API の共通呼び出しロジック。
   * 外部APIの具体的なパラメータ構造はこのメソッド内に閉じ込める。
   */
  private async discoverMovies(params: DiscoverMovieParams): Promise<{
    movies: MovieEntity[];
    currentPage: number;
    totalPages: number;
  }> {
    const rawData = await this.cache.getOrSet(
      `tmdb:discover:raw:${JSON.stringify(params)}`,
      async () => {
        const response = await this.api.get<PaginatedResponse<MovieResponse>>(
          "/discover/movie",
          { params },
        );
        return response.data;
      },
      CACHE_TTL.SHORT,
    );
    return {
      movies: rawData.results.map((movie) =>
        MovieFactory.createFromApiResponse(movie),
      ),
      currentPage: rawData.page,
      totalPages: rawData.total_pages,
    };
  }

  /**
   * 近日公開映画の検索期間パラメータを構築する。
   * JST基準で「今日」から「N月後」までの期間を算出する。
   */
  private buildUpcomingPeriodParams(
    months: number,
  ): Pick<
    DiscoverMovieParams,
    "primary_release_date.gte" | "primary_release_date.lte"
  > {
    const now = this.clock.now();
    const jstTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const today = new Date(
      Date.UTC(
        jstTime.getUTCFullYear(),
        jstTime.getUTCMonth(),
        jstTime.getUTCDate(),
      ),
    );
    const endDate = new Date(today);
    endDate.setUTCMonth(today.getUTCMonth() + months);

    const formatDate = (d: Date) => {
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, "0");
      const day = String(d.getUTCDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };

    return {
      "primary_release_date.gte": formatDate(today),
      "primary_release_date.lte": formatDate(endDate),
    };
  }
}
