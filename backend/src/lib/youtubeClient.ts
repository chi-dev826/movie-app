import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

if (!YOUTUBE_API_KEY) {
  throw new Error(
    "YouTube API key is not defined. Please set YOUTUBE_API_KEY in your .env file.",
  );
}

export const youtubeApi = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3",
});

youtubeApi.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    key: YOUTUBE_API_KEY,
  };
  return config;
});
