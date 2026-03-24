import request from "supertest";
import { createApp } from "../../src/app";
import { createContainer } from "../../src/container";
import { API_PATHS } from "../../../shared/constants/routes";

// リポジトリをモック化して、外部APIへの依存を排除する
jest.mock("../../src/infrastructure/repositories/youtube.repository");
jest.mock("../../src/infrastructure/repositories/tmdb.repository", () => {
  return {
    TmdbRepository: jest.fn().mockImplementation(() => ({
      findUpcomingMovies: jest.fn().mockResolvedValue([]),
      findNowPlayingMovies: jest.fn().mockResolvedValue([]),
      findRecentlyAddedMovies: jest.fn().mockResolvedValue([]),
      findTrendingMovies: jest.fn().mockResolvedValue([]),
      getMovieDetails: jest.fn(),
      getMovieImages: jest.fn().mockResolvedValue(null),
      getMovieWatchProviders: jest.fn().mockResolvedValue([]),
      getSimilarMovies: jest.fn().mockResolvedValue([]),
      getCollection: jest.fn(),
    })),
  };
});
jest.mock("../../src/infrastructure/repositories/googleSearch.repository");

describe("アプリケーション統合", () => {
  // コンテナとアプリを作成
  const container = createContainer();
  const app = createApp(container);

  it("ホームの映画リストを取得できること", async () => {
    // 1. リクエストの実行
    const res = await request(app).get(`/api${API_PATHS.HOME}`);
    const body = res.body;

    // 2. レスポンスの検証
    expect(res.statusCode).toEqual(200);
    expect(body).toHaveProperty("hero");
    expect(body).toHaveProperty("upcoming");
    expect(body).toHaveProperty("nowPlaying");
    expect(body).toHaveProperty("recentlyAdded");
    expect(body).toHaveProperty("trending");

    // 3. 各映画リストの基本的な構造を検証
    const categories = ["upcoming", "nowPlaying", "recentlyAdded", "trending"];
    for (const category of categories) {
      const list = body[category];
      expect(Array.isArray(list)).toBe(true);
      if (list.length > 0) {
        const movie = list[0];
        expect(movie).toHaveProperty("id");
        expect(movie).toHaveProperty("title");
        expect(movie).toHaveProperty("poster_path");
        expect(typeof movie.id).toBe("number");
        expect(typeof movie.title).toBe("string");
      }
    }
  });

  // GET /api/movies/:id で存在しないIDにアクセスした場合のテストケース
  it("存在しない映画IDにアクセスした場合、404を返すこと", async () => {
    const nonExistentMovieId = 99999999; // 存在しない映画IDを指定
    const res = await request(app).get(
      `/api${API_PATHS.MOVIE.FULL}/${nonExistentMovieId}`,
    ); // 例： '/api/movies/99999999'
    expect(res.statusCode).toEqual(404); // ステータスコードが404であること
  });
});
