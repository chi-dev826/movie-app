import request from "supertest";
import app from "../../app";

describe("アプリケーション統合", () => {
  it("未知のルートにアクセスした場合、404を返すこと", async () => {
    const res = await request(app).get("/存在しないルート");
    expect(res.status).toBe(404);
  });
});
