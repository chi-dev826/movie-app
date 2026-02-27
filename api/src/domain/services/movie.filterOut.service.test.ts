import { MovieFilterOutService } from "./movie.filterOut.service";
import { MovieEntity } from "../models/movie";

/**
 * テスト用の MovieEntity を最小限のプロパティで生成するヘルパー
 */
const createMovie = (
  overrides: Partial<{
    id: number;
    posterPath: string | null;
    backdropPath: string | null;
  }> = {},
): MovieEntity => {
  const id = overrides.id ?? 1;
  return new MovieEntity(
    id,
    `映画${id}`,
    `Movie${id}`,
    "ja",
    "概要",
    "posterPath" in overrides ? overrides.posterPath! : "/poster.jpg",
    "backdropPath" in overrides ? overrides.backdropPath! : "/backdrop.jpg",
    "2024-01-01",
    7.5,
  );
};

describe("MovieFilterOutService", () => {
  const service = new MovieFilterOutService();

  // ─── filter ──────────────────────────────────────
  describe("filter: 指定IDの映画をリストから除外する", () => {
    it("指定したIDの映画が除外されたリストを返す", () => {
      const movies = [createMovie({ id: 1 }), createMovie({ id: 2 }), createMovie({ id: 3 })];

      const result = service.filter(movies, 2);

      expect(result.map((m) => m.id)).toEqual([1, 3]);
    });

    it("指定IDがリストに存在しない場合、元のリストと同じ要素を返す", () => {
      const movies = [createMovie({ id: 1 }), createMovie({ id: 2 })];

      const result = service.filter(movies, 999);

      expect(result.map((m) => m.id)).toEqual([1, 2]);
    });

    it("空のリストに対しては空のリストを返す", () => {
      const result = service.filter([], 1);

      expect(result).toEqual([]);
    });
  });

  // ─── deduplicate ─────────────────────────────────
  describe("deduplicate: 重複IDの映画を除去する", () => {
    it("重複IDがある場合、後に出現した要素で上書きされたユニークなリストを返す", () => {
      const movieA = createMovie({ id: 1, posterPath: "/a.jpg" });
      const movieB = createMovie({ id: 1, posterPath: "/b.jpg" });
      const movieC = createMovie({ id: 2 });

      const result = service.deduplicate([movieA, movieB, movieC]);

      expect(result).toHaveLength(2);
      // Map の後勝ち: id=1 は movieB が残る
      expect(result[0].posterPath).toBe("/b.jpg");
      expect(result[1].id).toBe(2);
    });

    it("重複がない場合、元のリストと同じ要素を返す", () => {
      const movies = [createMovie({ id: 1 }), createMovie({ id: 2 }), createMovie({ id: 3 })];

      const result = service.deduplicate(movies);

      expect(result.map((m) => m.id)).toEqual([1, 2, 3]);
    });

    it("空のリストに対しては空のリストを返す", () => {
      const result = service.deduplicate([]);

      expect(result).toEqual([]);
    });
  });

  // ─── filterMovieWithoutImages ────────────────────
  describe("filterMovieWithoutImages: 画像を持たない映画を除外する", () => {
    it.each([
      {
        scenario: "posterPath・backdropPath 両方あり → 残る",
        posterPath: "/poster.jpg" as string | null,
        backdropPath: "/backdrop.jpg" as string | null,
        shouldRemain: true,
      },
      {
        scenario: "posterPath が null → 除外",
        posterPath: null as string | null,
        backdropPath: "/backdrop.jpg" as string | null,
        shouldRemain: false,
      },
      {
        scenario: "backdropPath が null → 除外",
        posterPath: "/poster.jpg" as string | null,
        backdropPath: null as string | null,
        shouldRemain: false,
      },
      {
        scenario: "両方 null → 除外",
        posterPath: null as string | null,
        backdropPath: null as string | null,
        shouldRemain: false,
      },
    ])("$scenario", ({ posterPath, backdropPath, shouldRemain }) => {
      const movie = createMovie({ id: 1, posterPath, backdropPath });

      const result = service.filterMovieWithoutImages([movie]);

      expect(result).toHaveLength(shouldRemain ? 1 : 0);
    });

    it("空のリストに対しては空のリストを返す", () => {
      const result = service.filterMovieWithoutImages([]);

      expect(result).toEqual([]);
    });
  });
});
