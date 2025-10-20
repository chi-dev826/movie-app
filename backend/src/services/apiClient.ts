import { Request } from "express";
import { tmdbApi } from "../lib/tmdbClient";
import {
  formatDetail,
  formatVideo,
  formatImage,
  formatWatchProviders,
  enrichMovieList,
  formatMovie,
} from "./dataFormatter";

import { MovieDetailJson, Movie, MovieJson } from "@/types/movie";
import { CollectionJson } from "@/types/collection";
import { PaginatedResponse, DefaultResponse } from "@/types/common";
import { VideoItemJson } from "@/types/movie/videos";
import { ImagesJson } from "@/types/movie/images";
import { MovieWatchProvidersResponse } from "@/types/watch";

// === APIエンドポイント処理関数群 ===

export async function fetchPopularMovies(req: Request) {
  const response = await tmdbApi.get<PaginatedResponse<MovieJson>>(
    "/movie/popular",
    { params: req.query },
  );
  return response.data.results.map(formatMovie);
}

export async function fetchSearchMovies(req: Request): Promise<Movie[]> {
  const response = await tmdbApi.get<PaginatedResponse<MovieJson>>(
    "/search/movie",
    { params: req.query },
  );
  return response.data.results.map(formatMovie);
}

export async function fetchMovieDetails(req: Request) {
  const { movieId } = req.params;

  const [detailRes, videoRes, similarRes, imageRes, watchProvidersRes] =
    await Promise.all([
      tmdbApi.get<MovieDetailJson>(`/movie/${movieId}`, {
        params: { language: "ja" },
      }),
      tmdbApi.get<DefaultResponse<VideoItemJson>>(`/movie/${movieId}/videos`, {
        params: { language: "ja" },
      }),
      tmdbApi.get<PaginatedResponse<MovieJson>>(`/movie/${movieId}/similar`, {
        params: { language: "ja", page: 1 },
      }),
      tmdbApi.get<ImagesJson>(`/movie/${movieId}/images`, {
        params: { language: "ja" },
      }),
      tmdbApi.get<MovieWatchProvidersResponse>(
        `/movie/${movieId}/watch/providers`,
      ),
    ]);

  let collectionRes: { data: CollectionJson } | null = null;
  if (detailRes.data.belongs_to_collection) {
    collectionRes = await tmdbApi.get<CollectionJson>(
      `/collection/${detailRes.data.belongs_to_collection.id}`,
      { params: { language: "ja" } },
    );
  }

  const similarMovies = similarRes.data.results ?? [];
  const collectionMovies = collectionRes ? collectionRes.data.parts : [];

  const [formattedSimilar, formattedCollections] = await Promise.all([
    enrichMovieList(similarMovies),
    enrichMovieList(collectionMovies),
  ]);

  return {
    detail: formatDetail(detailRes.data),
    video: formatVideo(videoRes.data),
    image: formatImage(imageRes.data),
    watchProviders: formatWatchProviders(watchProvidersRes.data),
    similar: formattedSimilar,
    collections: formattedCollections,
  };
}
