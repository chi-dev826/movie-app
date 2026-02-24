import request from "supertest";
import { createApp } from "../../app";
import { createContainer } from "../../src/container";

// YoutubeRepository をモック化して、APIキーのチェックを無効にする
// createContainer() 内で new YoutubeRepository() されるが、
// モッククラスが使われるため、実際の環境変数チェックは走らない。
jest.mock("../../src/infrastructure/repositories/youtube.repository");

describe("アプリケーション統合", () => {
  // コンテナとアプリを作成（モックリポジトリを使用）
  const container = createContainer();
  const app = createApp(container);

  it("未知のルートにアクセスした場合、404を返すこと", async () => {
    // 1. リクエストの実行
    const res = await request(app).get("/存在しないルート");

    // 2. レスポンスの検証
    expect(res.status).toBe(404);
  });
});
