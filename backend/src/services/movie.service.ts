import { TmdbRepository } from "lib/tmdb.repository";
import * as dataFormatter from "../utils/dataFormatter";
import { Movie, MovieDetail } from "@/types/movie";
import { CollectionPart } from "@/types/collection";

type MovieDetailTypes = {
  detail: MovieDetail;
  video: string | null;
  image: string | null;
  watchProviders: { logo_path: string | null; name: string }[];
  similar: Movie[];
  collections: Movie[];
};

type MovieListTypes = Record<
  "popular" | "now_playing" | "top_rated" | "highRated",
  Movie[]
>;

export class MovieService {
  private readonly tmdbRepository: TmdbRepository;

  constructor(tmdbRepository: TmdbRepository) {
    this.tmdbRepository = tmdbRepository;
  }
  async getMovieDetails(movieId: number): Promise<MovieDetailTypes> {
    const [detailRes, videoRes, similarRes, imageRes, watchProvidersRes] =
      await Promise.all([
        this.tmdbRepository.getMovieDetails(movieId),
        this.tmdbRepository.getMovieVideos(movieId),
        this.tmdbRepository.getSimilarMovies(movieId),
        this.tmdbRepository.getMovieImages(movieId),
        this.tmdbRepository.getMovieWatchProviders(movieId),
      ]);

    let collectionMovies: CollectionPart[] = [];
    if (detailRes.belongs_to_collection) {
      const collectionRes = await this.tmdbRepository.getCollectionDetails(
        detailRes.belongs_to_collection.id,
      );
      collectionMovies = collectionRes.parts;
    }

    const similarMovies = similarRes.results ?? [];

    const [similarImageResponses, collectionImageResponses] = await Promise.all(
      [
        Promise.all(
          similarMovies.map((movie) =>
            this.tmdbRepository.getMovieImages(movie.id),
          ),
        ),
        Promise.all(
          collectionMovies.map((movie) =>
            this.tmdbRepository.getMovieImages(movie.id),
          ),
        ),
      ],
    );

    const formattedSimilar = dataFormatter.enrichMovieListWithLogos(
      similarMovies,
      similarImageResponses,
    );
    const formattedCollections = dataFormatter.enrichMovieListWithLogos(
      collectionMovies,
      collectionImageResponses,
    );

    const videoKey = await dataFormatter.formatVideo(videoRes);

    return {
      detail: dataFormatter.formatDetail(detailRes),
      video: videoKey,
      image: dataFormatter.formatImage(imageRes),
      watchProviders: dataFormatter.formatWatchProviders(watchProvidersRes),
      similar: formattedSimilar,
      collections: formattedCollections,
    };
  }

  async getMovieList(): Promise<MovieListTypes> {
    const [popularRes, nowPlayingRes, topRatedRes, highRatedRes] =
      await Promise.all([
        this.tmdbRepository.getDiscoverMovies({
          language: "ja",
          "vote_count.gte": 20000,
          sort_by: "popularity.desc",
          page: 1,
          region: "JP",
        }),
        this.tmdbRepository.getDiscoverMovies({
          language: "ja",
          "vote_count.gte": 1000,
          sort_by: "primary_release_date.desc",
          page: 1,
          region: "JP",
        }),
        this.tmdbRepository.getDiscoverMovies({
          language: "ja",
          "vote_count.gte": 1000,
          primary_release_year: "2022-01-01",
          sort_by: "vote_average.desc",
          page: 1,
          region: "JP",
        }),
        this.tmdbRepository.getDiscoverMovies({
          language: "ja",
          "vote_count.gte": 5000,
          primary_release_year: "2023-01-01",
          sort_by: "vote_count.desc",
          page: 1,
          region: "JP",
        }),
      ]);

    return {
      popular: popularRes.results.map(dataFormatter.formatMovie),
      now_playing: nowPlayingRes.results.map(dataFormatter.formatMovie),
      top_rated: topRatedRes.results.map(dataFormatter.formatMovie),
      highRated: highRatedRes.results.map(dataFormatter.formatMovie),
    };
  }

  async getUpcomingMovieList(): Promise<Movie[]> {
    const response = await this.tmdbRepository.getDiscoverMovies({
      language: "ja-JP",
      region: "JP",
      watch_region: "JP",
      sort_by: "popularity.desc",
      include_adult: false,
      include_video: false,
      with_release_type: "2|3",
      "primary_release_date.gte": "2025-10-22",
      "primary_release_date.lte": "2025-11-22",
      with_original_language: "ja|en",
      page: 1,
    });

    const filteredMovies = response.results.filter((data) =>
      dataFormatter.isMostlyJapanese(data.title),
    );

    const imageVideoPromises = filteredMovies.map(async (movie) => {
      const [imageResponse, videoResponse] = await Promise.all([
        this.tmdbRepository.getMovieImages(movie.id),
        this.tmdbRepository.getMovieVideos(movie.id),
      ]);
      return { imageResponse, videoResponse };
    });

    const imageVideoResults = await Promise.all(imageVideoPromises);

    const upcomingMoviesPromises = filteredMovies.map(async (movie, index) => {
      const { imageResponse, videoResponse } = imageVideoResults[index];
      const logoPath = dataFormatter.formatImage(imageResponse);
      const youtubeKey = await dataFormatter.formatVideo(videoResponse);

      return {
        ...dataFormatter.formatMovie(movie),
        logo_path: logoPath,
        youtube_key: youtubeKey,
      };
    });

    const upcomingMovies = await Promise.all(upcomingMoviesPromises);

    return upcomingMovies;
  }

  async searchMovies(query: string): Promise<Movie[]> {
    const response = await this.tmdbRepository.searchMovies({ query });
    return response.results.map(dataFormatter.formatMovie);
  }
}
