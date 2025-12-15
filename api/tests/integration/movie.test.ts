import request from "supertest";
import app from "../../app";
import { API_PATHS } from "../../../shared/constants/routes";

describe("アプリケーション統合", () => {
  it("ホームの映画リストを取得できること", async () => {
    // 1. リクエストの実行
    const res = await request(app).get(`/api${API_PATHS.MOVIES.HOME}`); // 'API_PATHS.MOVIES.HOME' は '/movies/home' に対応
    const categories = Object.keys(res.body); // レスポンスのカテゴリを取得

    // 2. レスポンスの検証
    expect(res.statusCode).toEqual(200); // ステータスコードが200であること
    expect(Array.isArray(res.body.popular)).toBe(true); // 'results' が配列であること
    expect(res.body.popular.length).toBeGreaterThan(0); // 'results' 配列が空でないこと

    // 3. 各映画オブジェクトの基本的なプロパティを検証
    for (const category of categories) {
      expect(Array.isArray(res.body[category])).toBe(true); // 各カテゴリが配列であること
      if (category.length > 0) {
        const movie = res.body.popular[0];
        expect(movie).toHaveProperty("id"); // 'id' プロパティが存在すること
        expect(movie).toHaveProperty("title"); // 'title' プロパティが存在すること
        expect(movie).toHaveProperty("poster_path"); // 'poster_path' プロパティが存在すること
        expect(typeof movie.id).toBe("number"); // 'id' が数値であること
        expect(typeof movie.title).toBe("string"); // 'title' が文字列であること
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
