import { ITmdbRepository } from "../../domain/repositories/tmdb.repository.interface";
import { ICacheRepository } from "../../domain/repositories/cache.repository.interface";
import { MovieFactory } from "../../domain/factories/movie.factory";
import { CollectionFactory } from "../../domain/factories/collection.factory";
import { MovieEntity } from "../../domain/models/movie";
import { MovieDetailEntity } from "../../domain/models/movieDetail";
import { CollectionEntity } from "../../domain/models/collection";
import { Video } from "../../domain/models/video";
import { CACHE_TTL } from "../../domain/constants/cacheTtl";
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
} from "../../../../shared/types/external/tmdb";

export class TmdbRepository implements ITmdbRepository {
  constructor(
    private readonly cache: ICacheRepository,
    private readonly api: typeof tmdbApi = tmdbApi,
  ) {}

  /**
   * 人物名検索はユーザー入力に依存し揮発性が高いため、キャッシュ対象外とする
   */
  async searchPerson(
    query: string,
  ): Promise<PaginatedResponse<PersonResponse>> {
    const response = await this.api.get<PaginatedResponse<PersonResponse>>(
      "/search/person",
      { params: { query } },
    );
    return response.data;
  }

  async getMovieDetails(movieId: number): Promise<MovieDetailEntity> {
    return this.cache.getOrSet(
      `tmdb:movie:${movieId}:details`,
      async () => {
        const response = await this.api.get<MovieDetailResponse>(
          `/movie/${movieId}`,
          { params: { append_to_response: "credits" } },
        );
        return MovieFactory.createFromDetailResponse(response.data);
      },
      CACHE_TTL.STANDARD,
    );
  }

  /**
   * 補助データ: 取得失敗時は空配列を返し、上位層の処理を中断させない
   */
  async getMovieVideos(movieId: number): Promise<Video[]> {
    try {
      return await this.cache.getOrSet(
        `tmdb:movie:${movieId}:videos`,
        async () => {
          const response = await this.api.get<DefaultResponse<VideoItem>>(
            `/movie/${movieId}/videos`,
          );
          return response.data.results.map((item) =>
            MovieFactory.createVideo(item),
          );
        },
        CACHE_TTL.STANDARD,
      );
    } catch (error) {
      console.error(
        `動画情報の取得に失敗しました (movieId: ${movieId}):`,
        error,
      );
      return [];
    }
  }

  /**
   * 補助データ: 取得失敗時は null を返し、上位層の処理を中断させない
   */
  async getMovieImages(movieId: number): Promise<string | null> {
    try {
      return await this.cache.getOrSet(
        `tmdb:movie:${movieId}:images`,
        async () => {
          const response = await this.api.get<ImageResponse>(
            `/movie/${movieId}/images`,
          );
          return response.data.logos?.[0]?.file_path ?? null;
        },
        CACHE_TTL.STANDARD,
      );
    } catch (error) {
      console.error(
        `画像情報の取得に失敗しました (movieId: ${movieId}):`,
        error,
      );
      return null;
    }
  }

  /**
   * 補助データ: 取得失敗時は空配列を返し、上位層の処理を中断させない
   */
  async getMovieWatchProviders(
    movieId: number,
  ): Promise<{ logo_path: string | null; name: string }[]> {
    try {
      return await this.cache.getOrSet(
        `tmdb:movie:${movieId}:watch_providers`,
        async () => {
          const response = await this.api.get<MovieWatchProvidersResponse>(
            `/movie/${movieId}/watch/providers`,
          );
          return MovieFactory.createWatchProviders(response.data);
        },
        CACHE_TTL.STANDARD,
      );
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
  async getSimilarMovies(movieId: number, page = 1): Promise<MovieEntity[]> {
    try {
      return await this.cache.getOrSet(
        `tmdb:movie:${movieId}:similar:${page}`,
        async () => {
          const response = await this.api.get<PaginatedResponse<MovieResponse>>(
            `/movie/${movieId}/similar`,
            { params: { page } },
          );
          return response.data.results.map((movie) =>
            MovieFactory.createFromApiResponse(movie),
          );
        },
        CACHE_TTL.STANDARD,
      );
    } catch (error) {
      console.error(
        `類似映画の取得に失敗しました (movieId: ${movieId}):`,
        error,
      );
      return [];
    }
  }

  async getCollection(collectionId: number): Promise<CollectionEntity> {
    return this.cache.getOrSet(
      `tmdb:collection:${collectionId}`,
      async () => {
        const response = await this.api.get<CollectionResponse>(
          `/collection/${collectionId}`,
        );
        return CollectionFactory.createFromApiResponse(response.data);
      },
      CACHE_TTL.STANDARD,
    );
  }

  async getDiscoverMovies(params: DiscoverMovieParams): Promise<MovieEntity[]> {
    return this.cache.getOrSet(
      `tmdb:discover:${JSON.stringify(params)}`,
      async () => {
        const response = await this.api.get<PaginatedResponse<MovieResponse>>(
          "/discover/movie",
          { params },
        );
        return response.data.results.map((movie) =>
          MovieFactory.createFromApiResponse(movie),
        );
      },
      CACHE_TTL.SHORT,
    );
  }

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

  async getNowPlayingMovies(params: {
    page: number;
    language: string;
    region: string;
  }): Promise<MovieEntity[]> {
    return this.cache.getOrSet(
      `tmdb:now_playing:${JSON.stringify(params)}`,
      async () => {
        const response = await this.api.get<PaginatedResponse<MovieResponse>>(
          "/movie/now_playing",
          { params },
        );
        return response.data.results.map((movie) =>
          MovieFactory.createFromApiResponse(movie),
        );
      },
      CACHE_TTL.SHORT,
    );
  }
}
