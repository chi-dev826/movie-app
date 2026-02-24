import axios, { AxiosInstance } from "axios";
import { EXTERNAL_API_URLS } from "../constants/external";

let _youtubeApi: AxiosInstance | null = null;

/**
 * YouTube Data API v3 クライアントのシングルトンインスタンスを取得する関数
 *
 * @returns {AxiosInstance} YouTube APIクライアントのAxiosインスタンス
 *
 * @description
 * この関数は、YouTube Data API v3へのHTTPリクエストを行うためのAxiosインスタンスを返します。
 * インスタンスは一度だけ作成され、その後は同じインスタンスが返されるため、APIキーの管理や接続の最適化に役立ちます。
 *
 * @example
 * const youtubeClient = getYoutubeApi();
 * const response = await youtubeClient.get("/search", { params: { q: "movie trailers" } });
 * console.log(response.data);
 *
 * @error
 * - 環境変数にYouTube APIキーが設定されていない場合は、エラーをスローする（例: "YouTube API key is not defined in environment variables."）
 * - APIリクエストが失敗した場合は、Axiosのエラーがスローされる（例: ネットワークエラーやAPIの障害が発生した場合）
 */
export const getYoutubeApi = (): AxiosInstance => {
  if (_youtubeApi) return _youtubeApi;

  const key = process.env.YOUTUBE_API_KEY;

  if (!key) {
    throw new Error("YouTube API key is not defined in environment variables.");
  }

  _youtubeApi = axios.create({
    baseURL: EXTERNAL_API_URLS.YOUTUBE,
    params: {
      key,
    },
  });

  return _youtubeApi;
};
