import axios from "axios";
import { EXTERNAL_API_URLS } from "@/infrastructure/constants/external";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

if (!YOUTUBE_API_KEY) {
  throw new Error(
    "YouTube API key is not defined. Please set YOUTUBE_API_KEY in your .env file.",
  );
}

export const youtubeApi = axios.create({
  baseURL: EXTERNAL_API_URLS.YOUTUBE,
});

youtubeApi.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    key: YOUTUBE_API_KEY,
  };
  return config;
});
