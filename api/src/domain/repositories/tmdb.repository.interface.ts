import { MovieEntity } from "../models/movie";
import { MovieDetailEntity } from "../models/movieDetail";
import { CollectionEntity } from "../models/collection";
import { Video } from "../models/video";
import {
  DiscoverMovieParams,
  PaginatedResponse,
  PersonResponse,
} from "../../../../shared/types/external/tmdb";

export interface ITmdbRepository {
  getMovieDetails(movieId: number): Promise<MovieDetailEntity>;
  getMovieVideos(movieId: number): Promise<Video[]>;
  getMovieImages(movieId: number): Promise<string | null>;
  getSimilarMovies(movieId: number, page?: number): Promise<MovieEntity[]>;
  getCollection(collectionId: number): Promise<CollectionEntity>;
  getDiscoverMovies(params: DiscoverMovieParams): Promise<MovieEntity[]>;
  getNowPlayingMovies(params: {
    page: number;
    language: string;
    region: string;
  }): Promise<MovieEntity[]>;
  searchMovies(query: string): Promise<MovieEntity[]>;
  searchPerson(query: string): Promise<PaginatedResponse<PersonResponse>>;
  getMovieWatchProviders(
    movieId: number,
  ): Promise<{ logo_path: string | null; name: string }[]>;
}