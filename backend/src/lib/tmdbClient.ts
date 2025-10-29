import axios from "axios";
import dotenv from "dotenv";
import path from "path";

// .env ファイルから環境変数を読み込む
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const API_KEY = process.env.VITE_TMDB_API_KEY;
if (!API_KEY) {
  console.error(
    "TMDB APIキーが設定されていません。.envファイルを確認してください。",
  );
}
const API_BASE_URL = "https://api.themoviedb.org/3";

// TMDB APIと通信するためのAxiosインスタンスを作成
export const tmdbApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    Accept: "application/json",
    "Cache-Control": "no-cache",
  },
});
