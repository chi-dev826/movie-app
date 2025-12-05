import NodeCache from "node-cache";
import { TmdbRepository } from "../repositories/tmdb.repository";
import { YoutubeRepository } from "../repositories/youtube.repository"; // Import YoutubeRepository
import { MovieFormatter } from "../repositories/tmdb.formatter";
import { Movie } from "../../../shared/types/domain";
import { FullMovieData, MovieListResponse } from "../../../shared/types/api";
import { DiscoverMovieParams } from "../../../shared/types/external/tmdb";

export class MovieService {
  private readonly tmdbRepository: TmdbRepository;
  private readonly youtubeRepository: YoutubeRepository; // Add YoutubeRepository
  private readonly cache: NodeCache;
  // Collectionのパーツなど、Repositoryメソッドが生データを返してくるケースや
  // Service内で追加の整形が必要なケースのために、Formatterを内部で保持する
  private readonly formatter: MovieFormatter;

  constructor(
    tmdbRepository: TmdbRepository,
    youtubeRepository: YoutubeRepository, // Add YoutubeRepository to constructor
  ) {
    this.tmdbRepository = tmdbRepository;
    this.youtubeRepository = youtubeRepository;
    this.cache = new NodeCache({ stdTTL: 86400 }); // キャッシュ有効期限: 24時間
    this.formatter = new MovieFormatter();
  }

