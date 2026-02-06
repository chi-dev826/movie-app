import { ITmdbRepository } from "@/domain/repositories/tmdb.repository.interface";
import { ICacheRepository } from "@/domain/repositories/cache.repository.interface";
import { MovieFactory } from "@/domain/factories/movie.factory";
import { MovieEntity } from "@/domain/models/movie";
import { MovieDetailEntity } from "@/domain/models/movieDetail";
import { CollectionEntity } from "@/domain/models/collection";
import { Video } from "@/domain/models/video";
import { tmdbApi } from "@/infrastructure/lib/tmdb.client";
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
} from "@shared/types/external/tmdb";

export class TmdbRepository implements ITmdbRepository {
  constructor(
    private readonly cache: ICacheRepository,
    private readonly api: typeof tmdbApi = tmdbApi,
  ) {}

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
    const response = await this.api.get<MovieDetailResponse>(
      `/movie/${movieId}`,
      {
        params: {
          append_to_response: "credits",
        },
      },
    );
    return MovieFactory.createFromDetailResponse(response.data);
  }

  async getMovieVideos(movieId: number): Promise<Video[]> {
    const response = await this.api.get<DefaultResponse<VideoItem>>(
      `/movie/${movieId}/videos`,
    );
    return response.data.results.map((item) => MovieFactory.createVideo(item));
  }

  async getMovieImages(movieId: number): Promise<string | null> {
    const response = await this.api.get<ImageResponse>(
      `/movie/${movieId}/images`,
    );
    return response.data.logos?.[0]?.file_path ?? null;
  }

  async getMovieWatchProviders(
    movieId: number,
  ): Promise<{ logo_path: string | null; name: string }[]> {
    const response = await this.api.get<MovieWatchProvidersResponse>(
      `/movie/${movieId}/watch/providers`,
    );
    return MovieFactory.createWatchProviders(response.data);
  }

  async getSimilarMovies(movieId: number, page = 1): Promise<MovieEntity[]> {
    const response = await this.api.get<PaginatedResponse<MovieResponse>>(
      `/movie/${movieId}/similar`,
      {
        params: { page },
      },
    );
    return response.data.results.map((movie) =>
      MovieFactory.createFromApiResponse(movie),
    );
  }

  async getCollection(collectionId: number): Promise<CollectionEntity> {
    const response = await this.api.get<CollectionResponse>(
      `/collection/${collectionId}`,
    );
    const parts = response.data.parts.map((part) =>
      MovieFactory.createFromApiResponse(part),
    );
    return new CollectionEntity(response.data.id, response.data.name, parts);
  }

  async getDiscoverMovies(params: DiscoverMovieParams): Promise<MovieEntity[]> {
    const cacheKey = `discover:${JSON.stringify(params)}`;
    const cached = this.cache.get<MovieResponse[]>(cacheKey);

    if (cached) {
      return cached.map((movie) => MovieFactory.createFromApiResponse(movie));
    }

    const response = await this.api.get<PaginatedResponse<MovieResponse>>(
      "/discover/movie",
      {
        params,
      },
    );

    this.cache.set(cacheKey, response.data.results, 3600); // 1時間キャッシュ

    return response.data.results.map((movie) =>
      MovieFactory.createFromApiResponse(movie),
    );
  }

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
    const cacheKey = `now_playing:${JSON.stringify(params)}`;
    const cached = this.cache.get<MovieResponse[]>(cacheKey);

    if (cached) {
      return cached.map((movie) => MovieFactory.createFromApiResponse(movie));
    }

    const response = await this.api.get<PaginatedResponse<MovieResponse>>(
      "/movie/now_playing",
      {
        params: params,
      },
    );

    this.cache.set(cacheKey, response.data.results, 3600);

    return response.data.results.map((movie) =>
      MovieFactory.createFromApiResponse(movie),
    );
  }
}
