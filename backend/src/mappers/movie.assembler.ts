import { MovieFormatter } from "./movie.formatter";
import { MovieService } from "../services/movie.service";
import { Movie } from "@/types/domain";
import { FullMovieData, MovieListResponse } from "@/types/api";

export class MovieAssembler {
  private readonly movieService: MovieService;
  private readonly movieFormatter: MovieFormatter;

  constructor(movieService: MovieService, movieFormatter: MovieFormatter) {
    this.movieService = movieService;
    this.movieFormatter = movieFormatter;
  }

  public async assembleFullMovieData(movieId: number): Promise<FullMovieData> {
    const rawData = await this.movieService.getMovieDetails(movieId);
    const {
      detailRes,
      similarRes,
      imageRes,
      watchProvidersRes,
      collectionRes,
      similarImageResponses,
      collectionImageResponses,
      video,
    } = rawData;

    const detail = this.movieFormatter.formatDetail(detailRes);
    const image = imageRes ? this.movieFormatter.formatImage(imageRes) : null;
    const watchProviders = watchProvidersRes
      ? this.movieFormatter.formatWatchProviders(watchProvidersRes)
      : [];

    const collectionMovies =
      collectionRes?.parts.filter((movie) => movie.id !== detailRes.id) || [];
    const similarMovies = similarRes?.results ?? [];

    const similar = this.movieFormatter.enrichMovieListWithLogos(
      similarMovies,
      similarImageResponses,
    );
    const collections = this.movieFormatter.enrichMovieListWithLogos(
      collectionMovies,
      collectionImageResponses,
    );

    return {
      detail,
      image,
      video,
      similar,
      collections,
      watchProviders,
    };
  }

  public async assembleMovieList(): Promise<MovieListResponse> {
    const { popularRes, nowPlayingRes, topRatedRes, highRatedRes } =
      await this.movieService.getMovieList();

    const popular = popularRes.results.map(this.movieFormatter.formatMovie);
    const now_playing = nowPlayingRes.results.map(
      this.movieFormatter.formatMovie,
    );
    const top_rated = topRatedRes.results.map(this.movieFormatter.formatMovie);
    const high_rated = highRatedRes.results.map(
      this.movieFormatter.formatMovie,
    );

    return {
      popular,
      now_playing,
      top_rated,
      high_rated,
    };
  }

  public async assembleUpcomingMovieList(): Promise<Movie[]> {
    const { upcomingRes } = await this.movieService.getUpcomingMovieList();

    const filteredMovies = upcomingRes.filter((data) =>
      this.movieFormatter.isMostlyJapanese(
        data.movie.title,
        data.movie.original_language,
      ),
    );

    const upcomingMoviesPromises = filteredMovies.map(async (data) => {
      const logo_path = this.movieFormatter.formatImage(data.imageRes);
      const video = data.video;
      const movie = this.movieFormatter.formatMovie(data.movie);
      const movies = { ...movie, logo_path, video };

      return {
        ...movies,
      };
    });

    const upcomingMovies = await Promise.all(upcomingMoviesPromises);
    return upcomingMovies;
  }

  public async assembleSearchedMovies(query: string): Promise<Movie[]> {
    const response = await this.movieService.searchMovies(query);
    return response.results.map(this.movieFormatter.formatMovie);
  }
}
