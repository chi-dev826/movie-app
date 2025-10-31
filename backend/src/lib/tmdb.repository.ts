import axios from "axios";
import dotenv from "dotenv";
import path from "path";

import { MovieDetailJson, MovieJson } from "@/types/movie";
import { VideoItemJson } from "@/types/movie/videos";
import { ImageJson } from "@/types/movie/imagesResponse";
import { CollectionJson } from "@/types/collection";
import { PaginatedResponse, DefaultResponse } from "@/types/common";
import { MovieWatchProvidersResponse } from "@/types/watch";
import { DiscoverMovieParams } from "@/types/discoverQuery";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const API_KEY = process.env.VITE_TMDB_API_KEY;
if (!API_KEY) {
  console.error(
    "TMDB APIキーが設定されていません。.envファイルを確認してください。",
  );
}
const API_BASE_URL = "https://api.themoviedb.org/3";

export const tmdbApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    Accept: "application/json",
    "Cache-Control": "no-cache",
  },
});

export class TmdbRepository {
  private readonly api: typeof tmdbApi;

  constructor(apiInstance: typeof tmdbApi = tmdbApi) {
    this.api = apiInstance;
  }

  async getMovieDetails(
    movieId: number,
    language = "ja",
  ): Promise<MovieDetailJson> {
    const response = await this.api.get<MovieDetailJson>(`/movie/${movieId}`, {
      params: { language },
    });
    return response.data;
  }

  async getMovieVideos(
    movieId: number,
    language = "ja",
  ): Promise<DefaultResponse<VideoItemJson>> {
    const response = await this.api.get<DefaultResponse<VideoItemJson>>(
      `/movie/${movieId}/videos`,
      {
        params: { language },
      },
    );
    return response.data;
  }

  async getMovieImages(movieId: number, language = "ja"): Promise<ImageJson> {
    const response = await this.api.get<ImageJson>(`/movie/${movieId}/images`, {
      params: { language },
    });
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
    language = "ja",
    page = 1,
  ): Promise<PaginatedResponse<MovieJson>> {
    const response = await this.api.get<PaginatedResponse<MovieJson>>(
      `/movie/${movieId}/similar`,
      {
        params: { language, page },
      },
    );
    return response.data;
  }

  async getCollectionDetails(
    collectionId: number,
    language = "ja",
  ): Promise<CollectionJson> {
    const response = await this.api.get<CollectionJson>(
      `/collection/${collectionId}`,
      {
        params: { language },
      },
    );
    return response.data;
  }

  async getDiscoverMovies(
    params: DiscoverMovieParams,
  ): Promise<PaginatedResponse<MovieJson>> {
    const response = await this.api.get<PaginatedResponse<MovieJson>>(
      "/discover/movie",
      {
        params,
      },
    );
    return response.data;
  }

  async searchMovies(params: {
    query: string;
  }): Promise<PaginatedResponse<MovieJson>> {
    const response = await this.api.get<PaginatedResponse<MovieJson>>(
      "/search/movie",
      { params },
    );
    return response.data;
  }
}
