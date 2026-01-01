import { Movie, MovieDetail } from "../../../shared/types/domain";
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
} from "../../../shared/types/external/tmdb";
import { tmdbApi } from "../lib/tmdb.client";
import { MovieFormatter } from "./tmdb.formatter";

export class TmdbRepository {
  private readonly api: typeof tmdbApi;
  private readonly formatter: MovieFormatter;

  constructor(
    apiInstance: typeof tmdbApi = tmdbApi,
    formatter: MovieFormatter = new MovieFormatter(),
  ) {
    this.api = apiInstance;
    this.formatter = formatter;
  }

  async searchPerson(query: string): Promise<PaginatedResponse<PersonResponse>> {
    const response = await this.api.get<PaginatedResponse<PersonResponse>>(
      "/search/person",
      { params: { query } },
    );
    return response.data;
  }

  async getMovieDetails(movieId: number): Promise<MovieDetail> {
    const response = await this.api.get<MovieDetailResponse>(
      `/movie/${movieId}`,
      {
        params: {
          append_to_response: "credits",
        },
      },
    );
    return this.formatter.formatDetail(response.data);
  }

  async getMovieVideos(movieId: number): Promise<VideoItem[]> {
    const response = await this.api.get<DefaultResponse<VideoItem>>(
      `/movie/${movieId}/videos`,
    );
    return response.data.results;
  }

  async getMovieImages(movieId: number): Promise<string | null> {
    const response = await this.api.get<ImageResponse>(
      `/movie/${movieId}/images`,
    );
    return this.formatter.formatImage(response.data);
  }

  async getMovieWatchProviders(
    movieId: number,
  ): Promise<{ logo_path: string | null; name: string }[]> {
    const response = await this.api.get<MovieWatchProvidersResponse>(
      `/movie/${movieId}/watch/providers`,
    );
    return this.formatter.formatWatchProviders(response.data);
  }

  async getSimilarMovies(
    movieId: number,
    page = 1,
  ): Promise<PaginatedResponse<Movie>> {
    const response = await this.api.get<PaginatedResponse<MovieResponse>>(
      `/movie/${movieId}/similar`,
      {
        params: { page },
      },
    );
    return {
      ...response.data,
      results: response.data.results.map((movie) =>
        this.formatter.formatMovie(movie),
      ),
    };
  }

  async getCollectionDetails(
    collectionId: number,
  ): Promise<CollectionResponse> {
    const response = await this.api.get<CollectionResponse>(
      `/collection/${collectionId}`,
    );
    return response.data;
  }

  async getDiscoverMovies(
    params: DiscoverMovieParams,
  ): Promise<PaginatedResponse<Movie>> {
    const response = await this.api.get<PaginatedResponse<MovieResponse>>(
      "/discover/movie",
      {
        params,
      },
    );
    return {
      ...response.data,
      results: response.data.results.map((movie) =>
        this.formatter.formatMovie(movie),
      ),
    };
  }

  async searchMovies(params: {
    query: string;
  }): Promise<PaginatedResponse<Movie>> {
    const response = await this.api.get<PaginatedResponse<MovieResponse>>(
      "/search/movie",
      { params },
    );
    return {
      ...response.data,
      results: response.data.results.map((movie) =>
        this.formatter.formatMovie(movie),
      ),
    };
  }

  async getNowPlayingMovies(params: {
    page: number;
    language: string;
    region: string;
  }): Promise<PaginatedResponse<Movie>> {
    const response = await this.api.get<PaginatedResponse<MovieResponse>>(
      "/movie/now_playing",
      {
        params: params,
      },
    );
    return {
      ...response.data,
      results: response.data.results.map((movie) =>
        this.formatter.formatMovie(movie),
      ),
    };
  }
}
