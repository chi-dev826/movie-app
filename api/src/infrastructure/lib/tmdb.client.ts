import axios from "axios";
import { EXTERNAL_API_URLS } from "../constants/external";

const API_KEY = process.env.TMDB_API_KEY;
// 起動時にキー不在を警告するが、プロセスは停止しない
// YouTube クライアントとは異なり、TMDB キーは開発環境で未設定のまま
// 部分的なテストを行う場合があるため、起動を許容する
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
