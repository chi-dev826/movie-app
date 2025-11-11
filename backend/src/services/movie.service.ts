import { TmdbRepository } from "../lib/tmdb.repository";
import * as dataFormatter from "../utils/dataFormatter";
import { Movie } from "@/types/domain";
import { MovieResponse, ImageResponse } from "@/types/external/tmdb";
import { FullMovieData, MovieListResponse } from "@/types/api";
import { fetchVideoStatus } from "../lib/youtubeClient";

export class MovieService {
  private readonly tmdbRepository: TmdbRepository;

  constructor(tmdbRepository: TmdbRepository) {
    this.tmdbRepository = tmdbRepository;
  }

  private getSettledResult<T>(
    result: PromiseSettledResult<T>,
    dataType: string,
    movieId: number,
  ): T | null {
    if (result.status === "fulfilled") {
      return result.value;
    } else {
      console.error(
        `Error fetching ${dataType} for movie ID ${movieId}:`,
        result.reason,
      );
      return null;
    }
  }

  private async isPublicKey(key: string | null): Promise<string | null> {
    if (!key) {
      return null;
    }
    const result = await fetchVideoStatus(key);
    const status = result?.items?.[0]?.status;
    return status && status.privacyStatus === "public" ? key : null;
  }

  async getMovieDetails(movieId: number): Promise<FullMovieData> {
    const results = await Promise.allSettled([
      this.tmdbRepository.getMovieDetails(movieId),
      this.tmdbRepository.getMovieVideos(movieId),
      this.tmdbRepository.getSimilarMovies(movieId),
      this.tmdbRepository.getMovieImages(movieId),
      this.tmdbRepository.getMovieWatchProviders(movieId),
    ]);

    const detailRes = this.getSettledResult(
      results[0],
      "MovieDetails",
      movieId,
    );
    const videoRes = this.getSettledResult(results[1], "MovieVideos", movieId);
    const similarRes = this.getSettledResult(
      results[2],
      "SimilarMovies",
      movieId,
    );
    const imageRes = this.getSettledResult(results[3], "MovieImages", movieId);
    const watchProvidersRes = this.getSettledResult(
      results[4],
      "MovieWatchProviders",
      movieId,
    );

    // 必須データのチェック
    if (!detailRes) {
      throw new Error(
        `Essential movie details for ID ${movieId} could not be fetched.`,
      );
    }

    // 別のエンドポイントからシリーズ作品、または関連作品を取得
    let collectionMovies: MovieResponse[] = [];
    if (detailRes.belongs_to_collection) {
      const collectionRes = await this.tmdbRepository.getCollectionDetails(
        detailRes.belongs_to_collection.id,
      );
      collectionMovies = collectionRes.parts || [];
    }

    const similarMovies = similarRes?.results ?? []; // similarResがnullの場合を考慮

    const similarImageResults = await Promise.allSettled(
      similarMovies.map((movie) =>
        this.tmdbRepository.getMovieImages(movie.id),
      ),
    );
    const collectionImageResults = await Promise.allSettled(
      collectionMovies.map((movie) =>
        this.tmdbRepository.getMovieImages(movie.id),
      ),
    );

    const similarImageResponses: (ImageResponse | null)[] =
      similarImageResults.map((res) =>
        res.status === "fulfilled" ? res.value : null,
      );
    const collectionImageResponses: (ImageResponse | null)[] =
      collectionImageResults.map((res) =>
        res.status === "fulfilled" ? res.value : null,
      );

    const formattedDetail = dataFormatter.formatDetail(detailRes);
    const formattedImage = imageRes
      ? dataFormatter.formatImage(imageRes)
      : null;
    const formattedWatchProviders = watchProvidersRes
      ? dataFormatter.formatWatchProviders(watchProvidersRes)
      : [];

    // ロゴ付きで映画リストを整形
    const formattedSimilar = dataFormatter.enrichMovieListWithLogos(
      similarMovies,
      similarImageResponses,
    );
    const formattedCollections = dataFormatter.enrichMovieListWithLogos(
      collectionMovies,
      collectionImageResponses,
    );

    // youtubeApiを叩いて動画の公開状況を確認し、非公開ならnullを返す
    const key =
      videoRes?.results.find(
        (video) => video.site === "YouTube" && video.type === "Trailer",
      )?.key ?? null;
    const videoKey: string | null = await this.isPublicKey(key);

    return {
      detail: formattedDetail,
      video: videoKey,
      image: formattedImage,
      watchProviders: formattedWatchProviders,
      similar: formattedSimilar,
      collections: formattedCollections,
    };
  }

  async getMovieList(): Promise<MovieListResponse> {
    const [popularRes, nowPlayingRes, topRatedRes, highRatedRes] =
      await Promise.all([
        this.tmdbRepository.getDiscoverMovies({
          "vote_count.gte": 20000,
          sort_by: "popularity.desc",
          page: 1,
          region: "JP",
        }),
        this.tmdbRepository.getDiscoverMovies({
          "vote_count.gte": 1000,
          sort_by: "primary_release_date.desc",
          page: 1,
          region: "JP",
        }),
        this.tmdbRepository.getDiscoverMovies({
          "vote_count.gte": 1000,
          primary_release_year: "2022-01-01",
          sort_by: "vote_average.desc",
          page: 1,
          region: "JP",
        }),
        this.tmdbRepository.getDiscoverMovies({
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
      high_rated: highRatedRes.results.map(dataFormatter.formatMovie),
    };
  }

  async getUpcomingMovieList(): Promise<Movie[]> {
    // 今日の日付と2ヶ月後の日付を取得
    const today: Date = new Date();
    const year: number = today.getFullYear();
    const month: string = (today.getMonth() + 1).toString().padStart(2, "0");
    const day: string = today.getDate().toString().padStart(2, "0");

    const dateGte: string = `${year}-${month}-${day}`;

    const twoMonthsLater = new Date(today);
    twoMonthsLater.setMonth(today.getMonth() + 2);
    const twoMonthsLaterYear: number = twoMonthsLater.getFullYear();
    const twoMonthsLaterMonth: string = (twoMonthsLater.getMonth() + 1)
      .toString()
      .padStart(2, "0");
    const twoMonthsLaterDay: string = twoMonthsLater
      .getDate()
      .toString()
      .padStart(2, "0");

    const dateLte: string = `${twoMonthsLaterYear}-${twoMonthsLaterMonth}-${twoMonthsLaterDay}`;

    const response = await this.tmdbRepository.getDiscoverMovies({
      region: "JP",
      watch_region: "JP",
      sort_by: "popularity.desc",
      include_adult: false,
      include_video: false,
      with_release_type: "2|3",
      "primary_release_date.gte": dateGte,
      "primary_release_date.lte": dateLte,
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

      // youtubeApiを叩いて動画の公開状況を確認し、非公開ならnullを返す
      const key =
        videoResponse.results.find(
          (video) => video.site === "YouTube" && video.type === "Trailer",
        )?.key ?? null;
      const youtubeKey: string | null = await this.isPublicKey(key);

      return {
        ...dataFormatter.formatMovie(movie),
        logo_path: logoPath,
        video: youtubeKey,
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
