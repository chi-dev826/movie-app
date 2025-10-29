import express, { NextFunction } from "express";
import cors from "cors";
import { Request, Response } from "express";
import {
  fetchMovieDetails,
  fetchSearchMovies,
  fetchMovieList,
  fetchUpcomingMovieList,
} from "./services/apiClient";

const app = express();
const port = 3000;
const HOST = "0.0.0.0";

app.use(
  cors({
    origin: true, // フロントエンドのURLを指定
  }),
);

// エラーハンドリングミドルウェア
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error("Error:", err.message);
  res.status(500).json("Failed to fetch data from TMDB");
});

app.get(
  "/api/movie/:movieId/full",
  async (req: Request, res: Response, next) => {
    try {
      const movies = await fetchMovieDetails(req);
      res.json(movies);
    } catch (error) {
      next(error);
    }
  },
);

// キーワード検索結果を取得するエンドポイント
app.get("/api/search/movie", async (req: Request, res: Response, next) => {
  try {
    const movies = await fetchSearchMovies(req);
    res.json(movies);
  } catch (error) {
    next(error);
  }
});

app.get("/api/movies/home", async (req: Request, res: Response, next) => {
  try {
    const movieList = await fetchMovieList();
    res.json(movieList);
  } catch (error) {
    next(error);
  }
});

app.get("/api/movies/upcoming", async (req: Request, res: Response, next) => {
  try {
    const movieList = await fetchUpcomingMovieList();
    res.json(movieList);
  } catch (error) {
    next(error);
  }
});

// サーバーを起動
app.listen(port, HOST, () => {
  console.log(`サーバーが http://${HOST}:${port} で起動しました。`);
});
