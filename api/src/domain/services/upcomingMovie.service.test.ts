import { UpcomingMovieService } from "./upcomingMovie.service";
import { MovieEntity } from "../models/movie";
import { IClock } from "../repositories/clock.service.interface";

// IClock をモック化
const mockClock = {
  now: jest.fn(),
} as jest.Mocked<IClock>;

describe("UpcomingMovieService", () => {
  let service: UpcomingMovieService;

  beforeEach(() => {
    mockClock.now.mockReturnValue(new Date("2024-06-01T00:00:00Z"));
    service = new UpcomingMovieService(mockClock);
  });

  describe("sort", () => {
    it("空の配列が渡された場合、空の配列を返す", () => {
      const movies: MovieEntity[] = [];
      const result = service.sort(movies);
      expect(result).toEqual([]);
    });

    it("1つの映画が渡された場合、同じ配列を返す", () => {
      const movie: MovieEntity = {
        id: 1,
        title: "テスト映画",
        releaseDate: "2023-01-01",
      } as MovieEntity;
      const movies = [movie];
      const result = service.sort(movies);
      expect(result).toEqual(movies);
    });

    it("すべての映画に公開日がある場合、日付順にソートする", () => {
      const movie1: MovieEntity = {
        id: 1,
        title: "映画1",
        releaseDate: "2023-03-01",
      } as MovieEntity;
      const movie2: MovieEntity = {
        id: 2,
        title: "映画2",
        releaseDate: "2023-01-01",
      } as MovieEntity;
      const movie3: MovieEntity = {
        id: 3,
        title: "映画3",
        releaseDate: "2023-02-01",
      } as MovieEntity;
      const movies = [movie1, movie2, movie3];
      const result = service.sort(movies);
      expect(result).toEqual([movie2, movie3, movie1]); // 日付順
    });

    it("公開日が null の映画は末尾に配置する", () => {
      const movie1: MovieEntity = {
        id: 1,
        title: "映画1",
        releaseDate: "2023-01-01",
      } as MovieEntity;
      const movie2: MovieEntity = {
        id: 2,
        title: "映画2",
        releaseDate: null,
      } as MovieEntity;
      const movie3: MovieEntity = {
        id: 3,
        title: "映画3",
        releaseDate: "2023-02-01",
      } as MovieEntity;
      const movies = [movie1, movie2, movie3];
      const result = service.sort(movies);
      expect(result).toEqual([movie1, movie3, movie2]); // null は末尾
    });

    it("複数の null を含む場合、正しくソートする", () => {
      const movie1: MovieEntity = {
        id: 1,
        title: "映画1",
        releaseDate: null,
      } as MovieEntity;
      const movie2: MovieEntity = {
        id: 2,
        title: "映画2",
        releaseDate: "2023-01-01",
      } as MovieEntity;
      const movie3: MovieEntity = {
        id: 3,
        title: "映画3",
        releaseDate: null,
      } as MovieEntity;
      const movie4: MovieEntity = {
        id: 4,
        title: "映画4",
        releaseDate: "2023-03-01",
      } as MovieEntity;
      const movies = [movie1, movie2, movie3, movie4];
      const result = service.sort(movies);
      expect(result).toEqual([movie2, movie4, movie1, movie3]); // 日付順 + 複数の null は末尾
    });

    it("同じ公開日の映画は元の順序を維持する", () => {
      const movie1: MovieEntity = {
        id: 1,
        title: "映画1",
        releaseDate: "2023-01-01",
      } as MovieEntity;
      const movie2: MovieEntity = {
        id: 2,
        title: "映画2",
        releaseDate: "2023-01-01",
      } as MovieEntity;
      const movie3: MovieEntity = {
        id: 3,
        title: "映画3",
        releaseDate: "2023-01-01",
      } as MovieEntity;
      const movies = [movie1, movie2, movie3];
      const result = service.sort(movies);
      expect(result).toEqual([movie1, movie2, movie3]); // 安定ソート
    });
  });

  describe("getJstToday", () => {
    it("JST基準の今日の日付（時刻なし）を返す", () => {
      // モックの日時を JST の 2024-06-01 15:30:00 に設定（UTC では 2024-06-01 06:30:00）
      mockClock.now.mockReturnValue(new Date("2024-06-01T06:30:00Z"));
      const result = service.getJstToday();
      expect(result.toISOString().split("T")[0]).toBe("2024-06-01"); // JST の日付
      expect(result.getUTCHours()).toBe(0); // 時刻は 00:00:00
    });
  });
});
