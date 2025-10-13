import express, { NextFunction } from "express";
import cors from "cors";
import { Request, Response } from "express";
import {
  getMovieDetails,
  getPopularMovies,
  getSearchMovies,
} from "./services/apiClient";

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:5173", // フロントエンドのURLを指定
  }),
);

// エラーハンドリングミドルウェア
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error("Error:", err.message);
  res.status(500).json("Failed to fetch data from TMDB");
});

// ルートURLへのGETリクエストがあった場合に実行
app.get("/api/movie/popular", async (req: Request, res: Response, next) => {
  try {
    const movies = await getPopularMovies(req);
    res.json(movies);
  } catch (error) {
    next(error);
  }
});

app.get(
  "/api/movie/:movieId/full",
  async (req: Request, res: Response, next) => {
    try {
      const movies = await getMovieDetails(req);
      res.json(movies);
    } catch (error) {
      next(error);
    }
  },
);

// キーワード検索結果を取得するエンドポイント
app.get("/api/search/movie", async (req: Request, res: Response, next) => {
  try {
    const movies = await getSearchMovies(req);
    res.json(movies);
  } catch (error) {
    next(error);
  }
});

// サーバーを起動
app.listen(port, () => {
  console.log(`サーバーが http://localhost:${port} で起動しました。`);
});
