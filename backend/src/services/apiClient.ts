import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { Request } from "express";

import {
  MovieDetailJson,
  MovieDetail,
  Movie,
  MovieJson,
  VideosJson,
  SimilarMoviesJson,
  ImagesJson,
} from "@/types/movie";

interface TmdbResponse<T> {
  page: number;
  results: T[];
}

// .env ファイルから環境変数を読み込む
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const API_KEY = process.env.VITE_TMDB_API_KEY;
if (!API_KEY) {
  console.error(
    "TMDB APIキーが設定されていません。.envファイルを確認してください。",
  );
}
const API_BASE_URL = "https://api.themoviedb.org/3";

const formatMovie = (movie: MovieJson): Movie => {
  return {
    id: movie.id,
    backdrop_path: movie.backdrop_path,
    original_title: movie.original_title,
    poster_path: movie.poster_path,
    overview: movie.overview,
  };
};

// 詳細ページ用のデータ整形関数
const formatDetail = (data: MovieDetailJson): MovieDetail => {
  return {
    id: data.id,
    backdrop_path: data.backdrop_path,
    original_title: data.original_title,
    overview: data.overview,
    poster_path: data.poster_path,
    year: data.release_date ? parseInt(data.release_date.slice(0, 4)) : null,
    runtime: data.runtime,
    score: data.vote_average,
    genres: data.genres.map((genre) => genre.name) || null,
    company_logo:
      data.production_companies.length > 0
        ? data.production_companies[0].logo_path
        : null,
  };
};

// 動画データ整形関数(YouTubeのキーを抽出)
const formatvideo = (data: VideosJson): string | null => {
  return (
    data.results.filter(
      (video) => video.site === "YouTube" && video.type === "Trailer",
    )[0]?.key ?? null
  );
};

// 画像データ整形関数(タイトルロゴ画像のパスを抽出)
const formatImage = (data: ImagesJson): string | null => {
  return data.logos.length > 0 ? data.logos[0].file_path : null;
};

// TMDB APIと通信するためのAxiosインスタンスを作成
const tmdbApi = axios.create({
  baseURL: API_BASE_URL, // TMDBのベースURL
  headers: {
    // .envファイルから読み込んだAPIキーを設定
    Authorization: `Bearer ${API_KEY}`,
    Accept: "application/json",
  },
});

// 人気映画を取得する関数
export async function getPopularMovies(req: Request) {
  const response = await tmdbApi.get<TmdbResponse<MovieJson>>(
    "/movie/popular",
    {
      params: req.query,
    },
  );
  const data = response.data.results.map((movie: MovieJson) =>
    formatMovie(movie),
  );
  return data;
}

// 検索した映画を取得する関数
export async function getSearchMovies(req: Request): Promise<Movie[]> {
  const response = await tmdbApi.get<TmdbResponse<MovieJson>>("/search/movie", {
    params: req.query,
  });
  const data = response.data.results.map((movie) => formatMovie(movie));
  return data;
}

// 詳細ページ用のデータ取得関数
export async function getMovieDetails(req: Request) {
  const { movieId } = req.params;
  const [detail, video, similar, image] = await Promise.all([
    tmdbApi.get<MovieDetailJson>("/movie/" + movieId, {
      params: { language: "ja" },
    }),
    tmdbApi.get<VideosJson>("/movie/" + movieId + "/videos", {
      params: { language: "ja" },
    }),
    tmdbApi.get<SimilarMoviesJson>("/movie/" + movieId + "/similar", {
      params: { language: "ja", page: 1 },
    }),
    tmdbApi.get<ImagesJson>("/movie/" + movieId + "/images", {
      params: { language: "ja" },
    }),
  ]);

  const formattedDetail = formatDetail(detail.data);
  const formattedVideo = formatvideo(video.data);
  const formattedImage = formatImage(image.data);

  return {
    detail: formattedDetail,
    video: formattedVideo,
    similar: similar.data.results,
    image: formattedImage,
  };
}
