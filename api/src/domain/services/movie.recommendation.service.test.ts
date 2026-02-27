import { MovieRecommendationService } from "./movie.recommendation.service";
import { MovieFilterOutService } from "./movie.filterOut.service";
import { ITmdbRepository } from "../repositories/tmdb.repository.interface";
import { MovieEntity } from "../models/movie";
import { CollectionEntity } from "../models/collection";

/**
 * テスト用の MovieEntity を最小限のプロパティで生成するヘルパー
 */
const createMovie = (id: number): MovieEntity =>
  new MovieEntity(id, `映画${id}`, `Movie${id}`, "ja", "概要", "/poster.jpg", "/backdrop.jpg", "2024-01-01", 7.5);

// 古典派: MovieFilterOutService は実オブジェクトを使用
const filterService = new MovieFilterOutService();

// ITmdbRepository はプロセス外の依存 → モック
const mockTmdbRepo: jest.Mocked<ITmdbRepository> = {
  getMovieDetails: jest.fn(),
  getMovieVideos: jest.fn(),
  getMovieImages: jest.fn(),
  getSimilarMovies: jest.fn(),
  getCollection: jest.fn(),
  getDiscoverMovies: jest.fn(),
  getNowPlayingMovies: jest.fn(),
  searchMovies: jest.fn(),
  searchPerson: jest.fn(),
  getMovieWatchProviders: jest.fn(),
};

describe("MovieRecommendationService", () => {
  let service: MovieRecommendationService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new MovieRecommendationService(mockTmdbRepo, filterService);
  });

  describe("おすすめリストの取得ポリシー: Collection(シリーズ) > Similar(類似)", () => {
    it("collectionId が null の場合、類似作品を返す", async () => {
      // Given
      const similarMovies = [createMovie(10), createMovie(11)];
      mockTmdbRepo.getSimilarMovies.mockResolvedValue(similarMovies);

      // When
      const result = await service.getRecommendations(1, null);

      // Then
      expect(result.title).toBe("関連作品");
      expect(result.movies).toEqual(similarMovies);
      expect(mockTmdbRepo.getCollection).not.toHaveBeenCalled();
    });

    it("collectionId があり、シリーズ作品が存在する場合、シリーズ作品を返す", async () => {
      // Given
      const currentMovieId = 1;
      const seriesMovies = [createMovie(currentMovieId), createMovie(2), createMovie(3)];
      const collection = new CollectionEntity(100, "テストシリーズ", seriesMovies);
      mockTmdbRepo.getCollection.mockResolvedValue(collection);

      // When
      const result = await service.getRecommendations(currentMovieId, 100);

      // Then
      expect(result.title).toBe("シリーズ作品: テストシリーズ");
      // 現在表示中の映画（id=1）は除外される
      expect(result.movies.map((m) => m.id)).toEqual([2, 3]);
      expect(mockTmdbRepo.getSimilarMovies).not.toHaveBeenCalled();
    });

    it("コレクションから自分自身を除外した結果が0件の場合、類似作品にフォールバックする", async () => {
      // Given: コレクションに自分自身しかいない
      const currentMovieId = 1;
      const collection = new CollectionEntity(100, "単独シリーズ", [createMovie(currentMovieId)]);
      mockTmdbRepo.getCollection.mockResolvedValue(collection);
      const similarMovies = [createMovie(20)];
      mockTmdbRepo.getSimilarMovies.mockResolvedValue(similarMovies);

      // When
      const result = await service.getRecommendations(currentMovieId, 100);

      // Then
      expect(result.title).toBe("関連作品");
      expect(result.movies).toEqual(similarMovies);
    });

    it("コレクション取得が失敗した場合、類似作品にフォールバックする", async () => {
      // Given
      mockTmdbRepo.getCollection.mockRejectedValue(new Error("API Error"));
      const similarMovies = [createMovie(30)];
      mockTmdbRepo.getSimilarMovies.mockResolvedValue(similarMovies);

      // When
      const result = await service.getRecommendations(1, 100);

      // Then
      expect(result.title).toBe("関連作品");
      expect(result.movies).toEqual(similarMovies);
    });
  });
});
