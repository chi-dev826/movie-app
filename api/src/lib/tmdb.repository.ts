import axios from "axios";
import dotenv from "dotenv";
import path from "path";

import { MovieDetailResponse, MovieResponse } from "@/types/external/tmdb";
import { VideoItem } from "@/types/external/tmdb";
import { ImageResponse } from "@/types/external/tmdb";
import { CollectionResponse } from "@/types/external/tmdb";
import {
  PaginatedResponse,
  DefaultResponse,
  MovieWatchProvidersResponse,
} from "@/types/external/tmdb";
import { DiscoverMovieParams } from "@/types/external/tmdb";
import { EXTERNAL_API_URLS } from "../../constants/external";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const API_KEY = process.env.VITE_TMDB_API_KEY;
if (!API_KEY) {
  console.error(
    "TMDB APIキーが設定されていません。.envファイルを確認してください。",
  );
}
const API_BASE_URL = EXTERNAL_API_URLS.TMDB;

export const tmdbApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    Accept: "application/json",
    "Cache-Control": "no-cache",
  },
  params: {
    language: "ja-JP",
    include_adult: false,
  },
});

export class TmdbRepository {
  private readonly api: typeof tmdbApi;

  constructor(apiInstance: typeof tmdbApi = tmdbApi) {
    this.api = apiInstance;
  }

  async getMovieDetails(movieId: number): Promise<MovieDetailResponse> {
    const response = await this.api.get<MovieDetailResponse>(
      `/movie/${movieId}`,
    );
    return response.data;
  }

  async getMovieVideos(movieId: number): Promise<DefaultResponse<VideoItem>> {
    const response = await this.api.get<DefaultResponse<VideoItem>>(
      `/movie/${movieId}/videos`,
    );
    return response.data;
  }

  async getMovieImages(movieId: number): Promise<ImageResponse> {
    const response = await this.api.get<ImageResponse>(
      `/movie/${movieId}/images`,
    );
    return response.data;
  }

  async getMovieWatchProviders(
    movieId: number,
  ): Promise<MovieWatchProvidersResponse> {
    const response = await this.api.get<MovieWatchProvidersResponse>(
      `/movie/${movieId}/watch/providers`,
    );
    return response.data;
  }

  async getSimilarMovies(
    movieId: number,
    page = 1,
  ): Promise<PaginatedResponse<MovieResponse>> {
    const response = await this.api.get<PaginatedResponse<MovieResponse>>(
      `/movie/${movieId}/similar`,
      {
        params: { page },
      },
    );
    return response.data;
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
  ): Promise<PaginatedResponse<MovieResponse>> {
    const response = await this.api.get<PaginatedResponse<MovieResponse>>(
      "/discover/movie",
      {
        params,
      },
    );
    return response.data;
  }

  async searchMovies(params: {
    query: string;
  }): Promise<PaginatedResponse<MovieResponse>> {
    const response = await this.api.get<PaginatedResponse<MovieResponse>>(
      "/search/movie",
      { params },
    );
    return response.data;
  }

  async getNowPlayingMovies(params: {
    page: number;
    language: string;
    region: string;
  }): Promise<PaginatedResponse<MovieResponse>> {
    const response = await this.api.get<PaginatedResponse<MovieResponse>>(
      "/movie/now_playing",
      {
        params: params,
      },
    );
    return response.data;
  }
}
