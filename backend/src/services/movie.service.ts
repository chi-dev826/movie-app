import NodeCache from "node-cache";

import { TmdbRepository } from "../lib/tmdb.repository";
import {
  MovieResponse,
  ImageResponse,
  CollectionResponse,
  MovieDetailResponse,
  MovieWatchProvidersResponse,
  PaginatedResponse,
} from "@/types/external/tmdb";
import { fetchVideoStatus } from "../lib/youtubeClient";

// Assemblerに渡すためのデータ型を定義
export type MovieDetailRawData = {
  detailRes: MovieDetailResponse;
  similarRes: { results: MovieResponse[] } | null;
  imageRes: ImageResponse | null;
  watchProvidersRes: MovieWatchProvidersResponse | null;
  collectionRes: CollectionResponse | null;
  similarImageResponses: (ImageResponse | null)[];
  collectionImageResponses: (ImageResponse | null)[];
  video: string | null;
};

export class MovieService {
  private readonly tmdbRepository: TmdbRepository;
  private readonly cache: NodeCache;

  constructor(tmdbRepository: TmdbRepository) {
    this.tmdbRepository = tmdbRepository;
    this.cache = new NodeCache({ stdTTL: 86400 }); // キャッシュの有効期限を24時間に設定
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

  private pageToFetch = Array.from({ length: 10 }, (_, i) => i + 1);

  private async isPublicKey(key: string | null): Promise<string | null> {
    if (!key) {
      return null;
    }
    const result = await fetchVideoStatus(key);
    const status = result?.items?.[0]?.status;
    return status && status.privacyStatus === "public" ? key : null;
  }

  async getMovieDetails(movieId: number): Promise<MovieDetailRawData> {
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
    let collectionRes: CollectionResponse | null = null;
    if (detailRes.belongs_to_collection) {
      collectionRes = await this.tmdbRepository.getCollectionDetails(
        detailRes.belongs_to_collection.id,
      );
    }

    const collectionMovies =
      collectionRes?.parts.filter((movie) => movie.id !== detailRes.id) || [];
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

    // youtubeApiを叩いて動画の公開状況を確認し、非公開ならnullを返す
    const key =
      videoRes?.results.find(
        (video) => video.site === "YouTube" && video.type === "Trailer",
      )?.key ?? null;
    const video: string | null = await this.isPublicKey(key);

    return {
      detailRes,
      similarRes,
      imageRes,
      watchProvidersRes,
      collectionRes,
      similarImageResponses,
      collectionImageResponses,
      video,
    };
  }

  async getMovieList() {
    const categories = {
      popularRes: {
        "vote_count.gte": 10000,
        sort_by: "popularity.desc",
        region: "JP",
      },
      nowPlayingRes: {
        "vote_count.gte": 1000,
        sort_by: "primary_release_date.desc",
        region: "JP",
      },
      topRatedRes: {
        "vote_count.gte": 1000,
        sort_by: "vote_average.desc",
        region: "JP",
      },
      highRatedRes: {
        "vote_count.gte": 5000,
        sort_by: "vote_count.desc",
        region: "JP",
      },
    };

    const cacheKey = "homeMovieList";
    const cachedResult = this.cache.get<{
      popularRes: PaginatedResponse<MovieResponse>;
      nowPlayingRes: PaginatedResponse<MovieResponse>;
      topRatedRes: PaginatedResponse<MovieResponse>;
      highRatedRes: PaginatedResponse<MovieResponse>;
    }>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    // それぞれのカテゴリのデータを10ページ分取得
    const moviePromises = Object.entries(categories).flatMap(
      ([categoryName, params]) =>
        this.pageToFetch.map((pg) =>
          this.tmdbRepository
            .getDiscoverMovies({
              ...params,
              page: pg,
            })
            .then((res) => ({ categoryName, res })),
        ),
    );

    const resolvedMoviePromises = await Promise.all(moviePromises);

    const aggregatedResponses = resolvedMoviePromises.reduce(
      (acc, curr) => {
        const { categoryName, res } = curr;
        const existingMovies = acc[categoryName]
          ? acc[categoryName].results
          : [];
        const newMovies = res.results;
        if (!acc[categoryName]) {
          acc[categoryName] = res;
        }
        acc[categoryName].results = [...existingMovies, ...newMovies];
        return acc;
      },
      {} as Record<string, PaginatedResponse<MovieResponse>>,
    );

    const { popularRes, nowPlayingRes, topRatedRes, highRatedRes } =
      aggregatedResponses;

    this.cache.set(cacheKey, {
      popularRes,
      nowPlayingRes,
      topRatedRes,
      highRatedRes,
    });
    return { popularRes, nowPlayingRes, topRatedRes, highRatedRes };
  }

  async getUpcomingMovieList(): Promise<{
    upcomingRes: {
      movie: MovieResponse;
      imageRes: ImageResponse;
      video: string | null;
    }[];
  }> {
    const cacheKey = "upcomingMovies";
    const cachedResult = this.cache.get<{
      upcomingRes: {
        movie: MovieResponse;
        imageRes: ImageResponse;
        video: string | null;
      }[];
    }>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

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

    const moviePromises = this.pageToFetch.map((pg) =>
      this.tmdbRepository.getDiscoverMovies({
        region: "JP",
        watch_region: "JP",
        sort_by: "popularity.desc",
        include_adult: false,
        include_video: false,
        with_release_type: "3|2",
        "primary_release_date.gte": dateGte,
        "primary_release_date.lte": dateLte,
        page: pg,
      }),
    );

    const movieResponses = await Promise.all(moviePromises);

    const combinedResults: MovieResponse[] = movieResponses.flatMap(
      (response) => response.results,
    );

    const imageVideoPromises = combinedResults.map(async (movie) => {
      const [imageRes, videoRes] = await Promise.all([
        this.tmdbRepository.getMovieImages(movie.id),
        this.tmdbRepository.getMovieVideos(movie.id),
      ]);
      // youtubeApiを叩いて動画の公開状況を確認し、非公開ならnullを返す
      const key =
        videoRes?.results.find(
          (video) => video.site === "YouTube" && video.type === "Trailer",
        )?.key ?? null;
      const video: string | null = await this.isPublicKey(key);

      return {
        movie,
        imageRes,
        video,
      };
    });

    const upcomingRes = await Promise.all(imageVideoPromises);

    this.cache.set(cacheKey, { upcomingRes });
    return { upcomingRes };
  }

  async searchMovies(query: string) {
    return await this.tmdbRepository.searchMovies({ query });
  }
}
