import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { Request, Response } from "express";

import {
  MovieDetailJson,
  VideoItemJson,
  SimilarMoviesJson,
  ImagesJson,
  MovieDetail,
} from "@/types/movie";
import cors from "cors";

export interface VideoItemResponse<T> {
  id: number;
  results: T[];
}

export interface SimilarMoviesResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// .env ファイルから環境変数を読み込む
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const app = express();
const port = process.env.PORT || 3000;

const API_KEY = process.env.VITE_TMDB_API_KEY;
if (!API_KEY) {
  console.error(
    "TMDB APIキーが設定されていません。.envファイルを確認してください。",
  );
}
const API_BASE_URL = "https://api.themoviedb.org/3";

app.use(
  cors({
    origin: "http://localhost:5173", // フロントエンドのURLを指定
  }),
);

// TMDB APIと通信するためのAxiosインスタンスを作成
const tmdbApi = axios.create({
  baseURL: API_BASE_URL, // TMDBのベースURL
  headers: {
    // .envファイルから読み込んだAPIキーを設定
    Authorization: `Bearer ${API_KEY}`,
    Accept: "application/json",
  },
});

async function tmdbRequest(req: Request, res: Response, path: string) {
  try {
    const response = await tmdbApi.get(path, { params: req.query });
    console.log(path, { params: req.query });
    res.json(response.data);
  } catch (error) {
    console.error("TMDBからのデータ取得中にエラーが発生しました:", error);
    res.status(500).json({ message: "Failed to fetch data from TMDB" });
  }
}

// ルートURLへのGETリクエストがあった場合に実行
app.get("/api/movie/popular", async (req, res) => {
  tmdbRequest(req, res, "/movie/popular");
});

app.get("/api/movie/:movieId/full", async (req, res) => {
  try {
    const { movieId } = req.params;
    if (!movieId) {
      return res.status(400).json({ message: "movieId is required" });
    }

    const [details, videos, similar, images] = await Promise.all([
      tmdbApi.get<MovieDetailJson>("/movie/" + movieId, {
        params: { language: "ja" },
      }),
      tmdbApi.get<VideoItemResponse<VideoItemJson>>(
        "/movie/" + movieId + "/videos",
        { params: { language: "ja" } },
      ),
      tmdbApi.get<SimilarMoviesResponse<SimilarMoviesJson>>(
        "/movie/" + movieId + "/similar",
        { params: { language: "ja", page: 1 } },
      ),
      tmdbApi.get<ImagesJson>("/movie/" + movieId + "/images", {
        params: { language: "ja" },
      }),
    ]);

    const formattedDetails: MovieDetail = {
      id: details.data.id,
      backdrop_path: details.data.backdrop_path,
      original_title: details.data.original_title,
      overview: details.data.overview,
      poster_path: details.data.poster_path,
      year: details.data.release_date
        ? parseInt(details.data.release_date.slice(0, 4))
        : null,
      runtime: details.data.runtime,
      score: details.data.vote_average,
      genres: details.data.genres.map((genre) => genre.name) || null,
      company_logo:
        details.data.production_companies.length > 0
          ? details.data.production_companies[0].logo_path
          : null,
    };
    const formattedVideos = videos.data.results.filter(
      (video) => video.site === "YouTube",
    )[0] || { key: "" };
    const formattedImages =
      images.data.logos.length > 0 ? images.data.logos[0].file_path : null;

    res.json({
      details: formattedDetails,
      videos: formattedVideos,
      similar: similar.data.results,
      images: formattedImages,
    });
  } catch (error) {
    console.error("TMDBからのデータ取得中にエラーが発生しました:", error);
    res.status(500).json({ message: "Failed to fetch data from TMDB" });
  }
});

// キーワード検索結果を取得するエンドポイント
app.get("/api/search/movie", async (req, res) => {
  tmdbRequest(req, res, "/search/movie");
});

// サーバーを起動
app.listen(port, () => {
  console.log(`サーバーが http://localhost:${port} で起動しました。`);
});
