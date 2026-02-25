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

  async getMovieVideos(movieId: number): Promise<Video[]> {
    return this.cache.getOrSet(
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
  }

  async getMovieImages(movieId: number): Promise<string | null> {
    return this.cache.getOrSet(
      `tmdb:movie:${movieId}:images`,
      async () => {
        const response = await this.api.get<ImageResponse>(
          `/movie/${movieId}/images`,
        );
        return response.data.logos?.[0]?.file_path ?? null;
      },
      CACHE_TTL.STANDARD,
    );
  }

  async getMovieWatchProviders(
    movieId: number,
  ): Promise<{ logo_path: string | null; name: string }[]> {
    return this.cache.getOrSet(
      `tmdb:movie:${movieId}:watch_providers`,
      async () => {
        const response = await this.api.get<MovieWatchProvidersResponse>(
          `/movie/${movieId}/watch/providers`,
        );
        return MovieFactory.createWatchProviders(response.data);
      },
      CACHE_TTL.STANDARD,
    );
  }

  async getSimilarMovies(movieId: number, page = 1): Promise<MovieEntity[]> {
    return this.cache.getOrSet(
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
