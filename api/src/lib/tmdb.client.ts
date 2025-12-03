import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { EXTERNAL_API_URLS } from "../constants/external";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const API_KEY = process.env.VITE_TMDB_API_KEY;
if (!API_KEY) {
  console.error(
    "TMDB APIキーが設定されていません。.envファイルを確認してください。",
  );
}
const API_BASE_URL = EXTERNAL_API_URLS.TMDB;

export const tmdbApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    Accept: "application/json",
    "Cache-Control": "no-cache",
  },
  params: {
    language: "ja-JP",
    include_adult: false,
  },
});
