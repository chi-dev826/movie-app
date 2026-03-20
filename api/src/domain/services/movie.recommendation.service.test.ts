import { MovieRecommendationService } from "./movie.recommendation.service";
import { MovieEntity } from "../models/movie";
import { CollectionEntity } from "../models/collection";

/**
 * テスト用の MovieEntity を最小限のプロパティで生成するヘルパー
 */
const createMovie = (id: number): MovieEntity =>
  new MovieEntity(
    id,
    `映画${id}`,
    `Movie${id}`,
    "ja",
    "概要",
    "/poster.jpg",
    "/backdrop.jpg",
    "2024-01-01",
    7.5,
  );

describe("MovieRecommendationService", () => {
  let service: MovieRecommendationService;

  beforeEach(() => {
    service = new MovieRecommendationService();
  });

  describe("おすすめリストの取得ポリシー: Collection(シリーズ) > Similar(類似)", () => {
    it("collection が null の場合、類似作品を返す", () => {
      // Given
      const similarMovies = [createMovie(10), createMovie(11)];

      // When
      const result = service.getRecommendations(1, null, similarMovies);

      // Then
      expect(result.title).toBe("関連作品");
      expect(result.movies).toEqual(similarMovies);
    });

    it("collection があり、シリーズ作品が存在する場合、シリーズ作品を返す", () => {
      // Given
      const currentMovieId = 1;
      const seriesMovies = [
        createMovie(currentMovieId),
        createMovie(2),
        createMovie(3),
      ];
      const collection = new CollectionEntity(
        100,
        "テストシリーズ",
        seriesMovies,
      );

      // When
      const result = service.getRecommendations(currentMovieId, collection, [createMovie(20)]);

      // Then
      expect(result.title).toBe("シリーズ作品: テストシリーズ");
      expect(result.movies.map((m) => m.id)).toEqual([2, 3]);
    });

    it("コレクションから自分自身を除外した結果が0件の場合、類似作品にフォールバックする", () => {
      // Given: コレクションに自分自身しかいない
      const currentMovieId = 1;
      const collection = new CollectionEntity(100, "単独シリーズ", [createMovie(currentMovieId)]);
      const similarMovies = [createMovie(20)];

      // When
      const result = service.getRecommendations(currentMovieId, collection, similarMovies);

      // Then
      expect(result.title).toBe("関連作品");
      expect(result.movies).toEqual(similarMovies);
    });
  });
});