  private createPageArray(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  private async isPublicKey(key: string | null): Promise<string | null> {
    if (!key) {
      return null;
    }
    const result = await this.youtubeRepository.getVideoStatus(key); // Use YoutubeRepository
    const status = result?.items?.[0]?.status;
    return status && status.privacyStatus === "public" ? key : null;
  }

  /**
   * 映画リストの各要素に対してロゴ画像を取得し、logo_pathを更新する
   */
  private async enrichWithLogos(movies: Movie[]): Promise<Movie[]> {
    const results = await Promise.allSettled(
      movies.map((movie) => this.tmdbRepository.getMovieImages(movie.id)),
    );

    return movies.map((movie, index) => {
      const result = results[index];
      const logoPath = result.status === "fulfilled" ? result.value : null;
      return {
        ...movie,
        logo_path: logoPath,
      };
    });
  }

  async getFullMovieData(movieId: number): Promise<FullMovieData> {
    // 1. 主要データの取得
    const [detail, videos, similarRes, image, watchProviders] =
      await Promise.all([
        this.tmdbRepository.getMovieDetails(movieId),
        this.tmdbRepository.getMovieVideos(movieId),
        this.tmdbRepository.getSimilarMovies(movieId), // PaginatedResponse<Movie> を返す
        this.tmdbRepository.getMovieImages(movieId),
        this.tmdbRepository.getMovieWatchProviders(movieId),
      ]);

    // 2. シリーズ（Collection）情報の処理
    let collectionMovies: Movie[] = [];
    if (detail.belongs_to_collection_id) {
      try {
        const collectionRes = await this.tmdbRepository.getCollectionDetails(
          detail.belongs_to_collection_id,
        );
        // 現在表示中の映画を除外し、残りをフォーマットする
        collectionMovies = collectionRes.parts
          .filter((part) => part.id !== detail.id)
          .map((part) => this.formatter.formatMovie(part));
      } catch (error) {
        console.error(
          `コレクション情報の取得に失敗しました (movieId: ${movieId}):`,
          error,
        );
      }
    }

    // 3. 関連映画とシリーズ映画にロゴ情報を付与
    const similarMovies = similarRes.results;
    const [enrichedSimilar, enrichedCollection] = await Promise.all([
      this.enrichWithLogos(similarMovies),
      this.enrichWithLogos(collectionMovies),
    ]);

    // 4. 動画（予告編）のキー特定と公開状態の確認
    const trailerKey =
      videos.find(
        (video) => video.site === "YouTube" && video.type === "Trailer",
      )?.key ?? null;
    const video = await this.isPublicKey(trailerKey);

    return {
      detail,
      image, // メイン映画のロゴパス
      video,
      similar: enrichedSimilar,
      collections: enrichedCollection,
      watchProviders,
    };
  }

  async getHomePageMovieList(): Promise<MovieListResponse> {
    const cacheKey = "homeMovieList";
    const cachedResult = this.cache.get<MovieListResponse>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const categories: Record<string, DiscoverMovieParams> = {
      popular: {
        "vote_count.gte": 10000,
        sort_by: "popularity.desc",
        region: "JP",
      },
      recently_added: {
        "vote_count.gte": 1000,
        sort_by: "primary_release_date.desc",
        region: "JP",
      },
      top_rated: {
        "vote_count.gte": 1000,
        sort_by: "vote_average.desc",
        region: "JP",
      },
      high_rated: {
        "vote_count.gte": 5000,
        sort_by: "vote_count.desc",
        region: "JP",
      },
    };

    const pagesToFetch = this.createPageArray(10);

    // 全てのカテゴリとページを並行して取得
    const promises = Object.entries(categories).flatMap(
      ([categoryKey, params]) =>
        pagesToFetch.map(async (page) => {
          const res = await this.tmdbRepository.getDiscoverMovies({
            ...params,
            page,
          });
          return { categoryKey, results: res.results };
        }),
    );

    const results = await Promise.all(promises);

    // 結果をカテゴリごとに集約
    const aggregated: Record<string, Movie[]> = {
      popular: [],
      recently_added: [],
      top_rated: [],
      high_rated: [],
    };

    results.forEach(({ categoryKey, results }) => {
      aggregated[categoryKey].push(...results);
    });

    // 重複排除
    const deduplicated: Record<string, Movie[]> = {};
    for (const key of Object.keys(aggregated)) {
      const uniqueMovies = new Map<number, Movie>();
      aggregated[key].forEach((movie) => uniqueMovies.set(movie.id, movie));
      deduplicated[key] = Array.from(uniqueMovies.values());
    }

    const response: MovieListResponse = {
      popular: deduplicated.popular,
      recently_added: deduplicated.recently_added,
      top_rated: deduplicated.top_rated,
      high_rated: deduplicated.high_rated,
    };

    this.cache.set(cacheKey, response);
    return response;
  }

  async getUpcomingMovieList(): Promise<Movie[]> {
    const cacheKey = "upcomingMovies";
    const cachedResult = this.cache.get<Movie[]>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const today = new Date();
    const twoMonthsLater = new Date(today);
    twoMonthsLater.setMonth(today.getMonth() + 2);

    const formatDate = (d: Date) => d.toISOString().split("T")[0];

    const params: DiscoverMovieParams = {
      region: "JP",
      watch_region: "JP",
      sort_by: "popularity.desc",
      include_adult: false,
      include_video: false,
      with_release_type: "3|2",
      "primary_release_date.gte": formatDate(today),
      "primary_release_date.lte": formatDate(twoMonthsLater),
    };

    const pagesToFetch = this.createPageArray(10);
    const promises = pagesToFetch.map((page) =>
      this.tmdbRepository.getDiscoverMovies({ ...params, page }),
    );

    const responses = await Promise.all(promises);
    const allMovies = responses.flatMap((res) => res.results);

    // 日本語コンテンツのフィルタリングを適用
    const filteredMovies = allMovies.filter((movie) =>
      this.formatter.isMostlyJapanese(movie.title, movie.original_language),
    );

    const moviesWithExtras = await Promise.all(
      filteredMovies.map(async (movie) => {
        const [image, videos] = await Promise.all([
          this.tmdbRepository.getMovieImages(movie.id),
          this.tmdbRepository.getMovieVideos(movie.id),
        ]);

        const trailerKey =
          videos.find(
            (video) => video.site === "YouTube" && video.type === "Trailer",
          )?.key ?? null;
        const video = await this.isPublicKey(trailerKey);

        return {
          ...movie,
          logo_path: image,
          video: video,
        };
      }),
    );

    this.cache.set(cacheKey, moviesWithExtras);
    return moviesWithExtras;
  }

  async searchMovies(query: string): Promise<Movie[]> {
    const response = await this.tmdbRepository.searchMovies({ query });
    return response.results;
  }

  async getNowPlayingMovies(): Promise<Movie[]> {
    const cacheKey = "nowPlayingMovies";
    const cachedResult = this.cache.get<Movie[]>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const pagesToFetch = this.createPageArray(3);
    const promises = pagesToFetch.map((page) =>
      this.tmdbRepository.getNowPlayingMovies({
        page,
        language: "ja",
        region: "JP",
      }),
    );

    const responses = await Promise.all(promises);
    const allMovies = responses.flatMap((res) => res.results);

    // 重複排除
    const uniqueMovies = new Map<number, Movie>();
    allMovies.forEach((m) => uniqueMovies.set(m.id, m));
    const result = Array.from(uniqueMovies.values());

    this.cache.set(cacheKey, result);
    return result;
  }

  async getMovieListByIds(movieIds: number[]): Promise<Movie[]> {
    if (!movieIds || movieIds.length === 0) {
      return [];
    }

    const promises = movieIds.map(async (id) => {
      try {
        const [detail, image] = await Promise.all([
          this.tmdbRepository.getMovieDetails(id),
          this.tmdbRepository.getMovieImages(id),
        ]);
        return this.formatter.formatMovieFromDetail(detail, image);
      } catch (error) {
        console.error(`映画ID ${id} の取得に失敗しました:`, error);
        return null;
      }
    });

    const results = await Promise.all(promises);
    // 取得に成功したものだけを返す
    return results.filter((movie): movie is Movie => movie !== null);
  }
}
